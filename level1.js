
Harry = new Player("Harry", "red", 25, height-15);
Hermoine = new Player("Hermoine", "blue", 25, height-15);
Ron = new Player("Ron", "orange", 25, height-15);
lvl1players = [Harry, Hermoine, Ron];

class FluffyRoom extends Room {
    constructor () {
        super();
        this.sleeping = false;
        
        this.boxes.push(new Box(0, 0, 10, height));
        this.boxes.push(new Box(0, height-2, width, 50));
        this.boxes.push(new Box(width-10, 0, 50, height));
    }
    
    draw (ctx) {
        
        for (let i = 0; i < this.boxes.length; i++) {
            ctx.rect(this.boxes[i].x, this.boxes[i].y, this.boxes[i].width, this.boxes[i].height);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fill();
        
        // Harp
        ctx.fillStyle = 'yellow';
        ctx.fillRect(300, 178, 10, 20);
        
        // Fluffy
        let drawing = new Image();
        drawing.src = "https://az480170.vo.msecnd.net/debd7172-44dc-4681-b074-d940a93cc4e1/img/prd/830c44da-12ed-4c0f-9d52-121790429471/l_fluffy01_cap_hpe.png";
        ctx.drawImage(drawing, 390, 150, 40, 50);
        
        // Trapdoor
        ctx.fillStyle = 'rgb(181,101,29)';
        ctx.fillRect(455, 197, 20, 3);
    
    }
    
    updateState(player) {
        if (player.x > 455 && player.x < 475) {
            this.state = 1;
            setAction('Open trapdoor and enter');
        } else if (this.state === 1) {
            this.state = 0;
            clearAction();
        }
        
        if (player.x > 295 && player.x < 315) {
            this.state = 2;
            setAction('Play the harp');
        } else if (this.state === 2) {
            this.state = 0;
            clearAction();
        }
        
        if (!this.sleeping && player.x > 390) {
            setNotification("You ran straight at a massive 3 headed dog named Fluffy and it ate you.  What else would you expect? You lose");
            return true;
        }
    }
    
    performAction(player) {
        if (state === 1) {
            setNotification('You fell through the trap door but landed softly in some plant.  Watch out though, it is wrapping itself around you!');
            return true;
        }
        if (state === 2) {
            setNotification('You played the harp and Fluffy fell asleep.  You can now pass safely');
            this.sleeping = true;
        }
    }
}

class SnareRoom extends Room {

}

class KeysRoom extends Room {

}

class ChessRoom extends Room {

}

class MirrorRoom extends Room {

}

lvl1rooms = [new FluffyRoom(), new SnareRoom(), new KeysRoom(), new ChessRoom(), new MirrorRoom()];

class Level1 extends Level {
    constructor () {
        super(1, lvl1rooms, lvl1players);
    }
    
    changeCharacter () {
        if (!(this.currentRoom instanceof MirrorRoom)) {
            Player.changeCharacter(this.players, this.currentPlayer);
        }
    }
}
game = new Game([new Level1()]);
//game.play();