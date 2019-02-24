import { Router } from 'express';
import { getDeckOptions, getDeckForViewer } from './decks';
import { addCard, cards, removeCard } from './cards/Cards';

const router = Router();

router.get('/deckList', (req, res) => {
    res.status(200).send(getDeckList());
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
    addCard(card, index);
    res.status(201).send();
})
router.get('/cards', (req, res) => {
    const cardList = Object.keys(cards);
    res.status(200).send(cardList);
})
router.get('/card/:name', (req, res) => {
    const card = cards[req.params.name];
    res.status(200).send(card || null); 
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

const getDeckList = () => {
    return getDeckOptions();
}

export default router; 