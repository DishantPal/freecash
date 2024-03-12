import { createJsonSchemaTransform } from "fastify-type-provider-zod";
import { z } from "zod";
import { OpenAPIV3 } from "openapi-types";
import {
  userSchema,
  offerWallTasksSchema,
  offerWallNetworkSchema,
  offerWallCategories,
} from "./swaggerSchema";

export const swaggerOptions = {
  openapi: {
    info: {
      title: "Freecash API",
      description: "Cash earning platform",
      version: "1.0.0",
    } as OpenAPIV3.InfoObject,
    servers: [] as OpenAPIV3.ServerObject[],
    components: {
      schemas: {
        User: userSchema as OpenAPIV3.SchemaObject,
        Tasks: offerWallTasksSchema as OpenAPIV3.SchemaObject,
        Networks: offerWallNetworkSchema as OpenAPIV3.SchemaObject,
        Categories: offerWallCategories as OpenAPIV3.SchemaObject,
      },
    } as OpenAPIV3.ComponentsObject,
  } as OpenAPIV3.Document,
  transform: createJsonSchemaTransform({
    skipList: ["/api/v1/auth/google", "/api/v1/auth/facebook"],
  }),
};
export const swaggerUiOptions = {
  routePrefix: "/docs",
};
