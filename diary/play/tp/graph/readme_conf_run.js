

( function () {





	//	//\\//	Tiny canvas framework with demo.
	//			Demo: dumb animation for rotating bubbles collection.
	//
	//			Version 0.0.10. April 15, 2013.
	//			JS entry module.
				var pluginName		= 'graph';
				var topNameSpace	= 'tp$';
				var topApp			= window[ topNameSpace ];	
	// 			Copyright (c) 2013 Konstantin Kirillov. License MIT.


	//			Diary:
	//					0.0.8.mozilla "requestAnimationFrame"
	//					0.0.7 setTimeout animation





	//:	Checks dependency
	if( !topApp ) { alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }








	///	Builds plugin
	topApp[ pluginName ] = ( function ()
	{
		var self = { screen : {} }; // Plugin itself

		var canvas_wrap			= null;
		var canvas				= null;
		var counter				= 0;	//	counts animation phase till the browser's death. Independent from window resizes.
	   	var master_context		= null; //canvas.getContext('2d');  
		var reset_counter_deb	= 0;
		var scrHeight			= -1;	//	resize flag
	    var	scrWidth			= -1;	//	resize flag

		var reset_delay_flag		= null; // to clear scheduled draw when for redundant resize events
		var animation_scheduled;			// state of animation
		var stop_animation_chain;			// puts state to "false" at first opportunity
		//self.animation_is_allowed			// skips drawing while keepeing the chain
		
		var scrCenterX;
		var scrCenterY;
		var items;
		var clonedCollection;
		var salt;
		var backgroundImageData;



		/// Default settings.
		//	Resettable at self.init.
		var conf		= self.conf =
		{
			itemsMax				: 100,	// 2
			framesInCircle			: 500,	// 200
			animationInterval		: 20,
			boxMax					: 500,	// 300
			bodyRadiusMax			: 20,	// 100
			distance				: 200,
			scale					: 100,
			screen_center_x			: null,
			screen_center_y			: null,
			animation_is_allowed	: true,
			use_setTimeout			: false	// Ignore modern frame requestors.
		};




		/// Initializes animation parameters and fires infinite animation loop
		//	Looks for element with id = 'canvas' and tests browser.
		//
		self.init = function ( conf_ )
		{


			canvas_wrap = document.getElementById( 'canvas_wrap' );
			if( !canvas_wrap ) return;

			///	Inits 2D environment or abandons it
			canvas = document.getElementById( 'canvas' );
			master_context = canvas && canvas.getContext && canvas.getContext( '2d' );
			if( !master_context )
			{
				//:	We have canvas-unaware browser.
				//	Removes canvas from page.
				canvas_wrap.style.display='none';	
				return;
			}
			self.enabled = true;

			//: Overrides settings if any
			for( var ss in conf_ )
			{
				if( conf_.hasOwnProperty( ss ) )
				{
					conf[ ss ] = conf_[ ss ];
				}
			}

			///	Fallback to "setTimeout-animation-frame"
			window.requestAnimationFrame =
				window.requestAnimationFrame		||
		        window.webkitRequestAnimationFrame	||
		        window.mozRequestAnimationFrame		||
		        window.oRequestAnimationFrame		||
		        window.msRequestAnimationFrame		||
				timeoutAnimationFrame;


			self.animation_is_allowed = conf.animation_is_allowed;
			stop_animation_chain = !self.animation_is_allowed;


			//: Resets animation up
			var reset_delay_flag = setTimeout( self.reset_animation, 50 );



			//.	Enables animation resetting at window.onresize
			//	Does this AFTER initial animation fire-up.
			tp$.bindEvent( 'resize',  window, resizeHandler );


			//http://stackoverflow.com/questions/9594981/cannot-listen-document-resize-event
			//http://stackoverflow.com/questions/14137629/did-i-miss-something-html-body-resize-event
			tp$.bindEvent( 'resize',  document.body, resizeHandler );

			//: This code segment is dedicated to tracing document vertical size.
			//	It is abandoned bs ? too many events fired.
			//		depricated ? https://developer.mozilla.org/en-US/docs/DOM/MutationObserver?redirectlocale=en-US&redirectslug=DOM%2FDOM_Mutation_Observers
			//		deprication hell ? http://stackoverflow.com/questions/6659662/why-is-the-domsubtreemodified-event-deprecated-in-dom-level-3
			//		http://www.jqui.net/jquery-projects/jquery-mutate-official/
			//		blamed? http://stackoverflow.com/questions/11694795/jquery-is-domsubtreemodified-the-best-way-to-handle-dynamically-added-element
			//		throttle: http://stackoverflow.com/questions/11867331/how-to-identify-that-last-domsubtreemodified-is-fired
			//			$(document).bind( 'DOMSubtreeModified', resizeHandler );
			//			document.body.onresize = resizeHandler;



		}; /// self.init
		/// Initializes animation parameters and fires infinite animation loop



		///	Shortcut
		var timeoutAnimationFrame = function( callback,  element )
		{
            window.setTimeout( callback, conf.animationInterval );
		};


		///	Shortcut
		var select_animator = function ( draw_and_reschedule )
		{
				animation_scheduled = true;

				if( conf.use_setTimeout )
				{
					timeoutAnimationFrame( draw_and_reschedule );				
				}else{
					requestAnimationFrame( draw_and_reschedule );
				}
		};




		/// Handles destructive events like "window.onresize"
		var resizeHandler = function ()
		{
				if( reset_delay_flag !== null )
				{
					//	solution used credit: http://mbccs.blogspot.com/2007/11/fixing-window-resize-event-in-ie.html
					//	which is found here: http://stackoverflow.com/questions/641857/javascript-window-resize-event
					//	another help: http://stackoverflow.com/questions/5489946/jquery-how-to-wait-for-the-end-or-resize-event-and-only-then-perform-an-ac
					//.	Good timing debug which prooves that "reset_delay_flag method" works well:	
					//  tp$.d eb( "Discarding ''reset_animation number " + reset_counter + "'' because of continue resetting. " );
					window.clearTimeout( reset_delay_flag );
				}
				reset_delay_flag = setTimeout( self.reset_animation, 10 );
		};




		///	Triggers frozen animation without resetting it.
		self.do_trigger_animation = function ( dodo )
		{
				if( dodo )
				{
					stop_animation_chain = false;

					if( !animation_scheduled )
					{
						select_animator( draw_and_reschedule );
					}
					if( canvas_wrap ) canvas_wrap.style.display = "block";
					
				}else{

					if( canvas_wrap ) canvas_wrap.style.display = "none";
					stop_animation_chain = true;

				}

		};




		/// Puts population on screen and schedules next "put".
		var draw_and_reschedule = function ()
		{
				animation_scheduled = false;

				if( stop_animation_chain ) return;

				if( self.animation_is_allowed )
				{
					self.funny_graphics_3D.drawCollectionOfBalls (
						items,
						clonedCollection,
						counter,
						conf.framesInCircle,
						scrWidth,
						scrHeight,
						backgroundImageData,
						counter
					);
					counter++;
				}
				//:	No better for both
				//master_context.putImageData( offscreenCanvas.context.getImageData( 0, 0, scrWidth, scrHeight ), 0, 0 );
				//master_context.drawImage( offscreenCanvas.canvas, 0, 0 );

				select_animator( draw_and_reschedule );

		};







		///	Regenerates population of "sprites".
		/// Used when window resizes at self.init.
		//	Double checks if dimensions really changed keeping in mind
		//	usage in other hooks.
		//
		self.reset_animation = function ()
		{

			if( !canvas || !canvas_wrap ) return;

			var wwe = document.documentElement;
			var wwb = document.body;

			// Alternative
			//self.screen.detect();
			//var ww_w = screen.width;
			//var ww_h = screen.height;

			//: jQuery versions of dimensions detection
			var $ = jQuery;
			var $d = $(document);
			var $w = $(window);
			var ww_w = $w.width();
			var ww_h = $w.height(); // Math.max( $d.height(), $w.height() );

			if( ww_w === scrWidth && ww_h === scrHeight ) return;

			scrWidth = ww_w;
			scrHeight = ww_h;


			reset_delay_flag = null;
			reset_counter_deb += 1;

			scrCenterX	= conf.screen_center_x !== null ?
					conf.screen_center_x :
					//.	Sugar
					Math.floor(scrWidth/2);
			
			scrCenterY	= conf.screen_center_y !== null ?
					conf.screen_center_y :
					//.	Sugar
					Math.floor(scrHeight/2);

			//var lensFlag = self.lensTransformation.flgISOMETRY;		
			var lensFlag = self.lensTransformation.flgPERSPECTIVE;		

			//: Spawns conf
			canvas_wrap.style.width		= scrWidth + 'px';
			//canvas_wrap.style.height	= scrHeight + 'px';
	    	canvas.height				= scrHeight;
	    	canvas.width				= scrWidth;

			//: Inits workers:
			var lens = self.lensTransformation.reset({ 
				flg			: lensFlag,
				center		: [ scrCenterX, scrCenterY ],
				distance	: conf.distance,
				scale		: conf.scale
			});

			// var offscreenCanvas = self.draw2D.generateCanvas( scrWidth, scrHeight );
			// self.draw3D.reset( offscreenCanvas.context );
			self.draw3D.reset( master_context );

			///	Regenerates population of "sprites"
			items				= self.funny_graphics_3D.generateRandomCollectionOfBalls( conf.itemsMax, conf.bodyRadiusMax, conf.boxMax );
			clonedCollection	= self.funny_graphics_3D.cloneCollection( items );
			salt				= self.funny_graphics_2D.createRandomDisks( 1000, scrWidth, scrHeight );
			backgroundImageData	= salt.getImageData( 0, 0, scrWidth, scrHeight );

			self.do_trigger_animation( !stop_animation_chain );

		};


		/// Helper
		//	Not helpful for browser's width.
		self.screen.detect = function ()
		{
			screen.width = window.innerWidth; // || body.clientWidth;
			screen.height = window.innerHeight; // || body.clientHeight;
		};


		return self;

	}) (); ///	Builds plugin

}) ();


