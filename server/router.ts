import { Router } from 'express';
import { getDeckForViewer } from './decks/premade';
import { getDeckOptions } from './decks'
import { addCard, allCards, removeCard, downloadCards } from './cards/Cards';
import { sortCard } from './shared/sortOrder';
import { getFightingStyles, getFullFightingStyleByName } from './styles';
import { userRouter } from './users/router';
import { decksRouter } from './decks/router';

const router = Router();

router.use('/users', userRouter);
router.use('/decks', decksRouter);


router.get('/deckList', async(req, res) => {
    const decks = await getDeckOptions(); 
    res.status(200).send(decks);
})

router.get('/deck/:deckName', (req, res) => {
    const { deckName = '' }: { deckName: string } = req.params;
    if (deckName) {
        const deck = getDeckForViewer(deckName);
        if (deck) {
            res.status(200).send(deck);
            return;
        }
    }
    res.status(404).send();
})

router.post('/card', (req, res) => {
    const { index, ...card } = req.body;
    sortCard(card);
    addCard(card, card.index);
    res.status(201).send();
})
router.get('/cards', (req, res) => {
    const cardList = Object.keys(allCards);
    res.status(200).send(cardList);
})
router.get('/card/:name', (req, res) => {
    const card = allCards[req.params.name];
    res.status(200).send(card || null);
})
router.get('/styles', (req, res) => {
    res.status(200).send(getFightingStyles());
})
// router.get('/updatedb', () => {
//     const dbCards: DBCard[] = [];
//     for (const cardName in allCards) {
//         const card = allCards[cardName];
//         const dbCard = new DBCard(card);
//         dbCards.push(dbCard);
//     }
//     cardRepo.save(dbCards);
// })
router.get('/styles/:style', (req, res) => {
    const styleName = req.params.style;
    const style = getFullFightingStyleByName(styleName);
    if (style) {
        res.status(200).send(style);
    } else {
        res.status(418).send();
    }
})
router.delete('/card', async (req, res) => {
    try {
        await removeCard(req.body.name);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(400).send();
    }
})

export default router; 