const {loseRPbySession, loseRPbyUserId, gainRPbySession, gainRPbyUserId} = require('../modules/manageRoialPointz')
const cookie = require('cookie')
const db = require('../config/dbConnection').db
var Hand = require('pokersolver').Hand;


class PokerPlayer {
	static inGameStatus = {
		in: 1,
		out: 0
	}
	constructor(userId, userName, rp) {
		this.userId = userId
		this.userName = userName
		this.rp = rp
		this.cards = undefined
		this.inGameStatus = PokerPlayer.inGameStatus.out
	}

	loseRP(rp) {
		loseRPbyUserId(this.userId, rp)
		this.rp -= rp
	}
	gainRP(rp) {
		gainRPbyUserId(this.userId, rp)
		this.rp += rp
	}
}

class PokerRoom {
	static nextRoomId = 0;
	static roomStatus = {
		waiting: 0,
		playing: 1
	}
	static maxNumOfPlayers = 5
	static rounds = {
		preflop: 'preflop',
		flop: 'flop',
		turn: 'turn',
		river: 'river',
		showdown: 'showdown'
	}
	static pokerActions = {
		check: 'check',
		bet: 'bet',
		fold: 'fold',
		call: 'call',
		raise: 'raise'
	}
	static cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
	static cardSuits = ["spades", "diamonds", "clubs", "hearts"];  //inima neagra, romb, trefla, inima rosie
	static smallBlinds = [1, 2, 5, 10, 20, 50, 100, 200, 500]
	static bets = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000, 10000, 50000]

	static getEncodedHand(cards){
		let result = []
		for (let card of cards) {
			let s = ''
			if (card.Value == "10"){
				s += "T"
			} else {
				s += card.Value
			}
			s += card.Suit[0]
			result.push(s)
		}
		console.log("RES: ", result)
		return result;
	}

	constructor(io, roomName, admin) {
		this.io = io
		this.roomId = PokerRoom.nextRoomId++
		this.roomName = roomName
		this.adminId = admin.userId
		this.status = PokerRoom.roomStatus.waiting
		this.players = [admin]
		this.deck = undefined
		this.round = undefined
		this.dealer = 0  //index in list 'players'
		this.turn = 1, //index in list 'players'
		this.smallBlind = undefined
		this.bigBlind = undefined
		this.actions = undefined
		this.commonCards = undefined 
		this.pot = 0 
		this.lastPlayerToBetOrRaise = undefined
		this.roundBet = 0,
		this.playersBetsInRound = undefined
	}

	getDeck(){
		var deck = new Array();
	
		for(var i = 0; i < PokerRoom.cardSuits.length; i++) {
			for(var x = 0; x < PokerRoom.cardValues.length; x++) {
				var card = {Value: PokerRoom.cardValues[x], Suit: PokerRoom.cardSuits[i]};
				deck.push(card);
			}
		}
		this.deck = deck;
	}
	
	shuffleDeck() {
		var j, x, i;
		for (i = this.deck.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = this.deck[i];
			this.deck[i] = this.deck[j];
			this.deck[j] = x;
		}
	}

	getRandomCard() {
		var i = getRandomInt(this.deck.length)
		var card = this.deck[i]
		this.deck.splice(i, 1)
		return card
	}

	sendDataBackToPlayers(callback) {
		var publicPlayersInfo = this.players.map(p => {let info = {userName: p.userName, inGame: p.inGameStatus}; return info})
		for (let i = 0; i < this.players.length; ++i) {
			let player = this.players[i]

			let commonData = {
				round: this.round,
				players: publicPlayersInfo,
				rp: player.rp,
				pot: this.pot,
				commonCards: this.commonCards,
				roundTotalBet: this.roundBet,
				myBetInRound: this.playersBetsInRound[i]
			}
			if (player.userId == this.players[this.turn].userId){
				let data = {
					...commonData,
					...callback(player, true)
				}
				this.io.to(connectedUsers.get(player.userId)).emit('play', data)
			} else {
				let data = {
					...commonData,
					...callback(player, false)
				}
				this.io.to(connectedUsers.get(player.userId)).emit('wait', data)
			}
		}
	}

	nextRound() {
		if (this.round == PokerRoom.rounds.preflop) {
			this.round = PokerRoom.rounds.flop
			this.commonCards = [this.getRandomCard(), this.getRandomCard(), this.getRandomCard()]
		} else if (this.round == PokerRoom.rounds.flop) {
			this.round = PokerRoom.rounds.turn
			this.commonCards.push(this.getRandomCard())
		} else if (this.round == PokerRoom.rounds.turn) {
			this.round = PokerRoom.rounds.river
			this.commonCards.push(this.getRandomCard())
		} else if (this.round == PokerRoom.rounds.river) {
			this.round = PokerRoom.rounds.showdown
		}
		
		this.actions = [PokerRoom.pokerActions.check, PokerRoom.pokerActions.bet, PokerRoom.pokerActions.fold]
		this.roundBet = 0
		this.playersBetsInRound = []
		for (let i = 0; i < this.players.length; ++i){
			this.playersBetsInRound.push(0)
		}
		this.lastPlayerToBetOrRaise = undefined

		this.turn = this.nextValidPosition(this.dealer)
	}

	nextTurn(pos) {
		var t = (pos + 1) % this.players.length
		if (this.lastPlayerToBetOrRaise === undefined && t == (this.dealer + 1) % this.players.length){
			this.nextRound()
			return
		}
		while (this.players[t % this.players.length].inGameStatus == PokerPlayer.inGameStatus.out){
			++t;
			if (this.lastPlayerToBetOrRaise === undefined && t == (this.dealer + 1) % this.players.length){
				this.nextRound()
				return
			}
		}
		if (this.lastPlayerToBetOrRaise  !== undefined && t == this.lastPlayerToBetOrRaise){
			this.nextRound()
			return;
		}
		this.turn = t;
	}

	nextValidPosition(pos) {
		var t = (pos + 1) % this.players.length
		while (this.players[t % this.players.length].inGameStatus == PokerPlayer.inGameStatus.out){
			++t;
		}
		return t
	}

	join(player) {
		this.players.push(player)
		for (let player of this.players){
			let data = {
				players: this.players.map(player => player.userName)
			}
			this.io.to(connectedUsers.get(player.userId)).emit('someoneJoined', data)
		}
	}

	startGame() {
		if (this.players.length < 2) {
			io.to(connectedUsers.get(this.adminId).emit('notEnoughPlayers'))
			return;
		}
		this.getDeck()
		this.shuffleDeck()

		this.status = PokerRoom.roomStatus.playing
		this.round = PokerRoom.rounds.preflop
		this.actions = [PokerRoom.pokerActions.bet]
		this.playersBetsInRound = []
		for (let i = 0; i < this.players.length; ++i){
			this.playersBetsInRound.push(0)
		}

		for (let player of this.players){
			player.cards = [this.getRandomCard(), this.getRandomCard()]
			player.inGameStatus = PokerPlayer.inGameStatus.in
		}

		console.log("Primul pas: ", this.turn)
		this.sendDataBackToPlayers((player, hisTurn) => {
			if (hisTurn) return { actions: this.actions, info: "smallblind"}
			else 		 return { turn: this.turn }
		})
	}

	bet(betValue) {
		if (!this.smallBlind) {
			if (!PokerRoom.smallBlinds.includes(betValue)) return;

			this.smallBlind = betValue
			this.roundBet = betValue
			this.lastPlayerToBetOrRaise = this.turn
			this.playersBetsInRound[this.turn] = betValue
			this.pot += betValue

			this.players[this.turn].loseRP(betValue)

			console.log("Inainte de schimbare: ", this.turn)
			this.nextTurn(this.turn)
			console.log("Dupa schimbare: ", this.turn)

			this.sendDataBackToPlayers((player, hisTurn) => {
				if (hisTurn) return { actions: this.actions, info: "bigblind", smallblind: this.smallBlind }
				else 		 return { turn: this.turn }
			})
			return;
		}

		if (!this.bigBlind) {
			if (betValue != 2 * this.smallBlind) return;

			this.bigBlind = betValue
			this.roundBet = betValue
			this.lastPlayerToBetOrRaise = this.turn
			this.playersBetsInRound[this.turn] = betValue
			this.pot += betValue

			this.players[this.turn].loseRP(betValue)

			this.actions = [PokerRoom.pokerActions.call, PokerRoom.pokerActions.fold, PokerRoom.pokerActions.raise]

			this.nextTurn(this.turn)

			this.sendDataBackToPlayers((player, hisTurn) => {
				if (hisTurn) return { actions: this.actions, myCards: player.cards }
				else    	 return { turn: this.turn, myCards: player.cards }
			})
			return;
		}

		if (!PokerRoom.bets.includes(betValue)) return;

		this.roundBet = betValue
		this.lastPlayerToBetOrRaise = this.turn
		this.playersBetsInRound[this.turn] = betValue
		this.pot += betValue
		this.players[this.turn].loseRP(betValue)

		this.actions = [PokerRoom.pokerActions.call, PokerRoom.pokerActions.fold, PokerRoom.pokerActions.raise]
		this.nextTurn(this.turn)

		this.sendDataBackToPlayers((player, hisTurn) => {
			if (hisTurn) return { actions: this.actions, myCards: player.cards }
			else    	 return { turn: this.turn, myCards: player.cards }
		})
		return;
	}


	call() {
		this.pot += (this.roundBet - this.playersBetsInRound[this.turn])
		this.players[this.turn].loseRP(this.roundBet - this.playersBetsInRound[this.turn])
		this.playersBetsInRound[this.turn] = this.roundBet

		this.actions = [PokerRoom.pokerActions.call, PokerRoom.pokerActions.fold, PokerRoom.pokerActions.raise]
		this.nextTurn(this.turn)
		
		if (this.round == PokerRoom.rounds.showdown) {
			this.gameOver()
			return;
		}

		this.sendDataBackToPlayers((player, hisTurn) => {
			if (hisTurn) return { actions: this.actions, myCards: player.cards }
			else    	 return { turn: this.turn, myCards: player.cards }
		})
	}

	check() {
		this.nextTurn(this.turn)

		if (this.round == PokerRoom.rounds.showdown){
			this.gameOver()
			return
		}

		this.sendDataBackToPlayers((player, hisTurn) => {
			if (hisTurn) return { actions: this.actions, myCards: player.cards }
			else    	 return { turn: this.turn, myCards: player.cards }
		})
	}

	raise(betValue) {
		if (betValue < 2 * this.roundBet) return;

		this.roundBet = betValue
		this.pot += (this.roundBet - this.playersBetsInRound[this.turn])
		this.players[this.turn].loseRP(this.roundBet - this.playersBetsInRound[this.turn])

		this.lastPlayerToBetOrRaise = this.turn
		this.playersBetsInRound[this.turn] = betValue

		this.actions = [PokerRoom.pokerActions.call, PokerRoom.pokerActions.fold, PokerRoom.pokerActions.raise]
		this.nextTurn(this.turn)

		this.sendDataBackToPlayers((player, hisTurn) => {
			if (hisTurn) return { actions: this.actions, myCards: player.cards }
			else    	 return { turn: this.turn, myCards: player.cards }
		})
	}

	fold() {
		this.players[this.turn].inGameStatus = PokerPlayer.inGameStatus.out
		var playersInGame = this.players.filter(p => p.inGameStatus == PokerPlayer.inGameStatus.in)
		if (playersInGame.length == 1) {
			this.gameOver()
			return
		}

		this.nextTurn(this.turn)

		if (this.round == PokerRoom.rounds.showdown){
			this.gameOver()
			return
		}

		this.sendDataBackToPlayers((player, hisTurn) => {
			if (hisTurn) return { actions: this.actions, myCards: player.cards }
			else    	 return { turn: this.turn, myCards: player.cards }
		})
	}

	gameOver() {
		if (this.players.filter(p => p.inGameStatus == PokerPlayer.inGameStatus.in).length == 1) {
			let i = 0
			while (i < this.players.length) {
				let player = this.players[i]
				if (player.inGameStatus == PokerPlayer.inGameStatus.in) {
					player.gainRP(this.pot)
					this.io.to(connectedUsers.get(player.userId)).emit('winner', {gain: this.pot, rp: player.rp})
				} else if (connectedUsers.get(player.userId)){
					this.io.to(connectedUsers.get(player.userId)).emit('loser', {rp: player.rp})
				}
				++i;
			}	
			return		
		}

		var playersHand = []
		var handMap = new Map();
		let i = 0
		while (i < this.players.length) {
			let player = this.players[i]
			if (player.inGameStatus == PokerPlayer.inGameStatus.in) {
				var hand = Hand.solve(PokerRoom.getEncodedHand([...player.cards, ...this.commonCards]))
				playersHand.push(hand)
				handMap.set(hand, player)
			}
			++i;
		}

		var winnerHands = Hand.winners(playersHand)
		var winners = winnerHands.map(h => handMap.get(h))
		for (let player of this.players) {
			if (winners.includes(player)){
				player.gainRP(this.pot / winners.length)
				let data = {
					gain: this.pot, 
					rp: player.rp, 
					winners: winners.map(w => w.userName), 
					commonCards: this.commonCards,
					players: this.players.map(p => {let info = {userName: p.userName, inGame: p.inGameStatus, cards: p.cards}; return info})
				}
				this.io.to(connectedUsers.get(player.userId)).emit('winner', data)
			} else {
				let data = {
					rp: player.rp, 
					winners: winners.map(w => w.userName), 
					commonCards: this.commonCards,
					players: this.players.map(p => {let info = {userName: p.userName, inGame: p.inGameStatus, cards: p.cards}; return info})
				}
				this.io.to(connectedUsers.get(player.userId)).emit('loser', data)
			}
		}

		this.players = this.players.filter(p =>  activePokerPlayers.get(p.userId) === this)

		this.adminId = this.players[0].userId
		this.status = PokerRoom.roomStatus.waiting
		this.deck = undefined
		this.round = undefined
		this.dealer = this.nextValidPosition(this.dealer)
		this.turn = this.nextValidPosition(this.dealer)
		this.smallBlind = undefined
		this.bigBlind = undefined
		this.actions = undefined
		this.commonCards = undefined 
		this.pot = 0 
		this.lastPlayerToBetOrRaise = undefined
		this.roundBet = 0,
		this.playersBetsInRound = undefined
	}

	leave(userId) {
		let i = 0
		while (i < this.players.length) {
			if (this.players[i].userId == userId){
				if (this.status == PokerRoom.roomStatus.playing){
					this.players[i].inGameStatus = PokerPlayer.inGameStatus.out

					var playersInGame = this.players.filter(p => p.inGameStatus == PokerPlayer.inGameStatus.in)
					if (playersInGame.length == 1) {
						this.gameOver()
						return
					}
				} else {
					this.players.splice(i, 1)
					if (this.players.length > 0 && this.adminId == userId){
						this.adminId = this.players[0].userId
					}
				}
				activePokerPlayers.delete(userId)
				break
			}
			++i;
		}
	}
}

rooms = [] //PokerRoom
activePokerPlayers = new Map() // userId: PokerRoom
connectedUsers = new Map() // userId: socket.id

function getSessionId(socket) {
	var raw = cookie.parse(socket.handshake.headers.cookie);
	return raw['connect.sid'].split(":")[1].split('.')[0];
}

function getUserData(socket, callback) {
	var sessionId = getSessionId(socket)
	db.query(`SELECT data FROM sessions WHERE session_id = ?`, [sessionId], (error, result) => {
		if (error) {
			console.error(error);
		}

		var userId = JSON.parse(result[0].data).userLoggedIn;

		db.query('SELECT u.id, Username, RoialPointz rp FROM users u JOIN profile p ON(u.id = p.UserId) WHERE u.id = ?', [userId], (error, resultUser) => {
			if (error) {
				console.log(error)
			}

			callback(resultUser[0])
		})
	})
}


// function turnTimeout(io, roomId) {
// 	setTimeout(() => {
// 		const gameInfo = activePokerGames.get(roomId)
// 		if (!gameInfo) return;
// 		if (!gameInfo.movePlayed && gameInfo.lastMovingPlayer == gameInfo.turn) {
// 			console.log("A expirat timpul pentru ", gameInfo.players[gameInfo.turn])
// 			gameInfo.turn = (gameInfo.turn + 1) % gameInfo.players.length
// 			gameInfo.lastMovingPlayer = gameInfo.turn
// 			for (let player of gameInfo.players) {
// 				if (player == gameInfo.players[gameInfo.turn]){
// 					io.to(connectedUsers.get(player)).emit('move')
// 				} else {
// 					io.to(connectedUsers.get(player)).emit('wait')
// 				}
// 			}
// 			gameInfo.movePlayed = false
// 			turnTimeout(io, roomId)
// 		}
// 	}, 5000)
// }

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function activateSockets(io){

io.on('connection', socket => {
    console.log("Din al doilea connect: ", socket.id)
    getUserData(socket, (user) => {
        connectedUsers.set(user.id, socket.id)
    })

	socket.on('gainRP', RP => {
		gainRPbySession(getSessionId(socket), RP);
	})
	socket.on('loseRP', RP => {
        console.log("Din socket: ", socket.id)

		loseRPbySession(getSessionId(socket), RP);
	})

	//  POKER ---------------------------------------------------------------------------------------------------------
	socket.on('newPokerRoom', roomName => {
		if (roomName.length  < 1) return;
		getUserData(socket, (user) => {
			admin = new PokerPlayer(user.id, user.Username, user.rp)
			pokerRoom = new PokerRoom(io, roomName, admin)

			rooms.push(pokerRoom)
			activePokerPlayers.set(user.id, pokerRoom)
		})
	})

	socket.on('showPokerRooms', () => {
		getUserData(socket, user => {
			openRooms = []
			for (let room of rooms) {
				if (room.status == PokerRoom.roomStatus.waiting && room.players.length < PokerRoom.maxNumOfPlayers){
					openRooms.push({roomId: room.roomId, name: room.roomName, numOfPlayers: room.players.length})
				}
			}
			io.to(connectedUsers.get(user.id)).emit('getPokerRooms', openRooms)
		})
	})

	socket.on('joinPokerRoom', chosenRoomId => {
		if (isNaN(parseInt(chosenRoomId))) return;
		getUserData(socket, (user) => {
			var room = rooms.find(room => room.roomId == chosenRoomId)

			if (!room) return;

			
			if (room.status == PokerRoom.roomStatus.playing){
				io.to(connectedUsers.get(user.id)).emit('sorryGameStarted')
				return
			}

			if (room.players.length == PokerRoom.maxNumOfPlayers){
				io.to(connectedUsers.get(user.id)).emit('sorryRoomIsFull')
				return
			}

			player = new PokerPlayer(user.id, user.Username, user.rp)
			room.join(player)
			activePokerPlayers.set(user.id, room)
		})
	})

	socket.on('startPokerGame', () => {
		getUserData(socket, user => {
            const room = activePokerPlayers.get(user.id)

			if (!room) return;

			if (room.adminId != user.id) return;
			
			console.log("Joc inceput!")

			room.startGame()
		})
	})
	
	socket.on('pokerAction', action => { // {name: check, value: -1}
		getUserData(socket, user => {
			const room = activePokerPlayers.get(user.id)

			if (room.players[room.turn].userId == user.id){
				console.log("Actiunea curenta: ", action)

				if (!room.actions.includes(action.name)) return;
					
				// CHECK
				if (action.name == PokerRoom.pokerActions.check) {
					room.check()
				}

				// BET
				if (action.name == PokerRoom.pokerActions.bet) {
					const betValue = parseInt(action.value)
					room.bet(betValue)
				}

				// CALL
				if (action.name == PokerRoom.pokerActions.call) {
					room.call()
				}

				//RAISE
				if (action.name == PokerRoom.pokerActions.raise) {
					const betValue = parseInt(action.value)
					room.raise(betValue)
				}

				//FOLD
				if (action.name == PokerRoom.pokerActions.fold) {
					room.fold()
				}
			}
		})
	})

	socket.on('leavePokerRoom', () => {
		getUserData(socket, (user) => {
			const room = activePokerPlayers.get(user.id)
			
			room.leave(user.id)
			if (room.players.length == 0) {
				rooms.splice(rooms.indexOf(room), 1)
			}
		})
	})
//  END POKER ---------------------------------------------------------------------------------------------------------

    socket.on('disconnect', function() {
        console.log('Got disconnected: ', socket.id);
        getUserData(socket, (user) => {
            connectedUsers.delete(user.id)
			var room = activePokerPlayers.get(user.id)

			if (!room) return;

			room.leave(user.id)
			if (room.players.length == 0) {
				rooms.splice(rooms.indexOf(room), 1)
			}
        })
    });
})

}

module.exports = activateSockets