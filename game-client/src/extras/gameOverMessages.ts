
const winningMessages = [
    'Daaammnnn, he got wrecked',
    'I think that was illegal',
    'Congrats, I think that\'s murder',
    'Too easy',
    'It\'s like they were standing still',
]

const losingMessages = [
    'Got wrekt',
    'I don\'t think it\' supposed to bend that way',
    'You should call a lawyer...and a doctor',
    'Get good',
    'That looked...unpleasant',
    'Pollock or Picasso, I can\'t tell'
]

const bothLoseMessages = [
    'Violence is not the answer',
    'Everybody loses!',
    'That was MAD',
    'Have you considered words?'
]

export const getWinningMessage = ()=>{
    const index = Math.floor(Math.random() * winningMessages.length);
    return winningMessages[index];  
}
export const getLosingMessage = ()=>{
    const index = Math.floor(Math.random() * losingMessages.length);
    return losingMessages[index];  
}
export const getBothLoseMessage = ()=>{
    const index = Math.floor(Math.random() * bothLoseMessages.length);
    return bothLoseMessages[index];  
}