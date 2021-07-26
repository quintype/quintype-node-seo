const assert = require("assert");
const { testSchema } = require("./utils");

describe("Structure data tool testing", () => {
  const homePageSchema = ["Organization", "Website", "BreadcrumbList"];
  // it("Home page", async () => {
  //   const url = "https://malibu-advanced-web.qtstage.io";
  //   const res = await testSchema(url, homePageSchema);
  //   console.log("here home res", res);
  // });
  // it("Text story page", async () => {
  //   const url = "https://malibu-advanced-web.qtstage.io/technology/automobiles/how-to-analyse-data";
  //   const schemas = ["NewsArticle", "BreadcrumbList"];
  //   testSchema(url, schemas);
  // });
  // it("Photo story page", async () => {
  //   const url = "https://malibu-advanced-web.qtstage.io/entertainment/photo-story";
  //   const schemas = ["NewsArticle", "BreadcrumbList"];
  //   testSchema(url, schemas);
  // });
  // it("Video story page", () => {
  //   const url = "  https://malibu-advanced-web.qtstage.io/technology/gadgets/video-story";
  //   const schemas = ["NewsArticle", "BreadcrumbList", "VideoObject"];
  //   testSchema(url, schemas);
  // });
  // it("Live blog story page", () => {
  //   const url = "https://malibu-advanced-web.qtstage.io/politics/live-blog-story";
  //   const schemas = ["NewsArticle", "BreadcrumbList", "LiveBlogPosting"];
  //   testSchema(url, schemas);
  // });
  // it("Listicle story page", async () => {
  //   const url = "https://malibu-advanced-web.qtstage.io/technology/listicle-story-test";
  //   const schemas = ["NewsArticle", "BreadcrumbList"];
  //   const res = await testSchema(url, schemas);
  //   console.log(res, "res as");
  // });
  // it("Section page", async () => {
  //   const url = "https://malibu-advanced-web.qtstage.io/sports";
  //   testSchema(url, ["BreadcrumbList"]);
  // });
  // it("Search page", async () => {
  //   const url = "https://malibu-advanced-web.qtstage.io/search?q=science";
  //   testSchema(url, ["BreadcrumbList"], false);
  // });
  it("Author page", async () => {
    const url = "https://malibu-advanced-web.quintype.io/author/deo-kumar-3";
    const result = await testSchema(url, ["BreadcrumbList"], false);
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
  });
});
