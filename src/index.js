/**
 * core/transform
 * @author ydr.me
 * @create 2016-04-19 15:49
 */



'use strict';

var compatible = require('blear.utils.compatible');
var access =     require('blear.utils.access');
var typeis =     require('blear.utils.typeis');
var object =     require('blear.utils.object');
var array =      require('blear.utils.array');
var time =       require('blear.utils.time');
var easing =     require('blear.utils.easing');
var fun =        require('blear.utils.function');
var string =     require('blear.utils.string');
var event =      require('blear.core.event');
var attribute =  require('blear.core.attribute');

var win = window;
var TRANSITIONEND_EVENT = compatible.event('transitionend', win);
//var ANIMATIONSTART_EVENT = compatible.event('animationstart', win);
var ANIMATIONEND_EVENT = compatible.event('animationend', win);
var DELAY_TIME = 100;

var defaults = exports.defaults = {
    /**
     * 动画缓冲类型
     * @type string
     */
    easing: 'linear',

    /**
     * 动画时间
     * @type number
     */
    duration: 345,

    // =======================================
    // ========== 以下参数仅适用于帧动画 =========
    // =======================================

    /**
     * 动画次数，-1 为无限动画
     * @type Number
     */
    count: 1,

    /**
     * 帧动画方向，可选值：normal、alternate、reverse、alternate-reverse
     * @type string
     */
    direction: 'normal',

    /**
     * 填充模式，可选值：none/forwards/backwards/both
     * @type string
     */
    fillMode: 'forwards'
};


/**
 * 过渡
 * @param el
 * @param to
 * @param options
 * @param callback
 */
exports.transit = function (el, to, options, callback) {
    var args = access.args(arguments);
    var argLen = args.length;
    // 最后一个参数是否为 Function
    var hasCallback = typeis.Function(args[argLen - 1]);

    switch (argLen) {
        case 3:
            // .transit(el, to, callback);
            if (hasCallback) {
                options = args[3];
                callback = args[2];
            }
            //  .transit(el, to, options);
            break;

        case 2:
            // .transit(el, to);
            options = args[2];
            break;
    }

    callback = fun.noop(callback);
    options = object.assign({}, defaults, options);
    //object.supply(to, {
    //    transform: {
    //        translateZ: 0
    //    }
    //});

    // fallback
    if (!TRANSITIONEND_EVENT) {
        attribute.style(el, to);
        time.nextFrame(callback);
        return;
    }

    var transformEnd = fun.once(function () {
        clearTimeout(timeid);
        event.un(el, TRANSITIONEND_EVENT, transformEnd);

        var css = {
            transitionDuration: '',
            transitionTimingFunction: '',
            transitionDelay: '',
            transitionProperty: ''
        };

        // 3. 清除过渡样式
        attribute.style(el, css);

        // 4. 下一帧再回调
        time.nextFrame(callback);
    });

    event.once(el, TRANSITIONEND_EVENT, transformEnd);

    var timeid = setTimeout(transformEnd, options.duration + DELAY_TIME);
    var timingFunction = easing.timingFunction(options.easing);
    var cssKeys = object.keys(to);
    cssKeys = array.map(cssKeys, function (cssKey) {
        return string.separatorize(cssKey);
    });
    var css = {
        transitionDuration: options.duration + 'ms',
        transitionTimingFunction: timingFunction,
        transitionDelay: 0,
        transitionProperty: cssKeys.join(',')
    };

    time.nextFrame(function () {
        // 1. 设置过渡样式
        attribute.style(el, css);
        time.nextFrame(function () {
            // 2. 设置终点样式
            attribute.style(el, to);
        });
    });
};


/**
 * 帧动画
 * @param el
 * @param name
 * @param options
 * @param callback
 */
exports.frame = function (el, name, options, callback) {
    var args = access.args(arguments);
    var argLen = args.length;
    // 最后一个参数是否为 Function
    var hasCallback = typeis.Function(args[argLen - 1]);

    switch (argLen) {
        case 3:
            // .frame(el, name, callback);
            if (hasCallback) {
                options = args[3];
                callback = args[2];
            }
            //  .frame(el, name, options);
            break;

        case 2:
            // .frame(el, name);
            options = args[2];
            break;
    }

    callback = fun.noop(callback);

    // fallback
    if (!ANIMATIONEND_EVENT) {
        time.nextFrame(callback);
        return;
    }

    var transformEnd = fun.once(function () {
        clearTimeout(timeid);
        event.un(el, ANIMATIONEND_EVENT, transformEnd);

        var css = {
            animationName: '',
            animationDuration: '',
            animationTimingFunction: '',
            animationDelay: '',
            animationIterationCount: '',
            animationDirection: '',
            animationPlayState: '',
            animationFillMode: ''
        };

        // 4. 下一帧再回调
        time.nextFrame(function () {
            // 3. 清除帧动画样式
            attribute.style(el, css);
            callback();
        });
    });

    event.once(el, ANIMATIONEND_EVENT, transformEnd);
    options = object.assign({}, defaults, options);

    var timeid;

    if (options.count === -1) {
        options.count = 'infinite';
    } else {
        timeid = setTimeout(transformEnd, options.duration * options.count + DELAY_TIME);
    }

    var timingFunction = easing.timingFunction(options.easing);
    var css = {
        animationName: name,
        animationDuration: options.duration + 'ms',
        animationTimingFunction: timingFunction,
        animationDelay: 0,
        animationIterationCount: options.count,
        animationDirection: options.direction,
        //animationPlayState: 'running',
        animationFillMode: options.fillMode
    };

    time.nextFrame(function () {
        // 1. 设置帧动画样式
        attribute.style(el, css);
    });
};
