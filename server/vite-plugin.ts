import type { Plugin } from "vite";
import app from "./app";

export function studioApi(): Plugin {
  return {
    name: "studio-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl ?? req.url ?? "";
        if (!url.startsWith("/api")) {
          next();
          return;
        }
        try {
          const host = req.headers.host ?? "localhost";
          const origin = `http://${host}`;
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (!value) continue;
            headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          }
          const method = req.method ?? "GET";
          const chunks: Buffer[] = [];
          if (method !== "GET" && method !== "HEAD") {
            await new Promise<void>((resolve, reject) => {
              req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
              req.on("end", () => resolve());
              req.on("error", reject);
            });
          }
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
            const request = new Request(`${origin}${url}`, {
            method,
            headers,
            body,
            ...(body ? { duplex: "half" } : {}),
          } as RequestInit);
          const response = await app.fetch(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          const buf = Buffer.from(await response.arrayBuffer());
          res.end(buf);
        } catch (error) {
          console.error(error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "API failed" }));
        }
      });
    },
  };
}
