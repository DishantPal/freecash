import { FastifyInstance } from "fastify";
import * as providersController from "./offerProvider.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Providers"],
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              code: z.string(),
              logo: z.string(),
            })
          ),
          error: z.string().nullable(),
          msg: z.string().nullable(),
        }),
      },
    },
    handler: providersController.fetch,
  });
}
