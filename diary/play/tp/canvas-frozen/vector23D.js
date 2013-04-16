
( function () {




	//	//\\//			Plugin. Convenience functions for 3D-draw on canvas.
	var pluginName		= 'vector23D';
	var topNameSpace	= 'tp$';
	var topApp			= window[ topNameSpace ];	
	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.


	if( !topApp )		{ alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }




	///	Builds plugin body singleton
	topApp[ pluginName ] = ( function ()
	{

		var self = {}; //Plugin itself

		///	Builds linear combination of two 2D or 3D vectors
		var combine = self.combine = function ( a, vectorA, b, vectorB )
		{
			var result = [	a * vectorA[0] + b * vectorB[0],
							a * vectorA[1] + b * vectorB[1]
			];
			if( vectorA.length > 2) result[2] = a * vectorA[2] + b * vectorB[2];
			return result;
		};

	
		///	Rotates vector in 2D plane or around vertical axis
		var rotateXY = self.rotateXY = function ( cs, sn, vector )
		{
			result = [	cs * vector[0] - sn * vector[1],
						sn * vector[0] + cs * vector[1]
			];
			if( vector.length > 2) result[2] = vector[2];
			return result;
		};

		return self;

	}) (); //Builds plugin body singleton

}) ();

