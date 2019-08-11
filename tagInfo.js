// jshint ignore: start
const fs = require("fs");
const path = require("path");
const { makeCardsObj } = require("./serverBuild/cards/Cards");

const printTagInfo = async () => {
  const allCards = await makeCardsObj();
  const tagCount = {};
  for (let cardName in allCards) {
    const card = allCards[cardName];
    card.tags.forEach(({ value: tag }) => {
      tagCount[tag] = tagCount[tag] || 0;
      tagCount[tag]++;
    });
  }
  console.log("Tag Info:");
  for (let tag in tagCount) {
    console.log(tag + ": " + tagCount[tag]);
  }
};

printTagInfo();
