const {description, version} = require('./package');

module.exports = {
    id: 'com.aktasc.stremio-discord',
    name: '- Discord Rich Presence -',
    description : "Enable Discord Rich Presence support",
    catalogs: [],
    version,
    logo: 'https://i.imgur.com/HGIkQgD.png',
    resources: ['subtitles', 'stream'],
    types: ['movie', 'series'],
};
