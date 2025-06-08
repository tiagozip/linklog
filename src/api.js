import { Elysia } from "elysia";
import { createLink, getLink, deleteLink, recordHit } from "./links.js";
import { rateLimit } from "elysia-rate-limit";
import { cap } from "./cap.js";

export const apiRoutes = new Elysia({ prefix: "/api" })
  .use(
    rateLimit({
      duration: 10_000,
      max: 20,
      scoping: "scoped",
      generator: (request) =>
        request.headers.get("cf-connecting-ip") || "0.0.0.0",
    })
  )

  .post("/create", async ({ body, request }) => {
    const { url, cap: captchaToken } = body;

    const { success } = await cap.validateToken(captchaToken);

    if (!success) {
      return { error: "CAPTCHA validation failed" };
    }
    if (!url || typeof url !== "string") {
      return { error: "Invalid URL" };
    }

    return await createLink({
      url,
      userIp: request.headers.get("cf-connecting-ip") || "0.0.0.0",
    });
  })

  .get("/get", async ({ query }) => {
    try {
      const result = await getLink({
        slug: query.slug,
        key: query.key,
      });
      return result;
    } catch (error) {
      return { error: error.message };
    }
  })

  .get("/delete", async ({ query }) => {
    try {
      const result = await deleteLink({
        slug: query.slug,
        key: query.key,
      });
      return result;
    } catch (error) {
      return { error: error.message };
    }
  })

  .post("/exchange", async ({ query, body, request }) => {
    return await recordHit({
      id: query.id,
      ipData: body,
      userIp: request.headers.get("cf-connecting-ip") || "0.0.0.0",
    });
  });
