
( function () {



	//	//\\//			Plugin. Convenience functions for 2D-draw.
	//					No need for graphic context at initialization step.
	var pluginName		= 'funny_graphics_2D';
	var topNameSpace	= 'tp$';
	var topApp			= window[ topNameSpace ];	
	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.


	if( !topApp )				{ alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }
	if( !topApp.checkDependency	( pluginName, [ 'lensTransformation',  'draw2D' ] )  ) return;






	///	Builds plugin body singleton
	topApp[ pluginName ] = ( function ()
	{
		var self	= {}; //Plugin itself
		var draw2D	= topApp.draw2D;


		// Spread randomly ballsNumber random-radius and random color disks
		// over imageData.
		// Input:	width,height - dimensions of imageData,
		//			radiusMax - radius limit.
		//			imageData - opt. If present, pixels put there.
		var prepareRandomDisks = function( ballsNumber, width, height, radiusMax, imageData )
		{

				var setPixel=draw2D.setPixel;
				var pixs = [];
				for(var i=0; i<ballsNumber; i++){
					var radius	=Math.random()*radiusMax;
					var x	= Math.floor(Math.random()*width);
					var y	= Math.floor(Math.random()*height);
					var r	= Math.floor(254*Math.random());
					var g	= Math.floor(254*Math.random());
					var b	= Math.floor(254*Math.random());
					var a	= Math.floor(254*Math.random())

					if( imageData ) setPixel( imageData, x, y, r, g, b, a );

					pixs[i]=[x, y, r, g, b, a, radius];
					//c onsole.log(pixs[i]);
				}
				return pixs;
		};


	

		///	Creates canvas-element and draws random disks on it
		//	Credit: http://beej.us/blog/2010/02/html5s-canvas-part-ii-pixel-manipulation/
		self.createRandomDisks=function(grainsNumber,width,height){

			var radiusMax=3;

			var subCanvas=document.createElement('canvas');
			subCanvas.width=width;
			subCanvas.height=height;
			var sctx=subCanvas.getContext('2d');

			sctx.fillStyle='#000000';
			sctx.fillRect(0,0,width,height);  

			//good:			var imageData = sctx.createImageData(width,height); 
			//need better:
			var imageData = sctx.getImageData(0,0,width,height); 

			var pixels=prepareRandomDisks(grainsNumber,width,height,radiusMax,imageData);

			//sctx.putImageData(imageData, 0,0)

			//Draw big balls:
			for(var i=0; i<grainsNumber; i++){
				var pl=pixels[i];
				var radius = pl[6];
				if(radius > 1){	
					sctx.beginPath();
					sctx.arc(pl[0],pl[1], radius, 0, Math.PI*2, true);
					var ww = 'rgba('+pl[2]+','+pl[3]+','+pl[4]+','+pl[5]+')';
					//c onsole.log(w);
					sctx.fillStyle = ww;
					sctx.fill();
				}
			}
			return sctx;
		};




		return self;

	}) (); //Builds plugin body singleton
}) ();

