export default class Laser {
  /**
   * Create an instanced pointer object
   * @param {object} p - p5 runtime instance reference
   * @param {p5.Image} tex - Loaded texture element
   */
  constructor(p, tex) {
    this.p = p;
    this.tex = tex;
  }

  draw(tile_size, scale) {
    const laserAnchorX = this.p.width / 2;
    const laserAnchorY = this.p.height - tile_size;
    
    if (this.p.mouseIsPressed) {
      this.p.push();
      this.p.fill('#F00');
      this.p.stroke('#F00');
      this.p.line(laserAnchorX, laserAnchorY, this.p.mouseX, this.p.mouseY);
      this.p.circle(this.p.mouseX, this.p.mouseY, tile_size / scale);
      this.p.pop();
    }
    
    this.p.push();
    this.p.angleMode(this.p.DEGREES);
    
    let angle = this.p.atan2(this.p.mouseY - laserAnchorY, this.p.mouseX - laserAnchorX);
    
    this.p.translate(laserAnchorX, laserAnchorY);
    this.p.rotate(angle);
    this.p.rotate(90);
    
    this.p.imageMode(this.p.CENTER);
    this.p.image(this.tex, 0, 0, tile_size * 2, tile_size * 3);
    
    this.p.pop();
  }
}