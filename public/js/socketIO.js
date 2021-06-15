const socket = io('http://localhost:3000');

socket.on('connection')

function gainRP(RP) {
    socket.emit('gainRP', RP);
}
function loseRP(RP) {
    socket.emit('loseRP', RP);
}

function getRP(){
    socket.emit('getRP');
}

function setRP(RP){
    socket.emit('setRP', RP);
}


//CHATS

//poker chat
function sendPokerMessage(message){
    socket.emit('sendPokerMessage', message)
}

socket.on('receivePokerMessage', data => {
    //console.log(data)
    // data = {
    //     sender: *name*,
    //     date: date,
    //     message: *mesaj*
    // }
})

//global chat
function sendGlobalMessage(message) {
    socket.emit('sendGlobalMessage', message)
}

socket.on('receiveGlobalMessage', data => {
    //console.log(data)
    // do smth with data
})

// //-----------------------POKER CHANNELS--------------------------

// // cerere de a crea un room nou cu tine ca admin
// socket.emit('newPokerRoom')

// // cerere de a primi toate room-urile care asteapta
// socket.emit('showPokerRooms')

// // primeste toate room-urile care asteapta
// socket.on('getPokerRooms', rooms => {
//     // rooms e o lista cu obiecte cu formatul {roomId: *id*, name: *name*, numOfPlayers: *numar*}}
//     // prelucreaza rooms
// })

// // cerere de a da join intr-un room cu un id specific
// socket.emit('joinPokerRoom', roomId)

// // primeste semnal cand cineva da join in room
// socket.on('someoneJoined', data  => {
//     // data:
//     // {
//     //     players: [*name*, *name*, ...]
//     // }
// })

// // daca a facut cerere sa intre intr un room si meciul a inceput deja, primeste semnal:
// socket.on('sorryGameStarted', () => {
//     //afiseaza mesaj in front end
// })

// // daca a facut cerere sa intre intr un room si s-a atins nr maxim de jucatori, primeste semnal:
// socket.on('sorryRoomIsFull', () => {
//     //afiseaza mesaj in front end
// })

// // cerere de a incepe jocul in room-ul in care te afli (doar daca esti admin)
// socket.emit('startPokerGame')

// // daca a cerut sa inceapa meciul si este un singur jucator in room primeste:
// socket.on('notEnoughPlayers', () => {
//     //afiseaza mesaj in front end
// })

// // trimitere a actiunii alese in timpul jocului (doar daca este randul tau)
// socket.emit('pokerAction', action)
// // unde action sa fie un obiect cu formatul {name: *nume actiune(check, fold...)*, value: *numar(pentru bet si raise)*}

// // primeste semnalul de a astepta (de fiecare daca cand se trece la alt jucator)
// socket.on('wait', data => {
//     // data:
//     // {
//     //     round: *preflop/flop/turn/river*,
//     //     players: [{userName: *name*, inGame: *0/1(daca inca este in joc)*}, {}, ...],
//     //     rp: *roial pointz(ale jucatorului catre care s-a trimit semnalul)*,
//     //     pot: *numar*,
//     //     commonCards: *undefined daca inca nu s-au afisat sau [{Value: K, Suit: 'hearts'}, {}, {}, ...]*,
//     //     roundTotalBet: *pariul maxim cate s-a facut in runda curenta(include raise)*,
//     //     myBetInRound: *cat a pariat jucatorul curent in runda curenta*,
//     //     turn: *al cui rand e*
//     //
//     //     myCards: [{Value: K, Suit: 'hearts'}, {...}] *poate lipsi daca inca nu s-au afisat*
//     // }
// })

// // primeste semnal de a juca (e radul lui)
// socket.on('play', data => {
//     //data:
//     // {
//     //     round: *preflop/flop/turn/river*,
//     //     players: [{userName: *name*, inGame: *0/1(daca inca este in joc)*}, {}, ...],
//     //     rp: *roial pointz(ale jucatorului catre care s-a trimit semnalul)*,
//     //     pot: *numar*,
//     //     commonCards: *undefined daca inca nu s-au afisat sau [{Value: K, Suit: 'hearts'}, {}, {}, ...]*,
//     //     roundTotalBet: *pariul maxim cate s-a facut in runda curenta(include raise)*,
//     //     myBetInRound: *cat a pariat jucatorul curent in runda curenta*,
//     //     actions: ["fold", "bet", ...] *ce poate juca jucatorul curent* 
//     //     
//     //     info: *smallblid/bigblind*, *info poate lipsi daca nu e sb sau bb*
//     //     smallBlind: *numar* *apare doar cand info este bigblind pt a paria bigblind dublul lui smallblind*
//     //     myCards: [{Value: K, Suit: 'hearts'}, {...}] *poate lipsi daca inca nu s-au afisat*
//     // }
// })


// // primeste semnal ca jocul s-a incheiat si ai castigat
// socket.on('winner', data => {
//     // daca jocul s-a terminat normal
//     // data:
//     // {
//     //     gain: *pot final*, 
//     //     rp: *rp dupa ce a adunat pot*, 
//     //     winners: [*userName*, *userName*, ...],
//     //     commonCards: [{Value: K, Suit: 'hearts'}, {}, {}, ...],
//     //     players: [
//     //         {
//     //             userName: *name*,
//     //             inGame: *0/1*,
//     //             cards: [{Value: K, Suit: 'hearts'}, {...}]
//     //         },
//     //         {...},
//     //         ...,
//     //     ]
//     // }

//     //daca jocul s-a terminat prin fold sau leave si a ramas un singur jucator in meci
//     //data:
//     // {
//     //     gain: *pot final*
//     //     rp: *rp*, 
//     // }
// })

// // primeste semnal ca jocul s-a incheiat si ai pierdut
// socket.on('loser', data => {
//     // daca jocul s-a terminat normal
//     // data:
//     // { 
//     //     rp: *rp*, 
//     //     winners: [*userName*, *userName*, ...],
//     //     commonCards: [{Value: K, Suit: 'hearts'}, {}, {}, ...],
//     //     players: [
//     //         {
//     //             userName: *name*,
//     //             inGame: *0/1*,
//     //             cards: [{Value: K, Suit: 'hearts'}, {...}]
//     //         },
//     //         {...},
//     //         ...,
//     //     ]
//     // }


//     //daca jocul s-a terminat prin fold sau leave si a ramas un singur jucator in meci
//     //data:
//     // {
//     //     rp: *rp*, 
//     // }
// })


socket.on('winner', data => {
    console.log("Ai castigat:",data)
})
socket.on('loser', data => {
    console.log("Ai pierdut:",data)
})
socket.on('play', data => {
    console.log("Joaca:",data)
})
socket.on('wait', data => {
    console.log("Asteapta:",data)
})

socket.on('someoneJoined', data => {
    console.log("Someone joined:",data)
})
socket.on('getPokerRooms', data => {
    console.log("Rooms:",data)
})
socket.on('getAdminData', data => {
    //data = userName, rp, inGame 
})


