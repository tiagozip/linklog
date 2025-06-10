import { linkQueries } from "./db.js";
import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { rateLimit } from "elysia-rate-limit";

import { capRoutes } from "./cap.js";
import { apiRoutes } from "./api.js";
import { minify } from "terser";

const app = new Elysia()
  .onBeforeHandle(async (ctx) => {
    if (
      !(process.env["ENV"] === "dev") &&
      process.env["CF-HOST"] &&
      ctx.headers["host"] !== process.env["CF-HOST"]
    ) {
      await Bun.sleep(Math.random() * 10);
      return "Invalid host header";
    }
  })
  .use(staticPlugin())
  .use(
    rateLimit({
      duration: 10_000,
      max: 100,
      generator: (request) =>
        request.headers.get("cf-connecting-ip") || "0.0.0.0",
    })
  )
  .use(capRoutes)
  .use(apiRoutes)

  .get("/", () => Bun.file("public/index.html"))
  .get("/links", () => Bun.file("public/dash/index.html"))
  .get("/legal", () => Bun.file("public/legal/index.html"))

  .get("/api/extensions.json", async () => {
    return JSON.stringify(
      JSON.parse(await Bun.file("public/assets/extensions.json").text())
    );
  })

  .get("/api/script.js", async ({ set }) => {
    const raw = await Bun.file("public/assets/grabber.js").text();

    const result = await minify(raw, { mangle: true, compress: true });
    set.headers["content-type"] = "application/javascript";
    return result.code;
  })

  .get("/:slug", async ({ params }) => {
    return linkQueries.findById.get(params.slug)
      ? Bun.file("public/collect.html")
      : Bun.file("public/404.html");
  })

  .listen(process.env.PORT || 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
