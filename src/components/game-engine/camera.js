class Camera{
  x;
  y;
  dx;
  dy;
  width;
  height;
  speed;

  /**
   * Create a camera
   * @param {*} speed speed of camera movement 
   */
  constructor(speed,width,height){
    this.speed = speed;
    this.x = 0;
    this.y = 0;
    this.dx = speed;
    this.dy = speed;
    this.width = width;
    this.height = height;
  }

  moveLeft(){
    this.x -= this.dx;
  }

  moveRight(){
    this.x += this.dx;
  }

  moveUp(){
    this.y -= this.dy;
  }

  moveDown(){
    this.y += this.dy;
  }

  /**
   * if mouse go off canvas move camera to follow
   * @param {*} player - player obj to track
   */
  move(player){
      const threshold = tile_size*2.5
      if(player.x < threshold || player.x > width-threshold || player.y < threshold || player.y > height-threshold){
        //adjust camera
        if(frameCount % 40 === 0){
          // calculate x y components
          if(mouseX < width/2){
            if(mouseY < width/2){
              this.moveUp();
              this.moveLeft();
            }else{
              this.moveDown()
              this.moveLeft();
            }
          }else{
            if(mouseY < width/2){
              this.moveUp();
              this.moveRight();
            }else{
              this.moveDown()
              this.moveRight();
            }
          }
      }
      }
    
      
  
  }


}