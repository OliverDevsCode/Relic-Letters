export default class GameMap {
  /**
   * Create an instanced game coordinate grid
   * @param {object} p - p5 runtime instance reference
   */
  constructor(p, mapTex, mapData, atlas) {
    this.p = p;
    this.mapTex = mapTex;
    this.atlas = atlas;
    this.grid = mapData ? mapData.terrain : [];
    this.objects = mapData ? mapData.objects : [];
    this.tileCache = {};
  }

  getTile(id) {
    if (this.tileCache[id]) {
      return this.tileCache[id];
    }

    const tileData = Object.values(this.atlas).find(element => element.id == id);
    
    if (!tileData) {
      console.warn(`Tile ID ${id} not found in atlas.`);
      return null;
    }
    
    const croppedImg = this.mapTex.get(tileData.x, tileData.y, tileData.w, tileData.h);
    this.tileCache[id] = croppedImg;
    
    return croppedImg;
  }

  draw(camera, tile_size, scale) {
    this.p.noSmooth();
    const size = tile_size * scale;
    const viewWidth = camera.width;
    const viewHeight = camera.height;

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
          this.p.image(tileImage, drawX, drawY, size, size);
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

          this.p.image(tileImage, drawX, drawY, finalWidth, finalHeight);
        }
      }
    }
  }
}