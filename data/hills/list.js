const path = require("path");
const Papa = require("papaparse");
const fs = require("fs");

// Data sourced from https://www.hills-database.co.uk/downloads.html

const pinHeaders = ["id", "name", "latitude", "longitude"];

const routeHeaders = ["id", "pinId", "name", "height", "url"];

async function extractItems(data, matcher, type) {
  // write pin CSV
  const pinRows = data
    .filter((row) => row[matcher] === 1)
    .map((row) => [row.Number, "", row.Latitude, row.Longitude]);
  const pinSrc = path.join(__dirname, "../../public/data", `pins-${type}.csv`);
  const pinContent = [pinHeaders, ...pinRows, []]
    .map((row) => row.join(","))
    .join("\n");
  fs.writeFileSync(pinSrc, pinContent);

  // write route CSV
  const routeRows = data
    .filter((row) => row[matcher] === 1)
    .map((row) => [
      row.Number,
      row.Number,
      row.Name,
      row.Metres,
      row["Hill-bagging"],
    ]);
  const routeSrc = path.join(
    __dirname,
    "../../public/data",
    `routes-${type}.csv`
  );
  const routeContent = [routeHeaders, ...routeRows, []]
    .map((row) => row.join(","))
    .join("\n");
  fs.writeFileSync(routeSrc, routeContent);
}

Papa.parse(fs.createReadStream(path.join(__dirname, "list.csv")), {
  header: true,
  dynamicTyping: true,
  complete: async (results) => {
    await extractItems(results.data, "W", "wainwright");
    await extractItems(results.data, "M", "munro");
  },
});

const hillsList = [
  "slug,name,pinType",
  "wainwright,Wainwrights,hill",
  "munro,Munros,hill",
  "",
].join("\n");
const hillsListSrc = path.join(
  __dirname,
  "../../public/data",
  `pin-list-hills.csv`
);
fs.writeFileSync(hillsListSrc, hillsList);
