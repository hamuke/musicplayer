//渲染模块：渲染图片，渲染信息，渲染是否喜欢
;
(function (root) {
    //渲染图片
    function renderImg(src) {
        root.blurImg(src); //给body添加背景图片(高斯模糊)
        const img = document.querySelector('.songImg img')
        img.src = src;
    }

    //渲染信息
    function renderInfo(data) {
        const infoList = document.querySelector('.songInfo').children;
        infoList[0].innerHTML = data.name;
        infoList[1].innerHTML = data.singer;
        infoList[2].innerHTML = data.album;
    }

    //渲染是否喜欢
    function renderIsLike(isLike) {
        const lis = document.querySelectorAll('.control li');
        lis[0].className = isLike ? 'like' : '';
    }
    
    /**
     *  data是请求得到必需的数据
     * @param {*} data 
     */
    root.render = function (data) {
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    };

})(window.player || (window.player = {}))