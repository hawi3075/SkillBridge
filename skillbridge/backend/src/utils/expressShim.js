/**
 * Express Loader & Compatibility Shim
 * Loads standard 'express' if installed. If run in an isolated offline environment
 * without node_modules, provides an HTTP router shim matching Express's core API.
 */

let realExpress = null;
try {
  realExpress = require('express');
} catch (e) {
  // Offline sandbox environment fallback
}

if (realExpress) {
  module.exports = realExpress;
} else {
  const url = require('url');
  const path = require('path');
  const fs = require('fs');

  function createRouter() {
    const routes = [];

    const router = (req, res, next) => {
      let idx = 0;
      const parsed = url.parse(req.url, true);
      const reqPath = parsed.pathname;

      const runNext = (err) => {
        if (err) return next ? next(err) : res.end(JSON.stringify({ error: err.message }));
        if (idx < routes.length) {
          const r = routes[idx++];
          if (r.method === 'USE') {
            if (reqPath.startsWith(r.path)) {
              const oldUrl = req.url;
              if (r.path !== '/' && req.url.startsWith(r.path)) {
                req.url = req.url.slice(r.path.length) || '/';
              }
              return r.handler(req, res, (subErr) => {
                req.url = oldUrl;
                runNext(subErr);
              });
            } else {
              return runNext();
            }
          }

          if (r.method === req.method || r.method === 'ALL') {
            const paramNames = [];
            const regexStr = '^' + r.path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
              paramNames.push(name);
              return '([^/]+)';
            }) + '$';
            const match = reqPath.match(new RegExp(regexStr));
            if (match) {
              req.params = req.params || {};
              paramNames.forEach((name, i) => {
                req.params[name] = decodeURIComponent(match[i + 1]);
              });

              let hIdx = 0;
              const flatHandlers = r.handlers;
              const runHandler = (hErr) => {
                if (hErr) return runNext(hErr);
                if (hIdx < flatHandlers.length) {
                  const h = flatHandlers[hIdx++];
                  if (typeof h === 'function') {
                    h(req, res, runHandler);
                  } else {
                    runHandler();
                  }
                } else {
                  runNext();
                }
              };
              return runHandler();
            }
          }
          return runNext();
        } else if (next) {
          next();
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: `Cannot ${req.method} ${req.url}` }));
        }
      };

      runNext();
    };

    router.use = function(p, ...handlers) {
      const flattened = handlers.flat(Infinity);
      if (typeof p === 'function') {
        routes.push({ method: 'USE', path: '/', handler: p });
      } else {
        flattened.forEach(h => {
          routes.push({ method: 'USE', path: p, handler: h });
        });
      }
      return router;
    };

    ['get', 'post', 'put', 'delete', 'patch'].forEach(m => {
      router[m] = function(p, ...handlers) {
        routes.push({ method: m.toUpperCase(), path: p, handlers: handlers.flat(Infinity) });
        return router;
      };
    });

    return router;
  }

  function createApp() {
    const rootRouter = createRouter();

    const app = function(req, res) {
      const parsed = url.parse(req.url, true);
      req.query = parsed.query || {};
      req.originalUrl = req.url;

      res.status = function(code) {
        res.statusCode = code;
        return res;
      };

      res.json = function(data) {
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'application/json');
        }
        res.end(JSON.stringify(data));
      };

      res.send = function(body) {
        res.end(body);
      };

      res.sendStatus = function(code) {
        res.statusCode = code;
        res.end();
      };

      res.header = function(k, v) {
        res.setHeader(k, v);
        return res;
      };

      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
      });
      req.on('end', () => {
        if (bodyData) {
          try {
            req.body = JSON.parse(bodyData);
          } catch (e) {
            req.body = bodyData;
          }
        } else {
          req.body = req.body || {};
        }

        rootRouter(req, res);
      });
    };

    Object.assign(app, rootRouter);

    return app;
  }

  createApp.Router = createRouter;
  createApp.json = () => (req, res, next) => next();
  createApp.urlencoded = () => (req, res, next) => next();
  createApp.static = (staticPath) => (req, res, next) => {
    const filePath = path.join(staticPath, req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.createReadStream(filePath).pipe(res);
    } else {
      next();
    }
  };

  module.exports = createApp;
}
