import { Elysia } from "elysia";
import {
  createLink,
  getLink,
  deleteLink,
  recordHit,
  deleteMe,
} from "./links.js";
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

  .post("/deleteme", async ({ body, headers }) => {
    const { slug, token } = body;
    const { success } = await cap.validateToken(token);

    if (!success) {
      return { error: "CAPTCHA validation failed" };
    }
    if (!slug) {
      return { error: "Invalid slug" };
    }

    const ip = headers["cf-connecting-ip"];

    try {
      const { ok } = await deleteMe({
        slug,
        ip,
      });

      if (!ok) return { result: `Couldn't find any record for IP ${ip}` };
      return {
        result: `Success! All data for IP ${ip} has been deleted.\n\nNote that if you clicked the link multiple times, you will need to submit another deletion for the same link`,
      };
    } catch (e) {
      return { result: "Error: " + e.message };
    }
  })

  .post("/exchange", async ({ query, body, request }) => {
    const MAX_PAYLOAD_SIZE = 40 * 1024; // 40 kb
    const payloadSize = JSON.stringify(body).length;

    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return { error: "Payload too large" };
    }

    return await recordHit({
      id: query.id,
      ipData: body,
      userIp: request.headers.get("cf-connecting-ip") || "0.0.0.0",
    });
  });
