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

		var that = this;
		this.init();

		this.moveToPosition();
	}

	Mirage.prototype.init = function () {
		this.buildContainer();
		this.populateContainer();
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
			box.data('moveToPosition', i + 1);
			if (i === 0)
				box.addClass('first');
			else if (i == 2)
				box.addClass('second');
			else if (i == 3)
				box.addClass('third');
			else
				box.addClass('hidden');
			$container.append(box);
		});

	};

	Mirage.prototype.rotate = function(direction) {
		$boxes = $('.mirage-item', this.container);
		console.log(direction);
		$boxes.each(function () {
			var newPos;
			var currentPos = $(this).data('miragePosition');
			if (direction == 'clockwise') {
				newPos = currentPos + 1 <= $boxes.size() ? currentPos + 1 : 1;
			} else {
				newPos = currentPos - 1 < 1 ? $boxes.size() : currentPos - 1;
			}
			$(this).data('miragePosition',newPos);

			if (newPos === 1)
				$(this).addClass('first').removeClass('second').removeClass('third').removeClass('hidden');
			else if (newPos == 2)
				$(this).addClass('second').removeClass('first').removeClass('third').removeClass('hidden');
			else if (newPos == 3)
				$(this).addClass('third').removeClass('first').removeClass('second').removeClass('hidden');
			else
				$(this).addClass('hidden').removeClass('first').removeClass('second').removeClass('third');
		});

	};

	Mirage.prototype.moveToPosition = function() {
		var that = this,
			$boxes = $('.mirage-item', this.container);
		$boxes.each(function() {
			var mLength = 150,
				$this = $(this),
				i = $this.data('miragePosition');

			$this.animate({'left': (i - 1) * mLength});
		});

		$('.mirage-item').unbind('click');
			
		$('.mirage-item.first').on('click', function() {
			console.log('clockwise');
			that.rotate('clockwise');
			that.moveToPosition();
		});

		$('.mirage-item.third').on('click', function() {
			console.log('counter');
			that.rotate();
			that.moveToPosition();
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