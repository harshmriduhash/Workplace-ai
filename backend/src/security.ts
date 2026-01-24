import helmet from 'helmet';
import { Express } from 'express';

/**
 * Security middleware configuration using Helmet
 * Protects against common web vulnerabilities
 */
export const configureSecurityHeaders = (app: Express) => {
  // Apply Helmet with custom configuration
  app.use(helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for React
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", process.env.VERCEL_URL || '*'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    // Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    // Prevent clickjacking
    frameguard: {
      action: 'deny'
    },
    // Prevent MIME type sniffing
    noSniff: true,
    // XSS Protection
    xssFilter: true,
    // Hide X-Powered-By header
    hidePoweredBy: true,
    // Referrer Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  }));

  console.log('✅ Security headers configured');
};

/**
 * Additional security middleware
 */
export const additionalSecurityMiddleware = (req: any, res: any, next: any) => {
  // Prevent caching of sensitive endpoints
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};
