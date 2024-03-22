import { FastifyInstance } from "fastify";
import * as bonusesController from "./bonuses.controller";
// Removed unnecessary import comment
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { apiResponseSchema } from "./bonuses.schema";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      response: {
        200: apiResponseSchema,
      },
      tags: ["Bonuses"],
    },
    handler: bonusesController.fetch,
  });
}
