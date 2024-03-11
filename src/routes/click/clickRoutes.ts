import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./clicks.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { clickTaskQuerySchema } from "../task/task.schemas";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/insert",
    schema: {
      tags: ["Tasks"],
      querystring: clickTaskQuerySchema,
    },
    handler: taskController.clickInsert,
  });
}
