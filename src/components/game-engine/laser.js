class Laser{
  tex;  

  constructor(tex){
    this.tex = tex;

  }
  


draw(){
    const laserAnchorX = width/2; 
    const laserAnchorY = height-tile_size;   
    if(mouseIsPressed){
      // draw beam from the anchor point straight to the crosshair (mouse)
      push();
      fill('#F00');
      stroke('#F00');
      line(laserAnchorX, laserAnchorY, mouseX, mouseY);
      circle(mouseX, mouseY, tile_size / scale);
      pop();
    }
    
    push();
    angleMode(DEGREES);
    
    // 1. Calculate the angle from the static anchor point toward the moving mouse
    let angle = atan2(mouseY - laserAnchorY, mouseX - laserAnchorX);
    
    // 2. Move the canvas origin to the anchor point
    translate(laserAnchorX, laserAnchorY);
    
    // 3. Rotate the canvas based on the mouse's real-time position
    rotate(angle);
    rotate(90)
    
    // 4. Draw the laser sprite tracking the rotation
    imageMode(CENTER);
    image(this.tex, 0, 0, tile_size * 2, tile_size * 3);
    
    pop();
}
}