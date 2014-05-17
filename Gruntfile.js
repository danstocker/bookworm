/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/cache.js',
            'js/keys/EntityKey.js',
            'js/keys/DocumentKey.js',
            'js/keys/FieldKey.js',
            'js/keys/ItemKey.js',
            'js/keys/ReferenceItemKey.js',
            'js/exports.js'
        ],

        test: [
            'js/keys/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true,
            evan   : true,
            flock  : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
