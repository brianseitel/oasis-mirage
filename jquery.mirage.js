// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variables rather than globals
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = 'Mirage',
	defaults = {
		'containerWidth': 500,
		'imageMaxWidth': 150,
		'imageMaxHeight': 150,
		'imageMinWidth': 120,
		'imageMinHeight': 120,
		'hiddenWidth': 0,
		'speed': 1500
	};

	// The actual plugin constructor
	function Mirage( element, options ) {
		this.element = element;


		this._defaults = defaults;

		this.options = $.extend( {}, defaults, options) ;

		this._name = pluginName;
		this.container = $(element);
		this.image_list = $('li', this.container);
		this.parentItem = $(element).parent();
		this.original = this.container.clone();

		var that = this,
			attachEvents = function() {
				$('.mirage-item', this.container).on('click', this.rotateItem);
			},
			rotateItem = function() {
				var $this = $(this);
				if ($this.hasClass('first'))
					that.rotate($this, 'clockwise', false);
				else if ($this.hasClass('third'))
					that.rotate($this, 'counterclockwise', false);
			},
			nextItem = function(current) {
				if (current === this.image_list.length)
					return 1;
				else
					return current + 1;
			},
			previousItem = function(current) {
				if (current === 1)
					return this.image_list.length;
				else
					return current - 1;
			};
		this.init();


	}

	Mirage.prototype.init = function () {
		// Place initialization logic here
		// You already have access to the DOM element and the options via the instance, 
		// e.g., this.element and this.options
		
		this.buildContainer();
		this.populateContainer();
		Mirage.attachEvents();
		this.rotate(1, 'counterclockwise', true);
	};

	Mirage.prototype.buildContainer = function() {
		this.container.html('');
		var container = $('<div/>').attr('id', 'mirage-box');
		this.container.replaceWith(container);
		this.container = container;
	};

	Mirage.prototype.populateContainer = function() {
		var images, $container = this.container, $options = this.options;
		this.image_list.each(function(i, item) {
			var box = $('<div/>').addClass('mirage-item').data('miragePosition', i+1).html($('img', item).first());
			$container.append(box);
		});

	};


	Mirage.prototype.rotate = function(direction) {
		$boxes = $('.mirage-item', this.container);
		$boxes.each(function () {
			var newPos;
			if (direction === false) {
				newPos = getNextNum($(this).data().position);
			} else {
				newPos = getPreviousNum($(this).data().position);
			}
			$(this).data('position',newPos);
		});
	};

	// A really lightweight plugin wrapper around the constructor, 
	// preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Mirage( this, options ));
			}
		});
	};

})( jQuery, window, document );