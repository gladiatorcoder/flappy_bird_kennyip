//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let topPipeImage;
let bottomPipeImage;

window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw flappy bird
    context.fillStyle = "transparent";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./media/flappybird.png"; 
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImage = new Image();
    topPipeImage.src = "./media/toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./media/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener('keydown', moveBird);
    document.addEventListener('click', moveBirdOnClick);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    // bird.y += velocityY;
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    //pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 

        if(!pipe.passed && bird.x > pipe.x+pipe.width){
            score+=0.5;
            pipe.passed = true;
        }

        if(detectCollisions(bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < 0-pipeArray[0].width){
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText('Game Over', 5, 90);
    }
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 -Math.random()*pipeHeight/2;
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);
    console.log(pipeArray);

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
    console.log(pipeArray);
}

function moveBird(e){
    if(e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'KeyX'){
        //jump
        velocityY = -6;
    }

    //reset game
    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function moveBirdOnClick(e){
        //jump
        velocityY = -6;

    //reset game
    if(gameOver){
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollisions(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}