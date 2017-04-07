var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 300;
var NEW_FOOD_TIME = 5000;
var NEW_BARRIER_TIME = 5000; // возникновение барьера

var isGameRunning = false;
var snakeTimer;
var snake = [];
var direction = 'x-';

function init() { // формирование кнопок для начала и конца игры
  var startButton = document.getElementById('snake-start');
  startButton.addEventListener('click', startGame);

  var renewButton = document.getElementById('snake-renew');
  renewButton.addEventListener('click', refreshGame);

  addEventListener('keydown', changeDirection);

  buildGameField();
}

function buildGameField() { // генерация игрового поля
  var gameTable = document.createElement('table');
  gameTable.classList.add('game-table');

  for(var i = 0; i < FIELD_SIZE_X; i++) { // генерация игрового поля, по горизонтале
    var row = document.createElement('tr');
    row.classList.add('game-table-row');

    for(var j = 0; j < FIELD_SIZE_Y; j++) { // генерация игрового поля, по вертикале
      var cell = document.createElement('td');
      cell.classList.add('game-table-cell');
      cell.classList.add('cell-' + i + "-" + j);

      row.appendChild(cell);
    }
    gameTable.appendChild(row);
  }

  document.getElementById('snake-field').appendChild(gameTable);
}

function changeDirection(event) { // смена движений змейки по полю
  switch (event.keyCode) {
    case 37: // кнопка вверх
      if(direction != 'y+') {
        direction = 'y-';
      }
      break;
    case 38: // кнопка влево
      if(direction != 'x+') {
        direction = 'x-';
      }
      break;
    case 39: // кнопка вниз
      if(direction != 'y-') {
        direction = 'y+';
      }
      break;
    case 40: // кнопка вправо
      if(direction != 'x-') {
        direction = 'x+';
      }
      break;

  }
}

function startGame() { // начало игры
  isGameRunning = true;
  respawn();

  snakeTimer = setInterval(move, SNAKE_SPEED);
  setTimeout(createFood, NEW_FOOD_TIME);
  setInterval(barrierForSnake, NEW_BARRIER_TIME); //время появления барьеров и смены их расположения
}

function respawn() {
  var startCoordX = Math.floor(FIELD_SIZE_X / 2);
  var startCoordY = Math.floor(FIELD_SIZE_Y / 2);

  var snakeHead
    = document.getElementsByClassName('cell-' + startCoordX + '-' + startCoordY)[0];
  snakeHead.classList.add('snake-unit');

  var snakeTail
    = document.getElementsByClassName('cell-' + (startCoordX - 1) + '-' + startCoordY)[0];

  snakeTail.classList.add('snake-unit');

  snake = [];

  snake.push(snakeHead);
  snake.push(snakeTail);
}

function move() { // движение змейки по полю
  var snakeHeadClasses = snake[snake.length - 1].classList;

  var newUnit;
  var snakeCoords = snakeHeadClasses[1].split('-');
  var coordX = parseInt(snakeCoords[1]);
  var coordY = parseInt(snakeCoords[2]);

  switch(direction) {
    case 'x-':
      newUnit = document.getElementsByClassName('cell-' + (coordX - 1) + '-' + coordY)[0];
      break;
    case 'x+':
      newUnit = document.getElementsByClassName('cell-' + (coordX + 1) + '-' + coordY)[0];
      break;
    case 'y-':
      newUnit = document.getElementsByClassName('cell-' + coordX + '-' + (coordY - 1))[0];
      break;
    case 'y+':
      newUnit = document.getElementsByClassName('cell-' + coordX + '-' + (coordY + 1))[0];
      break;
  }

  if(newUnit !== undefined && !newUnit.classList.contains('snake-unit')) { //формирование еды
    newUnit.classList.add('snake-unit');
    snake.push(newUnit);

    if(!newUnit.classList.contains('food-unit')) {
      var removed = snake.splice(0, 1)[0];
      removed.classList.remove('snake-unit');
    } else {
      newUnit.classList.remove('food-unit');
      createFood();
      gameScore();
      barrierCell();
    }
  } else {
    finishGame();
  }
}

function createFood() { // создание еды и ее появление на поле, не пересекаясь со змейкой
  var foodCreated = false;

  while(!foodCreated) {
    var foodX = Math.floor(Math.random() * FIELD_SIZE_X);
    var foodY = Math.floor(Math.random() * FIELD_SIZE_Y);

    var foodCell = document.getElementsByClassName('cell-' + foodX + '-' + foodY)[0];

    if(!foodCell.classList.contains('snake-unit')) {
      foodCell.classList.add('food-unit');
      foodCreated = true;
    }
  }
}

function barrierForSnake() { //функция, которая произвольно формирует барьер для змейки
	document.getElementsByClassName('barrier-unit')[0].classList.remove('barrier-unit');
	var barrier = false;

	while(!barrier) {
		var barrierX = Math.floor(Math.random() * FIELD_SIZE_X);
		var barrierY = Math.floor(Math.random() * FIELD_SIZE_Y);
	

	var barrierCell = document.getElementsByClassName('cell-' + barrierX + '-' + barrierY)[0];

	if(!barrierCell.classList.contains('snake-unit')) {
		barrierCell.classList.add('barrier-unit');
		barrier = true;
		}
	}
}

function gameScore(){ //количество очков.
	
	var score = document.getElementById('score');
	var food = 100;

	score.innerText = (snake.length - 2) * food;
}

function finishGame() {
  clearInterval(snakeTimer);
  isGameRunning = false;

  alert('GAME OVER! YOU SCORE IS: ' + gameScore()); //при окончании игры показать счет.
}

function refreshGame() {
  location.reload(); //location - объект, отвечающий за текущий URL
}

window.onload = init;

