# Fitness stats (Garmin CSV → /now)

The "Moving" block on `/now` reads `src/content/fitness.json`, which is
generated locally from a Garmin Connect activity export. Aggregates only —
activity titles (they contain locations), dates, and routes never leave the
script.

## Monthly ritual (~2 min, alongside the /now update)

1. Garmin Connect → Activities → All Activities → Export CSV.
2. ```sh
   npm run fitness -- ~/Downloads/Activities.csv
   ```
   Defaults to the current month; for a completed month:
   ```sh
   npm run fitness -- ~/Downloads/Activities.csv --month=2026-07
   ```
3. Check the printed summary, commit `src/content/fitness.json`, push.

The block hides itself if `updated` is null, so the site never shows stale
zeros. If Garmin ever changes the export columns, the script fails loudly
rather than writing wrong numbers.
