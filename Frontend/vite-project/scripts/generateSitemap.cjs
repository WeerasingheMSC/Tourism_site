const fs = require("fs");
const path = require("path");

const generateSitemap = () => {
  const baseUrl = "https://travelbookingsrilanka.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticUrls = [
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/packages`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotels`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/CustomPackageForm`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.5,
    },
    // Add specific destination pages based on popular Sri Lankan attractions
    {
      url: `${baseUrl}/destinations/sigiriya`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations/kandy`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations/ella`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations/dambulla`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations/galle`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations/yala`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
  ];

  // Generate XML sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map(
    ({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
    ${priority ? `<priority>${priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.resolve(process.cwd(), "public");
  fs.writeFileSync(`${publicDir}/sitemap.xml`, sitemapXml);

  console.log("Sitemap generated successfully!");
  console.log(`Generated sitemap with ${staticUrls.length} URLs`);
};

// Generate robots.txt
const generateRobotsTxt = () => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://travelbookingsrilanka.com/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /register

# Allow social media bots
User-agent: facebookexternalhit
Allow: /

User-agent: twitterbot
Allow: /`;

  const publicDir = path.resolve(process.cwd(), "public");
  fs.writeFileSync(`${publicDir}/robots.txt`, robotsTxt);

  console.log("robots.txt generated successfully!");
};

// Run the generators
generateSitemap();
generateRobotsTxt();

module.exports = { generateSitemap, generateRobotsTxt };
