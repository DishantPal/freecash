import { FastifyInstance } from "fastify";
import app from "../app";

export const getSetCachedData = async <T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  cacheDuration: number
): Promise<T> => {
  let data: any = await app.redis.get(cacheKey);
  if (!data) {
    try {
      data = await fetchFunction();
      await app.redis.set(cacheKey, JSON.stringify(data));
      app.redis.expire(cacheKey, cacheDuration);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  return JSON.parse(data as string);
};
