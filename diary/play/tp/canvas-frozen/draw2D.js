
( function () {




	//	//\\//			Plugin. Convenience functions for 3D-draw on canvas.
	//					Takes graphic context at initialization step.
	var pluginName		= 'draw2D';
	var topNameSpace	= 'tp$';
	var topApp			= window[ topNameSpace ];	
	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.


	if( !topApp ) { alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }






	///	Builds plugin
	topApp[ pluginName ] = ( function ()
	{
		var self = {}; // Plugin itself

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

		return self;

	}) (); ///	Builds plugin

}) ();

