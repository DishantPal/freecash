import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyTypeProviderDefault,
} from "fastify";
import * as authController from "./auth.controller";
import z from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";
import {
  emailSchema,
  loginSchema,
  passwordSchema,
  registerUserSchema,
} from "./auth.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/register",
    schema: {
      body: registerUserSchema,
      tags: ["Authentication"],
      response: {
        200: z.object({
          success: z.boolean(),
          message: z.string(),
          token: z.string(),
        }),

        409: z.object({
          success: z.boolean(),
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: authController.register,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: {
      body: loginSchema,
      tags: ["Authentication"],
      response: {
        200: z.object({
          success: z.boolean(),
          token: z.string(),
        }),
        401: z.object({
          success: z.boolean().default(false),
          error: z.string(),
        }),
      },
    },
    handler: authController.login,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/logout",
    preValidation: isAuthenticated,
    schema: { tags: ["Authentication"] },
    handler: (req: FastifyRequest, reply: FastifyReply) => {
      reply.clearCookie("accessToken", { path: "/api/v1/auth" });
      req.session.delete();
      return reply.send({
        message: "Logout Successful",
      });
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/verify-email/",
    schema: {
      querystring: z.object({
        token: z.string(),
      }),
      tags: ["Authentication"],
    },
    handler: authController.verifyEmail,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/forgot-password",
    schema: {
      body: emailSchema,
      tags: ["Authentication"],
    },
    handler: authController.forgotPassword,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/reset-password/",
    schema: {
      body: passwordSchema,
      tags: ["Authentication"],
    },
    handler: authController.resetPassword,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/change-password",
    preHandler: isAuthenticated,
    schema: {
      body: passwordSchema,
      tags: ["Authentication"],
    },
    handler: authController.changePassword,
  });
}
