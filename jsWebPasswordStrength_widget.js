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
		this.setWidgetManager(widgetManager);
	}
}

jsWebPasswordStrength_widget.prototype.setWidgetManager = function(widgetManager) {
	if (this.w) {
		this.w.destruct();
	}
	if (!widgetManager) {
		this.w = new this.widgetManagers.default(this.e,this.p);
	}else {
		if (typeof(widgetManager) == 'string') {
			if (this.widgetManagers[widgetManager]) {
				this.w = new this.widgetManagers[widgetManager](this.e,this.p);
			}else {
				this.w = new this.widgetManagers.default(this.e,this.p);
			}
		}else {
			this.w = new widgetManager(this.e,this.p);
		}
	}
}

jsWebPasswordStrength_widget.prototype.widgetManagers = {};
jsWebPasswordStrength_widget.prototype.widgetManagers.default = function (e,p) {
	//construct
	var widgetManager = this;
	widgetManager.name = 'default widgetManager';
	e.insertAdjacentHTML('afterEnd','<div class="jswps_widget_default"><div class="jswps_widget_default_progressbar"><div class="jswps_widget_default_progressbar_inner"></div></div><div class="jswps_widget_default_output"></div></div>');
	var w = e.nextSibling;
	var progressbar = w.getElementsByClassName('jswps_widget_default_progressbar_inner')[0];
	var textarea = w.getElementsByClassName('jswps_widget_default_output')[0];
	//update function -- called by event listener below
	widgetManager.update = function(){
		w.className = 'jswps_widget_default '+p.strength();
		progressbar.className = 'jswps_widget_default_progressbar_inner active';
		progressbar.setAttribute('style','width:'+p.score()+'%;');
		textarea.innerHTML = 'strength: '+p.strength();
		//match styling of widget to its form field (size-wise)
		var css = e.currentStyle || window.getComputedStyle(e);
		var styles = [
			'width:'+e.offsetWidth+'px',
			'margin-left:'+css.marginLeft,
			'margin-right:'+css.marginRight
		];
		w.setAttribute('style',styles.join(';'));
	}
	//set up event listener -- this happens in the widget to make them more flexible
	var listener = e.addEventListener('input',function(){widgetManager.update()});
	//destructor
	widgetManager.destruct = function() {
		w.parentNode.removeChild(w);
		delete listener;
	}
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