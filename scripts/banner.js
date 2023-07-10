/**
 * TACTIC™ Creative Library
 * Copyright (C) 2023 TACTIC™ Real-Time Marketing <https://tacticrealtime.com/>
 * Licensed under GNU GPL <https://tacticrealtime.com/license/sdk/>
 */

(/**
 * @param {tactic} tactic
 */
function (tactic) {

	var

		// Lend TACTIC container.
		container = tactic.container,

		// Lend TACTIC utility namespace.
		utils = (tactic.utils || tactic.utilities);

	var

		/**
		 * Identify end transition name depending on a browser.
		 *
		 * @function
		 */
		whichTransitionEndEvent = function () {

			var

				/**
				 * @type {Element|Node}
				 */
				element = document.createElement('div'),

				/**
				 * @type {Object}
				 */
				handlers = {
					'transition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'MozTransition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd'
				};

			for (var i in handlers) {
				if (element.style[i] !== undefined) {
					return handlers[i];
				}
			}

		},

		/**
		 * @function
		 * @param {tactic.builder.layers.AbstractLayer} layer
		 * @param {String} anim_type
		 */
		applyLayerAnimation  = function (layer, anim_type) {
			try {

				// Look for layer key.
				switch (anim_type) {

					// In case it is root banner.
					case ('in'):

						// Loop all animations.
						utils.each(layer.getAnims(),

							/**
							 * @param {Object} anim
							 * @param {String} anim_key
							 */
							function (anim, anim_key) {

								var

									/**
									 * @type {tactic.builder.layers.AbstractLayer}
									 */
									anim_layer = anim.target,

									/**
									 * @type {String}
									 */
									anim_name = anim.name,

									/**
									 * @type {Object}
									 */
									anim_end_event = anim_layer.events.anim_end;

								// Check if animation end event exists.
								if (anim_end_event) {

									// Remove animation end event.
									utils.removeEventSimple(anim_end_event.target, anim_end_event.type, anim_end_event.callback);

								}

								// Add animation class to fade in.
								anim_layer.removeAttr(anim_name + '_out');

								// Add animation class to fade in.
								anim_layer.addAttr(anim_name + '_in');

							}

						);

						break;

					// In case it is root banner.
					case ('out'):

						// Loop all animations.
						utils.each(layer.getAnims(),

							/**
							 * @param {Object} anim
							 * @param {String} anim_key
							 */
							function (anim, anim_key) {

								var

									/**
									 * @type {tactic.builder.layers.AbstractLayer}
									 */
									anim_layer = anim.target,

									/**
									 * @type {String}
									 */
									anim_name = anim.name,

									/**
									 * @type {Object}
									 */
									anim_end = anim_layer.events.anim_end,

									/**
									 * Remove animation attributes when transition ends.
									 * @function
									 */
									removeAnimEndListener = function() {

										// Check if animation end event exists.
										if (anim_end) {

											// Remove load event listener.
											utils.removeEventSimple(anim_end.target, anim_end.type, anim_end.callback);

										}

									},

									/**
									 * Remove animation attributes when transition ends.
									 * @function
									 */
									animEndHandler = function () {

										removeAnimEndListener();

										// Remove animation class to fade in.
										anim_layer.removeAttr(anim_name + '_out');

										// Add hidden attribute.
										// anim_layer.addAttr('hidden');

									};

								// Clear animation end event listener.
								removeAnimEndListener();

								// Add animation class to fade in.
								anim_layer.removeAttr(anim_name + '_in');

								// Add animation class to fade in.
								anim_layer.addAttr(anim_name + '_out');

								// Listen for animation end event.
								anim_layer.events.anim_end = utils.addEventSimple(anim_layer.target, whichTransitionEndEvent(), animEndHandler);

							}

						);

						break;

				}

			} catch (e) {}
		},

		/**
		 * @function
		 * @param {tactic.builder.layers.AbstractLayer} layer
		 */
		emptyLayerHandler = function (layer) {
			try {

				// Add empty attribute to the frame layer, so other layers know the scope.
				layer.addAttr('empty');

				var

					/**
					 * @type {String}
					 */
					empty_key = layer.key,

					/**
					 * @type {tactic.builder.layers.AbstractLayer}
					 */
					empty_holder_layer = layer.sequence ? layer.sequence.frames[layer.frame] : layer.root.getLayer('CV', 2);

				if (empty_holder_layer.enabled && layer.parent.enabled && layer.enabled) {

					// Add empty layer class to the sequence.
					empty_holder_layer.addAttr( empty_key + '_empty', { name: empty_key + '_empty', global: true });

				}

			} catch (e) {
			}
		},

		/**
		 * @function
		 * @param {tactic.builder.layers.AbstractLayer} layer
		 */
		disabledLayerHandler = function (layer) {
			try {

				// Add disabled attribute to the frame layer, so other layers know the scope.
				layer.addAttr('disabled');

				var

					/**
					 * @type {String}
					 */
					disabled_key = layer.key,

					/**
					 * @type {tactic.builder.layers.AbstractLayer}
					 */
					disabled_holder_layer = layer.sequence ? layer.sequence.frames[layer.frame] : layer.root.getLayer('CV', 2);

				if (disabled_holder_layer.enabled && layer.parent.enabled) {

					// Add empty layer class to the sequence.
					disabled_holder_layer.addAttr( disabled_key + '_disabled', { name: disabled_key + '_disabled', global: true });

				}

			} catch (e) {
			}
		},

		/**
		 * @function
		 * @param {(Event)} event
		 */
		errorEventHandler = function (event) {

			// Track local event.
			container.trackEventNativeDef('log', 'error', 'ERR_ADVERT_CRITICAL');

			// Show fallback image.
			container.showFallback();

		},

		/**
		 * @function
		 * @param {tactic.builder.layers.AbstractLayer} layer
		 * @param {String} [url] Alternative click tag URL.
		 */
		clickEventHandler = function (layer, url) {

			var

				/**
				 * Get layer's click tag.
				 * @type {Object}
				 */
				click_tag = layer.getClickTag(url);

			// Open click tag using TACTIC container.
			// NB! It is important to not to use window.open() in order to handle specific vendor click tag settings.
			container.clickThrough(click_tag.url, click_tag.vars);

		},

		/**
		 * Create dynamic layers depending on data analysis.
		 * Assign layer events.
		 *
		 * @function
		 * @param event {Event}
		 * @param event.type {String}
		 * @param event.detail {Object}
		 */
		bannerEventHandler = function (event) {

			var

				/**
				 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.SequenceLayer|tactic.builder.layers.FrameLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer|tactic.builder.layers.VideoLayer)}
				 */
				layer = this;

			// Validate layer target and event type.
			if (layer.target && event.type) {

				// Look for layer key.
				switch (layer.key) {

					// In case it is root banner.
					case ('BN'):

						// Look for event type.
						switch (event.type) {

							// If layer was created.
							case ('set'):

								// Initialise layer.
								layer.init();

								break;

							// In case of layer build event (when layer data is parsed and new layer instance needs to be created).
							case ('build'):

								return;

							// If layer was successfully initialised.
							case ('init'):

								// Now load primary banner layer.
								// Proper font load utility requires all layers to be initialised before banner load function.
								// This will allow banner to index fonts that are in use and preload those before appending texts.
								// Custom fonts have to be preloaded in order to avoid wrong text holder positioning and styling (kerning, line heights).
								layer.load();

								break;

							// In case Banner is loaded, means static assets like fonts and images are loaded.
							// By default, Banner won't wait for any assets unless you indicate those in Banner parameters.
							case ('load'):

								// Initialise all nested banner layers.
								// Execute method recursively on all nested banner layers and frames.
								layer.execute('init', false);

								// Add "ready" attribute to root layer. Will reveal banner contents.
								layer.addAttr('ready');

								break;

							// In case if banner is resized.
							case ('resize'):

								// Check if banner is responsive.
								if (container.NAME === 'RxR') {

									// Hide banner.
									layer.removeAttr('ready');

									// Destroy all layers.
									layer.execute('destroy', false);

									// Initialise layers again.
									layer.execute('init', false);

									// Reveal banner.
									layer.addAttr('ready');

								}

								break;

							// In case Banner is stopped.
							// NB! Creative will stop automatically in 30 seconds. This is required by the most ad networks.
							case ('stop'):

								// Pause all banner playbacks and sequences.
								// Execute method recursively on all nested banner layers and frames.
								layer.execute('stop', false);

								break;

						}

						break;

					// In case of all other layers.
					default:

						// Look for event type.
						switch (event.type) {

							// If layer was initialised.
							case ('set'):

								// Add hidden attribute.
								layer.addAttr('hidden');

								break;

							// If layer was initialised.
							case ('init'):

								// Check if layer can be loaded.
								// We don't want to load all frames of the sequence by default.
								if (layer.loadable()) {

									// Load layer.
									layer.load();

								}

								// Look for layers key.
								switch (layer.key) {

									// Look for click layer.
									case 'CL':

										// Bind banner click event on click layer.
										// NB! This requires Banner instance to be initialised.
										layer.events.click_custom = utils.addEventSimple(document.body, 'click', function () {

											// Trigger click event, do not pass frame number.
											clickEventHandler(layer);

										});

										break;

								}

								break;

							// If layer was initialised.
							case ('enabled'):

								// Add "disabled" attribute to hide layer.
								layer.removeAttr('disabled');

								break;

							// If layer was successfully loaded or entered.
							case ('load'):
							case ('enter'):

								// Check if layer is available.
								// Will return false if sequenced and not on current frame.
								if (layer.available()) {

									// Add animation class to fade in.
									layer.addAttrs('active');

									// Remove hidden attribute.
									layer.removeAttr('hidden');

									// Apply layer animation.
									applyLayerAnimation(layer, 'in');

								}

								break;

							// If layer is entered.
							case ('leave'):

								// Apply layer animation.
								applyLayerAnimation(layer, 'out');

								// Remove active class.
								layer.removeAttr('active');

								// Remove debug class.
								layer.removeAttr('debug');

								break;

							// If layer is empty.
							case ('empty'):

								emptyLayerHandler(layer);

								break;

							// If layer is disabled.
							case ('disabled'):

								disabledLayerHandler(layer);

								break;

						}

						break;

				}

			}

		};

	// Wait for TACTIC container initialisation ready scope event.
	// Start banner initialisation when container is ready, but wait with element build before fonts are loaded.
	container.ready(

		/**
		 * @param {Object} data
		 */
		function (data) {

			// Bind error event on window.
			utils.addEventSimple(window, 'error', errorEventHandler);

			// Bind error event on body.
			utils.addEventSimple(document.body, 'error', errorEventHandler);

			// Create new Banner instance(s).
			// Include Banner instance to window namespace for easy access from console.
			// All further events and actions will be handled with callback handler.
			window.banner = new tactic.builder.layers.BannerLayer('BN', data.banner, bannerEventHandler);

		}
	);

})(tactic);
