import { FastifyInstance } from "fastify";
import * as categoriesController from "./categories.controller";
import { fetchCategoryResponseSchema } from "./categories.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import rateLimit from "@fastify/rate-limit";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "30 second",
      },
    },
    method: "GET",
    url: "/",
    schema: {
      response: { 200: fetchCategoryResponseSchema },
      tags: ["Categories"],
    },
    handler: categoriesController.fetch,
  });
}
