export default class Sprite {
  /**
   * Dynamic Actor Class with custom hitboxes mapping routines.
   * @param {object} p - p5 runtime instance reference
   */
  constructor(p, x, y, spriteTex, speed) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.spriteTex = spriteTex;
    this.dx = speed;
    this.dy = speed;
    this.direction = "stand";
    this.frame = 0;
  }

  moveUp(tile_size) {
    this.direction = "up";
    if (!this.checkCollision(0, -this.dy)) return;
    this.y -= this.dy;
    if (this.y < tile_size / 2) {
      this.y = tile_size / 2;
    }
  }

  moveRight() {
    this.direction = "right";
    if (!this.checkCollision(this.dx, 0)) return;
    this.x += this.dx;
  }

  moveLeft() {
    this.direction = "left";
    if (!this.checkCollision(-this.dx, 0)) return;
    this.x -= this.dx;
  }

  moveDown(tile_size) {
    this.direction = "stand";
    if (!this.checkCollision(0, this.dy)) return;
    this.y += this.dy;
    if (this.y > this.p.height - tile_size) {
      this.y = this.p.height - tile_size;
    }
  }

  stand() {
    this.direction = "stand";
  }

  checkCollision(dx, dy) {
    const context = this.p._gameEngineContext;
    const scaler = context.tile_size * context.scale;
    
    const nextTileX = Math.floor((this.x + dx) / scaler) + context.currentCam.x;
    const nextTileY = Math.floor((this.y + dy) / scaler) + context.currentCam.y;

    const hasCollision = context.currentMapData.objects.some(object => {
      return object.tileX === nextTileX && object.tileY === nextTileY;
    });

    return !hasCollision;
  }

  checkIsHitBox(hitboxes) {
    const context = this.p._gameEngineContext;
    const tile_size = context.tile_size;
    const scale = context.scale;
    const tolerance = (tile_size * scale) / 2;

    hitboxes.forEach(hitbox => {
      const worldX = hitbox.tileX * (scale * tile_size);
      const worldY = hitbox.tileY * (scale * tile_size);

      const hitboxScreenX = worldX - (context.currentCam.x * (scale * tile_size));
      const hitboxScreenY = worldY - (context.currentCam.y * (scale * tile_size));
      
      const playerScreenX = this.x;
      const playerScreenY = this.y;

      if (Math.abs(hitboxScreenX - playerScreenX) <= tolerance && 
          Math.abs(hitboxScreenY - playerScreenY) <= tolerance) {
        
        console.log(`hitbox: ${hitbox.id} - detected`);

            if (hitbox.id === "house") {
        // Trigger the React Context / Modal check!
        if (context.onTriggerAction) {
          // Pass the event target up to React
          context.onTriggerAction({ type: "ENTER_HOUSE", hitbox });
        }
        
        /* Note: Don't forcefully transition maps immediately here anymore!
          Let React check the Auth status first. If auth is true, 
          React can manually update context maps.
        */
      } 
      else if (hitbox.id === "chair") {
        if (context.onTriggerAction) {
          context.onTriggerAction({ type: "OPEN_WRITE_INTERFACE" });
        }
      }
      else if (hitbox.id === "drawer") {
        if (context.onTriggerAction) {
          context.onTriggerAction({ type: "OPEN_DRAWER_INTERFACE" });
        }
      }
      else if (hitbox.id === "postOffice") {
        if (context.onTriggerAction) {
          context.onTriggerAction({ type: "OPEN_POST_OFFICE" });
        }
      }
        else if (hitbox.id === "rug") {
          context.currentMap = context.outdoorMap;
          context.currentCam = context.outdoorCam;
          context.currentMapData = context.outdoorData;

          this.x = 6 * (scale * tile_size);
          this.y = 7 * (scale * tile_size);
          context.outdoorCam.x = 0;
          context.outdoorCam.y = 0;
        }
      }
    });
  }

  move() {
    const context = this.p._gameEngineContext;
    if (this.p.frameCount % 5 === 0) {
        const xOffset = this.p.mouseX - this.x;
        const yOffset = this.p.mouseY - this.y;
        const tolerance = 10;

        if (xOffset > tolerance) {
            this.moveRight();
        } else if (xOffset < -tolerance) {
            this.moveLeft();
        } else {
            this.stand();
        }
        
        if (yOffset > tolerance) {
            this.moveDown(context.tile_size);
        } else if (yOffset < -tolerance) {
            this.moveUp(context.tile_size);
        } else {
            this.stand();
        }
    }
    this.checkIsHitBox(context.currentMapData.hitboxes);
  }

  draw(tile_size, scale) {
    let currentTex;
    let size = tile_size * scale;
    let start = tile_size;
    let increment = tile_size * 3;
    let tileX = {};
    
    if (this.p.frameCount % 7 === 0) {
      this.frame = (this.frame + 1) % 3;
    }
    tileX = start + (increment * this.frame);

    switch (this.direction) {
      case "stand":
        currentTex = this.spriteTex.get(tileX, tile_size, tile_size, tile_size);
        break;
      case "up":
        currentTex = this.spriteTex.get(tileX, 64, tile_size, tile_size);
        break;
      case "left":
        currentTex = this.spriteTex.get(tileX, 112, tile_size, tile_size);
        break;
      case "right":
        currentTex = this.spriteTex.get(tileX, 160, tile_size, tile_size);
        break;
      default:
        currentTex = this.spriteTex.get(tileX, tile_size, tile_size, tile_size);
        break;
    }
    
    if (currentTex) {
      this.p.image(currentTex, this.x, this.y, size, size);
    }
  }
}