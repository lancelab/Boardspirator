(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	//=============
	//console
	//-------------
	var console_text='';

	gio.cons=function(msg){
		if(!gio.debug)console_text='';
		$.each(arguments,function(i,msg){
			if(window.console && window.console.log)console.log(msg); //in gio.cons
			console_text+="\n"+msg;
		});
		gio.cons_div.innerHTML='<pre>'+console_text+'</pre>';
	};

	gio.cons_add=function(){
		$.each(arguments,function(i,msg){
			if(window.console && window.console.log)console.log(msg); //in gio.cons
			console_text+="\n"+msg;
		});
		gio.cons_div.innerHTML='<pre>'+console_text+'</pre>';
	};
	//-------------
	//console
	//=============




	//==========================
	// Make laoyout fluid
	//--------------------------
	gio.adjustDispositionsByBrowserWindow=function(gm){
		// Parent controls:
		gio.setControlsByWindowShape(); 

		var game, collection, gm, round;
		gio.gst(function(g,c,m,r){	game=g; collection=c; gm=m; round=r; });

		// Fix root:
		var gstyle=gio.style;
		var width = gstyle.edit_column_width;
		width=gm.dim_max_width + width;	
		var scrollTop=Math.max($(window).scrollTop()-gio.style.captions.height, 10);
		var occupiedByGameBoard= gm.dim_max_height+3*game.tile.height;

		var centered_control_subboard_top;


		if(window.innerHeight < window.innerWidth){
			//landscape:
			gio.root_div.style.width = width+gio.style.controls.boardWidth +'px';
			gm.board.style.left=gio.style.controls.boardWidth+'px';
			centered_control_subboard_top=scrollTop;
		}else{
			//portrait:
			gio.root_div.style.width = width +'px';
			gm.board.style.left='0px';
			centered_control_subboard_top=occupiedByGameBoard;
		}

		$(gio.centered_control_subboard).css('top',centered_control_subboard_top);

		//========================================
		// Fix top position of in-play console:
		//----------------------------------------
		w = centered_control_subboard_top;
		w +=  gio.style.controls.STATUS_LINE_PERIOD * 8 + 10;
		//occupied by game board:
		ww=gm.dim_max_height+3*game.tile.height; 
		if( ww > w ) w=ww;
		if(window.innerHeight < window.innerWidth){
			//landscape:
			gio.cons_div.style.top=ww+'px';
			gio.cons_div.style.left=gio.style.controls.boardWidth+'px';
		}else{

			//this wastes space on the right to controls:
			//gio.cons_div.style.top=w+'px';
			//gio.cons_div.style.left=0+'px';

			//this uses space on the right to controls:
			gio.cons_div.style.top=ww+'px';
			gio.cons_div.style.left=gio.style.controls.boardWidth+'px';
		}
		//========================================
	}
	//--------------------------
	// Make laoyout fluid
	//==========================


})(jQuery);
