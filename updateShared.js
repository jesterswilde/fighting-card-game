const ncp = require('ncp').ncp;

const locations = ['server/shared', 'cardMaker/src/shared', 'game-client/src/shared'];

locations.forEach((loc) => {
    ncp('shared', loc, function (err) {
        if (err) {
            return console.error(err);
        }
    });
});