import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://adeyinkabakarefellowship.org",
      lastModified: new Date(),
    },
  ];
}
