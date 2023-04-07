const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

let level = 1;

let levels = {
  1: {
    init: () => {}
  }
}

canvas.width = 800;
canvas.height = 800;

const collusionMap = [];
for (let i = 0; i < collusion.length; i+= 180) {
  collusionMap.push(collusion.slice(i, 180 + i));
}

class Boundary {
  static width = 24;
  static height = 24;
  constructor({ position }) {
    this.position = position;
    this.width = 24;
    this.height = 24;
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

const boundaries = [];
const offset = {
  x: -3650,
  y: -2900,
}

collusionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 19478) 
    boundaries.push(new Boundary({
      position: {
        x: j* Boundary.width + offset.x,
        y: i * Boundary.height + offset.y,
      }
    }))
  })
})

const imageBackground = new Image();
imageBackground.src = './img/bg_level_1.png';

const image = new Image();
image.src = './CATOCLISM_level_1.png';


const playerUpImage = new Image();
playerUpImage.src = './img/cat_up.png';

const playerDownImage = new Image();
playerDownImage.src = './img/cat_down.png';

const playerRightImage = new Image();
playerRightImage.src = './img/cat_right.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/cat_left.png';


const foregroundImage = new Image();
foregroundImage.src = './foreground_level_1.png'

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, scale = { max: 1}, sprites}) {
    this.position = position;
    this.image = image;
    this.frames = {...frames, val: 0, elapsed: 0};
    this.scale = scale;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max / 4;
      this.heigth = this.image.height / 3;
    }
    this.moving = false;
    this.sprites = sprites;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frames.val * 261,
      0,
      this.image.width / this.frames.max,
      this.image.height, 
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max / this.scale.max,
      this.image.height / this.scale.max,
    );

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % 15 === 0) {
    if (this.frames.val < this.frames.max - 1) {
    this.frames.val++
    } else {
      this.frames.val = 0;
    }
  }
  }
}

const player = new Sprite({
  position: {
    x: (canvas.width / 2) - ((1044 / 4) / 3) / 2, 
    y: (canvas.height / 2) - (344 / 3) / 2,
  },
  image: playerDownImage,
  frames:{
    max: 4,
  },
  scale: {
    max: 3,
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage
  }
})

const backgroungLevelOne = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: imageBackground,
}) 

const backgroung = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
 })

 const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
 })

const keys = {
  w: {
    pressed: false
  },
  d: {
    pressed: false
  },
  s: {
    pressed: false
  },
  a: {
    pressed: false
  },
}

const movable = [backgroung, ...boundaries, foreground];

function rectCollusion({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x && 
    rect1.position.x <= rect2.position.x + (rect2.width - 20) &&
    rect1.position.y + rect1.heigth >= rect2.position.y &&
    rect1.position.y <= rect2.position.y + (rect2.height - 80)
  )
}

function animate() {
  window.requestAnimationFrame(animate);
  backgroungLevelOne.draw();
  backgroung.draw();
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  player.draw();
  foreground.draw();




let moving = true;
  player.moving = false;
  if (keys.w.pressed && lastKey === 'w') {
    player.scale.max = 2.5;
    player.image = player.sprites.up;
    player.moving = true
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectCollusion({
        rect1: player,
        rect2: {
          ...boundary, 
          position: {
          x: boundary.position.x,
          y: boundary.position.y + 3,
        }
      }
    })
    ) {
        console.log('coliding');
        moving = false;
        break;
      }
      
    }
    if(moving) {
    movable.forEach(move => {
      move.position.y +=3
    })
  }

  
  } else if (keys.s.pressed && lastKey === 's') {
    player.scale.max = 3;
    player.image = player.sprites.down;
    player.moving = true
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectCollusion({
        rect1: player,
        rect2: {
          ...boundary, 
          position: {
          x: boundary.position.x + 3,
          y: boundary.position.y,
        }
      }
    })
    ) {
        console.log('coliding');
        moving = false;
        break;
      }
      
    }
    if(moving) {
    movable.forEach(move => {
      move.position.y -=3  
    })
  }
  } else if (keys.d.pressed && lastKey === 'd') {
    player.scale.max = 3;
    player.image = player.sprites.right;
    player.moving = true
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectCollusion({
        rect1: player,
        rect2: {
          ...boundary, 
          position: {
          x: boundary.position.x - 3,
          y: boundary.position.y,
        }
      }
    })
    ) {
        console.log('coliding');
        moving = false;
        break;
      }
      
    }
    if(moving) {
    movable.forEach(move => {
      move.position.x -=3
    })
  }
  } else if (keys.a.pressed && lastKey === 'a') {
    player.scale.max = 3;
    player.image = player.sprites.left;
    player.moving = true
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectCollusion({
        rect1: player,
        rect2: {
          ...boundary, 
          position: {
          x: boundary.position.x + 3,
          y: boundary.position.y,
        }
      }
    })
    ) {
        console.log('coliding');
        moving = false;
        break;
      }
      
    }
    if(moving) {
    movable.forEach(move => {
      move.position.x +=3
    })
  }
  }
}

animate();
let lastKey = '';
window.addEventListener('keydown', (evt) => {
  switch (evt.key) {
    case 'w': 
    keys.w.pressed = true;
    lastKey = 'w';
    break;
    case 'd': 
    keys.d.pressed = true;
    lastKey = 'd';
    break;
    case 's': 
    lastKey = 's';
    keys.s.pressed = true;
    break;
    case 'a': 
    keys.a.pressed = true;
    lastKey = 'a';
    break;
  }
})

window.addEventListener('keyup', (evt) => {
  switch (evt.key) {
    case 'w': 
    keys.w.pressed = false;
    break;
    case 'd': 
    keys.d.pressed = false;
    break;
    case 's': 
    keys.s.pressed = false;
    break;
    case 'a': 
    keys.a.pressed = false;
    break;
  }
})

