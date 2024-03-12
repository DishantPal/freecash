import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as userController from "./user.controller";
import z from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";

import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/me",
    schema: {
      tags: ["User"],
    },
    handler: userController.findUser,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "PUT",
    url: "/update",
    schema: {
      tags: ["User"],
    },
    handler: userController.updateUser,
  });
}
