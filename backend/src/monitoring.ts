import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { Express } from "express";

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Set SENTRY_DSN environment variable to enable
 */
export const initSentry = (app: Express) => {
  if (!process.env.SENTRY_DSN) {
    console.warn("⚠️  SENTRY_DSN not set - error tracking disabled");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    integrations: [
      // Enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // Enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      // Enable profiling
      new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Don't send errors in development
    enabled: process.env.NODE_ENV === "production",
    // Scrub sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      // Remove sensitive query params
      if (typeof event.request?.query_string === 'string') {
        const sanitized = event.request.query_string
          .replace(/api_key=[^&]*/gi, "api_key=[REDACTED]")
          .replace(/token=[^&]*/gi, "token=[REDACTED]");
        event.request.query_string = sanitized;
      }
      return event;
    },
  });

  console.log("✅ Sentry initialized for error tracking");
};

/**
 * Sentry request handler - must be first middleware
 */
export const sentryRequestHandler = () => Sentry.Handlers.requestHandler();

/**
 * Sentry tracing handler - after request handler
 */
export const sentryTracingHandler = () => Sentry.Handlers.tracingHandler();

/**
 * Sentry error handler - must be before other error handlers
 */
export const sentryErrorHandler = () => Sentry.Handlers.errorHandler();

/**
 * Capture exception manually
 */
export const captureException = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Capture message manually
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
) => {
  Sentry.captureMessage(message, level);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, data?: any) => {
  Sentry.addBreadcrumb({
    message,
    data,
    level: "info",
  });
};
