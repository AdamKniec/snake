// Required variables
const canvasBoard = document.querySelector('.canvas');
let snake;
const context = canvasBoard.getContext('2d');
const scale = 10;
const rows =  canvasBoard.height / scale;
const columns = canvasBoard.width / scale;
let xSpeed = scale;
let ySpeed = 0;
let score = 0;
let tail = [];
let scoreBoard = [];
// const colors = ['yellow','blue', 'brown', 'pink'];


let colors = ['brown'];


let userSpeedSelect = document.querySelector('.speedSelect');
    userSpeedSelect.addEventListener('change',
        function(){
        snakeSpeed = userSpeedSelect.value
    });
let snakeSpeed = userSpeedSelect.value;



let userDurationSelect = document.querySelector('.powerUpDuration');
console.log(userDurationSelect.value);
userDurationSelect.addEventListener('change', function(){
    powerUpDuration = userDurationSelect.value;
})
let powerUpDuration = 0;
let userMultiplier= 4;



// Snake class, it's design and behaviour
class Snake {
    constructor(){
        this.x = 0;
        this.y = 0;
    }
    draw() {
        context.fillStyle = '#FFFFFF';

        // looping throught the tail array and drawing the tail
       for(let i = 0; i<tail.length; i++) {
           context.fillRect(tail[i].x, tail[i].y, scale, scale)
       }
       //drawing the snake
        context.fillRect(this.x, this.y, scale, scale); 
    }

    update() {
        for(let i=0; i<tail.length-1 ; i++) {
            tail[i] = tail[i+1];
        }
        tail[score-1] = {x:this.x, y:this.y};

        this.x += xSpeed;
        this.y += ySpeed;

        if (this.x > canvasBoard.width) {
            this.x = 0;
        }
        if (this.y > canvasBoard.height) {
            this.y = 0;
        }
        if (this.y < 0) {
            this.y = canvasBoard.height;
        }
        if (this.x < 0)
            this.x = canvasBoard.width;
        }
    changeDirection(direction) {
        switch(direction) {
            case 'ArrowDown': 
                xSpeed = 0;
                ySpeed = scale;
                break;
            case 'ArrowUp':
                xSpeed = 0;
                ySpeed = - scale;
                break;
            case 'ArrowLeft':
                xSpeed = -scale;
                ySpeed = 0;
                break;
            case 'ArrowRight':
                xSpeed = scale;
                ySpeed = 0;
                break;
        }
    }
    eat(fruit){
        if(this.x === fruit.x && this.y === fruit.y) {
            // ucinamy ogonek
            if(context.fillStyle === "#ffff00"){
                score --;
                tail.pop();
                console.log('yellow eaten')
            // przyspieszamy węgorza
            } else if(context.fillStyle === "#0000ff") {
                setTimeout(() => {
                    snakeSpeed = 100;
                }, powerUpDuration);
                snakeSpeed = 50;
                console.log('blue');
            //spowalniamy węgorza
            } else if(context.fillStyle === "#a52a2a") {
                setTimeout(() => {
                    snakeSpeed = 100;
                }, powerUpDuration);
                snakeSpeed = 250;
                console.log('brown')
            //przedluzenie ogonka
            } else if((context.fillStyle === '#ffc0cb')) {
                for (let i = 0; i < userMultiplier; i++) {
                    score ++;
                    this.update();
                }
                
                console.log('pink')
            } else if(context.fillStyle === '#ffffff') {
                for (let i = 0; i < userMultiplier; i++) {
                    // ?
                }
            } else {
                score ++;        
            }
            console.log(score);
            return true;
        }
        false;
    }
    collisionCheck() {
        for(let i = 0; i< tail.length; i++) {
            if(this.x === tail[i].x && this.y === tail[i].y) {
                this.submitScore(score);
                score = 0;
                tail = [];
            }
        }
    }
    submitScore(){
        scoreBoard.push(score);
        sessionStorage.setItem('Wyniki', scoreBoard);            
        renderScore();
    }
}


class Fruit {
    constructor(){
        this.x;
        this.y;
    }
    getPosition(){
        this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
    }
    draw(){
        context.fillStyle = 'green';
        context.fillRect(this.x, this.y, scale,scale);
        if(score % 5 === 0 && score !== 0) {
            context.fillStyle = `${colors[Math.floor(Math.random() * colors.length)]}`;
            context.fillRect(this.x, this.y, scale,scale);
            console.log(score)
        }
    }
}

function renderScore(){
    let data = sessionStorage.getItem('Wyniki');
    if(data) {
        let numericData = data.split(',').map(function(item) {
            return parseInt(item);
        }).sort((a,b) => b-a);
        let scoreContainer = document.querySelector('.score-board'); 
        let size = 5;
        const scoreList = ` 
            <ul class="scoreList">
                ${numericData.slice(0,size).map((singleScore,i) => `<li>${i+1} Miejsce - ${singleScore} punkty </li>`)}
            </ul>
        `;
    scoreContainer.innerHTML = scoreList;
   }
};

(function init() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.getPosition();
    // level = new Levels();
    // bonusFruit = new BonusFruit();
    renderScore();
    function loop(){
        context.clearRect(0,0, canvasBoard.width, canvasBoard.height);
        // level.generateFirst();
        snake.draw();
        snake.update();
        fruit.draw();
        snake.eat(fruit) ? fruit.getPosition() : null;
        
        snake.collisionCheck();
        window.setTimeout(loop, snakeSpeed);

    }
loop();
}())

window.addEventListener('keydown', detectTheKey);
function detectTheKey(e) {
    const direction = e.key;
    snake.changeDirection(direction);
}