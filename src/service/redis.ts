import { FastifyRedis } from "@fastify/redis";
import { FastifyPluginAsync } from "fastify";
import Redis from "ioredis";

declare module "fastify" {
  interface FastifyInstance {
    redis: FastifyRedis;
  }
}

const redisPlugin: FastifyPluginAsync<{ url: string }> = async (
  fastify,
  options
) => {
  const redis: any = new Redis(options.url);
  // Decorate the fastify instance with the redis client
  // Correct the decoration to directly assign the Redis instance
  fastify.decorate("redis", redis);

  // Graceful shutdown
  fastify.addHook("onClose", (fastifyInstance, done) => {
    fastifyInstance.redis.quit().then(() => done());
  });
  return redis;
};

export default redisPlugin;
