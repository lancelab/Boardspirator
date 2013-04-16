
( function () {




	//	//\\//			Plugin. Convenience functions for 3D-draw on canvas.
	//					Takes graphic context at initialization step.
	var pluginName		= 'funny_graphics_3D';
	var topNameSpace	= 'tp$';
	var topApp			= window[ topNameSpace ];	
	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.


	if( !topApp )				{ alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }
	if( !topApp.checkDependency	( pluginName, [ 'draw3D',  'vector23D' ] )  ) return;







	/// Builds:		plugin body singleton
	//	Does not:	need canvas environment to instantiate.
	//	Input:		no canvas environment is required.
	topApp[ pluginName ] = ( function ( itemsMax )
	{

		var self			= {}; //Plugin itself
		var draw2DName		='draw3D';
		var vector23DName	='vector23D';

		self.generateRandomCollectionOfBalls = function( itemsMax,bodyRadiusMax,boxMax )
		{
			var items=[];

			for(var i=0; i<itemsMax; i++){
				var center;
				var radius;				
				center=[	0.0*boxMax, 
								0.5*boxMax*(i+1)/itemsMax,
								1.2*boxMax*(i+1)/itemsMax
				];
				radius=0.5*bodyRadiusMax*(i+1)/itemsMax;

				center=[	(Math.random()-0.5)*boxMax, 
								(Math.random()-0.5)*boxMax,
								(Math.random()-0.25)*boxMax
				];
				radius=Math.random()*bodyRadiusMax;


				items[i]={	center : center,
							radius : radius,
							colorDark : '#'+(4+(i%5))+'000'+(5-(i%5))+'0',
							colorLight : '#FFFFFF'
				};
			};
			return items;
		};

		// Clone collection of balls
		self.cloneCollection = function ( col )
		{
			var t=[];
			for(var i=0, len=col.length; i<len; i++){
				var c=col[i];
				t[i]={	center : [c.center[0],c.center[1],c.center[2]],
					radius : c.radius,
					colorDark : c.colorDark,
					colorLight : c.colorLight
				};
			}
			return t;
		};


		// Input:	col - original collection of balls.
		// Result of rotation is contained in clonedCollection
		self.rotateCollection = function ( col, clonedCollection, cs, sn )
		{
			for(var i=0, len=col.length; i<len; i++){
				var cl=col[i];
				var rc=clonedCollection[i];
				rc.center=tp$.vector23D.rotateXY(cs,sn,cl.center);
				rc.radius = cl.radius;
				rc.colorDark = cl.colorDark;
				rc.colorLight = cl.colorLight;
				//c onsole.log(clonedCollection[i]);
			}
		};


		self.drawCollectionOfBalls = function (
				items, clonedCollection, frameNumber, framesInCircle,
				scrWidth, scrHeight, backgroundImageData
		){
			var angle=2*Math.PI*counter/framesInCircle;
			var cs=Math.cos(angle);
			var sn=Math.sin(angle);
			self.rotateCollection(items,clonedCollection,cs,sn);
			//ctx.clearRect(0,0,scrWidth,scrHeight);
			//origin, axisLength, colors:
			tp$.draw3D.draw3DAxes([0,0,0],  200, ['#0000FF','#00FF00','#FF0000']);
			tp$.draw3D.drawCollection(
				clonedCollection,scrWidth,scrHeight,backgroundImageData
			);
		};


		return self;

	}) (); //Builds plugin body singleton

}) ();

