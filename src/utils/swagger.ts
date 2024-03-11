import { createJsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerOptions = {
  openapi: {
    info: {
      title: "Freecash API",
      description: "Cash earning platform",
      version: "1.0.0",
    },
    servers: [],
  },
  // transform: jsonSchemaTransform,
  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  transform: createJsonSchemaTransform({
    skipList: ["/api/v1/auth/google", "/api/v1/auth/facebook"],
  }),
};
export const swaggerUiOptions = {
  routePrefix: "/docs",
};
