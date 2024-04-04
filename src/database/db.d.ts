import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Banners {
  btn_link: string;
  btn_text: string;
  created_at: Generated<Date>;
  description: string;
  desktop_img: string;
  have_content: Generated<number | null>;
  id: Generated<number | null>;
  link: string;
  mobile_img: string;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Generated<Date | null>;
}

export interface Blocks {
  blocks: string;
  content: string;
  created_at: Generated<Date>;
  description: string;
  id: Generated<number>;
  name: string;
  purpose: string;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Generated<Date | null>;
}

export interface BonusTypes {
  amount: Decimal;
  code: string;
  enabled: Generated<number>;
  id: number;
  name: string;
  qualifying_amount: number;
  validity_days: Generated<number>;
}

export interface Menus {
  created_at: Generated<Date>;
  id: Generated<number>;
  links: string;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  "updated-at": Generated<Date | null>;
}

export interface OfferwallCategories {
  banner_img: Generated<string | null>;
  bg_color: Generated<string | null>;
  created_at: Generated<Date | null>;
  fg_color: Generated<string | null>;
  icon: Generated<string | null>;
  id: Generated<number>;
  is_featured: Generated<number>;
  item_count: Generated<number>;
  mapping_for: Generated<string>;
  match_keywords: string;
  match_order: Generated<number>;
  name: string;
  sort_order: Generated<number>;
  updated_at: Generated<Date | null>;
}

export interface OfferwallNetworks {
  api_key: Generated<string | null>;
  app_id: Generated<string | null>;
  categories: Generated<string | null>;
  code: string;
  config_params: Generated<string | null>;
  countries: Generated<string | null>;
  created_at: Generated<Date | null>;
  enabled: Generated<number | null>;
  id: Generated<number>;
  logo: Generated<string | null>;
  name: string;
  postback_key: Generated<string | null>;
  postback_validation_key: Generated<string | null>;
  pub_id: Generated<string | null>;
  type: "surveys" | "tasks";
  updated_at: Generated<Date | null>;
}

export interface OfferwallPostbackLogs {
  created_at: Generated<Date | null>;
  data: string;
  id: Generated<number>;
  message: string;
  network: string;
  payload: string;
  status: Generated<"error" | "pending" | "processed">;
  transaction_id: Generated<string | null>;
  updated_at: Generated<Date | null>;
}

export interface OfferwallTaskGoals {
  cashback: Generated<Decimal>;
  created_at: Generated<Date | null>;
  description: Generated<string | null>;
  id: Generated<number>;
  image: Generated<string | null>;
  is_translated: Generated<number>;
  name: string;
  network: string;
  network_goal_id: string;
  network_goal_name: string;
  network_task_id: string;
  revenue: Generated<Decimal>;
  status: Generated<"draft" | "publish" | "trash" | null>;
  task_offer_id: string;
  updated_at: Generated<Date | null>;
}

export interface OfferwallTasks {
  campaign_id: string;
  category_id: number;
  clicks: Generated<number>;
  conversion_rate: Generated<Decimal | null>;
  countries: Generated<string | null>;
  created_at: Generated<Date | null>;
  created_date: Generated<Date | null>;
  daily_cap: Generated<Decimal | null>;
  description: Generated<string | null>;
  devices: Generated<string | null>;
  end_date: Generated<Date | null>;
  goals_count: Generated<number>;
  id: Generated<number>;
  image: Generated<string | null>;
  instructions: Generated<string | null>;
  is_featured: Generated<number>;
  is_translated: Generated<number>;
  name: string;
  network: string;
  network_categories: Generated<string | null>;
  network_goals: Generated<string | null>;
  offer_id: string;
  offer_type: Generated<string | null>;
  payout: Generated<Decimal>;
  platforms: Generated<string | null>;
  redemptions: Generated<number>;
  score: Generated<Decimal | null>;
  start_date: Generated<Date | null>;
  status: Generated<"draft" | "publish" | "trash" | null>;
  updated_at: Generated<Date | null>;
  url: string;
}

export interface Pages {
  content: string;
  created_at: Generated<Date>;
  exclude_seo: number;
  id: Generated<number>;
  name: string;
  slug: Generated<string | null>;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Generated<Date | null>;
}

export interface PaymentTypes {
  account_input_hint: string;
  account_input_label: string;
  account_input_type: string;
  bonus_allowed: Generated<number>;
  cashback_allowed: Generated<number>;
  code: string;
  created_at: Generated<Date>;
  deleted_at: Generated<Date>;
  enabled: Generated<number>;
  id: Generated<number>;
  image: string;
  minimum_amount: Decimal;
  name: string;
  payment_group: string;
  payment_inputs: string;
  transaction_bonus_amount: Generated<Decimal | null>;
  transaction_bonus_type: Generated<"fixed" | "percent" | null>;
  transaction_fees_amount: Generated<Decimal | null>;
  transaction_fees_type: Generated<"fixed" | "percent" | null>;
  updated_at: Generated<Date>;
}

export interface Settings {
  created_at: Generated<Date | null>;
  group: Generated<string>;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Date | null>;
  val: Generated<string | null>;
}

export interface Translations {
  id: Generated<number>;
  module: Generated<string | null>;
  page: string;
  trans_key: string;
  trans_value: Generated<string | null>;
}

export interface UserActivities {
  activity_type: "bonus_earnings" | "payouts" | "referral_earnings" | "referrals" | "tasks_earnings";
  activity_user_id: number;
  amount: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  status: string;
  title: string;
  updated_at: Generated<Date | null>;
  url: string;
}

export interface UserBonus {
  admin_note: Generated<string | null>;
  amount: Decimal;
  awarded_on: Generated<Date | null>;
  bonus_code: string;
  created_at: Generated<Date | null>;
  expires_on: Generated<Date | null>;
  id: Generated<number>;
  referred_bonus_id: Generated<number | null>;
  status: Generated<"confirmed" | "declined" | "pending">;
  updated_at: Generated<Date | null>;
  user_id: number;
}

export interface UserOfferwallSales {
  amount: Decimal;
  created_at: Generated<Date | null>;
  extra_info: Generated<string | null>;
  id: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: Generated<string | null>;
  offer_id: string;
  payout: Decimal;
  status: Generated<"confirmed" | "declined" | "pending">;
  task_name: string;
  task_offer_id: string;
  task_type: string;
  transaction_id: string;
  updated_at: Generated<Date | null>;
  user_id: number;
}

export interface UserPayments {
  account: string;
  admin_note: Generated<string | null>;
  amount: number;
  api_reference_id: Generated<string | null>;
  api_response: Generated<string | null>;
  api_status: Generated<string | null>;
  bonus_amount: Generated<number | null>;
  cashback_amount: Generated<number | null>;
  created_at: Generated<Date>;
  id: Generated<number>;
  note: Generated<string | null>;
  paid_at: Generated<Date | null>;
  payment_id: number;
  payment_input: string;
  payment_method_code: string;
  status: "completed" | "created" | "declined" | "processing";
  updated_at: Generated<Date>;
  user_id: number;
}

export interface Users {
  created_at: Generated<Date | null>;
  email: string;
  facebookId: Generated<string | null>;
  googleId: Generated<string | null>;
  id: Generated<number>;
  is_verified: Generated<number | null>;
  name: string;
  password: Generated<string | null>;
  referral_code: string;
  referrer_code: Generated<string | null>;
  updated_at: Generated<Date | null>;
}

export interface UserTaskClicks {
  campaign_id: string;
  clicked_on: Generated<Date>;
  countries: string;
  created_at: Generated<Date>;
  id: Generated<number>;
  locale: string;
  network: string;
  platform: string;
  Referer: string;
  task_offer_id: Generated<string | null>;
  task_type: string;
  updated_at: Generated<Date | null>;
  user_agent: string;
  user_id: number;
}

export interface UserTasks {
  amount: Decimal;
  created_at: Generated<Date | null>;
  extra_info: Generated<string | null>;
  id: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: Generated<string | null>;
  offer_id: string;
  payout: Decimal;
  status: Generated<"confirmed" | "declined" | "pending">;
  task_name: string;
  task_offer_id: Generated<string | null>;
  task_type: string;
  transaction_id: string;
  updated_at: Generated<Date | null>;
  user_id: number;
}

export interface DB {
  banners: Banners;
  blocks: Blocks;
  bonus_types: BonusTypes;
  menus: Menus;
  offerwall_categories: OfferwallCategories;
  offerwall_networks: OfferwallNetworks;
  offerwall_postback_logs: OfferwallPostbackLogs;
  offerwall_task_goals: OfferwallTaskGoals;
  offerwall_tasks: OfferwallTasks;
  pages: Pages;
  payment_types: PaymentTypes;
  settings: Settings;
  translations: Translations;
  user_activities: UserActivities;
  user_bonus: UserBonus;
  user_offerwall_sales: UserOfferwallSales;
  user_payments: UserPayments;
  user_task_clicks: UserTaskClicks;
  user_tasks: UserTasks;
  users: Users;
}
