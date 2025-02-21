var servidor = new Phaser.Scene("Servidor");

var player;
var player1;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

servidor.preload = function() {
  this.load.image("sky", "photos/sky.png");
  this.load.image("ground", "photos/platform.png");
  this.load.image("star", "photos/star.png");
  this.load.image("bomb", "photos/bomb.png");
  this.load.image("cadeado", "photos/cadeado.png");
  this.load.image("abertura", "photos/abertura.png");
  this.load.spritesheet("dude", "photos/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet("jose", "photos/jose.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

servidor.create = function () {
  //  A simple background for our game
  this.add.image(400, 300, "sky");

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(900, 568, "ground").setScale(3).refreshBody();

  //  Now let's create some ledges
  platforms.create(550, 400, "ground");
  platforms.create(150, 260, "ground");
  platforms.create(600, 350, "ground");

  // The player and its settings
  player = this.physics.add.sprite(100, 450, "dude");

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // The player and its settings
  player1 = this.physics.add.sprite(100, 450, "jose");

  //  Player physics properties. Give the little guy a slight bounce.
  player1.setBounce(0.2);
  player1.setCollideWorldBounds(true);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    keys: "left",
    frames: this.anims.generateFrameNumbers("jose", { start: 0, end: 4 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    keys: "turn",
    frames: [{ key: "jose", frame: 5 }],
    frameRate: 20,
  });

  this.anims.create({
    keys: "right",
    frames: this.anims.generateFrameNumbers("jose", {
      start: 6,
      end: 10,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  bombs = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player1, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.physics.add.overlap(player1, stars, collectStar, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);

  this.physics.add.collider(player1, bombs, hitBomb, null, this);
}

 servidor.update = function () {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  function update() {
    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player1.setVelocityX(-160);

      player1.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player1.setVelocityX(160);

      player1.anims.play("right", true);
    } else {
      player1.setVelocityX(0);

      player1.anims.play("turn");
    }

    if (cursors.up.isDown && player1.body.touching.down) {
      player1.setVelocityY(-330);
    }
  }

  function collectStar(player1, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var x =
        player1.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;

  function hitBomb(player1, bomb) {
    this.physics.pause();

    player1.setTint(0xff0000);

    player1.anims.play("turn");

    gameOver = true;
  }
}

export { servidor };
