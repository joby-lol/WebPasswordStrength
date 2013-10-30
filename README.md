#WebPasswordStrength

View a demo: http://demo.byjoby.net/WebPasswordStrength/demo.html

A set of JavaScript tools for rating and displaying the ratings of passwords in HTML forms.

All tools are designed to be truly modern, using the latest JavaScript APIs. Everything is designed to make as little impact as possible on the surrounding page and styling, and in the case of UI elements to fail gracefully by simply not impacting the page at all.

##Usage
You'll need to somehow include the contents of both js files and the css file (and minify them for production, because we're not animals).

Then, to use the widget display, just call it like so:

	var formField = document.getElementById('id-of-form-element');
	var widget = new jsWebPasswordStrength_widget(formField);

There are two more arguments available in the constructor. The second argument is an object of options. Usually you won't need that one. I intend to add interface functions for changing most of them after it constructs, which will be much easier.

The second optional argument specifies the widgetManager. Currently the only built-in widgetManager is "default", but more are planned, at at some point there will surely be instructions around here somewhere for creating your own.

##Plans for the future

Once things shake out I'll be adding an optional jQuery plugin for applying the widget displays to forms. You know, in case you're into that sort of thing.

I also intend to add server-side support (likely PHP at first, possibly Python). When using server-side strength ratings you'll be able to get a more accurate measure of password strength via things like dictionary lookups and pattern checking. This checking will be done vi Ajax, but the plan is to use the exact same Javascript classes for analysis and display, that way switching between the two is easy for site owners.
