const {
    series,
    src,
    dest,
    watch
} = require('gulp');

//html
const htmlClean = require('gulp-htmlclean');
//css
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
//js
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
//图片
const imgMin = require('gulp-imagemin');
//服务器
const connect = require('gulp-connect');

const folder = {
    src: 'src/',
    dist: 'dist/'
}

//任务
function html() {
    return src(folder.src + 'html/*')
        .pipe(htmlClean())
        .pipe(dest(folder.dist + 'html/'))
        .pipe(connect.reload());
}

function css() {
    return src(folder.src + 'css/*')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(dest(folder.dist + 'css/'))
        .pipe(connect.reload());
}

function js() {
    return src(folder.src + 'js/*')
        // .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(dest(folder.dist + 'js/'))
        .pipe(connect.reload());
}

function image() {
    return src(folder.src + 'images/*')
        .pipe(imgMin())
        .pipe(dest(folder.dist + 'images/'))
}

function server(cb) {
    connect.server({
        port: '2048',
        livereload: true, //自动刷新
    });
    cb();
}

//文件监听
watch(folder.src + 'html/*', function (cb) {
    html();
    cb();
});
watch(folder.src + 'css/*', function (cb) {
    css();
    cb();
});
watch(folder.src + 'js/*', function (cb) {
    js();
    cb();
});

exports.default = series(html, css, js, image, server);