var MyGame = function () {
    this.isRun = false;
    //地板
    this.atlasKey = [{
        id: 0,
        key: 'yun',
        velocity: 1200,
        score: 1
    }];
    this.atlasMap = [];
    for (var i = 0; i < 100; i++) {
        this.atlasMap.push(this.atlasKey[0]);
    };
};
var timer; //时间
var _score = 0; //分数
MyGame.prototype = {
    setScale: function (val) {
        val = val * gameScale * 2;
        return val;
    },
    create: function () {
        this.atlasIndex = 0;
        this.atlasMap = this.atlasMap.sort(ranArr);
        this.stage.backgroundColor = '#edffd9';
        //开启物理引擎
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //适应屏幕
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.setGameSize(gameWidth * 2, gameHeight * 2);
        this.scale.setMinMax(320, 480, 750, 1366);
        this.scale.onSizeChange.add(function () {
            console.log('变化');
        }, this)
        //失去焦点是否继续游戏
        this.stage.disableVisibilityChange = true;
        //开启鼠标事件
        this.input.mouse.capture = true;
        this.iniGame();
        this.isRun = true;
    },
    iniGame: function () {
        this.world.setBounds(0, 0, gameWidth * 2, (gameHeight + 99999) * 2);
        this.camera.y = this.world.height;
        //地板
        this.atlas = this.add.group();

        //批量生成30个地板，状态是死的
        this.atlas.createMultiple(30, 'atlas', 0, false);
        this.atlasY = this.world.height - this.setScale(50);
        for (var i = 0; i < 5; i++) {
            this.setAtlas(this.setScale(0 + 150 * i), this.atlasY, 'atlas', 'yun', 0);
        };
        this.addAtlas(25);


        this.mouseSprite = this.add.sprite(0, 0);
        this.mouseSprite.visible = false;
        this.physics.arcade.enable(this.mouseSprite);

        //主角
        this.play = this.add.sprite(this.atlas.getChildAt(2).x, this.atlas.getChildAt(2).y, "atlas");
        this.play.animations.add('go', Phaser.Animation.generateFrameNames('but', 1, 2, '', 0), 1, false);
        this.play.play('go');
        this.play.isRun = true;
        //超出世界死
        this.play.outOfCameraBoundsKill = true;
        this.play.autoCull = true;
        this.play.events.onKilled.add(function (sprite) {
            console.log('死了')
            this.gameEnd();
        }, this);
        this.physics.arcade.enable(this.play);
        //设置重力
        this.play.body.gravity.y = this.setScale(4000);
        this.play.anchor.set(0.5);
        this.play.y -= (this.play.height / 2 + 100) * gameScale;
        this.play.scale.set(gameScale + this.setScale(0.4));


        //时间
        timer = game.time.create(true);
        timer.loop(1000, this.dataTime, this);
        timer.start();

    },
    dataTime: function () {
        dataTimeNum = dataTimeNum - 1;
        $(".countdown").html(dataTimeNum);
        if (dataTimeNum <= 0) {
            // document.getElementById("sound").pause();
            this.gameEnd();
        }
    },
    setAtlas: function (x, y, key, frame, type, falg) {
        var atlas = this.atlas.getFirstDead(true, x, y, key, frame);
        // atlas.anchor.set(0.5);
        // atlas.scale.set(gameScale + this.setScale(0.8));
        atlas.types = type;
        atlas.spring = this.atlasKey[type].velocity
        this.physics.arcade.enable(atlas);
        atlas.body.collideWorldBounds = false;
        atlas.body.velocity.x = l(0, 1) == 0 ? 300 : -300;
        atlas.body.moves = false;
        atlas.sprite = '';
        //是否能得分
        if (falg) {
            atlas.score = true;
        }
    },
    addAtlas: function (num) {
        for (var i = 0; i < num; i++) {
            this.atlasY -= this.setScale(l(150, 250));
            var x = this.world.randomX;
            this.setAtlas(x, this.atlasY, 'atlas', this.atlasMap[this.atlasIndex].key, this.atlasMap[this.atlasIndex].id, true);
            this.atlasIndex++;
            this.setIndex();
        };
    },
    setIndex: function () {
        if (this.atlasIndex === 100) {
            this.atlasIndex = 0;
            this.atlasMap = this.atlasMap.sort(ranArr);
        };
    },
    gameEnd: function () {
        music[0].stop();
        music[1].stop();
        music[2].play();
        this.play.destroy();
        $('.music').addClass('disabled');
        timer.stop();


        this.over = this.add.group();
        this.over.fixedToCamera = true;
        this.overbg = this.add.graphics(0, 0);
        this.overbg.beginFill(0x000000, 0.7);
        this.overbg.drawRect(0, 0, gameWidth * 2, gameHeight * 2);
        this.overbg.endFill();
        this.overBackground = this.over.create(0, 0, this.overbg.generateTexture());
        this.overbg.destroy();

        this.overTitle = this.add.text(this.world.centerX, this.setScale(300), '本次得分', {
            font: this.setScale(50) + "px myFont",
            fill: '#fff'
        });
        this.overTitle.anchor.set(0.5);

        this.overScore = this.add.text(this.world.centerX, this.setScale(500), $('.score').html(), {
            font: this.setScale(80) + "px myFont",
            fill: '#d9cc43'
        });
        this.overScore.anchor.set(0.5);
        this.overBtn = this.add.text(this.world.centerX, this.setScale(1000), '重 新 游 戏', {
            font: this.setScale(36) + "px myFont",
            fill: '#d9cc43',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        this.overBtn.anchor.set(0.5);
        this.overBtn.inputEnabled = true
        this.overBtn.events.onInputDown.add(function () {
            music[0].play();
            $('.music').removeClass('disabled');
            game.state.start('Game');
            _score = 0;
            $('.score').html(_score);
           dataTimeNum = index_.$data.gameTime;
           $(".countdown").html(index_.$data.gameTime);
        }, this);

        this.over.addMultiple([this.overTitle, this.overScore, this.overBtn]);
    },
    update: function () {
        if (this.isRun) {
            this.physics.arcade.overlap([this.atlas, this.spring], this.play, function (play, atlas) {
                if (play.body.touching.down) {
                    if (this.camera.y == 0) {
                        this.gameEnd();
                    };
                    if (atlas.score) {
                        _score += parseInt(this.atlasKey[atlas.types].score);
                        $('.score').html(_score)
                    };
                    atlas.score = false;

                    if (!$('.music').hasClass('disabled')) {
                        music[1].play();
                    }
                    //移动镜头
                    play.body.velocity.y = this.setScale(-atlas.spring);
                    var cameraY = atlas.y - this.setScale(atlas.spring / 2);
                    if (cameraY < this.camera.y) {
                        //杀死超出镜头底部的地板
                        this.atlas.forEachAlive(function (sprite) {
                            if (sprite.y > this.camera.y + gameHeight * 2) {
                                sprite.kill();
                                if (typeof (sprite.sprite) == 'object') {
                                    sprite.sprite.destroy();
                                };
                            };
                        }, this);
                        //生成新的地板
                        if (this.atlas.countLiving() < 20) {
                            this.addAtlas(25);
                        };
                        //镜头动画
                        this.add.tween(this.camera).to({
                            y: cameraY
                        }, 300, "Linear", true);
                    };
                };
            }, null, this);

            if (this.play.isRun) {
                this.physics.arcade.moveToPointer(this.mouseSprite, 100, this.input.activePointer, 200);
                this.play.x = this.mouseSprite.x;
            };

        };
    },
    addBtn: function (group, x, y, scale, img, texts, color, stroke, fontSize) {
        var typa = typa || null;
        var typb = typb || null;
        this.Btn = game.add.sprite(x, y, 'atlas', img);
        this.Btn.scale.set(scale);
        this.BtnText = game.add.text(0, 0, texts, {
            font: fontSize + "px myFont",
            fill: color,
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        this.BtnText.setTextBounds(x, y, this.Btn.width, this.Btn.height);
        this.BtnText.stroke = stroke;
        this.BtnText.strokeThickness = 8;
        this.Btn.inputEnabled = true;
        group.addMultiple([this.Btn, this.BtnText]);
        return this
    }

};
