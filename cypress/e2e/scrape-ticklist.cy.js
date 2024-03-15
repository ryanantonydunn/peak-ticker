const slug = Cypress.env("SLUG");

// Get crag and route information from the popup html
// eg: "\n\t\t\t<h3 class=''><a href='/logbook/crag.php?id=28'>Hell's Lum</a></h3>\n\t\t\t\n\t\t\t<h4>Routes: 1</h4><ul class=\"list-group list-group-flush \"><li class=\"list-group-item px-0 py-1 d-flex\"><i class=\"my-auto fa-fw mr-1 fas fa-list\" title=\"You have not done this route yet\" data-toggle=\"tooltip\"></i> <a href=\"/logbook/c.php?i=4766\"  target=\"_blank\" class=\"mr-auto\">The Clean Sweep<sup>***</sup></a><span class=\"ml-1\"><i>VS</i></span> <span class=\"text-muted ml-1\"><span class='text-muted'>4c</span></span></li></ul>\n\t\t\t\n\t\t\t\n"
function getCragAndRoutesFromHtml(htmlString) {
  const el = document.createElement("div");
  el.innerHTML = htmlString;
  const name = el.children[0].children[0].innerText;
  const routes = [...el.children[2].children].map((li) => {
    return {
      id: li.children[1].getAttribute("href").split("?i=")[1],
      name: li.children[1].childNodes[0].textContent,
      stars: li.children[1].childNodes[1]?.innerText || "",
      grade: li.children[2].children[0].innerText,
    };
  });
  return {
    name,
    routes,
  };
}

// Get crag IDs and positions from leaflet layers objrct
function extractCragsFromLeaflet(layers) {
  const crags = [];

  function extractLayer(layer) {
    const { name, routes } = getCragAndRoutesFromHtml(layer._popup?._content);
    crags.push({
      id: layer.options?.crag_id,
      lat: layer._latlng.lat,
      lng: layer._latlng.lng,
      name,
      routes,
    });
  }

  function checkLayer(layer) {
    // if this layer has crag data
    if (layer?.options?.crag_id) {
      return extractLayer(layer);
    }

    // get any markers with crag ID's
    (layer?._markers || []).forEach(checkLayer);

    // look for child clusters further down
    (layer?._childClusters || []).forEach(checkLayer);
  }

  Object.values(layers).forEach(checkLayer);

  return crags.sort((a, b) => a.id - b.id);
}

describe("scraper", () => {
  it("scrapes the crag data for a ticklist", () => {
    cy.task("log", `Slug: ${slug}`);
    cy.visit(`https://www.ukclimbing.com/logbook/ticklists/${slug}#map`);
    cy.get("h1")
      .invoke("text")
      .then((name) => {
        cy.task("log", `Name: ${name}`);
        cy.get(".leaflet-container", { timeout: 10000 }).should("be.visible");
        cy.window().then((obj) => {
          const crags = extractCragsFromLeaflet(obj.myMap._layers);
          cy.task("log", `Crags: ${crags}`);
          cy.writeFile(
            `data/scraped-crags/${slug}.json`,
            JSON.stringify({ name, slug, crags })
          );
        });
      });
  });
});
