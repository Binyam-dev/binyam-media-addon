"use strict";

const { addonBuilder, getRouter } = require("stremio-addon-sdk");

const manifest = {
  id: "com.binyam.mediaaddon",
  version: "1.0.1",
  name: "Binyam Media Addon",
  description: "Custom Stremio addon development platform",
  resources: ["catalog", "meta", "stream"],
  types: ["movie"],
  idPrefixes: ["binyam:"],
  catalogs: [{ type: "movie", id: "binyam-catalog", name: "Binyam Media" }]
};

const builder = new addonBuilder(manifest);
const catalog = [{ id: "binyam:bbb", type: "movie", name: "Big Buck Bunny", description: "Open movie used for testing the Stremio addon.", poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg" }];

builder.defineCatalogHandler(async ({ type, id }) => type === "movie" && id === "binyam-catalog" ? { metas: catalog.map(({ description, ...meta }) => meta) } : { metas: [] });
builder.defineMetaHandler(async ({ type, id }) => ({ meta: catalog.find(x => x.type === type && x.id === id) || null }));
builder.defineStreamHandler(async ({ type, id }) => type === "movie" && id === "binyam:bbb" ? { streams: [{ name: "Binyam Demo", title: "Big Buck Bunny — Test Stream", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }] } : { streams: [] });

module.exports = getRouter(builder.getInterface());
