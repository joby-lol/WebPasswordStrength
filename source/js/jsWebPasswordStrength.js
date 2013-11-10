/** @license
* WebPasswordStrength
* Copyright (c) 2013 Joby Elliott
* http://go.byjoby.net/WebPasswordStrength
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
*/

function jsWebPasswordStrength(options) {
	var defaults = {
		/*
			An array of objects, each defining a break point for how various bit
			strengths should be rated.
			in the form:
			{
				'bits':[number]//the minimum number of bits to achieve this rating
				'name':'[name]'//the natural-language output from the rating system
			}
		*/
		bitstrengths:[
			{
				'bits':0,
				'name':'weak',
			},
			{
				'bits':64,
				'name':'fair',
			},
			{
				'bits':72,
				'name':'strong',
			},
			{
				'bits':100,
				'name':'ideal'
			}
		],
		/*
			An object of objects, each defining a test to be applied to the password
			Instead of an object, you can also pass in a function, it will be given
			the password as its first argument, and should return an object with
			properties 'score' and 'suggestions'
			Score will be added to the 0-100 score (so make it negative for penalties)
			Suggestions can be either a single string or an array of multiple strings
			Should have a meaningful name, since that's what needs to be used
			when adding and removing them through the interface functions.
		*/
		tests:{
			'minimum length':{
				'regex':/^.{0,7}$/,
				'message':'password should be at least 8 characters',
				'value':-10
			}
		},
		/*
			An object of objects, each defines a regular expression. Each also defines
			the count of characters this regex matches (used for computing bits per
			character). Penalties to the final 0-100 score can be applied for missing
			categories.
		*/
		characterCategories:{
			'lower case letter':{
				'regex':/[a-z]/,
				'count':26,
				'penalty':9.4
			},
			'upper case letter':{
				'regex':/[A-Z]/,
				'count':26,
				'penalty':9.4
			},
			'number':{
				'regex':/[0-9]/,
				'count':10,
				'penalty':6.6
			},
			'whitespace':{
				'regex':/[ ]/,
				'count':3
			},
			'special character':{
				'regex':/[^a-zA-Z0-9 ]/,
				'count':32,
				'penalty':10
			}
		}
	};
	//loop through all options and merge them with defaults
	//don't do anything with tests or requirements just yet
	if (typeof(options) == 'object') {
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				switch (prop)
				{
					case 'tests':
						break;
					default:
						defaults[prop] = options[prop];
				}
			}
		}
	}
	this.options = defaults;
	//add any tests from options
	if (typeof(options) == 'object') {
		if (options.tests) {
			for (var test in options.tests) {
				if (options.tests.hasOwnProperty(test)) {
					this.addTest(options.tests[test]);
				}
			}
		}
	}
}

jsWebPasswordStrength.prototype.test = function (passwordToTest) {
	this.results = {
		'bitspercharacter':0,
		'characters':passwordToTest.length,
		'suggestions':[],
		'characterpenalty':0
	};
	//check character categories and compute bit strength
	for (var cat in this.options.characterCategories) {
		if (passwordToTest.match(this.options.characterCategories[cat].regex)) {
			this.results.bitspercharacter += Math.log(this.options.characterCategories[cat].count)/Math.log(2);
		}else if (this.options.characterCategories[cat].penalty) {
			this.results.suggestions.push('include '+cat+'s');
			this.results.characterpenalty += this.options.characterCategories[cat].penalty;
		}
	}
	this.results.bits = Math.floor(this.results.bitspercharacter*this.results.characters);
	//compute score 0-100 where 100 = ideal bits
	this.results.idealbits = this.options.bitstrengths[this.options.bitstrengths.length-1].bits;
	this.results.score = Math.round(this.results.bits/this.results.idealbits*100);
	this.results.score = this.results.score>100?100:this.results.score;
	//run tests and adjust score
	for (var test in this.options.tests) {
		if (typeof(this.options.tests[test]) == 'function') {
			var testResult = this.options.tests[test](passwordToTest);
			this.results.score += testResult.score;
			if (testResult.suggestions && testResult.score < 0) {
				if (typeof(testResult.suggestions) == 'string') {
					this.results.suggestions.push(testResult.suggestions);
				}else {
					for (var suggestion in testResult.suggestions) {
						this.results.suggestions.push(testResult.suggestions[suggestion]);
					}
				}
			}
		}else if (this.options.tests[test].regex) {
			if (passwordToTest.match(this.options.tests[test].regex)) {
				this.results.score += this.options.tests[test].value;
				this.results.suggestions.push(this.options.tests[test].message);
			}
		}
	}
	//adjust score for character type penalties
	this.results.score -= this.results.characterpenalty;
	//keep score within range
	this.results.score = this.results.score>100?100:this.results.score;
	this.results.score = this.results.score<0?0:this.results.score;
	//assign a rating
	for (var i in this.options.bitstrengths) {
		if (this.results.score >= this.options.bitstrengths[i].bits/this.results.idealbits*100) {
			this.results.scorestrength = this.options.bitstrengths[i].name;
		}
		if (this.results.bits >= this.options.bitstrengths[i].bits) {
			this.results.bitstrength = this.options.bitstrengths[i].name;
		}
	}
	//return results
	return this.results;
}
jsWebPasswordStrength.prototype.strength = function () {
	//return score strength by default, so that penalties are meaningful
	return this.results.scorestrength;
}
jsWebPasswordStrength.prototype.bitstrength = function () {
	return this.results.bitstrength;
}
jsWebPasswordStrength.prototype.scorestrength = function () {
	return this.results.scorestrength;
}
jsWebPasswordStrength.prototype.score = function () {
	return this.results.score;
}
jsWebPasswordStrength.prototype.suggestions = function () {
	return this.results.suggestions;
}
jsWebPasswordStrength.prototype.addTest = function (name,test)
{
	this.options.tests[name] = test;
}
jsWebPasswordStrength.prototype.removeTest = function (name) {
	delete this.options.tests[name];
}