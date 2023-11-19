/**
 * Sentry initialization
 * @link https://docs.sentry.io/platforms/node/
 */

import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
    dsn: 'https://b629580048bf3eedb3816bc03a5845d3@o4506251921522688.ingest.sentry.io/4506251924799488',
    integrations: [
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});
