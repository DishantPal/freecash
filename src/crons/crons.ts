import cron from "node-cron";
import { config } from "./cronConfig";

config.forEach((cc) => {
  cron.schedule(cc.cron, cc.task);
});
