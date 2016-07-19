(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 200,
    player = {
        x: 25,
        y: height - 15,
        width: 10,
        height: 15,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        color: "red"
    },
    keys = [],
    friction = 0.8,
    gravity = 0.5,
    sleeping = false,
    moving = false;

var boxes = [];
var timer = 60;
var chess = false;
var state = 0;

// dimensions
boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: height
});
boxes.push({
    x: 0,
    y: height - 2,
    width: width,
    height: 50
});
boxes.push({
    x: width - 10,
    y: 0,
    width: 50,
    height: height
});

canvas.width = width;
canvas.height = height;
document.getElementById("current").innerText = "Harry";
document.getElementById("notification").innerText = 'You have snuck into the forbidden third floor corridor with your best friends Ron and Hermoine in your first year of school.  Get to the Philosopher\'s Stone before Snape does! But first, you need to find a way past Fluffy, the 3 headed dog (large green blob)';
document.getElementById("action").innerText = 'No action';

function updatelvl1() {
    if (player.x > 455 && player.x < 475) {
      state = 1;
      document.getElementById("action").innerText =  'Open trapdoor and enter';
    } else if (state === 1) {
      state = 0;
      document.getElementById("action").innerText = 'No action';
    }
    if (player.x > 295 && player.x < 315) {
      state = 2;
      document.getElementById("action").innerText = 'Play the harp';
    } else if (state === 2) {
      state = 0;
      document.getElementById("action").innerText = 'No action';
    }
    // check keys 
    if (keys[17]) {   
      changeCharacter();
      keys[17] = false;
    }
    if (keys[32]) {
        // space
      if (state === 1) {
        document.getElementById("notification").innerText = 'You fell through the trap door but landed softly in some plant.  Watch out though, it is wrapping itself around you!';
        return initRoomTwo();
      }
      if (state === 2) {
        document.getElementById("notification").innerText = 'You played the harp and Fluffy fell asleep.  You can now pass safely';
        sleeping = true;
      }
    }
    if (keys[38]) {
        // up arrow
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 3;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
    player.velX *= friction;
    player.velY += gravity;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.beginPath();
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        var dir = colCheck(player, boxes[i]);
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }
    if(player.grounded){
         player.velY = 0;
    }
    player.x += player.velX;
    player.y += player.velY;
    ctx.fill();
		// Harp
		ctx.fillStyle = 'yellow';
    ctx.fillRect(300, 178, 10, 20);
		// Fluffy
    ctx.fillStyle = 'green';
    ctx.fillRect(390, 148, 40, 50);
    if (!sleeping && player.x > 390) {
    	console.log("fluffy eats you");
      return;
    }
    // Trapdoor
		ctx.fillStyle = 'rgb(181,101,29)'
		ctx.fillRect(455, 197, 20, 3);
    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(updatelvl1);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
window.addEventListener("load", function () {
    updatelvl1();
});

// ROOM TWO

function initRoomTwo() {
	player.x = 25;
  player.y = 15;
  refreshIntervalId = setInterval(function() {
    timer--;
    console.log("Time left: " + timer);
  }, 1000);
  boxes.push({
    x: 0,
    y: height / 2,
    width: width,
    height: 1
  });
  requestAnimationFrame(updatelvl2);
}

function updatelvl2() {
    // check keys
    if (keys[17]) {   
    	changeCharacter();
      keys[17] = false;
    }
    if (keys[32]) {
				// space
        if (player.color == "blue") {
        	player.y += 10;
        } else {
        	timer -= 5;
        } 
        if (player.x > 485 - player.width && player.y > height / 2) {
        	console.log('enter door');
          clearInterval(refreshIntervalId);
          return initRoomThree();
        }
        keys[32] = false;
    }
    if (keys[38]) {
        // up arrow
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 3;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
		if (timer < 0) {
      clearInterval(refreshIntervalId);
    	return console.log('out of time');
    }
    player.velX *= friction;
    player.velY += gravity;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.beginPath();
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        var dir = colCheck(player, boxes[i]);
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }
    if(player.grounded){
         player.velY = 0;
    }
    player.x += player.velX;
    player.y += player.velY;
    ctx.fill();
		ctx.fillStyle = "green";
    ctx.fillRect(10, height/2 - 10, width, 20);
		ctx.fillStyle = "brown";
    ctx.fillRect(width - 10, height - 32, 10, 30);
    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    requestAnimationFrame(updatelvl2);
}

// ROOM THREE
function initRoomThree() {
	boxes.pop();
  boxes.push({
  	x: width / 2,
    y: height- 12,
    height: 10,
    width: 10
  })
  player.x = 25;
  requestAnimationFrame(updatelvl3);
}
function updatelvl3() {
    // check keys
    if (keys[17]) {   
    	changeCharacter();
      keys[17] = false;
    }
    if (keys[32]) {
				// space
        if (player.x > (width/2 - 15) && player.x < (width/2 + 25)) {
        	if (player.color == "purple") {
          	console.log('you win the chess game')
            chess = true;
          } else {
            console.log("Only Ron knows how to play chess");
            return;
          }
        }
        
        if (player.x > 485 - player.width && player.y > height / 2 && chess) {
        	console.log('enter door');
          return keysGame();
        }
        keys[32] = false;
    }
    if (keys[38]) {
        // up arrow
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 3;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
    player.velX *= friction;
    player.velY += gravity;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.beginPath();
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        var dir = colCheck(player, boxes[i]);
        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }
    if(player.grounded){
         player.velY = 0;
    }
    player.x += player.velX;
    player.y += player.velY;
    ctx.fill();
		ctx.fillStyle = "orange";
    ctx.fillRect(width/2, height-14, 10, 2);
		//door
		ctx.fillStyle = "brown";
    ctx.fillRect(width - 10, height - 32, 10, 30);
    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    requestAnimationFrame(updatelvl3);
}

// KEYS ROOM
var opts = {
	numKeys: 0
}
var fkeys = [];
function keysGame() {
  player.x = 25;
 for (var i=0; i < 10; i++) {
    var x = Math.floor(Math.random() * width);
    var y = Math.floor(Math.random() * height);
    while (x < 10 || x > width-10) {
      x = Math.floor(Math.random() * width);
    }
    while (y < 10 || y > height-10) {
      y = Math.floor(Math.random() * height);
    }
    fkeys.push({
      x: x,
      y: y
    });
    opts.numKeys++;
  }
  keys[32] = false;
  keysloop();
}
function keysloop() {
  if (keys[32]) {
      // space
      for (var i = 0; i < opts.numKeys; i++) {
      var key = fkeys[i];
      if (player.x > key.x - 15 && player.x < key.x + 15 && player.y > key.y - 15 && player.y < key.y + 15) {
        console.log("Im stealing a key, but is it the right one?");
        keys.splice(i, 1);
        opts.numKeys--;
        break;
      }
    }
  }
  if (keys[38]) {
      // up arrow
    direction = 'up';
    moving = true;
  }
  if (keys[39]) {
    // right arrow
    direction = 'left';
    moving = true;
  }
  if (keys[40]) {
    // down arrow
    direction = 'down';
    moving = true;
  }
  if (keys[37]) {
    // left arrow
    direction = 'right';
    moving = true;
  }	
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  for (var i = 0; i < opts.numKeys; i++) {
    var key = fkeys[i];
    ctx.beginPath();
    ctx.arc(key.x, key.y, 10, 0, Math.PI * 2, false);
    ctx.stroke();
    var dir = Math.ceil(Math.random() * 9);
    if (dir === 1) {
      key.x--;
      if (key.x < 10) {
        key.x++;
      }
    } else if (dir == 2) {
      key.x++;
      if (key.x > width-10) {
        key.x--;
      }
    } else if (dir == 3) {
      key.y++;
      if (key.y > height-10) {
        key.y--;
      }
    } else if (dir == 4) {
      key.y--;
      if (key.y < 10) {
        key.y++;
      }
    } else if (dir == 5) {
      key.x--;
      key.y++;
      if (key.x < 10) {
        key.x++;
      }
      if (key.y > height-10) {
        key.y--;
      }
    } else if (dir == 6) {
      key.x++;
      key.y++;
       if (key.x > width-10) {
        key.x--;
      }
      if (key.y > height-10) {
        key.y--;
      }
    } else if (dir == 7) {
      key.x--;
      key.y--;
      if (key.x < 10) {
        key.x++;
      }
      if (key.y < 10) {
        key.y++;
      }
    } else if (dir == 8) {
      key.x++;
      key.y--;
       if (key.x > width-10) {
        key.x--;
      }
      if (key.y < 10) {
        key.y++;
      }
    } else if (dir == 9) {
      // dont move
    }
  }
  if (moving) {
    if (direction === 'up') {
      player.y--;
    } else if (direction === 'down') {
      player.y ++;
    } else if (direction === 'left') {
      player.x++;
    } else if (direction === 'right') {
      player.x--;
    }
  }
  ctx.fillStyle="#FF0000";
  ctx.fillRect(player.x, player.y, 20,20);
  if (opts.numKeys < 5) {
    return lastRoom();
  }
  requestAnimationFrame(keysloop);
}

function lastRoom () {
	player.x = 25;
  player.y = height - 15;
  player.color = "red";
  boxes.pop();
  requestAnimationFrame(updateLastRoom);
}

function changeCharacter() {
  console.log('change character');
  if (player.color == "red") {
    document.getElementById("current").innerText = "Hermoine";
    player.color = "blue";
  } else if (player.color == "blue") {
    document.getElementById("current").innerText = "Ron";
    player.color = "purple";
  } else {
    document.getElementById("current").innerText = "Harry";
    player.color = "red";
  }
}

// MIRROR ROOM
function updateLastRoom() {
if (keys[17]) {   
			changeCharacter();
      keys[17] = false;
    }
    if (keys[32]) {
    		// space
        if (player.x > 430 && player.x < 450) {
        	console.log("Congratulations - you win!");
          return;
        }
    }
    if (keys[38]) {
        // up arrow
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 3;
        }
    }
    if (keys[39]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }
    player.velX *= friction;
    player.velY += gravity;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.beginPath();
    
    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        
        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }

    }
    if(player.grounded){
         player.velY = 0;
    }
    player.x += player.velX;
    player.y += player.velY;
    ctx.fill();
		// Mirror
		ctx.fillStyle = 'yellow';
    ctx.fillRect(450, 168, 10, 30);
		// Quirrel
		ctx.fillStyle = 'lightgreen';
    ctx.fillRect(435, 178, 10, 20);
    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(updateLastRoom);
}
