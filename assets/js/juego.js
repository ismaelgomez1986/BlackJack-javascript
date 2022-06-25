//Envolver todo el código en una función anónima autoinvocadas
// (() => {

// })();

//min significa que es un archivo comprimido, ofuscado y listo para producción
//en desarrollo se modifica el archivo juego.js, y luego se vuelve a minificar para pasarlo nuevamente a producción
//https://www.toptal.com/developers/javascript-minifier
const myModule = (() => {
  "use strict"; //Ayuda a javascript a tener un código más limpio, buscar en google x + info. Nos ayudará a evitar errores.
  //PATRON MODULO -> patron de diseño más popular, por su compatibilidad, sirve para encapsular y proteger nuestro código.

  //Ask for player name
  const ask = prompt("Ingrese su nombre"),
    askPlayer = (document.querySelector(
      "h1"
    ).innerHTML = `${ask} - <small>0</small>`);

  let deck = [],
    scorePlayers = [];

  //scorePlayers[0] = player
  //scorePlayers[1] = machine
  const pintas = ["C", "D", "S", "H"],
    especiales = ["A", "J", "Q", "K"];

  //Referencias del HTML
  const btnNew = document.querySelector("#btnNew"),
    btnAsk = document.querySelector("#btnAsk"),
    btnStop = document.querySelector("#btnStop"),
    smallScore = document.querySelectorAll("small"),
    divCards = document.querySelectorAll(".divCards");

  //This function Starts the game
  const startGame = (numPlayers = 2) => {
    scorePlayers = [];
    deck = createDeck();
    for (let i = 0; i < numPlayers; i++) {
      scorePlayers.push(0);
    }
    smallScore.forEach((elem) => (elem.innerText = 0));
    divCards.forEach((div) => (div.innerHTML = ''));

    btnAsk.disabled = false;
    btnStop.disabled = false;
    // console.log({ scorePlayers });
  };

  //This function creates a new deck (shuffled)
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let pinta of pintas) {
        deck.push(i + pinta);
      }
    }

    for (let especial of especiales) {
      for (let pinta of pintas) {
        deck.push(especial + pinta);
      }
    }
    return _.shuffle(deck);
  };

  //This function allow you to take a card
  const askCard = () => {
    if (deck.length === 0) {
      throw "Ismael: No hay más cartas en el deck";
    }
    return deck.pop();
  };

  //This function gives a value related to the card
  const valueCard = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
  };

  //AccumulateScore -> turn:0 = player / turn:1 = machine
  const accumulateScore = (card, turn) => {
    scorePlayers[turn] += valueCard(card);
    smallScore[turn].innerHTML = scorePlayers[turn];
    return scorePlayers[turn];
  };



  //showCard
  const showCard = (card, turn) => {
    const imgCard = document.createElement("img");
    imgCard.src = `./assets/cartas/${card}.png`;
    imgCard.classList.add("cards");
    divCards[turn].append(imgCard);
  };

  //Who is winner
  const andWinnerIs = () => {
    const [minPoints, machineScore] = scorePlayers;
    const playerScore = scorePlayers[0];
    setTimeout(() => {
      if (machineScore === minPoints) {
        alert("This is a TIE :/");
      } else if (minPoints > 21) {
        alert("You lose, try it again! :(");
      } else if (machineScore > 21) {
        alert("You Win!!! :)");
      } else if (machineScore <= 21 && machineScore > playerScore) {
        alert("You lose, try it again! :(");
      } else if (playerScore <= 21 && playerScore > machineScore) {
        alert("You Win!!! :)");
      }
    }, 500);
  };

  //Machine turn
  const machineTurn = (minPoints) => {
    let machineScore = 0;
    do {
      const card = askCard();
      machineScore = accumulateScore(card, scorePlayers.length - 1);
      showCard(card, scorePlayers.length - 1);
    } while (machineScore < minPoints && minPoints <= 21);
    andWinnerIs();
  };

  //EVENT btnAsk
  btnAsk.addEventListener("click", () => {
    const card = askCard();
    const playerScore = accumulateScore(card, 0);
    showCard(card, 0);

    if (playerScore > 21) {
      console.warn("Lo siento, perdiste");
      btnAsk.disabled = true;
      btnStop.disabled = true;
      machineTurn(playerScore);
    } else if (playerScore === 21) {
      console.warn("GANASTE!!!");
      btnAsk.disabled = true;
      btnStop.disabled = true;
      machineTurn(playerScore);
    }
  });

  //EVENT btnStop
  btnStop.addEventListener("click", () => {
    btnAsk.disabled = true;
    btnStop.disabled = true;
    machineTurn(scorePlayers[0]);
  });

  //EVENT btnNew
  btnNew.addEventListener("click", () => {
    startGame();
  });

  return {
    inicializarJuego: startGame
  };

})();
