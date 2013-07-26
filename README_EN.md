# Swipe Extended Slider

**Swipe Extended Slider** (Swipext) is a jQuery plugin which extends the excellent
[Swipe slider by Brad Birdsall][1] with new features like **image lazy loading**, **navigation** and
**pagination**.

For the needs of a web site, I had to set up a slider which must be capable to deal with more than
300 images and which had to be compatible with touch devices (iPhone, iPad, ...). The trick is, on
such device, web browsers are more often memory limited. With my 300 slides, mobile Safari crashed
at each time (at the time, I was on iPad 2 and iPhone 4).

**Swipext** can handle any content in slides but is optimized to deal with a big HTML5
figure/figcaption structure.

Interrested ? Keep going...

## Usage
### HTML structure

#### Minimum structure

``` html
<div class="swipext">
	<div class="swipe">
		<div class="swipe-wrap">
			<div class="swipe-slide">Slide content 1</div>
			<div class="swipe-slide">Slide content 2</div>
		</div>
	</div>
</div>
```

#### Full structure

``` html
<div class="swipext">
	<div class="swipe">
		<div class="swipe-wrap">
			<div class="swipe-slide">Slide content 1</div>
			<div class="swipe-slide">Slide content 2</div>
		</div>
	</div>
	<div class="swipe-nav">
		<button class="swipe-prev">Prev.</button>
		<button class="swipe-next">Next</button>
	</div>
	<div class="swipe-pages" data-tag="button"></div>
	<div class="swipe-caption"></div>
</div>
```

You can see here the additionnals features :

 * `.swipe-prev`, `.swipe-prev` : navigation controls, recognized by Swipext,
 * `.swipe-pages` : DOM node where are appended pagination controls,
 * `.swipe-caption` : DOM node where the current caption is duplicated. 

These nodes are not mandatory : add/remove them is like activate/deactivate the linked feature.

`.swipe-nav` isn't recognized by Swipext ; it's a simple node which help to embed navigation
controls.

#### Tag of pagination controls

By default, Swipext uses the `button` tag to generate the pagination.

You can change this tag from `data-tag` attribute of `.swipe-pages` element. Then, it becomes
possible to generate a pagination like :

``` html
<ul class="swipe-pages" data-tag="li"></ul>
```

### CSS base rules

``` css
/**
 * Swipejs base rules
 */
.swipe {
	overflow: hidden;
	visibility: hidden;
	position: relative;
}
.swipe-wrap {
	overflow: hidden;
	position: relative;
}
.swipe-wrap > .swipe-slide {
	float:left;
	width:100%;
	position: relative;
	margin:0;
}
.swipe-slide img {
	vertical-align: middle;
	width: 100%;
}
figure.swipe-slide { text-align: center; }

/**
 * Swipext base rules
 */
.swipext { position: relative; }
.swipext button { cursor: pointer; }
```

### Full CSS structure

Swipext uses CSS classes to manipulate slider elements and here is the complete structure it knows :

	.swipext
		.swipe
			.swipe-wrap
				.swipe-slide
					img (this is the only element selected by tag)
					.swipe-slide-caption
		.swipe-prev
		.swipe-next
		.swipe-pages
			.swipe-page
		.swipe-caption

This means **you're free to use HTML tags you want for all elements** since Swipext doesn't look at
them.

### Javascript setup

To run Swipext, you need to include **jQuery** and **Swipe**. I used to include JS dependencies at
the bottom of the page (and you sould used to ;-) except specifics needs) :

``` html
		...

		<script src="jquery.js"></script>
		<script src="swipe.js"></script>
		<script src="swipext.js"></script>
		<script type="text-javascript">

			jQuery(document).ready(function($) {

			 	$('.swipext').swipext();
			});

		</script>
	</body>
</html>
```

### Options

Swipext supports all Swipe originals options. [See Swipe options][2].

Options added by Swipext are the followings (_name, type, default value_) :

 - **lazyLoad**, boolean, false : `true` to activate the images lazy loading,
 - **lazyLoadRange**, integer, 1 : number of images loaded around the current slide,
 - **defaultImg**, string, 'data:...' : replacement image used for the lazy loading (base 64 encoded
 data or filename),
 - **hideClass**, string, 'hide' : CSS class used to hide navigation controls when the slider isn't
 in continuous mode and display the first or last slide,
 - **activeClass**, string, 'active' : CSS class used to mark the `.swipe-page` of current slide.

**Warning :** when **lazyLoad** is **true**, **startSlide** is forced to **0**.

#### Apply to a set of sliders

You can set options with the jQuery selector :

``` javascript
jQuery(document).ready(function($) {

	$('.swipext').swipext({
	
		lazyLoad:		false,		// Lazy loading feature
		lazyLoadRange:	1,			// Lazy loading range (= number of images loaded)
		auto:			false,		// Auto switching, milliseconds
		continuous:		false,		// Return to start after last slide
		startSlide:		0,			// Starting slide index
		hideClass:		'hide',		// CSS class for hidden navigation controls
		activeClass:	'active'	// CSS class for active pagination control
	});
});
```

#### Per slider options

Swipext lets you setup some options per slider by `data-*` attributes :

``` html
<div class="swipext"
	data-lazyload="true"
	data-lazyloadrange="2"
	data-continuous="true"
	data-auto="5000"
	data-speed="300"
	data-startslide="3"
	data-hideclasse="hide"
	data-activeclasse="active"
	data-defaultimg="default.jpg">
	<div class="swipe">...</div>
</div>
```

## Lazy loading : how to ?
### Set up HTML structure

Setting up an image slider with lazy loading is pretty simple. Look at the following HTML code :

``` html
<div class="swipext" data-lazyload="true" data-continuous="true" data-auto="0" data-speed="300">
	<div class="swipe">
		<div class="swipe-wrap">

			<figure class="swipe-slide">
				<img src="img/image_01.jpg" data-src="img/image_01.jpg" alt="image_01" />
				<figcaption class="swipe-slide-caption">image 01</figcaption>
			</figure>

			<figure class="swipe-slide">
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
					data-src="img/image_02.jpg" alt="image_02" />
				<figcaption class="swipe-slide-caption">image 02</figcaption>
			</figure>

			<figure class="swipe-slide">
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
					data-src="img/image_03.jpg" alt="image_03" />
				<figcaption class="swipe-slide-caption">image 03</figcaption>
			</figure>

			<figure class="swipe-slide">
				<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
					data-src="img/image_04.jpg" alt="image_04" />
				<figcaption class="swipe-slide-caption">image 04</figcaption>
			</figure>
		</div>
	</div>
	<div class="swipe-nav">
		<button class="swipe-prev">Prev.</button>
		<button class="swipe-next">Next</button>
	</div>
	<div class="swipe-pages"></div>
	<div class="swipe-caption"></div>
</div>
```

 - Each slide is a **figure**,
 - Each containing **img** must have two attributes : `src` and `data-src`,
 - `data-src` must contain the URI of the image,
 - The `src` of the **first** slide image contain the URI,
 - All the other images `src` attributes must contain a blank image. The value
 `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7` is the base 64
 representation of the 1x1 px transparent gif.
 - Swipext hides automatically all **.swipe-slide-caption** and replaces the **.swipe-caption**
 with the caption of the current slide : it's a lot easier for CSS templating ;-)

**Why this strange base 64 blank gif ?**

In order to unload an image from the web browser to free memory, remove the `src` attribute is not
enough. You must overwrite the image and replace it with a transparent gif works pretty well :-).

**Trick** : according your graphical theme, you may prefer use a black gif. In that event, the base
64 encoded value is `data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=`.

### Lazy load range

This parameter let you choose the number of images which are loaded around the current slide.

Here is the running sequence for a non continuous slider with a range of 1 :

	x = loaded image
	X = current slide
	- = unloaded image

	HTML : X - - - -	(it's the code above)
	INIT : X x - - -	(after Swipext initialization)
	NEXT : x X x - -	(after push next button)
	NEXT : - x X x -
	NEXT : - - x X x
	NEXT : - - - x X

Now, here is the running sequence for a continuous slider, always with a range of 1 :

	HTML : X - - - -
	INIT : X x - - x	(the last slide is loaded since you could go at previous slide)
	NEXT : x X x - -	
	NEXT : - x X x -
	NEXT : - - x X x
	NEXT : x - - x X
	NEXT : X x - - x

Training : write the running sequence with a range of 2 :-D (or more).

## Compatibility

Swipext has the same compatibility than [Swipe][1].

I developped Swipext with jQuery 1.10.1 but older version should be compatible (not tested).

## Who's using Swipext ?

For now, nobody ;-). If Swipext suits to your needs and you use it for your web site, I would be
glad to know and to publish your link here.

  [1]: http://swipejs.com
  [2]: https://github.com/bradbirdsall/Swipe#config-options