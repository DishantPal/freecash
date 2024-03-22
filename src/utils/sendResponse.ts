import { FastifyReply } from "fastify";
export function success(
  reply: FastifyReply,
  statusCode: number,
  data: any,
  msg: string | null
) {
  return reply.status(statusCode).send({
    success: true,
    data: data,
    error: "null",
    msg: msg,
  });
}
export function error(reply: FastifyReply, statusCode: number, error: string) {
  return reply.status(statusCode).send({
    error: error,
  });
}
