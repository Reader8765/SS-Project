const LEVEL1MAP = [["x"," "," "," "," "],["x"," "," "," "," "],["x"," "," "," "," "],[],[]]

let app = new PIXI.Application({ height: 400, width: 400 });
let resources;
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0xa7efff;

PIXI.loader
  .add("playerJSON","images/sprites/playerSprite/sprite.json")
  .load(setup);

class Global {
  constructor(shapes){
    this.shapes = shapes;
    shapes.map(shape=>{
      var graphics = new PIXI.Graphics();
      graphics.beginFill(0xFFFF00);
      graphics.drawRect(shape.x, shape.y, shape.width, shape.height);
      app.stage.addChild(graphics);
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
    this.direction = "down";
    this.vector = [0,0];
    this.moving = false;
    app.stage.addChild(this.sprite);
  }
  checkCollision(objects) {
    
  }
}

class AI extends Entity {
}

class Player extends Entity {
  useKeys(up, left, down, right) {
    Game.keyCheck[this.name] = {up: up, left: left, down: down, right: right};
    Game.defineKeys();
  }
  update() {
    if (this.moving) {
      switch (this.direction) {
        case "up":
          this.sprite.y -= 3;
          break;
        case "left":
          this.sprite.x -= 3;
          break;
        case "down":
          this.sprite.y += 3;
          break;
        case "right":
          this.sprite.x += 3;
          break;
      }
    }
  }
}

function setup() {
  resources = PIXI.loader.resources;
  const shapes = [
    {x:75,y:0,width:50,height:250}
  ]

  Game = new Global(shapes);
  Game.newUser("User1","playerJSON","downStopped",50,50,["ArrowUp","ArrowLeft","ArrowDown","ArrowRight"]);

  app.ticker.add(()=>Game.update());
}
