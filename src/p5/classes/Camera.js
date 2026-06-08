export default class Camera {
  /**
   * Create an instanced camera
   * @param {object} p - p5 runtime instance reference
   * @param {number} speed - speed factor of movement calculations
   */
  constructor(p, speed, width, height) {
    this.p = p;
    this.speed = speed;
    this.x = 0;
    this.y = 0;
    this.dx = speed;
    this.dy = speed;
    this.width = width;
    this.height = height;
  }

  moveLeft() {
    this.x -= this.dx;
    if (this.x < 0) {
      this.x = 0;
    }
  }

  moveRight() {
    this.x += this.dx;
  }

  moveUp() {
    this.y -= this.dy;
    if (this.y < 0) {
      this.y = 0;
    }
  }

  moveDown() {
    this.y += this.dy;
  }

  /**
   * Adjust camera coordinates when the player approaches edge boundary targets.
   * @param {object} player - Instance of current engine Sprite
   * @param {number} tile_size - Native tile pixel layout context
   * @param {number} scale - Pixel scaling variable
   */
  move(player, tile_size, scale) {
    const threshold = tile_size * scale * 2.5;
    
    if (
      player.x < threshold || 
      player.x > this.p.width - threshold || 
      player.y < threshold || 
      player.y > this.p.height - threshold
    ) {
      if (this.p.frameCount % 15 === 0) {
        if (this.p.mouseX < this.p.width / 2) {
          if (this.p.mouseY < this.p.width / 2) {
            this.moveUp();
            this.moveLeft();
          } else {
            this.moveDown();
            this.moveLeft();
          }
        } else {
          if (this.p.mouseY < this.p.width / 2) {
            this.moveUp();
            this.moveRight();
          } else {
            this.moveDown();
            this.moveRight();
          }
        }
      }
    }
  }
}