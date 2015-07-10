/* jshint node:true, unused:true */
'use strict';

var __ = require('lodash');
var Q = require('q');
module.exports = Q;

/**
 * @method map
 * @param array {Array}
 * @param fn {Function}
 * @returns {Promise}
 *
 * Array can be a promise of an array, and can contain promises or values.
 *
 * Invokes fn with each item in array in serial.
 * Resolves to a new array containing the return calls of each invocation.
 * Rejects with the first failure.
 */
Q.map = function(array, fn) {
    var retVals = [];
    return Q(array).then(function(arr) {
        return __.reduce(arr, function(promise, item) {
            return Q.all([promise, item]).then(function(resolved) {
                return fn(resolved[1]);
            }).then(function(retVal) {
                retVals.push(retVal);
            });
        }, Q());
    }).then(function() {
        return retVals;
    });
};

/**
 * @method mapAsync
 * @param array {Array}
 * @param fn {Function}
 * @returns {Promise}
 *
 * Like map, but invokes fn in parallel.
 */
Q.mapAsync = function(array, fn) {
    var retVals = [];
    return Q(array).then(function(arr) {
        return Q.all(__.map(arr, function(item, idx) {
            return Q(item)
            .then(fn)
            .then(function(final) {
                retVals[idx] = final;
            });
        }));
    }).then(function() {
        return retVals;
    });
};

/**
 * @method each
 * @param array {Array}
 * @param fn {Function}
 * @returns {Promise}
 *
 * Like map, but resolves with the original array
 * instead of the return values from invoking fn.
 */
Q.each = function(array, fn) {
    return Q.map(array, fn).then(function() {
        // each should just return the original array, akin to _.each
        return array;
    });
};

/**
 * @method eachAsync
 * @param array {Array}
 * @param fn {Function}
 * @returns {Promise}
 *
 * Like each, but invokes fn in parallel.
 */
Q.eachAsync = function(array, fn) {
    return Q.mapAsync(array, fn).then(function() {
        // each should just return the original array, akin to _.each
        return array;
    });
};

/**

// Example:

var Q = require('./lib/lib-insightsync/utils/q-tools');
var b = Q.defer(),
    c = Q.defer(),
    a = [1,b.promise,3,c.promise],
    w = Q.map(a,function(v){console.log("MAP:", v); return v*2} ),
    W = Q.map(Q(a),function(v){console.log("MAP-PROMISE:", v); return v*2} ),
    x = Q.mapAsync(a,function(v){console.log("MAP-ASYNC:", v); return v*2} ),
    X = Q.mapAsync(Q(a),function(v){console.log("MAP-ASYNC-PROMISE:", v); return v*2} ),
    y = Q.each(a,function(v){console.log("EACH:", v); return v*2} ),
    Y = Q.each(Q(a),function(v){console.log("EACH-PROMISE:", v); return v*2} ),
    z = Q.eachAsync(a,function(v){console.log("EACH-ASYNC:", v); return v*2} ),
    Z = Q.eachAsync(Q(a),function(v){console.log("EACH-ASYNC-PROMISE:", v); return v*2} );

*/
