import { FastifyInstance } from "fastify";
import * as postbackController from "./postback.controller";
import { postbackSchema } from "./post.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      querystring: postbackSchema,
      tags: ["Postback"],
      response: {
        401: z.object({ error: z.string() }),
        200: z.object({ message: z.string() }),
        503: z.object({ error: z.string() }),
      },
    },
    handler: postbackController.validate,
  });
}
