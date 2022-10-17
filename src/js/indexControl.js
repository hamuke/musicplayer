//索引模块
;
(function (root) {

    function Index(len) {
        this.index = 0; //当前索引 
        this.len = len; //索引长度
    }

    Index.prototype = {
        // 上一首
        prev() {
            return this.get(-1);
        },

        // 下一首
        next() {
            return this.get(1);
        },

        //获取索引
        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.controlIndex = Index; //把构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去

})(window.player || (window.player = {}));