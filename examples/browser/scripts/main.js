require.config({
    paths: {
    	// AMD-enabled Underscore.js from https://github.com/amdjs/underscore
    	'underscore': 'https://raw.github.com/amdjs/underscore/master/underscore-min', 
    	// AMD-enabled Backbone.js from https://github.com/amdjs/backbone
	    'backbone': 'https://raw.github.com/amdjs/backbone/master/backbone-min', 
	    // TODO: why does loading the AMD-enabled Backbone.js requires jQuery?
	    'jquery': 'http://code.jquery.com/jquery-1.7.2.min', 
    },
});

require([ "./JSRulez" ], function (JSRulez) {

	var exampleRules = [
	                		
    { condition: function (context) { return context.lyrics === "sunday"; },
      action: function (context) { context.lyrics += " bloody sunday" }, },

    { condition: function (context) { return context.lyrics === "obladi"; },
      action: function (context) { context.lyrics += " oblada" }, },
	
  ];
	
  var rulesEngine = new JSRulez.RulesEngine(exampleRules),  
  context = { lyrics: "obladi" };
  rulesEngine.runAll(context);
	$("#JSRulezMessage").html(context.lyrics);
		
});