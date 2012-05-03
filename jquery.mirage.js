// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	// Create the defaults once
	var pluginName = 'Mirage',
	defaults = {
		'containerWidth': 500,
		'distanceMultiplier': 1,
		'imageMaxWidth': 150,
		'imageMaxHeight': 150,
		'imageMinWidth': 120,
		'imageMinHeight': 120,
		'imageOpacity': 0.7,
		'hiddenWidth': 50,
		'hiddenHeight': 50,
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

		var self = this;
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
				box.addClass('mirage-first');
			else if (i == 1)
				box.addClass('mirage-second');
			else if (i == 2)
				box.addClass('mirage-third');
			else
				box.addClass('mirage-hidden');
			$container.append(box);
		});

	};

	Mirage.prototype.rotate = function(direction) {
		$boxes = $('.mirage-item', this.container);
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
				$(this).addClass('mirage-first').removeClass('mirage-second').removeClass('mirage-third').removeClass('mirage-hidden');
			else if (newPos == 2)
				$(this).addClass('mirage-second').removeClass('mirage-first').removeClass('mirage-third').removeClass('mirage-hidden');
			else if (newPos == 3)
				$(this).addClass('mirage-third').removeClass('mirage-first').removeClass('mirage-second').removeClass('mirage-hidden');
			else
				$(this).addClass('mirage-hidden').removeClass('mirage-first').removeClass('mirage-second').removeClass('mirage-third');
		});

	};

	Mirage.prototype.moveToPosition = function() {
		var self = this,
			$boxes = $('.mirage-item', this.container);

		$boxes.each(function() {
			var $this = $(this),
				i = $this.data('miragePosition');

			$this.animate({
				'left': i > 3 ? 2 * self.options.imageMaxWidth * self.options.distanceMultiplier : i == 2 ? i * self.options.imageMaxWidth  * self.options.distanceMultiplier - 15 : i * self.options.imageMaxWidth  * self.options.distanceMultiplier,
				'top': i != 2 ? 15 : 0,
				'width': i == 2 ? self.options.imageMaxWidth : i > 3 ? self.options.hiddenWidth : self.options.imageMinWidth,
				'height': i == 2 ? self.options.imageMaxHeight : i > 3 ? self.options.hiddenHeight : self.options.imageMinHeight,
				'opacity': i == 2 ? 1 : i > 3 ? 0 : self.options.imageOpacity
			}, self.options.speed);

		});

		$('.mirage-item').unbind('click');
			
		$('.mirage-item.mirage-first').on('click', function() {
			self.rotate('clockwise');
			self.moveToPosition();
		});

		$('.mirage-item.mirage-third').on('click', function() {
			self.rotate();
			self.moveToPosition();
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