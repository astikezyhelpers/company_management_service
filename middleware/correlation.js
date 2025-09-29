// middleware/correlation.js
import { v4 as uuidv4 } from 'uuid';
import { context, trace } from '@opentelemetry/api';

export function correlationMiddleware(req, res, next) {
  const existing = req.headers['x-correlation-id'];
  const correlationId = existing || uuidv4();
  res.setHeader('x-correlation-id', correlationId);
  req.correlationId = correlationId;

  // also expose active trace id to app code
  const span = trace.getSpan(context.active());
  req.traceId = span?.spanContext()?.traceId;
  next();
}