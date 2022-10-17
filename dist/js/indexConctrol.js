//索引模块
;
(function (root) {

    function Index(len) {
        this.index = 0; //当前索引 
        this.len = len; //索引长度
    }

    Index.prototype = {
        prev() {
            return this.get(-1);
        },
        next() {
            return this.get(1);
        },
        get(val) {
            return ((this.index + val + this.len) % this.len);
        }
    }


})(window.player || (window.player = {}));