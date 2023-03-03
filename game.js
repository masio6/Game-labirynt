"use strict";
const screen = document.querySelector(".game-screen-container");
const timeShown = document.querySelector("#time");
const livesShown = document.querySelector("#lives");
const recordShown = document.querySelector("#record");
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
var czasmin;
import  {Gracz} from  './gracz.js';

var top10=[];
class ItemPos {
	constructor(posX = null, posY = null) {
		this.x = posX;
		this.y = posY;
	}
}

/* Initial Values */
let theGameStarted = false;

let canvasSize = null;
let gridSize = null;
let elementsSize = null;




const playerPos = new ItemPos();
const giftPos = new ItemPos();
let bombsPos = [];
let skorpionPos=[];
let minoPos=[];
let wallPos=[];
let currentLevel = 0;
let currentLives = 5;
let czas = 0;
const lastLevel = maps.length - 1;
let currentRecord = Number(localStorage.getItem("record"));

timeShown.innerText = "--";
livesShown.innerText = "-- -- -- -- --";
currentRecord ? recordShown.innerText = formatSeconds(currentRecord) : recordShown.innerText = "--";

const MAP_LIMITS = {
	UP: 1,
	LEFT: 1,
	RIGHT: 10,
	DOWN: 10
};

/* Event Listeners */
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
//window.addEventListener("load", hideRulesMenu);
window.addEventListener("load", showMainMenu);

window.addEventListener("keydown", moveByKeys);
document.getElementById("up").addEventListener("click", moveByClicks);
document.getElementById("left").addEventListener("click", moveByClicks);;
document.getElementById("right").addEventListener("click", moveByClicks);;
document.getElementById("down").addEventListener("click", moveByClicks);;

/* Game Logic */
let currentTimer = null;
function startTimer() {
	timeShown.innerText = "";
	currentTimer = setInterval( () => {
		czas++;
		const currentTime = formatSeconds(czas);
		timeShown.innerText = currentTime;
	}, 1000 );
}

function setCanvasSize() {
	if (window.innerHeight < window.innerWidth) {
		canvasSize = window.innerHeight * 0.8;
	} else {
		canvasSize = window.innerWidth * 0.8;
	}
	
	canvasSize = Math.trunc(canvasSize);
	gridSize = Math.trunc(canvasSize / 10);
	canvas.setAttribute("width", canvasSize);
	canvas.setAttribute("height", canvasSize);
	
	if (theGameStarted) renderMap();
}

function renderMap() {	
	elementsSize = gridSize;	
	game.textAlign = "start"
	game.font = `${elementsSize}px sans-serif`;
	
	let actualMap = maps[currentLevel];
	const mapRows = actualMap.trim().split("\n");
	const mapElements = mapRows.map(row => row.trim().split(""));
	
	game.clearRect(0,0, canvasSize, canvasSize);
	let isFirstLoad = (playerPos.x === null && playerPos.y === null);
	let playerMoved = (playerPos.x !== null && playerPos.y !== null);
	
	mapElements.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = colIndex * gridSize; // 0 ~ 9
			const posY = (rowIndex+1) * gridSize; // 1 ~ 10
			game.fillText(emoji, posX, posY);

			if (isFirstLoad) {
				switch(emoji) {
					case "🚪":
						playerPos.x = (colIndex+1);
						playerPos.y = (rowIndex+1);
						game.fillText(emojis["PLAYER"], posX, posY);
	
						break;
						
					case "🧵":
						giftPos.x = (colIndex+1);
						giftPos.y = (rowIndex+1);
			
						break;
						
					case "🟧":
						wallPos.push(new ItemPos( (colIndex+1),(rowIndex+1) ));
						break;
					
					case "🦂":
					 
						skorpionPos.push(new ItemPos( (colIndex+1),(rowIndex+1) ));
						break;
            		
				}
			}
		})
	});
	
	if (playerMoved) {
		const posX = (playerPos.x-1) * gridSize; // 0 ~ 9
		const posY = playerPos.y * gridSize; // 1 ~ 10
		game.fillText(emojis["PLAYER"], posX, posY);
		
		wasAnyHit();
		
		wasTheLevelComplete();
	}
}

/* Player Movement */
function movePlayer(direction) {
	

	
	if (theGameStarted) {
		switch(direction) {
			case "up":
				
				if ( (playerPos.y - 1) >= MAP_LIMITS.UP ) {
					if(itIswall(playerPos.x,playerPos.y - 1)){
						
					}
					else{
					playerPos.y--;
					renderMap();}
				}
				break;
				
			case "left":
				if ( (playerPos.x - 1) >= MAP_LIMITS.LEFT) {
					if(itIswall(playerPos.x-1,playerPos.y)){
						
					}
					else{
					playerPos.x--;
					renderMap();}
				}
				break;
				
			case "right":
				if ( (playerPos.x + 1) <= MAP_LIMITS.RIGHT) {
					if(itIswall(playerPos.x+1,playerPos.y )){
						
					}
					else{
					playerPos.x++;
					renderMap();}
				}
				break;
				
			case "down":
				if ( (playerPos.y + 1) <= MAP_LIMITS.DOWN) {
					if(itIswall(playerPos.x,playerPos.y + 1)){
						
					}
					else{
					playerPos.y++;
					renderMap();}
				}
				break;
		}
		
	}
	

}

function moveByClicks(clickEvent) {
		clickEvent.preventDefault();
	clickEvent.stopPropagation();
	switch (clickEvent.target.id) {
		case "up":
			movePlayer("up");

			break;
		case "left":
			movePlayer("left");

			break;
		case "right":
			movePlayer("right");

			break;
		case "down":
			movePlayer("down");
		
			break;
	}
};

function moveByKeys(keyEvent) {
	switch (keyEvent.code){
		case "ArrowUp":
			movePlayer("up");
	
			break;
		case "ArrowLeft":
			movePlayer("left");
	
			break;
		case "ArrowRight":
			movePlayer("right");
		
			break;
		case "ArrowDown":
			movePlayer("down");

			break;
			
			
		case "KeyW":
			movePlayer("up");
		
			break;
		case "KeyA":
			movePlayer("left");
	
			break;
		case "KeyD":
			movePlayer("right");

			break;
		case "KeyS":
			movePlayer("down");

			break;
	}
}

/* Win and Lose Conditions */
function endGame(wonOrLost) {
	theGameStarted = false;
	switch (wonOrLost) {
		case "won":
			
			clearInterval(currentTimer);
			game.clearRect(0,0, canvasSize, canvasSize);
			
			
		
		//	showGameWonMenu();
			
			if (czas < currentRecord || currentRecord === 0) {
				currentRecord = czas;
				localStorage.setItem("record", czas);
				recordShown.innerText = formatSeconds(currentRecord);
			}
			
		downloadData();
			czasmin=top10[top10.length-1]._data['czas'];
			
			if(czas<czasmin)
			{
			showtop10();	
				
				
				
			}
			else
				showGameWonMenu();
			
			
			break;
		
		case "lost":
			console.log("Zostałeś na zawsze w labiryncie");
			game.clearRect(0,0, canvasSize, canvasSize);
			clearInterval(currentTimer);
			showGameLostMenu();
			break;
	}
}

// Win Condition
function wasTheLevelComplete() {
	const itWas = (playerPos.x === giftPos.x) && (playerPos.y === giftPos.y);
	if (itWas) {
		if (currentLevel !== lastLevel) {
			
			resetAllPositions();
			currentLevel++;
			renderMap();
		} else {
			endGame("won");
		}
	}
}

// Lose Condition
function wasAnyHit() {
	var itWas = skorpionPos.find(skorp => ( (skorp.x === playerPos.x) && (skorp.y === playerPos.y) ));
	

	
	if (itWas) {
		currentLives--;
		updateLivesShown();
		
		if (currentLives > 0) {
			console.log("Uważaj bo zginiesz")
			resetAllPositions();
			renderMap();
		} else {
			endGame("lost");
			
		}
	}
	
	
	
}

function itIswall(x,y) {
	const itIs = wallPos.find(bomb => ( (bomb.x === x) && (bomb.y === y) ));
	return itIs;
	}
	
	
	

/* Menus */

// Main Menu


const wynikiContainer = document.createElement("div");
	wynikiContainer.classList.add("tabela-menu");
var tytuly = document.createElement("thead");
tytuly.innerHTML=` <thead ><tr>
			<th>msc</th>
                    <th>nazwa</th>
                    <th>czas</th><tr></thead>`;
					
					var rekordy = document.createElement("tbody");
					rekordy.classList.add("tbody1");
const wynikiTitle = document.createElement("h2");
	wynikiTitle.innerText = "Oto Najlepsi gracze:";
	wynikiTitle.classList.add("rules__item");
	wynikiTitle.classList.add("rules__item--title");

const wynikiTable = document.createElement("table");
wynikiTable.classList.add("tabela");
wynikiTable.appendChild(tytuly);
wynikiTable.appendChild(rekordy);
const wynikiBtn = document.createElement("button");
	wynikiBtn.innerText = "Wróć";
	wynikiBtn.classList.add("rules__item");
	wynikiBtn.classList.add("rules__item--btn");
	wynikiBtn.addEventListener("click", back);


screen.appendChild(wynikiContainer);
wynikiContainer.appendChild(wynikiTitle);
wynikiContainer.appendChild(wynikiTable);
//wynikiContainer.appendChild(tytuly);
wynikiContainer.appendChild(wynikiBtn);



function showwynikiMenu() { wynikiContainer.classList.remove("inactive"); }
function hidewynikiMenu() { wynikiContainer.classList.add("inactive"); }

hidewynikiMenu();


const RulesContainer = document.createElement("div");
	RulesContainer.classList.add("rules-menu");

const RulesTitle = document.createElement("h2");
	RulesTitle.innerText = "Oto zasady gry";
	RulesTitle.classList.add("rules__item");
	RulesTitle.classList.add("rules__item--title");
const Rules = document.createElement("p");
Rules.innerText = "Znany w całej Grecji budowniczy Dedal zbudował labirynt w którym zamknięty został Minotaur.Twoim zadaniem jest wydostać się z labiryntu w jak najkrótszym czasie pomoże ci w tym nić którą zostawiła księżniczka Ariadnna podążaj postacią do 🧵 uważaj na grasujące 🦂. Powodzenia śmiałku! ";
	Rules.classList.add("rules__item");
	Rules.classList.add("rules__item--tekst");




const RulesBtn = document.createElement("button");
	RulesBtn.innerText = "Wróć";
	RulesBtn.classList.add("rules__item");
	RulesBtn.classList.add("rules__item--btn");
	RulesBtn.addEventListener("click", back);
	
	

screen.appendChild(RulesContainer);
RulesContainer.appendChild(RulesTitle);
RulesContainer.appendChild(Rules);
RulesContainer.appendChild(RulesBtn);

function showRulesMenu() { RulesContainer.classList.remove("inactive"); }
function hideRulesMenu() { RulesContainer.classList.add("inactive"); }

hideRulesMenu();


const mainMenuContainer = document.createElement("div");
	mainMenuContainer.classList.add("game-menu");

const mainMenuTitle = document.createElement("h2");
	mainMenuTitle.innerText = "Czy napewno chcesz wejść do labiryntu 1234 ? 🐮";
	mainMenuTitle.classList.add("game-menu__item");
	mainMenuTitle.classList.add("game-menu__item--title");
	
const mainMenuBtn = document.createElement("button");
	mainMenuBtn.innerText = "Wejdź";
	mainMenuBtn.classList.add("game-menu__item");
	mainMenuBtn.classList.add("game-menu__item--btn");
	mainMenuBtn.addEventListener("click", startGame);
	
	
	const mainMenuBtn2 = document.createElement("button");
	mainMenuBtn2.innerText = "Zasady";
	mainMenuBtn2.classList.add("game-menu__item");
	mainMenuBtn2.classList.add("game-menu__item--btn2");
	mainMenuBtn2.addEventListener("click", zasady);


const mainMenuBtn3 = document.createElement("button");
	mainMenuBtn3.innerText = "Tablica wyników";
	mainMenuBtn3.classList.add("game-menu__item");
	mainMenuBtn3.classList.add("game-menu__item--btn3");
	mainMenuBtn3.addEventListener("click", tabela);
	
screen.appendChild(mainMenuContainer);
mainMenuContainer.appendChild(mainMenuTitle);
mainMenuContainer.appendChild(mainMenuBtn);
mainMenuContainer.appendChild(mainMenuBtn2);
mainMenuContainer.appendChild(mainMenuBtn3);
function showMainMenu() { mainMenuContainer.classList.remove("inactive"); }
function hideMainMenu() { mainMenuContainer.classList.add("inactive"); }

// Win Menu
const wonGameMenuContainer = document.createElement("div");
	wonGameMenuContainer.classList.add("game-menu");
	wonGameMenuContainer.classList.add("inactive");

const wonGameMenuTitle = document.createElement("h2");
	wonGameMenuTitle.innerText = "Gratulacje wydostałeś się";
	
	wonGameMenuTitle.classList.add("game-menu__item");
	wonGameMenuTitle.classList.add("game-menu__item--title");
	
const wonGameMenuTryAgainBtn = document.createElement("button");
	wonGameMenuTryAgainBtn.innerText = "Zagraj jeszcze raz";
	wonGameMenuTryAgainBtn.classList.add("game-menu__item");
	wonGameMenuTryAgainBtn.classList.add("game-menu__item--btn");
	wonGameMenuTryAgainBtn.addEventListener("click", startGame);

const wonGameMenuReturnBtn = document.createElement("button");
	wonGameMenuReturnBtn.innerText = "wróć do menu";
	wonGameMenuReturnBtn.classList.add("game-menu__item");
	wonGameMenuReturnBtn.classList.add("game-menu__item--btn");
	wonGameMenuReturnBtn.addEventListener("click", back);

screen.appendChild(wonGameMenuContainer);
wonGameMenuContainer.appendChild(wonGameMenuTitle);
wonGameMenuContainer.appendChild(wonGameMenuTryAgainBtn);
wonGameMenuContainer.appendChild(wonGameMenuReturnBtn);
function showGameWonMenu() { wonGameMenuContainer.classList.remove("inactive"); }
function hideGameWonMenu() { wonGameMenuContainer.classList.add("inactive"); }

// Lose Menu
const lostGameMenuContainer = document.createElement("div");
	lostGameMenuContainer.classList.add("game-menu");
	lostGameMenuContainer.classList.add("inactive");

const lostGameMenuTitle = document.createElement("h2");
	lostGameMenuTitle.innerText = "Porażka zostałeś w labiryncie na zawsze";
	lostGameMenuTitle.classList.add("game-menu__item");
	lostGameMenuTitle.classList.add("game-menu__item--title");
	
const lostGameMenuTryAgainBtn = document.createElement("button");
	lostGameMenuTryAgainBtn.innerText = "Zagraj jeszcze raz";
	lostGameMenuTryAgainBtn.classList.add("game-menu__item");
	lostGameMenuTryAgainBtn.classList.add("game-menu__item--btn");
	lostGameMenuTryAgainBtn.addEventListener("click", startGame);

const lostGameMenuReturnBtn = document.createElement("button");
	lostGameMenuReturnBtn.innerText = "wróć do menu";
	lostGameMenuReturnBtn.classList.add("game-menu__item");
	lostGameMenuReturnBtn.classList.add("game-menu__item--btn");
	lostGameMenuReturnBtn.addEventListener("click", back);
	
screen.appendChild(lostGameMenuContainer);
lostGameMenuContainer.appendChild(lostGameMenuTitle);
lostGameMenuContainer.appendChild(lostGameMenuTryAgainBtn);
lostGameMenuContainer.appendChild(lostGameMenuReturnBtn);
function showGameLostMenu() { lostGameMenuContainer.classList.remove("inactive"); }
function hideGameLostMenu() { lostGameMenuContainer.classList.add("inactive"); }






const top10Container = document.createElement("div");
	top10Container.classList.add("game-menu");
	top10Container.classList.add("inactive");

const top10Title = document.createElement("h2");
	top10Title.innerText = "Jesteś naprawdę szybki zakwalifikowałeś się do pierwszej 10!!!";
	
	top10Title.classList.add("game-menu__item");
	top10Title.classList.add("game-menu__item--title");
	
const top10input = document.createElement("Input");
	top10input.classList.add("game-menu__item");
	top10input.setAttribute("type","text");


const top10Btn = document.createElement("button");
	top10Btn.innerText = "zatwierdź";
	top10Btn.classList.add("game-menu__item");
	top10Btn.classList.add("game-menu__item--btn");
	top10Btn.addEventListener("click", totop10);

screen.appendChild(top10Container);
top10Container.appendChild(top10Title);
top10Container.appendChild(top10input);
top10Container.appendChild(top10Btn);
function showtop10() { top10Container.classList.remove("inactive"); }
function hidetop10() { top10Container.classList.add("inactive"); }


// Menu Functions
function startGame() {
	hideMainMenu();
	hideGameWonMenu();
	hideGameLostMenu();
	hideRulesMenu();
	hidetop10();
	hidewynikiMenu();
	theGameStarted = true;
	czas = 0;
	currentLevel = 0;
	currentLives = 5;
	resetAllPositions();
	
	showPlayerLives();
	startTimer();
	renderMap();
}

function zasady() {

	showRulesMenu();
	hideMainMenu();
	hideGameWonMenu();
	hideGameLostMenu();
	
	
}

function totop10()
{
	
	var name=top10input.value;


	var gamer=new Gracz();
	gamer.ustawdane(name,czas);
	
	for(var i=0;i<top10.length;i++)
				{
					if(czas<top10[i]._data['czas'])
					{
						top10.splice(i,0,gamer);
						break;
						
					}
					
					
				}
if(top10.length>10)
top10.pop();

sendData();
hidetop10();
showGameWonMenu();	
}
function tabela(){

	
	hideMainMenu();
	hideGameWonMenu();
	hideGameLostMenu();
	hideRulesMenu();
	hidetop10();
	showwynikiMenu();
	rekordy.innerHTML="";
	downloadData();
	for(var i=1;i<top10.length+1;i++)
	{
		
		rekordy.innerHTML+="<tr><td>"+i+"</td><td>"+top10[i-1]._data['nazwa']+"</td><td>"+top10[i-1]._data['czas'].toString()+"</td>";
	}
	
	
	
	
}
function back()
{
	showMainMenu();
	hideGameWonMenu();
	hideGameLostMenu();
	hideRulesMenu();
	hidewynikiMenu();
	
	
}



/* Helpers */
function showPlayerLives() { livesShown.innerText = emojis["HEART"].repeat(currentLives); }
function updateLivesShown() { livesShown.innerText = emojis["HEART"].repeat(currentLives); }

function resetAllPositions() {
	playerPos.x = null;
	playerPos.y = null;
	
	giftPos.x = null;
	giftPos.y = null;
	
	
	skorpionPos=[];
	minoPos=[];
	wallPos=[];
}

function formatSeconds(timeInSeconds) {
	const totalTime = {
		hrs: 0,
		min: 0,
		sec: 0
	};
	
	let counter = timeInSeconds;
	while (counter > 0) {
		if (counter >= 3600) {
			totalTime.hrs = Math.trunc(counter/3600);
			counter -= 3600 * Math.trunc(counter/3600);
		} else if (counter >= 60) {
			totalTime.min = Math.trunc(counter/60);
			counter -= 60 * Math.trunc(counter/60);
		} else if (counter >= 1) {
			totalTime.sec = counter;
			counter -= counter;
		}
	}
	
	let totalTimeInString = "";
	if (totalTime.hrs > 0) totalTimeInString += `${totalTime.hrs} h `;
	if (totalTime.min > 0) totalTimeInString += `${totalTime.min} min `;
	if (totalTime.sec > 0) totalTimeInString += `${totalTime.sec} s`;
	
	return totalTimeInString.trim();
}



function  sendData() {
		
		const json = JSON.stringify(top10);
		fetch(`serw.php`, {
			method: 'POST',
			body: json
		});
		
		
		
		
		
	}
	
	
	function downloadData() {
		fetch(`serw.php`)
			.then((response) => response.json())
			.then((json) => {
			
				json = JSON.parse(json);
				top10=[];
			
             
				// prints all lines on canvas
				json.map((element) => {
			
				top10.push(element);
					
				
					

					// return canvass to preivious scale
					
				});
			});
	}
	tabela();
	hidewynikiMenu();