import Camera from "./classes/Camera";
import GameMap from "./classes/GameMap";
import Sprite from "./classes/Sprite";
import Laser from "./classes/Laser";
import { parseTileFile, parseMapFile } from "./utils/helpers";

export const gameEngine = (p,reactCallbacks = {}) => {
  // Constant Definitions
  const tile_size = 16;
  let scale = 2;

  //cat audio
  let lastMeowCycle = -1; // Tracks which 20-second block we are currently in
  let meowTriggerTime = 0; // The exact second chosen randomly to play the sound
  let hasMeowedThisCycle = false; // Prevents duplicate meows in the same active window

  //background audio
  let playlist = [];
  let currentTrackIndex = 0;
  let bgMusic = null;
  let isMusicPlaying = false;

  // Runtime Scope Variables
  let outdoorCam, indoorCam, postOfficeCam;
  let outdoorMap, indoorMap, postOfficeMap;
  let mainSprite, laserPointer;
  let texSheet, sprite1Tex, laserTex,postOfficeTex;
  
  let tileMap = {};
  let postOfficeTileMap = {};
  let outdoorData, indoorData,postOfficeData;

  // Bridge reference objects to make collisions dynamic
  p._gameEngineContext = {
    tile_size,
    get scale() { return scale; },
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
    internalMap: null, internalCam: null, internalMapData: null,
    get mainSprite() { return mainSprite; }
  };

  // 1. In p5.js 2.0, setup must be 'async'
  p.setup = async () => {
    //calculate square = screen_height*0.9
    let canvasSize = p.windowHeight * 0.70;

    if (canvasSize > p.windowWidth) {
        canvasSize = p.windowWidth*0.95;
    }
    console.log(`canvasSize: ${canvasSize}`)
    console.log(`dynamic scale = ${canvasSize/200}`)
    //if results > width, square = width
    scale = Math.round(canvasSize/200);
    const cnv = p.createCanvas(canvasSize, canvasSize);
    cnv.class('centered-canvas');
    cnv.parent(p.canvas.parentElement);

    // 2. Fetch and assign files concurrently using Promise.all + await
    // This replicates the old blocking behavior of preload() before the canvas draws.
    const [
      loadedTexSheet, 
      loadedSpriteTex, 
      loadedLaserTex, 
      loadedPostOfficTex,
      atlasLines, 
      postOfficeAtlasLines,
      outdoorLines, 
      indoorLines,
      postOfficeLines
    ] = await Promise.all([
      p.loadImage('/tex/combined.png'),
      p.loadImage('/tex/cat.png'),
      p.loadImage('/tex/laser.png'),
      p.loadImage('/tex/postoffice.png'),
      p.loadStrings('/tex/atlas.txt'),
      p.loadStrings('/tex/postoffice.txt'),
      p.loadStrings('/tex/outdoor.csv'),
      p.loadStrings('/tex/indoor.csv'),
      p.loadStrings('/tex/postoffice.csv'),
    ]);

    //Assign files to scope references
    texSheet = loadedTexSheet;
    sprite1Tex = loadedSpriteTex;
    laserTex = loadedLaserTex;
    postOfficeTex = loadedPostOfficTex;

    // Pass text array responses directly to your utility parsers
    tileMap = parseTileFile(atlasLines);
    postOfficeTileMap = parseTileFile(postOfficeAtlasLines);
    outdoorData = parseMapFile(outdoorLines);
    indoorData = parseMapFile(indoorLines);
    postOfficeData = parseMapFile(postOfficeLines);

    //Instantiate constructors using newly hydrated configurations
    outdoorCam = new Camera(p, 1, 14, 14);
    indoorCam = new Camera(p, 2, 14, 14);
    postOfficeCam = new Camera(p, 2, 14, 14);

    outdoorMap = new GameMap(p, texSheet, outdoorData, tileMap);
    indoorMap = new GameMap(p, texSheet, indoorData, tileMap);
    postOfficeMap = new GameMap(p, postOfficeTex, postOfficeData, postOfficeTileMap);

    mainSprite = new Sprite(p, p.width / 2, 300, sprite1Tex, 5);
    laserPointer = new Laser(p, laserTex);

    // Hydrate Context engine
    p._gameEngineContext.outdoorCam = outdoorCam;
    p._gameEngineContext.indoorCam = indoorCam;
    p._gameEngineContext.postOfficeCam = postOfficeCam;
    p._gameEngineContext.outdoorMap = outdoorMap;
    p._gameEngineContext.indoorMap = indoorMap;
    p._gameEngineContext.postOfficeMap = postOfficeMap;
    p._gameEngineContext.outdoorData = outdoorData;
    p._gameEngineContext.indoorData = indoorData;
    p._gameEngineContext.postOfficeData = postOfficeData;
  
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
      laserPointer.draw(tile_size, scale);



      //AUDIO ONLY BELOW NOT IMPORTNAT TO GAME LOGI

      //random meow
      const totalCycleMs = 20000; // 20 seconds total cycle length
      const currentMs = p.millis();
      
      // Determine which 20-second cycle block we are currently in (0, 1, 2, etc.)
      const currentCycle = Math.floor(currentMs / totalCycleMs);
      // Find how many milliseconds have passed *inside* the current 20-second cycle (0 to 19999)
      const timeInCycle = currentMs % totalCycleMs;

      // If a new 20-second cycle has started, reset our triggers for this block
      if (currentCycle !== lastMeowCycle) {
        lastMeowCycle = currentCycle;
        hasMeowedThisCycle = false;
        // Pick a random second between 0 and 9 (the first 10 seconds of the cycle)
        meowTriggerTime = getRandomInt(0, 9) * 1000; 
      }

      // Trigger the meow if:
      // 1. We are still in the first 10 seconds of the cycle
      // 2. We haven't meowed yet during this cycle
      // 3. The cycle timer has passed our randomly selected trigger mark
      if (timeInCycle < 10000 && !hasMeowedThisCycle && timeInCycle >= meowTriggerTime) {
        const audioIndex = getRandomInt(1, 2);
        const meow = new Audio(`/audio/meow-${audioIndex}.mp3`);
        meow.volume = 0.4;
        meow.play().catch(err => console.log("Audio playback prevented:", err));
        
        hasMeowedThisCycle = true; // Lock it down so it only fires once!
      }

      //bg audio
      if (!isMusicPlaying) {
        isMusicPlaying = true;

        playlist = [
          new Audio('/audio/bg-music-1.mp3'),
          new Audio('/audio//bg-music-2.mp3')
        ];

        playlist.forEach(track => {
          track.volume = 0.12; // Extra cozy and quiet
        });

        const playCurrentTrack = () => {
          const track = playlist[currentTrackIndex];
          
          track.removeEventListener('ended', handleTrackEnded);
          track.addEventListener('ended', handleTrackEnded);
          
          track.play().catch(err => {
            console.log("Music blocked by browser layout engine:", err);
            isMusicPlaying = false; // Reset so next click retries
          });
        };

        const handleTrackEnded = () => {
          currentTrackIndex = currentTrackIndex === 0 ? 1 : 0;
          playCurrentTrack();
        };

        playCurrentTrack();
      }
    }
    
  };

  p.resetPlayer = () => {
    if (mainSprite) {
      mainSprite.x = p.width / 2;
      mainSprite.y = p.y ? p.height / 2 : 200;
    }
  }
};

function getRandomInt(min,max){
  const num = (Math.round(Math.random()*(max-min))+min);
  return num;
}