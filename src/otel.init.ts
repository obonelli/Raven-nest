/**
 * OpenTelemetry (Splunk Observability) initialization
 * ---------------------------------------------------
 * This file must be imported BEFORE NestJS or any other module that loads HTTP,
 * database, or async context. It enables auto-instrumentation for all core libs
 * (HTTP, Express, TypeORM, etc.) and exports telemetry data to Splunk.
 *
 * Usage:
 *   import './otel.init'; // <- must be the first import in main.ts
 */

require('@splunk/otel').start({
    serviceName: process.env.OTEL_SERVICE_NAME || 'raven-nest',

    // Tag additional metadata (optional)
    // e.g., deployment.environment=dev, owner=backend-team
    // Comma-separated key=value list
    // OTEL_RESOURCE_ATTRIBUTES env variable overrides this at runtime
    resourceAttributes: {
        'deployment.environment': process.env.NODE_ENV || 'development',
        'service.version': process.env.npm_package_version || '1.0.0',
    },

    // Logging level (error | warn | info | debug)
    logLevel: process.env.OTEL_LOG_LEVEL || 'info',

    // If using Splunk Observability Cloud (SaaS):
    // Provide SPLUNK_ACCESS_TOKEN and SPLUNK_REALM in .env
    // Example:
    // SPLUNK_ACCESS_TOKEN=your-token
    // SPLUNK_REALM=us1

    // If using a self-hosted OTel Collector:
    // Define OTEL_EXPORTER_OTLP_ENDPOINT in .env
    // Example:
    // OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
});
