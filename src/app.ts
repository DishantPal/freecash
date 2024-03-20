import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyPassport from "@fastify/passport";
import { join } from "path";
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
import { createJWTToken } from "./routes/auth/jwt";
// import { initializeEvents } from "./events/eventBus";
// import { eventListeners } from "./events/Events";
import "./utils/passport";
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
    (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      console.log(error.toString());
      reply.send({ error: error });
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
  redisPlugin(app, {
    // url: config.env.redis.url ? config.env.redis.url.toString() : "",
    port: Number(config.env.redis.port), // Redis port
    host: config.env.redis.host, // Redis host
    password: config.env.redis.password,
  });
  // Register autoload for routes
  app.register(autoload, {
    dir: join(__dirname, "routes"),
    options: { prefix: "/api/v1" }, // Use a prefix for all routes
  });

  // //// Initialize the event bus
  // const events = Object.keys(eventListeners);
  // events.forEach((event) => {
  //   initializeEvents(event);
  // });
  const web = db
    .selectFrom("settings")
    .selectAll()
    .where("group", "=", "web")
    .execute();
  web.then((res: any) => {
    app.redis.set("web_settings", JSON.stringify(res));
  });
  const email = db
    .selectFrom("settings")
    .selectAll()
    .where("group", "=", "email")
    .execute();
  email.then((res: any) => {
    app.redis.set("email_settings", JSON.stringify(res));
  });
  const seo = db
    .selectFrom("settings")
    .selectAll()
    .where("group", "=", "seo")
    .execute();
  seo.then((res: any) => {
    app.redis.set("seo_settings", JSON.stringify(res));
  });
  const cashback = db
    .selectFrom("settings")
    .select("val")
    .where("name", "=", "default_currency")
    .execute();
  cashback.then((res: any) => {
    app.redis.set("default_currency", JSON.stringify(res[0].val));
  });
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
      let accessToken = await createJWTToken(
        { user: req.user },
        `${parseInt(config.env.app.expiresIn)}h`
      );
      reply.setCookie("accessToken", accessToken.toString(), {
        path: "/",
        httpOnly: false,
        expires: new Date(Date.now() + 3600000),
        sameSite: "none",
        secure: true,
        domain: ".enactweb.com",
      });
      reply.redirect(`/dashboard?token=${accessToken}`);
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
        httpOnly: false,
        expires: new Date(Date.now() + 3600000),
        sameSite: "none",
        secure: true,
        domain: ".enactweb.com",
      });
      reply.redirect(`/dashboard?token=${newAccessToken}`);
      // reply.send({ success: "true", token: newAccessToken });
    }
  );
  app.get("/dashboard", (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      success: true,
      user: req.user,
    });
  });
  return app;
};

// Call the function with the Redis instance
const app: FastifyInstance = createApp();
export default app;
