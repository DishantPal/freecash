import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./clicks.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { clickTaskQuerySchema } from "./clicks.schema";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/insert",
    schema: {
      tags: ["Clicks"],
      querystring: clickTaskQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.string().optional(), // Assuming `data` can be an empty string and is optional.
          error: z
            .union([z.string(), z.literal("null")])
            .nullable()
            .optional(), // If `error` can be 'null' as a string or a true null value.
          msg: z.string(), // Corrected to match the JSON response field name.
        }),
      },
    },
    handler: taskController.insert,
  });
}
