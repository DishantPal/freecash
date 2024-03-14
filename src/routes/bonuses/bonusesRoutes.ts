import { FastifyInstance } from "fastify";
import * as bonusesController from "./bonuses.controller";
// Removed unnecessary import comment
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      response: {
        200: z.object({
          success: z.boolean(),
          data: z
            .object({
              bonuses: z.array(
                z.object({
                  id: z.number(),
                  user_id: z.number(),
                  bonus_code: z.string(),
                  amount: z.string(), // Confirm this should be a string, not a number
                  awarded_on: z.date(), // Ensure this matches your date format
                  expires_on: z.date(), // Ensure this matches your date format
                  referred_bonus_id: z.number().nullable().optional(),
                  status: z.string(),
                })
              ),
            })
            .optional(), // If the whole data object can be optional
          error: z.union([z.string(), z.null()]).optional(), // If error can be a string or null
          msg: z.union([z.string(), z.null()]).optional(), // If msg can be a string or null
        }),
      },
      tags: ["Bonuses"],
    },
    handler: bonusesController.fetch,
  });
}
