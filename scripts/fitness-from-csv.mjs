/**
 * Aggregate a Garmin Connect Activities.csv export into src/content/fitness.json.
 *
 * Usage:
 *   node scripts/fitness-from-csv.mjs <path/to/Activities.csv> [--month=YYYY-MM]
 *   npm run fitness -- ~/Downloads/Activities.csv
 *
 * Defaults to the current month. Publishes AGGREGATES ONLY — activity titles
 * (which contain locations) and individual dates never leave this script.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const OUT = 'src/content/fitness.json';

const args = process.argv.slice(2);
const csvPath = args.find(a => !a.startsWith('--'));
const monthArg = args.find(a => a.startsWith('--month='))?.slice(8);
if (!csvPath) {
	console.error('Usage: node scripts/fitness-from-csv.mjs <Activities.csv> [--month=YYYY-MM]');
	process.exit(1);
}
const month = monthArg ?? new Date().toISOString().slice(0, 7);
if (!/^\d{4}-\d{2}$/.test(month)) {
	console.error(`Bad --month value "${month}" — expected YYYY-MM`);
	process.exit(1);
}

// Minimal CSV parser (handles quoted fields containing commas)
function parseCsv(text) {
	const rows = [];
	let row = [], field = '', inQuotes = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (inQuotes) {
			if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
			else if (c === '"') inQuotes = false;
			else field += c;
		} else if (c === '"') inQuotes = true;
		else if (c === ',') { row.push(field); field = ''; }
		else if (c === '\n' || c === '\r') {
			if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
		} else field += c;
	}
	if (field !== '' || row.length) { row.push(field); rows.push(row); }
	return rows;
}

const num = (s) => {
	const n = parseFloat(String(s ?? '').replace(/,/g, ''));
	return Number.isFinite(n) ? n : 0;
};

const hoursFrom = (hms) => {
	const m = String(hms ?? '').match(/^(\d+):(\d{2}):(\d{2})/);
	return m ? (+m[1] + m[2] / 60 + m[3] / 3600) : 0;
};

const rows = parseCsv(readFileSync(csvPath, 'utf8'));
const header = rows[0];
const col = (name) => header.indexOf(name);
const iDate = col('Date'), iDist = col('Distance'), iCal = col('Calories'),
	iSteps = col('Steps'), iMoving = col('Moving Time'), iTime = col('Time');
if (iDate < 0 || iDist < 0) {
	console.error('Unrecognised CSV — expected Garmin Connect activity export columns');
	process.exit(1);
}

const acts = rows.slice(1).filter(r => String(r[iDate]).startsWith(month));
if (acts.length === 0) {
	console.error(`No activities found for ${month} in ${csvPath} — nothing written`);
	process.exit(1);
}

const round1 = (n) => Math.round(n * 10) / 10;
const stats = {
	updated: new Date().toISOString().slice(0, 10),
	month: {
		label: month,
		km: round1(acts.reduce((s, r) => s + num(r[iDist]), 0)),
		hours: round1(acts.reduce((s, r) => s + hoursFrom(r[iMoving] || r[iTime]), 0)),
		activities: acts.length,
		kcal: Math.round(acts.reduce((s, r) => s + num(r[iCal]), 0)),
		steps: Math.round(acts.reduce((s, r) => s + num(r[iSteps]), 0)) || null,
	},
};

writeFileSync(OUT, JSON.stringify(stats, null, '\t') + '\n');
console.log(`wrote ${OUT} — ${month}: ${stats.month.km} km, ${stats.month.hours} h, ${stats.month.activities} activities, ${stats.month.kcal} kcal, ${stats.month.steps ?? '—'} steps`);
