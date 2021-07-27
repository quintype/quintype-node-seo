const assert = require("assert");
const { testSchema } = require("./utils");

const showResult = (result) => {
  if (result) {
    console.log(
      `Passed: ${result.passed.length},`,
      `Failed: ${result.failed.length},`,
      `Warnings: ${result.warnings.length}`
    );
    console.log(`Schemas found: ${result.schemas.join(",")}`);
    // Loop over validation errors
    if (result.failed.length > 0) {
      console.log(
        "⚠️  Errors:\n",
        result.failed.map((test) => test)
      );
    }
  }
};

describe("Structure data tool testing", () => {
  const homePageSchema = ["Organization", "Website", "BreadcrumbList"];
  it("Home page", async () => {
    const url = "https://malibu-advanced-web.quintype.io";
    const result = await testSchema(url, homePageSchema);
    showResult(result);
    assert.equal(0, result.failed.length);
  });
  it("Text story page", async () => {
    const url =
      "https://malibu-advanced-web.quintype.io/technology/automobiles/an-startling-fusion-of-technology-comfort-and-driver-experience";
    const schemas = ["NewsArticle", "BreadcrumbList"];
    const result = await testSchema(url, schemas);
    showResult(result);
    assert.equal(0, result.failed.length);
  });
  it("Photo story page", async () => {
    const url = "https://malibu-advanced-web.quintype.io/entertainment/government-of-goa-official-portal";
    const schemas = ["NewsArticle", "BreadcrumbList"];
    const result = await testSchema(url, schemas);
    showResult(result);
    assert.equal(0, result.failed.length);
  });
  it("Video story page", async () => {
    const url = "https://malibu-advanced-web.quintype.io/entertainment/goa";
    const schemas = ["NewsArticle", "BreadcrumbList", "VideoObject"];
    const result = await testSchema(url, schemas);
    showResult(result);
    assert.equal(0, result.failed.length);
  });
  // it("Live blog story page", async () => {
  //   const url =
  //     "https://malibu-advanced-web.quintype.io/entertainment/tata-motors-q1-results-revenue-tumbles-loss-higher-than-expectedneed to create";
  //   const schemas = ["NewsArticle", "BreadcrumbList", "LiveBlogPosting"];
  //   const result = await testSchema(url, schemas);
  //   showResult(result);
  //   assert.equal(0, result.failed.length);
  // });
  // it("Listicle story page", async () => {
  //   const url =
  //     "https://malibu-web.quintype.io/politics/international/share-market-live-sensex-nifty-hold-steady-gains";
  //   const schemas = ["NewsArticle", "BreadcrumbList"];
  //   const result = await testSchema(url, schemas);
  //   showResult(result);
  //   assert.equal(0, result.failed.length);
  // });
  it("Section page", async () => {
    const url = "https://malibu-advanced-web.quintype.io/sports";
    const result = await testSchema(url, ["BreadcrumbList"], false);
    showResult(result);
    assert.equal(0, result.failed.length);
  });
  it("Search page", async () => {
    const url = "https://malibu-advanced-web.quintype.io/search?q=india";
    const result = await testSchema(url, ["BreadcrumbList"], false);
    showResult(result);
    assert.equal(0, result.failed.length);
  }).timeout(3000);
  it("Author page", async () => {
    const url = "https://malibu-advanced-web.quintype.io/author/deo-kumar";
    const result = await testSchema(url, ["BreadcrumbList"], false);
    showResult(result);
    assert.equal(0, result.failed.length);
  }).timeout(3000);
});
