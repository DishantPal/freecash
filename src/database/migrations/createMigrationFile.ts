import fs from "fs";
function generateMigration(userInput: string) {
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    "_" +
    (date.getMonth() + 1) +
    "_" +
    date.getDate() +
    "_" +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds();
  const filename = timestamp + "_" + userInput + ".ts";

  const content = `
  import { Kysely } from "kysely";

  export async function up(db: Kysely<any>): Promise<void> {
    //
  }
  
  export async function down(db: Kysely<any>): Promise<void> {
    //
  }  
  `;

  fs.writeFileSync("src/database/migration/" + filename, content, "utf8");
}

// execute generateMigation with taking input from user from cli
generateMigration(process.argv[2]);
