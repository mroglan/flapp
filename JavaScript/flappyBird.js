let canvas, ctx, w, h;
let upBird, downBird, upPipe, downPipe, backgroundImage, blueBackground;
let interval, interval2;
let upPipeArray = [], downPipeArray = [];
let oldTime = 0, delta;
let event1, event2, event3, event4, event5, event6, event7;
let mousePos;
let animation1;
let spawn = true, spawn2 = true;
let falling = true;
let canClick = true, count = 15;
let bird;
let outOfBounds = false;
let score = 0;
let theTime = 0;

class Bird {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	drawBird() {
		if(falling) {
			ctx.drawImage(downBird, 0, 0, 217, 211, this.x, this.y, this.width, this.height);
		}
		else {
			ctx.drawImage(upBird, 0, 0, 238, 201, this.x, this.y, this.width, this.height);
		}
	}
	
	moveBird() {
		if(oldTime - theTime < 100000) {
			if(count < 10) {
				this.y -= h/50;
				falling = false;
			}
			else if(count > 9 && count < 50) {
				this.y += h/150;
				falling = true;
			}
			else {
				this.y += h/100;
				falling = true;
			}
		}
		else {
			if(count < 10) {
				this.y -= h/50;
				falling = false;
			}
			else if(count > 9 && count < 50) {
				this.y += h/100;
				falling = true;
			}
			else {
				this.y += h/50;
				falling = true;
			}
		}
	}
	
	testForExit() {
		if(this.y > h || this.y + this.height < 0) {
			outOfBounds = true;
			endScreen();
		}
	}
}

class UpPipe {
	constructor(x, y, speed, width, height) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.width = width;
		this.height = height;
	}
	
	movePipe() {
		this.x -= calcDistanceToMove(delta, this.speed);
		ctx.drawImage(downPipe, 0, 0, 46, 183, this.x, this.y, this.width, this.height);
	}
	
	checkForExit(index) {
		if(this.x + this.width < 0) {
			upPipeArray.splice(index, 1);
		}
	}
	
	testHit() {
		if(bird.x + (4 * bird.width/3) > this.x && this.x + this.width - bird.x > bird.width/3) {
			if(bird.y + (bird.height/2) < this.y + this.height) {
				outOfBounds = true;
				endScreen();
			}
		}
	}
}

class DownPipe {
	constructor(x, y, speed, width, height) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.width = width;
		this.height = height;
	}
	
	movePipe() {
		this.x -= calcDistanceToMove(delta, this.speed);
		ctx.drawImage(upPipe, 0, 0, 46, 183, this.x, this.y, this.width, this.height);
	}
	
	checkForExit(index) {
		if(this.x + this.width < 0) {
			score++;
			downPipeArray.splice(index, 1);
		}
	}
	
	testHit() {
		if(bird.x + 4 * bird.width/3 > this.x && this.x + this.width - bird.x > bird.width/3) {
			if(bird.y + (bird.height/2) > this.y) {
				outOfBounds = true;
				endScreen();
			}
		}
	}
}
		

window.onload = function() {
	canvas = document.querySelector("#gameCanvas");
	gameArea = document.querySelector("#gameArea");
	ctx = canvas.getContext('2d');
	
	event1 = function(e) {
		mousePos = getMousePos(e);
		console.log(mousePos.x + ", " + mousePos.y);
	};
	
	event2 = function(e) {
		checkGameBeginClick(e);
	};
	
	event3 = function(e) {
		checkGameBeginTap(e);
	};
	
	event4 = function(e) {
		count = 0;
	}
	
	event5 = function(e) {
		if(e.keyCode === 32) {
			count = 0;
		}
	}
	event6 = function() {
		beginGame();
	}
	
	event7 = function() {
		count = 0;
	}
	
	resizeGame();
	
	addEventListener('resize', resizeGame, false);
	addEventListener('orientationchange', resizeGame, false);
	
	addEventListener('mousemove', event1);
	addEventListener('keydown', event2);
	addEventListener('mousedown', event3);
	addEventListener('touchstart', event6);
	
	
	loadGameData();
};

function getMousePos(e) {
	let rect = canvas.getBoundingClientRect();
	
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

function checkGameBeginTap(e) {
	if(mousePos.y >= h/3 && mousePos.y <= h/3 + h/4 && mousePos.x >= w/4 && mousePos.x <= 3*w/4) {
		beginGame();
	}
}

function checkGameBeginClick(e) {
	if(e.keyCode === 32) {
		console.log("clicked");
		beginGame();
	}
}


function calcDistanceToMove(delta, speed) {
	return speed * delta / 1000;
}

function resizeGame() {
	let widthToHeight = 5/2.5;
	let newWidth = window.innerWidth -10;
	let newHeight = window.innerHeight - 10;
	let newWidthToHeight = newWidth / newHeight;
	
	if(newWidthToHeight > widthToHeight) {
		newWidth = newHeight * widthToHeight;
		gameArea.style.height = newHeight + 'px';
		gameArea.style.width = newWidth + 'px';
	}
	else {
		newHeight = newWidth / widthToHeight;
		gameArea.style.height = newHeight + 'px';
		gameArea.style.width = newWidth + 'px';
	}
	
	gameArea.style.marginTop = (-newHeight/2) + 'px';
	gameArea.style.marginLeft = (-newWidth/2) + 'px';
	gameArea.style.fontSize = (newWidth/400) + 'em';
	
	canvas.width = newWidth;
	canvas.height = newHeight;
	
	w = canvas.width;
	h = canvas.height;
}

function loadMainMenu(currentTime) {
	delta = currentTime - oldTime;
	ctx.save();
	
	ctx.clearRect(0, 0, w, h);
	
	displayBackground();
	movePipes();
	drawEnterBox();
	
	ctx.restore();
	
	oldTime = currentTime;
	animation1 = requestAnimationFrame(loadMainMenu);
}

function drawEnterBox() {
	ctx.save();
	
	ctx.lineJoin = 'round';
	ctx.fillStyle = '#EC1010';
	
	ctx.fillRect(w/4, h/3, w/2, h/4);
	
	ctx.textAlign = 'center';
	ctx.font = h/10 + 'px Arial';
	ctx.fillStyle = 'black';
	
	ctx.fillText('Press Space', w/2, 1.3*h/3);
	ctx.fillText('or Tap', w/2, 1.6 * h/3);
	
	ctx.restore();
}

function loadGameData() {
	
	bird = new Bird(w/3, h/2, w/20, w/20);
	
	upBird = new Image();
	upBird.src = 'media/downBird.png';
	
	downBird = new Image();
	downBird.src = 'media/upBird.png';
	
	upPipe = new Image();
	upPipe.src = 'media/upPipe.png';
	
	downPipe = new Image();
	downPipe.src = 'media/downPipe.png';
	
	blueBackground = new Image();
	blueBackground.src = 'media/blue.png';
	
	backgroundImage = new Image();
	backgroundImage.src = 'media/background.png';
	
	backgroundImage.onload = function() {
		loadMainMenu();
		loadPipes(0);
	};
}

function displayBackground() {
	ctx.save();
	for(let i = 0; i < w; i+= 300) {
		ctx.drawImage(backgroundImage, 0, 0, 300, 504, i, h - 504, 300, 504);
	}
	ctx.drawImage(blueBackground, 0, 0, 5, 5, 0, 0, w, h - 504);
	ctx.restore();
}

function loadPipes(stage) {
	if(stage === 0) {
		interval = setInterval(spawnPipes0, 2000);
	}

}

function spawnPipes0() {
	console.log("spawning pipe");
	let randWidth = .1 * w;
	let randHeight = Math.random() * 2 * h/3
	let distance = Math.random() * h/3 + h/3;
	
	
	let uPipe = new UpPipe(w, 0, w/4, randWidth, randHeight);
	upPipeArray.push(uPipe);
	
	let dPipe = new DownPipe(w, randHeight + distance, w/4, randWidth, h);
	downPipeArray.push(dPipe);
}

function spawnPipes1() {
	let randWidth = .1 * w;
	let randHeight = Math.random() * 2 * h/3
	let distance = Math.random() * h/3 + (1.3*h/3);
	
	while(distance < 1.5 * h/3) {
		distance = Math.random() * h/3 + (1.3*h/3);
	}
	
	let uPipe = new UpPipe(w, 0, w/4, randWidth, randHeight);
	upPipeArray.push(uPipe);
	
	let dPipe = new DownPipe(w, randHeight + distance, w/4, randWidth, h);
	downPipeArray.push(dPipe);
}

function spawnPipes2() {
	let randWidth = .1 * w;
	let randHeight = Math.random() * 2 * h/3
	let distance = Math.random() * h/3 + h/4;
	
	let uPipe = new UpPipe(w, 0, w/4, randWidth, randHeight);
	upPipeArray.push(uPipe);
	
	let dPipe = new DownPipe(w, randHeight + distance, w/4, randWidth, h);
	downPipeArray.push(dPipe);
}

function movePipes() {
	upPipeArray.forEach( function(pipe, index) {
		pipe.movePipe();
		pipe.checkForExit(index);
	});
	downPipeArray.forEach( function(pipe, index) {
		pipe.movePipe();
		pipe.checkForExit(index);
	});
}

function beginGame() {
	removeEventListener('mousedown', event3);
	removeEventListener('keydown', event2);
	removeEventListener('touchstart', event6);
	cancelAnimationFrame(animation1);
	clearInterval(interval);
	upPipeArray = [];
	downPipeArray = [];
	score = 0;
	outOfBounds = false;
	bird.y = h/2;
	spawn = true;
	spawn2 = true;
	oldTime = 0;
	
	addEventListener('mousedown', event4);
	addEventListener('keydown', event5);
	addEventListener('touchstart', event7);
	animation1 = requestAnimationFrame(startMatch);
}

function startMatch(currentTime) {
	console.log("hi");
	count++;
	delta = currentTime - oldTime;
	
	ctx.clearRect(0, 0, w, h);
	
	displayBackground();
	
	checkTime(currentTime - theTime);
	
	movePipes();
	testForCollision();
	
	bird.drawBird();
	bird.moveBird();
	bird.testForExit();
	
	drawScore();
	
	
	oldTime = currentTime;
	
	if(!outOfBounds) {
	animation1 = requestAnimationFrame(startMatch);
	}
	else {
		endScreen();
		theTime = currentTime;
	}
	
}

function drawScore() {
	ctx.save();
	
	ctx.fillStyle = 'black';
	ctx.font = '20px Arial';
	ctx.fillText('Score: ' + score, w/10, h/10);
	
	ctx.restore();
}

function testForCollision() {
	upPipeArray.forEach( function(pipe) {
		pipe.testHit();
	});
	downPipeArray.forEach( function(pipe) {
		pipe.testHit();
	});
}

function checkTime(time) {
	console.log(time);
	if(time < 10000 && spawn) {
		interval = setInterval(spawnPipes1, 3000);
		spawn = false;
	}
	else if(time > 10000 && time < 20000 && spawn2) {
		clearInterval(interval);
		interval = setInterval(spawnPipes2, 2000);
		spawn = true;
		spawn2 = false;
	}
	else if(time > 20000 && time < 100000 && spawn) {
		clearInterval(interval);
		interval = setInterval(spawnPipes2, 1500);
		spawn = false;
		spawn2 = true;
	}
	else if(time > 100000 && spawn2) {
		clearInterval(interval);
		interval = setInterval(spawnPipes2, 1000);
		spawn = true;
		spawn2 = false;
	}
}

function endScreen() {
	console.log("hello");
	cancelAnimationFrame(animation1);
	clearInterval(interval);
	removeEventListener('mousedown', event4);
	removeEventListener('keydown', event5);
	removeEventListener('touchstart', event7);
	ctx.clearRect(0, 0, w, h);
	
	displayBackground();
	drawEnterBox();
	
	addEventListener('keydown', event2);
	addEventListener('mousedown', event3);
	
	ctx.save();
	
	ctx.fillStyle = 'black';
	ctx.font = '50px Arial';
	ctx.textAlign = 'center';
	ctx.fillText('Final Score: ' + score, w/2, 5 * h/7);
	
	ctx.restore();
	
	
}



