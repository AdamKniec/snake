// Required variables
const canvasBoard = document.querySelector('.canvas');
let snake;
let context = canvasBoard.getContext('2d');
let scale = 10;
let rows =  canvasBoard.height / scale;
let columns = canvasBoard.width / scale;
let xSpeed = scale * 1;
let ySpeed = 0;

// Snake class, it's design and behaviour
class Snake {
    constructor(){
        this.x = 0;
        this.y = 0;
    }
    draw() {
        context.fillStyle = '#FFFFFF';
        context.fillRect(this.x, this.y, scale, scale); 
    }

    update() {
        this.x += xSpeed;
        this.y += ySpeed;
    }
}

(function init() {
    snake = new Snake();
    window.setInterval(() => {
        context.clearRect(0,0, canvasBoard.width, canvasBoard.height)
        snake.update();
        snake.draw();
    }, 250)
}())
