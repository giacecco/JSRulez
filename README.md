# JSRulez
JSRulez is a simple, stateless business rule engine for JavaScript. It is 
designed to work both within the web browser or in node.js. I did not test it
in other JavaScript contexts.

I developed
JSRulez as I needed a better way to represent the dealer's beaviour in a multiplayer
Blackjack game I was developing while learning [Meteor](http://www.meteor.com).
Using conventional programming style I would have had an intricate tree of _if_, _switch_ and loop structures. What I wanted instead is to describe the
dealer's behaviour by a flat list of rules.

## Requirements

* [Underscore.js](http://underscorejs.org/) version >= 1.3.3 (available in the
general JavaScript scope as "\_") 
* [Backbone.js](http://backbonejs.org/) version >= 0.9.2 (as "Backbone")
* [RequireJS](http://requirejs.org/) version >= 2.0.2 

## Rules
The rules engine of JSRulez manages business rules that can:

* be prioritised, using positive and negative natural numbers (the lower the 
number, the higher the priority)
* be evaluated when triggered by one or more events, or when no events have
been triggered, or in both cases 
* be subject to conditions, expressed by a JavaScript function
* Execute actions as JavaScript functions, when triggered and/or their condition 
is validated 
* Interrupt the evaluation of any other equal or lesser priority rule ('breaking
the flow')

## Constructor

```JavaScript
var ruleEngine = new JSRulez(rulesArray);
```

where _rulesArray_ is an array of rules. A rule is a JavaScript object whose 
properties are: _priority_, _events_, _condition_, _action_ and _breakFlow_.

## Methods
An instance of JSRules exposes:

* _runAll(context)_, to evaluate all rules that do
not need being triggered. I'll explain later what _context_ is.
* _trigger(eventName, context)_, to trigger all rules that respond to an event
in particular. Please note that triggers are implemented by extending 
[Backbone.js' _Events_](http://backbonejs.org/#Events).


## Rule properties

### _priority_
Easy. See the rules below:

```JavaScript
{ priority: 2,
  condition: function IsItSomeoneElsesBirthday () { return true; },
  action: function () { console.log("Buy a present for someone"); } },

{ priority: 1,
  events: [ "anEventIDidNotTrigger" ],
  condition: function IsItMyBirthday () { return true; },
  action: function () { console.log("Buy a present for myself (with event)"); } },

{ priority: 1,
  condition: function IsItMyBirthday () { return true; },
  action: function () { console.log("Buy a present for myself"); } },
```

If you run these rules using the _runAll_ method the output is:

```
Buy a present for myself
Buy a present for someone
```

Note that the rule that is associated explicitly to an event is not executed, as 
I did not trigger the _anEventIDidNotTrigger_ event.

### _condition_ 
Easy, again. If the rules are:

```JavaScript
{ priority: 2,
	condition: function IsSomeoneElsesBirthday () { return true; },
	action: function () { console.log("Buy a present for someone"); } },

{ priority: 1,
	condition: function IsItMyBirthday () { return false; },
	action: function () { console.log("Buy a present for myself"); } },
```

If you run these two rules using the _runAll_ method the output is:

```
Buy a present for someone
```

### _breakFlow_
Easy, again. Remember that if no condition is specified, the rule is always 
applicable. 

```JavaScript
{ priority: 2,
	action: function () { console.log("Buy a present for someone"); },
	breakFlow: true },

{ priority: 1,
	action: function () { console.log("Buy a present for myself"); }, 
	breakFlow: true },
```

If you run these two rules using the _runAll_ method the output is:

```
Buy a present for myself
```

as the rule with higher priority breaks the flow, and the following are not
evaluated.

### _events_
Still easy, I believe. Remember that events are implemented by extending the
rules engine object with [Backbone.Events](http://backbonejs.org/#Events).

```JavaScript
{ priority: 2,
	events: [ "itsSomeoneElsesBirthday" ],
	action: function () { console.log("Buy a present for someone"); } },

{ priority: 1,
	events: [ "itsMyBirthday" ],
	condition: function itsNotReally () { return false; },
	action: function () { console.log("Buy a present for myself"); }, },
```

If you run these two rules by calling the _trigger("itsSomeoneElsesBirthday")_ 
method of the rules engine, the output is:

```
Buy a present for someone
```

Note that nothing happens if I _trigger("itsMyBirthday")_, as the condition is 
not verified.

Events also have a jolly: the underscore symbol \_. By specifying "\_" among the 
events, a rule is evaluated wether one of its events have been triggered or the
_runAll_ method has been called. If the rules were:

```JavaScript
{ priority: 2,
	events: [ "itsSomeoneElsesBirthday" ],
	action: function () { console.log("Buy a present for someone"); } },

{ priority: 1,
	events: [ "_", "itsMyBirthday" ],
	action: function () { console.log("I can't really miss my birthday. Buy a present for myself"); }, },
```

... the output of both _runAll_ and _trigger("itsMyBirthday")_ would be:

```
I can't really miss my birthday. Buy a present for myself
```

Note that calling _runAll_ is equivalent to triggering the "\_" event, even if
event-less rules do not explicitly list "\_" among their events.

## Context
An object can be passed as a parameter to _runAll_, or as the 'message' of an 
event to be triggered. When doing this, the _context_ object is passed 'by 
reference to both the condition and action functions, that can modify it, e.g. 
to share data that is relevant only within the rule evaluation and the action.

For example, the output of this script:

```JavaScript
var exampleRules = [
		
  { condition: function (context) { return context.lyrics === "sunday"; },
    action: function (context) { context.lyrics += " bloody sunday" }, },

  { condition: function (context) { return context.lyrics === "obladi"; },
    action: function (context) { context.lyrics += " oblada" }, },

];
var rulesEngine = new JSRulez(exampleRules),
    context = { lyrics: "obladi" };
rulesEngine.runAll(context);
console.log(context.lyrics);
```

... is "obladi oblada".

## MIT Licence
Copyright (C) 2012 Gianfranco Cecconi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
