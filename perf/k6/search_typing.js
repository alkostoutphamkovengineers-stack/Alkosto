import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SEARCH_TERMS = (__ENV.SEARCH_TERMS || 'a,al,ala,alar,alarc,alarco').split(',');

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

const reqTrend = new Trend('req_duration');

function simulateTypingAndSearch(term) {
  let prefix = '';
  for (let i = 0; i < term.length; i++) {
    prefix += term[i];
    const res = http.get(`${BASE_URL}/products/search?productName=${encodeURIComponent(prefix)}`);
    reqTrend.add(res.timings.duration);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(Math.random() * 0.2 + 0.05);
  }
}

export default function () {
  const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
  simulateTypingAndSearch(term);
  sleep(Math.random() * 2 + 0.5);
}
