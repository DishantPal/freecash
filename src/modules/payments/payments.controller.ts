import { FastifyReply, FastifyRequest } from "fastify";
import * as payment from "./payments.model";
import { bodyType } from "./payments.schema";
export const insert = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = Number(req.userId);
  const {
    payment_method_code,
    account,
    payment_input,
    amount,
    status,
    api_response,
    api_reference_id,
    api_status,
    note,
    admin_note,
  } = req.body as bodyType;
  const checkMethodCode = await payment.fetchType(payment_method_code);
  if (!checkMethodCode) {
    return reply.sendError("Invalid Payment Method Code", 404);
  }
  if (amount < Number(checkMethodCode.minimum_amount)) {
    return reply.sendError(
      `Minimum Amount is ${checkMethodCode.minimum_amount}`,
      400
    );
  }
  const paymentId = Math.floor(10000000 + Math.random() * 90000000).toString();
  const totalAmount = await payment.fetchAmount(userId);

  if (totalAmount && totalAmount.total > 0 && amount <= totalAmount.total) {
    const result = await payment.insert({
      payment_id: Number(paymentId),
      user_id: userId,
      payment_method_code: payment_method_code,
      account: account,
      payment_input: payment_input,
      amount: amount,
      status: status,
      api_response: api_response,
      api_reference_id: api_reference_id,
      api_status: api_status,
      note: note,
      admin_note: admin_note,
    });
    if (result) {
      return reply.sendSuccess("", 200, "Inserted SuccessFull");
    } else {
      return reply.sendError("Payment Inserted Failed", 500);
    }
  } else {
    return reply.sendError("Insufficient Balance", 400);
  }
};
