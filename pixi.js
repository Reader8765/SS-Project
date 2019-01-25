let app = new PIXI.Application();
let resources = PIXI.loader.resources;
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0xa7efff;

PIXI.loader
  .add("playerJSON", "images/sprites/playerSprite/sprite.json")
  .load(setup);

class Global {
  constructor(gameInfo, width, height) {
    this.gameInfo = gameInfo;
    var graphics = new PIXI.Graphics();
    gameInfo.map((row, y) => {
      row.map((cell, x) => {
        if (cell == "x") {
          graphics.beginFill(0xFFFF00);
          graphics.drawRect(x * 40, y * 40, 40, 40);
          app.stage.addChild(graphics);
        }
        if (cell == "o") {
          graphics.beginFill(0xFFFFFF);
          graphics.drawRect(x * 40, y * 40, 40, 40);
          app.stage.addChild(graphics);
        }
      });
    });
    app.renderer.resize(width, height);
    this.width = width;
    this.height = height;
    this.users = {};
    this.keyCheck = {};
    this.update = this.update.bind(this);
  }
  update() {
    Object.keys(this.users).map(user => {
      this.users[user].update();
    });
  }
  newUser(name, json, image, x, y, keys, collisionOffsets) {
    var sprite = new PIXI.Sprite(resources[json].textures[image]);
    var textures = resources[json].textures;
    this.users[name] = new Player(name, sprite, x, y, textures, collisionOffsets);
    this.users[name].useKeys(keys[0], keys[1], keys[2], keys[3]);
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
  moveRoom(msg) {
    switch (msg) {
      case "up":
        break;
      case "left":
        break;
      case "down":
        break;
      case "right":
        break;
    }
  }
}

class Entity {
  constructor(name, sprite, x, y, textures, collisionOffsets) {
    this.name = name;
    this.sprite = sprite;
    this.sprite.x = x;
    this.sprite.y = y;
    this.textures = textures;
    if (collisionOffsets)
      this.collisionOffsets = {
        x: collisionOffsets[0],
        y: collisionOffsets[1],
        height: collisionOffsets[2],
        width: collisionOffsets[3]
      };
    this.tick = 0;
    this.direction = "down";
    this.vector = [0, 0];
    this.moving = false;
    this.functions = [];
    app.stage.addChild(this.sprite);
  }
  checkCollision() {
    var gameMap = Game.gameInfo;
    var sprBox = { x: this.sprite.x, y: this.sprite.y, width: this.sprite.width, height: this.sprite.height };
    if (this.collisionOffsets) {
      sprBox.x += this.collisionOffsets.x;
      sprBox.y += this.collisionOffsets.y;
      sprBox.width -= this.collisionOffsets.x + this.collisionOffsets.width;
      sprBox.height -= this.collisionOffsets.y + this.collisionOffsets.height;
    }
    var playerMap = gameMap.slice(Math.floor(sprBox.y / 40), Math.floor((sprBox.y + sprBox.height) / 40) + 1);
    var collision = false;
    playerMap.map((row, i) => {
      row = row.slice(Math.floor(sprBox.x / 40), Math.floor((sprBox.x + sprBox.width) / 40) + 1);
      if (row.includes("x")) {
        collision = true;
      }
    });
    if (this.offScreen(sprBox))
      nextScreen = true;
    if (collision)
      this.calcOffset(sprBox);
  }
  offScreen(sprBox) {
    if (sprBox.x <= 0) {
      alert("left");
      this.sprite.x = 155;
    }
    if (sprBox.x + sprBox.width >= Game.width) {
      Game.moveRoom("right");
      this.sprite.x = 155;
    }
    if (sprBox.y <= 0) {
      alert("up");
      this.sprite.y = 155;
    }
    if (sprBox.y + sprBox.height >= Game.height) {
      alert("down");
      this.sprite.y = 155;
    }
  }
  calcOffset(sprBox) {
    var spr = this.sprite;
    var offset = this.collisionOffsets;
    switch (this.direction) {
      case "up":
        spr.y = Math.ceil(sprBox.y / 20) * 20 + 1 - offset.y;
        break;
      case "left":
        spr.x = Math.ceil(sprBox.x / 20) * 20 + 1 - offset.x;
        break;
      case "down":
        spr.y = Math.floor((sprBox.y + sprBox.height) / 20) * 20 - 1 - (offset.y + sprBox.height);
        break;
      case "right":
        spr.x = Math.floor((sprBox.x + sprBox.width) / 20) * 20 - 1 - (offset.x + sprBox.width);
        break;
    }
  }
}

class AI extends Entity {

}

class Player extends Entity {
  useKeys(up, left, down, right) {
    Game.keyCheck[this.name] = { up: up, left: left, down: down, right: right };
    Game.defineKeys();
  }
  move() {
    if (this.moving) {
      switch (this.direction) {
        case "up":
          this.sprite.y -= 3;
          this.sprite.texture = this.textures["up" + Math.floor(this.tick / 5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
        case "left":
          this.sprite.x -= 3;
          this.sprite.texture = this.textures["left" + Math.floor(this.tick / 5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
        case "down":
          this.sprite.y += 3;
          this.sprite.texture = this.textures["down" + Math.floor(this.tick / 5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
        case "right":
          this.sprite.x += 3;
          this.sprite.texture = this.textures["right" + Math.floor(this.tick / 5)];
          this.tick == 9 ? this.tick = 0 : this.tick++;
          break;
      }
    } else {
      this.sprite.texture = this.textures[this.direction + "Stopped"];
      this.tick = 0;
    }
  }
  update() {
    this.move();
    this.checkCollision();
  }
}

function setup() {
  const gameInfo = {
    mapSelect: {x: 2 y: 2},
    maps: {
      2: {
        2: {
          ["x", "x", "x", "x", "x", "x", "o", "o", "x", "x", "x", "x", "x", "x"],
          ["x", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
          ["x", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
          ["x", " ", " ", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
          ["x", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
          ["o", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "o"],
          ["o", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "o"],
          ["x", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
          ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", " ", " ", "x"],
          ["x", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
          ["x", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
          ["x", "x", "x", "x", "x", "x", "o", "o", "x", "x", "x", "x", "x", "x"]
        }
      }
    }
  };

  Game = new Global(mapData, 560, 480);
  Game.newUser("User1", "playerJSON", "downStopped", 250, -37, ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"], [7, 37, 1, 7]);

  app.ticker.add(() => Game.update());
}
