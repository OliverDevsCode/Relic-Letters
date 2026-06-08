class Sprite {
  x;
  y;
  dx;
  dy;
  spriteTex;
  direction;
  frame;

  /**
   * 
   * @param {*} x - screen x (pixels)
   * @param {*} y - screen y (pixels)
   * @param {*} spriteTex - texture
   * @param {*} speed - pixels per frame
   */
  constructor(x,y,spriteTex,speed){
    this.x = x;
    this.y = y;
    this.spriteTex =spriteTex;
    this.dx = speed;
    this.dy = speed;
    this.direction = "stand";
    this.frame = 0;
  }

  moveUp(){
    this.direction ="up";
    this.y -= this.dy
    if(this.y < tile_size/2){
      this.y = tile_size/2
    }
  }
  moveRight(){
    this.direction ="right";
    this.x += this.dx
  }
  moveLeft(){
    this.direction ="left";
    this.x -= this.dx
  }
  moveDown(){
    this.direction ="stand";
    this.y += this.dy
    if(this.y > height - tile_size){
      this.y = height - tile_size
    }
  }

  stand(){
    this.direction = "stand"
  }

  checkCollision(){
    //get tileX
    //get tileY
    const playerTileX = Math.floor((this.x)/(tile_size * scale));
    const playerTileY = Math.floor((this.y)/(tile_size * scale));
  }

  checkIsHitBox(hitboxes) {
  // Scale the tolerance so it matches the actual visual size of the tiles on screen
  const tolerance = (tile_size * scale) / 2;

  hitboxes.forEach(hitbox => {
    const worldX = hitbox.tileX * (scale * tile_size);
    const worldY = hitbox.tileY * (scale * tile_size);

    const hitboxScreenX = worldX - (currentCam.x * (scale * tile_size));
    const hitboxScreenY = worldY - (currentCam.y * (scale * tile_size));
    console.log(`hitboxScreenY: ${hitboxScreenY} || hitboxy: ${worldY}`)
    
    const playerScreenX = this.x
    const playerScreenY = this.y 

    if (Math.abs(hitboxScreenX - playerScreenX) <= tolerance && 
        Math.abs(hitboxScreenY - playerScreenY) <= tolerance) {
      
      console.log(`hitbox: ${hitbox.id} - detected`);

      if (hitbox.id === "house") {
        currentMap = indoorMap;
        currentCam = indoorCam;
        currentHitboxes = indoorData.hitboxes
        
        this.x = 6 * (scale * tile_size); 
        this.y = 9 * (scale * tile_size);
      } 
      else if (hitbox.id === "rug") {
        currentMap = outdoorMap;
        currentCam = outdoorCam;
        currentHitboxes = outdoorData.hitboxes

        this.x = 6 * (scale * tile_size);
        this.y = 7 * (scale * tile_size);
        currentCam.x = 0;
        currentCam.y = 0;
      }
      else if(hitbox.id === "chair"){
        console.log("open write component")
      }
    }
  });
}

  /**
   * Follow mouse X,Y
   */
  move(){
    // stagger movement
    if(frameCount % 5 === 0){
        // calculate x y components
        const xOffset = mouseX - this.x;
        const yOffset = mouseY - this.y;
        
        const tolerance = 10; 

        // X-axis movement or standing
        if(xOffset > tolerance){
            this.moveRight();
        } else if(xOffset < -tolerance){
            this.moveLeft();
        } else {
            this.stand(); 
        }
        
        // Y-axis movement or standing
        if(yOffset > tolerance){
            this.moveDown();
        } else if(yOffset < -tolerance){
            this.moveUp();
        } else {
            this.stand(); 
        }
    }
    this.checkIsHitBox(currentHitboxes);
}

  draw(){
    let currentTex;
    let size = tile_size*scale
    let start = tile_size;
    let increment = tile_size * 3;
    let tileX = tileMap;
    switch (this.direction) {
      case "stand":
        if (frameCount % 7 === 0) {
          this.frame = (this.frame + 1) % 3; 
        }
        tileX = start + (increment*this.frame);
        currentTex = this.spriteTex.get(tileX, tile_size, tile_size, tile_size)
        
        break;
      case "up":
        if (frameCount % 7 === 0) {
          this.frame = (this.frame + 1) % 3; 
        }
        tileX = start + (increment*this.frame);
        currentTex = this.spriteTex.get(tileX, 64, tile_size, tile_size)
        
        break;
      case "left":

        if (frameCount % 7 === 0) {
          this.frame = (this.frame + 1) % 3; 
        }
        tileX = start + (increment*this.frame);
        currentTex = this.spriteTex.get(tileX, 112, tile_size, tile_size)
        
        break;
      case "right":

        if (frameCount % 7 === 0) {
          this.frame = (this.frame + 1) % 3; 
        }
        tileX = start + (increment*this.frame);
        currentTex = this.spriteTex.get(tileX, 160, tile_size, tile_size)
        
        break;    
      default:
        if (frameCount % 7 === 0) {
          this.frame = (this.frame + 1) % 3; 
        }
        tileX = start + (increment*this.frame);
        currentTex = this.spriteTex.get(tileX, tile_size, tile_size, tile_size)
        
        break;
    }
    if (currentTex) {
    image(currentTex, this.x, this.y, size, size);
  }
  }

}