/**
 * TACTIC™ Creative Library
 * Copyright (C) 2020 TACTIC™ Real-Time Marketing <https://tacticrealtime.com/>
 * Licensed under GNU GPL <https://tacticrealtime.com/license/sdk/>
 *
 * @author Anton Gorodnyanskiy
 * @date 09/12/2020
 * @edit 12/06/2022
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
		 * @function
		 * @param {(Event)} event
		 */
		errorEventHandler = function (event) {

			// Track local event.
			container.trackEventNativeDef('log', 'error', 'BANNER');

			// Show fallback image.
			container.showFallback();

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
					case ('BANNER'):

						// Look for event type.
						switch (event.type) {

							// If layer was created.
							case ('set'):

								// Initialise layer.
								layer.init();

								break;

							// In case of layer build event (when layer data is parsed and new layer instance needs to be created).
							case ('build'):

								// Check if additional detail is passed.
								// You are able to add new layer below and return it back to Banner constructor the way you want.
								// If nothing returned to Banner constructor, Banner will try to create new layer automatically.
								if (event.detail) {

									// Look for layer key.
									switch (event.detail.key) {

									}

								}

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

								// Check if Banner does not support CSS animation.
								// Check if Banner is in capture mode.
								if (layer.inanimate === true || (['capture', 'capture-image', 'capture-gif'].indexOf(layer.props.mode.get()) !== -1)) {

									// Add "anim_no" attribute to root layer in order to stop all transitions.
									// NB! Required for proper snapshot capture, as PhantomJS does not support CSS animations.
									layer.addAttr('animation_disabled');

								}

								// Check if Banner is in image capture mode, means snapshot can be taken on dedicated stopping frame.
								if ((['capture', 'capture-image'].indexOf(layer.props.mode.get()) !== -1)) {

									// Stop banner (will display stopping frame).
									layer.stop();

								}

								// Add "ready" attribute to root layer. Will reveal banner contents.
								layer.addAttr('ready');

								break;

							// In case Banner is interacted.
							case ('interaction'):

								// Remove "animation_skipped" attribute to root layer in order to reveal animations.
								layer.removeAttr('animation_skipped');

								break;

							// In case Banner is stopped.
							// NB! Creative will stop automatically in 30 seconds. This is required by the most ad networks.
							case ('stop'):

								// Check if no user interaction spotted and banner is not in debug mode.
								if (!layer.interacted) {

									// Add "anim_no_dur" attribute to root layer in order to make all transitions seamless.
									layer.addAttr('animation_skipped');

								}

								// Pause all banner playbacks and sequences.
								// Execute method recursively on all nested banner layers and frames.
								// Ignore stop on parameter if in debug mode.
								layer.execute('stop', false, [layer.interacted]);

								// Check if Banner is in image capture mode.
								if (['capture', 'capture-image'].indexOf(layer.props.mode.get()) !== -1) {

									// Execute snapshot capture with a delay, in order to give time to load necessary assets.
									layer.capture({ delay: 1000 });

								}

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

								break;

							// If layer was successfully loaded or entered.
							case ('load'):
							case ('enter'):

								// Check if layer is available.
								// Will return false if sequenced and not on current frame.
								if (layer.available()) {

									// Add animation class to fade in.
									layer.addAttrs('active');

									// Remove "hidden" attribute.
									layer.removeAttr('hidden');

									// Check if layer has animation class.
									if (utils.hasClass(layer.target, 'animate')) {

										// Add animation attribute to fade in.
										layer.addAttr('animate_in');

									}

								}

								break;

							// If layer is entered.
							case ('leave'):

								// Add animation attribute to fade in.
								layer.addAttr('animate_out');

								break;

							// If layer is empty.
							case ('empty'):

								// Add "empty" attribute to hide layer.
								layer.addAttr('empty');

								break;

							// If layer was initialised.
							case ('enabled'):

								// Remove "disabled" attribute to show layer.
								layer.removeAttr('disabled');

								break;

							// If layer is disabled.
							case ('disabled'):

								// Add "disabled" attribute to hide layer.
								layer.addAttr('disabled');

								break;

						}

						break;

				}

			}

		};

	// Wait for TACTIC container initialisation ready state event.
	// Start banner initialisation when container is ready, but wait with element build before fonts are loaded.
	container.ready(

		/**
		 * @param {Object} data
		 * @param {Object} data.editor
		 * @param {Object} data.banner
		 */
		function (data) {

			// Bind error event on window.
			utils.addEventSimple(window, 'error', errorEventHandler);

			// Bind error event on body.
			utils.addEventSimple(document.body, 'error', errorEventHandler);

			// Create new Banner instance(s).
			// Include Banner instance to window namespace for easy access from console.
			// All further events and actions will be handled with callback handler.
			utils.each((['BANNER']),

				/**
				 * @param {String} key
				 * @param {Number} count
				 */
				function (key, count) {

					// Create new Banner instance.
					// Duplicate date in case it is banner clone.
					// All further events and actions will be handled with callback handler.
					window.banner = new tactic.builder.layers.BannerLayer('BANNER', data.banner, bannerEventHandler);

					// Bind click event on banner click.
					// NB! This requires Banner instance to be initialised.
					utils.addEventSimple(document.body, 'click', function () {

						// Open click tag using TACTIC container.
						// NB! It is important to not use window.open() in order to handle specific vendor click tag setup.
						container.clickThrough(window.banner.getClickTag().url);

					});

				}
			);

		}
	);

})(tactic);
