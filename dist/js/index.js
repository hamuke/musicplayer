(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom; //播放器的容器（用于加载listControl模块）
        this.dataList = []; //存储请求到的数据
        this.curIndex = 0; //歌曲的索引
        this.indexObj = null; //歌曲索引对象
        this.rotateTimer = null; //旋转唱片定时器
        this.list = null; //列表切歌对象（在listPlay里赋了值）
        this.progress = player.progress.pro(); //实例化一个进度条的组件
    }

    MusicPlayer.prototype = {
        init() { //初始化 
            this.getDom();
            this.getData('../mock/data.json');
        },
        getDom() { //获取元素
            this.musicImg = document.querySelector('.songImg img');
            this.controlBtns = document.querySelectorAll('.control li')
        },
        getData(url) { //获取数据
            const _this = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) { //请求数据成功后的操作
                    _this.dataList = data; //存储请求过来的数据

                    _this.listPlay(); //列表切歌，它要放在loadMusic的前面，因为this.list对象是在这个方法里声明的，要在loadMusic里使用

                    _this.indexObj = new player.controlIndex(data.length); //给索引值对象赋值

                    _this.loadMusic(_this.indexObj.index); //加载音乐 

                    _this.musicControl(); //添加音乐操作功能

                    _this.dragProgress(); //添加进度条拖拽功能
                },
                error: function () {
                    console.log("数据请求失败");
                }
            });
        },
        loadMusic(index) { //加载音乐
            const _this = this;
            player.render(this.dataList[index]); //渲染图片，歌曲信息...
            player.music.load(this.dataList[index].audioSrc);

            this.progress.renderTime(this.dataList[index].duration); //加载歌曲的总时间

            //播放音乐（只有音乐的状态为play的时候才能播放）
            if (player.music.status === 'play') {
                player.music.play();
                this.controlBtns[2].className = 'play';
                this.startRotate(0);

                this.progress.move(0); //切歌时让进度条清零再开始移动
            }

            this.list.changeSelect(index); //改变列表里歌曲的选中状态
            this.curIndex = index; //存储当前歌曲对应的索引值

            player.music.musicEnd(function () {
                _this.loadMusic(_this.indexObj.next());
            });
        },
        musicControl() { //控制音乐: 播放 切换
            const _this = this;
            //上一首
            this.controlBtns[1].addEventListener('touchend', function () {
                player.music.status = 'play';
                _this.loadMusic(_this.indexObj.prev());
            });
            //播放暂停
            this.controlBtns[2].addEventListener('touchend', function () {
                if (player.music.status === 'play') {
                    player.music.pause();
                    this.className = '';
                    _this.stopRotate();

                    _this.progress.stop(); //暂停时让进度条停止移动
                } else {
                    player.music.play();
                    this.className = 'play';
                    var deg = _this.musicImg.dataset.rotate || 0;
                    _this.startRotate(deg);

                    _this.progress.move(); //播放时让进度条移动
                }
            });
            //下一首
            this.controlBtns[3].addEventListener('touchend', function () {
                player.music.status = 'play';
                _this.loadMusic(_this.indexObj.next());
            });
        },
        startRotate(deg) { //旋转唱片
            clearInterval(this.rotateTimer);
            const _this = this;

            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.2; //+将deg转成数字
                _this.musicImg.style.transform = 'rotate(' + deg + 'deg)';
                _this.musicImg.dataset.rotate = deg; //自定义标签存储已旋转的角度以便暂停再次播放后继续当前位置旋转
            }, 1000 / 60);
        },
        stopRotate() { //停止旋转
            clearInterval(this.rotateTimer);
        },
        listPlay() { //列表切歌
            const _this = this;
            this.list = player.listControl(this.dataList, this.wrap); //把listControl对象赋值给this.list

            //列表按钮添加点击事件
            this.controlBtns[4].addEventListener('touchend', function () {
                _this.list.slideUp();
            });
            //歌曲列表添加点击事件
            this.list.musicList.forEach(function (item, index) {
                item.addEventListener('touchend', function () {
                    if (_this.curIndex === index) {
                        return;
                    }
                    player.music.status = 'play'; //歌曲要变成播放状态
                    _this.indexObj.index = index; //索引值对象身上的当前索引值要更新
                    _this.loadMusic(index); //加载点击对应的索引值的那首歌曲
                    _this.list.slideDown(); //列表消失
                })
            })
        },

        dragProgress() { //拖拽进度条
            const _this = this;
            const circle = player.progress.drag(document.querySelector('.circle'));
            circle.init();

            //按下圆点时暂停播放
            circle.start = function () {
                _this.progress.stop();
            }

            //拖拽圆点更新进度条
            circle.move = function (per) {
                _this.progress.update(per);
            }

            //抬起圆点时改变歌曲进度到相应位置并开始播放
            circle.end = function (per) {
                // 拖拽到的位置=百分比*歌曲总长度
                var curTime = per * _this.dataList[_this.curIndex].duration;
                player.music.playTo(curTime);
                player.music.play();

                //移动进度条
                _this.progress.move(per);

                //按钮状态变成播放状态,旋转唱片
                var deg = _this.musicImg.dataset.rotate || 0;
                _this.startRotate(deg);
                _this.controlBtns[2].className = 'play'; 
            }
        }
    }

    const musicPlayer = new MusicPlayer(document.querySelector('#wrap'));
    musicPlayer.init();

})(window.Zepto, window.player)