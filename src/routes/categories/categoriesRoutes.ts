import { FastifyInstance } from "fastify";
import * as categoriesController from "./categories.controller";
import { fetchCategoryResponseSchema } from "./categories.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      // response: { 200: fetchCategoryResponseSchema },
      tags: ["Categories"],
    },
    handler: categoriesController.fetch,
  });
}
