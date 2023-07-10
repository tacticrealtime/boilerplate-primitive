/**
 * TACTIC™ Creative Library
 * Copyright (C) 2023 TACTIC™ Real-Time Marketing <https://tacticrealtime.com/>
 * Licensed under GNU GPL <https://tacticrealtime.com/license/sdk/>
 */


var

    /**
     * @function
     * @param object
     * @return {Boolean}
     * @description Checks if argument is an array.
     */
    isArray = function (object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    },

    /**
     * @function
     * @param {String} key
     * @param {String} [query_string]
     * @param {Array} [custom]
     * @return {String}
     * @description Get query string parameter.
     */
    getQsParam = function (key, query_string, custom) {
        var param   = undefined;
        var reindex = isArray(custom) ? '|' + custom.join('|') : '';
        param = decodeURIComponent((query_string || window.location.search).replace(new RegExp("^(?:.*[?|&" + reindex + "]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return param;
    },

    /**
     * @function
     * @return {Array}
     * @description Try to get query string parameter with scales array.
     */
    getScales = function () {

        var

            /**
             * @type {String}
             */
            qs_scales = getQsParam('scales'),

            /**
             * @type {Array}
             */
            qs_scales_array = qs_scales ? qs_scales.split(',') : [],

            /**
             * @type {Array}
             */
            scales = [];

        if (qs_scales_array.length <= 0) {

            // scales = ['BN_L', 'BN_M', 'BN_S', 'BN_XS'];
            // scales = ['BN_M', 'BN_S', 'BN_XS'];
            scales = ['BN_M'];

        }

        else {

            for (var qs_scale_index in qs_scales_array) {

                scales.push('BN_' + qs_scales_array[qs_scale_index].toUpperCase());

            }

        }

        return scales;
    },

    /**
     * @function
     * @return {Array}
     * @description Try to get query string parameter with tensions array.
     */
    getTenses = function () {

        var

            /**
             * @type {String}
             */
            qs_tens = getQsParam('tens'),

            /**
             * @type {Array}
             */
            qs_tens_array = qs_tens ? qs_tens.split(',') : [],

            /**
             * @type {Array}
             */
            tensions = [];

        if (qs_tens_array.length <= 0) {

            tensions = ['BN_T2', 'BN_T1', 'BN_E0_T', 'BN_E0_W', 'BN_W1', 'BN_W2']; // 1010px x 1220px
            // tensions = ['BN_T2', 'BN_T1', 'BN_E0_T', 'BN_E0_W', 'BN_W1', 'BN_W2', 'BN_W3']; // 1010px x 1220px
            // tensions = ['BN_T2', 'BN_T1', 'BN_E0_T', 'BN_E0', 'BN_E0_W', 'BN_W1', 'BN_W2']; // 890px x 1510px
            // tensions = ['BN_T2', 'BN_T1', 'BN_E0', 'BN_W1', 'BN_W2']; // 890px x 1130px

        }

        else {

            for (var qs_scale_index in qs_tens_array) {

                tensions.push('BN_' + qs_tens_array[qs_scale_index].toUpperCase());

            }

        }

        return tensions;
    };

var

    /**
     * @type {Boolean}
     */
    actual = getQsParam('actual') ? true : false,

    /**
     * @type {Boolean}
     */
    showcase = getQsParam('showcase') ? true : false,

    /**
     * @type {Boolean}
     */
    hover = getQsParam('hover') ? true : false,

    /**
     * @type {Object}
     */
    dictionary = {
        'BN_XS': 'XS',
        'BN_S': 'S',
        'BN_M': 'M',
        'BN_L': 'L',
        'BN_T2': 'VERY TALL (1:4)',
        'BN_T1': 'TALL (1:2)',
        'BN_E0_T': 'EQUAL TALL (3:4)',
        'BN_E0': 'EQUAL (1:1)',
        'BN_E0_W': 'EQUAL WIDE (4:3)',
        'BN_W1': 'WIDE (3:1)',
        'BN_W2': 'VERY WIDE (6:1)',
        'BN_W3': 'EXTRA WIDE (9:1)'
    },

    /**
     * @type {Array}
     */
    tenses = getTenses(),

    /**
     * @type {Array}
     */
    scales = getScales();

var

    /**
     * @type {Function}
     * @param string {String}
     */
    translate = function (string) {
        return dictionary[string] ? dictionary[string] : string;
    };