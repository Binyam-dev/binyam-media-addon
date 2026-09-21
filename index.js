"use strict";

const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const PORT = Number(process.env.PORT || 7000);

const manifest = {
  id: "com.binyam.mediaaddon",
  version: "1.0.0",
  name: "Binyam Media Addon",
  description: "Custom Stremio addon development platform",
  resources: ["catalog", "meta", "stream"],
  types: ["movie"],
  idPrefixes: ["binyam:"],
  catalogs: [
    {
      type: "movie",
      id: "binyam-catalog",
      name: "Binyam Media"
    }
  ]
};

const builder = new addonBuilder(manifest);

/*
 * Demo catalog.
 * Later this can be replaced with your own database/API.
 */
const catalog = [
  {
    id: "binyam:bbb",
    type: "movie",
    name: "Big Buck Bunny",
    description: "Open movie used for testing the Stremio addon.",
    poster:
      "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg"
  }
];

/* -------------------- CATALOG -------------------- */

builder.defineCatalogHandler(async ({ type, id }) => {
  console.log(`[catalog] type=${type} id=${id}`);

  if (type !== "movie" || id !== "binyam-catalog") {
    return { metas: [] };
  }

  return {
    metas: catalog.map(({ description, ...meta }) => meta)
  };
});

/* -------------------- METADATA -------------------- */

builder.defineMetaHandler(async ({ type, id }) => {
  console.log(`[meta] type=${type} id=${id}`);

  const item = catalog.find(
    entry => entry.type === type && entry.id === id
  );

  if (!item) {
    return { meta: null };
  }

  return {
    meta: item
  };
});

/* -------------------- STREAMS -------------------- */

builder.defineStreamHandler(async ({ type, id }) => {
  console.log(`[stream] type=${type} id=${id}`);

  if (type !== "movie") {
    return { streams: [] };
  }

  if (id === "binyam:bbb") {
    return {
      streams: [
        {
          name: "Binyam Demo",
          title: "Big Buck Bunny — Test Stream",
          url:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      ]
    };
  }

  return { streams: [] };
});

/* -------------------- ERROR HANDLING -------------------- */

process.on("uncaughtException", error => {
  console.error("[fatal] Uncaught exception:", error);
});

process.on("unhandledRejection", error => {
  console.error("[error] Unhandled rejection:", error);
});

/* -------------------- SERVER -------------------- */

console.log("---------------------------------------");
console.log(" Binyam Media Addon");
console.log("---------------------------------------");
console.log(`Starting server on port ${PORT}...`);

serveHTTP(builder.getInterface(), {
  port: PORT,
  host: "0.0.0.0"
});

console.log(`Manifest: http://localhost:${PORT}/manifest.json`);
console.log(`Fire TV:  http://100.110.160.169:${PORT}/manifest.json`);
console.log("---------------------------------------");

