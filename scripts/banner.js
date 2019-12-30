/**
 * TACTIC™ Creative Library
 * Copyright (C) 2019 TACTIC™ Real-Time Marketing <https://tacticrealtime.com/>
 * Licensed under GNU GPL <https://tacticrealtime.com/license/sdk/>
 *
 * @author Anton Gorodnyanskiy
 * @date 30/12/2019
 */

(/**
 * @param {tactic} tactic
 */
function (tactic) {

	var

		// Lend TACTIC container.
		container = tactic.container,

		// Lend TACTIC utility namespace.
		utils = (tactic.utils || tactic.utilities),

		// Lend TACTIC builder namespace.
		builder = tactic.builder;

	/// Wait for TACTIC container initialisation ready state event.
	// Start banner initialisation when container is ready, but wait with element build before fonts are loaded.
	container.ready(
		/**
		 * @param {Object} data
		 */
		function (data) {

			var

				/**
				 * @type {tactic.builder.layers.BannerLayer}
				 */
				banner;

			var

				/**
				 * @function
				 * @param {Event} event
				 */
				errorEventHandler = function (event) {

					// Track native event.
					container.trackEventNativeDef('log', 'error', 'ERR_BANNER');

					// Show fallback image.
					container.showFallback();

				},

				/**
				 * Handle click event and redirect user to landing page destination URL.
				 * NB! This will open container.FALLBACK_CLICKTAG in case if click tag is not defined.
				 * NB! Fallback click tag is set to https://www.tacticrealtime.com/ in boilerplate environment only.
				 *
				 * @function
				 * @param {Event} [event]
				 */
				clickEventHandler = function (event) {

					var

						/**
						 * @type {Object}
						 */
						click_tag = banner.getClickTag();

					// Open click tag using TACTIC container.
					// NB! It is important to not use window.open() in order to handle specific vendor click tag setup.
					container.clickThrough(click_tag.url, click_tag.vars);

					// Stop Banner and animations, as user is redirected to another location in an new window.
					banner.stop();

				},

				/**
				 * Handle all types of Banner events.
				 *
				 * @function
				 * @param {Event} event
				 * @param {String} event.type
				 * @param {Object} [event.detail]
				 */
				bannerEventHandler = function (event) {

					var

						/**
						 * Lend event layer.
						 *
						 * @type {(tactic.builder.layers.AbstractLayer|tactic.builder.layers.BannerLayer|tactic.builder.layers.ImageLayer|tactic.builder.layers.TextLayer)}
						 */
						layer = this;

					// Switch event type.
					switch (event.type) {

						// If layer was created.
						case ('set'):

							// Initialise layer.
							layer.init();

							break;

						// If layer was successfully initialised.
						case ('init'):

							// Load layer.
							layer.load();

							break;

						// If layer was successfully loaded.
						case ('load'):

							// Switch layer key.
							switch (layer.key) {

								// In case it is root banner layer.
								case 'BANNER':

									// Create layer click event.
									utils.addEventSimple(layer.target, 'click', clickEventHandler);

									// Add "ready" attribute. Will reveal layer contents.
									// This will automatically add same class name to layer related DOM element.
									layer.addAttrs('ready');

									break;

								// In case it is root banner layer.
								case 'BACKGROUND_IMAGE':
								case 'MESSAGE_TEXT_TITLE':
								case 'MESSAGE_TEXT_CAPTION':
								case 'MESSAGE_TEXT_BUTTON':
								case 'LOGO_IMAGE':

									// Add "ready" attribute. Will reveal layer contents.
									// This will automatically add same class name to layer related DOM element.
									layer.addAttrs('fade');

									break;

								default:

									break;

							}

							break;

						// If layer is disabled or empty.
						case ('empty'):
						case ('disabled'):

							// Add "empty" attribute to hide layer.
							// This will automatically add same class name to layer related DOM element.
							layer.addAttrs('empty');

							break;

						default:

							break;

					}

				};

			// Bind error event on window.
			utils.addEventSimple(window, 'error', errorEventHandler);

			// Bind error event on body.
			utils.addEventSimple(document.body, 'error', errorEventHandler);

			// Create new Banner instance.
			// Include Banner instance to window namespace for easy access from console.
			// All further events and actions will be handled with callback handler.
			banner = window.banner = new builder.layers.BannerLayer('BANNER', data.banner, bannerEventHandler);

		}
	);

})(tactic);