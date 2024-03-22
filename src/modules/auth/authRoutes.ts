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
import fastifyPassport from "@fastify/passport";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/register",
    schema: {
      body: registerUserSchema,
      tags: ["Authentication"],
      response: {
        201: z.object({
          success: z.boolean(),
          data: z.optional(
            z.object({
              token: z.string(),
            })
          ),
          error: z.string(),
          msg: z.string(),
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
        201: z.object({
          success: z.boolean(),
          data: z.optional(
            z.object({
              token: z.string(),
            })
          ),
          error: z.string(),
          message: z.string(),
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
    handler: authController.logout,
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
  app.get(
    "/google",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile", "email"],
      }),
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("GOOGLE API forward");
    }
  );
  app.get(
    "/facebook",
    {
      preValidation: fastifyPassport.authenticate("facebook", {
        scope: ["profile", "email"],
      }),
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("facebook API forward");
    }
  );
}
