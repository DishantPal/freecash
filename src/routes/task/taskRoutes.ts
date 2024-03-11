import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./task.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import {
  clickTaskQuerySchema,
  fetchTaskResponseSchema,
  taskCategorySchema,
  taskProviderSchema,
} from "./task.schemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Tasks"],
    },
    handler: taskController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/click/insert",
    schema: { tags: ["Tasks"] },
    handler: taskController.clickInsert,
  });
}
