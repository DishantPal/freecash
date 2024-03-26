import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as statsController from "./stats.controller";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["Stats"],
      //   querystring: querySchema,
      //   response: {
      //     200: responseSchema,
      //   },
    },
    handler: statsController.fetchStats,
  });
}
