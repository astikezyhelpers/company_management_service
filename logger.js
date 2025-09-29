import { createLogger, format, transports } from 'winston';
import { trace, context } from '@opentelemetry/api';

const { combine, timestamp, json } = format;

const addTraceContext = format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const sc = span.spanContext();
    info.trace_id = sc.traceId;
    info.span_id = sc.spanId;
  }
  return info;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), addTraceContext(), json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error', maxsize: 10 * 1024 * 1024, maxFiles: 5 }),
    new transports.File({ filename: 'combined.log', maxsize: 20 * 1024 * 1024, maxFiles: 10 }),
  ],
  exceptionHandlers: [new transports.File({ filename: 'exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'rejections.log' })],
});

export default logger;