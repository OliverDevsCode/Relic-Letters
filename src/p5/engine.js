import Camera from "./classes/Camera";
import GameMap from "./classes/GameMap";
import Sprite from "./classes/Sprite";
import Laser from "./classes/Laser";
import { parseTileFile, parseMapFile } from "./utils/helpers";

export const gameEngine = (p,reactCallbacks = {}) => {
  // Constant Definitions
  const tile_size = 16;
  const scale = 2;

  // Runtime Scope Variables
  let outdoorCam, indoorCam;
  let outdoorMap, indoorMap;
  let mainSprite, laserPointer;
  let texSheet, sprite1Tex, laserTex;
  
  let tileMap = {};
  let outdoorData, indoorData;

  // Bridge reference objects to make collisions dynamic
  p._gameEngineContext = {
    tile_size, scale,
    onTriggerAction: reactCallbacks.onTriggerAction || null,
    get currentMap() { return p._gameEngineContext.internalMap; },
    set currentMap(val) { p._gameEngineContext.internalMap = val; },
    get currentCam() { return p._gameEngineContext.internalCam; },
    set currentCam(val) { p._gameEngineContext.internalCam = val; },
    get currentMapData() { return p._gameEngineContext.internalMapData; },
    set currentMapData(val) { p._gameEngineContext.internalMapData = val; },
    outdoorCam: null, indoorCam: null,
    outdoorMap: null, indoorMap: null,
    outdoorData: null, indoorData: null,
    internalMap: null, internalCam: null, internalMapData: null
  };

  // 1. In p5.js 2.0, setup must be 'async'
  p.setup = async () => {
    const cnv = p.createCanvas(400, 400);
    cnv.class('centered-canvas');

    // 2. Fetch and assign files concurrently using Promise.all + await
    // This replicates the old blocking behavior of preload() before the canvas draws.
    const [
      loadedTexSheet, 
      loadedSpriteTex, 
      loadedLaserTex, 
      atlasLines, 
      outdoorLines, 
      indoorLines
    ] = await Promise.all([
      p.loadImage('/tex/combined.png'),
      p.loadImage('/tex/cat.png'),
      p.loadImage('/tex/laser.png'),
      p.loadStrings('/tex/atlas.txt'),
      p.loadStrings('/tex/outdoor.csv'),
      p.loadStrings('/tex/indoor.csv')
    ]);

    //Assign files to scope references
    texSheet = loadedTexSheet;
    sprite1Tex = loadedSpriteTex;
    laserTex = loadedLaserTex;

    // Pass text array responses directly to your utility parsers
    parseTileFile(atlasLines, tileMap);
    outdoorData = parseMapFile(outdoorLines);
    indoorData = parseMapFile(indoorLines);

    //Instantiate constructors using newly hydrated configurations
    outdoorCam = new Camera(p, 1, 14, 14);
    indoorCam = new Camera(p, 2, 14, 14);

    outdoorMap = new GameMap(p, texSheet, outdoorData, tileMap);
    indoorMap = new GameMap(p, texSheet, indoorData, tileMap);

    mainSprite = new Sprite(p, p.width / 2, 300, sprite1Tex, 5);
    laserPointer = new Laser(p, laserTex);

    // Hydrate Context engine
    p._gameEngineContext.outdoorCam = outdoorCam;
    p._gameEngineContext.indoorCam = indoorCam;
    p._gameEngineContext.outdoorMap = outdoorMap;
    p._gameEngineContext.indoorMap = indoorMap;
    p._gameEngineContext.outdoorData = outdoorData;
    p._gameEngineContext.indoorData = indoorData;

    // Apply defaults
    p._gameEngineContext.internalMap = outdoorMap;
    p._gameEngineContext.internalCam = outdoorCam;
    p._gameEngineContext.internalMapData = outdoorData;
  };

  p.draw = () => {
    // Prevent the execution loop from crashing if async loading has not resolved
    if (!p._gameEngineContext.currentMap) {
      p.background(0);
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Loading assets...", p.width / 2, p.height / 2);
      return;
    }

    p.background(0);
    
    const ctx = p._gameEngineContext;
    ctx.currentMap.draw(ctx.currentCam, tile_size, scale);
    mainSprite.draw(tile_size, scale);

    const mouseInCanvas = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
    
    if (p.mouseIsPressed && mouseInCanvas) {
      mainSprite.move();
      ctx.currentCam.move(mainSprite, tile_size, scale);
    }
    
    laserPointer.draw(tile_size, scale);
  };
};