// Base classes

// Player
class Player {
    constructor(name, color, x, y) {
        // TODO replace color with url to asset
        this.name = name;
        
        // Drawing stuff
        this.color = color;
        this.width = 10;
        this.height = 15;
        
        // Movement Stuff
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.grounded = false;
    }
    
    static changeCharacter(players, current) {
        let x = players[current].x, y = players[current].y
        current = (current + 1) % players.length;
        players[current].x = x;
        players[current].y = y;
        setPlayer(players[current]);
    }
    
    draw (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    move (level) {
        if (keys[17]) {  
            // Control key
            if (level.changeCharacter) {
                level.changeCharacter();
            } else {
                Player.changeCharacter(level.players, level.currentPlayer);
            }
            keys[17] = false;
        }
        if (keys[38]) {
            // up arrow
            if (!this.jumping && this.grounded) {
                this.jumping = true;
                this.grounded = false;
                this.velY = -this.speed * 3;
            }
        }
        if (keys[39]) {
            // right arrow
            if (this.velX < this.speed) {
                this.velX++;
            }
        }
        if (keys[37]) {
            // left arrow
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }
        this.velX *= friction;
        this.velY += gravity;
        
        // Collision detection
        this.grounded = false;
        let boxes = level.room.boxes;
        for (var i = 0; i < boxes.length; i++) {
            var dir = colCheck(this, boxes[i]);
            if (dir === "l" || dir === "r") {
                this.velX = 0;
                this.jumping = false;
            } else if (dir === "b") {
                this.grounded = true;
                this.jumping = false;
            } else if (dir === "t") {
                this.velY *= -1;
            }
        }
        if(this.grounded){
            this.velY = 0;
        }
        this.x += this.velX;
        this.y += this.velY;
    }
}

// Game
class Game {
    constructor(levels) {
        this.levels = levels;
    }
    
    play () {
        let current = 1;
        let result;
        if (current <= this.levels.length) {
            result = this.levels[current-1].play();
            if (result) {
                current += 1;
            }
        }
        // TODO Create play again logic
        if (result) {
            setNotification("Congratulations, you have won the game!");
        } else {
            setNotification("You lose.  Better luck next time.");
        }
    }
}

// Level
class Level {
    constructor(number, rooms, players) {
        this.number = number;
        this.rooms = rooms;
        this.players = players;
        this.currentPlayer = 0;
        this.currentRoom = 0;
        // Canvas context to draw on for the level
        this.ctx = context;
    }
    
    get player () {
        return this.players[this.currentPlayer];
    }
    
    get room () {
        return this.rooms[this.currentRoom];
    }
    
    play () {
        let result;
        while (this.currentRoom < this.rooms.length) {
            result = this.room.play(this);
            if (result) {
                this.currentRoom += 1;
            }
            else if (result === false) {
                return false;
            }
        }
        return true;
        // TODO replay level logic (or do we not want to do that?)
    }
}

// Room
class Room {
    constructor() {
        // TODO override in implementations
        this.state = 0;
        this.boxes = [];
    }
    
    play (level) {
        if (this.updateState(level.player)) {
            // Update State only returns true if you have hit a lose condition
            return false;
        }
        level.player.move(level);
        if (keys[32]) {
            if (this.performAction(level.player)) {
                // Performing an action is required to beat any given room so this is the only place that victory conditions are met
                return true;
            }
        }
        this.draw(level.ctx);
        level.player.draw(level.ctx);
        //requestAnimationFrame(this.play.bind(this, level));
    }
    
    updateState (player) {
        throw new Error("Update state method not implemented for the current room");
    }
    
    draw (ctx) {
        throw new Error("Draw method not implemented for the current room");
    }
    
    performAction (player) {
        throw new Error("Perform action not implemented for the current room");
    }
    
}

class Box {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}