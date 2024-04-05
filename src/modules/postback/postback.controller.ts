import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
import { postbackQuerySchema } from "./post.schema";
import crypto from "crypto";
import * as networks from "./networks.model";
import * as postback from "./postback.model";
import { activityConfig } from "../../config/activityConfig";
import { dispatchEvent } from "../../events/eventBus";
const validateHash = (receivedHash: string, combinedData: any) => {
  // Create a hash using the combined data and the secret key
  const generatedHash = crypto
    .createHash("md5")
    .update(combinedData.toString())
    .digest("hex");
  console.log(generatedHash);
  // Compare the generated hash with the received hash
  return generatedHash === receivedHash;
};
export const validate = async (req: FastifyRequest, reply: FastifyReply) => {
  const {
    type,
    network,
    transaction_id,
    user_id,
    offer_name,
    offer_id,
    amount,
    payout,
    network_goal_id,
    ikey,
    hash,
  } = req.query as postbackQuerySchema;

  const data = {
    type: type,
    network: network,
    transaction_id: transaction_id,
    user_id: user_id,
    offer_name: offer_name,
    offer_id: offer_id,
    amount: amount,
    payout: payout,
    network_goal_id: network_goal_id,
    ikey: ikey,
    hash: hash,
  };
  // const insertTask = await postback.insertTask(
  //   network,
  //   network + offer_id,
  //   offer_id,
  //   transaction_id,
  //   Number(user_id),
  //   offer_name,
  //   type,
  //   Number(amount),
  //   Number(payout),
  //   "pending",
  //   data
  // );
  await postback.insert(
    network,
    transaction_id,
    Number(user_id),
    network + offer_id,
    network_goal_id,
    offer_id,
    offer_name,
    type,
    Number(amount),
    Number(payout),
    "pending",
    data,
    0
  );
  const res = await networks.fetch(type, network);
  if (res?.postback_validation_key === ikey) {
    const validateData = {
      type: type,
      network: network,
      transaction_id: transaction_id,
      user_id: user_id,
      offer_name: offer_name,
      offer_id: offer_id,
      amount: amount,
      payout: payout,
      network_goal_id: network_goal_id,
      ikey: ikey,
    };
    const validate = validateHash(hash, validateData);
    if (validate) {
      // Update task status to "confirmed" instead of inserting a new record
      const result = await postback.updateTaskStatus(
        transaction_id,
        "confirmed"
      );
      const ins = await postback.insertLog(
        network,
        transaction_id,
        data,
        data,
        "processed",
        "Postback Hash Verification Successful"
      );
      ////taskearning_activity
      dispatchEvent("send_user_activity", {
        user_id: user_id,
        activity_type: "tasks_earnings",
        icon: activityConfig.tasks_earnings.icon,
        title: activityConfig.tasks_earnings.title_create,
        status: "confirmed",
        url: activityConfig.tasks_earnings.url,
        amount: Number(amount),
        data: JSON.stringify({
          message: "Postback Hash Verification Successful",
          task_name: offer_id,
        }),
      });
      return reply.sendSuccess(
        "",
        200,
        "Postback Hash Verification Successful"
      );
    } else {
      // Log the error as before
      const ins = await postback.insertLog(
        network,
        transaction_id,
        data,
        data,
        "error",
        "Postback Hash Verification Missing"
      );
      dispatchEvent("send_user_activity", {
        user_id: user_id,
        activity_type: "tasks_earnings",
        icon: activityConfig.tasks_earnings.icon,
        title: activityConfig.tasks_earnings.title_create,
        status: "failed",
        url: activityConfig.tasks_earnings.url,
        amount: Number(amount),
        data: JSON.stringify({
          message: "Postback Hash Verification Missing",
          task_name: offer_id,
        }),
      });
      return reply.sendError("Postback Hash Verification Missing", 401);
    }
  } else {
    const ins = await postback.insertLog(
      network,
      transaction_id,
      data,
      data,
      "error",
      "ikey is invalid"
    );
    dispatchEvent("send_user_activity", {
      user_id: user_id,
      activity_type: "tasks_earnings",
      icon: activityConfig.tasks_earnings.icon,
      title: activityConfig.tasks_earnings.title_create,
      status: "failed",
      url: activityConfig.tasks_earnings.url,
      amount: Number(amount),
      data: JSON.stringify({ message: "ikey is invalid", task_name: offer_id }),
    });
    if (ins) {
      return reply.sendError("ikey is invalid", 401);
    } else {
      return reply.sendError("Error creating log", 503);
    }
  }
};
