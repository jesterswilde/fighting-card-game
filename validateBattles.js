// jshint ignore: start
const fs = require('fs');  
const path = require('path'); 
const {makeCardsObj, getCardByName} = require('./serverBuild/cards/Cards');

makeCardsObj().then((allCardsObj)=>{
    validateCards(allCardsObj); 
});

const validateCards = async(allCardsObj)=>{
    const battleFiles = fs.readdirSync(path.join(__dirname,"server","gameServer","story","battles"))
    const battlePromises = battleFiles.map(battleFile => readBattleFile(battleFile));
    const battles = await Promise.all(battlePromises);
    battles.forEach(battle=>{
        if(!battle.deckList.every(cardName => !!allCardsObj[cardName]))
            console.log(`Battle :${battle.id} has invalid cards`)
    })
};

const readBattleFile = (fileName)=>{
  return new Promise((res, rej) => {
    fs.readFile(
      path.join(__dirname, "server", "gameserver","story", "battles", fileName),
      { encoding: "utf8" },
      (err, battleData) => {
        if (err) {
          rej(err);
        } else {
          const battle = JSON.parse(battleData);
          res(battle);
        }
      }
    );
  });
};