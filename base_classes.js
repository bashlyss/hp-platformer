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
        current = (current + 1) % players.length;
        setPlayer(players[current]);
    }
}
    
    draw (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    move (level) {
        if (keys[17]) {  
            // Control key
            Player.changeCharacter(level.players, level.currentPlayer);
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
        while (current <= this.levels.length) {
            result = this.levels[current-1].play();
            if (result) {
                current += 1;
            }
            else {
                break;
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
    }
    
    get player () {
        return this.players[this.currentPlayer];
    }
    
    play () {
        let current = 0;
        let result;
        while (current < this.rooms.length) {
            result = this.rooms[current].play(this);
            if (result) {
                current += 1;
            }
            else {
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
    }
    
    play (level) {
        this.updateState(level.player);
        player.move(level));
        this.draw(ctx);
    }
    
    updateState () {
        throw new Error("Update state method not implemented for the current room");
    }
    
    draw (ctx) {
        throw new Error("Draw method not implemented for the current room");
    }
    
}