import { Registry, Counter, Histogram } from 'prom-client';

const register = new Registry();

const urlsShortenedCounter = new Counter({
  name: 'urls_shortened_total',
  help: 'Total number of URLs shortened',
  registers: [register]
});

const successfulRedirectsCounter = new Counter({
  name: 'successful_redirects_total',
  help: 'Total number of successful redirects',
  registers: [register]
});

const failedLookupsCounter = new Counter({
  name: 'failed_lookups_total',
  help: 'Total number of failed lookups (404s)',
  registers: [register]
});

const requestLatencyHistogram = new Histogram({
  name: 'request_latency_ms',
  help: 'Request latency in milliseconds',
  buckets: [10, 50, 100, 200, 500, 1000, 2000],
  registers: [register]
});

export const metricsService = {
  incrementUrlsShortened: () => urlsShortenedCounter.inc(),
  incrementSuccessfulRedirects: () => successfulRedirectsCounter.inc(),
  incrementFailedLookups: () => failedLookupsCounter.inc(),
  recordLatency: (latency: number) => requestLatencyHistogram.observe(latency),
  getMetrics: () => register.metrics(),
  getRegistry: () => register,
  getCounterValue: (name: string) => {
    const metric = register.getSingleMetric(name);
    return metric ? (metric as any).hashMap[''].value : 0;
  },
  getHistogramStats: () => {
    const metrics = requestLatencyHistogram as any;
    const sum = metrics.hashMap[''].sum || 0;
    const count = metrics.hashMap[''].count || 0;
    return {
      average: count > 0 ? sum / count : 0,
      count
    };
  }
};