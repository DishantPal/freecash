export const activityConfig = {
  tasks_earnings: {
    icon: "tasks_icon.png",
    url: "/earnings/tasks",
    title_create: "Confirmed earnings for task: #TASK_NAME",
  },
  bonus_earnings: {
    icon: "bonus_icon.png",
    url: "/earnings/bonus",
    title_create: "You've received a new bonus!",
    title_status_confirmed: "Your bonus has been confirmed!",
    title_status_assigned: "Your bonus has been assigned!",
    title_status_declined: "Your bonus has been declined",
  },
  referral_earnings: {
    icon: "referral_icon.png",
    url: "/earnings/referral",
    title_create: "You've earned from a referral!",
    title_status_confirmed: "Your referral earnings have been confirmed!",
    title_status_declined: "Your referral earnings have been declined",
  },
  referrals: {
    icon: "referrals_icon.png",
    url: "/referrals",
    title_create: "You have referred a new user #USERID",
  },
  payouts: {
    icon: "payouts_icon.png",
    url: "/payouts",
    title_create: "Request a new payout",
    title_status_confirmed: "Your payout has been processed",
    title_status_declined: "Your payout request has been declined",
  },
};
