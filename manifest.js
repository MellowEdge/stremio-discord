const {description, version} = require('./package');

module.exports = {
    id: 'com.aktasc.stremio-discord',
    name: 'Discord Rich Presence',
    description,
    catalogs: [],
    version,
    logo: 'https://i.imgur.com/HGIkQgD.png',
    resources: ['subtitles', 'stream'],
    types: ['movie', 'series'],
};
