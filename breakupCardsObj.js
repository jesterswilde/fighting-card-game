const {readFile, writeFile} = require('fs'); 
const path = require('path'); 


readFile(path.join(__dirname, 'Cards.txt'), {encoding: 'utf-8'}, (err, data)=>{
    const cardsObj = JSON.parse(data); 
    Object.keys(cardsObj).forEach((cardName)=>{
        const card = cardsObj[cardName]; 
        writeFile(path.join(__dirname, 'cards', cardName + '.json'), JSON.stringify(card, null, 2), (err)=>{
            if(err){
                console.error(err); 
            }
        }); 
    })
})