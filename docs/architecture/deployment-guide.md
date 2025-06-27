# 🚀 Deployment Guide - Produção Premium

> **Guia completo para deploy de aplicações Next.js modernas em produção**

---

## 🆘 **Deploy Troubleshooting**

> **⚠️ Problemas Comuns:** Se você está enfrentando falhas de deploy, consulte nossa seção de troubleshooting específica.

### 🔧 **Problemas Mais Frequentes**

| Problema                      | Sintoma                      | Solução Rápida                                            |
| ----------------------------- | ---------------------------- | --------------------------------------------------------- |
| **Conflitos de Dependências** | `ERESOLVE could not resolve` | [Ver Vercel Fix Guide](../deployment/vercel-fix-guide.md) |
| **React Version Mismatch**    | `peer react@">=16.8.0"`      | Downgrade para React 18.3.1                               |
| **Build Memory Error**        | `heap out of memory`         | Aumentar Node memory limit                                |
| **TypeScript Errors**         | `Type checking failed`       | Verificar tipos e dependencies                            |

### 📋 **Quick Fix Checklist**

```bash
# 1. Limpeza completa
rm -rf .next node_modules package-lock.json

# 2. Reinstalação
npm install

# 3. Teste local
npm run build

# 4. Se ainda falhar, consulte:
# docs/deployment/vercel-fix-guide.md
```

### 🔗 **Links Úteis para Debug**

-   [📖 Vercel Fix Guide Completo](../deployment/vercel-fix-guide.md)
-   [🛠️ Next.js Deploy Troubleshooting](https://nextjs.org/docs/deployment#troubleshooting)
-   [📊 Vercel Build Logs](https://vercel.com/docs/deployments/troubleshoot)

---

## 🎯 **Visão Geral**

Este guia cobre todas as etapas para colocar sua aplicação premium em produção:

-   **Build otimizado** para performance máxima
-   **Deploy em diferentes plataformas** (Vercel, AWS, Docker)
-   **CI/CD pipelines** automatizados
-   **Monitoramento** e observabilidade
-   **Segurança** e best practices

---

## 🔧 **Preparação para Produção**

### 📦 **Build Configuration**

```javascript
// next.config.js - Configuração otimizada para produção
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Otimizações básicas
    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.js",
                },
            },
        },
    },

    // Compressão e otimização
    compress: true,
    poweredByHeader: false,

    // Headers de segurança
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },

    // Redirects e rewrites
    async redirects() {
        return [
            {
                source: "/home",
                destination: "/",
                permanent: true,
            },
        ];
    },

    // Otimização de imagens
    images: {
        domains: ["cdn.example.com"],
        formats: ["image/webp", "image/avif"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Bundle analysis
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Análise de bundle em produção
        if (!dev && !isServer) {
            config.plugins.push(
                new webpack.DefinePlugin({
                    "process.env.BUILD_ID": JSON.stringify(buildId),
                })
            );
        }

        return config;
    },
};

module.exports = nextConfig;
```

### 🎨 **Otimização de CSS**

```css
/* app/globals.css - Otimizações para produção */

/* Critical CSS inline - apenas estilos above-the-fold */
.critical-styles {
    /* Styles que aparecem imediatamente */
}

/* Lazy load non-critical CSS */
@media print {
    .non-critical {
        /* Styles não críticos */
    }
}

/* Preload fonts importantes */
@font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    font-display: swap; /* Importante para CLS */
    src: url("/fonts/inter-regular.woff2") format("woff2");
}

/* Otimizações de animação para dispositivos lentos */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Otimizações para dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        color-scheme: dark;
    }
}
```

### 📱 **PWA Configuration**

```javascript
// next.config.js - PWA setup
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
                cacheName: "google-fonts",
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
            },
        },
        {
            urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "static-font-assets",
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
            },
        },
    ],
});

module.exports = withPWA(nextConfig);
```

---

## 🏗️ **CI/CD Pipeline**

### 🔄 **GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

env:
    NODE_VERSION: "18"
    PNPM_VERSION: "8"

jobs:
    test:
        name: Test & Lint
        runs-on: ubuntu-latest

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: ${{ env.NODE_VERSION }}

            - name: Setup pnpm
              uses: pnpm/action-setup@v2
              with:
                  version: ${{ env.PNPM_VERSION }}

            - name: Get pnpm store directory
              shell: bash
              run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

            - name: Setup pnpm cache
              uses: actions/cache@v3
              with:
                  path: ${{ env.STORE_PATH }}
                  key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
                  restore-keys: |
                      ${{ runner.os }}-pnpm-store-

            - name: Install dependencies
              run: pnpm install --frozen-lockfile

            - name: Run type check
              run: pnpm type-check

            - name: Run linting
              run: pnpm lint

            - name: Run unit tests
              run: pnpm test:ci

            - name: Upload coverage reports
              uses: codecov/codecov-action@v3
              with:
                  file: ./coverage/lcov.info
                  flags: unittests

    e2e:
        name: E2E Tests
        runs-on: ubuntu-latest
        needs: test

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: ${{ env.NODE_VERSION }}

            - name: Setup pnpm
              uses: pnpm/action-setup@v2
              with:
                  version: ${{ env.PNPM_VERSION }}

            - name: Install dependencies
              run: pnpm install --frozen-lockfile

            - name: Install Playwright browsers
              run: pnpm playwright install --with-deps

            - name: Build application
              run: pnpm build

            - name: Run E2E tests
              run: pnpm test:e2e

            - name: Upload test results
              uses: actions/upload-artifact@v3
              if: failure()
              with:
                  name: playwright-report
                  path: playwright-report/
                  retention-days: 30

    build:
        name: Build Application
        runs-on: ubuntu-latest
        needs: [test, e2e]

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: ${{ env.NODE_VERSION }}

            - name: Setup pnpm
              uses: pnpm/action-setup@v2
              with:
                  version: ${{ env.PNPM_VERSION }}

            - name: Install dependencies
              run: pnpm install --frozen-lockfile

            - name: Build application
              run: pnpm build
              env:
                  NEXT_TELEMETRY_DISABLED: 1

            - name: Export static files (if applicable)
              run: pnpm export
              if: env.DEPLOY_TARGET == 'static'

            - name: Upload build artifacts
              uses: actions/upload-artifact@v3
              with:
                  name: build-files
                  path: |
                      .next/
                      out/
                  retention-days: 7

    deploy-vercel:
        name: Deploy to Vercel
        runs-on: ubuntu-latest
        needs: build
        if: github.ref == 'refs/heads/main'

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Deploy to Vercel
              uses: amondnet/vercel-action@v25
              with:
                  vercel-token: ${{ secrets.VERCEL_TOKEN }}
                  vercel-org-id: ${{ secrets.ORG_ID }}
                  vercel-project-id: ${{ secrets.PROJECT_ID }}
                  vercel-args: "--prod"

    deploy-aws:
        name: Deploy to AWS
        runs-on: ubuntu-latest
        needs: build
        if: github.ref == 'refs/heads/main' && env.DEPLOY_TARGET == 'aws'

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Configure AWS credentials
              uses: aws-actions/configure-aws-credentials@v4
              with:
                  aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
                  aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                  aws-region: us-east-1

            - name: Download build artifacts
              uses: actions/download-artifact@v3
              with:
                  name: build-files

            - name: Deploy to S3
              run: |
                  aws s3 sync ./out s3://${{ secrets.S3_BUCKET }} --delete
                  aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

### 🐳 **Docker Configuration**

```dockerfile
# Dockerfile - Multi-stage build otimizado
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build application
RUN corepack enable pnpm && pnpm build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml - Para desenvolvimento e staging
version: "3.8"

services:
    app:
        build: .
        ports:
            - "3000:3000"
        environment:
            - NODE_ENV=production
            - DATABASE_URL=postgresql://user:pass@db:5432/poker_app
        depends_on:
            - db
            - redis
        networks:
            - app-network

    db:
        image: postgres:15-alpine
        environment:
            - POSTGRES_USER=user
            - POSTGRES_PASSWORD=pass
            - POSTGRES_DB=poker_app
        volumes:
            - postgres_data:/var/lib/postgresql/data
        networks:
            - app-network

    redis:
        image: redis:7-alpine
        command: redis-server --appendonly yes
        volumes:
            - redis_data:/data
        networks:
            - app-network

    nginx:
        image: nginx:alpine
        ports:
            - "80:80"
            - "443:443"
        volumes:
            - ./nginx.conf:/etc/nginx/nginx.conf
            - ./ssl:/etc/nginx/ssl
        depends_on:
            - app
        networks:
            - app-network

volumes:
    postgres_data:
    redis_data:

networks:
    app-network:
        driver: bridge
```

---

## 🌍 **Plataformas de Deploy**

### ⚡ **Vercel (Recomendado)**

```json
{
    "vercel.json": {
        "version": 2,
        "builds": [
            {
                "src": "package.json",
                "use": "@vercel/next"
            }
        ],
        "routes": [
            {
                "src": "/api/(.*)",
                "dest": "/api/$1"
            },
            {
                "src": "/(.*)",
                "dest": "/$1"
            }
        ],
        "env": {
            "NODE_ENV": "production"
        },
        "functions": {
            "app/api/tournaments/route.ts": {
                "maxDuration": 30
            }
        },
        "headers": [
            {
                "source": "/(.*)",
                "headers": [
                    {
                        "key": "Cache-Control",
                        "value": "public, max-age=31536000, immutable"
                    }
                ]
            }
        ]
    }
}
```

### ☁️ **AWS (Enterprise)**

```yaml
# serverless.yml - Serverless Framework
service: poker-app

provider:
    name: aws
    runtime: nodejs18.x
    region: us-east-1
    stage: ${opt:stage, 'dev'}

    environment:
        NODE_ENV: production
        STAGE: ${self:provider.stage}

    iamRoleStatements:
        - Effect: Allow
          Action:
              - s3:GetObject
              - s3:PutObject
          Resource:
              - "arn:aws:s3:::${self:custom.bucketName}/*"

custom:
    bucketName: poker-app-${self:provider.stage}

functions:
    app:
        handler: lambda.handler
        events:
            - http:
                  path: /{proxy+}
                  method: ANY
                  cors: true
            - http:
                  path: /
                  method: ANY
                  cors: true

resources:
    Resources:
        AssetsBucket:
            Type: AWS::S3::Bucket
            Properties:
                BucketName: ${self:custom.bucketName}
                PublicAccessBlockConfiguration:
                    BlockPublicAcls: false
                    BlockPublicPolicy: false
                    IgnorePublicAcls: false
                    RestrictPublicBuckets: false
                WebsiteConfiguration:
                    IndexDocument: index.html
                    ErrorDocument: error.html

        CloudFrontDistribution:
            Type: AWS::CloudFront::Distribution
            Properties:
                DistributionConfig:
                    Origins:
                        - DomainName: ${self:custom.bucketName}.s3.amazonaws.com
                          Id: S3Origin
                          S3OriginConfig:
                              OriginAccessIdentity: ""
                    Enabled: true
                    DefaultRootObject: index.html
                    DefaultCacheBehavior:
                        TargetOriginId: S3Origin
                        ViewerProtocolPolicy: redirect-to-https
                        Compress: true
                        CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # Managed-CachingOptimized

plugins:
    - serverless-next-js
```

### 🚀 **Railway (Simples)**

```json
{
    "railway.json": {
        "build": {
            "builder": "NIXPACKS"
        },
        "deploy": {
            "startCommand": "npm start",
            "healthcheckPath": "/api/health"
        }
    }
}
```

---

## 📊 **Monitoramento e Observabilidade**

### 🔍 **Web Vitals Tracking**

```tsx
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals() {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
}

function sendToAnalytics(metric: any) {
    // Enviar para serviço de analytics
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", metric.name, {
            custom_map: { metric_id: "custom_metric" },
            value: Math.round(metric.value),
            event_category: "Web Vitals",
        });
    }

    // Enviar para serviço customizado
    fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            timestamp: Date.now(),
            url: window.location.href,
        }),
    }).catch(console.error);
}
```

### 📈 **Error Monitoring**

```tsx
// lib/error-tracking.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Error filtering
    beforeSend(event) {
        // Filter out known non-critical errors
        if (event.exception) {
            const error = event.exception.values?.[0];
            if (error?.value?.includes("ResizeObserver loop limit exceeded")) {
                return null;
            }
        }
        return event;
    },

    // Performance filtering
    beforeTransaction(event) {
        // Sample transactions based on URL
        if (event.request?.url?.includes("/api/health")) {
            return null; // Don't track health checks
        }
        return event;
    },
});

// Custom error boundary
export class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <GlassCard
                        variant="intense"
                        className="max-w-md p-8 text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-gray-300 mb-6">
                            We've been notified and are working on a fix.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Reload Page
                        </Button>
                    </GlassCard>
                </div>
            );
        }

        return this.props.children;
    }
}
```

### 📊 **Custom Metrics Dashboard**

```tsx
// pages/api/metrics.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // Collect various metrics
        const metrics = {
            server: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
            },

            app: {
                activeUsers: await getActiveUsers(),
                activeTournaments: await getActiveTournaments(),
                responseTime: await getAverageResponseTime(),
                errorRate: await getErrorRate(),
            },

            performance: {
                webVitals: await getWebVitalsData(),
                pageLoadTimes: await getPageLoadTimes(),
                apiResponseTimes: await getApiResponseTimes(),
            },
        };

        res.status(200).json(metrics);
    } catch (error) {
        console.error("Metrics collection error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Custom hooks para métricas em tempo real
export function useMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch("/api/metrics");
                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to fetch metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000); // Update every 30s

        return () => clearInterval(interval);
    }, []);

    return { metrics, loading };
}
```

---

## 🔒 **Segurança em Produção**

### 🛡️ **Security Headers**

```javascript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
    );

    // CSP (Content Security Policy)
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: *.cdninstagram.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' *.vercel-analytics.com wss:;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
        .replace(/\s{2,}/g, " ")
        .trim();

    response.headers.set("Content-Security-Policy", cspHeader);

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### 🔐 **Environment Variables**

```bash
# .env.production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Database
DATABASE_URL=postgresql://user:pass@prod-db:5432/poker_app?sslmode=require

# Redis
REDIS_URL=redis://prod-redis:6379

# API Keys (use secrets management)
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG....

# JWT
JWT_SECRET=your-super-secure-secret-key-here

# Monitoring
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...

# Analytics
GOOGLE_ANALYTICS_ID=GA-...
VERCEL_ANALYTICS_ID=...

# CDN
NEXT_PUBLIC_CDN_URL=https://cdn.yourapp.com
```

### 🔑 **API Security**

```tsx
// lib/api-security.ts
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

// Rate limiting
export const createRateLimit = (windowMs: number, max: number) =>
    rateLimit({
        windowMs,
        max,
        message: "Too many requests from this IP",
        standardHeaders: true,
        legacyHeaders: false,
    });

// CORS configuration
export const corsOptions = {
    origin:
        process.env.NODE_ENV === "production"
            ? ["https://yourapp.com", "https://www.yourapp.com"]
            : ["http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
};

// Input validation
export function validateInput(schema: any) {
    return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Invalid input",
                errors: error.details.map((d: any) => d.message),
            });
        }
        next();
    };
}

// JWT middleware
export function authenticateToken(
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
}
```

---

## 📈 **Performance em Produção**

### ⚡ **Caching Strategy**

```typescript
// lib/cache.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export class CacheManager {
    // Cache com TTL
    async set(key: string, value: any, ttl: number = 3600) {
        const serialized = JSON.stringify(value);
        await redis.setex(key, ttl, serialized);
    }

    async get<T>(key: string): Promise<T | null> {
        const cached = await redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    // Cache com invalidação por tags
    async setWithTags(
        key: string,
        value: any,
        tags: string[],
        ttl: number = 3600
    ) {
        await this.set(key, value, ttl);

        // Associate with tags for batch invalidation
        for (const tag of tags) {
            await redis.sadd(`tag:${tag}`, key);
            await redis.expire(`tag:${tag}`, ttl);
        }
    }

    async invalidateByTag(tag: string) {
        const keys = await redis.smembers(`tag:${tag}`);
        if (keys.length > 0) {
            await redis.del(...keys);
            await redis.del(`tag:${tag}`);
        }
    }

    // Cache pattern para API routes
    withCache(key: string, ttl: number = 3600) {
        return (
            target: any,
            propertyName: string,
            descriptor: PropertyDescriptor
        ) => {
            const method = descriptor.value;

            descriptor.value = async function (...args: any[]) {
                const cacheKey = `${key}:${JSON.stringify(args)}`;
                const cached = await redis.get(cacheKey);

                if (cached) {
                    return JSON.parse(cached);
                }

                const result = await method.apply(this, args);
                await redis.setex(cacheKey, ttl, JSON.stringify(result));

                return result;
            };
        };
    }
}

export const cache = new CacheManager();
```

### 🚀 **CDN Integration**

```typescript
// lib/cdn.ts
export class CDNManager {
    private cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "";

    // Optimize image URLs
    getImageUrl(
        src: string,
        options: {
            width?: number;
            height?: number;
            quality?: number;
            format?: "webp" | "avif" | "jpeg" | "png";
        } = {}
    ) {
        if (!this.cdnUrl) return src;

        const params = new URLSearchParams();
        if (options.width) params.set("w", options.width.toString());
        if (options.height) params.set("h", options.height.toString());
        if (options.quality) params.set("q", options.quality.toString());
        if (options.format) params.set("f", options.format);

        const query = params.toString();
        return `${this.cdnUrl}/${src}${query ? `?${query}` : ""}`;
    }

    // Preload critical resources
    preloadCriticalResources() {
        const critical = [
            "/fonts/inter-regular.woff2",
            "/images/logo.webp",
            "/css/critical.css",
        ];

        critical.forEach((resource) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.href = this.getImageUrl(resource);
            link.as = this.getResourceType(resource);
            document.head.appendChild(link);
        });
    }

    private getResourceType(url: string) {
        if (url.includes(".woff2") || url.includes(".woff")) return "font";
        if (url.includes(".css")) return "style";
        if (url.includes(".js")) return "script";
        return "image";
    }
}

export const cdn = new CDNManager();
```

---

## 🔍 **Health Checks**

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const checks = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,

        checks: {
            database: await checkDatabase(),
            redis: await checkRedis(),
            memory: checkMemory(),
            disk: await checkDisk(),
        },
    };

    const allHealthy = Object.values(checks.checks).every(
        (check) => check.status === "ok"
    );
    const status = allHealthy ? 200 : 503;

    res.status(status).json(checks);
}

async function checkDatabase() {
    try {
        // Simulate DB check
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { status: "ok", responseTime: "10ms" };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

async function checkRedis() {
    try {
        // Simulate Redis check
        return { status: "ok", responseTime: "5ms" };
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

function checkMemory() {
    const usage = process.memoryUsage();
    const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
    const percentage = Math.round((usedMB / totalMB) * 100);

    return {
        status: percentage > 90 ? "warning" : "ok",
        usage: `${usedMB}MB / ${totalMB}MB (${percentage}%)`,
    };
}

async function checkDisk() {
    // Simulate disk space check
    return { status: "ok", usage: "45% used" };
}
```

---

## 🎯 **Deployment Checklist**

### ✅ **Pre-Deploy**

-   [ ] **Code Quality**

    -   [ ] Linting passes (`pnpm lint`)
    -   [ ] Type checking passes (`pnpm type-check`)
    -   [ ] All tests pass (`pnpm test`)
    -   [ ] E2E tests pass (`pnpm test:e2e`)
    -   [ ] No console.log in production code

-   [ ] **Security**

    -   [ ] Environment variables configured
    -   [ ] Security headers implemented
    -   [ ] API rate limiting enabled
    -   [ ] Input validation in place
    -   [ ] No sensitive data in client bundle

-   [ ] **Performance**
    -   [ ] Bundle size analyzed
    -   [ ] Images optimized
    -   [ ] Critical CSS identified
    -   [ ] Caching strategy implemented
    -   [ ] CDN configured

### ✅ **Post-Deploy**

-   [ ] **Verification**

    -   [ ] Health check endpoint responding
    -   [ ] Core user flows working
    -   [ ] Error tracking active
    -   [ ] Analytics tracking
    -   [ ] Performance monitoring

-   [ ] **Monitoring**
    -   [ ] Set up alerts for errors
    -   [ ] Monitor Web Vitals
    -   [ ] Track business metrics
    -   [ ] Set up uptime monitoring

---

## 🔗 **Recursos Úteis**

### 📚 **Documentação**

-   [Next.js Deployment](https://nextjs.org/docs/deployment)
-   [Vercel Documentation](https://vercel.com/docs)
-   [AWS Amplify](https://docs.amplify.aws/)
-   [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### 🛠️ **Ferramentas**

-   [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
-   [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
-   [Sentry](https://sentry.io/)
-   [Vercel Analytics](https://vercel.com/analytics)

---

## 🚀 **Próximos Passos**

Continue otimizando para produção:

1. **[📊 Analytics](./analytics-guide.md)** - Métricas e insights
2. **[🔧 Maintenance](./maintenance-guide.md)** - Manutenção contínua
3. **[📈 Scaling](./scaling-guide.md)** - Escalabilidade

---

_🎯 **Meta**: Deploy com confiança e monitoramento completo para sucesso em produção._
