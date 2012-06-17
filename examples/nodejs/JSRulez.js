/* 
 * JSRulez v0.1.1RC 
 * Copyright (C) 2012 Gianfranco Cecconi
 * 
 * MIT LICENCE
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

"use strict";

define([ "underscore", "backbone" ], function(_, Backbone) {

	var	RulesEngine = function (inputRules) {

			var normaliseRules = function () {
				_.each(rules, function (rule) {
					if (typeof(rule.priority) === "undefined")
						rule.priority = 0;
					if (typeof(rule.events) === "undefined") 
						rule.events = [ ];
					if (rule.events.length === 0) 
						rule.events.push("_");
					rule.events = _.uniq(rule.events);
					if (typeof(rule.condition) === "undefined") 
						rule.condition = function () { return true; };
					if (typeof(rule.action) === "undefined") 
						rule.action = function () { };
					if (typeof(rule.breakFlow) === "undefined") 
						rule.breakFlow = false;
				});
			};
			
			var rulesAppearRight = function () {
				return _.all(rules, function (rule) {
					/* A rule is well formed if it has priority, condition and action. 
					 * priority must be an integer, positive or negative. 
					 * condition and action must be functions 
					 * Rules can also have a 'name' but it is not mandatory */
					return (typeof(rule.priority) === "number") && (Math.round(rule.priority) === rule.priority) &&
								 (Object.prototype.toString.call(rule.events) === "[object Array]") &&
								 (typeof(rule.condition) === "function") &&
								 (typeof(rule.action) === "function") &&
								 (typeof(rule.breakFlow) === "boolean");
				});
			};
			
			var run = function (context, eventName) {
				if (typeof(context) === "undefined") context = { };
				var keepGoing = true;
				for (var priority = minPriority; keepGoing && (priority <= maxPriority); priority++) 
					_.each(_.filter(rules, function (rule) { return rule.priority === priority; }), function (rule) {
						if (keepGoing && (rule.events.indexOf(eventName) !== -1) && (rule.condition(context))) {
							keepGoing = !rule.breakFlow;
							rule.action(context);
						};
					});
			};
			
			var runAll = function (context) {
				this.trigger("_", context);
			};
			
			var rules = inputRules;
			normaliseRules();
			if(!rulesAppearRight()) {
				return undefined;
			};
			var minPriority = _.min(_.map(rules, function (r) { return r.priority; }));
			var maxPriority = _.max(_.map(rules, function (r) { return r.priority; }));
			var rulesEngine = { runAll: runAll };
				_.extend(rulesEngine, Backbone.Events);
				_.each(_.uniq(_.reduce(_.map(rules, function (rule) { return rule.events; }), function (memo, eventArray) { return memo.concat(eventArray); }, [ ])), function (eventName) {
				rulesEngine.on(eventName, function (context) { run(context, eventName) });
			});
			return rulesEngine;
			
	};
			
	return { RulesEngine: RulesEngine };
	
});

