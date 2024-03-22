import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as settingsController from "./settings.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { responseSchema, querySchema } from "./settings.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["Settings"],
      querystring: querySchema,
      response: {
        200: responseSchema,
      },
    },
    handler: settingsController.fetch,
  });
}
