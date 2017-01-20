/**
 * core/transform
 * @author ydr.me
 * @created 2016-04-19 15:49
 */



'use strict';

var compatible = require('blear.utils.compatible');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var time = require('blear.utils.time');
var easing = require('blear.utils.easing');
var fun = require('blear.utils.function');
var string = require('blear.utils.string');
var event = require('blear.core.event');
var attribute = require('blear.core.attribute');

var win = window;
var TRANSITIONEND_EVENT = compatible.event('transitionend', win);
//var ANIMATIONSTART_EVENT = compatible.event('animationstart', win);
var ANIMATIONEND_EVENT = compatible.event('animationend', win);
var DELAY_TIME = 100;

var defaults = exports.defaults = {
    /**
     * 动画缓冲类型
     * @type string|Array
     */
    easing: 'linear',

    /**
     * 动画时间，单位 ms
     * @type number
     */
    duration: 678,

    /**
     * 动画延迟时间，单位 ms
     * @type number
     */
    delay: 0,

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
 * @param el {HTMLElement} 过渡元素
 * @param to {String} 过渡终点
 * @param [options|Function] {Object} 配置
 * @param [options.easing] {String|Array} 缓冲类型或贝塞尔曲线参数数组
 * @param [options.duration=678] {Number} 过渡时间
 * @param [options.delay=0] {Number} 延迟时间
 * @param [options.count=1] {Number} 帧动画执行次数，-1为无限次
 * @param [options.direction="normal"] {String} 帧动画执行方向，可选值：normal、alternate、reverse、alternate-reverse
 * @param [options.fillMode="forwards"] {String} 帧动画填充模式，可选值：none/forwards/backwards/both
 * @param [callback] {Function} 回调
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

    callback = fun.ensure(callback);
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

    var timeid = setTimeout(transformEnd, options.duration + options.delay + DELAY_TIME);
    var timingFunction = easing.timingFunction(options.easing);
    var cssKeys = object.keys(to);
    cssKeys = array.map(cssKeys, function (cssKey) {
        return string.separatorize(cssKey);
    });
    var css = {
        transitionDuration: options.duration + 'ms',
        transitionTimingFunction: timingFunction,
        transitionDelay: options.delay + 'ms',
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
 * @param el {HTMLElement} 动画元素
 * @param name {String} 帧动画名称
 * @param [options|Function] {Object} 配置
 * @param [options.easing] {String|Array} 缓冲类型或贝塞尔曲线参数数组
 * @param [options.duration=678] {Number} 每一次执行时间
 * @param [options.delay=0] {Number} 延迟执行时间
 * @param [options.count=1] {Number} 帧动画执行次数，-1为无限次
 * @param [options.direction="normal"] {String} 帧动画执行方向，可选值：normal、alternate、reverse、alternate-reverse
 * @param [options.fillMode="forwards"] {String} 帧动画填充模式，可选值：none/forwards/backwards/both
 * @param [callback] {Function} 回调
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

    callback = fun.ensure(callback);

    // fallback
    if (!ANIMATIONEND_EVENT) {
        time.nextFrame(callback);
        return;
    }

    var transformEnd = fun.once(function () {
        clearTimeout(timeid);
        event.un(el, ANIMATIONEND_EVENT, transformEnd);

        // 3. 暂停到帧动画的终点
        attribute.style(el, {
            animationPlayState: 'paused'
        });

        // 4. 下一帧再回调
        time.nextFrame(callback);
    });

    event.once(el, ANIMATIONEND_EVENT, transformEnd);
    options = object.assign({}, defaults, options);

    var timeid;

    if (options.count === -1) {
        options.count = 'infinite';
    } else {
        timeid = setTimeout(transformEnd, options.duration * options.count + options.delay + DELAY_TIME);
    }

    // 1. 先清空旧的 transform
    attribute.style(el, {
        animationName: '',
        animationDuration: '',
        animationTimingFunction: '',
        animationDelay: '',
        animationIterationCount: '',
        animationDirection: '',
        animationPlayState: '',
        animationFillMode: ''
    });

    var timingFunction = easing.timingFunction(options.easing);
    time.nextFrame(function () {
        // 2. 设置帧动画样式
        attribute.style(el, {
            animationName: name,
            animationDuration: options.duration + 'ms',
            animationTimingFunction: timingFunction,
            animationDelay: options.delay + 'ms',
            animationIterationCount: options.count,
            animationDirection: options.direction,
            animationPlayState: 'running',
            animationFillMode: options.fillMode
        });
    });
};
