/**
 * Swipe Extended Slider
 *
 * @author Cédric Ducarre
 * @version 0.1
 * @copyright 2013, Creative Commons Attribution-ShareAlike 3.0 France License
 * 
 * This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 France License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/fr/ or send a
 * letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 * This work uses the original Swipe 2.0, created by Brad Birdsall under MIT License,
 * http://swipejs.com/.
 */

;(function($, window, document, undefined) {

	var defaults = {
		lazyLoad:		false,
		lazyLoadRange:	1,
		hideClass:		'hide',
		activeClass:	'active',
		defaultImg:
			'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		auto:			false
	};

	/**
	 * Swipext implementation.
	 * 
	 * @param {object} element Swipext DOM node.
	 * @param {object} options JSON options.
	 */
	function Swipext( element, options ) {

		this.iCurrentSlide	= 0;
		this.oSwipe			= undefined;

		this.domSwipext = element;

		this.objSwipext = $(this.domSwipext);
		this.objSwipe	= $('.swipe',			this.objSwipext);
		this.objWrap	= $('.swipe-wrap',		this.objSwipext);
		this.objSlides	= $('.swipe-slide',		this.objSwipext);
		this.objBtnPrev = $('.swipe-prev',		this.objSwipext);
		this.objBtnNext = $('.swipe-next',		this.objSwipext);
		this.objPages	= $('.swipe-pages',		this.objSwipext);
		this.objCaption = $('.swipe-caption',	this.objSwipext);

		this.options = $.extend({}, defaults, options, {

			lazyLoad:		this.objSwipext.data('lazyload'),
			lazyLoadRange:	this.objSwipext.data('lazyloadrange'),
			defaultImg:		this.objSwipext.data('defaultimg'),
			hideClass:		this.objSwipext.data('hideclass'),
			activeClass:	this.objSwipext.data('activeclass'),
			auto:			this.objSwipext.data('auto'),
			continuous:		this.objSwipext.data('continuous'),
			speed:			this.objSwipext.data('speed'),
			startSlide:		this.objSwipext.data('startslide'),
			callback:		this._makeCallback(this, this.onSlide)
		});

		// Ok ! Let'go...
		this.init();
	}

	Swipext.prototype = {

		/**
		 * This where all starts.
		 */
		init: function() {

			// == Init new features
			this._initCaption();
			this._initLazyLoading();
			this._initPagination();

			// == Run original Swipe
			this.oSwipe = new Swipe(this.objSwipe.get(0), this.options);

			// == Manually init first slide
			this.onSlide(this.options.startSlide, this.objSlides.get(this.options.startSlide));

			// == Init navitation controls
			this.objBtnPrev.click( this.oSwipe.prev );
			this.objBtnNext.click( this.oSwipe.next );
		},

		/**
		 * Callback plugged to on slide swipe event.
		 * 
		 * @param  {integer} index Slide index.
		 * @param  {dom} slide Current slide DOM node.
		 */
		onSlide: function(index, slide) {

			this.iCurrentSlide = index;

			// == Do lazy loading !
			if( this.options.lazyLoad ) {

				this._toggleSlidesImg(index, this.options.lazyLoadRange);
				this.onResize();
			}

			// == Update caption
			if( this.objCaption.length > 0 )
				this.objCaption.html( $('.swipe-slide-caption', slide).html() );

			this._updateNavButtons();
		},

		/**
		 * On resize window.
		 */
		onResize: function() {

			var sCurrentHeight = $('img', this.objSlides[this.iCurrentSlide]).height();

			$('img', this.objSlides).each(function() {

				if( $(this).attr('src') != $(this).data('src') )
					$(this).css('max-height', sCurrentHeight);
			});
		},

		/**
		 * On click on a pagination button.
		 * @param  {object} event Click event.
		 */
		onGoToSlide: function(event) {

			this.oSwipe.slide( $(event.target).data('index') );
		},

		/**
		 * Init caption if DOM node exists.
		 */
		_initCaption: function() {

			if( this.objCaption.length <= 0 )
				return;

			$('.swipe-slide-caption', this.objSlides).hide();
		},

		/**
		 * Init lazy loading if option active.
		 */
		_initLazyLoading: function() {

			if( !this.options.lazyLoad )
				return;

			this.options.startSlide = 0;

			// Init images height when loaded since blank images are squared
			var onResizeCb = this._makeCallback(this, this.onResize);

			$(window)
				.load(onResizeCb)
				.resize(onResizeCb);
		},

		/**
		 * Init pagination buttons.
		 */
		_initPagination: function() {

			if( this.objPages.length <= 0 )
				return;

			// == If pagination controls are already there
			var objPagesBtn = $('.swipe-page', this.objPages);
			if( objPagesBtn.length > 0 ) {

				objPagesBtn.click(this._makeCallback(this, this.onGoToSlide));
				return;
			}

			// == Else, generate controls
			var sHtmlTag = this.objPages.data('tag') || 'button',
				mCaption = undefined;

			for( var i = 0 ; i < this.objSlides.length ; i++ ) {

				// Get button title from caption
				mCaption = $('.swipe-slide-caption', this.objSlides[i]).html();
				mCaption = $( $.parseHTML(mCaption) ).get(0);
				mCaption = ( mCaption !== undefined ? mCaption.textContent : '' );

				// Generate page button
				$('<'+ sHtmlTag +'>'+ (i + 1) +'</'+ sHtmlTag +'>')
					.addClass('swipe-page')
					.attr({
						'data-index': i,
						'title': mCaption
					})
					.click(this._makeCallback(this, this.onGoToSlide))
					.appendTo(this.objPages);
			}
		},

		/**
		 * Load/unload images from given index, around range.
		 * 
		 * @param  {integer} from Index from which load images.
		 * @param  {integer} range Number of images to load around the "from" index.
		 */
		_toggleSlidesImg: function(from, range) {

			var iLeftBound = from - range - 1,
				iRightBound = from + range + 1,
				iLoopIndex = 0, iGap = 0;

			// == Process around current slide
			for( i = iLeftBound ; i <= iRightBound ; i++ ) {

				iLoopIndex = i;

				// == Apply offset to current index in continuous mode
				if( this.options.continuous ) {

					if( i < 0 )
						iLoopIndex = i + this.oSwipe.getNumSlides();

					if( i > this.oSwipe.getNumSlides() - 1)
						iLoopIndex = i - this.oSwipe.getNumSlides();
				}
				
				if( iLoopIndex >= 0 && iLoopIndex < this.oSwipe.getNumSlides() ) {

					objSlideImg = $('img', this.objSlides.get(iLoopIndex));

					if( objSlideImg.length <= 0 )
						console.warn('swipext : slide image is missing !');

					iGap = Math.abs(i - from);

					// Unload image if needed
					if( iGap > range && objSlideImg.attr('src') != this.options.defaultImg )
						objSlideImg.attr('src', this.options.defaultImg);

					// Load image if needed
					if( iGap <= range && objSlideImg.attr('src') != objSlideImg.data('src') )
						objSlideImg.attr('src', objSlideImg.data('src')).css('max-height', '');
				}
			}

			// == Unload images out of current range
			for( i = 0 ; i < this.objSlides.length ; i++ ) {

				if( Math.abs(from - i) > range ) {

					objSlideImg = $('img', this.objSlides.get(i));

					if( objSlideImg.attr('src') != this.options.defaultImg )
						objSlideImg.attr('src', this.options.defaultImg);
				}
			} 
		},

		/**
		 * Update controls buttons.
		 */
		_updateNavButtons: function() {

			// == Update nav buttons
			if( !this.options.continuous ) {

				if( this.oSwipe.getPos() > 0 && this.objBtnPrev.hasClass(this.options.hideClass) )
					this.objBtnPrev.removeClass(this.options.hideClass);

				if( this.oSwipe.getPos() == 0 && !this.objBtnPrev.hasClass(this.options.hideClass) )
					this.objBtnPrev.addClass(this.options.hideClass);

				if( this.oSwipe.getPos() >= (this.oSwipe.getNumSlides() - 1) &&
					!this.objBtnNext.hasClass(this.options.hideClass) )
					this.objBtnNext.addClass(this.options.hideClass);

				if( this.oSwipe.getPos() <= (this.oSwipe.getNumSlides() - 2) &&
					this.objBtnNext.hasClass(this.options.hideClass) )
					this.objBtnNext.removeClass(this.options.hideClass);
			}

			// == Update pagination buttons
			if( this.objPages.length > 0 ) {

				$('.swipe-page', this.objPages).removeClass( this.options.activeClass );
				$('.swipe-page[data-index='+ this.oSwipe.getPos() +']', this.objPages)
					.addClass(this.options.activeClass);
			}
		},

		/**
		 * Make a function callable in given context.
		 * 
		 * @param  {object} context Context instance.
		 * @param  {function} method  Callback method name.
		 * @return {function} New callback function.
		 */
		_makeCallback: function(context, method) {

			return function() {

				return method.apply(context, arguments);
			};
		}
	};

	/**
	 * Publish the jQuery plugin.
	 */
	$.fn['swipext'] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_swipext")) {
                $.data(this, "plugin_swipext", new Swipext( this, options ));
            }
        });
    };
	
})(jQuery, window, document, undefined);