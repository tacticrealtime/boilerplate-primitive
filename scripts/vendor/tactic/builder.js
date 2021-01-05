/**
 * TACTIC™ Creative Library
 * Copyright (C) 2020 TACTIC™ Real-Time Marketing <https://tacticrealtime.com/>
 * Licensed under GNU GPL <https://tacticrealtime.com/license/sdk/>
 *
 * @author Anton Gorodnyanskiy
 * @date 17/11/2018
 * @edit 23/12/2020
 */

(/**
 * @param {tactic} tactic
 */
function (tactic) {

	// Check utility namespace.
	tactic.utils = (tactic.utilities || tactic.utils || {});

	/**
	 * @type {Object}
	 */
	tactic.builder = {

		/**
		 * @type {Object}
		 */
		props: {},

		/**
		 * @type {Object}
		 */
		layers: {},

		/**
		 * @type {Object}
		 */
		fonts: {}

	};

	var

		// Lend TACTIC container namespace.
		container = tactic.container,

		// Lend TACTIC utility namespace.
		utils = tactic.utils;

	/**
	 * @function
	 * @param {Number} [speed]
	 */
	utils.Timeline = function (speed) {

		var

			/**
			 * @type {Object}
			 */
			that = this,

			/**
			 * @function
			 */
			update = function () {

				// console.log('>>>', (that.timestamp - that.date.getTime())/ 1000);

				if (that.schedule[that.timestamp]) {

					// console.log('>>', that.schedule[that.timestamp]);

					utils.each(that.schedule[that.timestamp],

						/**
						 * @param {Object} timer
						 */
						function (timer) {
							if (timer && timer.callback) {
								timer.callback.call();
								that.clearTimeout(timer);
							}
						}

					);
				}

				// Increase timestamp.
				that.timestamp += that.step;

				// console.log((that.timestamp - that.date.getTime()) / 1000);

			};

		/**
		 * @type {Date}
		 */
		this.date = new Date();

		/**
		 * @type {Number}
		 */
		this.timestamp = this.date.getTime();

		/**
		 * @type {Number}
		 */
		this.speed = utils.isTypeOf(utils.isNumber, window.TACTIC_TIMELINE_SPEED_MULTPLIER, utils.isTypeOf(utils.isNumber, speed, 1));

		/**
		 * @type {Number}
		 */
		this.rate = 10;

		/**
		 * @type {Number}
		 */
		this.step = Math.round((this.rate < 0 ? 0 : this.rate) * (this.speed < 0 ? 0 : this.speed));

		/**
		 * @type {Object}
		 */
		this.schedule = {};

		/**
		 * @function
		 * @param {Function} callback
		 * @param {Number} delay
		 */
		this.setTimeout = function (callback, delay) {

			// Check if callback and delay values are provided.
			if (callback && !isNaN(delay)) {

				var

					/**
					 * Create timestamp when timeout will be requested.
					 * Ensure that timestamp value will be inline with time step.
					 *
					 * @type {Number}
					 */
					timestamp = that.timestamp + (Math.round(delay / that.step) * that.step) + that.step;

				// Check if time slot is not created.
				if (!that.schedule[timestamp]) {

					// Create new time slot.
					that.schedule[timestamp] = [];

				}

				var

					/**
					 * @type {Object}
					 */
					timer = {

						/**
						 * @type {Number}
						 */
						id: NaN,

						/**
						 * @type {Number}
						 */
						timestamp: timestamp,

						/**
						 * @type {Function}
						 */
						callback: callback

					};

				// Push timer to schedule register and create timer ID.
				timer.id = that.schedule[timestamp].push(timer);

				return timer;

			}

			return null;
		};

		/**
		 * @function
		 * @param {Object} timer
		 */
		this.clearTimeout = function (timer) {
			if (timer) timer.callback = null;
		};

		/**
		 * @type {Number}
		 */
		this.interval = setInterval(update, this.rate);

	};

	/**
	 * @function
	 * @param {Array} array
	 * @param {String|Boolean} value
	 * @return {Number}
	 * @description Check if array contains value.
	 */
	utils.arrayIndex = function (array, value) {
		if (!utils.isArray(array)) {
			return -1;
		}
		if (!(utils.isString(value) || utils.isBoolean(value))) {
			return -1;
		}
		if (Array.prototype.indexOf) {
			return array.indexOf(value);
		} else {
			var i = array.length;
			while (i--) {
				if (array[i] === value) {
					return i;
				}
			}
		}
		return -1;
	};

	/**
	 * Find DOM elements by data-key attribute in provided scope.
	 *
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} key
	 * @return {Array}
	 */
	utils.getElementsByKey = function (target, key) {
		return utils.isElement(target) ? target.querySelectorAll('[data-key=' + key + ']') : [];
	};

	/**
	 * Checks if argument is a of type and return value.
	 *
	 * @function
	 * @param {Function} operator
	 * @param object
	 * @param [defval]
	 * @return
	 */
	utils.isTypeOf = function (operator, object, defval) {
		if (!utils.isFunction(operator) || utils.isUndefined(object)) {
			return utils.isUndefined(defval) ? false : defval;
		}
		return utils.isUndefined(defval) ? operator(object) : ((operator(object) ? object : defval));
	};

	/**
	 * Add simple event.
	 *
	 * @function
	 * @param {Element|Node|Document|Window} target
	 * @param {String} type
	 * @param callback
	 * @return {Object}
	 */
	utils.addEventSimple = function (target, type, callback) {
		if (!target || !type || !callback) {
			return null;
		}

		if (target.addEventListener) {
			target.addEventListener(type, callback, false);
		} else if (target.attachEvent) {
			target.attachEvent('on' + type, callback);
		}

		return {
			target: target,
			type: type,
			callback: callback
		}
	};

	/**
	 * @function
	 * @param {Element|Node|Document|Window} target
	 * @param {String} type
	 * @param callback
	 * @description Remove simple event.
	 */
	utils.removeEventSimple = function (target, type, callback) {
		if (!target || !type || !callback) {
			return {
				target: target,
				type: type,
				callback: callback
			};
		}

		if (target.removeEventListener) {
			target.removeEventListener(type, callback, false);
		} else if (target.detachEvent) {
			target.detachEvent('on' + type, callback);
		}

		return null;
	};

	/**
	 * @function
	 * @param {Element} target
	 * @param {String} styleName
	 * @param {String|Number} [defaultValue]
	 * @return {String}
	 * @description Finds indicated CSS style value in DOM object.
	 */
	utils.getStyle = function (target, styleName, defaultValue) {

		try {
			if (utils.isElement(target)) {
				if (target.currentStyle) {
					return target.currentStyle[styleName];
				} else if (document.defaultView && document.defaultView.getComputedStyle) {
					return document.defaultView.getComputedStyle(target, '')[styleName];
				} else {
					return target.style[styleName];
				}
			}
		} catch (e) {
		}

		return defaultValue;
	};

	/**
	 * @function
	 * @param {Array} sources - Media sources.
	 * @param {Number} width - Container width.
	 * @param {Number} height - Container height.
	 * @param {Number} [limit_min] - Container minimal width or height.
	 * @param {Number} [limit_max] - Container maximal width or height.
	 * @return {Object}
	 * @description Provides proper image or video source size finder based on holder width and height.
	 */
	utils.getAssetSource = function (sources, width, height, limit_min, limit_max) {

		var

			/**
			 * Define default source object.
			 * @type {Object}
			 */
			source = {};

		// Check if sources are provided.
		if (sources) {

			// Validate dimension limits.
			limit_min = isNaN(limit_min) ? 0 : limit_min;
			limit_max = isNaN(limit_max) ? 1920 : limit_max;

			// Sort sources by size, so the biggest size will be in front.
			sources.sort(function (a, b) {
				if (a.width < b.width) {
					return 1;
				}
				if (a.width > b.width) {
					return -1;
				}
				return 0;
			});

			source = sources[0];

			// Loop image sources descendingly to find out what source is the best match for holder size.
			for (var i = 0; i < sources.length; i++) {

				// Check if image source fits container without quality degradation, break loop if it does.
				if (sources[i].width <= limit_max && sources[i].height <= limit_max) {
					if (width >= sources[i].width || height >= sources[i].height || source.width <= limit_min || source.height <= limit_min) {
						break;
					}
				}

				// Set asset source.
				source = sources[i];

			}

		}

		return source;
	};

	/**
	 * @function
	 * @param {Object} source - Asset source object.
	 * @param {String} [name] - URL indexed name to search in source object.
	 * @return {String}
	 * @description Provides proper image or video source size finder based on holder width and height.
	 */
	utils.getAssetUrl = function (source, name) {

		// Validate indexed name.
		if (!utils.isString(name)) {
			name = 'url';
		}

		var

			/**
			 * Define default source URL.
			 *
			 * @type {String}
			 */
			url = utils.isObject(source) ? utils.isString(source[name]) ? source[name] : '' : (utils.isString(source) ? source : '');

		if (url !== '' && !(url ? !(url.indexOf('data:image') === -1) : false)) {

			if (url.indexOf('http') === -1 && url.slice(0, 2) !== '//') {

				// Add absolute package URL before local URL.
				// NB! Sanitize asset URL before loading (will set correct protocol and traffic load indicator).
				url = tactic.url.sanitize((tactic.url.package && tactic.url.package.length > 0) ? tactic.url.package + '/' + url : url);

			}

		}

		return url;
	};

	/**
	 * @function
	 * @param {Array} props - List of props.
	 * @param {Number} filter - Property filter.
	 * @return {Object|Array|String}
	 * @description Select property from array depending on filter property.
	 */
	utils.selectProperty = function (props, filter) {
		try {
			var a = props.filter(function (object) {
				return object[0] <= filter;
			}).sort(function (a, b) {
				if (a[0] < b[0]) {
					return 1;
				}
				if (a[0] > b[0]) {
					return -1;
				}
				return 0;
			});

			return a[0][1];

		} catch (e) {

			return null;
		}
	};

	/**
	 * @function
	 * @param {String} key
	 * @param {String} family
	 * @param {Function} callback
	 * @param {(Element|Node)} [holder]
	 * @param {Number} [timeout]
	 * @description Watch font load state.
	 */
	utils.watchFont = function (key, family, callback, holder, timeout) {

		// Check if font is already in the check wait list.
		if (!tactic.builder.fonts[key]) {

			/**
			 * @type {Object}
			 */
			tactic.builder.fonts[key] = {

				/**
				 * @type {String}
				 */
				key: key,

				/**
				 * @type {String}
				 */
				family: (family ? family : 'inherit'),

				/**
				 * @type {Element}
				 */
				target: document.createElement('span'),

				/**
				 * @type {Element}
				 */
				wrapper: document.createElement('span'),

				/**
				 * @type {Element}
				 */
				holder: utils.isElement(holder) ? holder : document.body,

				/**
				 * @type {Number}
				 */
				time: new Date().getTime(),

				/**
				 * @type {Number}
				 */
				timeout: utils.isNumber(timeout) ? timeout : 1000,

				/**
				 * @type {Number}
				 */
				width: undefined,

				/**
				 * @type {Number}
				 */
				height: undefined,

				/**
				 * @type {Boolean}
				 */
				initiated: false,

				/**
				 * @type {Boolean}
				 */
				success: undefined,

				/**
				 * @type {Array}
				 */
				callbacks: []

			};

		}

		var

			/**
			 * @type {Object}
			 */
			font = tactic.builder.fonts[key],

			/**
			 * @function
			 * @param {Boolean} success - Success state.
			 */
			complete = function (success) {

				// Set success flag.
				font.success = success;

				try {

					// Try to remove tester element.
					font.holder.removeChild(font.wrapper);

				} catch (e) {
				}

				for (var callbackKey in font.callbacks) {

					// Check if callback was defined.
					if (utils.isFunction(font.callbacks[callbackKey])) {

						// Trigger callback.
						font.callbacks[callbackKey](font.key, font.success);

						// Remove callback from the wait list.
						font.callbacks[callbackKey] = null;

					}

				}
			},

			/**
			 * @function
			 */
			analyse = function() {

				// Check if we're out of time to wait for wont load.
				if ((new Date().getTime() - font.time) > font.timeout) {

					// Complete operation with negative result.
					complete(false);

				}

				// Check if container dimensions changed. Means font loaded.
				else if (font.width !== font.target.offsetWidth || font.height !== font.target.offsetHeight) {

					// Complete operation with positive result.
					complete(true);

				} else {

					// Set check timer.
					setTimeout(function () {

						// Check again.
						analyse();

					}, 10);

				}
			};

		try {

			// Add callback to the wait list.
			font.callbacks.push(callback);

			// Check if font is already in the wait list.
			if (!font.initiated) {

				// Set initialisation flag.
				font.initiated = true;

				var

					/**
					 * @type {Object}
					 */
					wrapper_style = font.wrapper.style,

					/**
					 * @type {Object}
					 */
					target_style = font.target.style;

				wrapper_style.position = 'absolute';
				wrapper_style.overflow = 'hidden';
				wrapper_style.visibility = 'hidden';

				// Define CSS parameters.
				target_style.fontFamily = 'Times New Roman';
				target_style.width = 'auto';
				target_style.height = 'auto';
				target_style.display = 'block';
				target_style.fontSize = '48px';
				target_style.lineHeight = 'normal';
				target_style.color = 'transparent';
				target_style.visibility = 'hidden';
				target_style.fontDisplay = 'swap';

				// Place text into element.
				font.target.innerHTML = 'QW@HhsXJ1';

				// Append dummy text to wrapper.
				font.wrapper.appendChild(font.target);

				// Append wrapper to custom holder or to document body.
				font.holder.appendChild(font.wrapper);

				// Set check timer.
				setTimeout(function () {

					// Record element's initial width and height.
					font.width = font.target.offsetWidth;
					font.height = font.target.offsetHeight;

					// Set font class to apply specific font.
					target_style.fontFamily = font.family;

					// Check.
					analyse();

				}, 0);

			}

			// Check if font is already identified.
			else if (!utils.isUndefined(font.success)) {

				// Complete with result.
				complete(font.success);

			}

		} catch (e) {

			// Complete with negative result in case of error.
			complete(false);

		}

	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} className
	 * @return {Boolean}
	 * @description Check if DOM element has provided class name.
	 */
	utils.hasClass = function (target, className) {
		return !utils.isUndefined(target) && 'className' in target && new RegExp('(\\s|^)' + utils.escapeRegExpString(className) + '(\\s|$)').test(target.className);
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} className
	 * @description Add CSS class or classes to DOM element.
	 */
	utils.addClass = function (target, className) {

		if (utils.isElement(target) && utils.isString(className) && !utils.hasClass(target, className)) {
			target.className += ' ' + className;
			// target.className = target.className.split('  ').join(' ').replace(/^\s+|\s+$/g, '');
			target.className = target.className.split('  ').join(' ');
		}

		// return utils.isString(className) ? className : '';
		return className;
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {Array} classNames
	 * @description Add CSS classes to DOM element in batch.
	 */
	utils.addClasses = function (target, classNames) {

		var classList = [];

		if (utils.isElement(target) && utils.isArray(classNames)) {
			for (var i in classNames) {
				classList.push(utils.addClass(target, classNames[i]));
			}
		}
		return classList;
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} className
	 * @description Remove CSS class from DOM element.
	 */
	utils.removeClass = function (target, className) {

		if (utils.isElement(target) && utils.isString(className) && utils.hasClass(target, className)) {
			target.className
				= target.className.split('  ').join(' ').replace(new RegExp("(\\s|^)" + className + "(\\s|$)"), " ");
		}
		return utils.isString(className) ? className : '';
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {Array} classNames
	 * @description Remove CSS classes from DOM element in batch.
	 */
	utils.removeClasses = function (target, classNames) {

		var classList = [];

		if (utils.isElement(target) && utils.isArray(classNames)) {
			for (var i = 0; i < classNames.length; i++) {
				classList.push(utils.removeClass(target, classNames[i]));
			}
		}
		return classList;
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} styleName
	 * @param {String|Number} [defaultValue]
	 * @return {String}
	 * @description Finds indicated CSS style value in DOM object.
	 */
	utils.getStyle = function (target, styleName, defaultValue) {

		try {
			if (utils.isElement(target)) {
				if (target.currentStyle) {
					return target.currentStyle[styleName];
				} else if (document.defaultView && document.defaultView.getComputedStyle) {
					return document.defaultView.getComputedStyle(target, '')[styleName];
				} else {
					return target.style[styleName];
				}
			}
		} catch (e) {
		}
		return defaultValue;
	};

	/**
	 * @function
	 * @param {String} selector - CSS selector.
	 * @param {String} style - CSS style.
	 * @description Create CSS selector with style.
	 */
	utils.createCssRule = function (selector, style) {

		if (!document.styleSheets) {
			return;
		}
		if (document.getElementsByTagName('head').length === 0) {
			return;
		}

		if (utils.isEmptyString(selector) || selector === '.' || utils.isEmptyString(style)) {
			return;
		}

		selector = selector.split(' !.').join('.');
		selector = selector.split('!').length > 1 ? selector.split('!')[1] : selector;

		style = style.split("'").join('"');

		var styleSheet, mediaType, length, i;

		if (document.styleSheets.length > 0) {
			for (i = 0, length = document.styleSheets.length; i < length; i++) {
				if (document.styleSheets[i].disabled) {
					continue;
				}
				var media = document.styleSheets[i].media;
				mediaType = typeof media;
				if (mediaType === 'string') {
					if (media === '' || (media.indexOf('screen') !== -1)) {
						styleSheet = document.styleSheets[i];
					}
				} else if (mediaType === 'object') {
					if ((media['mediaText'].indexOf('screen') !== -1)) {
						styleSheet = document.styleSheets[i];
					}
				}
				if (typeof styleSheet !== 'undefined') {
					break;
				}
			}
		}

		if (typeof styleSheet === 'undefined') {
			var styleElement = document.createElement('style');
			styleElement.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(styleElement);
			for (i = 0; i < document.styleSheets.length; i++) {
				if (document.styleSheets[i].disabled) {
					continue;
				}
				styleSheet = document.styleSheets[i];
			}
			mediaType = typeof styleSheet.media;
		}

		if (mediaType === 'string') {

			for (i = 0, length = styleSheet.rules.length; i < length; i++) {
				if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
					styleSheet.rules[i].style.cssText = style;

					return {
						sheet: styleSheet,
						rule: i
					};
				}
			}

			return {
				sheet: styleSheet,
				rule: styleSheet.addRule(selector, style)
			};
		} else if (mediaType === 'object') {
			var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;

			for (i = 0; i < styleSheetLength; i++) {
				if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
					styleSheet.cssRules[i].style.cssText = style;

					return {
						sheet: styleSheet,
						rule: i
					};
				}
			}

			return {
				sheet: styleSheet,
				rule: styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength)
			};
		}

		return null;
	};

	/**
	 * @function
	 * @param {Object} sheet
	 * @param {Number} rule
	 */
	utils.deleteCssRule = function (sheet, rule) {

		// Check if style is valid.
		if (sheet) {

			// Try to delete style.
			try {
				if (sheet.deleteRule) {
					sheet.deleteRule(rule);
				} else if (sheet.removeRule) {
					sheet.removeRule(rule);
				}
			} catch (e) {
				return false;
			}

			return true;
		}

		return false;
	};

	/**
	 * @function
	 * @param {Object} css - CSS attribute object.
	 * @return {String}
	 */
	utils.createCssString = function (css) {

		var styleString = '';

		if (utils.isObject(css)) {

			for (var cssIndex in css) {

				if (css.hasOwnProperty(cssIndex)) {

					var style = css[cssIndex];

					if (utils.isObject(style) && style.enabled !== false) {

						if (style.calc) {

							var

								macros = {};

							if (utils.isArray(style.value)) {
								for (var valueIndex in style.value) {
									macros['value_' + valueIndex] = style.value[valueIndex];
								}
							}
							else {
								macros = {
									'value': style.value
								}
							}

							try {

								style = eval(utils.replaceMacros(style.calc, macros));

							} catch (e) {

								style = (utils.replaceMacros(style.calc, macros));

							}

						} else {

							style = style.value;

						}

					}

					if (utils.isString(style) || utils.isNumber(style)) {

						// Check if style has any kind of source link.
						if (cssIndex.indexOf('url') !== -1) {

							// Sanitize style URL.
							style = utils.getAssetUrl(style);

						}

						// Create styling string.
						styleString = styleString + (cssIndex + ':' + (style === '' ? '""' : style) + ';');

					}

				}

			}

		}

		return styleString;
	};

	/**
	 * @function
	 * @param {Object} css - CSS attribute object.
	 * @return {String}
	 */
	utils.createCssFontString = function (css) {

		var styleString = '';

		if (utils.isObject(css)) {

			for (var styleIndex in css) {

				if (css.hasOwnProperty(styleIndex)) {

					var style = css[styleIndex];

					if (styleIndex === 'src') {

						for (var srcPriIndex in style) {

							if (style.hasOwnProperty(srcPriIndex)) {

								if (style[srcPriIndex].length > 0) {

									styleString = styleString + 'src: ';

									for (var srcSecIndex in style[srcPriIndex]) {

										if (style[srcPriIndex].hasOwnProperty(srcSecIndex)) {

											var url = style[srcPriIndex][srcSecIndex].url,
												format = style[srcPriIndex][srcSecIndex].format;

											if (url) {

												styleString = styleString + 'url("' + utils.getAssetUrl(url) + '")';

												if (format) {

													styleString = styleString + ' format("' + format + '")';

												}

												if (srcSecIndex < (style[srcPriIndex].length - 1)) {

													styleString = styleString + ',';

												}

											}

										}

									}

									styleString = styleString + ';';

								}

							}

						}

					} else if (styleIndex === 'font-family') {

						styleString = styleString + styleIndex + ':' + '"' + style + '"' + ';';

					} else {

						styleString = styleString + styleIndex + ':' + style + ';';

					}

				}

			}

		}

		return styleString;
	};

	/**
	 * Takes first flat object and merge second flat object fields if they exist in the firs one into it. Ignores substructures.
	 *
	 * @function
	 * @param {Object} object1
	 * @param {Object} object2
	 * @param {Boolean} [mergeArrays]
	 * @param {Array} [replaceArrays]
	 * @return {Object}
	 */
	utils.mergeObjects = function (object1, object2, mergeArrays, replaceArrays) {
		for (var key in object2) {
			if (object2.hasOwnProperty(key)) {
				try {
					if (mergeArrays && utils.isArray(object2[key])) {
						object1[key] = utils.mergeArrays(object1[key], object2[key]);
					} else if (replaceArrays && utils.isArray(replaceArrays) && utils.arrayContains(replaceArrays, key)) {
						object1[key] = object2[key];
					} else if (utils.isObject(object2[key])) {
						object1[key] = utils.mergeObjects(object1[key], object2[key], mergeArrays, replaceArrays);
					} else {
						object1[key] = object2[key];
					}
				} catch (e) {
					object1[key] = object2[key];
				}
			}
		}

		return object1;
	};

	/**
	 * Extract excepts from data recursively.
	 *
	 * @function
	 * @param {Object} data - Data to be analysed.
	 * @param {Array} attrs - Exceptional attributes to fetch.
	 * @param {Array} [excludes] - Exclude object namespaces from parsing.
	 * @param {Number} [depth] - Indicate parsing depth.
	 * @param {String} [exceptIndex] - Indicate namespace of exception object.
	 * @return {Object|Array}
	 */
	utils.extractExceptions = function (data, attrs, excludes, depth, exceptIndex) {

		attrs = utils.isArray(attrs) ? attrs : [];
		exceptIndex = utils.isString(exceptIndex) ? exceptIndex : 'excepts';
		depth = utils.isNumber(depth) ? depth : 999;
		excludes = utils.isArray(excludes) ? excludes : [];

		try {
			if (utils.isObject(data)) {
				for (var objectIndex in data) {
					if (objectIndex === exceptIndex) {
						for (var objectKey in data[objectIndex]) {
							if (data[objectIndex].hasOwnProperty(objectKey)) {
								if (utils.arrayContains(attrs, objectKey)) {
									if (depth > 0 && !(utils.arrayContains(excludes, objectIndex))) {
										if (utils.isObject(data[objectIndex][objectKey])) {
											if (utils.isObject(data[objectIndex][objectKey].data)) {
												if (utils.isTypeOf(utils.isBoolean, data[objectIndex][objectKey].enabled, true)) {
													for (var dataKey in data[objectIndex][objectKey].data) {
														if (data[objectIndex][objectKey].data.hasOwnProperty(dataKey)) {
															if (data[objectIndex][objectKey].replace || !data[dataKey] || !utils.isObject(data[dataKey]) || utils.isArray(data[dataKey])) {
																data[objectIndex][dataKey] = data[dataKey] = utils.extractExceptions(data[objectIndex][objectKey].data[dataKey], attrs, excludes, (depth - 1), exceptIndex);
															} else {
																data[objectIndex][dataKey] = utils.mergeObjects(data[dataKey], utils.extractExceptions(data[objectIndex][objectKey].data[dataKey], attrs, excludes, (depth - 1), exceptIndex), data[objectIndex][objectKey].mergeArrays, data[objectIndex][objectKey].replaceArrays);
															}
														}
													}
												} else {
													delete data[objectIndex][objectKey];
												}
											} else if (data[objectIndex][objectKey].data !== null) {
												data[objectIndex] = utils.mergeObjects(data, utils.extractExceptions(data[objectIndex][objectKey], attrs, excludes, (depth - 1), exceptIndex));
											}
										} else {
											data[objectIndex] = data[objectIndex][objectKey];
										}
									}
								}
							}
						}
					} else if (utils.isObject(data[objectIndex])) {
						if (depth > 0 && !(utils.arrayContains(excludes, objectIndex))) {
							data[objectIndex] = utils.extractExceptions(data[objectIndex], attrs, excludes, (depth - 1), exceptIndex);
						}
					}
				}
				if (data[exceptIndex]) {
					delete data[exceptIndex];
				}
			}
		} catch (e) {
		}

		return data;
	};

	/**
	 * Wrap element into other DOM elements.
	 *
	 * @function
	 * @param {Array} data
	 * @return {Object}
	 */
	utils.wrapElement = function (data) {

		var

			/**
			 * Define tag.
			 * @type {(Element|Node)}
			 */
			initialTag = null,

			/**
			 * Define final tag.
			 * @type {(Element|Node)}
			 */
			latestTag = null;

		// Check is target has to be wrapped in HTML tag.
		if (utils.isArray(data) && data.length > 0) {

			// Loop all wrappers.
			for (var j = 0; j < data.length; j++) {

				// Check if tag is not empty.
				if (!utils.isEmptyString(data[j])) {

					var

						/**
						 * Create new tag.
						 * @type {(Element|Node)}
						 */
						newTag = document.createElement(data[j]);

					// Check if initial tag exists.
					if (utils.isElement(latestTag)) {

						// Append new tag to latest tag.
						latestTag.appendChild(newTag);

						// Set new tag as latest tag.
						latestTag = newTag;

					} else if (utils.isElement(initialTag)) {

						// Append new tag to initial tag.
						initialTag.appendChild(newTag);

						// Set new tag as latest tag.
						latestTag = newTag;

					} else {

						// Set new tag as initial and latest tag.
						initialTag = latestTag = newTag;

					}

				}

			}

		}

		return {

			/**
			 * @type {(Element|Node)}
			 */
			initial: initialTag,

			/**
			 * @type {(Element|Node)}
			 */
			latest: latestTag

		}
	};

	/**
	 * Replace macros in the object, array or string.
	 *
	 * @function
	 * @param {Object|Array|String} object - Object to be checked for macros.
	 * @param {Object} macros - Object with macros and values.
	 * @param {Array} [excludes] - Exclude object namespaces from parsing.
	 * @param {Boolean} [keys] - Replace keys.
	 * @param {Number} [depth] - Indicate parsing depth.
	 * @param {Array} [syntax] - Indicate macro syntax.
	 * @return {Object|Array|String}
	 */
	utils.replaceMacros = function (object, macros, excludes, keys, depth, syntax) {

		if (utils.isArray(macros)) {
			var tempMacros = {};
			for (var i in macros) {
				tempMacros = utils.mergeObjects(tempMacros, utils.cloneObject(macros[i]));
			}
			macros = tempMacros;
		}

		excludes = utils.isArray(excludes) ? excludes : [];
		keys = utils.isBoolean(keys) ? keys : true;
		depth = utils.isNumber(depth) ? depth : 999;
		syntax = utils.isArray(syntax) ? syntax : ['$[', ']'];

		function replace(object, key) {
			try {
				for (var i in macros) {
					object = object.toString().split(syntax[0] + i + syntax[1]).join(macros[i]);

					if (!key) {
						if (object === 'true') {
							object = true;
						}
						if (object === 'false') {
							object = false;
						}
						if (object === 'null') {
							object = null;
						}
					}
				}
			} catch (e) {
			}
			return object;
		}

		try {
			if (utils.isString(object)) {
				object = replace(object);
			} else if (utils.isObject(object)) {
				for (var key in object) {
					if (object.hasOwnProperty(key)) {
						if (utils.isString(object[key])) {
							object[key] = replace(object[key]);
							var temp = object[key], tempDif;
							for (var j = 0; j < 10; j++) {
								if (utils.isString(object[key]) && temp !== tempDif && object[key].indexOf(syntax[0]) !== -1 && object[key].indexOf(syntax[1]) !== -1) {
									object[key] = replace(object[key]);
									tempDif = object[key];
								} else {
									break;
								}
							}
						} else {
							if (depth > 0 && !(utils.arrayContains(excludes, key))) {
								object[key] = utils.replaceMacros(object[key], macros, excludes, keys, (depth - 1));
							}
							if (keys) {
								var newKey;
								if (key && key.indexOf(syntax[0]) !== -1 && key.indexOf(syntax[1]) !== -1) {
									newKey = replace(key, true);
								}
								if (newKey && newKey !== key) {
									object[newKey] = utils.cloneObject(object[key]);
									delete object[key];
								}
							}
						}
					}
				}
			}
		} catch (e) {
		}

		return object;
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} attribute
	 * @param {String} value
	 * @param {Array} [list]
	 * @description Cross-browser attribute.
	 */
	utils.setAttribute = function (target, attribute, value, list) {
		if (!target) {
			return;
		}
		var indexes = [''].concat((list ? list : []));
		for (var i in indexes) {
			try {
				target.setAttribute(indexes[i] + attribute, value);
			} catch (e) {
			}
		}
	};

	/**
	 * @function
	 * @param {(Element|Node)} target
	 * @param {String} attribute
	 * @param {Array} [list]
	 * @description Cross-browser attribute.
	 */
	utils.removeAttribute = function (target, attribute, list) {
		if (!target) {
			return;
		}
		var indexes = [''].concat((list ? list : []));
		for (var i in indexes) {
			try {
				target.removeAttribute(indexes[i] + attribute);
			} catch (e) {
			}
		}
	};

	// ref: http://stackoverflow.com/a/1293163/2343
	// This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.
	utils.CSVToArray = function (strData, strDelimiter) {

		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");

		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
		);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];

		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;


		// Keep looping overlay the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {

			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[1];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				strMatchedDelimiter !== strDelimiter
			) {

				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);

			}

			var strMatchedValue;

			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"),
					"\""
				);

			} else {

				// We found a non-quoted value.
				strMatchedValue = arrMatches[3];

			}


			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
		}

		// Return the parsed data.
		return (arrData);
	};

	// /**
	//  * @type {Object}
	//  * @description Encode and decode b64. http://www.webtoolkit.info/
	//  */
	// utils.base64 = {
	//
	// 	_keyStr: "ABCDEPCHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	//
	// 	/**
	// 	 * @function
	// 	 * @param {String} input
	// 	 */
	// 	encode: function (input) {
	// 		var output = '';
	// 		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	// 		var i      = 0;
	// 		input      = utils.base64._utf8_encode(input);
	// 		while (i < input.length) {
	// 			chr1 = input.charCodeAt(i++);
	// 			chr2 = input.charCodeAt(i++);
	// 			chr3 = input.charCodeAt(i++);
	// 			enc1 = chr1 >> 2;
	// 			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	// 			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	// 			enc4 = chr3 & 63;
	// 			if (isNaN(chr2)) {
	// 				enc3 = enc4 = 64;
	// 			}
	// 			else if (isNaN(chr3)) {
	// 				enc4 = 64;
	// 			}
	// 			output
	// 				= output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
	// 		}
	//
	// 		return output;
	// 	},
	//
	// 	/**
	// 	 * @function
	// 	 * @param {String} input
	// 	 */
	// 	decode: function (input) {
	// 		var output = '';
	// 		var chr1, chr2, chr3;
	// 		var enc1, enc2, enc3, enc4;
	// 		var i      = 0;
	// 		input      = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
	// 		while (i < input.length) {
	// 			enc1   = this._keyStr.indexOf(input.charAt(i++));
	// 			enc2   = this._keyStr.indexOf(input.charAt(i++));
	// 			enc3   = this._keyStr.indexOf(input.charAt(i++));
	// 			enc4   = this._keyStr.indexOf(input.charAt(i++));
	// 			chr1   = (enc1 << 2) | (enc2 >> 4);
	// 			chr2   = ((enc2 & 15) << 4) | (enc3 >> 2);
	// 			chr3   = ((enc3 & 3) << 6) | enc4;
	// 			output = output + String.fromCharCode(chr1);
	// 			if (enc3 != 64) {
	// 				output = output + String.fromCharCode(chr2);
	// 			}
	// 			if (enc4 != 64) {
	// 				output = output + String.fromCharCode(chr3);
	// 			}
	// 		}
	// 		output = utils.base64._utf8_decode(output);
	//
	// 		return output;
	// 	},
	//
	// 	/**
	// 	 * @function
	// 	 * @param {String} string
	// 	 */
	// 	_utf8_encode: function (string) {
	// 		string      = string.replace(/\r\n/g, "\n");
	// 		var utftext = '';
	// 		for (var n = 0; n < string.length; n++) {
	// 			var c = string.charCodeAt(n);
	// 			if (c < 128) {
	// 				utftext += String.fromCharCode(c);
	// 			}
	// 			else if ((c > 127) && (c < 2048)) {
	// 				utftext += String.fromCharCode((c >> 6) | 192);
	// 				utftext += String.fromCharCode((c & 63) | 128);
	// 			}
	// 			else {
	// 				utftext += String.fromCharCode((c >> 12) | 224);
	// 				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	// 				utftext += String.fromCharCode((c & 63) | 128);
	// 			}
	// 		}
	//
	// 		return utftext;
	// 	},
	//
	// 	/**
	// 	 * @function
	// 	 * @param {String} utftext
	// 	 */
	// 	_utf8_decode: function (utftext) {
	// 		var string = '';
	// 		var i      = 0;
	// 		var c, c1, c2, c3;
	// 		c          = c1 = c2 = 0;
	// 		while (i < utftext.length) {
	// 			c = utftext.charCodeAt(i);
	// 			if (c < 128) {
	// 				string += String.fromCharCode(c);
	// 				i++;
	// 			}
	// 			else if ((c > 191) && (c < 224)) {
	// 				c2 = utftext.charCodeAt(i + 1);
	// 				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	// 				i += 2;
	// 			}
	// 			else {
	// 				c2 = utftext.charCodeAt(i + 1);
	// 				c3 = utftext.charCodeAt(i + 2);
	// 				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	// 				i += 3;
	// 			}
	// 		}
	//
	// 		return string;
	// 	}
	//
	// };

	/**
	 * @constructor
	 * @param {Element|Node} target
	 * @param {Object} callback
	 * @param {Object} [params]
	 * @return {Object}
	 */
	utils.GestureListener = function (target, callback, params) {

		/**
		 * @type {Element|Node}
		 */
		this.target = utils.isTypeOf(utils.isElement, target, (target === document ? document : null));

		/**
		 * @type {Function}
		 */
		this.callback = utils.isTypeOf(utils.isFunction, callback, null);

		/**
		 * @type {Object}
		 */
		this.params = {

			/**
			 * @type {Boolean}
			 */
			prevent: utils.isTypeOf(utils.isBoolean, utils.getObjectDeep(params, 'prevent'), true),

			/**
			 * @type {Boolean}
			 */
			delay: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(params, 'delay'), 0)

		};

		/**
		 * @type {Object}
		 */
		this.events = {};

		/**
		 * @type {Event}
		 */
		this.startEvent = null;

		var

			/**
			 * @type {tactic.utils.GestureListener}
			 */
			that = this;

		var

			/**
			 * @type {Function}
			 * @param {String} type
			 * @param {Event} event
			 */
			triggerCallback = function (type, event) {

				// Trigger callback.
				that.callback(type, event, that.startEvent);

			},

			/**
			 * @type {Function}
			 * @param {Event} event
			 */
			clickHandler = function (event) {

				// Trigger event.
				triggerCallback('click', event);

				// if (that.params.prevent) {
				//     return false;
				// }
			},

			/**
			 * @type {Function}
			 * @param {Event} event
			 */
			startHandler = function (event) {

				event = event || window.event;

				if (event.changedTouches) {
					event = event.changedTouches[0];
				}

				that.startEvent = event;

				that.events.mousemove = utils.addEventSimple(that.target, 'mousemove', moveHandler);
				that.events.touchmove = utils.addEventSimple(that.target, 'touchmove', moveHandler);
				that.events.mouseup = utils.addEventSimple(that.target, 'mouseup', stopHandler);
				that.events.mouseout = utils.addEventSimple(that.target, 'mouseout', stopHandler);
				that.events.touchend = utils.addEventSimple(that.target, 'touchend', stopHandler);
				that.events.touchcancel = utils.addEventSimple(that.target, 'touchcancel', stopHandler);
				that.events.click = utils.addEventSimple(that.target, 'click', clickHandler);

				// Trigger callback.
				triggerCallback('start', event);

				if (that.params.prevent) {
					return false;
				}
			},

			/**
			 * @type {Function}
			 * @param {Event} event
			 */
			moveHandler = function (event) {

				// Remove click event.
				that.events.click = utils.removeEventSimple(that.target, 'click', clickHandler);

				// Trigger event.
				triggerCallback('move', event);

				if (that.params.prevent) {
					return false;
				}
			},

			/**
			 * @type {Function}
			 * @param {Event} event
			 */
			stopHandler = function (event) {

				that.events.mousemove = utils.removeEventSimple(that.target, 'mousemove', moveHandler);
				that.events.touchmove = utils.removeEventSimple(that.target, 'touchmove', moveHandler);
				that.events.mouseup = utils.removeEventSimple(that.target, 'mouseup', stopHandler);
				that.events.mouseout = utils.removeEventSimple(that.target, 'mouseout', stopHandler);
				that.events.touchend = utils.removeEventSimple(that.target, 'touchend', stopHandler);
				that.events.touchcancel = utils.removeEventSimple(that.target, 'touchcancel', stopHandler);

				// Trigger callback.
				triggerCallback('stop', event);

				if (that.params.prevent) {
					return false;
				}
			};

		if (that.target && that.callback) {
			that.events.mousedown = utils.addEventSimple(that.target, 'mousedown', startHandler);
			that.events.touchstart = utils.addEventSimple(that.target, 'touchstart', startHandler);
		}

		return that;
	};

	var

		// Lend TACTIC property namespace.
		props = tactic.builder.props;

	/**
	 * Abstract layer constructor.
	 *
	 * @constructor
	 */
	props.AbstractProp = function () {

		/**
		 * @type {String}
		 */
		this.type = 'AbstractProp';

	};

	/**
	 * Set property.
	 *
	 * @function
	 * @param {Object} data - Property data.
	 */
	props.AbstractProp.prototype.set = function (data) {

		// Validate data object.
		this.data = utils.isTypeOf(utils.isObject, data, {});

		/**
		 * @type {Boolean}
		 */
		this.enabled = utils.isTypeOf(utils.isBoolean, this.data.enabled, true);

		/**
		 * @type {String}
		 */
		this.name = utils.isTypeOf(utils.isString, this.data.name, this.name);

		/**
		 * @type {(String|Number)}
		 */
		this.value = (this.data.value || undefined);

	};

	/**
	 * Update property.
	 *
	 * @function
	 */
	props.AbstractProp.prototype.update = function () {
		return true;
	};

	/**
	 * Position property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.DomainProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'DomainProp';

		/**
		 * @type {String}
		 */
		this.name = 'domain';

		// Set property defaults.
		this.set(data);

	};
	props.DomainProp.prototype = new props.AbstractProp();
	props.DomainProp.prototype.constructor = props.DomainProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {String} value
	 * @return {Boolean}
	 */
	props.DomainProp.prototype.update = function (value) {

		var

			/**
			 * @type {tactic.builder.props.DomainProp}
			 */
			that = this;

		// Validate value;
		if (that.enabled && utils.isString(value)) {

			// Set value.
			that.value = utils.extractRootDomain(value);

			return true;
		}

		return false;
	};

	/**
	 * Position property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.FontProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'FontProp';

		/**
		 * @type {String}
		 */
		this.name = 'font';

		// Set property defaults.
		this.set(data);

		/**
		 * @type {Number}
		 */
		this.step = utils.isTypeOf(utils.isNumber, this.data.step, 1);

		/**
		 * @type {Number}
		 */
		this.min = utils.isTypeOf(utils.isNumber, this.data.min, 2);

		/**
		 * @type {Number}
		 */
		this.max = utils.isTypeOf(utils.isNumber, this.data.max, 32);

	};
	props.FontProp.prototype = new props.AbstractProp();
	props.FontProp.prototype.constructor = props.FontProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {(Element|Node)} target - Element target.
	 * @param {Number} width - Element width.
	 * @param {Number} height - Element height.
	 * @return {Boolean}
	 */
	props.FontProp.prototype.update = function (target, width, height) {

		var

			/**
			 * @type {tactic.builder.props.FontProp}
			 */
			that = this;

		if (that.enabled && utils.isElement(target) && !isNaN(width) && !isNaN(height)) {

			var

				initialSize = parseInt(utils.getStyle(target, 'fontSize', NaN)),

				/**
				 * @function
				 * @param {Number} size
				 * @return {Number}
				 */
				analyseSize = function (size) {

					if (size > that.min) {

						if (target.offsetWidth > width || target.offsetHeight > height) {

							// Reduce size value;
							size = size - 1;

							// Set new fontSize value on target.
							target.style.fontSize = size + 'px';

							// Check size again.
							size = analyseSize(size);

						}

					}

					return size;
				};

			// Hide target.
			target.style.visibility = 'hidden';

			// Analyse the most optimal font size, use current font size as default maximum value.
			that.value = analyseSize(isNaN(initialSize) ? that.max : initialSize);

			// Reset target font size.
			// target.style.fontSize = isNaN(initialSize) ? '' : initialSize + 'px';
			target.style.fontSize = '';

			// Set initial visibility.
			target.style.visibility = '';

			return true;
		}

		return false;
	};

	/**
	 * Position property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.ModeProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'ModeProp';

		/**
		 * @type {String}
		 */
		this.name = 'mode';

		// Set property defaults.
		this.set(data);

		/**
		 * @type {Array}
		 */
		this.options = utils.isTypeOf(utils.isArray, this.data.options, [
			'live', 'capture', 'debug'
		]);

	};
	props.ModeProp.prototype = new props.AbstractProp();
	props.ModeProp.prototype.constructor = props.ModeProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {String} value
	 * @return {Boolean}
	 */
	props.ModeProp.prototype.update = function (value) {

		var

			/**
			 * @type {tactic.builder.props.ModeProp}
			 */
			that = this;

		// Validate value;
		if (that.enabled && utils.isString(value) && utils.arrayContains(that.options, value)) {

			// Set value.
			that.value = value;

			return true;
		}

		return false;
	};

	/**
	 * Position property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.NameProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'NameProp';

		/**
		 * @type {String}
		 */
		this.name = 'name';

		// Set property defaults.
		this.set(data);

	};
	props.NameProp.prototype = new props.AbstractProp();
	props.NameProp.prototype.constructor = props.NameProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {String} value
	 * @return {Boolean}
	 */
	props.NameProp.prototype.update = function (value) {

		var

			/**
			 * @type {tactic.builder.props.NameProp}
			 */
			that = this;

		// Validate value;
		if (that.enabled && utils.isString(value)) {

			// Set value.
			that.value = value;

			return true;
		}

		return false;
	};

	/**
	 * Position property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.PositionProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'PositionProp';

		/**
		 * @type {String}
		 */
		this.name = 'position';

		// Set property defaults.
		this.set(data);

		/**
		 * @type {Number}
		 */
		this.top = NaN;

		/**
		 * @type {Number}
		 */
		this.left = NaN;

		/**
		 * @type {Number}
		 */
		this.width = NaN;

		/**
		 * @type {Number}
		 */
		this.height = NaN;

		/**
		 * @type {Object}
		 */
		this.params = null;

	};
	props.PositionProp.prototype = new props.AbstractProp();
	props.PositionProp.prototype.constructor = props.PositionProp;

	/**
	 * Update property.
	 * Updates target scale depending on wrapper dimensions and placement parameters.
	 *
	 * @function
	 * @param {Number} targetWidth
	 * @param {Number} targetHeight
	 * @param {Number} wrapperWidth
	 * @param {Number} wrapperHeight
	 * @param {Object} [params]
	 * @return {Boolean}
	 */
	props.PositionProp.prototype.update = function (targetWidth, targetHeight, wrapperWidth, wrapperHeight, params) {

		var

			/**
			 * @type {tactic.builder.props.PositionProp}
			 */
			that = this;

		// Check if all required parameters are in place.
		if (that.enabled && !isNaN(targetWidth) && !isNaN(targetHeight) && !isNaN(wrapperWidth) && !isNaN(wrapperHeight)) {

			// Validate parameters.
			that.params = utils.isTypeOf(utils.isObject, params, {});

			// Validate parameter values.
			that.params = {

				/**
				 * @type {Array}
				 */
				align: utils.isTypeOf(utils.isArray, that.params.align, ['center', 'middle']),

				/**
				 * @type {String}
				 */
				scale: utils.isTypeOf(utils.isString, that.params.scale, 'fill'),

				/**
				 * @type {Array}
				 */
				crop: utils.isTypeOf(utils.isArray, that.params.crop, [0, 0, 0, 0]),

				/**
				 * @type {Array}
				 */
				offset: utils.isTypeOf(utils.isArray, that.params.offset, [1, 1])

			};

			// Update offset position from top.
			that.params.offset[1] = (1 - (targetWidth * (that.params.crop[1] + that.params.crop[3])) / targetWidth);

			// Update offset position left side.
			that.params.offset[0] = (1 - (targetHeight * (that.params.crop[0] + that.params.crop[2])) / targetHeight);

			var

				/**
				 * @type {Number}
				 */
				width = NaN,

				/**
				 * @type {Number}
				 */
				height = NaN,

				/**
				 * @type {Number}
				 */
				left = NaN,

				/**
				 * @type {Number}
				 */
				top = NaN;

			try {

				// Check if wrapper has landscape orientation.
				if (wrapperWidth >= wrapperHeight) {

					height = (wrapperWidth / targetWidth * targetHeight) / that.params.offset[1];
					width = wrapperWidth / that.params.offset[1];

					// Check if target element has to fill wrapper area.
					if (that.params.scale === 'fill') {

						// Check if target element is landscape.
						if (wrapperHeight / that.params.offset[0] > height) {

							width = (wrapperHeight / targetHeight * targetWidth) / that.params.offset[0];
							height = wrapperHeight / that.params.offset[0];

						}

					}

					// In case if target element has to fit wrapper area.
					else {

						// Check if target element is portrait.
						if (wrapperHeight / that.params.offset[0] <= height) {

							width = (wrapperHeight / targetHeight * targetWidth) / that.params.offset[0];
							height = wrapperHeight / that.params.offset[0];

						}

					}

				}

				// In case if wrapper has portrait orientation.
				else {

					width = (wrapperHeight / targetHeight * targetWidth) / that.params.offset[0];
					height = wrapperHeight / that.params.offset[0];

					// Check if target element has to fill wrapper area.
					if (that.params.scale === 'fill') {

						// Check if target element is portrait.
						if (wrapperWidth / that.params.offset[1] > width) {

							height = (wrapperWidth / targetWidth * targetHeight) / that.params.offset[1];
							width = wrapperWidth / that.params.offset[1];

						}

					}

					// In case if target element has to fit wrapper area.
					else {

						// Check if target element is landscape.
						if (wrapperWidth / that.params.offset[1] <= width) {

							height = (wrapperWidth / targetWidth * targetHeight) / that.params.offset[1];
							width = wrapperWidth / that.params.offset[1];

						}

					}

				}

				// Round values.
				width = Math.ceil(width);
				height = Math.ceil(height);

				// Update horizontal position.
				switch (that.params.align[0]) {

					case 'left':

						left = (0 - width * that.params.crop[3]);

						break;

					case 'center':

						left = ((wrapperWidth - width * that.params.offset[1]) / 2) + (0 - width * that.params.crop[3]);

						break;

					case 'right':

						left = (wrapperWidth - width + width * that.params.crop[1]);

						break;
				}

				// Round value.
				left = Math.round(left);

				// Update vertical position.
				switch (that.params.align[1]) {

					case 'top':

						top = (0 - height * that.params.crop[0]);

						break;

					case 'middle':

						top = ((wrapperHeight - height * that.params.offset[0]) / 2) + (0 - height * that.params.crop[0]);

						break;

					case 'bottom':

						top = (wrapperHeight - height + height * that.params.crop[2]);

						break;
				}

				// Round value.
				top = Math.round(top);

			} catch (e) {
			}

			// Assign updated values.
			that.top = top;
			that.left = left;
			that.width = width;
			that.height = height;

			return true;
		}

		return false;
	};

	/**
	 * Scale property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.ScaleProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'ScaleProp';

		/**
		 * @type {String}
		 */
		this.name = 'scale';

		// Set property defaults.
		this.set(data);

		/**
		 * Validate scaling minimum area.
		 * This is object square area, starting point for calculation.
		 *
		 * @type  {Object}
		 */
		this.area = {

			/**
			 * @type  {Number}
			 */
			param: utils.isTypeOf(utils.isNumber, this.data.area, 24000),

			/**
			 * @type  {Number}
			 */
			value: NaN

		};

		/**
		 * Validate tension velocity for wide and tall object tensions separately.
		 * This is progressive velocity value. Higher number will result in higher progression (negative respectively).
		 *
		 * @type  {Object}
		 */
		this.velocity = {

			/**
			 * @type  {Number}
			 */
			param: utils.isTypeOf(utils.isNumber, this.data.velocity, 0),

			/**
			 * @type  {Number}
			 */
			value: NaN

		};

		/**
		 * Validate scaling minimum font size.
		 * This is minimum object step in pixels. Scale values won't be smaller than this.
		 *
		 * @type  {Object}
		 */
		this.font = {

			/**
			 * @type  {Number}
			 */
			param: utils.isTypeOf(utils.isNumber, this.data.font, 4),

			/**
			 * @type  {Number}
			 */
			value: NaN

		};

		/**
		 * Validate scale options to select from.
		 *
		 * @type {Array}
		 */
		this.options = utils.isTypeOf(utils.isArray, this.data.options, [
			[
				0,
				"xs",
				0
			],
			[
				32000,
				"s",
				0
			],
			[
				64000,
				"m",
				0
			],
			[
				256000,
				"l",
				0
			]
		]);

	};

	props.ScaleProp.prototype = new props.AbstractProp();
	props.ScaleProp.prototype.constructor = props.ScaleProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {Number} width
	 * @param {Number} height
	 * @return {Boolean}
	 */
	props.ScaleProp.prototype.update = function (width, height) {

		var

			/**
			 * @type {tactic.builder.props.ScaleProp}
			 */
			that = this;

		// Validate parameters.
		if (that.enabled && !isNaN(width) && !isNaN(height)) {

			// Update area size.
			that.area.value = width * height;

			// Update velocity value.
			that.velocity.value = Math.sqrt(that.area.value / that.area.param);
			that.velocity.value = that.velocity.value + (that.velocity.value * that.velocity.param / 10);
			that.velocity.value  = that.velocity.value < 1 ? 1 : that.velocity.value;

			// Select scale property from available options.
			that.value = utils.selectProperty(that.options, that.area.value);

			var

				/**
				 * @type {Number}
				 */
				scale = 1;

			// Loop all options.
			for (var option_index in that.options) {

				var

					/**
					 * @type {Array}
					 */
					option = that.options[option_index];

				// Check if option matches scale value.
				if (option[1] === that.value) {

					// Calculate scale depending on parameters.
					scale = utils.isTypeOf(utils.isNumber, (1 + (option[2] / 20)), 1);

					break;
				}

			}

			// Update font size value.
			that.font.value = Math.round(that.font.param * that.velocity.value * scale);

			return true;
		}

		return false;
	};

	/**
	 * Size property constructor.
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.SizeProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'SizeProp';

		/**
		 * @type {String}
		 */
		this.name = 'size';

		// Set property defaults.
		this.set(data);

		/**
		 * @type {Number}
		 */
		this.width = NaN;

		/**
		 * @type {Number}
		 */
		this.height = NaN;

	};
	props.SizeProp.prototype = new props.AbstractProp();
	props.SizeProp.prototype.constructor = props.SizeProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {(Number|String)} width
	 * @param {(Number|String)} height
	 * @return {Boolean}
	 */
	props.SizeProp.prototype.update = function (width, height) {

		var

			/**
			 * @type {tactic.builder.props.SizeProp}
			 */
			that = this;

		// Check if enabled.
		if (that.enabled) {

			var

				/**
				 * @function
				 * @param {(Number|String)} value
				 * @return {Number}
				 */
				analyse = function (value) {

					// Check if value is string and percent.
					if (utils.isString(value) && value.substr(value.length - 1) === '%') {

						// Convert percent to number.
						value = Number(value.substr(0, value.length - 1)) / 100;

					}

					return value;
				};

			// Check width fer percentage.
			width = analyse(width);

			// Check height fer percentage.
			height = analyse(height);

			// Validate parameters.
			if (!isNaN(width) && !isNaN(height)) {

				// Set width.
				that.width = width;

				// Set height.
				that.height = height;

				// Set value.
				that.value = width + 'x' + height;

				return true;
			}

		}

		return false;
	};

	/**
	 * Tension property constructor (combined with depricated OrientationProp).
	 *
	 * @constructor
	 * @param {Object} data - Property data.
	 */
	props.TensionProp = function (data) {

		/**
		 * @type {String}
		 */
		this.type = 'TensionProp';

		/**
		 * @type {String}
		 */
		this.name = 'tension';

		// Set property defaults.
		this.set(data);

		/**
		 * Validate tension velocity for wide and tall object tensions separately.
		 * This is progressive velocity value. Higher number will result in higher progression (negative respectively).
		 *
		 * @type  {Object}
		 */
		this.velocity = {

			/**
			 * Validate taller tension velocity.
			 *
			 * @type  {Number}
			 */
			taller: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(this.data, 'velocity.taller'), 0),

			/**
			 * Validate wider tension velocity.
			 *
			 * @type  {Number}
			 */
			wider: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(this.data, 'velocity.wider'), 0),

			/**
			 * @type  {Number}
			 */
			value: NaN

		};

		/**
		 * Validate tension options to select from.
		 *
		 * @type {Array}
		 */
		this.options = utils.isTypeOf(utils.isArray, this.data.options, [
			[0, 'p'],
			[0.714, 's'],
			[1.5, 'l']
		]);

	};
	props.TensionProp.prototype = new props.AbstractProp();
	props.TensionProp.prototype.constructor = props.TensionProp;

	/**
	 * Update property.
	 *
	 * @function
	 * @param {Number} width
	 * @param {Number} height
	 * @return {Boolean}
	 */
	props.TensionProp.prototype.update = function (width, height) {

		var

			/**
			 * @type {tactic.builder.props.TensionProp}
			 */
			that = this;

		// Validate parameters.
		if (that.enabled && !isNaN(width) && !isNaN(height)) {

			// Update velocity value.
			that.velocity.value = (((width >= height) ? (width / height) : (height / width)) - 1) * (width >= height ? that.velocity.wider
				: that.velocity.taller * 10) / 100;

			// Select tension property from available options.
			that.value = utils.selectProperty(that.options, (width / height));

			return true;
		}

		return false;
	};

	var

		// Lend TACTIC property namespace.
		layers = tactic.builder.layers;

	/**
	 * Abstract layer constructor.
	 *
	 * @constructor
	 */
	layers.AbstractLayer = function () {

		/**
		 * @type {String}
		 */
		this.type = 'AbstractLayer';

	};

	/**
	 * Set layer instance.
	 *
	 * @function
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @param {Object} [override] - Component parameters.
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.AbstractLayer.prototype.set = function (key, data, callback, parent, override, index) {

		// Validate parameters.
		override = utils.isTypeOf(utils.isObject, override, {});

		/**
		 * @type {Number}
		 */
		this.timestamp = (new Date()).getTime();

		/**
		 * @type {Object}
		 */
		this.data = utils.isTypeOf(utils.isObject, utils.cloneObject(data), {});

		/**
		 * @type {Function}
		 */
		this.callback = utils.isTypeOf(utils.isFunction, callback, utils.noop);

		/**
		 * @type {Object}
		 */
		this.parent = utils.isTypeOf(utils.isObject, parent, null);

		/**
		 * @type {tactic.builder.layers.BannerLayer}
		 */
		this.root = this.root ? this.root : this.parent ? this.parent.root : undefined;

		/**
		 * @type {Object}
		 */
		this.timeline = this.root.timeline ? this.root.timeline : new utils.Timeline();

		/**
		 * @type {Object}
		 */
		this.registry = this.parent ? this.parent.registry : {};

		/**
		 * @type {tactic.builder.layers.SequenceLayer}
		 */
		this.sequence = (this.sequence || ((this.parent && this.parent.sequence) ? this.parent.sequence : null));

		/**
		 * @type {Number}
		 */
		this.index = utils.isTypeOf(utils.isNumber, index, NaN);

		/**
		 * @type {Number}
		 */
		this.frame = NaN;

		// Check if parent layer exists.
		if (this.parent) {

			// Check if layer is not a frame.
			if (this.type === 'FrameLayer') {

				// Set frame number.
				this.frame = utils.isTypeOf(utils.isNumber, index, 0);

				// Push element to parent frame registry.
				this.parent.frames.push(this);

			} else {

				// Set frame number.
				this.frame = this.parent.frame;

				// Push element to parent layer registry.
				this.parent.layers.push(this);

			}

		}

		/**
		 * @type {String}
		 */
		this.key = utils.isTypeOf(utils.isString, key, 'UNDEFINED');

		/**
		 * @type {String}
		 */
		this.namespace = (this.parent ? this.parent.namespace ? this.parent.namespace + '.' : '' : '') + this.key;

		/**
		 * @type {String}
		 */
		this.selector = (this.parent ? this.parent.selector ? this.parent.selector + ' ' : '' : '') + '[data-key=' + this.key + ']';

		// Add layer to creative registry using namespace as key.
		this.registry[this.namespace] = this;

		/**
		 * @type {Element}
		 */
		this.target = override.target ? override.target : this.getTarget(this.key);

		// Check if target was not found and layer is root layer.
		if (!this.target && this.root === this) {

			// Set target as document body.
			this.target = document.body;

		}

		// Check if target was not found and has to be created if not found in DOM.
		else if (!this.target && this.data.create) {

			// Create new DOM element.
			this.target = document.createElement('div');

			// Set layer zIndex style.
			this.target.style.zIndex = utils.isTypeOf(utils.isNumber, this.data.index, '');

			// Set layer key.
			this.target.setAttribute('data-key', this.key);

			// Check if parent layer exists.
			if (this.parent && this.parent.target) {

				// Add layer target to parent layer target.
				this.parent.target.appendChild(this.target);

			}

			// In case if there is no parent target.
			else {

				// Append layer to body.
				document.body.appendChild(this.target);

			}

		}

		/**
		 * @type {Object}
		 */
		this.events = {};

		/**
		 * @type {Object}
		 */
		this.gestures = {};

		/**
		 * @type {Object}
		 */
		this.timers = {};

		/**
		 * @type {Array}
		 */
		this.layers = [];

		/**
		 * @type {Array}
		 */
		this.logs = [];

		/**
		 * @type {Object}
		 */
		this.macros = {

			/**
			 * @type {Object}
			 */
			local: {},

			/**
			 * @type {Object}
			 */
			global: {}

		};

		/**
		 * @type {Object}
		 */
		this.props = {};

		/**
		 * @type {Object}
		 */
		this.params = {};

		/**
		 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
		 */
		this.holder = this;

		/**
		 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
		 */
		this.wrapper = this.holder;

		/**
		 * Native layer attributes (generated by data "attrs").
		 *
		 * @type {Object}
		 */
		this.attrs = {

			/**
			 * @type {Array}
			 */
			local: [],

			/**
			 * @type {Array}
			 */
			global: [],

			/**
			 * @type {Array}
			 */
			hidden: [],

			/**
			 * @type {Object}
			 */
			styles: {}

		};

		/**
		 * Layer animations.
		 *
		 * @type {Object}
		 */
		this.anims = {};

		/**
		 * @type {Array}
		 */
		this.sources = [];

		/**
		 * @type {Object}
		 */
		this.feed = {};

		/**
		 * @type {Object}
		 */
		this.custom = {};

		/**
		 * @type {Function}
		 * @return Number
		 */
		this.width = function () {
			return utils.isTypeOf(utils.isNumber, override.width, this.target.offsetWidth);
		};

		/**
		 * @type {Function}
		 * @return Number
		 */
		this.height = function () {
			return utils.isTypeOf(utils.isNumber, override.height, this.target.offsetHeight);
		};

		/**
		 * @type {Boolean}
		 */
		this.inited = undefined;

		/**
		 * @type {Boolean}
		 */
		this.enabled = undefined;

		/**
		 * @type {Boolean}
		 */
		this.loaded = undefined;

		/**
		 * @type {Boolean}
		 */
		this.entered = undefined;

		/**
		 * @type {Boolean}
		 */
		this.hash = undefined;

	};

	/**
	 * Initialise layer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.init = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited && that.target) {

			var

				/**
				 * @type {Array}
				 */
				attrs = that.getAttrs(),

				/**
				 * @type {Object}
				 */
				macros = that.getMacros();

			var

				/**
				 * Clone initial data as we'll need original on destroy and secondary init.
				 * Exclude some attributes, as those will be extracted later depending on local attributes.
				 *
				 * @type {Object}
				 */
				data = utils.extractExceptions(utils.cloneObject(that.data), attrs, ['fonts', 'macros', 'params', 'attrs', 'anims', 'sources', 'custom']);

			// Delete layers and frames from actual data as we don't need that scope.
			delete (data.layers);
			delete (data.frames);

			// Check if layer is enabled.
			that.enabled = that.parent ? that.parent.enabled ? utils.isTypeOf(utils.isBoolean, data.enabled, true) : false : true;

			// Check if layer is enabled.
			if (that.enabled) {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'enabled'

				});

				// Initialise macros.
				that.initMacros(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.macros, {}), macros), attrs));

				// Update macro object as new macros were probably added to layer from data.
				macros = that.getMacros();

				// Initialise properties.
				that.initProps(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.props, {}), macros), attrs));

				// Update macro object as new macros were probably added to layer by parameters.
				macros = that.getMacros();

				// Initialise attributes.
				that.initAttrs(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.attrs, {}), macros), attrs));

				// Update attribute object as new values were probably added to layer by attribute data.
				attrs = that.getAttrs();

				// Initialise parameters.
				that.initParams(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.params, {}), macros), attrs));

				// Initialise feed.
				that.initFeed(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.feed, {}), macros), attrs));

				// Initialise sources.
				that.initSources(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.sources, {}), macros), attrs));

				// Initialise custom parameters.
				that.initCustom(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.custom, {}), macros), attrs));

				// Find layer holder (based on parameters).
				that.initHolder(that.params.holder);

				// Find layer wrapper (based on parameters).
				that.initWrapper(that.params.wrapper);

				// Initialise custom animations.
				that.initAnims(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.anims, {}), macros), attrs));

			} else {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'disabled'

				});

			}

			// Indicate that layer is initialised.
			that.inited = true;

			// Pause is required to give time to DOM elements to append.
			that.timers.init = that.timeline.setTimeout(function () {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'init'

				});

			}, 0);

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer holder.
	 *
	 * @function
	 * @param {String} key
	 * @param {Number} [depth]
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initHolder = function (key, depth) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Find layer holder (based on parameters).
			that.holder = utils.isTypeOf(utils.isObject, that.getLayer(that.params.holder, that.params.depth), that);

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer wrapper.
	 *
	 * @function
	 * @param {String} key
	 * @param {Number} [depth]
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initWrapper = function (key, depth) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Find layer holder (based on parameters).
			that.wrapper = utils.isTypeOf(utils.isObject, that.getLayer(that.params.wrapper, that.params.depth), (that.holder ? that.holder : that));

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer macros.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initMacros = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate data.
			// Replace inherited macros in macro object and add those to layer.
			// NB! Macro replacement utility may reduce banner performance, use this feature wisely.
			return that.addMacros(data);
		}

		return false;
	};

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initProps = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Set parameters.
			that.props = {};

			// Check if scale properties are provided.
			if (data.size) {

				// Create new scale property.
				that.props.size = new props.SizeProp(data.size);

				// Initialise scale property.
				that.props.size.update(that.width(), that.height());

				// Check if property is enabled.
				if (that.props.size.enabled) {

					var

						/**
						 * @type {String}
						 */
						size_name = (utils.isEmptyString(that.props.size.name) ? '' : that.props.size.name + '_') + that.props.size.value;

					// // Add param macros.
					// // NB! Macro replacement utility may reduce banner performance, use this feature wisely.
					// that.addMacro(name, {
					//
					// 	/**
					// 	 * Validate if global.
					// 	 * @type  {String}
					// 	 */
					// 	global: true,
					//
					// 	/**
					// 	 * @type {String}
					// 	 */
					// 	value: that.props.scale.value
					//
					// });

					// Add attribute.
					that.addAttr(that.props.size.name, {

						/**
						 * @type {String}
						 */
						name: size_name,

						/**
						 * Validate if global.
						 * @type  {Boolean}
						 */
						global: true

					});

				}

			}

			// Check if scale properties are provided.
			if (data.scale) {

				// Create new scale property.
				that.props.scale = new props.ScaleProp(data.scale);

				// Initialise scale property.
				that.props.scale.update(that.width(), that.height());

				// Check if property is enabled.
				if (that.props.scale.enabled) {

					var

						/**
						 * @type {String}
						 */
						scale_name = (utils.isEmptyString(that.props.scale.name) ? '' : that.props.scale.name + '_') + that.props.scale.value;

					// // Add param macros.
					// // NB! Macro replacement utility may reduce banner performance, use this feature wisely.
					// that.addMacro(name, {
					//
					// 	/**
					// 	 * Validate if global.
					// 	 * @type  {String}
					// 	 */
					// 	global: true,
					//
					// 	/**
					// 	 * @type {String}
					// 	 */
					// 	value: that.props.scale.value
					//
					// });

					// Add attribute.
					that.addAttr(that.props.scale.name, {

						/**
						 * @type {String}
						 */
						name: scale_name,

						/**
						 * Validate if global.
						 * @type  {Boolean}
						 */
						global: true

					});

					// Check if font scale is updated.
					if (that.props.scale.font.value > 0) {

						// Add font size attribute.
						that.addAttr(scale_name + '_font', {

							/**
							 * @type {Object}
							 */
							css: {

								/**
								 * @type {String}
								 */
								'font-size': that.props.scale.font.value + 'px'

							}

						});

					}

				}

			}

			// Check if tension properties are provided.
			if (data.tension) {

				// Create new tension property.
				that.props.tension = new props.TensionProp(data.tension);

				// Initialise tension property.
				that.props.tension.update(that.width(), that.height());

				// Check if property is enabled.
				if (that.props.tension.enabled) {

					var

						/**
						 * @type {String}
						 */
						tension_name = (utils.isEmptyString(that.props.tension.name) ? '' : that.props.tension.name + '_') + that.props.tension.value;

					// // Add param macros.
					// // NB! Macro replacement utility may reduce banner performance, use this feature wisely.
					// that.addMacro(name, {
					//
					// 	/**
					// 	 * Validate if global.
					// 	 * @type  {Boolean}
					// 	 */
					// 	global: true,
					//
					// 	/**
					// 	 * @type {String}
					// 	 */
					// 	value: that.props.tension.value
					//
					// });

					// Add attribute.
					that.addAttr(tension_name, {

						/**
						 * @type {String}
						 */
						name: tension_name,

						/**
						 * Validate if global.
						 * @type  {Boolean}
						 */
						global: true

					});

				}

			}

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Set parameters.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5)

			};

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer attributes.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initAttrs = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Add global attributes to layer.
			return that.addAttrs(data);
		}

		return false;
	};

	/**
	 * Initialise layer animations.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initAnims = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Add global attributes to layer.
			return that.addAnims(data);
		}

		return false;
	};

	/**
	 * Initialise layer sources.
	 *
	 * @function
	 * @param {Array} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initSources = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Check target and data.
			if (utils.isArray(data) && data.length > 0) {

				// Set sources.
				that.sources = data;

			} else {

				that.sources = [];

			}

			return true;
		}

		return false;
	};

	/**
	 * Initialise custom layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initFeed = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			/**
			 * @type {Object}
			 */
			that.feed = {

				/**
				 * @type {Boolean}
				 */
				enabled: utils.isTypeOf(utils.isBoolean, data.enabled, false),

				/**
				 * @type {Number}
				 */
				id: utils.isTypeOf(utils.isNumber, data.id, 0),

				/**
				 * @type {Number}
				 */
				index: utils.isTypeOf(utils.isNumber, Number(data.index), 0),

				/**
				 * @type {Number}
				 */
				key: utils.isTypeOf(utils.isNumber, Number(data.key), NaN),

				/**
				 * @type {String}
				 */
				name: utils.isTypeOf(utils.isString, data.name, null),

				/**
				 * @type {String}
				 */
				splitter: utils.isTypeOf(utils.isString, data.splitter, null),

				/**
				 * @type {String}
				 */
				value: undefined

			};

			// Check if feed is enabled
			if (that.feed.enabled) {

				var

					/**
					 * @type {Object}
					 */
					feed_ref = that.root.feeds[that.feed.id];

				// Check if feed is available.
				if (feed_ref && feed_ref.data && feed_ref.enabled) {

					// Check if feed item name was provided, but key is not set.
					if (that.feed.name && isNaN(that.feed.key)) {

						var

							/**
							 * @type {Number}
							 */
							key = feed_ref.data.index.indexOf(that.feed.name);

						// Check if key was found in feed index.
						if (key !== -1) {

							// Set feed key as found in index.
							that.feed.key = key;

						}

					}

					// Check if value is found.
					if (!isNaN(that.feed.key)) {

						var

							/**
							 * @type {String}
							 */
							value = feed_ref.data.items[that.feed.index][that.feed.key];

						var

							/**
							 * @type {Object}
							 */
							macros = {

								/**
								 * @type {String}
								 */
								value: value

							};

						// Check if value has to be split.
						if (that.feed.splitter && value) {

							// Loop all layer related timers.
							utils.each(value.split(that.feed.splitter),

								/**
								 * @param {String} split_value
								 * @param {Number} split_key
								 */
								function (split_value, split_key) {

									// Define additional split values.
									macros['value_' + split_key] = split_value;

								}
							);

						}

						// Set value or try ro replace macro if possible.
						that.feed.value = data.value ? (utils.replaceMacros(data.value, macros)) : value;

					}

				}

			}

			return true;
		}

		return false;
	};

	/**
	 * Initialise custom layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.initCustom = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate custom parameters.
			that.custom = data;

			return true;
		}

		return false;
	};

	/**
	 * Load layer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.load = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (that.inited && !that.loaded) {

			// Indicate that layer is loaded.
			that.loaded = true;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'load'

			});

			return true;
		}

		return false;
	};

	/**
	 * Unload layer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.unload = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is initialised and enabled.
		if (that.inited && that.loaded) {

			// Indicate that layer is no longer loaded.
			this.loaded = false;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'unload'

			});

		}

		return this.inited;
	};

	/**
	 * Check if layer can be loaded.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.loadable = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is initialised and enabled.
		if (that.inited && that.enabled) {

			// Check if layer is loadable.
			return (!this.sequence || (this.sequence && this.entered));

		}

		return false;
	};

	/**
	 * Provides layer destroyer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.destroy = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is initialised.
		if (that.inited) {

			// Loop all layer related timers.
			utils.each(that.timers,

				/**
				 * @param {Number} timer
				 * @param {Number} timerIndex
				 */
				function (timer, timerIndex) {

					// Clear timeout.
					that.timeline.clearTimeout(timer);

					// Delete object.
					delete (that.timers[timerIndex]);

				}
			);

			// Loop all layer related timers.
			utils.each(that.events,

				/**
				 * @param {Object} event
				 * @param {Number} eventIndex
				 */
				function (event, eventIndex) {

					// Check if event exists.
					if (event) {

						// Remove event, will return null if operation is successful.
						that.events[eventIndex] = utils.removeEventSimple(event.target, event.type, event.callback);

						// Delete object.
						delete (that.events[eventIndex]);

					}

				}
			);

			// Loop all layer related timers.
			utils.each(that.gestures,

				/**
				 * @param {Object} gesture
				 * @param {Number} gestureIndex
				 */
				function (gesture, gestureIndex) {

					// Check if gesture exists.
					if (gesture) {

						// Loop all layer related timers.
						utils.each(gesture.events,

							/**
							 * @param {Object} event
							 * @param {Number} eventIndex
							 */
							function (event, eventIndex) {

								// Check if event exists.
								if (event) {

									// Remove event, will return null if operation is successful.
									that.gestures[gestureIndex].events[eventIndex] = utils.removeEventSimple(event.target, event.type, event.callback);

								}

							}
						);

						// Delete object.
						// that.gestures[gestureIndex] = null;
						delete (that.gestures[gestureIndex]);

					}

				}
			);

			// Unload asset.
			that.unload();

			// Remove local attribute classes.
			utils.removeClasses(that.target, that.attrs.local);

			// Destroy local attributes.
			that.attrs.local = [];

			// Remove global attribute classes.
			utils.removeClasses(that.target, that.attrs.global);

			// Destroy global attributes.
			that.attrs.global = [];

			// Destroy global attributes.
			that.attrs.hidden = [];

			// Loop all layer related styles.
			utils.each(that.attrs.styles,

				/**
				 * @param {Object} style
				 * @param {String} styleKey
				 */
				function (style, styleKey) {

					// Check if style is valid.
					if (style) {

						// Try to delete style rule.
						utils.deleteCssRule(style.sheet, style.rule);

						delete that.attrs.styles[styleKey];

					}

				}
			);

			// Destroy parameters.
			that.params = {};

			// Destroy macros.
			that.macros.local = {};
			that.macros.global = {};

			// Destroy feed data.
			that.feed = {};

			// Destroy animation data.
			// Styles should be already destroyed togeter with attributes.
			this.anims = {};

			// Indicate that layer is no longer initialised.
			that.inited = false;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'destroy'

			});

			// Destroy custom object after triggering event (in case if custom stuff has to be cleared manually).
			that.custom = {};

			return true;
		}

		return false;
	};

	/**
	 * Resize layer.
	 *
	 * @function
	 * @param {(Object|Event)} event
	 * @param {String} event.type
	 * @param {Object} [event.detail]
	 */
	layers.AbstractLayer.prototype.trigger = function (event) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Log event.
		that.logs.push([((new Date()).getTime() - that.root.timestamp / 1000).toFixed(2), event.type, ((event.detail && event.detail.key) ? event.detail.key
			: null)]);

		// Return callback return.
		return that.callback(event);
	};

	/**
	 * Execute method recursively on all nested layers and frames.
	 *
	 * @function
	 * @param {(Function|String)} func - Component DOM target.
	 * @param {Boolean} [apply] - Apply on current level.
	 * @param {Array} [args] - Parent layer.
	 * @param {Array} [excepts] - Layer key exceptions.
	 * @param {Number} [depth] - Execution recursion depth.
	 * @param {Number} [delay] - Execution recursion delay.
	 */
	layers.AbstractLayer.prototype.execute = function (func, apply, args, excepts, depth, delay) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Validate recursion depth to secure CDU.
		depth = isNaN(depth) ? 100 : depth;

		// Check if function has to be executed on current level.
		if (apply && (excepts ? !utils.arrayContains(excepts, that.key) : true)) {

			// Check if undefined function was provided.
			if (utils.isFunction(func)) {

				// Execute undefined function.
				func.apply(that, args);

			}

			// Check if function namespace if available.
			else if (utils.isFunction(that[func])) {

				// Execute layer function and pass arguments.
				that[func].apply(that, args);

			}

		}

		// Check if recursion depth allows to execute function on nested levels.
		if (depth > 0) {

			var

				/**
				 * @type {Function}
				 * @param {tactic.builder.layers.AbstractLayer} [object]
				 *
				 */
				execute = function (object) {

					// // Request timeout to set a delay in order to diversificate CPU load.
					// // NB! BETA try. Sequence play does not work.
					// that.timeline.setTimeout(function () {
					// }, (delay > 0 ? delay : 0));

					// Keep executing on related frames.
					object.execute(func, true, args, excepts, (depth - 1));

				};

			// Loop all layers.
			for (var i in that.layers) {

				// Keep executing on related layers.
				// that.layers[i].execute(func, true, args, excepts, (depth - 1));
				execute(that.layers[i]);

			}

			// Check if layer has frames.
			if (that.frames) {

				// Loop all layers.
				for (var j in that.frames) {

					// Keep executing on related frames.
					// that.frames[j].execute(func, true, args, excepts, (depth - 1));
					execute(that.frames[j]);

				}

			}

		}

	};

	/**
	 * Check if layer can be accessed.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.available = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is initialised and enabled.
		if (that.inited && that.enabled && that.loaded) {

			// Check if layer is available depending on sequence position and creative stop flag.
			return (!that.sequence || !!that.entered);
		}

		return false;
	};

	/**
	 * Check if layer can be played.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.playable = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is available.
		if (that.available()) {

			// Check if creative is stopped.
			return (that.root ? !that.root.stopped : true);
		}

		return false;
	};

	/**
	 * Add macros.
	 *
	 * @function
	 * @param {String} key
	 * @param {(Object|String)} macro
	 * @param {Boolean} [macro.enabled]
	 * @param {String|Number} [macro.value]
	 * @param {Boolean} [macro.global]
	 * @param {String} [macro.calc]
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.addMacro = function (key, macro) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		if (!utils.isEmptyString(key)) {

			// Check if macro is a string.
			if (utils.isString(macro) || utils.isNumber(macro) || utils.isBoolean(macro)) {

				// Set local macro.
				that.macros['local'][key] = macro;

			}

			// Check if macro is object and enabled.
			else if (utils.isObject(macro) && macro.enabled !== false) {

				var

					/**
					 * Validate macro type, set to "local" as default value.
					 *
					 * @type {String}
					 */
					type = macro.global === true ? 'global' : 'local';

				// Check if calculation has to be made.
				if (!utils.isEmptyString(macro.calc)) {

					try {

						// Replace macro value, try to eval calculation.
						that.macros[type][key] = eval(utils.replaceMacros(macro.calc, {

							/**
							 * @type {(Number|String)}
							 */
							value: macro.value

						}));

					} catch (error) {
					}

				} else {

					// Set macro as is.
					that.macros[type][key] = macro.value;

				}

			} else {
				return false;
			}

			return true;
		}

		return false;
	};

	/**
	 * Add macros.
	 *
	 * @function
	 * @param {(Array|Object)} data
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.addMacros = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		if (utils.isObject(data)) {

			// Loop all attributes.
			utils.each(data,

				/**
				 * @param {Object} macro
				 * @param {String} macroKey
				 */
				function (macro, macroKey) {

					// Add macro.
					that.addMacro(macroKey, macro);
				}
			);

			return true;
		}

		return false;
	};

	/**
	 * Find all layer related macros.
	 *
	 * @function
	 * @param {Boolean} [parental]
	 * @param {Object} [excludes]
	 * @return {Object}
	 */
	layers.AbstractLayer.prototype.getMacros = function (parental, excludes) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		var

			/**
			 * Define empty stack of macros.
			 * @type {Object}
			 */
			stack = {};

		// Loop all layers in the registry.
		utils.each(that.macros,

			/**
			 * @param {Object} macroGroup
			 * @param {String} macroGroupIndex
			 */
			function (macroGroup, macroGroupIndex) {

				// Check if local macros have to be included.
				if (!(macroGroupIndex === 'local' && parental)) {

					// Loop all macros groups.
					utils.each(macroGroup,

						/**
						 * @param {Object} macro
						 * @param {String} macroIndex
						 */
						function (macro, macroIndex) {

							// Check for excludes.
							// Required in order to not override most closest local macros.
							if (!excludes || utils.isUndefined(excludes[macroIndex])) {

								// Assign macro to stack.
								stack[macroIndex] = macro;

							}

						}
					);

				}

			}
		);

		// Check if parent layer exists.
		if (that.parent) {

			// Merge stack with parent macros.
			stack = utils.mergeObjects(stack, that.parent.getMacros(true, stack));

		}

		return stack;
	};

	/**
	 * Add attribute.
	 *
	 * @function
	 * @param {String} key
	 * @param {(Object|String)} [attr]
	 * @param {Boolean} [attr.enabled]
	 * @param {Boolean} [attr.apply]
	 * @param {String} [attr.selector]
	 * @param {Boolean} [attr.global]
	 * @param {String} [attr.name]
	 * @param {Object} [attr.macros]
	 * @param {Object} [attr.css]
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.addAttr = function (key, attr) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		if (!utils.isEmptyString(key)) {

			// Check if attribute object is not provided.
			if (!attr) {

				// Check if attribute is already set.
				if (!utils.arrayContains(that.attrs.local, key)) {

					// Update local attributes.
					that.attrs['local'].push(key);

					// Add classes on target.
					utils.addClass(that.target, key);

				}

			}

			// Check if attribute is enabled.
			else if (utils.isObject(attr) && attr.enabled !== false) {

				var

					/**
					 * Validate attribute type, set to "local as default value".
					 *
					 * @type {String}
					 */
					type = attr.global === true ? 'global' : 'local';

				// Check if attribute has macros.
				if (attr.macros) {

					// Replace macros.
					attr.css = utils.replaceMacros(attr.css, attr.macros);

				}

				// Loop all selectors.
				utils.each((utils.isArray(attr.selector) ? attr.selector : [(attr.selector ? attr.selector : '')]),

					/**
					 * @param {String} selector
					 */
					function (selector) {

						// Check if CSS attributes are defined.
						if (attr.css) {

							var

								/**
								 * Validate unique attribute name.
								 *
								 * @type {String}
								 */
									// styleName = attr.name ? attr.name : key + (selector === '' ? '' : '_' + selector.replace(/[^a-zA-Z0-9]/g, '_')),
								styleName = attr.name ? attr.name : key + (selector === '' ? '' : '_' + selector.replace(/[^a-zA-Z0-9]/g, '_')),

								/**
								 * Create style string.
								 *
								 * @type {String}
								 */
								styleString = utils.createCssString(attr.css);

							// Check if style with that name already exists in registry.
							if (that.attrs.styles[styleName]) {

								// Delete existing attribute.
								that.removeAttrs(styleName);

							}

							// Check if attribute has name.
							// Assign style to style registry.
							that.attrs.styles[styleName] = utils.createCssRule(that.selector + (attr.name ? ' .' + attr.name : '') + ((selector.substr(0, 1) === ':') ? selector : ' ' + selector), styleString);

						}

						// Check if attribute has name.
						if (attr.name) {

							// Check if attribute is already set.
							if (!utils.arrayContains(that.attrs[type], attr.name)) {

								// Update attributes.
								that.attrs[type].push(attr.name);

								// Add classes on target.
								utils.addClass(that.target, attr.name);

							}

						} else {

							// Check if attribute is already set.
							if (!utils.arrayContains(that.attrs['hidden'], styleName)) {

								// Update attributes.
								that.attrs['hidden'].push(styleName);

							}

						}

					}
				);

			} else {
				return false;
			}

			return true;
		}

		return false;
	};

	/**
	 * Add layer attributes.
	 *
	 * @function
	 * @param {(String|Array|Object)} query
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.addAttrs = function (query) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check is attribute is string.
		if (utils.isString(query)) {

			// Modify it to array.
			query = [query];

		}

		if (utils.isArray(query)) {

			// Loop all attributes.
			utils.each(query,

				/**
				 * @param {String} attrKey
				 */
				function (attrKey) {

					// Add attribute.
					that.addAttr(attrKey);

				}
			);

		}

		// In case of object.
		else if (utils.isObject(query)) {

			// Loop all attributes.
			utils.each(query,

				/**
				 * @param {Object} attr
				 * @param {String} attrKey
				 */
				function (attr, attrKey) {

					// Add attribute.
					that.addAttr(attrKey, attr);

				}
			);

		} else {
			return false;
		}

		return true;
	};

	/**
	 * Find all layer related attributes.
	 *
	 * @function
	 * @param {Boolean} [parental]
	 * @return {Array}
	 */
	layers.AbstractLayer.prototype.getAttrs = function (parental) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		var

			/**
			 * Define empty stack of attributes.
			 * @type {Array}
			 */
			stack = [];

		// Loop all layers in the registry.
		utils.each(that.attrs,

			/**
			 * @param {Object} attrGroup
			 * @param {String} attrGroupIndex
			 */
			function (attrGroup, attrGroupIndex) {

				// Check if local attributes have to be included.
				if (!(attrGroupIndex === 'local' && parental) && !(attrGroupIndex === ('styles' || 'hidden'))) {

					// Loop all attribute groups.
					utils.each(attrGroup,

						/**
						 * @param {Object} attrs
						 */
						function (attrs) {

							// Add attributes to stack.
							stack = stack.concat(attrs);

						}
					);

				}

			}
		);

		// Check if parent layer exists.
		if (that.parent) {

			// Merge stack with parent macros.
			stack = stack.concat(that.parent.getAttrs(true));

		}

		return stack;
	};

	/**
	 * Remove layer attribute.
	 *
	 * @function
	 * @param {String} attrName
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.removeAttr = function (attrName) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		var

			removeAttr = function (attrs, attrName) {

				// Loop all attributes in group.
				for (var attrIndex in attrs) {

					if (attrs.hasOwnProperty(attrIndex)) {

						// Check if attribute has to be removed.
						if (attrs[attrIndex] === attrName) {

							// Remove attribute from list.
							attrs.splice(attrIndex, 1);

							// Check if removal attribute key exists in styles.
							if (that.attrs.styles[attrName]) {

								// Try to delete style rule.
								utils.deleteCssRule(that.attrs.styles[attrName].sheet, that.attrs.styles[attrName].rule);

								// Remove style from registry.
								delete (that.attrs.styles[attrName]);

							}

							break;
						}
					}

				}

			};

		// Check if attribute name is valid
		if (utils.isString(attrName)) {

			// Try to remove all kinds of attribute.
			removeAttr(that.attrs.local, attrName);
			removeAttr(that.attrs.global, attrName);
			removeAttr(that.attrs.hidden, attrName);

			// Remove class from target.
			utils.removeClass(that.target, attrName);

		}

		return false;
	};

	/**
	 * Remove layer attributes.
	 *
	 * @function
	 * @param {(String|Array)} query
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.removeAttrs = function (query) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if attribute names are provided.
		if (query) {

			// Check is attribute is string.
			if (utils.isString(query)) {

				// Modify it to array.
				query = [query];

			}

			// Check is attributes are array.
			if (utils.isArray(query)) {

				// Loop all query attributes.
				utils.each(query,

					/**
					 * @param {String} attrName
					 */
					function (attrName) {

						// Try to remove all kinds of attributes.
						that.removeAttr(attrName);

					}
				);

				return true;
			}

		}

		return false;
	};

	/**
	 * Add animation.
	 *
	 * @function
	 * @param {String} key
	 * @param {(Object|String)} anim
	 * @param {Boolean} [anim.enabled]
	 * @param {String} [anim.name]
	 * @param {String} [anim.target]
	 * @param {Boolean} [anim.skip]
	 * @param {Boolean} [anim.apply]
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.addAnim = function (key, anim) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		if (!utils.isEmptyString(key)) {

			// Check if animation is enabled.
			if (utils.isObject(anim) && anim.enabled !== false && !utils.isEmptyString(anim.name)) {

				// Check if attribute is already set.
				if (!that.anims[key]) {

					// Create new animation attribute.
					that.anims[key] = {

						/**
						 * @type {String}
						 */
						name: anim.name,

						/**
						 * @type {Boolean}
						 */
						apply: utils.isTypeOf(utils.isBoolean, anim.apply, true),

						/**
						 * @type {Object}
						 */
						target: (anim.target === 'wrapper' || anim.target === 'holder') ? that[anim.target] : that,

						/**
						 * @type {Object}
						 */
						skip: utils.isTypeOf(utils.isBoolean, anim.skip, true)

					};

					// Check if animation attribute has to be applied.
					if (that.anims[key].apply) {

						// Apply animation class to related target.
						that.anims[key].target.addAttr(that.anims[key].name);

					}

					return true;
				}

			}

		}

		return false;
	};

	/**
	 * Add layer animations.
	 *
	 * @function
	 * @param {(String|Array|Object)} query
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.addAnims = function (query) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check is animation is string.
		if (utils.isString(query)) {

			// Modify it to array.
			query = [query];

		}

		if (utils.isArray(query)) {

			var

				/**
				 * @type {Number}
				 */
				count = 0;

			// Loop all animations.
			utils.each(query,

				/**
				 * @param {Object} anim
				 */
				function (anim) {

					count++;

					// Add attribute.
					that.addAnim(count.toString(), anim);

				}
			);

		}

		// In case of object.
		else if (utils.isObject(query)) {

			// Loop all animations.
			utils.each(query,

				/**
				 * @param {Object} anim
				 * @param {String} animKey
				 */
				function (anim, animKey) {

					// Add attribute.
					that.addAnim(animKey, anim);

				}
			);

		} else {

			return false;
		}

		return true;
	};

	/**
	 * Remove animation.
	 *
	 * @function
	 * @param {String} key
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.removeAnim = function (key) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if animation exists.
		if (!utils.isEmptyString(key) && that.anims[key]) {

			// Remove animation.
			that.anims[key] = null;

		}

		return true;
	};

	/**
	 * Remove layer animations.
	 *
	 * @function
	 * @param {(String|Array|Object)} query
	 * @return {Boolean}
	 */
	layers.AbstractLayer.prototype.removeAnims = function (query) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check is animation is string.
		if (utils.isString(query)) {

			// Modify it to array.
			query = [query];

		}

		if (utils.isArray(query)) {

			// Loop all animations.
			utils.each(query,

				/**
				 * @param {String} animKey
				 */
				function (animKey) {

					// Remove animation.
					that.removeAnim(animKey);

				}
			);

		}

		// In case of object.
		else if (utils.isObject(query)) {

			// Loop all animations.
			utils.each(query,

				/**
				 * @param {Object} anim
				 * @param {String} animKey
				 */
				function (anim, animKey) {

					// Remove animation.
					that.removeAnim(animKey);

				}
			);

		} else {

			return false;
		}

		return true;
	};

	/**
	 * Find all layer related animations.
	 *
	 * @function
	 * @return {Object}
	 */
	layers.AbstractLayer.prototype.getAnims = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		return that.anims;
	};

	/**
	 * Find layer target.
	 *
	 * @function
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} Constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {Object} [override] - Component parameters.
	 * @return {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.AbstractLayer.prototype.addLayer = function (Constructor, key, data, callback, override, index) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not initialised and layer constructor is valid.
		if (utils.isFunction(Constructor)) {

			/**
			 * Create dynamic layer.
			 *
			 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
			 */
			return new Constructor(key, data, callback, that, override, index);

		}

		return null;
	};

	/**
	 * Find nearest layer.
	 *
	 * @function
	 * @param {String} key
	 * @param {Number} [depth]
	 * @return {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
	 */
	layers.AbstractLayer.prototype.getLayer = function (key, depth) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		var

			/**
			 * @type {Array}
			 */
			layers = that.layers,

			/**
			 * @type {Number}
			 */
			layerIndex,

			/**
			 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
			 */
			layer;

		// First look in current layer directory.
		for (layerIndex in layers) {

			// Define layer
			layer = layers[layerIndex];

			// Check if layer key es search.
			if (layer.key === key) {
				return layer;
			}

		}

		// If not found and there is an option to look in nested layers.
		if (depth > 0) {

			// Loop all nested layers.
			for (layerIndex in layers) {

				// Define layer.
				layer = layers[layerIndex];

				var

					/**
					 * Look for the layer in nested layer.
					 *
					 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
					 */
					nestedLayer = layer.getLayer(key, (depth - 1));

				// Check if layer was found.
				if (nestedLayer) {
					return nestedLayer;
				}

			}

		}

		// If not found and there is an option to look in parent layers.
		else if (depth < 0 && that.parent) {

			// Search in parent layer.
			return that.parent.getLayer(key, (depth + 1));
		}

		return null;
	};

	/**
	 * Find layer(s) in creative registry.
	 *
	 * @function
	 * @param query {String} Layers to select.
	 * @return {Array}
	 */
	layers.AbstractLayer.prototype.getLayers = function (query) {

		/// Validate query string.
		if (utils.isEmptyString(query)) {
			return [];
		}

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		var

			/**
			 * Define empty stack of layers.
			 * @type {Array}
			 */
			stack = [];

		// Check if query is in registry (in case of no undefined numbers).
		if (that.registry[query]) {

			// Push layer to stack.
			stack.push(that.registry[query]);

			return stack;
		}

		// Loop all layers in the registry.
		utils.each(that.registry,

			/**
			 * @param {Object} layer
			 * @param {String} layerIndex
			 */
			function (layer) {

				// Check if layer key es query.
				if (layer.key === query) {

					// Push layer to stack;
					stack.push(layer);

				}

				// Check if query has undefined numbers to be found, otherwise perform simple check for namespace match.
				else if (query.indexOf('#') !== -1) {

					// Check if query is namespace.
					if (query.indexOf('.') !== -1) {

						var

							/**
							 * Split query.
							 * @type {Array}
							 */
							querySplit = query.split('.'),

							/**
							 * Split layer key.
							 *
							 * @type {Array}
							 */
							namespaceSplit = layer.namespace.split('.');

						// Check if query and key have same length.
						if (namespaceSplit.length === querySplit.length) {

							var

								/**
								 * Clone key split for further adjustments.
								 *
								 * @type {Array}
								 */
								namespaceSplitClone = utils.cloneObject(namespaceSplit);

							// Loop all parts of query.
							for (var i = 0; i < querySplit.length; i++) {

								// Check if query part has undefined numbers.
								if (querySplit[i].indexOf('#') !== -1) {

									// Replace related key part number to undefined.
									namespaceSplitClone[i] = namespaceSplitClone[i].replace(/[0-9]/g, '#');

								}

							}

							// Check if query and key arrays match.
							if (utils.isEqualArray(querySplit, namespaceSplitClone)) {

								// Push layer to stack.
								stack.push(layer);

							}

						}

					} else {

						var

							/**
							 * Clone layer key.
							 *
							 * @type {String}
							 */
							keyClone = utils.cloneObject(layer.key);

						// Replace numbers and check if key es query.
						if (keyClone.replace(/[0-9]/g, '#') === query) {

							// Push layer to stack.
							stack.push(layer);

						}

					}

				}

			}
		);

		return stack;
	};

	/**
	 * Find layer target.
	 *
	 * @function
	 * @param {String} key
	 * @return {(Element|Node)}
	 */
	layers.AbstractLayer.prototype.getTarget = function (key) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		var

			/**
			 * Define element target in DOM.
			 * Use body as root creative target.
			 * @type {(Element|Node)}
			 */
			target = utils.getElementsByKey(that.target, key)[0];

		// Check if layer target was found and parent exists.
		if (!target && that.parent) {

			// Try to find layer target in parent layer.
			target = utils.getElementsByKey(that.parent.target, key)[0];

		}

		// Check if layer target was found.
		if (!target) {

			// Try to find layer target in whole document.
			target = utils.getElementsByKey(document.body, key)[0];

		}

		return target;
	};

	/**
	 * Creative layer constructor.
	 *
	 * @constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {Object} [override] - Component parameters.
	 */
	layers.BannerLayer = function (key, data, callback, override) {

		/**
		 * @type {String}
		 */
		this.type = 'BannerLayer';

		// Define creative.
		this.root = this;

		// Try to replace macros in the data.
		// This is required for temporary dynamic preview solution in Brandmaster encironment.
		try {

			// console.log(encodeURIComponent('{"${dealer_name}":"Deaker","${dealer_price}":"300"}'));
			// ?macros=%7B%22%24%7Bdealer_name%7D%22%3A%22Deaker%22%2C%22%24%7Bdealer_price%7D%22%3A%22300%22%7D

			var

				/**
				 * Get URL parameter with macros and convert it to object.
				 * @type {String}
				 */
				url_macros = utils.getQsParam('bm_macros');

			// Check if macros are defined.
			if (!utils.isEmptyString(url_macros)) {

				var

					/**
					 * @type {Object}
					 */
					macros = JSON.parse(decodeURIComponent(url_macros)),

					/**
					 * @type {String}
					 */
					data_temp = JSON.stringify(data),

					/**
					 * @type {RegExp}
					 */
					reg_ex = new RegExp(Object.keys(macros).join('|').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');

				data_temp = data_temp.replace(reg_ex, function(matched) {
					return macros[matched];
				});

				data = JSON.parse(data_temp);

			}

		} catch (e) {
		}

		// Set layer parameters and properties.
		this.set(key, data, callback, null, override);

		// Set data-key attribute on target.
		this.target.setAttribute('data-key', this.key);

		/**
		 * @type {Object}
		 */
		this.props = {

			/**
			 * @type {tactic.builder.props.DomainProp}
			 */
			domain: null,

			/**
			 * @type {tactic.builder.props.NameProp}
			 */
			vendor: null,

			/**
			 * @type {tactic.builder.props.NameProp}
			 */
			name: null,

			/**
			 * @type {tactic.builder.props.SizeProp}
			 */
			size: null,

			/**
			 * @type {tactic.builder.props.ModeProp}
			 */
			mode: null

		};

		/**
		 * Creative definition (UTM parameters).
		 *
		 * @type {Object}
		 */
		this.definition = {};

		/**
		 * Validate click tag object.
		 *
		 * @type {Object}
		 */
		this.clicktag = {};

		/**
		 * Creative feeds.
		 *
		 * @type {Object}
		 */
		this.feeds = {};

		/**
		 * Creative fonts.
		 *
		 * @type {Object}
		 */
		this.fonts = {};

		/**
		 * Creative static images and videos.
		 *
		 * @type {Object}
		 */
		this.assets = {};

		/**
		 * @type {Object}
		 */
		this.events = {

			/**
			 * @type {Object}
			 */
			resize: null,

			/**
			 * @type {Object}
			 */
			interaction_mousedown: null,

			/**
			 * @type {Object}
			 */
			interaction_touchstart: null

		};

		/**
		 * @type {String}
		 */
		this.mode = null;

		/**
		 * @type {Boolean}
		 */
		this.inanimate = this.target ? this.target.style ? (this.target.style.animation === undefined) : true : true;

		/**
		 * @type {Boolean}
		 */
		this.enabled = true;

		/**
		 * @type {Boolean}
		 */
		this.loaded = false;

		/**
		 * @type {Boolean}
		 */
		this.stopped = undefined;

		/**
		 * @type {Boolean}
		 */
		this.captured = false;

		/**
		 * @type {Boolean}
		 */
		this.entered = true;

		/**
		 * @type {Boolean}
		 */
		this.interacted = false;

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.BannerLayer.prototype = new layers.AbstractLayer();
	layers.BannerLayer.prototype.constructor = layers.BannerLayer;

	/**
	 * Provides creative initialiser before compilation.
	 * Create custom macros, adjust data or anything else.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.init = function () {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			var

				/**
				 * @type {Array}
				 */
				attrs,

				/**
				 * @type {Object}
				 */
				macros;

			var

				/**
				 * Clone initial data and extract exceptions.
				 *
				 * @type {Object}
				 */
				data = utils.cloneObject(that.data);

			// Initialise mode.
			that.initMode((/PhantomJS/i.test(navigator.userAgent) ? 'capture' : data.mode));

			// Initialise macros.
			that.initMacros(utils.isTypeOf(utils.isObject, data.macros, {}));

			// Add property macros.
			// NB! Macro replacement utility may reduce banner performance, use this feature wisely.
			that.addMacro('package_url', {

				/**
				 * @type {Boolean}
				 */
				global: true,

				/**
				 * @type {String}
				 */
				value: tactic.url.package

			});

			// Add property macros.
			// NB! Macro replacement utility may reduce banner performance, use this feature wisely.
			that.addMacro('speed', {

				/**
				 * @type {Boolean}
				 */
				global: true,

				/**
				 * @type {Number}
				 */
				value: that.timeline.speed

			});

			// Update macro object as new macros were probably added to layer from data.
			macros = that.getMacros();

			// Initialise properties.
			that.initProps(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.props, {}), macros));

			// Update macro object as new macros were probably added to layer from data.
			macros = that.getMacros();

			// Get attributes.
			attrs = that.getAttrs();

			// Initialise attributes.
			that.initAttrs(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.attrs, {}), macros), attrs));

			// Update attribute object as new values were probably added to layer by attribute data.
			attrs = that.getAttrs();

			// Initialise parameters.
			that.initParams(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.params, {}), macros));

			// Initialise definition.
			that.initDefinition(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.definition, {}), macros), attrs));

			// Initialise click tag.
			that.initClicktag(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.clicktag, {}), macros), attrs));

			// Initialise feeds.
			that.initFeeds(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.feeds, {}), macros), attrs));

			// Initialise fonts.
			that.initFonts(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.fonts, {}), macros), attrs.concat([that.props.vendor.value])));

			// Initialise static assets.
			that.initSources();

			// Initialise custom layer parameters.
			that.initCustom(utils.extractExceptions(utils.replaceMacros(utils.isTypeOf(utils.isObject, data.custom, {}), macros), attrs));

			// Parse layer data and create all layers.
			that.build(data.layers, that);

			// Stop creative after some period of time.
			// NB! The most ad networks require creative to stop in 30 seconds.
			that.timers.stop = that.timeline.setTimeout(function () {

				// Stop creative.
				that.stop();

			}, that.params.stop.after);

			// Add resize event listener.
			that.events.resize = utils.addEventSimple(window, 'resize', function () {

				// Apply resize event.
				that.resize.apply(that);

			});

			// Add mouseover event listener.
			that.events.interaction_mousedown = utils.addEventSimple(that.target, 'mousedown', function () {

				// Apply interaction flag.
				that.interact();

			});

			// Add mouseover event listener.
			that.events.interaction_touchstart = utils.addEventSimple(that.target, 'touchstart', function () {

				// Apply interaction flag.
				that.interact();

			});

			// Indicate that layer is initialised.
			that.inited = true;

			// Set timeout on asset source placement.
			// Pause is required to give time to DOM elements to append.
			that.timers.init = that.timeline.setTimeout(function () {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'init'

				});

			}, 0);

			return true;
		}

		return false;
	};

	/**
	 * Validate creative mode.
	 *
	 * @function
	 * @param {Object} mode
	 * @return {Object}
	 */
	layers.BannerLayer.prototype.initMode = function (mode) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate creative mode.
			// Check if advert ID is provided, means banner is live.
			that.mode = (mode === 'capture') ? mode : (container.ADVERT_ID > 0 ? 'live' : utils.isTypeOf(utils.isString, mode, 'live'));

			// Add attribute.
			that.addAttr(that.mode, {

				/**
				 * @type {String}
				 */
				name: that.mode,

				/**
				 * Validate if global.
				 * @type  {Boolean}
				 */
				global: true

			});

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.initProps = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate data.
			data = utils.isTypeOf(utils.isObject, data, {});

			// Set property.
			that.props.domain = new props.DomainProp(data.domain);

			// Update property.
			that.props.domain.update(container.HOST);

			// Set property.
			that.props.vendor = new props.NameProp(utils.mergeObjects({

				/**
				 * @type {String}
				 */
				name: 'vendor'

			}, (data.vendor || {})));

			// Update property.
			that.props.vendor.update(container.MEDIA);

			// Set property.
			that.props.name = new props.NameProp(data.name);

			// Update property.
			that.props.name.update(container.NAME);

			// Set property.
			that.props.size = new props.SizeProp(data.size);

			// Update property.
			that.props.size.update(container.WIDTH, container.HEIGHT);

			// Set property.
			that.props.mode = new props.ModeProp(data.mode);

			// Update property.
			that.props.mode.update(that.mode);

			// Now loop all properties.
			utils.each(that.props,

				/**
				 * @param {Object} prop
				 * @param {Boolean} prop.enabled
				 * @param {Boolean} prop.global
				 * @param {Boolean} prop.macro
				 * @param {String} prop.name
				 * @param {String} [prop.index]
				 * @param {(String|Number)} prop.value
				 * @param {String} propIndex
				 */
				function (prop, propIndex) {

					// Check if property is enabled.
					if (prop.enabled) {

						// Add property macros.
						// NB! Macro replacement utility may reduce banner performance, use this feature wisely.
						that.addMacro(prop.name, {

							/**
							 * @type {Boolean}
							 */
							global: true,

							/**
							 * @type {String}
							 */
							value: prop.value

						});

						// if (propIndex !== 'domain') {
						//
						// 	// Add resize attribute to holder.
						// 	that.addAttr(prop.name, {
						//
						// 		/**
						// 		 * @type {Boolean}
						// 		 */
						// 		global: true,
						//
						// 		/**
						// 		 * @type {String}
						// 		 */
						// 		name: prop.name + '_' + prop.value
						//
						// 	});
						//
						// }

					}

				}
			);

			return true;
		}

		return false;
	};

	/**
	 * Validate creative definition.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Object}
	 */
	layers.BannerLayer.prototype.initDefinition = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Set definitions.
			that.definition = data;

			return true;
		}

		return false;
	};

	/**
	 * Validate click tag properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Object}
	 */
	layers.BannerLayer.prototype.initClicktag = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate nad set clicktag.
			that.clicktag = {

				/**
				 * @type {Boolean}
				 */
				override: utils.isTypeOf(utils.isBoolean, data.override, false),

				/**
				 * @type {Boolean}
				 */
				synchronise: utils.isTypeOf(utils.isBoolean, data.synchronise, false),

				/**
				 * @type {String}
				 */
				url: utils.isTypeOf(utils.isUrl, data.url, ''),

				/**
				 * @type {Array}
				 */
				options: utils.isTypeOf(utils.isArray, data.options, [])

			};

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.initFeeds = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Set creative feeds.
			that.feeds = data;

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.initFonts = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Loop all custom properties.
			utils.each(data,

				/**
				 * @param {Object} font
				 * @param {String} fontKey
				 */
				function (font, fontKey) {

					// Check if font is valid and not disabled.
					if (font && !utils.isEmptyString(font.url) && font.enabled !== false) {

						// Check if font name is boolean.
						if (font.name && utils.isBoolean(font.name)) {

							// Set font name same as font key.
							font.name = fontKey;

						}

						// Check if font name is boolean.
						if (!font.alt) {

							// Set font name same as font key.
							font.alt = 'sans-serif';

						}

						var

							/**
							 * @type {Object}
							 */
							css = {

								/**
								 * @type {String}
								 */
								'font-family': fontKey,

								/**
								 * @type {String}
								 */
								'font-weight': utils.isTypeOf(utils.isString, font.weight, 'normal'),

								/**
								 * @type {String}
								 */
								'font-style': utils.isTypeOf(utils.isString, font.style, 'normal'),

								/**
								 * @type {String}
								 */
								'font-display': 'swap',

								/**
								 * @type {Array}
								 */
								'src': [[], []]

							};

						// Loop all font types.
						utils.each(font.types,

							/**
							 * @param {String} fontType
							 * @param {String} fontTypeIndex
							 */
							function (fontType, fontTypeIndex) {

								// Switch property.
								switch (fontType) {

									case('eot'):

										// Push font to attributes.
										css.src[0].push({

											/**
											 * @type {String}
											 */
											url: utils.getAssetUrl(font.url + '.' + fontType)

										});

										// Push font to attributes.
										css.src[1].push({

											/**
											 * @type {String}
											 */
											url: utils.getAssetUrl(font.url + '.' + fontType + '#iefix'),

											/**
											 * @type {String}
											 */
											format: 'embedded-opentype'

										});

										break;

									default:

										// Push font to attributes.
										css.src[1].push({

											/**
											 * @type {String}
											 */
											url: utils.getAssetUrl(font.url + '.' + fontType),

											/**
											 * @type {String}
											 */
											format: fontType

										});

										break;

								}

							}
						);

						var

							/**
							 * Create CSS font face.
							 *
							 * @type {Object}
							 */
							style = utils.createCssRule('@font-face', utils.createCssFontString(css));

						// Push font style to style registry.
						that.attrs.styles[fontKey] = style;

						// Push font name to creative font registry.
						that.fonts[fontKey] = {

							/**
							 * Indicate that font is not yet loaded.
							 * @type {Boolean}
							 */
							loaded: false,

							/**
							 * @type {Object}
							 */
							style: style

						};

						// Check if name is defined.
						if (!utils.isEmptyString(font.name)) {

							// Create font attribute.
							that.addAttr(fontKey, {

								/**
								 * @type {String}
								 */
								selector: '.' + font.name,

								/**
								 * @type {Object}
								 */
								css: {

									/**
									 * @type {String}
									 */
									'font-family': '"' + fontKey + '", "' + font.alt + '"'

								}

							});

						}

						// Check if tags are defined for this font.
						if (utils.isArray(font.selector)) {

							// Loop all tags.
							utils.each(font.selector,

								/**
								 * @function
								 * @param {String} selector
								 */
								function (selector) {

									// Check if tag is not empty.
									if (!utils.isEmptyString(selector)) {

										// Create font attribute.
										that.addAttr(fontKey, {

											/**
											 * @type {String}
											 */
											selector: selector,

											/**
											 * @type {Object}
											 */
											css: {

												/**
												 * @type {String}
												 */
												'font-family': '"' + fontKey + '", "' + font.alt + '"'

											}

										});

									}

								}
							);

						}

					} else {

						var

							/**
							 * Try to find font name in the waiting list.
							 *
							 * @type {Number}
							 */
							index = utils.arrayIndex(that.params.wait.fonts, fontKey);

						// Check if font name was found in wait list.
						if (index > -1) {

							// Remove font from wait list, so creative won't wait for it.
							that.params.wait.fonts.splice(index, 1);

						}

					}

				}
			);

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate properties and extract exceptions.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5),

				/**
				 * @type {Object}
				 */
				wait: {

					/**
					 * @type {Array}
					 */
					fonts: utils.isTypeOf(utils.isArray, utils.getObjectDeep(data, 'wait.fonts'), []),

					/**
					 * @type {Array}
					 */
					assets: utils.isTypeOf(utils.isArray, utils.getObjectDeep(data, 'wait.assets'), []),

					/**
					 * @type {Array}
					 */
					feeds: utils.isTypeOf(utils.isArray, utils.getObjectDeep(data, 'wait.feeds'), []),

					/**
					 * @type {Number}
					 */
					timeout: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'wait.timeout'), 5000)

				},

				/**
				 * @type {Object}
				 */
				stop: {

					/**
					 * @type {Number}
					 */
					after: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'stop.after'), 30000)

				},

				/**
				 * @type {Object}
				 */
				capture: {

					/**
					 * @type {Number}
					 */
					delay: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'capture.delay'), 3000)

				},

				/**
				 * @type {Object}
				 */
				resize: {

					/**
					 * @type {Number}
					 */
					delay: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'resize.delay'), 500)

				}

			};

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Array} [data]
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.initSources = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			var

				/**
				 * @type {Array}
				 */
				assets = [].slice.call(that.target.getElementsByTagName('img')).concat([].slice.call(that.target.getElementsByTagName('video')));

			// Loop all static assets in the document.
			utils.each(assets,

				/**
				 * @function
				 * @param {(Element|Node)} assetTarget
				 */
				function (assetTarget) {

					// Check if target is valid and does not have src attribute.
					if (assetTarget) {

						var

							/**
							 * Get asset key attribute.
							 * @type {String}
							 */
							assetKey = assetTarget.getAttribute('data-key'),

							/**
							 * Get data source attribute.
							 * This attribute is used as a replacement of standard asset src parameter.
							 *
							 * @type {String}
							 */
							assetSource = assetTarget.getAttribute('data-source');

						// Check if asset has required attributes.
						if (!utils.isEmptyString(assetKey) && !utils.isEmptyString(assetSource) && !assetTarget.src) {

							// Save asset to creative registry.
							that.assets[assetKey] = {

								/**
								 * @type {(Element|Node)}
								 */
								target: assetTarget,

								/**
								 * @type {String}
								 */
								source: assetSource,

								/**
								 * @type {Boolean}
								 */
								polite: assetTarget.getAttribute('data-polite') === ('true' || true)

							};

							// Check if asset has to be awaited.
							if (assetTarget.getAttribute('data-wait') === ('true' || true)) {

								// Check if asset does not exist in waiting list.
								if (utils.arrayIndex(that.params.wait.assets, assetKey) < 0) {

									// Push asset to waiting list.
									that.params.wait.assets.push(assetKey);

								}

							}

						} else {

							var

								/**
								 * Try to find asset name in the waiting list.
								 *
								 * @type {Number}
								 */
								index = utils.arrayIndex(that.params.wait.assets, assetKey);

							// Check if font name was found in wait list.
							if (index > -1) {

								// Remove font from wait list, so creative won't wait for it.
								that.params.wait.assets.splice(index, 1);

							}

						}

					}

				}
			);

			return true;
		}

		return false;
	};

	/**
	 * Parse data and create layers.
	 *
	 * @function
	 * @param {Object} data
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.build = function (data, parent) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Loop layers in data.
			utils.each(data,

				/**
				 * @param {Object} layerData
				 * @param {String} layerIndex
				 */
				function (layerData, layerIndex) {

					var

						/**
						 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
						 */
						LayerConstructor = utils.isTypeOf(utils.isFunction, layerData ? layers[(utils.isString(layerData.type)
							? layerData.type.split('Component').join('Layer') : null)] : null, null);

					var

						/**
						 * @type {String}
						 */
						layerKey = utils.isNumber(layerIndex) ? parent.key + '_' + layerIndex : layerIndex;

					var

						/**
						 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
						 */
						newLayer = that.trigger({

							/**
							 * @type {String}
							 */
							type: 'build',

							/**
							 * @type {Object}
							 */
							detail: {

								/**
								 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
								 */
								Constructor: LayerConstructor,

								/**
								 * @type {String}
								 */
								key: layerKey,

								/**
								 * @type {Number}
								 */
								index: Number(layerIndex),

								/**
								 * @type {Object}
								 */
								data: layerData,

								/**
								 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.JointLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.AbstractLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
								 */
								parent: parent

							}

						});

					// Check if layer was created via callback.
					if (!newLayer && LayerConstructor) {

						// Create new layer automatically.
						newLayer = parent.addLayer(LayerConstructor, layerKey, layerData, that.callback, null, Number(layerIndex));

					}

					// Check if layer was created.
					if (newLayer && layerData) {

						// Check if layer is a sequence controller (has frames).
						if (layerData.layers) {

							// Parse layer's nested layers.
							that.build(layerData.layers, newLayer);

						}

						// Check if layer is a sequence controller (has frames).
						if (layerData.frames) {

							// Parse layer's nested frames.
							that.build(layerData.frames, newLayer);

						}

					}

				}
			);

			return true;
		}

		return false;
	};

	/**
	 * Provides creative loader before compilation.
	 * Load static assets (the ones defined in HTML files) or any other stuff you require.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.load = function () {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if creative is not already loaded.
		if (!that.loaded) {

			var

				/**
				 * @type {Boolean}
				 */
				loadTimeout = false,

				/**
				 * @type {Object}
				 */
				fontLoad = {

					/**
					 * Define list of fonts to wait for load.
					 *
					 * @type {Array}
					 */
					list: that.params.wait.fonts,

					/**
					 * Font load check.
					 *
					 * @type {Number}
					 */
					count: 0

				},

				/**
				 * @type {Object}
				 */
				assetLoad = {

					/**
					 * Select all assets in the document.
					 *
					 * @type {NodeList}
					 */
					list: that.params.wait.assets,

					/**
					 * Font load check.
					 *
					 * @type {Number}
					 */
					count: 0

				},

				/**
				 * @type {Object}
				 */
				feedLoad = {

					/**
					 * Define list of feeds to wait for load.
					 *
					 * @type {Array}
					 */
					list: that.params.wait.feeds,

					/**
					 * Font load check.
					 *
					 * @type {Number}
					 */
					count: 0

				},

				/**
				 * Check if all elements are loaded.
				 *
				 * @function
				 * @return {Boolean}
				 */
				isLoaded = function () {
					return fontLoad.count >= fontLoad.list.length && feedLoad.count >= feedLoad.list.length && assetLoad.count >= assetLoad.list.length;
				},

				/**
				 * Font on complete load handler.
				 *
				 * @function
				 * @param {Object} [loadCategory]
				 */
				loadHandler = function (loadCategory) {

					// Check if creative is not already loaded.
					if (!that.loaded) {

						// Check if category is provided.
						if (loadCategory) {

							// Increase load counter.
							// We don't care if load was successful.
							loadCategory.count++;

						}

						// Check if all fonts and feeds are loaded.
						if (loadTimeout || isLoaded()) {

							// Clear load timer.
							that.timeline.clearTimeout(that.timers.load);

							// Indicate that creative is now loaded.
							that.loaded = true;

							// Trigger event.
							that.trigger({

								/**
								 * @type {String}
								 */
								type: 'load'

							});

						}

					}

				},

				/**
				 * @function
				 * @param {Event} event
				 */
				assetLoadHandler = function (event) {

					// Remove load event listener.
					utils.removeEventSimple(this, 'load', assetLoadHandler);

					// Execute load handler to check state.
					loadHandler(assetLoad);

				},

				/**
				 * @function
				 * @param {Event} event
				 */
				assetErrorHandler = function (event) {

					var

						/**
						 * @type {(Element|Node)}
						 */
						assetTarget = this;

					// Check if asset is of SVG type.
					if (assetTarget.src && assetTarget.src.indexOf('.svg') !== -1) {

						// This will try to replace asset to PNG format in case if browser doesn't support SVG.
						// NB! Requires a PNG asset duplicate of SVG that is placed at same location.
						assetTarget.src = assetTarget.src.replace(/.svg$/, '.png');

					} else {

						// Remove error event listener.
						utils.removeEventSimple(assetTarget, 'error', assetLoadHandler);

						// Execute load handler to check state.
						loadHandler(assetLoad);

					}

				};

			// Loop all asset in the registry.
			utils.each(that.feeds,

				/**
				 * @function
				 * @param {Object} feed
				 * @param {String} feedKey
				 */
				function (feed, feedKey) {

					if (feed) {

						/**
						 * @type {String}
						 */
						that.feeds[feedKey].key = feedKey;

						var

							/**
							 * @type {String}
							 */
							feed_url = utils.getAssetUrl(feed.source);

						if (feed.enabled && utils.isUrl(feed_url)) {

							feedLoad.list.push(feed_url);

							// Load feed and wait for response.
							utils.get((feed_url.indexOf('127.0.0.1') !== -1) ? feed_url : feed_url + '&r=' + Math.round(Math.random() * 999999999),

								/**
								 * @function
								 * @param {Object} response
								 */
								function (response) {

									try {

										if (that.feeds[feedKey].type === 'csv') {

											var items = utils.CSVToArray(response.responseText);

											/**
											 * Create empty data object.
											 * @type {Object}
											 */
											that.feeds[feedKey].data = {

												/**
												 * @type {Object}
												 */
												meta: {},

												/**
												 * @type {Array}
												 */
												index: items[0],

												/**
												 * @type {Array}
												 */
												items: items

											};

											that.feeds[feedKey].data.items.shift();

										} else {

											/**
											 * Parse JSON response.
											 * @type {Object}
											 */
											that.feeds[feedKey].data = JSON.parse(response.responseText).data;

										}

										that.feeds[feedKey].loaded = true;

									} catch (e) {

										that.feeds[feedKey].loaded = false;

									}

									loadHandler(feedLoad);

								}, function (e) {

									that.feeds[feedKey].loaded = true;

									loadHandler(feedLoad);

								});

						}

					}

				}
			);

			// Loop font list and wait for it's load.
			utils.each(fontLoad.list,

				/**
				 * @function
				 * @param {String} font
				 */
				function (font) {

					// Check if font name is defined and valid.
					// Check if font has to be loaded.
					if (!utils.isEmptyString(font)) {

						// Watch for font load.
						utils.watchFont(font, font,

							/**
							 * @param {String} fontKey
							 * @param {Boolean} isLoaded
							 */
							function (fontKey, isLoaded) {

								// Check if font is located in font registry.
								if (that.fonts[fontKey]) {

									// Set font load state.
									that.fonts[fontKey].loaded = isLoaded;

								}

								// Execute font load handler to analyse state.
								loadHandler(fontLoad);

							}
						);

					} else {

						// Execute font load handler to analyse state.
						loadHandler(fontLoad);

					}

				}
			);

			// Loop all asset in the registry.
			utils.each(that.assets,

				/**
				 * @function
				 * @param {Object} asset
				 * @param {(Element|Node)} asset.target
				 * @param {String} asset.source
				 * @param {Boolean} asset.wait
				 * @param {Boolean} asset.polite
				 * @param {String} assetKey
				 */
				function (asset, assetKey) {

					// Check is asset has target.
					if (asset.target) {

						// Check if asset has to be waited.
						if (utils.arrayIndex(that.params.wait.assets, assetKey) >= 0) {

							// Attach error event listener.
							utils.addEventSimple(asset.target, 'error', assetErrorHandler);

							// Attach load event listener.
							utils.addEventSimple(asset.target, 'load', assetLoadHandler);

						}

						// Check if asset has to be loaded politely.
						if (asset.polite && !container.isPoliteReady()) {

							// Wait for polite ready event to place video.
							container.one(container.EVT_ADAPTER_POLITE, function () {

								// Start asset load.
								// NB! Sanitize asset URL before loading (will set correct protocol and traffic load indicator).
								asset.target.src = utils.getAssetUrl(asset.source);

							});

						} else {

							// Start asset load.
							// NB! Sanitize asset URL before loading (will set correct protocol and traffic load indicator).
							asset.target.src = utils.getAssetUrl(asset.source);

						}

					}

				}
			);

			// Execute empty load handler.
			loadHandler();

			// Set load timeout to secure banner appearance if something didn't load.
			that.timers.load = that.timeline.setTimeout(function () {

				// Update timeout flag.
				loadTimeout = true;

				// Handle load event.
				loadHandler();

			}, that.params.wait.timeout);

			return true;
		}

		return false;
	};

	/**
	 * Capture snapshot.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.capture = function () {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is initialised.
		if (that.inited && !that.captured) {

			// Clear stop timer.
			that.timeline.clearTimeout(that.timers.capture);

			// Let other operation end by triggering event on a next frame.
			that.timers.capture = that.timeline.setTimeout(function () {

				// Give time for banner elements to load.
				// Capture creative with a 3 second (default) delay.
				that.timers.capture = that.timeline.setTimeout(function () {

					// Set captured flag.
					that.captured = true;

					// Indicate that banner snapshot can be taken now.
					window.TACTIC_CAPTURE = true;

				}, that.params.capture.delay);

				// Call on capture callback.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'capture'

				});

			}, 0);

			return true;
		}

		return false;
	};

	/**
	 * Stop entire creative animation and playback.
	 *
	 * @function
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.stop = function () {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if layer is initialised.
		if (that.inited) {

			// Clear stop timer.
			that.timeline.clearTimeout(that.timers.stop);

			// Let other operation end by triggering event on a next frame.
			that.timers.stop = that.timeline.setTimeout(function () {

				// Indicate that creative is stopped.
				that.stopped = true;

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'stop'

				});

			}, 0);

			return true;
		}

		return false;
	};

	/**
	 * Provides layer destroyer.
	 * NB! Creative can not be destroyed.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.destroy = function () {
		return false;
	};

	/**
	 * Provides creative resizer.
	 * Differs from abstract only with existing delay.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.resize = function () {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if creative is initialised.
		// Check if holder is defined.
		if (that.inited) {

			// Clear resize timer.
			that.timeline.clearTimeout(that.timers.resize);

			// Set new resize threshold.
			that.timers.resize = that.timeline.setTimeout(function () {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'resize'

				});

			}, that.params.resize.delay);

			return true;
		}

		return false;
	};

	/**
	 * Set interaction flag.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.BannerLayer.prototype.interact = function () {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		// Check if creative is initialised.
		if (that.inited) {

			// Remove event as we don't need it any more.
			utils.removeEventSimple(that.target, 'mouseover', that.events.interaction_mousedown.callback);

			// Remove event as we don't need it any more.
			utils.removeEventSimple(that.target, 'touchstart', that.events.interaction_touchstart.callback);

			// Set interaction flag.
			that.interacted = true;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'interaction'

			});

		}

	};

	/**
	 * Get click tag URL depending on position.
	 *
	 * @function
	 * @param [index] {Number} Alternative click tag index.
	 * @return {Object}
	 */
	layers.BannerLayer.prototype.getClickTag = function (index) {

		var

			/**
			 * @type {tactic.builder.layers.BannerLayer}
			 */
			that = this;

		return {

			/**
			 * @type {String}
			 */
			url: that.clicktag.override ? ((that.clicktag.options[index] && utils.isUrl(that.clicktag.options[index].url)) ? that.clicktag.options[index].url
				: that.clicktag.url) : '',

			/**
			 * Check if definition has to be merged with click tag.
			 *
			 * @type {Object}
			 */
			vars: that.clicktag.synchronise ? that.definition : {}

		};
	};

	/**
	 * Frame layer constructor.
	 *
	 * @constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @param {Object} [override] - Component parameters.
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.FrameLayer = function (key, data, callback, parent, override, index) {

		/**
		 * @type {String}
		 */
		this.type = 'FrameLayer';

		// Set layer parameters and properties.
		this.set(key, data, callback, parent, override, index);

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.FrameLayer.prototype = new layers.AbstractLayer();
	layers.FrameLayer.prototype.constructor = layers.FrameLayer;

	/**
	 * Validate layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.FrameLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.FrameLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Set parameters.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5),

				/**
				 * Validate layer duration.
				 * @type {Number}
				 */
				duration: utils.isTypeOf(utils.isNumber, data.duration, 0)

			};

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer macros.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.FrameLayer.prototype.initMacros = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Add frame index macro.
			that.addMacro('index', {
				value: that.index,
				global: true
			});

			// Validate data.
			// Replace inherited macros in macro object and add those to layer.
			// NB! Macro replacement utility may reduce banner performance, use this feature wisely.
			return that.addMacros(data);
		}

		return false;
	};

	/**
	 * Image layer constructor.
	 * Places image HTML element into DOM.
	 *
	 * @constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @param {Object} [override] - Component parameters.
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.ImageLayer = function (key, data, callback, parent, override, index) {

		/**
		 * @type {String}
		 */
		this.type = 'ImageLayer';

		// Set layer parameters and properties.
		this.set(key, data, callback, parent, override, index);

		/**
		 * @type {Object}
		 */
		this.props = {

			/**
			 * @type {tactic.builder.props.PositionProp}
			 */
			position: null

		};

		/**
		 * @type {Object}
		 */
		this.asset = {

			/**
			 * Asset target.
			 *
			 * @type {(Element|Node)}
			 */
			target: null,

			/**
			 * @type {String}
			 */
			key: this.key + '_ASSET',

			/**
			 * Asset wrappers.
			 *
			 * @type {Object}
			 */
			tags: null,

			/**
			 * Asset source.
			 *
			 * @type {Object}
			 */
			source: null

		};

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.ImageLayer.prototype = new layers.AbstractLayer();
	layers.ImageLayer.prototype.constructor = layers.ImageLayer;

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.ImageLayer.prototype.initProps = function (data) {

		// Execute initial function.
		layers.AbstractLayer.prototype.initProps.apply(this, [data]);

		var

			/**
			 * @type {tactic.builder.layers.ImageLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Create new position property.
			that.props.position = new props.PositionProp(data.position);

			// Position property will be initialised on asset creation, as it requires asset source width and height dimensions and layer parameters.

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.ImageLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.ImageLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate parameters.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5),

				/**
				 * Validate HTML tag tags.
				 * @type  {Array}
				 */
				tags: utils.isTypeOf(utils.isArray, data.tags, []),

				/**
				 * Validate if polite load parameter is enabled.
				 * @type  {Boolean}
				 */
				polite: utils.isTypeOf(utils.isBoolean, data.polite, false),

				/**
				 * Validate alignment.
				 * @type  {Array}
				 */
				align: utils.isTypeOf(utils.isArray, data.align, ['center', 'middle']),

				/**
				 * Validate cropping
				 * @type  {Array}
				 */
				crop: utils.isTypeOf(utils.isArray, data.crop, [0, 0, 0, 0]),

				/**
				 * Validate scaling
				 * @type  {String}
				 */
				scale: utils.isTypeOf(utils.isString, data.scale, 'fill'),

				/**
				 * Validate if image source has to be zoomed at some value (source size multiplier).
				 * For example if you have slide in effect, and don't want to loose quality.
				 * @type  {Number}
				 */
				ratio: Number(utils.isTypeOf(utils.isNumber, data.ratio, 1)),

				// /**
				//  * Check if minimal asset sizes has to be taken in consideration.
				//  * @type  {Number}
				//  */
				// limit: Number(utils.isTypeOf(utils.isNumber, data.limit, 320))

				/**
				 * @type  {Object}
				 */
				limit: {

					/**
					 * Check if minimal asset size has to be taken in consideration.
					 * @type  {Number}
					 */
					min: Number(utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'limit.min'), 320)),

					/**
					 * Check if maximum asset size has to be taken in consideration.
					 * @type  {Number}
					 */
					max: Number(utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'limit.max'), 1920))

				}

			};

			// Check if ratio is not less than 1.
			if (that.params.ratio < 1) that.params.ratio = 1;

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer sources.
	 *
	 * @function
	 * @param {Array} data
	 * @return {Boolean}
	 */
	layers.ImageLayer.prototype.initSources = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.ImageLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Check if data feeding is enabled.
			if (that.feed.enabled) {

				// Set sources.
				that.sources = [
					{
						url: that.feed.value
					}
				];

			}

			// Check id data provided.
			else if (utils.isArray(data) && data.length > 0) {

				// Set sources.
				that.sources = data;

			} else {

				that.sources = [];

			}

			return true;
		}

		return false;
	};

	/**
	 * Load image into asset target.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.ImageLayer.prototype.load = function () {

		var

			/**
			 * @type {tactic.builder.layers.ImageLayer}
			 */
			that = this;

		// Check if not yet loaded, but initialised.
		if (that.inited && that.enabled && !that.loaded && !that.asset.target) {

			// Check if sources are not empty.
			if (that.sources.length > 0) {

				var

					/**
					 * @function
					 */
					loadAsset = function () {

						// Apply image source and track load progress.
						that.asset.target.src = utils.getAssetUrl(that.asset.source);

					},

					/**
					 * @function
					 */
					setAttribute = function () {

						// Add resize attribute to holder.
						that.addAttr(that.props.position.name, {

							/**
							 * @type {String}
							 */
							selector: '[data-key="' + that.asset.key + '"]',

							/**
							 * @type {Object}
							 */
							css: {

								/**
								 * @type {String}
								 */
								position: 'absolute',

								/**
								 * @type {String}
								 */
								left: that.props.position.left + 'px',

								/**
								 * @type {String}
								 */
								top: that.props.position.top + 'px',

								/**
								 * @type {String}
								 */
								width: that.props.position.width + 'px',

								/**
								 * @type {String}
								 */
								height: that.props.position.height + 'px'

							}

						});

					},

					/**
					 * We can't use anonymous function in dynamic layers, so make one here.
					 *
					 * @type {Function}
					 */
					assetLoadHandler = function (event) {

						// Remove load event listener.
						that.events.load = utils.removeEventSimple(that.asset.target, 'load', assetLoadHandler);

						if (that.props.position.enabled && (isNaN(that.props.position.width) || isNaN(that.props.position.height))) {

							// Update asset scale and position depending on alignment and crop parameters.
							that.props.position.update(that.asset.target.width, that.asset.target.height, that.width(), that.height(), that.params);

							setAttribute();

						}

						// Indicate that asset is loaded.
						that.loaded = true;

						// Trigger event.
						that.trigger({

							/**
							 * @type {String}
							 */
							type: 'load'

						});

					},

					/**
					 * @function
					 * @param {Event} event
					 */
					assetErrorHandler = function (event) {

						var

							/**
							 * @type {(Element|Node)}
							 */
							assetTarget = that.asset.target;

						if (assetTarget) {

							// Remove error event listener.
							utils.removeEventSimple(assetTarget, 'error', assetErrorHandler);

							var

								/**
								 * @type {String}
								 */
								assetSource = assetTarget.src;

							// Check if asset is of SVG type.
							if (assetSource && assetSource.indexOf('.svg') !== -1) {

								// This will try to replace asset to PNG format in case if browser doesn't support SVG.
								// NB! Requires a PNG asset duplicate of SVG that is placed at same location.
								assetTarget.src = assetSource.replace(/.svg$/, '.png');

							}

						}

					};

				// Create new HTML element.
				that.asset.target = document.createElement('img');

				// Wrapper asset into tag or tags, if params are provided.
				// Important to run this script before placement, as may lead to creation of new DOM elements.
				that.asset.tags = utils.wrapElement(that.params.tags);

				// Set asset key attribute.
				that.asset.target.setAttribute('data-key', that.asset.key);

				// Wrapper asset into tag or tags, if params are provided.
				// Important to run this script before placement, as may lead to creation of new DOM elements.
				that.asset.tags = utils.wrapElement(that.params.tags);

				// Check if tag was created.
				if (that.asset.tags && utils.isElement(that.asset.tags.initial) && utils.isElement(that.asset.tags.latest)) {

					// Append initial wrapper element to layer target.
					that.target.appendChild(that.asset.tags.initial);

					// Append asset to latest wrapper element.
					that.asset.tags.latest.appendChild(that.asset.target);

				} else {

					// Append asset to layer target.
					that.target.appendChild(that.asset.target);

				}

				// Attach load event listener.
				that.events.load = utils.addEventSimple(that.asset.target, 'load', assetLoadHandler);

				// Remove load event listener.
				that.events.error = utils.addEventSimple(that.asset.target, 'error', assetErrorHandler);

				// // Timeout is required for very specific re-initialisation cases (added on Mar 2020 for telecom customer).
				// that.timeline.setTimeout(function () {
				//
				// }, 0);

				// Update asset scale and position depending on alignment and crop parameters.
				// Update position, so correct source can be selected.
				// This could lead to NaN for position.width and position.height, if dimensions are not set in data.
				// In this case, position will try to update again after image load, no size load optimisation will work then.
				that.props.position.update(that.sources[0].width, that.sources[0].height, that.width(), that.height(), that.params);

				// Check if image size can be adjusted.
				if (that.props.position.enabled) {

					// Now, when we know appropriate asset source depending on scaling parameters, we can select appropriate size of the source.
					that.asset.source = utils.getAssetSource(that.sources, that.props.position.width * that.params.ratio, that.props.position.height * that.params.ratio, that.params.limit.min, that.params.limit.max);

					if (!isNaN(that.props.position.width) && !isNaN(that.props.position.height)) {
						setAttribute();
					}

				} else {

					// Now, when we know appropriate asset source depending on scaling parameters, we can select appropriate size of the source.
					that.asset.source = utils.getAssetSource(that.sources, that.width() * that.params.ratio, that.height() * that.params.ratio, that.params.limit.min, that.params.limit.max);

				}

				// Check if video has to be loaded politely.
				if (that.params.polite === true && !container.isPoliteReady()) {

					// Wait for polite ready event to place video.
					container.one(container.EVT_ADAPTER_POLITE, function () {

						// Load image.
						loadAsset();

					});

				} else {

					// Load image.
					loadAsset();

				}

			} else {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'empty'

				});

			}

			return true;
		}

		return false;
	};

	/**
	 * Provides layer asset destroyer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.ImageLayer.prototype.unload = function () {

		var

			/**
			 * @type {tactic.builder.layers.ImageLayer}
			 */
			that = this;

		// Check if layer is initialised and asset exists.
		if (that.inited && that.loaded) {

			// Check if tag was created.
			if (that.asset.tags && that.asset.tags.initial) {

				// Remove wrapper.
				that.target.removeChild(that.asset.tags.initial);

			} else if (that.asset.target) {

				// Remove asset.
				that.target.removeChild(that.asset.target);

			}

			// Destroy holder.
			that.asset.tags = null;

			// Destroy source.
			that.asset.source = null;

			// Destroy target.
			that.asset.target = null;

			// Indicate that asset is no longer loaded.
			that.loaded = false;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'unload'

			});

		}

		return false;
	};

	/**
	 * Joint layer constructor.
	 *
	 * @constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @param {Object} [override] - Component parameters.
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.JointLayer = function (key, data, callback, parent, override, index) {

		/**
		 * @type {String}
		 */
		this.type = 'JointLayer';

		// Set layer parameters and properties.
		this.set(key, data, callback, parent, override, index);

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.JointLayer.prototype = new layers.AbstractLayer();
	layers.JointLayer.prototype.constructor = layers.JointLayer;

	layers.SequenceLayer = function (key, data, callback, parent, override, index) {

		/**
		 * @type {String}
		 */
		this.type = 'SequenceLayer';

		/**
		 * @type {tactic.builder.layers.SequenceLayer}
		 */
		this.sequence = this;

		/**
		 * @type {Array}
		 */
		this.frames = [];

		// Set layer parameters and properties.
		this.set(key, data, callback, parent, override, index);

		/**
		 * Define previous frame of a sequence.
		 * Will be defined on sequence frame change.
		 * @type {Object}
		 */
		this.previous = null;

		/**
		 * Define current frame of a sequence.
		 * Will be defined on sequence frame change.
		 * @type {Object}
		 */
		this.current = null;

		/**
		 * Define next frame of a sequence.
		 * Will be defined on sequence frame change.
		 *
		 * @type {Object}
		 */
		this.next = null;

		/**
		 * Define sequence change history.
		 *
		 * @type {Array}
		 */
		this.history = [];

		/**
		 * Indicate sequence state.
		 *
		 * @type {Number}
		 */
		this.state = NaN;

		/**
		 * Indicates sequence direction. "-1" means backward, "1" means forward.
		 * You can also change to more than one frame if required.
		 *
		 * @type {Number}
		 */
		this.direction = NaN;

		/**
		 * Indicates amount of passed loops.
		 *
		 * @type {Number}
		 */
		this.loops = 0;

		/**
		 * Indicates amount of passed frames.
		 *
		 * @type {Number}
		 */
		this.changes = 0;

		/**
		 * Define that sequence is not looped.
		 *
		 * @type {Boolean}
		 */
		this.looped = false;

		/**
		 * Define that sequence frame is not repeated.
		 *
		 * @type {Boolean}
		 */
		this.repeated = false;

		/**
		 * Define if sequence is paused.
		 *
		 * @type {Boolean}
		 */
		this.paused = undefined;

		/**
		 * Define if sequence is stopped.
		 *
		 * @type {Boolean}
		 */
		this.stopped = false;

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.SequenceLayer.prototype = new layers.AbstractLayer();
	layers.SequenceLayer.prototype.constructor = layers.SequenceLayer;

	/**
	 * Initialise layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.SequenceLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate properties and extract exceptions.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5),

				/**
				 * Validate sequence play point.
				 * @type {Object}
				 */
				play: {

					/**
					 * Sequence will play from specific frame state. "0" is e to current frame.
					 * @type {Number}
					 */
					from: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'play.from'), 0)

				},

				/**
				 * Validate sequence pause point.
				 * @type {Object}
				 */
				pause: {

					/**
					 * Sequence will pause after.
					 * @type {Object}
					 */
					after: {

						/**
						 * Sequence will pause after certain period of time (milliseconds). "0" is e to never.
						 * @type {Number}
						 */
						time: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'pause.after.time'), NaN),

						/**
						 * Sequence will pause after passing certain amount of frames. "NaN" is e to not after any.
						 * @type {Number}
						 */
						frame: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'pause.after.frame'), NaN),

						/**
						 * Sequence will pause after passing certain amount of loops. "NaN" is e to not after any.
						 * @type {Number}
						 */
						loop: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'pause.after.loop'), NaN)

					}

				},

				/**
				 * Validate sequence stop point.
				 * @type {Object}
				 */
				stop: {

					/**
					 * Sequence will stop on specific frame state. "NaN" is e to current frame.
					 * @type {Number}
					 */
					on: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'stop.on'), NaN)

				},

				/**
				 * Validate sequence frame loading options.
				 * @type {Object}
				 */
				load: {

					/**
					 * Amount of frames to be pre-loaded with assets before current frame.
					 * @type {Number}
					 */
					before: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'load.before'), 0),

					/**
					 * Amount of frames to be pre-loaded with assets after current frame.
					 * @type {Number}
					 */
					after: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'load.after'), 1)

				},

				/**
				 * Validate sequence direction.
				 * @type {Number}
				 */
				direction: utils.isTypeOf(utils.isNumber, data.direction, 1)

			};

			return true;
		}

		return false;
	};

	/**
	 * Check if layer can be accessed.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.SequenceLayer.prototype.available = function () {

		var

			/**
			 * @type {tactic.builder.layers.AbstractLayer}
			 */
			that = this;

		// Check if layer is initialised and enabled.
		// if (that.inited && that.enabled && that.loaded) {
		// Sequence
		if (that.inited && that.enabled) {

			// Check if layer is available depending on sequence position and creative stop flag.
			return (that.sequence === that || (!that.sequence || !!that.entered));
		}

		return false;
	};

	/**
	 * Start sequence layer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.SequenceLayer.prototype.play = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check is layer is enabled.
		if (that.inited && that.enabled) {

			// Check if layer wasn't started yet.
			// Check if sequence is not stopped.
			if (utils.isUndefined(that.paused) && !that.stopped) {

				// Clear sequence change timer.
				that.timeline.clearTimeout(that.timers.change);

				// Check if sequence has to be paused after period of time.
				if (!isNaN(that.params.pause.after.time)) {

					// Set sequence rotation pause timer.
					that.timers.pause = that.timeline.setTimeout(function () {

						// Pause sequence.
						that.pause();

					}, that.params.pause.after.time);

				}

				// Change layer pause flag.
				that.paused = false;

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'play'

				});

				// Change frame state.
				that.change(that.params.play.from);

			} else {

				// Change layer pause flag.
				that.paused = false;

				// Just secure frame change in a sequence.
				that.change(that.state);

			}

			return true;
		}

		return false;
	};

	/**
	 * Pause sequence layer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.SequenceLayer.prototype.pause = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check is layer is enabled.
		if (that.inited && that.enabled) {

			// Clear sequence change timer.
			that.timeline.clearTimeout(that.timers.change);

			// Clear sequence change timer.
			that.timeline.clearTimeout(that.timers.pause);

			if (that.paused === false) {

				// Change layer pause flag.
				that.paused = true;

				// Check if sequence is not paused.
				if (!isNaN(that.state)) {

					// Trigger event.
					that.trigger({

						/**
						 * @type {String}
						 */
						type: 'pause'

					});

				}

			}

			return true;
		}

		return false;
	};

	/**
	 * Stop sequence layer.
	 *
	 * @function
	 * @param {Boolean} [ignoreStopOn]
	 * @return {Boolean}
	 */
	layers.SequenceLayer.prototype.stop = function (ignoreStopOn) {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check is layer is enabled.
		if (that.inited && that.enabled) {

			// Clear sequence change timer.
			that.timeline.clearTimeout(that.timers.stop);

			// Clear sequence change timer.
			that.timeline.clearTimeout(that.timers.change);

			// Clear sequence change timer.
			that.timeline.clearTimeout(that.timers.pause);

			// Set pause state to undefined, so sequence won't start changing frames.
			that.stopped = true;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'stop'

			});

			// Check if sequence has to be paused on a specific frame.
			if (!isNaN(that.params.stop.on) && !ignoreStopOn) {

				// Change sequence state.
				that.change(that.params.stop.on);

			}

			return true;
		}

		return false;
		return false;
	};

	/**
	 * Toggle pause sequence layer.
	 *
	 * @function
	 * @return {Number}
	 */
	layers.SequenceLayer.prototype.toggle = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check if layer is enabled.
		if (that.inited && that.enabled) {

			// Check if sequence is paused.
			if (that.paused) {

				// Resume sequence rotation.
				that.play();

			} else {

				// Pause sequence.
				that.pause();

			}

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'toggle'

			});

			return that.state;
		}

		return NaN;
	};

	/**
	 * Change sequence layer state.
	 *
	 * @function
	 * @param {Number} state
	 * @return {Number}
	 */
	layers.SequenceLayer.prototype.change = function (state) {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check is layer is enabled.
		if (that.inited && that.enabled) {

			var

				/**
				 * Analyse and validate sequence state.
				 *
				 * @function
				 * @param {Number} [state]
				 * @return {Number}
				 */
				validateFramePosition = function (state) {

					// Check if new state is not a a number.
					if (isNaN(state)) {

						// Set state to latest state.
						state = (!isNaN(that.state) ? that.state : 0);

					}

					// Check if new state is out of possible sequence bounds.
					if (state < 0 || state >= that.frames.length) {

						// Set new state depending on sequence state and direction.
						state = (that.direction >= 0 ? (state < 0 ? (that.frames.length - 1) : 0) : (state > 0 ? 0 : (that.frames.length - 1)));

					}

					return state;
				};

			// Clear change timer.
			that.timeline.clearTimeout(that.timers.change);

			// Change loop state.
			that.looped = false;

			// Change repeat state.
			that.repeated = false;

			// Check if layer direction is set.
			if (isNaN(that.direction)) {

				// Set default direction from params.
				that.direction = that.params.direction;

			}

			// // Check if direction is correct (depending on new state), change it if not.
			// if (state > that.state) {
			//
			// 	// Change direction to positive.
			// 	that.direction = Math.abs(that.direction);
			//
			// }
			// else if (state < that.state && that.direction > 0) {
			//
			// 	// Change direction to negative.
			// 	that.direction = -Math.abs(that.direction);
			//
			// }

			// Validate new state.
			state = validateFramePosition(state);

			// Check if current state is not the same and has to be changed.
			if (that.state !== state) {

				// Change frame (layer) state.
				that.state = state;

				// Count new passed frame.
				that.changes++;

			} else {

				// Set repeat flag.
				that.repeated = true;

			}

			// Push state to history.
			that.history.push(that.state);

			// Check if there are more than one frame in sequence. Otherwise means that there are no next and previous frames.
			if (that.frames.length > 1) {

				// Check if new previous frame should be set as old current (also check if it is not the same as new current).
				if (that.current && that.current !== that.frames[that.state]) {

					// Identify old current frame as new previous.
					that.previous = that.current;

				} else {

					// Check if old previous frame exists. Means that there were no animation before.
					if (that.previous) {

						// Update new previous frame.
						that.previous = that.frames[validateFramePosition(that.state - that.direction)];

					}

				}

				// Identify new next frame.
				that.next = that.frames[validateFramePosition(that.state + that.direction)];

			}

			// Define new current frame.
			that.current = that.frames[that.state];

			// Check if sequence has several frames and current frame duration is not e to zero (means endless).
			// Check if sequence is not paused.
			if (that.paused === false && that.stopped !== true && that.current && that.current.inited && that.frames.length > 1 && that.current.params.duration > 0) {

				// Set timer to change frame.
				that.timers.change = that.timeline.setTimeout(function () {

					// Check if sequence has to be paused if frame or loop count exceeded.
					if ((!isNaN(that.params.pause.after.loop) && that.loops >= that.params.pause.after.loop) || (!isNaN(that.params.pause.after.frame) && that.changes >= that.params.pause.after.frame)) {

						// Pause sequence.
						that.pause();

					} else {

						// Change frame to next or previous depending on direction.
						that.change(that.state + that.direction);

					}

				}, that.current.params.duration);

			}

			// Check if new loop passed.
			if ((that.changes / that.frames.length - 1) >= that.loops) {

				// Count new passed loop.
				that.loops++;

				// Set loop flag.
				that.looped = true;

			}

			// Check if current state was defined.
			if (that.current) {

				// Execute frame enter event current layers.
				that.current.execute(function () {

					var

						/**
						 * @type {tactic.builder.layers.AbstractLayer}
						 */
						layer = this;

					// // Clear enter timer.
					// layer.timeline.clearTimeout(layer.timers.enter);
					//
					// // Set timeout to five time to elements to append.
					// layer.timers.enter = that.timeline.setTimeout(function () {
					//
					//
					//
					// }, 0);

					// Indicate that layer is entered.
					layer.entered = true;

					// Apply callback function.
					layer.trigger({

						/**
						 * @type {String}
						 */
						type: 'enter'

					});

				}, true);

			}

			// Check if previous state was defined.
			if (that.previous) {

				// Execute frame leave event on previous layer.
				that.previous.execute(function () {

					var

						/**
						 * @type {tactic.builder.layers.AbstractLayer}
						 */
						layer = this;

					// // Clear leave timer.
					// layer.timeline.clearTimeout(layer.timers.leave);
					//
					// // Set timeout to five time to elements to append.
					// layer.timers.leave = that.timeline.setTimeout(function () {
					//
					//
					//
					// }, 0);

					// Apply callback function.
					layer.trigger({

						/**
						 * @type {String}
						 */
						type: 'leave'

					});

					// Indicate that layer is no longer entered.
					layer.entered = false;

				}, true);

			}

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'change'

			});

			return that.state;
		}

		return NaN;
	};

	/**
	 * Change sequence layer direction.
	 *
	 * @function
	 * @return {Number}
	 */
	layers.SequenceLayer.prototype.changeNext = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check if layer is enabled.
		if (that.inited && that.enabled) {

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'next'

			});

			// Change sequence to next frame.
			return that.change(that.state + that.direction);
		}

		return NaN;
	};

	/**
	 * Change sequence layer direction.
	 *
	 * @function
	 * @return {Number}
	 */
	layers.SequenceLayer.prototype.changePrevious = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check if layer is enabled.
		if (that.inited && that.enabled) {

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'previous'

			});

			// Change sequence to previous frame.
			return that.change(that.state - that.direction);
		}

		return NaN;
	};

	/**
	 * Change sequence layer direction.
	 *
	 * @function
	 * @return {Number}
	 */
	layers.SequenceLayer.prototype.reverse = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check if layer is enabled.
		if (that.inited && that.enabled) {

			// Change direction to opposite.
			that.direction = -that.direction;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'reverse'

			});

			return that.direction;
		}

		return NaN;
	};

	/**
	 * Load frames in sequence layer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.SequenceLayer.prototype.load = function () {

		var

			/**
			 * @type {tactic.builder.layers.SequenceLayer}
			 */
			that = this;

		// Check is layer is enabled.
		if (that.inited && that.enabled) {

			var

				/**
				 * @type {Array}
				 */
				loadList = [];

			var

				/**
				 * Define how many frames have to be loaded before 0 state (reverse direction).
				 *
				 * @type {Number}
				 */
				deltaBefore = 0;

			// Check if before load state is located from opposite sequence direction.
			if (that.state - that.params.load.before < 0) {

				// Update delta.
				deltaBefore = that.params.load.before - that.state;

			}

			var

				/**
				 * Define how many frames have to be loaded after 0 state (reverse direction).
				 *
				 * @type {Number}
				 */
				deltaAfter = 0;

			// Check if after load state is located from opposite sequence direction.
			if (that.state + that.params.load.after > (that.frames.length - 1)) {

				// Update delta.
				deltaAfter = that.params.load.after + that.state - (that.frames.length - 1);

			}

			// Loop all frames.
			for (var i in that.frames) {

				var

					/**
					 * Define load trigger, make it false as default value.
					 * @type {Boolean}
					 */
					load = false;

				// Check if frame is in load range.
				if (i >= (that.state - that.params.load.before) && i <= (that.state + that.params.load.after)) {

					// Set load trigger for frame.
					load = true;

				}

				// Check if frame is in load range, but before 0 state.
				else if (i >= (that.frames.length - deltaBefore)) {

					// Set load trigger for frame.
					load = true;

				}

				// Check if frame is in load range, but after 0 state.
				else if (i <= (deltaAfter - 1)) {

					// Set load trigger for frame.
					load = true;

				}

				// Check if frame has to be loaded.
				if (load) {

					// Execute load function on all layers recursively.
					that.frames[i].execute('load', true);

				}

				// Indicate if frame has to be loaded in the final list.
				loadList.push(load);

			}

			// Indicate that layer is loaded.
			that.loaded = true;

			// Set timeout on asset source placement.
			// Pause is required to give time to DOM elements to append.
			that.timers.load = that.timeline.setTimeout(function () {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'load',

					/**
					 * @type {Object}
					 */
					detail: {

						/**
						 * @type {Array}
						 */
						list: loadList

					}

				});

			}, 0);

			return true;
		}

		return false;
	};

	/**
	 * Text layer constructor.
	 * Injects text string into DOM.
	 *
	 * @constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @param {Object} [override] - Component parameters.
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.TextLayer = function (key, data, callback, parent, override, index) {

		/**
		 * @type {String}
		 */
		this.type = 'TextLayer';

		// Set layer parameters and properties.
		this.set(key, data, callback, parent, override, index);

		/**
		 * @type {Object}
		 */
		this.props = {

			/**
			 * @type {tactic.builder.props.FontProp}
			 */
			font: null

		};

		/**
		 * @type {Object}
		 */
		this.asset = {

			/**
			 * Asset target.
			 *
			 * @type {(Element|Node)}
			 */
			target: null,

			/**
			 * @type {String}
			 */
			key: this.key + '_ASSET',

			/**
			 * Asset wrappers.
			 *
			 * @type {Object}
			 */
			tags: null,

			/**
			 * Asset source.
			 *
			 * @type {Object}
			 */
			source: null

		};

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.TextLayer.prototype = new layers.AbstractLayer();
	layers.TextLayer.prototype.constructor = layers.TextLayer;

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.TextLayer.prototype.initProps = function (data) {

		// Execute initial function.
		layers.AbstractLayer.prototype.initProps.apply(this, [data]);

		var

			/**
			 * @type {tactic.builder.layers.TextLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Create new position property.
			that.props.font = new props.FontProp(utils.isTypeOf(utils.isObject, data.font, {}));

			// Font property will be initialised on asset load, as it requires asset width and height dimensions and layer parameters.

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.TextLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.TextLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate properties and extract exceptions.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5),

				/**
				 * Validate HTML tag tags.
				 * @type  {Array}
				 */
				tags: utils.isTypeOf(utils.isArray, data.tags, []),

				/**
				 * Validate line break params.
				 * @type  {Object}
				 */
				line: {

					/**
					 * Validate HTML element before line break.
					 * @type  {String}
					 */
					before: utils.isTypeOf(utils.isString, utils.getObjectDeep(data, 'line.before'), ''),

					/**
					 * Validate HTML element after line break.
					 * @type  {String}
					 */
					after: utils.isTypeOf(utils.isString, utils.getObjectDeep(data, 'line.after'), '<br/>')

				},

				/**
				 * @type {Object}
				 */
				wait: {

					/**
					 * @type {Array}
					 */
					fonts: utils.isTypeOf(utils.isBoolean, utils.getObjectDeep(data, 'wait.fonts'), true),

					/**
					 * @type {Number}
					 */
					timeout: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'wait.timeout'), 1000)

				}

			};

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer sources.
	 *
	 * @function
	 * @param {Array} data
	 * @return {Boolean}
	 */
	layers.TextLayer.prototype.initSources = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.TextLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Check if data feeding is enabled.
			if (that.feed.enabled) {

				// Set sources.
				that.sources = [
					{
						text: utils.isTypeOf(utils.isString, that.feed.value, '')
					}
				];

			}

			// Check if data provided.
			else if (utils.isArray(data) && data.length > 0) {

				// Loop text sources descendingly to check if sources are valid.
				for (var i = data.length - 1; i >= 0; i--) {

					// Check if text is number.
					if (!isNaN(data[i].text)) {

						// Convert text to string.
						data[i].text += '';

					}

					// Check if source has text.
					if (utils.isEmptyString(data[i].text)) {

						// Remove asset source.
						data.splice(i, 1);

					}

				}

				// Set sources.
				that.sources = data;

				// Sort sources by length, so the longest text will be in front.
				that.sources.sort(function (a, b) {
					if (a.length < b.length) {
						return 1;
					}
					if (a.length > b.length) {
						return -1;
					}
					return 0;
				});

			} else {

				// Set sources.
				that.sources = [];

			}

			return true;
		}

		return false;
	};

	/**
	 * Insert text into asset target.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.TextLayer.prototype.load = function () {

		var

			/**
			 * @type {tactic.builder.layers.TextLayer}
			 */
			that = this;

		// Check if not yet loaded, but initialised.
		if (that.inited && that.enabled && !that.loaded && !that.asset.target) {

			// Check if sources are not empty.
			if (that.sources.length > 0) {

				// Create new HTML element.
				that.asset.target = document.createElement('span');

				// Wrapper asset into tag or tags, if params are provided.
				// Important to run this script before placement, as may lead to creation of new DOM elements.
				that.asset.tags = utils.wrapElement(that.params.tags);

				// Set asset key attribute.
				that.asset.target.setAttribute('data-key', that.asset.key);

				// Check if tag was created.
				if (that.asset.tags && utils.isElement(that.asset.tags.initial) && utils.isElement(that.asset.tags.latest)) {

					// Append initial element to layer target.
					that.target.appendChild(that.asset.tags.initial);

					// Append asset to latest element.
					that.asset.tags.latest.appendChild(that.asset.target);

				} else {

					// Append asset to layer target.
					that.target.appendChild(that.asset.target);

				}

				var

					/**
					 * @function
					 */
					assetLoadHandler = function () {

						// Set timeout on asset source placement.
						// Pause is required to give time to DOM elements to append.
						that.timers.load = that.timeline.setTimeout(function () {

							// Loop text sources descendingly to find out what source is the best match for container size.
							for (var i = 0; i < that.sources.length; i++) {

								// Set the latest matching source.
								that.asset.source = that.sources[i];

								// Fill asset target with text.
								that.asset.target.innerHTML
									= that.params.line.before + that.asset.source.text.split(/\r\n|\n|\r/).join(that.params.line.after + that.params.line.before).split('  ').join(' &nbsp;') + that.params.line.after;

								// Check if text source fits layer holder target and target without resizing font size.
								if (that.holder.width() <= that.wrapper.width() && that.holder.height() <= that.wrapper.height()) {

									// Break loop if text fits the best.
									break;

								}

							}

							// Update asset font size.
							that.props.font.update(that.holder.target, that.wrapper.width(), that.wrapper.height());

							// Check if text size can be adjusted.
							if (that.props.font.enabled) {

								// Add resize attribute to holder.
								that.holder.addAttr(that.props.font.name, {

									/**
									 * @type {Object}
									 */
									css: {

										/**
										 * @type {String}
										 */
										'font-size': that.props.font.value + 'px'

									}

								});

							}

							// Indicate that asset is loaded.
							that.loaded = true;

							// Trigger event.
							that.trigger({

								/**
								 * @type {String}
								 */
								type: 'load'

							});

						}, 0);

					};

				// Check if we have to wait for the font load.
				if (that.params.wait.fonts) {

					// Watch for font load.
					utils.watchFont(that.selector, null,

						/**
						 * @param {String} fontKey
						 * @param {Boolean} isLoaded
						 */
						function (fontKey, isLoaded) {

							// Complete load.
							assetLoadHandler();

						}, that.target, that.params.wait.timeout);

				} else {

					// Complete load without waiting for the font load.
					assetLoadHandler();

				}

			} else {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'empty'

				});

			}

			return true;
		}

		return false;
	};

	/**
	 * Provides layer asset destroyer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.TextLayer.prototype.unload = function () {

		var

			/**
			 * @type {tactic.builder.layers.TextLayer}
			 */
			that = this;

		// Check if layer is initialised and asset exists.
		if (that.inited && that.asset) {

			// Check if tag was created.
			if (that.asset.tags && that.asset.tags.initial) {

				// Remove wrapper.
				that.target.removeChild(that.asset.tags.initial);

			} else if (that.asset.target) {

				// Remove asset.
				that.target.removeChild(that.asset.target);

			}

			// Destroy holder.
			that.asset.tags = null;

			// Destroy source.
			that.asset.source = null;

			// Destroy target.
			that.asset.target = null;

			// Indicate that asset is no longer loaded.
			that.loaded = false;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'unload'

			});

			return true;
		}

		return false;
	};

	/**
	 * Video element constructor.
	 * Places video into HTML element.
	 *
	 * @constructor
	 * @param {String} key - Component key.
	 * @param {Object} data - Component data.
	 * @param {Function} [callback] - Complete event handler.
	 * @param {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)} parent
	 * @param {Object} [override] - Component parameters.
	 * @param {Number} [index] - Layer index (if is part of array).
	 */
	layers.VideoLayer = function (key, data, callback, parent, override, index) {

		/**
		 * @type {String}
		 */
		this.type = 'VideoLayer';

		// Set layer parameters and properties.
		this.set(key, data, callback, parent, override, index);

		/**
		 * @type {Object}
		 */
		this.props = {

			/**
			 * @type {tactic.builder.props.PositionProp}
			 */
			position: null

		};

		/**
		 * @type {Object}
		 */
		this.asset = {

			/**
			 * Asset target.
			 *
			 * @type {(Element|Node)}
			 */
			target: null,

			/**
			 * @type {String}
			 */
			key: this.key + '_ASSET',

			/**
			 * Asset wrapper.
			 *
			 * @type {Object}
			 */
			tags: null,

			/**
			 * Asset source.
			 *
			 * @type {Object}
			 */
			source: null,

			/**
			 * @type {Object}
			 */
			resume: null

		};

		// Trigger event.
		this.trigger({

			/**
			 * @type {String}
			 */
			type: 'set'

		});

	};
	layers.VideoLayer.prototype = new layers.AbstractLayer();
	layers.VideoLayer.prototype.constructor = layers.VideoLayer;

	/**
	 * Initialise layer properties.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.initProps = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Create new position property.
			that.props.position = new props.PositionProp(utils.isTypeOf(utils.isObject, data.position, {}));

			// Position property will be initialised on asset creation, as it requires asset source width and height dimensions and layer parameters.

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer parameters.
	 *
	 * @function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.initParams = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Validate properties and extract exceptions.
			that.params = {

				/**
				 * @type  {String}
				 */
				holder: utils.isTypeOf(utils.isString, data.holder, null),

				/**
				 * @type  {String}
				 */
				wrapper: utils.isTypeOf(utils.isString, data.wrapper, null),

				/**
				 * @type  {Number}
				 */
				depth: utils.isTypeOf(utils.isNumber, data.depth, -5),

				/**
				 * Validate HTML tag tags.
				 * @type  {Array}
				 */
				tags: utils.isTypeOf(utils.isArray, data.tags, []),

				/**
				 * Validate if polite load parameter is enabled.
				 * @type  {Boolean}
				 */
				polite: utils.isTypeOf(utils.isBoolean, data.polite, true),

				/**
				 * Validate alignment.
				 * @type  {Array}
				 */
				align: utils.isTypeOf(utils.isArray, data.align, ['center', 'middle']),

				/**
				 * Validate cropping
				 * @type  {Array}
				 */
				crop: utils.isTypeOf(utils.isArray, data.crop, [0, 0, 0, 0]),

				/**
				 * Validate scaling
				 * @type  {String}
				 */
				scale: utils.isTypeOf(utils.isString, data.scale, 'fill'),

				/**
				 * Validate if image source has to be zoomed at some value (source size multiplier).
				 * For example if you have slide in effect, and don't want to loose quality.
				 * @type  {Number}
				 */
				ratio: Number(utils.isTypeOf(utils.isNumber, data.ratio, 1)),

				// /**
				//  * Check if minimal asset sizes has to be taken in consideration.
				//  * @type  {Number}
				//  */
				// limit: Number(utils.isTypeOf(utils.isNumber, data.limit, 320))

				/**
				 * @type  {Object}
				 */
				limit: {

					/**
					 * Check if minimal asset size has to be taken in consideration.
					 * @type  {Number}
					 */
					min: Number(utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'limit.min'), 320)),

					/**
					 * Check if maximum asset size has to be taken in consideration.
					 * @type  {Number}
					 */
					max: Number(utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'limit.max'), 1920))

				},

				/**
				 * Validate autoplay value.
				 * @type  {Boolean}
				 */
				autoplay: utils.isTypeOf(utils.isBoolean, data.autoplay, false),

				/**
				 * Validate controls value.
				 * @type  {Boolean}
				 */
				controls: utils.isTypeOf(utils.isBoolean, data.controls, false),

				/**
				 * Validate fullscreen value.
				 * @type  {Boolean}
				 */
				fullscreen: utils.isTypeOf(utils.isBoolean, data.fullscreen, false),

				/**
				 * Validate video starting point.
				 * @type {Object}
				 */
				start: {

					/**
					 * Video will start from specific time.
					 * @type {Number}
					 */
					from: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'start.from'), NaN)

				},

				/**
				 * Validate video stopping point.
				 * @type {Object}
				 */
				stop: {

					/**
					 * Video will stop on specific time.
					 * @type {Number}
					 */
					on: utils.isTypeOf(utils.isNumber, utils.getObjectDeep(data, 'stop.on'), NaN)

				},

				/**
				 * Validate loop value.
				 * @type  {Boolean}
				 */
				loop: utils.isTypeOf(utils.isBoolean, data.loop, true),

				/**
				 * Validate mute value.
				 * NB! Ad policy require banner to be muted on initial display.
				 * @type  {Boolean}
				 */
				muted: utils.isTypeOf(utils.isBoolean, data.muted, true),

				/**
				 * Validate poster value.
				 * @type  {String}
				 */
				poster: utils.isTypeOf(utils.isString, data.poster, null),

				/**
				 * Validate preload value.
				 * @type  {String}
				 */
				preload: utils.isTypeOf(utils.isString, data.preload, 'metadata'),

				/**
				 * Validate inline video value.
				 * Equal to "playsinline" webkit parameter.
				 * https://webkit.org/blog/6784/new-video-policies-for-ios/
				 * @type  {Boolean}
				 */
				inline: utils.isTypeOf(utils.isBoolean, data.inline, true),

				/**
				 * Validate volume value.
				 * @type  {Number}
				 */
				volume: utils.isTypeOf(utils.isNumber, data.volume, 0.8)

			};

			// Check if ratio is not less than 1.
			if (that.params.ratio < 1) that.params.ratio = 1;

			return true;
		}

		return false;
	};

	/**
	 * Initialise layer sources.
	 *
	 * @function
	 * @param {Array} data
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.initSources = function (data) {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is not yet initialised.
		if (!that.inited) {

			// Check if data feeding is enabled.
			if (that.feed.enabled) {

				// Set sources.
				that.sources = [
					{
						url: that.feed.value
					}
				];

			}

			// Check id data provided.
			else if (utils.isArray(data) && data.length > 0) {

				// Set sources.
				that.sources = data;

			} else {

				that.sources = [];

			}

			return true;
		}

		return false;
	};

	/**
	 * Load video into asset target.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.load = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if not yet loaded, but initialised.
		if (that.inited && that.enabled && !that.loaded && !that.asset.target) {

			// Check if sources are not empty.
			if (that.sources.length > 0) {

				var

					/**
					 * @function
					 */
					loadAsset = function () {

						// Extra check for initialisation, as this event was not destroyed.
						if (that.inited) {

							// Check if poster has to be picked from asset source as thumb image.
							if (that.params.poster === 'thumb') {

								//  Set video poster.
								that.asset.target.poster = utils.getAssetUrl(that.asset.source, 'thumb_url');

							}

							// Check if poster has to be picked from asset source as preview image.
							else if (that.params.poster === 'preview') {

								//  Set video poster.
								that.asset.target.poster = utils.getAssetUrl(that.asset.source, 'preview_url');

							}

							// Check if poster is an image URL.
							else if (utils.isUrl(that.params.poster)) {

								//  Set video poster URL.
								that.asset.target.poster = that.params.poster;

							}

							that.asset.target.src = utils.getAssetUrl(that.asset.source);

							// var
							//
							// 	/**
							// 	 * Create new source element.
							// 	 * @type {Element}
							// 	 */
							// 	source = document.createElement('source');
							//
							// // Set source URL.
							// source.src = utils.getAssetUrl(that.asset.source);
							//
							// // Set source type.
							// source.type = 'video/mp4';
							//
							// // Append source to asset target.
							// that.asset.target.appendChild(source);

						}

					},

					/**
					 * @function
					 * @param event {Event}
					 */
					assetLoadHandler = function (event) {

						// Remove on laod event.
						that.events.load = utils.removeEventSimple(that.asset.target, 'loadedmetadata', assetLoadHandler);

						// Indicate that video asset is loaded.
						that.loaded = true;

						// Check if layer is available.
						// Ignore stopped parameter.
						if (that.available()) {

							// Check if video has to be resumed to latest position.
							if (that.asset.resume) {

								// Go to latest video time.
								that.asset.target.currentTime = that.asset.resume.time;

							}

							// Otherwise start it from parameter position.
							else if (!isNaN(that.params.start.from)) {

								// Go to desired video time.
								that.asset.target.currentTime = that.params.start.from;

							}

							// Check if video has to start playing automatically.
							if ((that.asset.resume && that.asset.resume.paused === false) || (!that.asset.resume && that.params.autoplay)) {

								// Play video.
								that.play();

							}

						}

						// Trigger event.
						that.trigger({

							type: 'load'

						});

						// Check if video is paused.
						if (that.asset.target.paused) {

							// Trigger event.
							that.trigger({

								type: 'pause'

							});

						}

						// Drop resume parameters.
						that.asset.resume = null;

					},

					/**
					 * @function
					 * @param event {Event}
					 */
					playHandler = function (event) {

						// Trigger event.
						that.trigger(event);

					},

					/**
					 * @function
					 * @param event {Event}
					 */
					pauseHandler = function (event) {

						// Trigger event.
						that.trigger(event);

					},

					/**
					 * @function
					 * @param event {Event}
					 */
					volumeHandler = function (event) {

						/**
						 * @type {Object}
						 */
						event.detail = {

							/**
							 * @type {Number}
							 */
							volume: that.asset.target.volume

						};

						// Trigger event.
						that.trigger(event);

						if (that.asset.target.muted) {

							// Trigger event.
							that.trigger({

								/**
								 * @type {String}
								 */
								type: 'mute'

							});

						} else if (!that.asset.target.muted) {

							// Trigger event.
							that.trigger({

								/**
								 * @type {String}
								 */
								type: 'unmute'

							});

						}
					},

					/**
					 * @function
					 * @param event {Event}
					 */
					seekHandler = function (event) {

						/**
						 * @type {Object}
						 */
						event.detail = {

							/**
							 * @type {Number}
							 */
							time: that.asset.target.currentTime

						};

						// Trigger event.
						that.trigger(event);

					},

					/**
					 * @function
					 * @param event {Event}
					 */
					fullScreenHandler = function (event) {

						// Check if full screen is available.
						if (!that.params.fullscreen) {
							try {

								// Prevent full screen event.
								event.stopImmediatePropagation();
								event.stopPropagation();
								event.preventDefault();

								return false;
							} catch (error) {
							}
						} else {

							// Trigger event.
							that.trigger(event);

						}
					};

				// Create new HTML element.
				that.asset.target = document.createElement('video');

				// Wrapper asset into tag or tags, if params are provided.
				// Important to run this script before placement, as may lead to creation of new DOM elements.
				that.asset.tags = utils.wrapElement(that.params.tags);

				// Set asset key attribute.
				that.asset.target.setAttribute('data-key', that.asset.key);

				// Wrapper asset into tag or tags, if params are provided.
				// Important to run this script before placement, as may lead to creation of new DOM elements.
				that.asset.tags = utils.wrapElement(that.params.tags);

				// Check if tag was created.
				if (that.asset.tags && utils.isElement(that.asset.tags.initial) && utils.isElement(that.asset.tags.latest)) {

					// Append initial element to layer target.
					that.target.appendChild(that.asset.tags.initial);

					// Append asset to latest layer element.
					that.asset.tags.latest.appendChild(that.asset.target);

				} else {

					// Append asset to layer target.
					that.target.appendChild(that.asset.target);

				}

				// Set preload attribute.
				that.asset.target.preload = that.params.preload;

				// Set controls attribute only on complete state (so they don't appear while video is waiting for polite load).
				that.asset.target.controls = that.params.controls;

				// Set plays inline attribute.
				that.asset.target.playsinline = that.params.inline;

				// Secure inline parameter for older browsers by adding attribute.
				that.params.inline ? utils.setAttribute(that.asset.target, 'playsinline', 'true', ['webkit-'])
					: utils.removeAttribute(that.asset.target, 'playsinline', ['webkit-']);

				// Secure inline parameter for older browsers by adding attribute.
				that.params.inline ? utils.setAttribute(that.asset.target, 'video-available-inline', '', ['webkit-'])
					: utils.removeAttribute(that.asset.target, 'video-available-inline', ['webkit-']);

				// Set autoplay attribute, do not allow video to play if layer is sequenced.
				that.asset.target.autoplay = false;

				// Set muted attribute.
				that.asset.target.muted = that.asset.resume ? that.asset.resume.muted : that.params.muted;

				// Set fullscreen attribute.
				that.asset.target.allowfullscreen = that.params.fullscreen;

				// Set loop attribute.
				that.asset.target.loop = that.params.loop;

				// Set loop attribute.
				that.asset.target.volume = that.asset.resume ? that.asset.resume.volume : that.params.volume;

				// Define on video full screen handler.
				that.events.fullscreen = utils.addEventSimple(that.asset.target, 'fullscreenchange', fullScreenHandler);
				that.events.fullscreenWebkit = utils.addEventSimple(that.asset.target, 'webkitfullscreenchange', fullScreenHandler);
				that.events.fullscreenMoz = utils.addEventSimple(that.asset.target, 'mozfullscreenchange', fullScreenHandler);

				// Define on video can play handler.
				that.events.play = utils.addEventSimple(that.asset.target, 'play', playHandler);

				// Define on video can play handler.
				that.events.pause = utils.addEventSimple(that.asset.target, 'pause', pauseHandler);

				// Define on video can play handler.
				that.events.seeked = utils.addEventSimple(that.asset.target, 'seeked', seekHandler);

				// Define on video can play handler.
				that.events.volume = utils.addEventSimple(that.asset.target, 'volumechange', volumeHandler);

				// Define on video can play handler.
				that.events.load = utils.addEventSimple(that.asset.target, 'loadedmetadata', assetLoadHandler);

				// Update asset scale and position depending on alignment and crop parameters.
				that.props.position.update(that.sources[0].width, that.sources[0].height, that.width(), that.height(), that.params);

				// Check if image size can be adjusted.
				if (that.props.position.enabled) {

					// Now, when we know appropriate asset source depending on scaling parameters, we can select appropriate size of the source.
					that.asset.source = utils.getAssetSource(that.sources, that.props.position.width * that.params.ratio, that.props.position.height * that.params.ratio, that.params.limit.min, that.params.limit.max);

					// Add resize attribute to holder.
					that.addAttr(that.props.position.name, {

						/**
						 * @type {String}
						 */
						selector: '[data-key="' + that.asset.key + '"]',

						/**
						 * @type {Object}
						 */
						css: {

							/**
							 * @type {String}
							 */
							position: 'absolute',

							/**
							 * @type {String}
							 */
							left: that.props.position.left + 'px',

							/**
							 * @type {String}
							 */
							top: that.props.position.top + 'px',

							/**
							 * @type {String}
							 */
							width: that.props.position.width + 'px',

							/**
							 * @type {String}
							 */
							height: that.props.position.height + 'px'

						}

					});

				} else {

					// Now, when we know appropriate asset source depending on scaling parameters, we can select appropriate size of the source.
					that.asset.source = utils.getAssetSource(that.sources, that.width() * that.params.ratio, that.height() * that.params.ratio, that.params.limit.min, that.params.limit.max);

				}

				// Check if video has to be loaded politely.
				if (that.params.polite === true && !container.isPoliteReady()) {

					// Wait for polite ready event to place video.
					container.one(container.EVT_ADAPTER_POLITE, function () {

						// Start loading.
						loadAsset();

					});

				} else {

					// Start loading.
					loadAsset();

				}

			} else {

				// Trigger event.
				that.trigger({

					/**
					 * @type {String}
					 */
					type: 'empty'

				});

			}

			return true;
		}

		return false;
	};

	/**
	 * Provides layer asset destroyer.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.unload = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is initialised and asset exists.
		if (that.inited && that.asset) {

			// Check if asset target exists.
			if (that.loaded && that.asset.target) {

				that.asset.resume = {

					// Save current time.
					time: that.asset.target.currentTime,

					// Save current pause state.
					paused: that.asset.target.paused,

					// Save current muted state.
					muted: that.asset.target.muted,

					// Save current volume state.
					volume: that.asset.target.volume

				};

				// Destroy asset source.
				that.asset.target.src = '';

			}

			// Check if tag was created.
			if (that.asset.tags && that.asset.tags.initial) {

				// Remove wrapper.
				that.target.removeChild(that.asset.tags.initial);

			} else if (that.asset.target) {

				// Remove asset.
				that.target.removeChild(that.asset.target);

			}
			// Destroy holder.
			that.asset.tags = null;

			// Destroy source.
			that.asset.source = null;

			// Destroy target.
			that.asset.target = null;

			// Indicate that asset is no longer loaded.
			that.loaded = false;

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'unload'

			});

		}

		return false;
	};

	/**
	 * Check if layer can be played.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.playable = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is available.
		if (that.available()) {

			// Check if creative is stopped.
			return that.asset.resume ? false : (that.root ? !that.root.stopped : true);
		}

		return false;
	};

	/**
	 * Play video.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.play = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if video is paused.
		if (that.loaded && that.asset.target.paused) {

			// Check if root banner is stopped.
			if (!that.root.stopped) {

				// Play video.
				that.asset.target.play();

			}

			else {

				// Stop video layer.
				that.stop();

			}

			return true;
		}

		return false;
	};

	/**
	 * Pause video.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.pause = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded && !that.asset.target.paused) {

			// Pause video.
			that.asset.target.pause();

			return true;
		}

		return false;
	};

	/**
	 * Toggle video pause.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.togglePlay = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Check if video is not paused.
			if (!that.asset.target.paused) {

				// Pause video.
				return that.asset.target.pause();

			} else {

				// Play video.
				return that.asset.target.play();

			}

		}

		return false;
	};

	/**
	 * Stop video.
	 *
	 * @function
	 * @param {Boolean} [ignoreStopOn]
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.stop = function (ignoreStopOn) {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Pause video.
			that.pause();

			// Check if video has to be stopped on specific time.
			if (!isNaN(that.params.stop.on) && !ignoreStopOn) {

				// Check if video has to be stopped on the last frame.
				if (that.params.stop.on === -1) {

					// Seek to required time.
					that.seek(that.asset.target.duration);

				} else {

					// Seek to required time.
					that.seek(that.params.stop.on);

				}

			}

			// Trigger event.
			that.trigger({

				/**
				 * @type {String}
				 */
				type: 'stop'

			});

			return true;
		}

		return false;
	};

	/**
	 * Seek for video position.
	 *
	 * @function
	 * @param {Number} value
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.seek = function (value) {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Play video.
			that.asset.target.currentTime = value;

			return true;
		}

		return false;
	};

	/**
	 * Mute video.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.mute = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Set mute parameter.
			that.asset.target.muted = true;

			return true;
		}

		return false;
	};

	/**
	 * Unmute video.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.unmute = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Unset mute parameter.
			that.asset.target.muted = false;

			return true;
		}

		return false;
	};

	/**
	 * Set volume.
	 *
	 * @function
	 * @param {Number} value
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.volume = function (value) {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Set video volume.
			that.asset.target.volume = value;

			return true;
		}

		return false;
	};

	/**
	 * Toggle video pause.
	 *
	 * @function
	 * @return {Boolean}
	 */
	layers.VideoLayer.prototype.toggleMute = function () {

		var

			/**
			 * @type {tactic.builder.layers.VideoLayer}
			 */
			that = this;

		// Check if layer is created and loaded.
		if (that.loaded) {

			// Toggle mute.
			return (that.asset.target.muted) ? that.unmute() : that.mute();

		}

		return false;
	};

})(tactic);