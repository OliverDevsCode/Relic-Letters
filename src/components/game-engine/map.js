class GameMap{
  mapTex;
  grid;
  objects;
  atlas;
  tileCache;

  /**
   * Create a map
   * @param {*} mapTex - texture/spritesheet
   * @param {*} mapData - parsed CSV in a 2d array
   */
  constructor(mapTex,mapData,atlas){
    this.mapTex = mapTex;
    this.atlas = atlas;
    this.grid = mapData ? mapData.terrain : [];
    this.objects = mapData ? mapData.objects : [];
    this.tileCache = {};
  }

  /**
   * Grabs a tile graphic via atlas ID. Caches it after the first lookup.
   * @param {number|string} id 
   * @returns {p5.Image|null}
   */
  getTile(id) {
    // Return cached image if we've already chopped it from the sheet before
    if (this.tileCache[id]) {
      return this.tileCache[id];
    }

    // Find asset details in atlas (using '==' to handle string vs number IDs seamlessly)
    const tileData = Object.values(this.atlas).find(element => element.id == id);
    
    if (!tileData) {
      console.warn(`Tile ID ${id} not found in atlas.`);
      return null; 
    }
    
    // Crop the image from spritesheet and cache it
    const croppedImg = this.mapTex.get(tileData.x, tileData.y, tileData.w, tileData.h);
    this.tileCache[id] = croppedImg;
    
    return croppedImg;
  }

/**
   * Main Render method
   * @param {object} camera - Position of camera in tile units {x, y}
   * @param {number} viewWidth - Viewport width in tiles
   * @param {number} viewHeight - Viewport height in tiles
   */
  draw(camera) {
    noSmooth();
    // global variables or class defaults
    const size = tile_size * scale; 
    const viewWidth = camera.width;   // or camera.w
    const viewHeight = camera.height; // or camera.h

    for (let screenY = 0; screenY < viewHeight; screenY++) {
      const mapY = camera.y + screenY; 
      
      if (mapY < 0 || mapY >= this.grid.length) continue;
      const row = this.grid[mapY];

      for (let screenX = 0; screenX < viewWidth; screenX++) {
        const mapX = camera.x + screenX;
        if (mapX < 0 || mapX >= row.length) continue;

        const id = row[mapX];
        const tileImage = this.getTile(id);

        if (tileImage) {
          const drawX = screenX * size;
          const drawY = screenY * size;
          image(tileImage, drawX, drawY, size, size);
        }
      }
    }

    for (let obj of this.objects) {
      const screenX = obj.tileX - camera.x;
      const screenY = obj.tileY - camera.y;

      if (screenX >= 0 && screenX < viewWidth && screenY >= 0 && screenY < viewHeight) {
        const tileImage = this.getTile(obj.id);
        const tileData = Object.values(this.atlas).find(e => e.id == obj.id);

        if (tileImage && tileData) {
          const drawX = screenX * size;
          
          const heightRatio = tileData.h / 16; 
          const drawY = (screenY * size) - ((heightRatio - 1) * size);
          
          const finalWidth = (tileData.w / 16) * size;
          const finalHeight = heightRatio * size;

          image(tileImage, drawX, drawY, finalWidth, finalHeight);
        }
      }
    }
  }
}