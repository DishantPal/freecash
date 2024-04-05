import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyPassport from "@fastify/passport";
import path, { join } from "path";
import autoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import cors from "@fastify/cors";
import { config } from "./config/config";
import redisPlugin from "./service/redis";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger";
import { db } from "./database/database";
import { createJWTToken } from "./modules/auth/jwt";
import "./utils/passport";
import { error, success } from "./utils/sendResponse";
import ejs from "ejs";
import view from "@fastify/view";
import * as settings from "./modules/settings/settings.model";
import { getSetCachedData } from "./utils/getCached";
export const createApp = (): FastifyInstance => {
  const app = fastify({ logger: true }) as FastifyInstance;
  const sessionSecret = config.env.app.sessionSecret?.toString();
  if (!sessionSecret) {
    throw new Error("Session secret is not defined in the config");
  }
  const sessionSalt = config.env.app.sessionSalt?.toString();
  if (!sessionSalt) {
    throw new Error("Session salt is not defined in the config");
  }
  app.register(require("fastify-healthcheck"));
  app.setErrorHandler(
    (error: any, request: FastifyRequest, reply: FastifyReply) => {
      //handle zoderror
      if (error.name === "ZodError") {
        return reply.status(400).send(error.toString());
      }
      console.log(error);

      //handle fastify rate limit errors
      if (error.message === "Rate limit exceeded") {
        return reply.status(429).send("Too many requests");
      }
      reply.sendError(error.toString(), 500);
    }
  );
  app.register(cors);
  app.register(fastifyCookie);
  app.register(fastifySecureSession, {
    secret: sessionSecret,
    salt: sessionSalt,
    sessionName: config.env.app.sessionName,
    cookieName: config.env.app.cookieName,
    cookie: {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
      sameSite: "none",
      secure: true,
    },
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);
  app.register(require("@fastify/rate-limit"), {
    // Global settings can be applied here, if needed
    max: 10, // limit each IP to 100 requests per windowMs
    timeWindow: "1 minute", // start counting after 1 minute
  });
  // app.register(require("@fastify/static"), {
  //   root: path.join(__dirname, "public"),
  //   prefix: "/public/",
  // });
  app.register(require("@fastify/formbody"));
  app.register(view, {
    engine: {
      ejs,
    },
    templates: path.join(__dirname, "templates"),
  });
  redisPlugin(app, {
    // url: config.env.redis.url ? config.env.redis.url.toString() : "",
    port: Number(config.env.redis.port), // Redis port
    host: config.env.redis.host, // Redis host
    password: config.env.redis.password,
  });
  // Register autoload for modules
  app.register(autoload, {
    dir: join(__dirname, "modules"),
    options: { prefix: "/api/v1" }, // Use a prefix for all modules
  });
  app.decorateRequest("userId", "");
  // Decorate reply with sendSuccess and sendError
  app.decorateReply(
    "sendSuccess",
    function (
      this: FastifyReply,
      data: any,
      statusCodes: number = 200,
      msg: string | null = null
    ) {
      success(this, statusCodes, data, msg);
    }
  );

  app.decorateReply(
    "sendError",
    function (this: FastifyReply, err: string, statusCodes: number = 500): any {
      error(this, statusCodes, err);
    }
  );
  // getSetCachedData(
  //   "web_settings",
  //   async () => {
  //     return await settings.fetch("web");
  //   },
  //   3600
  // );
  // getSetCachedData(
  //   "seo_settings",
  //   async () => {
  //     return await settings.fetch("seo");
  //   },
  //   3600
  // );
  // getSetCachedData(
  //   "email_settings",
  //   async () => {
  //     return await settings.fetch("email");
  //   },
  //   3600
  // );
  // getSetCachedData(
  //   "default_currency",
  //   async () => {
  //     return await db
  //       .selectFrom("settings")
  //       .select("val")
  //       .where("name", "=", "default_currency")
  //       .execute();
  //   },
  //   3600
  // );
  // const cashback = db
  //   .selectFrom("settings")
  //   .select("val")
  //   .where("name", "=", "default_currency")
  //   .execute();
  // cashback.then((res: any) => {
  //   app.redis.set("default_currency", JSON.stringify(res[0].val));
  // });
  app.get(
    "/auth/google/callback",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile", "email"],
        state: "sds3sddd",
        failureRedirect: "/",
      }),
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      let token = await createJWTToken(
        { user: req.user },
        `${parseInt(config.env.app.expiresIn)}h`
      );

      reply.setCookie("token", token, {
        path: "/",
      });
      reply.redirect(`/dashboard?token=${token}`);
      // reply.send({ success: "true", token: accessToken });
    }
  );
  app.get(
    "/auth/facebook/callback",
    {
      preHandler: fastifyPassport.authenticate("facebook", {
        failureRedirect: "/login",
      }),
    },
    function (req: FastifyRequest, reply: FastifyReply) {
      let newAccessToken = Math.floor(Math.random() * 10);
      reply.setCookie("accessToken", newAccessToken.toString(), {
        path: "/",
      });
      reply.redirect(`/dashboard?token=${newAccessToken}`);
      // reply.send({ success: "true", token: newAccessToken });
    }
  );
  app.get("/auth/login", (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view("login.ejs");
  });
  app.get("/auth/register", (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view("register.ejs");
  });
  app.get(
    "/auth/reset-password/",
    (req: FastifyRequest, reply: FastifyReply) => {
      const { token } = req.query as { token: string };
      return reply.view("resetPassword.ejs", { token: token });
    }
  );
  app.get(
    "/auth/forgot-password",
    (req: FastifyRequest, reply: FastifyReply) => {
      return reply.view("forgot.ejs");
    }
  );
  app.get("/dashboard", (req: FastifyRequest, reply: FastifyReply) => {
    const { token } = req.query as { token: string };
    console.log(token);
    if (token) {
      return reply.view("success.ejs", {
        message: "Welcome to Freecash",
        token: token,
      });
    } else {
      return reply.view("success.ejs", {
        message: "Success", //for forgot reset password page same method likelogin register need to follow and no query string will be there so message will be just Success
        token: null,
      });
    }
    // reply.send({
    //   success: true,
    //   user: req.user,
    //   token: req.cookies.accessToken,
    // });
  });
  return app;
};

// Call the function with the Redis instance
const app: FastifyInstance = createApp();

export default app;
