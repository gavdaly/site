import rss from "@astrojs/rss";

export const get = () =>
  rss({
    title: "GavDev",
    description: "description",
    site: import.meta.env.SITE,
    items: import.meta.glob("./garden/**/*.md"),
    customData: `<language>en-us</language>`,
  });
