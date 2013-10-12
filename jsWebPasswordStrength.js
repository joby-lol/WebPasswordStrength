/** @license
* jsWebPasswordStrength
* Copyright (c) 2013 Joby Elliott
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

/* jsWebPasswordStrength @constructor */
function jsWebPasswordStrength(options)
{
	var defaults = {
		bitstrengths:[
			{
				'bits':0,
				'name':'weak',
			},
			{
				'bits':30,
				'name':'fair',
			},
			{
				'bits':60,
				'name':'strong',
			},
			{
				'bits':80,
				'name':'ideal'
			}
		],
		tests:{
			'minimum length':{
				'regex':/^.{0,7}$/,
				'message':'password should be at least 8 characters',
				'value':-100
			}
		},
		characterCategories:{
			'lower case letter':{
				'regex':/[a-z]/,
				'count':26,
				'penalty':6
			},
			'upper case letter':{
				'regex':/[A-Z]/,
				'count':26,
				'penalty':6
			},
			'number':{
				'regex':/[0-9]/,
				'count':10,
				'penalty':4
			},
			'whitespace':{
				'regex':/[ ]/,
				'count':3
			},
			'special character':{
				'regex':/[^a-zA-Z0-9 ]/,
				'count':191,
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

jsWebPasswordStrength.prototype.test = function (password)
{
	this.results = {
		'bitspercharacter':0,
		'characters':password.length,
		'suggestions':[],
		'characterpenalty':0,
		'strength':''
	};
	//check character categories and compute bit strength
	for (var cat in this.options.characterCategories) {
		if (password.match(this.options.characterCategories[cat].regex)) {
			this.results.bitspercharacter += Math.log(this.options.characterCategories[cat].count);
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
		if (this.options.tests[test].regex) {
			if (password.match(this.options.tests[test].regex)) {
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
		if (this.results.bitstrength && this.results.scorestrength) {
			break;
		}
	}
	//return results
	return this.results;
}
jsWebPasswordStrength.prototype.strength = function () {
	return this.results.strength;
}
jsWebPasswordStrength.prototype.score = function () {
	return this.results.score;
}
jsWebPasswordStrength.prototype.suggestions = function () {
	return this.results.suggestions;
}
jsWebPasswordStrength.prototype.addTest = function (test)
{

}