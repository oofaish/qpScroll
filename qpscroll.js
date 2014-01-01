/**********************************************************
** by @oofaish   
**    http://cigari.co.uk/qpscroll
***********************************************************/

;(function ( $, window, document, undefined ) {

    /**********************************************************
    ** helpers
    **
    ** basically where all the function are defined
        ***********************************************************/
    var helpers = { 
    		
    		/**********************************************************
             ** scrollToNewPosition
             ***********************************************************/
            scrollToNewPosition: function( $that, yPos, options ) {
                //var yPos = -$this.scrollTop();
                var scrollDataStringArray = $that.data('qpscroll').split( "," );
                var scrollDataArray = [];
                $.each( scrollDataStringArray, function( index, positionString ){
                   scrollDataArray[ index ] = parseInt( positionString );
                });
                
                var coords = '';
                var speed = options.firstSpeed;
                
                $.each( scrollDataArray , function( index, position ){
                    
                    speed = options.firstSpeed / Math.pow( options.neighbourRatio, ( numberOfImages - index ) );;
                    var yPos2 = ( yPos / speed );
                    if( coords.length > 0 )
                        coords += ', ';
                    coords += 'right ' + ( yPos2 + position ) + 'px'; 
                } );

                // Move the background
                $that.css({ backgroundPosition: coords });
            }, 

    		/**********************************************************
             ** setupBackgroundAfterImageLoad
             ***********************************************************/
    		setupBackgroundAfterImageLoad: function( scrollElement, div, imageLinks, imageWidths, imageHeights, options )
    		{
                var myWidth = scrollElement.innerWidth();
                var index2;
                var yPosTillNow = 0;
                var totalHeight = 0;
                var backgroundImage = '';
                var backgroundSize = '';
                var backgroundPosition = '';
                var scrollData = '';

                for( index2 = imageLinks.length - 1; index2 >= 0; index2 -- )
                {
                    var imageLink = imageLinks[ index2 ];
                    var width = imageWidths[ index2 ];
                    var height = imageHeights[ index2 ];
                    var expectedHeight = Math.ceil( height * myWidth / width ) - offset;
                    totalHeight += expectedHeight;
                }
                
                yPosTillNow = totalHeight; 
                
                for( index2 = imageLinks.length - 1; index2 >= 0; index2 -- )
                {
                    var imageLink = imageLinks[ index2 ];
                    var width = imageWidths[ index2 ];
                    var height = imageHeights[ index2 ];
                    
                    var expectedHeight = Math.ceil( height * myWidth / width ) - offset;
                    if( backgroundImage.length > 0 )
                    {
                        backgroundImage += ', ';
                        backgroundPosition += ', ';
                        backgroundSize += ', ';
                        scrollData += ',';
                    }
                    
                    backgroundImage += 'url(' + imageLink + ')';
                    backgroundSize += myWidth + 'px auto'
                    yPosTillNow -= expectedHeight;
                    //heightTillNow += expectedHeight;
                    backgroundPosition += 'left ' + yPosTillNow + 'px';
                    scrollData += yPosTillNow;
                    //totalHeight = heightTillNow;
                };
                
                var ss = {
                    backgroundImage: backgroundImage,
                    backgroundPosition: backgroundPosition,
                    backgroundSize: backgroundSize, 
                    height: totalHeight + 'px',
                };

                div.css( ss );
                div.data( 'qpscroll', scrollData );
                helpers.scrollToNewPosition( div, - scrollElement.scrollTop(), options );
    		},
    		
            /**********************************************************
            ** init
            ** The main function - actually resets everything each time
            ** you call it
            ***********************************************************/
            init: function( element, options ) {
            	$(window).resize(function() {
            	    if(this.resizeTO) clearTimeout(this.resizeTO);
            	    this.resizeTO = setTimeout(function() {
            	        $(this).trigger('resizeEnd');
            	    }, 250);
            	});
            	
            	
                if( element[ 0 ] == $( 'body' )[ 0 ] )
                {
                    scrollElement = $( window );
                }
                else
                {
                    scrollElement = element;
                };
                
                if( options.offset == 0 )
                    offset = 1
                else
                    offset = options.offset;
                
                //remove any qpScroll sections
                element.find('.qpScroll').remove();
                //add the qpScroll section again 
                element.prepend( '<div class="qpScroll"></div>');
                div = element.find( '.qpScroll' );
                styles = {
                    position: "fixed",
                    left: "0px",
                    top: "0px",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    zIndex: options.zIndex,
                    overflow: "visible",  
                };
                
                div.css( styles );
                
                numberOfImages = options.imagesArray.length;
                imageCounter = 0;
                                
                var folder = options.imagesFolder;
                
                if( folder[ folder.length - 1] != '/' )
                    folder += '/';
                
                var imageWidths     = [];
                var imageHeights    = [];
                var imageLinks      = [];
                
                //go through images, and create a bunch of strings for
                $.each( options.imagesArray, function( index, image ){
                    var fullURL = folder + image;
                    
                    imageLinks[ index ] = fullURL;
                    
                    var img = new Image();
                    img.onload = function()
                    {
                        imageCounter += 1;
                        
                        var width  = this.width;
                        var height = this.height;
                        
                        imageWidths[  index ] = width;
                        imageHeights[ index ] = height;
                        
                        if( imageCounter == numberOfImages )
                        {	
                        	helpers.setupBackgroundAfterImageLoad( scrollElement, div, imageLinks, imageWidths, imageHeights, options );
                        };
                    };
                  
                    img.src = fullURL;                  
                } );
                
                $(window).bind('resizeEnd', function() {
                	helpers.setupBackgroundAfterImageLoad( scrollElement, div, imageLinks, imageWidths, imageHeights, options );
                });
                                
                div.each(function(){
                    var $that = $(this); // assigning the object

                    scrollElement.scroll( function()
            		{
                    	helpers.scrollToNewPosition( $that, -$( this ).scrollTop(), options );
            		});                    		
                });    
        }
    };
    
    /**********************************************************
     ** Plugin
     ** definition of the plugin function
     ***********************************************************/
    function Plugin( element, userOptions ) {
        var options = $.extend( {}, $.fn.qpScroll.defaults, userOptions );
        
        helpers.init( element, options );
    }
    
    /**********************************************************
     ** Actual attachment to jQuery
     ***********************************************************/    
    $.fn['qpScroll'] = function ( options ) {
        return this.each(function () {
                Plugin( $( this ), options );
        } );
    };
    
    /**********************************************************
    ** Defaults
    ***********************************************************/
    
    $.fn.qpScroll.defaults = {
                   imagesFolder: 'images/parallax',
                   imagesArray: [],
                   firstSpeed: 10,/*how much slower should the scroll be - 10 means 10 times slowe*/
                   neighbourRatio: 1,/*how much faster should the next image go compared to the one before*/
                   offset: 0,/*how much should each image cover the other image (in pixels)*/
                   zIndex: -1000,/*if for some reason you need to move around the background to be ahead or behind something*/
        };

})( jQuery, window, document );