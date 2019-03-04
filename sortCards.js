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
                sortCard(cards[key]);
            }
            fs.writeFile(path.join(__dirname, 'SortedCards.txt'), JSON.stringify(cards, null, 2), function () {
                process.exit();
            });
        }
    });
};
var sortCard = function (card) {
    if (card.priority === undefined) {
        card.priority = 5;
    }
    sortRequirements(card.requirements);
    sortEffects(card.effects);
    card.optional.forEach(function (opt) {
        sortRequirements(opt.requirements);
        sortEffects(opt.effects);
    });
};
var sortRequirements = function (reqs) {
    reqs.sort(function (a, b) { return sortOrder_1.getSortOrder(a.axis) - sortOrder_1.getSortOrder(b.axis); });
};
var sortEffects = function (effs) {
    effs.sort(function (a, b) {
        var aVal, bVal;
        if (a.mechanic !== undefined) {
            aVal = sortOrder_1.getSortOrder(a.mechanic);
        }
        else {
            aVal = sortOrder_1.getSortOrder(a.axis);
        }
        if (b.mechanic !== undefined) {
            bVal = sortOrder_1.getSortOrder(b.mechanic);
        }
        else {
            bVal = sortOrder_1.getSortOrder(b.axis);
        }
        return aVal - bVal;
    });
    effs.forEach(function (eff) {
        if (Array.isArray(eff.mechanicEffects)) {
            sortEffects(eff.mechanicEffects);
        }
        if (Array.isArray(eff.mechanicRequirements)) {
            sortRequirements(eff.mechanicRequirements);
        }
        if (Array.isArray(eff.choices)) {
            eff.choices.forEach(function (choice) {
                sortEffects(choice);
            });
        }
    });
};
run();
