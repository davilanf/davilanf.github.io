/**
 * Pokemon HTML5 canvas game
 * @version 1.0.0
 * @author Panagiotis Vourtsis <vourtsis_pan@hotmail.com>
 */
window.onload = function() {
  'use strict';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var w = document.getElementById('canvas').offsetWidth;
  var h = document.getElementById('canvas').offsetHeight;
  var terrainImageLoaded = false,
    pokeballImageLoaded = false,
    lamentoLoaded= false,
    feliceLoaded= false,
    playerImageLoaded = false;
  var objectSizes = 20;
  var speed = 100;
  var modifier = 100;
  var score = 0;
  var oldbadx = 0;
  var oldbady = 0;
  var oldx = 0;
  var oldy = 0;

  console.log("Width is "+ w);

  //terrain image
  var terrainImage = new Image();
  terrainImage.onload = function() {
    terrainImageLoaded = true;
    assetsLoaded();
  };
  terrainImage.src = 'images/sfondo.png';

  //lamento image check se si puo mettere video
  var lamento = new Image();
  lamento.onload = function() {
   lamentoLoaded = true;
     assetsLoaded();
   };
  lamento.src = 'images/lamento.jpg';

  //felice image
  var felice = new Image();
  felice.onload = function() {
    feliceLoaded = true;
    assetsLoaded();
  };
  felice.src = 'images/felice.jpg';
  

  //main sound
  var mainTheme = new Audio('audio/main-theme.mp3');
  mainTheme.loop = true;
  mainTheme.volume = 0.5;
  mainTheme.play();

  //pokeball-selection
  var pokePick = new Audio('audio/pickup.mp3');
  pokePick.volume = 0.2;

  //badpokeball-selection
  var badpokePick = new Audio('audio/lamento.opus');
  badpokePick.volume = 1;


  //player image
  var playerImage = new Image();
  playerImage.onload = function() {
    pokeballImageLoaded = true;
    assetsLoaded();
  };
  playerImage.src = 'images/player.png';

  //pokeball image
  var pokeballImage = new Image();
  pokeballImage.onload = function() {
    playerImageLoaded = true;
    assetsLoaded();
  };
  pokeballImage.src = 'images/medicina.png';

  /**
   * It will hold all the pockeball data like x and y axis position
   * sprite position and item distance is for determine which item is selected from the sprite - @todo future use for knowing on score which one player picked
   * Also hold the generate position function that generates random positions if there is no collision.
   * @Object
   * @name pokeball
   */
  var pokeball = {
    x: 0,
    y: 0,
    spritePosition: 0,
    spriteItemDistance: 33,
  };

  var badpokeball = {
    x: 0,
    y: 0,
    spritePosition: 0,
    spriteItemDistance: 33,
  };


  pokeball.generatePosition = function() {
    do {
      pokeball.x = Math.floor(Math.random() * 20) + 1;
      pokeball.y = Math.floor(Math.random() * 16) + 4;
    } while (check_collision(pokeball.x, pokeball.y));

    do {
      badpokeball.x = Math.floor(Math.random() * 20) + 1;
      badpokeball.y = Math.floor(Math.random() * 16) + 4;
    } while (check_collision(badpokeball.x, badpokeball.y));

    pokeball.spritePosition = Math.floor(Math.random() * 4) + 0; // get position from 0-4
    badpokeball.spritePosition = Math.floor(Math.random() * 4) + 0; // get position from 0-4

  };

  /**
   * Holds all the player's info like x and y axis position, his current direction (facing).
   * I have also incuded an object to hold the sprite position of each movement so i can call them
   * I also included the move function in order to move the player - all the functionality for the movement is in there
   * @Object
   * @name pokeball
   */
  var player = {
    x: Math.round(w / 2 / objectSizes),
    y: Math.round(h / 2 / objectSizes),
    currentDirection: 'stand',
    direction: {
      stand: {
        x: 0,
        y: 0,
      },
      'down-1': {
        x: 17,
        y: 0,
      },
      'down-2': {
        x: 34,
        y: 0,
      },
      'up-1': {
        x: 125,
        y: 0,
      },
      'up-2': {
        x: 142,
        y: 0,
      },
      'left-1': {
        x: 69,
        y: 0,
      },
      'left-2': {
        x: 87,
        y: 0,
      },
      'right-1': {
        x: 160,
        y: 0,
      },
      'right-2': {
        x: 178,
        y: 0,
      },
    },
  };
  player.move = function(direction) {
    /**
     * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
     */
    var hold_player = {
      x: player.x,
      y: player.y,
    };

    /**
     * Decide here the direction of the user and do the necessary changes on the directions
     */
    switch (direction) {
      case 'left':
        player.x -= speed / modifier;
        if (player.currentDirection == 'stand') {
          player.currentDirection = 'left-1';
        } else if (player.currentDirection == 'left-1') {
          player.currentDirection = 'left-2';
        } else if (player.currentDirection == 'left-2') {
          player.currentDirection = 'left-1';
        } else {
          player.currentDirection = 'left-1';
        }
        break;
      case 'right':
        player.x += speed / modifier;
        if (player.currentDirection == 'stand') {
          player.currentDirection = 'right-1';
        } else if (player.currentDirection == 'right-1') {
          player.currentDirection = 'right-2';
        } else if (player.currentDirection == 'right-2') {
          player.currentDirection = 'right-1';
        } else {
          player.currentDirection = 'right-1';
        }
        break;
      case 'up':
        player.y -= speed / modifier;

        if (player.currentDirection == 'stand') {
          player.currentDirection = 'up-1';
        } else if (player.currentDirection == 'up-1') {
          player.currentDirection = 'up-2';
        } else if (player.currentDirection == 'up-2') {
          player.currentDirection = 'up-1';
        } else {
          player.currentDirection = 'up-1';
        }

        break;
      case 'down':
        player.y += speed / modifier;

        if (player.currentDirection == 'stand') {
          player.currentDirection = 'down-1';
        } else if (player.currentDirection == 'down-1') {
          player.currentDirection = 'down-2';
        } else if (player.currentDirection == 'down-2') {
          player.currentDirection = 'down-1';
        } else {
          player.currentDirection = 'down-1';
        }

        break;
    }

    /**
     * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
     */
    if (check_collision(player.x, player.y)) {
      player.x = hold_player.x;
      player.y = hold_player.y;
    }

    /**
     * If player finds the coordinates of pokeball the generate new one, play the sound and update the score
     */
    if (player.x == pokeball.x && player.y == pokeball.y) {
      // found a pokeball !! create a new one
      oldx = pokeball.x;
      oldy = pokeball.y;
      console.log('found a pokeball of ' + pokeball.spritePosition + '! Bravo! ');
      pokePick.pause();
      pokePick.currentTime = 0;
      pokePick.play();
      score += 1;
      pokeball.generatePosition();
    }

    if (player.x == badpokeball.x && player.y == badpokeball.y) {
      // found a badpokeball !! create a new one
      oldbadx = badpokeball.x;
      oldbady = badpokeball.y;
      console.log('found a badpokeball! Sorry! ');
      badpokePick.pause();
      badpokePick.currentTime = 0;
      badpokePick.play();
      score -= 1;
      pokeball.generatePosition();
    }

    update();
  };

  /**
   * Handle all the updates of the canvas and creates the objects
   * @function
   * @name update
   * Info su drawImage method https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
   */
  function update() {
    ctx.drawImage(terrainImage, 0, 0);

    //Genboard
    board();

    //pokeball
    ctx.drawImage(
      pokeballImage,
      pokeball.spritePosition * pokeball.spriteItemDistance,
      0,
      objectSizes,
      objectSizes,
      pokeball.x * objectSizes,
      pokeball.y * objectSizes,
      objectSizes,
      objectSizes
    );

    //badpokeball
    ctx.drawImage(
      pokeballImage,
      badpokeball.spritePosition * badpokeball.spriteItemDistance,
      0,
      objectSizes,
      objectSizes,
      badpokeball.x * objectSizes,
      badpokeball.y * objectSizes,
      objectSizes,
      objectSizes
    );

    //player
    console.log('y:', (player.y * objectSizes) / objectSizes);
    console.log('x', (player.x * objectSizes) / objectSizes);
    ctx.drawImage(
      playerImage,
      player.direction[player.currentDirection].x,
      player.direction[player.currentDirection].y,
      objectSizes - 2,
      objectSizes,
      player.x * objectSizes,
      player.y * objectSizes,
      objectSizes,
      objectSizes
    );
  }

  /**
   * Our function that decides if there is a collision on the objects or not
   * @function
   * @name check_collision
   * @param {Integer} x - The x axis
   * @param {Integer} y - The y axis
   */
  function check_collision(x, y) {
    var foundCollision = false;

    if ((x > 1 && x < 9 && y<12)) {
      //collisione mobile
      console.log('mobile');
      foundCollision = true;
    }

    if (y<10) {
      //collisione muro
      console.log('muro');
      foundCollision = true;
    }

    if (x>13) {
      //collisione bancone
      console.log('bancone');
      foundCollision = true;
    }

    if (
      x < 1 ||
      x > 20 ||
      y < 2 ||
      y > 18
    ) {
      console.log('lost on the woods');
      foundCollision = true;
    }

    return foundCollision;
  }

  /**
   * Here we are creating our board on the bottom right with our score
   * @todo maybe some mute button for the future?
   * @function
   * @name board
   */



  function board() {
            
    ctx.fillStyle = '#F4EFDC';
    ctx.fillRect(w - 195, 0, 250, 120);
    
    // Batteria
      var batteryWidth = 40;
      var batteryHeight = 60;
      var batteryColors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(w - 155, 20, 20, 10);
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(w - 170, 30, batteryWidth+10, batteryHeight+10);
      var barHeight = batteryHeight / batteryColors.length;

      if (score == -1) {
        for (var i = 0; i < 1; i++) {
            ctx.fillStyle = batteryColors[0];
            var startY = 35 + (batteryColors.length - 1 - i) * barHeight; 
            ctx.fillRect(w - 165, startY, batteryWidth, barHeight);
        }
      }

      if (score == 0) {
        for (var i = 0; i < 2; i++) {
            ctx.fillStyle = batteryColors[1];
            var startY = 35 + (batteryColors.length - 1 - i) * barHeight; 
            ctx.fillRect(w - 165, startY, batteryWidth, barHeight);
        }
      }

      if (score == 1) {
        for (var i = 0; i < 3; i++) {
            ctx.fillStyle = batteryColors[2];
            var startY = 35 + (batteryColors.length - 1 - i) * barHeight; 
            ctx.fillRect(w - 165, startY, batteryWidth, barHeight);
        }
      }

      if (score == 2) {
        for (var i = 0; i < 4; i++) {
            ctx.fillStyle = batteryColors[3];
            var startY = 35 + (batteryColors.length - 1 - i) * barHeight; 
            ctx.fillRect(w - 165, startY, batteryWidth, barHeight);
        }
      }

      if (score == 3) {
        for (var i = 0; i < 5; i++) {
            ctx.fillStyle = batteryColors[4];
            var startY = 35 + (batteryColors.length - 1 - i) * barHeight; 
            ctx.fillRect(w - 165, startY, batteryWidth, barHeight);
        }
      }
    //
      
    // Box di dialogo inferiore
      ctx.fillStyle = 'rgba(221, 204, 142)';
      ctx.fillRect(0, h - 170, w - 100, 70);
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 5;
      var x = 1;
      var y = h - 173;
      var width = w - 101;
      var height = 70;
      var radius = 10;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      ctx.stroke();
      
      
      if (score<4) {
        ctx.fillStyle = '#FBD78C';
        ctx.fillRect(0, h - 70, w, 70);
      
        if (player.x == oldbadx && player.y == oldbady) {
          ctx.drawImage(lamento, 10, h-165, 57, 57); // Adjust position and size as needed
          ctx.font = '18px Arial';
          ctx.fillStyle = '#333333';
          ctx.fillText('*** ****! Ho trovato il Mescedoz!', 80, h - 132);

          oldbadx = 0;
          oldbady = 0;
        }

        if (player.x == oldx && player.y == oldy) {
          ctx.drawImage(felice, 10, h-165, 57, 57); // Adjust position and size as needed
          ctx.font = '18px Arial';
          ctx.fillStyle = '#333333';
          ctx.fillText('Datemi la Medicina!', 80, h - 132);

          oldx = 0;
          oldy = 0;
        }
      } 

      if (score == 3){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w-195, 120);
        ctx.fillStyle = 'green';
        ctx.fillRect(10, 10, w-215, 100);

        ctx.drawImage(felice, 90, 15, 90, 90); // Cambiare immagine
        ctx.font = '25px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Babrabra!', 200, 70);
      }

      if (score == -2){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w-195, 120);
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, w-215, 100);

        ctx.drawImage(felice, 90, 15, 90, 90); // Cambiare immagine
        ctx.font = '25px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Fottuto!', 200, 70);
      }

    //
  }

  
  

  /**
   * Decide here if all the assets are ready to start updating
   * @function
   * @name assetsLoaded
   */
  function assetsLoaded() {
    if (
      terrainImageLoaded == true &&
      pokeballImageLoaded == true &&
      feliceLoaded == true &&
      playerImageLoaded == true
    ) {
      pokeball.generatePosition();
      update();
    }
  }

  /**
   * Assign of the arrow keys to call the player move
   */
  document.onkeydown = function(e) {
    e = e || window.event;

    if (e.keyCode == '37') player.move('left');
    else if (e.keyCode == '38') player.move('up');
    else if (e.keyCode == '39') player.move('right');
    else if (e.keyCode == '40') player.move('down');
  };
};