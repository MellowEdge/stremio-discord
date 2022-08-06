const manifest = require("./manifest");
const { addonBuilder } = require("stremio-addon-sdk");
const imdb = require("./imdb-promise");
const updatePresence = require("./rpc");
const parseDuration = require("./movie-duration");

const addon = new addonBuilder(manifest);

// Base informations aka not watching anything currently
function showStartupPresence() {
  updatePresence({
    details: "Stremio",
    state: "Just browsing",
    largeImageKey: "stremio-logo",
    largeImageText: "https://www.stremio.com/",
  });
}

// Starting the Rich Presence
showStartupPresence();

addon.defineSubtitlesHandler(async (args) => {
  const id = args.id.split(":")[0];
  const info = await imdb(args);
  const season = args.type == "series" ? args.id.split(":")[1] : null;
  const episode = args.type == "series" ? args.id.split(":")[2] : null;

  if (info == null) throw "stremio-discord: no imdb data found for " + id;

  // Removing all the excess data
  delete info["videos"];

  // Translating '30 min' into timestamp
  const duration = parseDuration(info.runtime);

  switch (args.type) {
    case "movie": {
      updatePresence({
        details: `${info.name} (${info.year})`,
        state: `IMDB Rating : ${info.imdbRating}/10 ⭐`,
        startTimestamp: Date.now(),
        endTimestamp: duration.estimatedWatchedDate,
        largeImageKey: info.poster,
        largeImageText: info.name
      });
      break;
    }
    // Show Season & Episode if series
    case "series": {
      updatePresence({
        details: info.name,
        state: `S${season}.E${episode} - ${info.imdbRating}/10 ⭐`,
        startTimestamp: Date.now(),
        endTimestamp: duration.estimatedWatchedDate,
        largeImageKey: info.poster,
		largeImageText: info.name
      });
      break;
    }
  }

  setTimeout(() => showStartupPresence(), duration.seconds * 1000);

  return Promise.resolve({ subtitles: [] });
});

addon.defineStreamHandler(async (args) => {
  const info = await imdb(args);
  const typeStr = info.type == "movie" ? "movie" : "show";
  updatePresence({
    details: `Looking for a ${typeStr}`,
    state: `Might watch \"${info.name}\"`,
    largeImageKey: info.poster,
	largeImageText: info.name
  });

  return Promise.resolve({ streams: {}, cacheMaxAge: 0 });
});

module.exports = addon.getInterface();
