"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var sortOrder_1 = require("./shared/sortOrder");
var cards;
var run = function () {
    fs.readFile(path.join(__dirname, 'Cards.txt'), { encoding: 'utf8' }, function (err, data) {
        if (err) {
            console.error(err);
        }
        else {
            cards = JSON.parse(data);
            for (var key in cards) {
                sortOrder_1.sortCard(cards[key]);
            }
            fs.writeFile(path.join(__dirname, 'Cards.txt'), JSON.stringify(cards, null, 2), function () {
                process.exit();
            });
        }
    });
};
run();
