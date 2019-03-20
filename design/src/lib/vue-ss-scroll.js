/*
 * vue-ss-scroll v0.1.0
 * author: bianhao
 *
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.VueRouter = factory());
}(this, (function () { 'use strict';

	var ssScroll = {};

	ssScroll.install = function(Vue) {

		var curScroll = {};

		var handleListeners = function(el, now, past) {
			if(el === document.body) {
				document.onscroll = function(e) {
					now && typeof now === 'function' &&
					scrolling(e, document.body, now);
				}
			} else if(el.addEventListener) {
				past && typeof past === 'function' &&
				el.removeEventListener('scroll', past);
				el.addEventListener('scroll',function(e) {
					now && typeof now === 'function' &&
					scrolling(e, el, now);
				});
			} else {
				past && typeof past === 'function' &&
				el.detachEvent('onscroll', past);
				el.attach('onscroll', function(e) {
					now && typeof now === 'function' &&
					scrolling(e, el, now);
				})
			}
		}

		var scrolling = function(e, el, now) {
			curScroll.left != undefined && curScroll.top != undefined &&
			now(e, {scrollTop: el.scrollTop, scrollLeft: el.scrollLeft, deltaY: el.scrollTop - curScroll.top, deltaX: el.scrollLeft - curScroll.left});

			curScroll.left = el.scrollLeft;
			curScroll.top = el.scrollTop;
		}

		Vue.directive('ss-scroll', {
			bind: function(el, binding) {
				handleListeners(el, binding.value);
			},
			update: function(el, binding) {
				handleListeners(el, binding.value, binding.oldValue);
			},
			unbind: function(el, binding) {
				handleListeners(el, false, binding.value);
			}
		});

	}

	var inBrowser = typeof window !== 'undefined';

	if(inBrowser && window.Vue) {
		// in Browser && Global Mode
		window.Vue.use(ssScroll);
	}

	return ssScroll;

})));
