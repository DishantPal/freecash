import { FastifyInstance } from "fastify";
import * as providersController from "./offerProvider.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: { tags: ["Providers"] },
    handler: providersController.fetch,
  });
}
