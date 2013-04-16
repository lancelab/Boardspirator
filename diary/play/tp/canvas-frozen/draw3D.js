
( function () {




	//	//\\//			Plugin. Convenience functions for 3D-draw on canvas.
	//					Takes graphic context at initialization step.
	var pluginName		= 'draw3D';
	var topNameSpace	= 'tp$';
	var topApp			= window[ topNameSpace ];	
	// 					Copyright (c) 2013 Konstantin Kirillov. License MIT.




	if( !topApp )				{ alert( "Missed " + topNameSpace + " when loading " + pluginName ); return; }
	if( !topApp.checkDependency	( pluginName, [ 'lensTransformation',  'vector23D' ] )  ) return;




	


	///	Builds plugin body singleton
	topApp[ pluginName ] = ( function ()
	{
		var self={}; //Plugin itself
		var lens=topApp['lensTransformation']; //Shortcut

		//Settings:
		var ctx; //graphicsContext
		var scrWidth;
		var scrHeight;
	
		self.reset=function(graphicsContext){
			ctx=graphicsContext;
			return self;
		}

		/// Projects 3D line to canvas
		var draw3DLine=self.draw3DLine=function(point3DA, point3DB, color){
			var pointA=lens.doprojectPoint(point3DA);
			var pointB=lens.doprojectPoint(point3DB);
			//c onsole.log(pointA,pointB,color);	
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(pointA[0], pointA[1]);
			ctx.lineTo(pointB[0], pointB[1])
			ctx.stroke();
		};

		///	Draws 3D ball on canvas
		var draw3DBall=self.draw3DBall=function(center, radius, colorDark, colorLight){

			var touchYPoint=center[1]-radius;
			var touchSize = lens.doprojectSize(radius,touchYPoint);
			if(touchSize<0) return; //behind observer
			var center2D=lens.doprojectPoint(center);
			var radius2D=lens.doprojectSize(radius,center[1]);
			if(radius2D===0)return;
			ctx.fillStyle= colorDark;
			ctx.beginPath();
			//c onsole.log(center2D,radius2D);
			ctx.arc(center2D[0],center2D[1], radius2D, 0, Math.PI*2, true);
			ctx.fill();
		};



		///	Draws 3D ball with gradients
		var draw3DBallGradient = self.draw3DBallGradient = function( center, radius, colorDark, colorLight )
		{
			var touchYPoint=center[1]-radius;
			var touchSize = lens.doprojectSize(radius,touchYPoint);
			if(touchSize<0) return; //behind observer
			var center2D=lens.doprojectPoint(center);
			var radius2D=lens.doprojectSize(radius,center[1]);
			if(radius2D===0)return;
	
			//good debug
			//radius2D=50;

			if(colorLight){

				var blick_radius=1;
				var blickShift=[-0.3*radius2D,-0.3*radius2D];
				var blickPoint=tp$.vector23D.combine(1,blickShift,1,center2D);
				//c onsole.log('blickPoint',blickPoint,center2D,radius2D);
				//c onsole.log('center',center,radius, colorDark, colorLight);
				var radgrad = ctx.createRadialGradient(blickPoint[0],blickPoint[1],blick_radius,center2D[0],center2D[1],radius2D);  
				//var radgrad = ctx.createRadialGradient(center2D[0]-0.3*radius2D,center2D[1]-0.3*radius2D,blick_radius,center2D[0],center2D[1],radius2D);  

				radgrad.addColorStop(0, '#FFFFFF'); //colorLight); //'#A7D30C');  

				//TODO work out:
				//radgrad.addColorStop(0.9, colorDark);  
				radgrad.addColorStop(0.7, colorDark);  

				//TODO work out:
				//radgrad.addColorStop(1, colorDark); //'rgba(1,159,98,0)');  

				radgrad.addColorStop(1, 'rgba(0,0,0,0)');  

				//radgrad.addColorStop(1, 'rgba(1,159,98,0)');  

				//TODO: remove this: 1.1 for "safety":
				var area=touchSize*1.1;
				//c onsole.log('center[1], radius, area',center[1], radius, area);
				ctx.fillStyle = radgrad;  
				var mLeft=Math.max(0,center2D[0]-area);
				var mTop=Math.max(0,center2D[1]-area);
				var mSize=2*area;
				ctx.fillRect( mLeft, mTop, 	mSize, mSize );

			}else{
				ctx.fillStyle= colorDark;
				ctx.beginPath();
				//c onsole.log(center2D,radius2D);
				ctx.arc(center2D[0],center2D[1], radius2D, 0, Math.PI*2, true);
				ctx.fill();
			}
		};




		//====================================================
		//draw3DAxis
		//====================================================
		var draw3DAxis=self.draw3DAxis=function(origin, index, axisLength, color){
			var pointA=[origin[0],origin[1],origin[2]];
			var pointB=[origin[0],origin[1],origin[2]];
			pointB[index] +=axisLength;
			//c onsole.log(pointA,pointB,color);
			draw3DLine(pointA,pointB,color);
		};

		//====================================================
		//draw3DAxes
		//====================================================
		var draw3DAxes=self.draw3DAxes=function(origin, axisLength, colors){
			draw3DAxis(origin, 0, axisLength, colors[0]);
			draw3DAxis(origin, 1, axisLength, colors[1]);
			draw3DAxis(origin, 2, axisLength, colors[2]);
		};


		//====================================================
		// Draw collection in order from back to front:
		// Algorithm: sorts by coordinate center.y.
		//====================================================
		var comparator=function(itemA,itemB){
			return Math.floor(   (itemB.center[1]-itemB.radius) - (itemA.center[1]-itemA.radius)  );
		};
		//Input:	optional: 	scrWidth,scrHeight,backgroundImageData.
		//						Modifies screen if present.
		var drawCollection=self.drawCollection=function(col,scrWidth,scrHeight,backgroundImageData){
			col.sort(comparator);
			if(backgroundImageData){
				ctx.putImageData(backgroundImageData, 0,0)
			}else{
				if(scrHeight)ctx.clearRect(0,0,scrWidth,scrHeight);
			}

			//tp$.deb(col);
			for(var i=0, len=col.length; i<len; i++){
				var cl=col[i];
				draw3DBallGradient=self.draw3DBallGradient(
					cl.center, cl.radius, cl.colorDark, cl.colorLight);
			}
		};



		return self;

	}) (); //Builds plugin body singleton

}) ();

