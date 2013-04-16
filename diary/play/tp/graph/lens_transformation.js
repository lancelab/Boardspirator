

( function () {


	//	//\\//			Plugin. Projects 3D-stage to flat screen.
	//					Available projections: PERSPECTIVE and ISOMETRY.
	var pluginName		= 'lensTransformation';
	var topNameSpace	= 'tp$';
	var parentName		= 'graph';
	var topApp			= window[ topNameSpace ];	

	//					This plugin has no dependencies.
	//					No canvasses and graphic context are required to setup this plugin:
	//					this plugin operates purely with coordinates.

	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.



	//.	topApplication does not have to be already defined, but may be
	var topApplication	= window[ topNameSpace ] = window[ topNameSpace ] || {};
	if( !topApp.checkDependency( pluginName, [ parentName ] ) ) return;
	var parent = topApp[ parentName ];



	parent[ pluginName ] = ( function ()
	{

		//. Plugin contents
		var self			= {}; 

		//:	Available 3D-types
		var flgPERSPECTIVE	= self.flgPERSPECTIVE=0;
		var flgISOMETRY		= self.flgISOMETRY=1;

		// TODm in the future:
		// self.flgAXONOMETRY = 2;
		// self.flgPSEUDOLINEAR = 3;
		

		//:	3D Scene Settings
		var flg				= self.flg = flgPERSPECTIVE;
		var center			= self.center = [100,100];	// Center in screen.
		var scale			= self.scale = 100;			// Rescales x and z dimensions.
		var distance		= self.distance = 100;		// Distance to 3D-origin along axis y. Needed only for PERSPECTIVE.
	
		//:	Auxilairy
		var reverseDistance	= 1/distance;
		var SQRT3 = Math.sqrt(3.0);


		///	(Re)Initialization function.
		//	Input:	"settings" and its properties are optional.
		self.reset = function( settings )
		{
			if( !settings ) return;
			var s = settings;
			if( s.center )
			{ 
				center[0]=s.center[0];
				center[1]=s.center[1];
			}
			if(typeof s.scale		=== 'number' ) scale	=self.scale		=s.scale;
			if(typeof s.flg			=== 'number' ) flg		=self.flg		=s.flg;
			if(typeof s.distance	=== 'number' )
			{
				//. Silently protects distance from being zero
				distance		= self.distance	= s.distance || 1; 
				reverseDistance	= 1/distance;
			}
			return self;
		};



		/// Does project 3D coordinates to screen.
		self.doproject = function( x, y, z )
		{
			var point = [];		
			switch( flg )
			{
				case flgPERSPECTIVE:
				 	var dst = Math.abs( y + distance );
					//c onsole.log(dst,x, x/dst);
			    	point[0] = center[0] + scale * x / dst;
			    	point[1] = center[1] - scale * z / dst;
			    	break;
				case flgISOMETRY:
			    	point[0] = center[ 0 ] + scale * SQRT3 * ( x - y );
			    	point[1] = center[ 1 ] - scale * ( x + y + 2 * z );
			    break;
			}
			//c onsole.log("LensT: point="+point[0]+","+point[1]);
	        return point;
		};

		///	Convenience function.
		//	Does project 3D coordinates to screen.
		self.doprojectPoint = function( point ) {
			return self.doproject( point[0], point[1], point[2]);
		};


		//	Does:		project size at given y. (including scale)
		//	Input:		if y is omitted, 0 is assumed.
		//	TODm:		do accurate distirtion along each axis x,y,z 
		//	Returns:	if point y is behind an observer, negative value is returned
		self.doprojectSize = function( size, y )
		{
			if( flgPERSPECTIVE !== flg ) return scale*size;
			if( y )
			{
				var dist = distance + y;
				//. Silent "to non-zero" fix
				if( !dist ) dist = -1;
				return scale * size / dist;
			}else{
				return scale * size * reverseDistance;
			}
		};

		return self;

	}) (); // Defines plugin

}) ();
