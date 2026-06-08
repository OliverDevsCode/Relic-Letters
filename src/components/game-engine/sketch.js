//Global objects
let outdoorCam;
let indoorCam;
let outdoorMap;
let indoorMap;
let mainSprite;
let laserPointer;
//Global variables
const tile_size = 16;
const scale = 2;

//Map variables
let texSheet;
let tileMap = {};
let outdoorData;
let indoorData;

let cnv; //canvas

//Sprite Texs;
let sprite1Tex;
let laserTex;

//switching variables
let currentMap;
let currentCam;
let currentHitboxes


function preload(){
  texSheet = loadImage('./tex/combined.png');
  sprite1Tex = loadImage('./tex/cat.png')
  laserTex = loadImage('./tex/laser.png');
  loadStrings('./tex/atlas.txt', parseTileFile)
  loadStrings('./tex/outdoor.csv', (lines) => { outdoorData = parseMapFile(lines); });
  loadStrings('./tex/indoor.csv', (lines) => { indoorData = parseMapFile(lines); });
}

function setup() {
  cnv = createCanvas(400, 400);
  cnv.class('centered-canvas');
  outdoorCam = new Camera(2,14,14);
  indoorCam = new Camera(2,14,14);
  console.log("Tile map",tileMap)
  console.log("outdoorData",outdoorData)
  console.log("indoorData",indoorData)
  outdoorMap = new GameMap(texSheet,outdoorData,tileMap);
  indoorMap = new GameMap(texSheet,indoorData,tileMap);
  mainSprite = new Sprite(50,50,sprite1Tex,5);
  laserPointer = new Laser(laserTex);

  //default
  currentMap = outdoorMap;
  currentCam = outdoorCam;
  currentHitboxes = outdoorData.hitboxes
}

function draw() {
  background(0);
  currentMap.draw(currentCam);
  mainSprite.draw(currentCam);

  if(mouseIsPressed){
    mainSprite.move();
    currentCam.move(mainSprite);
  }
  
  laserPointer.draw();

}






