// get all required elements
const board = document.querySelector('.board')
const modal = document.querySelector('.modal')
let startButton = document.querySelector('.btn-start')
let startGame = document.querySelector('.start-game')
let restartGame = document.querySelector('.restart-game')
let restartButton = document.querySelector('.btn-restart')

// score and timer elements
let highScoreElement = document.querySelector('#high-score')
let scoreElement = document.querySelector('#score')
let timeElement = document.querySelector('#time')

// load high score from local storage
let highScore = localStorage.getItem('highScore') || 0
let score = 0
let time = `00-00`

highScoreElement.innerText = highScore

// size of each block
let blockHeight = 50
let blockWidth = 50

const cols = Math.floor(board.clientWidth/blockWidth)
const rows = Math.floor(board.clientHeight/blockHeight)

// game loop IDs
let IntervalID = null
let timerIntervalID = null

// first food point
let food = {
    x:Math.floor(Math.random() * rows),y:Math.floor(Math.random() * cols)
};

// store blocks in array
const blocks = []
// snake starting position
let snake = [{
    x:1,y:3
}]

let direction = 'down'

// create grid blocks and store them
for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)

        // block.innerText = `${row}-${col}`
        blocks[`${row}-${col}`] = block
    }
}

function render() {

    let head = null

    // show food on board
    blocks[`${food.x}-${food.y}`].classList.add('food')

    // create snake's next head based on direction
    if(direction === 'left'){
        head = {x:snake[0].x,y:snake[0].y-1}
    }else if(direction === 'right'){
        head = {x:snake[0].x,y:snake[0].y+1}
    }
    else if(direction === 'up'){
        head = {x:snake[0].x-1,y:snake[0].y}
    }
    else if(direction === 'down'){
        head = {x:snake[0].x+1,y:snake[0].y}
    }

    // --- GAME OVER CHECKS ---

    // wall hit
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        
        modal.style.display = 'flex'
        startGame.style.display = 'none'
        restartGame.style.display = 'flex'
        clearInterval(IntervalID)
        return;
    }

    // self bite check
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {

        modal.style.display = 'flex'
        startGame.style.display = 'none'
        restartGame.style.display = 'flex'
        clearInterval(IntervalID)
        return;
    }

     // remove old snake body color
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
        
    })

    // if snake eats food
    if(head.x == food.x && head.y == food.y){
        // remove old food
        blocks[`${food.x}-${food.y}`].classList.remove('food')
        // create new food
        food ={
            x:Math.floor(Math.random() * rows),y:Math.floor(Math.random() * cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add('food')

         // grow snake body
        snake.unshift(head)

        // update score
        score+=10
        scoreElement.innerText = score

        // update high score
        if(score > highScore){
            highScore = score
            localStorage.setItem('highScore',highScore.toString())
        }
    }

    // move snake
    snake.unshift(head)
    snake.pop()

    // paint snake on board
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })
}

// start game button
startButton.addEventListener('click',()=>{
    modal.style.display = 'none'

    // start render loop
    IntervalID = setInterval(()=>{
        render()
    },300)

     // start timer
    timerIntervalID = setInterval(()=>{
        let [min,sec] = time.split("-").map(Number)

        if(sec == 59){
            min += 1
            sec = 0
        }else{
            sec += 1
        }

        time = `${min}-${sec}`
        timeElement.innerText = time
    },1000)
})

// restart button
restartButton.addEventListener('click', gameRestart)

function gameRestart() {

    // clear old snake paint
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })
    // clear old food
    blocks[`${food.x}-${food.y}`].classList.remove('food')

     // reset values
    score = 0
    time = `00-00`

    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore

    modal.style.display = 'none'

    // reset snake
    snake = [{
        x:1,y:3
    }]
    direction = 'down'

    // new food
    food = {
        x:Math.floor(Math.random() * rows),y:Math.floor(Math.random() * cols)
    };

    // start game loop again
    IntervalID = setInterval(()=>{
        render()
    },300)
}

// listen to arrow keys
addEventListener("keydown",(event)=>{
    if(event.key == "ArrowLeft"){
        direction = "left"
    }
    else if(event.key == "ArrowRight"){
        direction = "right"
    }
    else if(event.key == "ArrowUp"){
        direction = "up"
    }
    else if(event.key == "ArrowDown"){
        direction = "down"
    }

})
