var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');   

var canvas_backround = document.getElementById('canvas_backround');
var ctx_back = canvas_backround.getContext('2d');   

var _canvas_width_ = 600;
var _canvas_height_ = 600;

let n = 15;

var _width_ = _canvas_width_ / n;
var speed = 125;

var _vector_;
var timer;
var canMove = true;
var firtsMove = true;

var x = Math.floor(n / 2), y = Math.floor(n / 2);
var tails = [[x, y], [x, y], [x, y]];

var mas_Cherry = ["", ""];


// change size backround
function makeBackround(i) {
    n = i;
    _width_ = _canvas_width_ / n;
    // centering the snake in the center of the map
    for (let k = 0; k < tails.length; k++) {
        tails[k][0] = "empty";
        tails[k][1] = "empty";
    }

    x = Math.floor(n / 2), y = Math.floor(n / 2);
    tails[0][0] = x;
    tails[0][1] = y;


    // delete privius timer
    clearInterval(timer);
    draw_backround();
    goCherry();         
    snake_loop();
}


function CloseWindow() {document.getElementById("pWindow").style.display = "none";}
function _speed_(i) {speed = i;}
function setup() {document.getElementById("hidden_block").classList.toggle('hidden');}


// set random position to cherry
function goCherry() {
    let random_x = Math.floor(Math.random() * n);
    let random_y = Math.floor(Math.random() * n);
    for (let k = 0; k < tails.length; k++) {
        if (tails[k][0] != random_x && tails[k][1] != random_y) {
            mas_Cherry[0] = random_x;
            mas_Cherry[1] = random_y;
            _draw_snake_();
            return;
        } else {
            goCherry();
            return;
        }        
    }

}


// draw backround
function draw_backround() {
    ctx_back.clearRect(0, 0, _canvas_width_, _canvas_height_);
    for (var i = 0; i < n; i++){
		for (var j = 0; j < n; j++){  
            ctx_back.beginPath();

            if (i % 2 == j % 2) ctx_back.fillStyle = "#3B4044"; 
            else ctx_back.fillStyle = "#252A30";

            ctx_back.fillRect(j * _width_, i * _width_, _width_, _width_);
            ctx_back.closePath();      
        }
    }  
}


// draw cherry and snake tails
function _draw_snake_() {
	ctx.clearRect(0, 0, _canvas_width_, _canvas_height_);
    ctx.beginPath();
    mas_Cherry
    ctx.fillStyle = "red";
    ctx.fillRect(mas_Cherry[1] * _width_, mas_Cherry[0] * _width_, _width_, _width_);
    ctx.closePath();

    for (let k = 0; k < tails.length; k++) {   
        if (tails[k][0] === "empty" && tails[k][1] === "empty") {continue;}
        ctx.beginPath();

        if (k % 2 == 0) ctx.fillStyle = "#43A804"; 
        else ctx.fillStyle = "#077632"; 

        ctx.fillRect(tails[k][1] * _width_, tails[k][0] * _width_, _width_, _width_);
        ctx.closePath();


    }    
    ctx.beginPath();
    ctx.fillStyle = "#A3DF31"; 
    ctx.fillRect(tails[0][1] * _width_, tails[0][0] * _width_, _width_, _width_);
    ctx.closePath();    
        
}


var border = false;
function borderOn() {border = true;}
function borderOff() {border = false;}


function restartGame() {
    tails = [[x, y], [x, y], [x, y]];
    canMove = true;
    firtsMove = true;
    _draw_snake_();
    lengthSnake();
}


function checkDead() {
    let x = tails[0][0];
    let y = tails[0][1];

    for (let k = tails.length - 1; k > 1; k--) {
        if ((x == tails[k][0] && y == tails[k][1])) {
            // dead from body
            _vector_ = "";
            canMove = false;

            let dead = document.getElementById("menu_dead");
            dead.textContent = "you touch youself";            
            document.getElementById("pWindow").style.display = "block";
            setTimeout(() => {
                CloseWindow();
                restartGame();
                return;      
            }, 1800);
        }
    }

    if (border == true) {
        if ((x >= n || y >= n) || (x <= -1 || y <= -1)) {
            // dead from borders
            _vector_ = "";
            canMove = false;

            let dead = document.getElementById("menu_dead");
            dead.textContent = "dead from border";                
            document.getElementById("pWindow").style.display = "block";
            setTimeout(() => {
                CloseWindow();
                restartGame();
                return;                    
            }, 1800);
        }
    } 

    if (border == false) {
        for (let k = 0; k < tails.length; k++) {
            if (tails[k][0] >= n) {
                tails[k][0] = 0;
            }

            if (tails[k][1] >= n) {
                tails[k][1] = 0;
            }

            if (tails[k][1] <= -1) {
                tails[k][1] = n - 1;
            }

            if (tails[k][0] <= -1) {
                tails[k][0] = n - 1;
            }
        }              
    }
    _draw_snake_();
    return "okay";

}


function move_snake(i1, j1) {
    try {
        // if tail longer than two....
        if (tails.length >= 2) { 
            // start for
            for (let k = tails.length - 1; k >= 1; k--) {
                if (tails[k - 1][0] == "empty" && tails[k - 1][1] == "empty") continue;
                tails[k][0] = tails[k - 1][0];  
                tails[k][1] = tails[k - 1][1];   
            }            
        }
        // head movement ( head number 0)
        tails[0][0] = i1; // x Cordinata
        tails[0][1] = j1; // y Cordinata
        checkDead();
    } catch(e) {}
}  


function lengthSnake() {document.getElementById("lengthSnake").textContent = tails.length;}
lengthSnake();


document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);
var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches
};

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs(xDiff) > Math.abs(yDiff)) {

        if (xDiff > 0) {
            if(canMove == true && (tails[0][0] != tails[1][0] && tails[0][1] - 1 != tails[1][1]) && _vector_ != "left")  { _vector_ = "left";}
            if(canMove == true && firtsMove == true) { _vector_ = "left";}
        } else {
            if(canMove == true && (tails[0][0] != tails[1][0] && tails[0][1] + 1 != tails[1][1]) && _vector_ != "right") { _vector_ = "right";}
            if(canMove == true && firtsMove == true) { _vector_ = "right";}

        }
    }
    if ( Math.abs(xDiff) < Math.abs(yDiff )){

        if (yDiff > 0) {
            if(canMove == true && (tails[0][0] - 1 != tails[1][0] && tails[0][1] != tails[1][1]) && _vector_ != "up")    { _vector_ = "up";}
            if(canMove == true && firtsMove == true) { _vector_ = "up";}
        } else {
            if(canMove == true && (tails[0][0] + 1 != tails[1][0] && tails[0][1] != tails[1][1]) && _vector_ != "down")  { _vector_ = "down";}  
            if(canMove == true && firtsMove == true) { _vector_ = "down";}   
        }
    }
}

xDown = null;
yDown = null;


function __vector__() {
    document.addEventListener("keydown", function(event) {
        if(canMove == true && event.key == "ArrowUp"    && (tails[0][0] - 1 != tails[1][0] && tails[0][1] != tails[1][1]) && _vector_ != "up")    { _vector_ = "up";}
        if(canMove == true && event.key == "ArrowDown"  && (tails[0][0] + 1 != tails[1][0] && tails[0][1] != tails[1][1]) && _vector_ != "down")  { _vector_ = "down";}   
        if(canMove == true && event.key == "ArrowLeft"  && (tails[0][0] != tails[1][0] && tails[0][1] - 1 != tails[1][1]) && _vector_ != "left")  { _vector_ = "left";}
        if(canMove == true && event.key == "ArrowRight" && (tails[0][0] != tails[1][0] && tails[0][1] + 1 != tails[1][1]) && _vector_ != "right") { _vector_ = "right";}

        if(canMove == true && event.key == "ArrowUp"    && firtsMove == true) { _vector_ = "up";}
        if(canMove == true && event.key == "ArrowDown"  && firtsMove == true) { _vector_ = "down";}   
        if(canMove == true && event.key == "ArrowLeft"  && firtsMove == true) { _vector_ = "left";}
        if(canMove == true && event.key == "ArrowRight" && firtsMove == true) { _vector_ = "right";}
	    
	if(canMove == true && event.code == "KeyW"    && (tails[0][0] - 1 != tails[1][0] && tails[0][1] != tails[1][1]) && _vector_ != "up")    { _vector_ = "up";}
        if(canMove == true && event.code == "KeyS"  && (tails[0][0] + 1 != tails[1][0] && tails[0][1] != tails[1][1]) && _vector_ != "down")  { _vector_ = "down";}   
        if(canMove == true && event.code == "KeyA"  && (tails[0][0] != tails[1][0] && tails[0][1] - 1 != tails[1][1]) && _vector_ != "left")  { _vector_ = "left";}
        if(canMove == true && event.code == "KeyD" && (tails[0][0] != tails[1][0] && tails[0][1] + 1 != tails[1][1]) && _vector_ != "right") { _vector_ = "right";}

        if(canMove == true && event.code == "KeyW"    && firtsMove == true) { _vector_ = "up";}
        if(canMove == true && event.code == "KeyS"  && firtsMove == true) { _vector_ = "down";}   
        if(canMove == true && event.code == "KeyA"  && firtsMove == true) { _vector_ = "left";}
        if(canMove == true && event.code == "KeyD" && firtsMove == true) { _vector_ = "right";}
		
        firtsMove = false;
        firtsMove = false;
    });    
}


function _moving_() {
    // If head have position same with cherry
    if (mas_Cherry[0] == tails[0][0] && mas_Cherry[1] == tails[0][1]) {
        mas_Cherry[0] = "";
        mas_Cherry[1] = "";

        tails.push(["empty", "empty"]);                    

        lengthSnake();
        goCherry(); 
    }

    try {
        if (_vector_ === "up") { 
            move_snake(tails[0][0] - 1, tails[0][1]);
        }                
    } catch(e) {}


    try {
        if (_vector_ === "down") {
            move_snake(tails[0][0] + 1, tails[0][1]);
        }                   
    } catch(e) {}


    try {
        if (_vector_ === "left") {
            move_snake(tails[0][0], tails[0][1] - 1);
        }                  
    } catch(e) {}

    try {
        if (_vector_ === "right") {
            move_snake(tails[0][0], tails[0][1] + 1);
        }                    
    } catch(e) {}

    _draw_snake_();
}


function snake_loop() {
    _moving_(); 
    __vector__();    
    timer = setTimeout(snake_loop, speed);     // 225
};

draw_backround();   
goCherry();         
snake_loop();
