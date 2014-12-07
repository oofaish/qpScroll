qpScroll
=============

qpScroll is a jQuery plugin that creates a parallax background for any page or div. You can see an example at http://www.cigari.co.uk/qpscroll.
It is super simple to setup. It can be added to any existing page without the need to change the mark up.

I have kept it super simple - the three major settings are:
	- how much faster/slower do images move compared to the scroll speed
	- how much faster/slower does each image scroll compared to one before it
	- how much does each image cover the one before it

How to kick it off?
===================
Make sure you have jQuery loaded - link the following file:

    <script type="text/javascript" src=“qpscroll.js"></script>

And then set a parallax background like so:

        $(document).ready(function(){
            $('body').qpScroll({
		imagesFolder: 'images/parallax’,//folder where the images are kept
                imagesArray: [ '1.jpg','2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg' ],
                firstSpeed: 5,//first image scrolls 5 times slower than the page.
                neighbourRatio: 1.1,//each image scrolls 1.1 times (or 10%) faster than the image before it
                offset: 0,//in pixels, how much should each image cover the one before it.
            });
	}); 

Testing
=======
I have only tested it on latest Chrome, Firefox and Safari.

Future Dev
=========
Let me know if there are any fun features you like to see in it. It currently does what I need it to do for one of my own projects.
Feel free to use it as it wish, but I would appreciate a plug to my website http://www.cigari.co.uk

Copyright (c) 2013 Ali Cigari @oofaish
