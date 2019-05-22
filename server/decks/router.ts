import { Router } from 'express'
import { getPossibleCards, deleteDeck, makeDeck, getFullDeck, updateDeck, getUsersDecks } from '.';
import { authMiddleware } from '../auth';
import { ErrorEnum } from '../error';

export const decksRouter = Router();

//This gets full versions of all cards given a set of styles. 
decksRouter.get('/possibleCards', (req, res) => {
    const { styles } = req.query;
    if(styles){
        const stylesArray = styles.split(',');
        const possibleCards = getPossibleCards(stylesArray);
        res.status(200).send(possibleCards);
    }else{
        res.status(403).send(); 
    }
})

//Should return an abridges version of all your decks. Names, maybe description, styles in use. Possibly card names, not full cards. 
decksRouter.get('/', authMiddleware, async (req, res) => {
    try{
        const decks = await getUsersDecks(req.user); 
        res.status(200).send(decks); 
    }catch(err){
        console.error(err); 
        res.status(500).send(); 
    }
})

//Returns all info a given deck. Currently sends full cards plus possible cards. 
//This is an area to optimize later. 
decksRouter.get('/:id', authMiddleware, async(req, res) => {
    try{
        const deck = await getFullDeck(req.user, req.params.id);
        res.status(200).send(deck); 
    }catch(err){
        if(err === ErrorEnum.DOESNT_OWN_DECK){
            res.status(403).send(); 
        }else{
            console.error(err); 
            res.status(500).send(); 
        }
    }
})

//Makes a new deck
decksRouter.post('/new', authMiddleware, async (req, res) => {
    try{
        const deck = await makeDeck(req.user); 
        res.status(200).send(deck); 
    }catch(err){
        console.error(err); 
        res.status(500).send(); 
    }
})


//Updates a deck
decksRouter.put('/:id', authMiddleware, async (req, res) => {
    try{
        await updateDeck(req.user, req.params.id, req.body.deck);
    }catch(err){
        if(err === ErrorEnum.CARDS_ARENT_IN_STYLES || err === ErrorEnum.TOO_MANY_STYLES){
            res.status(400).send(err); 
        }else{
            console.error(err); 
            res.status(500).send(); 
        }
    }
})

//Deletes a deck
decksRouter.delete('/:id', authMiddleware, async (req, res) => {
    try{
        await deleteDeck(req.user, req.params.id); 
        res.status(200).send(); 
    }catch(err){
        if(err === ErrorEnum.DOESNT_OWN_DECK){
            res.status(403).send(); 
        }else{
            console.error(err); 
            res.status(500); 
        }
    }
})