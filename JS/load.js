var game = new Phaser.Game(750, 1334, Phaser.CANVAS, "game", null, true);
var dataTimeNum = index_.$data.gameTime;
// game.time = dataTimeNum;
var Load = function () {};
Load.prototype = {
    setScale: function (val) {
        val = val * gameScale * 2;
        return val;
    },
    startLoad: function () {
        this.load.crossOrigin = 'anonymous'; // 设置跨域
        this.load.atlas('atlas', 'GravitySensingGame/img/game.png', 'GravitySensingGame/img/game.json');
        this.load.image('remind', 'GravitySensingGame/img/remind.png');
        this.load.audio('bg', 'GravitySensingGame/music/bg.mp3');
        this.load.audio('jump', 'GravitySensingGame/music/jump.mp3');
        this.load.audio('spring', 'GravitySensingGame/music/spring.mp3');
        this.load.start();
    },
    loadStart: function () {
        this.text.setText("加载中 ...");
    },
    fileComplete: function (progress) {
        this.text.setText(+progress + "%");
    },
    loadComplete: function () {
        this.text.setText(" ");
        music[0] = this.add.audio('bg', 0.4, true);
        music[1] = this.add.audio('jump');
        music[2] = this.add.audio('spring');
        this.sound.setDecodedCallback(music, function () {
            this.tips();
        }, this);

    },
    create: function () {
        this.stage.backgroundColor = '#edffd9';
        // 适应屏幕
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.setGameSize(gameWidth * 2, gameHeight * 2);
        this.scale.setMinMax(320, 480, 750, 1366);
        //失去焦点是否继续游戏
        this.stage.disableVisibilityChange = true;
        //load提示
        this.text = this.add.text(this.world.centerX, this.world.centerY, '', {
            font: this.setScale(50) + "px myFont",
            fill: '#6c6f3a',
        });
        this.text.anchor.set(0.5);
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);
        this.load.onLoadStart.add(this.loadStart, this); //开始
        this.load.onFileComplete.add(this.fileComplete, this); //加载中
        this.load.onLoadComplete.add(this.loadComplete, this); //加载结束
        this.startLoad();

    },
    tips: function () {
        this.tipsBtn = new this.addBtn(0,
            0, 'remind', '', '#d9cc43', '#333', this.setScale(36), null);
        this.tipsBtn.Btn.events.onInputDown.add(function () {
            music[0].play();
            game.state.start('Game');
        }, this);

    },
    addTips: function (x, y, scale, frame, texts) {
        var sprite = this.add.sprite(this.setScale(60), this.setScale(150) + y, 'atlas', frame);
        sprite.scale.set(scale);
        var text = this.add.text(sprite.x + sprite.width + this.setScale(50) + x, sprite.y, texts, {
            font: this.setScale(30) + "px",
            fill: '#d9cc43'
        });
    },
    addBtn: function (x, y, img, texts, color, stroke, fontSize) {
        var typa = typa || null;
        var typb = typb || null;
        this.Btn = game.add.sprite(x, y, img);
        this.Btn.width = gameWidth * 2;
        this.Btn.height = gameHeight * 2;
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
        return this
    }
};

$(function () {
    playAudio();
    document.addEventListener("WeixinJSBridgeReady", function () {
        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
            network = e.err_msg.split(":")[1]; //结果在这里
            playAudio();
        });
    }, false);

    function playAudio() {
        $('.music').unbind().on('click', function () {
            if (!$('.music').hasClass('disabled')) {
                music[0].pause();
                music[1].pause();
                $('.music').addClass('disabled');
            } else {
                music[0].resume();
                music[1].resume();
                $('.music').removeClass('disabled');
            }
        });
    }
});
