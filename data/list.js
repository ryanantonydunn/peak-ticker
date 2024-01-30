const path = require("path");
const Papa = require("papaparse");
const fs = require("fs");

// Data sourced from https://www.hills-database.co.uk/downloads.html

const headers = [
  "id",
  "name",
  "type",
  "height",
  "latitude",
  "longitude",
  "url",
];

async function extractItems(data, matcher, type) {
  const newRows = data
    .filter((row) => row[matcher] === 1)
    .map((row) => [
      row.Number,
      row.Name,
      type,
      row.Metres,
      row.Latitude,
      row.Longitude,
      row["Hill-bagging"],
    ]);
  const src = path.join(__dirname, "../public/data", `${type}.csv`);
  const content = [headers, ...newRows, []]
    .map((row) => row.join(","))
    .join("\n");
  fs.writeFileSync(src, content);
}

Papa.parse(fs.createReadStream(path.join(__dirname, "list.csv")), {
  header: true,
  dynamicTyping: true,
  complete: async (results) => {
    await extractItems(results.data, "W", "wainwright");
    await extractItems(results.data, "M", "munro");
  },
});
