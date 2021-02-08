const manifest = require("./manifest");
const { addonBuilder } = require("stremio-addon-sdk");
const imdb = require("./imdb-promise");
const updatePresence = require("./rpc");
const parseMovieDuration = require("./movie-duration");

const addon = new addonBuilder(manifest);

function showStartupPresence() {
  updatePresence({
    details: "https://stremio.com",
    state: "All the video content you enjoy in one place",
    largeImageKey: "stremio-logo",
    largeImageText: "https://stremio.com",
  });
}

showStartupPresence();

addon.defineSubtitlesHandler(async (args) => {
  const id = args.id.split(":")[0];
  const info = await imdb(args);

  if (info == null) throw "stremio-discord: no imdb data found for " + id;

  const movieDuration = parseMovieDuration(info.runtime);

  updatePresence({
    details: `🍿 ${info.name} (${info.year}) 🍿`,
    state: `⭐ ${info.imdbRating}/10 ⭐`,
    startTimestamp: Date.now(),
    endTimestamp: movieDuration.estimatedWatchedDate,
    largeImageKey: "stremio-logo",
    largeImageText: "https://stremio.com",
  });

  setTimeout(() => showStartupPresence(), movieDuration.seconds * 1000);

  return Promise.resolve({ subtitles: [] });
});

addon.defineStreamHandler(async (args) => {
  const info = await imdb(args);

  updatePresence({
    details: `🍿 Looking for a ${info.type}`,
    state: `⭐ Might watch ${info.name}`,
    largeImageKey: "stremio-logo",
    largeImageText: "https://stremio.com",
  });

  return Promise.resolve({ streams: {}, cacheMaxAge: 0 });
});

module.exports = addon.getInterface();
