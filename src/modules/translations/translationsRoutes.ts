import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as translationsController from "./translations.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["Translations"],
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            translations: z.array(
              z.object({
                id: z.number(),
                page: z.string(),
                module: z.string(),
                trans_key: z.string(),
                trans_value: z.string(),
              })
            ),
          }),
          error: z.string().nullable(),
          msg: z.string().nullable(),
        }),
      },
    },
    handler: translationsController.fetch,
  });
}
