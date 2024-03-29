import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as blocksController from "./blocks.controller";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["blocks"],
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: blocksController.fetch,
  });
}
