#WebPasswordStrength

A set of JavaScript tools for rating and displaying the ratings of passwords in HTML forms.

All tools are designed to be truly modern, using the latest JavaScript APIs. Everything is designed to make a little impact as possible on the surrounding page and styling, and in the case of UI elements to fail gracefully by simply not impacting the page at all.

##Current status

###Javascript password analysis
It could be fancier, but it's up and it works (and fairly well, if I do say so myself)

###Front end display of password strength
Not started, but will be modular and allow different plugins for different methods of displaying strength and suggestions

###jQuery plugin
Once the display code is stable, I plan on wrapping it in a jQuery plugin for people who are into that sort of thing.

###Server-side password analysis
Not even started.

##Plans for the future

I intend to add server-side support (likely PHP at first, possibly Python). When using server-side strength ratings you'll be able to get a more accurate measure of password strength via things like dictionary lookups and pattern checking. This checking will be done vi Ajax, but the plan is to use the exact same Javascript classes for analysis and display, that way switching between the two is easy for site owners.