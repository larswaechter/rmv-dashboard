const fs = require("fs");
const db = require("../src/config/db");

const schema = fs.readFileSync("db/schema.sql", {
  encoding: "utf-8",
});

db.serialize(() => {
  const queries = schema.split(";").filter((query) => query.length > 2);
  console.log(queries);
  queries.forEach((query) =>
    db.run(query, [], (err) => {
      if (err) throw err;
    })
  );
});
