
( function () {




	//	//\\//			Plugin. Convenience functions for 2D-draw on canvas.
	//					Is not bound to any graphics-context.
	var pluginName		= 'draw2D';
	var topNameSpace	= 'tp$';
	var parentName		= 'graph';
	var topApp			= window[ topNameSpace ];	
	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.


	if( !topApp ) { alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }
	if( !topApp.checkDependency	( parentName, [ parentName ] )  ) return;
	var parent = topApp[ parentName ];





	///	Builds plugin
	parent[ pluginName ] = ( function ()
	{
		var self = { screen : {} }; // Plugin itself

		/// Sets pixel on imageData
		//	Credit: http://beej.us/blog/2010/02/html5s-canvas-part-ii-pixel-manipulation/
		self.setPixel = function( imageData, x, y, r, g, b, a)
		{
			//c onsole.log('args',arguments);
		    ix = ( x + y * imageData.width ) * 4;
	    	imageData.data[ ix + 0 ] = r;
	    	imageData.data[ ix + 1 ] = g;
	    	imageData.data[ ix + 2 ] = b;
	    	imageData.data[ ix + 3 ] = a;
		};



		///	Thin helper
		self.generateCanvas = function ( width, height )
		{
			var canvas		= document.createElement( 'canvas' );
			canvas.width	= width;
			canvas.height	= height;
			return			{ canvas : canvas, context : canvas.getContext( '2d' ) };
		};


		return self;

	}) (); ///	Builds plugin

}) ();

