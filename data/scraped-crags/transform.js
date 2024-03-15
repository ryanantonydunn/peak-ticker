const path = require("path");
const fs = require("fs");

const cragListHeaders = ["slug", "name", "pinType"];

const pinHeaders = ["id", "name", "latitude", "longitude"];

const routeHeaders = ["id", "pinId", "name", "stars", "grade"];

const cragList = [];

function processScrapedCragData(fileName) {
  const type = fileName.replace(/\.[^/.]+$/, "");
  const file = fs.readFileSync(path.join(__dirname, fileName));
  const json = JSON.parse(file);

  // build array of crags
  cragList.push([json.slug, json.name, "crag"]);

  // extract crags into csv
  const crags = json.crags.map((crag) => [
    crag.id,
    crag.name,
    crag.lat,
    crag.lng,
  ]);
  const srcCrag = path.join(__dirname, "../../public/data", `pins-${type}.csv`);
  const contentCrags = [pinHeaders, ...crags, []]
    .map((row) => row.join(","))
    .join("\n");
  fs.writeFileSync(srcCrag, contentCrags);

  // extract routes into csv
  const routes = [];
  json.crags.forEach((crag) => {
    crag.routes.forEach((route) => {
      routes.push([route.id, crag.id, route.name, route.stars, route.grade]);
    });
  });
  const srcRoute = path.join(
    __dirname,
    "../../public/data",
    `routes-${type}.csv`
  );
  const contentRoutes = [routeHeaders, ...routes, []]
    .map((row) => row.join(","))
    .join("\n");
  fs.writeFileSync(srcRoute, contentRoutes);
}

fs.readdirSync(__dirname)
  .filter((file) => path.extname(file) === ".json")
  .forEach(processScrapedCragData);

// Write crags list
const srcCragList = path.join(
  __dirname,
  "../../public/data",
  `pin-list-crags.csv`
);
const contentCragList = [cragListHeaders, ...cragList, []]
  .map((row) => row.join(","))
  .join("\n");
fs.writeFileSync(srcCragList, contentCragList);
