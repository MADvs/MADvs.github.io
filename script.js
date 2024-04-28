const dealerBox = document.getElementById('dealerContainer');
const playerBox = document.getElementById('playerContainer');
const gameLog = document.getElementById('gameLog');
const hitButton = document.getElementById('hitButton');
const standButton = document.getElementById('standButton');
const againButton = document.getElementById('againButton');
const totalMoneyText = document.getElementById('currentMoney');
const betInput = document.getElementById('betInput');
const currentBetText = document.getElementById('currentBet');

class Card {
    constructor(suit, rank, value, color) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
        this.color = color;
    }
}

let deck = [];
let playerHand = [];
let dealerHand = [];
let totalMoney = 2000;
let betMoney = 0;
let roundCheck = 0;
betInput.setAttribute("max", totalMoney);
MakeDeck();
hitButton.addEventListener("click", function() {Hit()});
standButton.addEventListener("click", function() {Stand()});
Main();

function Main() {
    betMoney = parseInt(document.getElementById('betInput').value);
    totalMoneyText.innerHTML = totalMoney;
    currentBetText.innerHTML = betMoney;
    if (roundCheck == 0) {    
        document.getElementById('againButtonBox').classList.remove('hidden');
        document.getElementById('gameButtonBox').classList.add('hidden');
        gameLog.innerHTML = "Place your bet...";
        roundCheck++;
    }

    againButton.addEventListener("click", function() {
        if (betMoney > totalMoney) {
            gameLog.innerHTML = "You don't have enough money to make a bet like that!";
        } else {
        playerHand = [];
        dealerHand = [];
        const cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.remove();
        })
        currentBetText.innerHTML = betMoney;
        BeginGame();
        }
    });
}

function BeginGame() {
    document.getElementById('againButtonBox').classList.add('hidden');
    document.getElementById('gameButtonBox').classList.remove('hidden');
    WriteCard(playerHand);
    WriteCard(dealerHand);
    WriteCard(playerHand);
    WriteCard(dealerHand);
    if (GetHandValue(playerHand) == 21) {
        gameLog.innerHTML = "You have 21!";
        Stand();
    } else {
        gameLog.innerHTML = "The dealer is showing " + dealerHand[1].value + ", and you have " + GetHandValue(playerHand) + ".";
    }
}

function Hit() {
    WriteCard(playerHand);

    if (GetHandValue(playerHand) > 21) {
        CheckAceValue(playerHand);
    }

    if (GetHandValue(playerHand) > 21) {
        GameOver();
    } else if (GetHandValue(playerHand) == 21) {
        gameLog.innerHTML = "You have " + GetHandValue(playerHand) + "!";
        Stand();
    } else {
        gameLog.innerHTML = "You have " + GetHandValue(playerHand);
    }
}

function Stand() {
    document.getElementById("d1").classList.remove("hidden-card");
    gameLog.innerHTML = "The dealer has " + GetHandValue(dealerHand);
    while (GetHandValue(dealerHand) < 17 && GetHandValue(dealerHand) <= GetHandValue(playerHand)){
        WriteCard(dealerHand);
        if (GetHandValue(dealerHand) > 21) {
            CheckAceValue(dealerHand);
        }
        gameLog.innerHTML = "The dealer has " + GetHandValue(dealerHand);   
    }
    GameOver();
}

function MakeDeck() {
    let suits = ['♣', '♦', '♥', '♠'];
    let ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    for (i = 0; i < suits.length; i++) {
        for (j = 0; j < ranks.length; j++) {
            deck.push(new Card(suits[i], ranks[j]));
        }
    }

    for (i = 0; i < deck.length; i++) {
        if (deck[i].suit == '♦' || deck[i].suit == '♥') {
            deck[i].color = 'red'
        } else {
            deck[i].color = 'black'
        }

        if (deck[i].rank == 'A') {
            deck[i].value = 11;
        } else if (deck[i].rank == 'J' || deck[i].rank == 'Q' || deck[i].rank == 'K') {
            deck[i].value = 10;
        } else {
            deck[i].value = deck[i].rank;
        }
    }
}

function DrawCard() {
    let random = Math.floor(Math.random() * deck.length);
    let card = deck[random];
    deck.splice(random, 1);
    return card;
}

function WriteCard(x) {
    if (deck.length == 0) {
        MakeDeck();
    }

    switch (x) {
        case playerHand:
            playerHand.push(DrawCard());
            break;
        case dealerHand:
            dealerHand.push(DrawCard());
            break;
    }

    const Card = document.createElement("div");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    if (x == dealerHand && dealerHand.length == 1) {
        Card.className = "hidden-card";
    }
    Card.classList.add("card");
    Card.appendChild(p1);
    Card.appendChild(p2);

    if (x == playerHand) {
        Card.id = "p" + playerHand.length;
        p1.id = "pr" + playerHand.length;
        p2.id = "ps" + playerHand.length;
        playerBox.appendChild(Card);
        let newRank = document.querySelector("#pr" + playerHand.length);
        let newSuit = document.querySelector("#ps" + playerHand.length);
        newRank.innerHTML = playerHand[playerHand.length - 1].rank;
        newSuit.innerHTML = playerHand[playerHand.length - 1].suit;
        Card.style.color = playerHand[playerHand.length - 1].color;
    } else if (x == dealerHand) {
        Card.id = "d" + dealerHand.length;
        p1.id = "dr" + dealerHand.length;
        p2.id ="ds" + dealerHand.length;
        dealerBox.appendChild(Card);
        let newRank = document.querySelector("#dr" + dealerHand.length);
        let newSuit = document.querySelector("#ds" + dealerHand.length);
        newRank.innerHTML = dealerHand[dealerHand.length - 1].rank;
        newSuit.innerHTML = dealerHand[dealerHand.length - 1].suit;
        Card.style.color = dealerHand[dealerHand.length - 1].color;
    }
}

function GetHandValue(x) {
    let handValue = 0;
    switch (x) {
        case playerHand:
            for (i = 0; i < playerHand.length; i++) {
                handValue += playerHand[i].value;
            };
        break;
        case dealerHand:
            for (i = 0; i < dealerHand.length; i++) {
                handValue += dealerHand[i].value;
            };
        break;
    }
    return handValue;
}

function CheckAceValue(x) {
    switch (x) {
        case playerHand:
            if (playerHand.length == 2) {
                playerHand[1].value = 1;
            } else {
                for (i = 0; i < playerHand.length; i++) {
                    if (playerHand[i].rank == 'A') {
                        playerHand[i].value = 1;
                    }
                }
            }
        break;
        case dealerHand:
            if (dealerHand.length == 2) {
                dealerHand[1].value = 1;
            } else {
                for (i = 0; i < dealerHand.length; i++) {
                    if (dealerHand[i].rank == 'A') {
                        dealerHand[i].value = 1;
                    }
                }
            }
        break;
    }
}

function GameOver() {
    let playerWon = CheckWinner();
    switch (playerWon) {
        case true:
            totalMoney += betMoney;
            break;
        case false:
            totalMoney -= betMoney;
            break;
        case "push":
            break;
    }
    document.getElementById('againButtonBox').classList.remove('hidden');
    document.getElementById('gameButtonBox').classList.add('hidden');
    againButton.addEventListener("click", function() {
        Main()
    });
}

function CheckWinner() {
    if (GetHandValue(playerHand) > 21) {
        gameLog.innerHTML = "You have " + GetHandValue(playerHand) + ". Sorry, you bust!";
        return false;
    } else if (GetHandValue(dealerHand) > 21) {
        gameLog.innerHTML = "The dealer bust with " + GetHandValue(dealerHand) + ".  You win!";
        return true;
    } else if (GetHandValue(dealerHand) > GetHandValue(playerHand)) {
        gameLog.innerHTML = "The dealer has " + GetHandValue(dealerHand) + ". Sorry, you lost.";
        return false;
    } else if (GetHandValue(dealerHand) == GetHandValue(playerHand)) {
        gameLog.innerHTML = "The dealer has " + GetHandValue(dealerHand) + ". It's a push!";
        return "push";
    } else if (GetHandValue(dealerHand) < GetHandValue(playerHand)) {
        gameLog.innerHTML = "The dealer has " + GetHandValue(dealerHand) + ".  You win!";
        return true;
    }
}