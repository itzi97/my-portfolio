# Fitness stats pipeline (Strava → /now)

Nightly GitHub Action pulls **aggregates only** (month/week distance, time,
activity count, calories) from Strava into `src/content/fitness.json`. The
commit triggers the Cloudflare Pages rebuild. `/now` shows the block only once
`updated` is non-null. No individual activities, routes, or timestamps are ever
published.

## One-time setup (≈15 min)

### 1. Garmin → Strava sync
In Garmin Connect: Settings → Connected Apps → connect Strava (skip if already
syncing).

### 2. Create a Strava API app
https://www.strava.com/settings/api → create app. Any name/website;
Authorization Callback Domain: `localhost`. Note the **Client ID** and
**Client Secret**.

### 3. Get a refresh token (one-time OAuth dance)
Open this in a browser (replace `CLIENT_ID`):

```
https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=activity:read_all
```

Approve. The browser lands on an unreachable `http://localhost/?code=XXXX...`
page — copy the `code` value from the URL bar. Then:

```sh
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=CLIENT_ID \
  -d client_secret=CLIENT_SECRET \
  -d code=XXXX \
  -d grant_type=authorization_code
```

The JSON response contains `refresh_token` — that's the one to keep.

### 4. Add repo secrets
GitHub repo → Settings → Secrets and variables → Actions → New repository
secret, three times:

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN`

### 5. Test
Actions tab → `fitness-stats` → Run workflow. Check the run log, then confirm
`src/content/fitness.json` has real numbers and `/now` shows the block.

## Notes

- The schedule only fires on the default branch — the pipeline goes live when
  `personal-site` merges to `main`.
- If the workflow ever starts failing with 401s, redo step 3 (the refresh
  token was invalidated, e.g. by re-authorizing the app).
- Calories need one API call per activity (capped at 60/month in the script);
  if the cap is exceeded the kcal figure is omitted rather than published wrong.
- Local test: `STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=... STRAVA_REFRESH_TOKEN=... node scripts/fetch-strava-stats.mjs`
