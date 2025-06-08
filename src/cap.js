import { Elysia } from "elysia";
import Cap from "@cap.js/server";
import { rateLimit } from "elysia-rate-limit";

const _cap = new Cap({
  tokens_store_path: ".data/tokensList.json",
});

export const cap = _cap;

export const capRoutes = new Elysia({
  prefix: "/cap",
})
  .use(
    rateLimit({
      duration: 1000,
      max: 4,
      scoping: "scoped",
      generator: (request) =>
        request.headers.get("cf-connecting-ip") || "0.0.0.0",
    })
  )
  .post("/challenge", () => {
    return _cap.createChallenge();
  })

  .post("/redeem", async ({ body, set }) => {
    const { token, solutions } = body;

    if (!token || !solutions) {
      set.status = 400;
      return { success: false };
    }

    return await _cap.redeemChallenge({ token, solutions });
  });
