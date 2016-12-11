/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var keyframe = require('blear.core.keyframe');

var transform = require('../src/index');
var footerEl = document.getElementById('footer');
var spriteEl = document.getElementById('sprite');
var squareEl = document.getElementById('square');
var demoEl = document.getElementById('demo');

document.getElementById('transit').onclick = function () {
    transform.transit(demoEl, {
        width: 300
    });
};


var fRun = keyframe.create({
    0: {backgroundPosition: '0 0'},
    1: {backgroundPosition: '-1680px 0'}
});
transform.frame(spriteEl, fRun, {
    count: -1,
    duration: 600,
    easing: [12, 'end']
});

var fSquare = keyframe.create({
    0: {backgroundPosition: '0 0'},
    0.5: {backgroundPosition: '0 -10500px'},
    1: {backgroundPosition: '0 0'}
});
transform.frame(squareEl, fSquare, {
    count: -1,
    duration: 800,
    easing: [60, 'end']
});

var fFooter = keyframe.create({
    0: {backgroundPosition: '0 0'},
    1: {backgroundPosition: '-100px 0'}
});
transform.frame(footerEl, fFooter, {
    count: -1,
    duration: 1000,
    easing: 'linear'
});

var f1 = keyframe.create({
    0: {
        height: 100,
        transform: {
            rotateZ: 0
        }
    },
    0.5: {
        height: 400,
        transform: {
            rotateZ: 60
        }
    },
    1: {
        height: 300,
        transform: {
            rotateZ: 30
        }
    }
});

var f2 = keyframe.create({
    0: {
        transform: {
            rotateX: 30,
            translateX: 0,
            translateY: 0
        }
    },
    1: {
        transform: {
            rotateX: 30,
            translateX: 100,
            translateY: 100
        }
    }
});

document.getElementById('frame1').onclick = function () {
    transform.frame(demoEl, f1);
};

document.getElementById('frame2').onclick = function () {
    transform.frame(demoEl, f2);
};



