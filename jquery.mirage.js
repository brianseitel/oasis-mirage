// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	// Create the defaults once
	var pluginName = 'Mirage',
	defaults = {
		'containerWidth': 500,
		'containerHeight': 200,
		'distanceMultiplier': 1,
		'imageOpacity': 0.7,
		'hiddenWidth': 50,
		'hiddenHeight': 50,
		'speed': 1500,
		'shadowOffset': 50
	};

	// The actual plugin constructor
	function Mirage( element, options ) {
		this.element = element;

		this.arrows = '<span class="mirage-left"></span><span class="mirage-right"></span>';


		this._defaults = defaults;

		this.options = $.extend( {}, defaults, options) ;

		this.options.imageMaxWidth = (this.options.containerWidth / 3);
		this.options.imageMaxHeight = this.options.containerHeight;
		this.options.imageMinWidth = (this.options.containerWidth / 3) * 0.9;
		this.options.imageMinHeight = this.options.containerHeight * 0.9;

		this._name = pluginName;
		this.container = $(element);
		this.image_list = $('li', this.container);
		this.parentItem = $(element).parent();
		this.original = this.container.clone();

		var self = this;
		this.preload();
	}

	Mirage.prototype.preload = function() {
		var $images = this.container.find("img"),
			imagesLoaded = 0,
			imageCount = $images.length,
			self = this;
		$images.load(function () {
			imagesLoaded++;
			var $this = $(this);
			if (imagesLoaded == imageCount) {
				self.init();
				self.container.show();
				self.moveToPosition();
			}

			if (this.complete)
				$(this).trigger('load');
		});
	};

	Mirage.prototype.init = function () {
		this.buildContainer();
		this.container.css({
			'width': this.options.containerWidth,
			'height': this.options.containerHeight
		});
		this.populateContainer();
	};

	Mirage.prototype.attachListeners = function() {
		$('.mirage-item')
			.off('mouseenter')
			.off('mouseleave');

		$('.mirage-item.mirage-first')
			.off('mouseenter')
			.off('mouseleave')
			.on('mouseenter', function() {
				$('.mirage-left', this).show();
			})
			.on('mouseleave', function() {
				$('.mirage-left', this).hide();
			});

		$('.mirage-item.mirage-third')
			.off('mouseenter')
			.off('mouseleave')
			.on('mouseenter', function() {
				$('.mirage-right', this).show();
			})
			.on('mouseleave', function() {
				$('.mirage-right', this).hide();
			});
	};

	Mirage.prototype.buildContainer = function() {
		this.container.html('');
		var container = $('<div/>').attr('id', 'mirage-box');
		this.container.replaceWith(container);
		this.container = container;
		this.container.hide();
	};

	Mirage.prototype.populateContainer = function() {
		var images, $container = this.container, $options = this.options, self = this;
		this.image_list.each(function(i, item) {
			var image = $('img', item);
			var box = $('<div/>').addClass('mirage-item').data('miragePosition', i+1);
			var img = $('<div/>').addClass('mirage-image').html(item.innerHTML).append(self.arrows);
			var diff = img.width - box.width < 0 ? 0 : img.width - box.width;
			img.css('left', -(diff / 2)).css('width', image.width);
			box.append(img);
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
				$(this)
					.addClass('mirage-first')
					.removeClass('mirage-second')
					.removeClass('mirage-third')
					.removeClass('mirage-hidden');
			else if (newPos == 2)
				$(this)
					.addClass('mirage-second')
					.removeClass('mirage-first')
					.removeClass('mirage-third')
					.removeClass('mirage-hidden');
			else if (newPos == 3)
				$(this)
					.addClass('mirage-third')
					.removeClass('mirage-first')
					.removeClass('mirage-second')
					.removeClass('mirage-hidden');
			else
				$(this)
					.addClass('mirage-hidden')
					.removeClass('mirage-first')
					.removeClass('mirage-second')
					.removeClass('mirage-third');
		});

	};

	Mirage.prototype.moveToPosition = function() {
		var self = this,
			$boxes = $('.mirage-item', this.container);

		$('.mirage-item .mirage-left').unbind('click');
		$('.mirage-item .mirage-right').unbind('click');
		
		$boxes.each(function() {
			var $this = $(this),
				i = $this.data('miragePosition'),
				imgbox = $('.mirage-image', this),
				img = $('img', imgbox),
				leftOffset = self.options.containerWidth / 10,
				newtop = 0;
			$this.animate({
				'left': i > 3 ? 2 * self.options.imageMaxWidth * self.options.distanceMultiplier + leftOffset : i == 2 ? (i - 1) * self.options.imageMaxWidth  * self.options.distanceMultiplier - 15  + leftOffset : (i - 1) * self.options.imageMaxWidth  * self.options.distanceMultiplier + leftOffset,
				'top': i != 2 ? 15 : 0,
				'width': i == 2 ? self.options.imageMaxWidth : i > 3 ? self.options.hiddenWidth : self.options.imageMinWidth,
				'height': i == 2 ? self.options.imageMaxHeight + self.options.shadowOffset : i > 3 ? self.options.hiddenHeight : self.options.imageMinHeight + self.options.shadowOffset,
				'opacity': i == 2 ? 1 : i > 3 ? 0 : self.options.imageOpacity
			}, self.options.speed, 'swing');

			if (img.height < $this.height()) {
				newtop = ($this.height() - img.height) / 2;
			} else {
				newtop = (img.height - $this.height()) / 2;
			}

			imgbox.animate({
				'top': newtop
			});
		});

		$('.mirage-item.mirage-first .mirage-left').on('click', function() {
			self.rotate('clockwise');
			self.moveToPosition();
			self.attachListeners();
		});

		$('.mirage-item.mirage-third .mirage-right').on('click', function() {
			self.rotate();
			self.moveToPosition();
			self.attachListeners();
		});
		self.attachListeners();
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