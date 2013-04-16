
/// Hides animation internal states from global scope
( function () {




	//	//\\//	Demo. Sets bubbles collection parameters and runs rotation.
	//			Version 0.0.7. April 12, 2013.
	//			JS entry module.
	//			Copyright (c) 2012 Konstantin Kirillov. License: MIT.


	var animationId	= null;
	var resetId		= null;
   	var ctx			= null; //canvas.getContext('2d');  
	var canvas		= null;
	var dogo		= true; //	true/false. "false" makes animation frozen by skipping update.
	var screen		= {};	//	plain-object to hold screen data


	var onload_original = window.onload;
	window.onload = function ()
	{

		if( onload_original ) onload_original();
		//.	Removes js warning
		var warning = document.getElementById('java-script-disabled');
		if( warning ) warning.style.display='none';	

		//: Inits 2D Graphics objects or abandons canvas
		canvas = document.getElementById('canvas');
		if(!canvas || !canvas.getContext || !canvas.getContext('2d')){
			//:	We have canvas-unaware browser.
			//	Removes canvas from page.
			document.getElementById('wrap').style.display='none';	
			return;
		}
    	ctx = canvas.getContext('2d');  

		//. Sets dogo to stop/start on click
		document.body.addEventListener('click', function(){ dogo = !dogo; return false;}, true );

		//. Fires animation up
		resetId = setTimeout( tp$.reset_animation, 1 );

		//.	Enables animation resetting at window.onresize
		tp$.bindEvent( 'resize',  window, function () {
			if( resetId !== null )
			{
				// good debug: c onsole.log( 'Yes ... it is still resizing ...' );
				window.clearTimeout( resetId );
			}
			resetId = setTimeout( tp$.reset_animation, 10 );
		});

	};


	screen.detect = function () {
		screen.width = window.innerWidth || body.clientWidth;
		screen.height = window.innerHeight || body.clientHeight;
		// c onsole.log( this );
	};



	tp$.reset_animation = function ()
	{

		if( !canvas ) return;
		resetId = null;
		if( animationId !== null )
		{
			window.clearTimeout( animationId );
			animationId = null;
		}		

		//: Settings:
		var itemsMax=100;		// 2
		var framesInCircle=500; // 200
		var animationInterval=40;
		var boxMax=500;			// 300
		var bodyRadiusMax=20;	// 100
		var distance=200;
		var scale=100;

		screen.detect();
		var scrWidth=  screen.width; //600;
		var scrHeight= screen.height; //600;

		var scrCenterX=Math.floor(scrWidth/2);
		var scrCenterY=Math.floor(scrHeight*0.5);

		//var lendFlag=tp$.lensTransformation.flgISOMETRY;		
		var lendFlag=tp$.lensTransformation.flgPERSPECTIVE;		

		//: Spawns settings
		var wrap=document.getElementById('wrap');
		wrap.style.width=scrWidth+'px';
		wrap.style.height=scrHeight+'px';
    	canvas.height=scrHeight;
    	canvas.width=scrWidth;
 

		//: Inits workers:
		var lens=tp$.lensTransformation.reset({ 
				flg : lendFlag,
				center : [scrCenterX,scrCenterY],
				distance : distance,
				scale : scale
		});
		tp$.draw3D.reset(ctx);
		//tp$.draw3D.draw3DAxes([100,0,-100],  100, ['#0000FF','#00FF00','#FF0000']);


		var items=tp$.funny_graphics_3D.generateRandomCollectionOfBalls(itemsMax,bodyRadiusMax,boxMax);
		var clonedCollection=tp$.funny_graphics_3D.cloneCollection(items);
		var salt=tp$.funny_graphics_2D.createRandomDisks(1000, scrWidth, scrHeight);
		var backgroundImageData=salt.getImageData(0,0,scrWidth,scrHeight);

		var drawAndSet = function ()
		{
			if(dogo){
				tp$.funny_graphics_3D.drawCollectionOfBalls(
						items, clonedCollection, counter, framesInCircle,
						scrWidth,scrHeight,backgroundImageData);
				counter++;
			}
			//if(counter<framesInCircle)setTimeout(drawAndSet, animationInterval);
			animationId = setTimeout(drawAndSet, animationInterval);
		};

		counter=0;
		drawAndSet();

	};


})(); /// Hides animation internal states from global scope


