// middleware/metrics.js
import client from 'prom-client';

// Default metrics for runtime, event loop, GC
client.collectDefaultMetrics({ prefix: 'cms_' });

// Histograms for latency
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  // tune buckets to your latency SLO
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

// Counters for errors
export const httpRequestErrorsTotal = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of error responses',
  labelNames: ['method', 'route', 'status_code']
});

// In-flight requests
export const httpRequestsInFlight = new client.Gauge({
  name: 'http_requests_in_flight',
  help: 'Number of HTTP requests in flight'
});

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  httpRequestsInFlight.inc();

  res.on('finish', () => {
    const diff = Number(process.hrtime.bigint() - start);
    const seconds = diff / 1e9;
    const route = req.route?.path || req.originalUrl || 'unknown';
    httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(seconds);

    if (res.statusCode >= 500) {
      httpRequestErrorsTotal.labels(req.method, route, String(res.statusCode)).inc();
    }
    httpRequestsInFlight.dec();
  });

  next();
}

export async function metricsHandler(req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}