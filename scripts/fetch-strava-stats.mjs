/**
 * Fetch aggregate fitness stats from Strava and write src/content/fitness.json.
 *
 * Publishes AGGREGATES ONLY (month/week totals) — never individual activities,
 * routes, or timestamps. See docs/FITNESS.md for setup.
 *
 * Required env vars: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN
 */

import { writeFileSync } from 'node:fs';

const API = 'https://www.strava.com/api/v3';
const OUT = 'src/content/fitness.json';
const CALORIE_DETAIL_CAP = 60; // stay well under Strava rate limits

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;
if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
	console.error('Missing STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET / STRAVA_REFRESH_TOKEN');
	process.exit(1);
}

async function getAccessToken() {
	const res = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: STRAVA_CLIENT_ID,
			client_secret: STRAVA_CLIENT_SECRET,
			refresh_token: STRAVA_REFRESH_TOKEN,
			grant_type: 'refresh_token',
		}),
	});
	if (!res.ok) throw new Error(`token refresh failed: ${res.status} ${await res.text()}`);
	return (await res.json()).access_token;
}

function startOfMonthUTC(now) {
	return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1000;
}

function startOfWeekUTC(now) {
	// Monday 00:00 UTC
	const day = now.getUTCDay() || 7;
	return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (day - 1)) / 1000;
}

function aggregate(activities) {
	const km = activities.reduce((s, a) => s + (a.distance ?? 0), 0) / 1000;
	const hours = activities.reduce((s, a) => s + (a.moving_time ?? 0), 0) / 3600;
	return {
		km: Math.round(km * 10) / 10,
		hours: Math.round(hours * 10) / 10,
		activities: activities.length,
	};
}

const token = await getAccessToken();
const auth = { Authorization: `Bearer ${token}` };
const now = new Date();

const after = startOfMonthUTC(now);
const res = await fetch(`${API}/athlete/activities?after=${after}&per_page=200`, { headers: auth });
if (!res.ok) throw new Error(`activities fetch failed: ${res.status} ${await res.text()}`);
const monthActs = await res.json();

const weekStart = startOfWeekUTC(now);
const weekActs = monthActs.filter(a => new Date(a.start_date).getTime() / 1000 >= weekStart);

// Calories only exist on the detailed activity endpoint — fetch per activity, capped.
let kcal = 0;
let kcalOk = true;
for (const a of monthActs.slice(0, CALORIE_DETAIL_CAP)) {
	try {
		const d = await fetch(`${API}/activities/${a.id}`, { headers: auth });
		if (!d.ok) throw new Error(String(d.status));
		kcal += (await d.json()).calories ?? 0;
	} catch {
		kcalOk = false;
		break;
	}
}
if (monthActs.length > CALORIE_DETAIL_CAP) kcalOk = false;

const stats = {
	updated: now.toISOString().slice(0, 10),
	month: { ...aggregate(monthActs), kcal: kcalOk ? Math.round(kcal) : null },
	week: aggregate(weekActs),
};

writeFileSync(OUT, JSON.stringify(stats, null, '\t') + '\n');
console.log('wrote', OUT, JSON.stringify(stats));
