//进度条模块：
;
(function (root) {
    //进度条
    function Progress() {
        this.durTime = 0; //总时长
        this.startTime = 0; //开始播放时的时间
        this.frameId = null; //定时器
        this.lastPer = 0; //暂停时已经走的百分比

        this.init();
    }
    Progress.prototype = {
        init() {
            this.getDom();
        },
        getDom() {
            this.curTime = document.querySelector('.curTime');
            this.totalTime = document.querySelector('.totalTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
        },
        renderTime(time) { //渲染总时长
            this.durTime = time;

            time = this.formatTime(time);

            this.totalTime.innerHTML = time;
        },
        formatTime(time) { //格式化时间
            time = Math.round(time);

            var s = Math.floor(time / 60); //分
            var m = time % 60; //秒

            s = s < 10 ? '0' + s : s;
            m = m < 10 ? '0' + m : m;

            return s + ':' + m;
        },

        move(per) { //移动进度条
            cancelAnimationFrame(this.frameId);
            const _this = this;

            //防止切歌时进度条没有清零或者没有按照用户的进度
            this.lastPer = per === undefined ? this.lastPer : per;

            this.startTime = new Date().getTime(); //播放时间

            function frame() {
                var curTime = new Date().getTime(); //当前时间(上一次暂停时间)

                //总百分比 = 上次的百分比 + 这次百分比（暂停时的时间-开始播放的时间）/总时间（注意单位统一）
                var per = _this.lastPer + (curTime - _this.startTime) / (_this.durTime * 1000);
                if (per <= 1) {
                    _this.update(per);
                } else {
                    cancelAnimationFrame(_this.frameId);
                }
                _this.frameId = requestAnimationFrame(frame);
            }
            frame();
        },
        update(per) { //更新进度条（时间，走的百分比）
            //更新起始时间
            var time = this.formatTime(per * this.durTime);
            this.curTime.innerHTML = time;

            //更新进度条
            this.frontBg.style.width = per * 100 + '%';

            //更新圆点位置(不超过父级的宽度)
            var circleLeft = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translateX(' + circleLeft + 'px)';
        },
        stop() { //停止进度条
            cancelAnimationFrame(this.frameId);

            //记录暂停时的百分比以便下次播放进度条能继续当前位置移动
            var stopTime = new Date().getTime();
            this.lastPer += (stopTime - this.startTime) / (this.durTime * 1000);
        }
    }

    function instanceProgress() {
        return new Progress();
    }

    //拖拽
    function Drag(obj) {
        this.obj = obj; //要拖拽的DOM元素
        this.startPoint = 0; //按下时的位置
        this.startLeft = 0; //按下时走的距离
        this.percent = 0; //拖拽的百分比
    }
    Drag.prototype = {
        init() {
            const _this = this;
            this.obj.style.transform = 'translateX(0)';

            //拖拽开始
            this.obj.addEventListener('touchstart', function (e) {
                //changedTouches    触发当前事件的手指列表
                _this.startPoint = e.changedTouches[0].pageX;
                // parseFloat:开头是数字且只返回一个数字
                _this.startLeft = parseFloat(this.style.transform.split('(')[1]);
                //对外暴露拖拽开始的方法,用户直接调用此方法
                _this.start && _this.start();
            });

            //拖拽中
            this.obj.addEventListener('touchmove', function (e) {
                //拖拽的距离=移动的距离-按下时的位置
                _this.disPoint = e.changedTouches[0].pageX - _this.startPoint;
                //小圆点要走的距离=拖拽的距离+按下时走的距离
                var circleLeft = _this.disPoint + _this.startLeft;
                //边界处理
                if (circleLeft < 0) {
                    circleLeft = 0;
                } else if (circleLeft > this.parentNode.offsetWidth) {
                    circleLeft = this.parentNode.offsetWidth;
                }
                this.style.transform = 'translate(' + circleLeft + 'px)';

                //进度的百分比
                _this.percent = circleLeft / this.parentNode.offsetWidth;

                _this.move && _this.move(_this.percent);

                e.preventDefault();
            });

            //拖拽结束
            this.obj.addEventListener('touchend', function () {
                _this.end && _this.end(_this.percent);
            })
        }
    }

    function instanceDrag(obj) {
        return new Drag(obj);
    }

    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag
    }

})(window.player || (window.player = {}))