let app = new PIXI.Application({ height: 400, width: 400 });
let resources = PIXI.loader.resources;
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0xa7efff;

PIXI.loader
  .add("playerJSON","images/sprites/playerSprite/sprite.json")
  .load(setup);

class Global {
  constructor(gameMap){
    this.gameMap = gameMap;
    var graphics = new PIXI.Graphics();
    gameMap.map((row,y) => {
      row.map((cell,x) => {
        if (cell == "x") {
          graphics.beginFill(0xFFFF00);
          graphics.drawRect(x*40,y*40,40,40);
          app.stage.addChild(graphics);
        }
      });
    });
    this.users = {};
    this.keyCheck = {};
    this.update = this.update.bind(this);
  }
  update() {
    Object.keys(this.users).map(user => {
      this.users[user].update();
    });
  }
  newUser(name, json, image, x, y, keys) {
    var sprite = new PIXI.Sprite(resources[json].textures[image]);
    var textures = resources[json].textures;
    this.users[name] = new Player(name, sprite, x, y, textures);
    this.users[name].useKeys(keys[0],keys[1],keys[2],keys[3]);
  }
  defineKeys() {
    document.addEventListener("keydown", e => {
      Object.keys(this.keyCheck).map(user => {
        var userKeys = this.keyCheck[user];
        var userObj = this.users[user];
        if (e.key == userKeys.up) {
          userObj.direction = "up"
          userObj.moving = true;
        } else if (e.key == userKeys.left) {
          userObj.direction = "left";
          userObj.moving = true;
        } else if (e.key == userKeys.down) {
          userObj.direction = "down";
          userObj.moving = true;
        } else if (e.key == userKeys.right) {
          userObj.direction = "right";
          userObj.moving = true;
        }
      });
    });
    document.addEventListener("keyup", e => {
      Object.keys(this.keyCheck).map(user => {
        var userKeys = this.keyCheck[user];
        var userObj = this.users[user];
        if (e.key == userKeys.up && userObj.direction == "up") {
          this.users[user].moving = false;
        } else if (e.key == userKeys.left && userObj.direction == "left") {
          this.users[user].moving = false;
        } else if (e.key == userKeys.down && userObj.direction == "down") {
          this.users[user].moving = false;
        } else if (e.key == userKeys.right && userObj.direction == "right") {
          this.users[user].moving = false;
        }
      });
    });
  }
}

class Entity {
  constructor(name, sprite, x, y, textures) {
    this.name = name;
    this.sprite = sprite;
    this.sprite.x = x;
    this.sprite.y = y;
    this.textures = textures;
    this.tick = 0;
    this.direction = "down";
    this.vector = [0,0];
    this.moving = false;
    this.functions = [];
    app.stage.addChild(this.sprite);
  }
  checkCollision() {
    var gameMap = Game.gameMap;
    var spr = this.sprite;
    var playerMap = gameMap.slice(Math.floor(spr.y/40),Math.floor((spr.y+spr.height)/40)+1);
    playerMap.map((row,i)=>{
      playerMap[i] = row.slice();
    });
  }
}

class AI extends Entity {

}

class Player extends Entity {
  useKeys(up, left, down, right) {
    Game.keyCheck[this.name] = {up: up, left: left, down: down, right: right};
    Game.defineKeys();
  }
  move() {
    if (this.moving) {
      switch (this.direction) {
        case "up":
          this.sprite.y -= 3;
          this.sprite.texture = this.textures["up"+Math.floor(this.tick/5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
        case "left":
          this.sprite.x -= 3;
          this.sprite.texture = this.textures["left"+Math.floor(this.tick/5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
        case "down":
          this.sprite.y += 3;
          this.sprite.texture = this.textures["down"+Math.floor(this.tick/5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
        case "right":
          this.sprite.x += 3;
          this.sprite.texture = this.textures["right"+Math.floor(this.tick/5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
      }
    } else {
      this.sprite.texture = this.textures[this.direction+"Stopped"];
      this.tick = 0;
    }
  }
  update() {
    this.move();
    this.checkCollision();
  }
}

function setup() {
  const mapData = [
      ["x","x","x","x","x","x","x","x","x","x"],
      ["x"," "," "," "," "," ","x"," "," ","x"],
      ["x"," "," "," "," "," ","x"," "," ","x"],
      ["x"," "," ","x"," "," ","x"," "," ","x"],
      ["x"," "," ","x"," "," ","x"," "," ","x"],
      ["x"," "," ","x"," "," ","x"," "," ","x"],
      ["x"," "," ","x"," "," ","x"," "," ","x"],
      ["x"," "," ","x"," "," "," "," "," ","x"],
      ["x"," "," ","x"," "," "," "," "," ","x"],
      ["x","x","x","x","x","x","x","x","x","x"]
  ];

  Game = new Global(mapData);
  Game.newUser("User1","playerJSON","downStopped",50,50,["ArrowUp","ArrowLeft","ArrowDown","ArrowRight"]);

  app.ticker.add(()=>Game.update());
}

