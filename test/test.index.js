/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var transform = require('../src/index.js');


describe('测试文件', function () {
    var divEl = document.createElement('div');

    divEl.style.width = '100px';
    divEl.style.height = '100px';
    divEl.style.background = '#fbc';

    document.body.appendChild(divEl);

    var styleEl = document.createElement('style');
    var cssText = '@-webkit-keyframes test1 {' +
        '0% {width:100px}100%{width:200px;}' +
        '}' +
        '@keyframes test1 {' +
        '0% {width:100px}100%{width:200px;}' +
        '}' +
        '@-webkit-keyframes test2 {' +
        '0% {width:200px}100%{width:100px;}' +
        '}' +
        '@keyframes test2 {' +
        '0% {width:200px}100%{width:100px;}' +
        '}';

    if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = cssText;
    } else {
        styleEl.innerHTML = cssText;
    }

    document.body.appendChild(styleEl);

    afterAll(function () {
        document.body.removeChild(divEl);
    });


    it('.transit@args=2', function (done) {
        transform.transit(divEl, {
            width: 200,
            height: 300,
            transform: 'translate3d(100px, 100px, 0)'
        });

        setTimeout(done, 1000);
    });

    it('.transit@args=3', function (done) {
        transform.transit(divEl, {
            width: 100,
            height: 100,
            transform: 'translate3d(100px, 100px, 0)'
        }, {
            duration: 456
        });

        setTimeout(done, 1000);
    });

    it('.transit@args=3', function (done) {
        transform.transit(divEl, {
            width: 200,
            height: 300,
            transform: 'translate3d(100px, 100px, 0)'
        }, function () {
            //
        });

        setTimeout(done, 1000);
    });

    it('.transit@args=4', function (done) {
        transform.transit(divEl, {
            width: 100,
            height: 100,
            transform: 'translate3d(100px, 100px, 0)'
        }, {
            easing: 'in-out'
        }, function () {
            //
        });

        setTimeout(done, 1000);
    });

    it('.frame@args=2', function (done) {
        transform.frame(divEl, 'test1');
        setTimeout(done, 1000);
    });

    it('.frame@args=3', function (done) {
        transform.frame(divEl, 'test2', {});
        setTimeout(done, 1000);
    });

    it('.frame@args=3', function (done) {
        transform.frame(divEl, 'test1', function () {

        });
        setTimeout(done, 1000);
    });

    it('.frame@args=4', function (done) {
        transform.frame(divEl, 'test2', {}, function () {

        });
        setTimeout(done, 1000);
    });

    it('.frame:-1', function (done) {
        transform.frame(divEl, 'test2', {
            count: -1
        }, function () {

        });
        setTimeout(done, 1000);
    });
});
