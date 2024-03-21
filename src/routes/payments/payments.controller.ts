import { FastifyReply, FastifyRequest } from "fastify";
import * as payment from "./payments.model";
// import { FetchTaskQuery } from "./task.schemas";
export const fetchTypes = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await payment.fetchTypes();
  if (result) {
    return reply.status(200).send({
      success: true,
      types: result,
      error: "null",
      msg: "null",
    });
  } else {
    return reply.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const insert = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = Number(req.userId);
  console.log("User ID : ", userId);
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
  } = req.body as {
    payment_method_code: string;
    account: string;
    payment_input: string;
    amount: number;
    cashback_amount?: number;
    bonus_amount?: number;
    status: "created" | "processing" | "completed" | "declined";
    api_response?: string;
    api_reference_id?: string;
    api_status?: string;
    note?: string;
    admin_note?: string;
  };
  const checkMethodCode = await payment.fetchType(payment_method_code);
  console.log(checkMethodCode);
  if (!checkMethodCode) {
    return reply.status(404).send({
      error: "Invalid Payment Method Code",
    });
  }
  if (amount < Number(checkMethodCode.minimum_amount)) {
    return reply.status(400).send({
      error: "Amount is less than minimum amount",
    });
  }
  const paymentId = Math.floor(10000000 + Math.random() * 90000000).toString();
  const totalAmount = await payment.fetchAmount(userId);
  console.log(totalAmount);
  try {
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
        return reply.status(200).send({
          success: true,
          message: "Payment added successfully!",
        });
      } else {
        return reply.status(500).send({ error: "Payment insert fail" });
      }
    } else {
      return reply.status(400).send({
        error: "Insufficient Balance",
      });
    }
  } catch (error) {
    return reply.status(400).send({
      error: error,
    });
  }
};
