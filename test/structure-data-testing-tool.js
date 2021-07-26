const assert = require("assert");
const { testSchema } = require("./utils");

describe("Structure data tool testing", () => {
  const homePageSchema = ["Organization", "Website", "BreadcrumbList"];
  it("Home page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io";
    testSchema(url, homePageSchema);
  });
  it("Text story page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io/technology/automobiles/how-to-analyse-data";
    const schemas = ["NewsArticle", "BreadcrumbList"];
    testSchema(url, schemas);
  });
  it("Photo story page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io/entertainment/photo-story";
    const schemas = ["NewsArticle", "BreadcrumbList"];
    testSchema(url, schemas);
  });
  it("Video story page", () => {
    const url = "  https://malibu-advanced-web.qtstage.io/technology/gadgets/video-story";
    const schemas = ["NewsArticle", "BreadcrumbList", "VideoObject"];
    testSchema(url, schemas);
  });
  it("Live blog story page", () => {
    const url = "https://malibu-advanced-web.qtstage.io/politics/live-blog-story";
    const schemas = ["NewsArticle", "BreadcrumbList", "LiveBlogPosting"];
    testSchema(url, schemas);
  });
  it("Listicle story page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io/technology/listicle-story-test";
    const schemas = ["NewsArticle", "BreadcrumbList", "Orgenization"];
    testSchema(url, schemas);
  });
  it("Section page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io/sports";
    testSchema(url, homePageSchema);
  });
  it("Search page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io/search?q=science";
    testSchema(url, homePageSchema);
  });
  it("Author page", async () => {
    const url = "https://malibu-advanced-web.qtstage.io/author/deo-kumar-2";
    testSchema(url, homePageSchema);
  });
});
