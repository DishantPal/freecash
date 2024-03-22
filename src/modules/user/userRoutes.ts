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
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
          }),
          error: z.string(),
          msg: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
      querystring: z.object({
        id: z.string(),
      }),
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
