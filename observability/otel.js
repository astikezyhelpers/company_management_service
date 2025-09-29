// observability/otel.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { createRequire } from 'module';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Use createRequire for CommonJS modules
const require = createRequire(import.meta.url);

// Import the correct functions from resources
const { resourceFromAttributes } = require('@opentelemetry/resources');
const semanticModule = require('@opentelemetry/semantic-conventions');

const serviceName = process.env.OTEL_SERVICE_NAME || 'company-management-service';
const tempoEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://tempo:4318';

const traceExporter = new OTLPTraceExporter({
  url: `${tempoEndpoint}/v1/traces`,
});

// Create resource using the correct function
const resource = resourceFromAttributes({
  'service.name': serviceName,
  'deployment.environment': process.env.NODE_ENV || 'development',
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-prisma': { enabled: true },
    }),
  ],
});

export async function startOtel() {
  try {
    await sdk.start();
    console.log('OpenTelemetry SDK started successfully.');
  } catch (err) {
    console.error('Failed to start OpenTelemetry SDK:', err);
  }

  const shutdown = async () => {
    try {
      await sdk.shutdown();
      console.log('OpenTelemetry SDK shut down gracefully.');
      process.exit(0);
    } catch (err) {
      console.error('Error during OpenTelemetry SDK shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}