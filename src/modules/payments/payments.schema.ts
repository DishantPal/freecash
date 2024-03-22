import { z } from "zod";

export type bodyType = {
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
export interface UserPayment {
  payment_id: number;
  user_id: number;
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
  paid_at?: Date | null;
}
