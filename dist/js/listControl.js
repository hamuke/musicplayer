(function (root) {
    function listControl(data, wrap) {
        const list = document.createElement('div'),
            dl = document.createElement('dl'),
            dt = document.createElement('dt'),
            close = document.createElement('div'),
            img = document.querySelector('.songImg');
            musicList = []; //存储所有的歌曲对象的dom

        list.className = 'list overflow';
        dt.innerHTML = '播放列表';
        close.className = 'close';
        close.innerHTML = '关闭';

        dl.appendChild(dt);
        data.forEach(function (item, index) {
            const dd = document.createElement('dd');
            dd.innerHTML = item.name;

            dl.appendChild(dd);
            musicList.push(dd);
        });

        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);

        const disY = list.offsetHeight;
        list.style.transform = 'translateY(' + disY + 'px)';

        //唱片和关闭按钮点击关闭歌曲列表
        img.addEventListener('touchend', slideDown);
        close.addEventListener('touchend', slideDown);

        //列表滑动显示
        function slideUp() {
            list.style.transition = '.2s';
            list.style.transform = 'translateY(0)';
        }

        //列表滑动隐藏
        function slideDown() {
            list.style.transition = '.2s';
            list.style.transform = 'translateY(' + disY + 'px)';
        }

        //切换选中状态
        function changeSelect(index) {
            for (let i = 0; i < musicList.length; i++) {
                musicList[i].className = '';
            }
            musicList[index].className = 'active';
        }

        return {
            dom: list,
            musicList: musicList,
            slideUp: slideUp,
            slideDown: slideDown,
            changeSelect: changeSelect
        }
    }

    root.listControl = listControl;

})(window.player || (window.player = {}))