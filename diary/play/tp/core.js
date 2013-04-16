
( function( $ ) {


	///////////////////////////////////////////////////////////////////////////
	var Description={
		title			:'tp',
		description		:'Tool Package - jQuery.fn.tp$ plugin',
		version			:'0.0.97',
		date			:'March 31, 2013',
		license			:'Dual licensed under the MIT or GPL Version 2 licenses.',
		copyright		:'(c) 2011-2013 Konstantin Kirillov',
		web_site		:'http://landkey.net/gio/gio/diary/b1/tp/readme.htm',
		contact			:'e m a i l:  b e a v e r s c r i p t   a t   l a n d k e y . n e t'
	};
	///////////////////////////////////////////////////////////////////////////


	// //\\// tp$.core	subplugin for generic methods

	//. Shortcuts debug function.
	var deb = window.tp$ && window.tp$.deb;


	/// Attaches tp$ to jQuery.
	//	tp$ is a plugin which in turn is a wrapper to "subplugin" tp$.beautify_el{}
	//	which in turn is an object which properties are subsubplugins,
	//	and also, 
	//	tp$ is a top object to attach different applications, and bodies of subplugins.
	//	( like tp$.gio, for example is a Boardspirator ).
	//	
	//	beautify_el is defined in beautify.js, and at this version, only for one real subplugin 'select'
	//	which body is tp$.form.
	//
	//	Returns:	NOT A jQuery object, but specific object for each subplugin.
	//
	//				
	//	This:		When jQuery provides "this" to plugin, ONLY
	//				this[0] is used. "NO BATCH PROCESSING".
	//				Because, of plugin completely replaces DOM-element, so
	//				original array, "this" "is useless".
	//				
	//	Input:		choice is a name of subplugin, like choice = "select'.
	//
	//	Usage example:	var beautified=$('#select_id').tp$('select');
	//					Here, subsubplugin 'select' is invoked.
	//					"beautified" is a specific object returned by method
	//					form.create_select_el(), so real final DOM element is
	//					
	//					var dom_el = beautified ['wrapper']
	//
	$.fn.tp$ = ( function( choice, arg ) {

					var that= this && this[0];
					if( !that ) return;
					return $.fn.tp$.beautify_el[ choice ].call( that, arg );
	});



	//add Description:
	$.fn.tp$.description=Description;	


	//Attaches top part of tp$.core subplugin
	$.fn.tp$.core=(function(){

		//.	"Inherits" all properties of global-scope tp$.
		var self = { tp : tp$ };
		// c onsole.log( tp$ );

		//Emulate "sticky-to-screen-vertical-position-for-popup" dom_el:
		//Credit: http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
		self.do_center_vertically_in_screen=function(dom_el){
			var window_top=$(window).scrollTop();
			var el_top_gap=($(window).height()-$(dom_el).outerHeight())/2;
			$(dom_el).css('top',el_top_gap+window_top);
		};




		///	Downloads:	object via ajax.
		//				Possibly redundant.
		// Input:		all except url is optional.
		//				do_paste 		-	forces delivered data content to be pasted into
		//				obj[property]. 	-	If !do_paste, obj[property] = data.
		//				async			-	default if sync.
		self.download_object = function( url, obj, property, do_paste, async, timeout, do_debug, text_or_jsonp, callback ) {

			var obj_supplied		= !!obj;
			obj						= obj || {};
			property				= property || 'result';
			obj[ property ]			= obj[ property ] || null;
			var ajax_call = {
				url			: url,
				async		: !!async,
				cache		: false,
				dataType	: text_or_jsonp === 'cors' ?  'json' : ( text_or_jsonp || 'json' ),
				timeout		: timeout || 2000,
				success		: function( data, textStatus ) {

					if( text_or_jsonp === 'text' ) { data = JSON.parse( data ); }
					if( text_or_jsonp === 'jsonp' || textStatus === 'success' ) {
						if( do_paste ) {
							self.paste_non_arrays( obj[ property ], data );
						}else{
							obj[ property ] = data;
						}
						// if( deb ) { deb( property); deb(data); }
					}

					if( callback ) callback();
				}

			};

			if( text_or_jsonp === 'jsonp' ) crossDomain = true;
			if( text_or_jsonp === 'cors' )
			{
				ajax_call.crossDomain = true;
				ajax_call.xhrFields = { withCredentials	: true };
				//ajax_call.headers = { "X-CSRF-Token" 	: "boo" }
			}

			// c ccc( 'tpcore: directive=' + text_or_jsonp + ' ajax_call=', ajax_call  );

			//	//\\	Missed doc for this. 
			//					$.ajax( ajax_call ).fail( function( explanation ) { ...
			//			Guessing this: error(jqXHR, textStatus, errorThrown)
			//			From this: http://api.jquery.com/jQuery.ajax/
			//	\\//
			$.ajax( ajax_call ).fail( function( explanation ) {
				var ww ='Ajax failed to load object.';
			//	if( do_debug && deb ) {
if( true ) {
					deb( ww + ' url=' + url + "\n");
					deb( "Possible error status = " + arguments[1]);
					deb( "Possible error expanation = " + arguments[2]);
					// c onsole.log('arguments[0]=', arguments[0], "\n\n\narguments[1]=", arguments[1],
					// "\n\n\narguments[1]=", arguments[2]);
				}
			});

			return obj[ property ];
		};
		///	Downloads:	object via ajax.


		return self; //tp return

	})(); //tp end
	
	
})( jQuery );


