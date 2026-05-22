import express from 'express';
import router from './router';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import { clientUrl, corsOrigins, serverPort, serverUrl } from './config/runtime';
import { requireTrustedOrigin } from './middleware/requireTrustedOrigin';
import { assertCriticalSecretsReadiness } from './config/criticalSecretsReadiness';
import { createTrustProxyMatcher } from './config/proxyTrust';
import { createModuleLogger } from './lib/logger';

const logger = createModuleLogger('api.server');

const createCorsOriginError = (origin: string) => {
  const error = new Error(`CORS origin not allowed: ${origin}`) as Error & { status: number };
  error.status = 403;
  return error;
};

if (process.env.NODE_ENV !== 'test') {
  assertCriticalSecretsReadiness();
}

const app = express();
app.set('trust proxy', createTrustProxyMatcher());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(createCorsOriginError(origin));
    },
    credentials: true,
  })
);
app.use(
  "/avatars",
  express.static(path.join(process.cwd(), "public", "avatars"), {
    dotfiles: "deny",
    fallthrough: false,
    immutable: true,
    index: false,
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);
app.use(express.json());
app.use(requireTrustedOrigin);
app.use(requestLogger);
app.use(router);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(serverPort, () => {
    logger.info('server_started', {
      serverPort,
      serverUrl,
      corsClientUrl: clientUrl,
      corsOriginsCount: corsOrigins.length,
    });
  });
}

export { app }
