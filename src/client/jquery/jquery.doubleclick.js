import $ from 'jquery';
import jQuery from 'jquery';


(function() {

    var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    matched = jQuery.uaMatch( navigator.userAgent );
    browser = {};

    if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
    }

// Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
        browser.webkit = true;
    } else if ( browser.webkit ) {
        browser.safari = true;
    }

    jQuery.browser = browser;

    jQuery.sub = function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
    };

})();


// Author: Jacek Becela
// Source: http://gist.github.com/399624
// License: MIT
jQuery.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {
return this.each(function() {
	var clicks = 0, self = this;
	if (jQuery.browser.msie) { // ie triggers dblclick instead of click if they are fast
		jQuery(this).bind("dblclick", function(event) {
			clicks = 2;
			double_click_callback.call(self, event);
		});
		jQuery(this).bind("click", function(event) {
			setTimeout(function() {
				if (clicks != 2) {
					single_click_callback.call(self, event);
				}
				clicks = 0;
			}, timeout || 300);
		});
	} else {
		jQuery(this).bind("click", function(event) {
			clicks++;
			if (clicks == 1) {
				setTimeout(function() {
					if (clicks == 1) {
						single_click_callback.call(self, event);
					} else {
						double_click_callback.call(self, event);
					}
					clicks = 0;
				}, timeout || 300);
			}
		});
	}
});
};

jQuery.fn.single_double_tap = function(single_tap_callback, double_tap_callback, timeout) {
return this.each(function() {
	var clicks = 0, self = this;
	jQuery(this).bind("touchend", function(event) {
		clicks++;
		if (clicks == 1) {
			setTimeout(function() {
				if (clicks == 1) {
					single_tap_callback.call(self, event);
				} else {
					double_tap_callback.call(self, event);
				}
				clicks = 0;
			}, timeout || 300);
		}
	});
});
};

