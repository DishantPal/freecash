// import chkBonues from ./crons/chkBonues.js
// import fruadCheck from ./crons/fruadCheck.js
import checkBonuses from "./functions/checkBonuses";
export const config = [
  {
    name: "",
    cron: "* * * * *",
    task: checkBonuses,
  },
];
