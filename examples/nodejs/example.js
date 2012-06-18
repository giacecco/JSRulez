/* An example for node.js */

var requirejs = require('requirejs'); 

requirejs([ "../../JSRulez" ], function (JSRulez) {

	var exampleRules = [
	                		
	  { condition: function (context) { return context.lyrics === "sunday"; },
	    action: function (context) { context.lyrics += " bloody sunday" }, },
	
	  { condition: function (context) { return context.lyrics === "obladi"; },
	    action: function (context) { context.lyrics += " oblada" }, },
	
	];
	
	var rulesEngine = new JSRulez.RulesEngine(exampleRules),
	    context = { lyrics: "obladi" };
	rulesEngine.runAll(context);
	console.log("JSRulez says: " + context.lyrics);

});