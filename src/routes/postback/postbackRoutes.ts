import { FastifyInstance } from "fastify";
import * as postbackController from "./postback.controller";
import { postbackSchema } from "./post.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: { querystring: postbackSchema, tags: ["Postback"] },
    handler: postbackController.validate,
  });
}
