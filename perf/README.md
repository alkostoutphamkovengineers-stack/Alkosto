Perf tests for Alkosto_HamKov-Engineers

This folder contains simple k6 and JMeter templates to simulate "typing" into the site's search field. They repeatedly call the backend search endpoint with incremental prefixes to mimic a user typing and the live search behavior.

k6
---
Files:
- k6/search_typing.js  -- k6 script that picks a term and calls /products/search for each prefix of the term
- k6/env.json          -- example environment variables (BASE_URL, SEARCH_TERMS)

Run example (local):
- Install k6: https://k6.io/docs/getting-started/installation
- From the repo root run:
    BASE_URL=http://localhost:3000 k6 run perf/k6/search_typing.js

You can also override SEARCH_TERMS with a comma-separated list of terms:
    BASE_URL=http://localhost:3000 SEARCH_TERMS="iphone,samsung,xiaomi" k6 run perf/k6/search_typing.js

JMeter
------
Files:
- jmeter/search_typing.jmx  -- basic test plan template. It expects a CSV file `search_terms.csv` in the same folder with a headerless list of terms or a single column named `term`.

Run example:
- Open the .jmx in JMeter GUI, point the CSV Data Set filename to perf/jmeter/search_terms.csv, set BASE_URL as a user-defined variable if needed, and run.

Notes / Recommendations
- Ensure the backend endpoints used by these tests are rate-limited/protected when running heavy load in shared environments.
- For realistic tests, seed SEARCH_TERMS with common product prefixes (from production logs) and add think-times or user session modeling.
- Watch these k6 metrics: http_req_duration (p95), http_req_failed (rate), and http_reqs (throughput).

