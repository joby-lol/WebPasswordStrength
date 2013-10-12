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

function jsWebPasswordStrength_widget(element,options,widgetManager) {
	if (element) {
		this.p = new jsWebPasswordStrength(options);
		this.e = element;
		//add event listener
		var p = this.p;
		var e = this.e;
		e.addEventListener('input',function(){p.test(e.value)});
		//set up widget manager
		if (!widgetManager) {
			this.w = new this.widgetManager_default(this.e,this.p);
		}
	}
}

jsWebPasswordStrength_widget.prototype.widgetManager_default = function (e,p) {
	//construct
	var widgetManager = this;
	widgetManager.name = 'default widgetManager';
	e.insertAdjacentHTML('afterEnd','<div class="jswps_widget"></div>');
	var w = e.nextSibling;
	//update function -- called by event listener below
	widgetManager.update = function(){
		w.innerHTML = 'score: '+p.score();
	}
	//set up event listener -- this happens in the widget to make them more flexible
	e.addEventListener('input',function(){widgetManager.update()});
}

/*
	passing thru some of the functions from the analysis
*/
jsWebPasswordStrength_widget.prototype.strength = function () {
	//return score strength by default, so that penalties are meaningful
	return this.p.strength();
}
jsWebPasswordStrength_widget.prototype.bitstrength = function () {
	return this.p.bitstrength();
}
jsWebPasswordStrength_widget.prototype.scorestrength = function () {
	return this.p.scorestrength();
}
jsWebPasswordStrength_widget.prototype.score = function () {
	return this.p.score();
}
jsWebPasswordStrength_widget.prototype.suggestions = function () {
	return this.p.suggestions();
}
jsWebPasswordStrength_widget.prototype.addTest = function (name,test)
{
	return this.p.addTest(name,test);
}
jsWebPasswordStrength_widget.prototype.removeTest = function (name) {
	return this.p.removeTest(name);
}