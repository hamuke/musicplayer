//音频对象:播放，暂停等
;
(function (root) {
    function AudioManage() {
        this.audio = new Audio();
        this.status = 'pause';
    }
    AudioManage.prototype = {
        //加载音乐
        load(src) {
            this.audio.src = src;
            this.audio.load();
        },

        //播放音乐
        play() {
            this.audio.play();
            this.status = 'play';
        },

        //暂停音乐
        pause() {
            this.audio.pause();
            this.status = 'pause';
        },

        //音乐播放完成事件
        musicEnd(cb) {
            this.audio.onended = cb;
        },

        //跳到音乐的某个时间点
        playTo(time) {
            this.audio.currentTime = time; //单位为秒
        }
    }

    root.music = new AudioManage();

})(window.player || (window.player = {}));