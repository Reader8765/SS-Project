const LEVEL1MAP = [["x"," "," "," "," "],["x"," "," "," "," "],["x"," "," "," "," "],[],[]]

let app = new PIXI.Application({ height: 550, width: 650 });
let resources = PIXI.loader.resources;

//BOX definitions
var boxes = { options: ["cellWidth", "cellHeight", "backgroundImage"] };
var level = { selectedMaps: [], position: [0, 0], container: new PIXI.Container(), height: 350 };

function newBox(name, map, opts) {
  boxes[name] = {};
  boxes[name].map = map;
  if (opts)
    for (opt of boxes.options)
      boxAssign(name, opt, opts);
}

function boxAssign(name, opt, opts) {
  if (opts[opt]) {
    boxes[name][opt] = opts[opt];
  }
}

function selectBox(name) {
  if (boxes[name])
    level.selectedMaps.push(name);
  else
    throw "ERR: " + name + " is not a box";
  if (boxes[name].backgroundImage)
    level.container.addChild(new PIXI.Sprite(boxes[name].backgroundImage));
  boxes[name].map.map((row, y) => {
    row.map((val, x) => {
      if (val == "x") {
        var graphics = new PIXI.Graphics();

        graphics.beginFill(0xFFFF00);

        graphics.drawRect(x * 20, y * 20, 20, 20);

        app.stage.addChild(graphics);
      }
    });
  });
}

function removeBox() {

}

function detect(x, y, width, height) {

}

app.stage.addChild(level.container);

const BOX = { newBox, selectBox, removeBox, detect };
//end

document.body.appendChild(app.view);
app.renderer.backgroundColor = 0xa7efff;

console.log("\n")

PIXI.loader
  .add("images/character.json")
  .add("images/level1.png")
  .load(setup);


let charTextures, player;

function setup() {
  BOX.newBox("level1", LEVEL1MAP);
  BOX.selectBox("level1");

  charTextures = resources["images/character.json"].textures;

  player = new PIXI.Sprite(
    charTextures["charStopped"]
  );

  player.move = {
    direction: "down",
    moving: false,
    move: () => {
      if (typeof this.tick == "undefined") {
        this.tick = 0;
      }
      if (this.moving) {
        switch (this.direction) {
          case "down":
            player.x -= 5;
        }
      } else {
        tick = 0;
      }
    }
  }

  player.height = 85;
  player.width = 35;

  app.stage.addChild(player);
  app.ticker.add(delta => gameLoop(delta));
}

function activateKeys() {
  document.addEventListener("keydown", e => {
    if (e.key.slice(0, 5) == "Arrow") {
      player.move.direction = e.key.slice(5).toLowerCase();
      player.move.moving = true;
    }
  });

  document.addEventListener("keyup", e => {
    if (e.key.slice(5).toLowerCase() == player.move.direction) {
      player.move.moving = false;
    }
  });
}

activateKeys();

async function gameLoop() {
    player.move.move();
    updateStatus(detect());
}

async function updateStatus(status) {

}
