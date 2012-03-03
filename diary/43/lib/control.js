(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	gio.init_control_events=function()
	{

		//====================================================
		//destroy all interfering events
		//----------------------------------------------------

			//selection
			$(gio.board).css({
	                   '-moz-user-select':'none',
	                   '-webkit-user-select':'none',
	                   'user-select':'none'
	               }).each(this.onselectstart=function(){return false;}); //for IE
	
			//keyboard extras
			//$(document).bind('keyup', function(e){ return e.keyCode!==9; });
			//$(document).bind('keypress', function(e){ return e.keyCode!==9; });
	
			//why this fails?:
			//document.ondragstart=function(){return false;};
		//----------------------------------------------------
		//destroy all interfering events
		//====================================================



		//handle many keystrokes and arrows
		tp.bindEvents('keydown', function(a)
		{
			var len=gio.games.length;
			var game=gio.games[gio.game_ix];
			var gm=game.maps[game.map_ix] ;



			if(a.event.ctrlKey){
				if(a.arrow){ //select unit
					if(a.event.shiftKey){
						return gio.select_colony(a.keyName); //breed
					}else{
						return gio.selecting_unit(a.keyName); //unit
					}
				}else if(a.keyName==='question' || a.keyName==='h'){
					gio.common_popup.dotoggle({
						owner:'help',
						innerHTML:'<pre>'+gio.help+"\nRules: "+game.rules+"\n"+'</pre>'
					});
				}
				return true;
			}

			switch(a.keyName){
				case 'escape':	//cancellator:
					gio.help_div.style.visibility = 'hidden'; 
					gio.about_div.style.visibility = 'hidden'; 
					gio.cons_div.style.visibility = 'hidden'; 
					break;
				case 'e':	//play/edit
					len=gio.modes.length;
					gm.mode_ix=(gm.mode_ix+len+1)%len;
					gio.skip_inactive_colony(gm,'right');
					break;
				case 'g':	//game
					if(len===1)return true;
					if(gm.board)gm.board.style.display='none';
					gio.game_ix=(gio.game_ix+1)%len;
					gio.init_until_non_failed_game();
					return false;
				case 'p':	//map
					if(game.maps.length===1)return true;
					if(gm.board)gm.board.style.display='none';
					game.map_ix=(game.map_ix+1)%game.maps.length;
					gio.do_init_game_map();
					return false;
				case 'o': 	//round
					var rr=gm.rounds;
					rr.ix=(rr.ix+1)%rr.length;
					break;
				case 'n':	//new round
					gio.init_round();
					break;
				case 'r':	//reset
					gio.init_round('reset this round');
					break;
				case 's':	//to start
					gio.do_record(null,'to beginning');
					break;
				case 'u':	//unit
					return gio.selecting_unit(a.keyName);
				case 't':	//tribe-type-breed-colony
					return gio.select_colony('right');
				case 'backspace':
				case 'b':	//backmove
					gio.do_record(null,'back');
					break;
				case 'f':	//forward
					gio.do_record(null,'forward');
					break;
				case 'a':
					gio.toggle_about_pane();
					return false;
				case 'question':
				case 'h':
					gio.common_popup.dotoggle({
						owner:'help',
						innerHTML:'<pre>'+gio.help+"\nRules: \n"+game.rules+"\n"+'</pre>'
					});
					return false;
				default	: return true;
			}
			gio.draw_scene();
			gio.draw_status();
			return false;
		});
	};


	gio.toggle_about_pane = function(){
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix] ;

		var about=	"Credits:\n"+game.credits+"\n\n"+
					"Engine:\n";
		tp.core.each(gio.Description, function(k,v){
			about += '    '+k+': '+v+"\n";
		});
		gio.common_popup.dotoggle({owner:'about', innerHTML:'<pre>'+about+'</pre>'});
	};

	gio.select_colony=function(pointer){
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix] ;

		var len=gm.colonies.length;
		var round=gm.rounds[gm.rounds.ix];
		var ix=round.pos.colony_ix;
		if(  pointer === 'left' || pointer === 'up'   ){
			ix=(ix+len-1)%len;
		}else{
			ix=(ix+1)%len;
		}
		round.pos.colony_ix=ix;
		gio.skip_inactive_colony(gm,pointer);
		gio.draw_scene();
		gio.draw_status();
		return false;				
	};

	gio.selecting_unit=function(pointer)
	{
			var direction = isNaN(pointer) ? pointer : '';

			var game=gio.games[gio.game_ix];
			var gm=game.maps[game.map_ix] ;

			var round=gm.rounds[gm.rounds.ix];
			var pos=round.pos;
			var colony_ix=pos.colony_ix;
			var punits=pos[colony_ix];
			var ulen=punits.length;
			var key=direction;

			var ix=punits.selected;
			if(key==='left' || key==='up')
			{
				ix=(ulen+ix-1)%ulen;
			}else{
				ix=(ulen+ix+1)%ulen;
			}
			punits.selected=ix;
			gio.draw_scene();
			gio.draw_status();
			return false;
	};


	//some colonies are disabled in play mode ... weed them out:
	//loop through all and find active index:
	gio.skip_inactive_colony=function(gm,direction)
	{
			if(gio.modes[gm.mode_ix]==='edit')return;

			var len=gm.colonies.length;
			var pos=gm.rounds[gm.rounds.ix].pos;
			var ix=pos.colony_ix;

			for(var i=0; i<len; i++)
			{
				if(!gm.colonies[ix].frozen && !gm.colonies[ix].passive)
				{
					pos.colony_ix=ix;					
					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					ix=(ix+len-1)%len;
				}else{
					ix=(ix+1)%len;
				}
			}
	};
	

	gio.init_until_non_failed_game=function(gm) //TODO q&d. make solid.
	{
		var len=gio.games.length;
		for(var i=0; i<len; i++)
		{
			gio.game_ix=(i+gio.game_ix)%len;
			var gm=gio.games[gio.game_ix];
			gio.init_game(); //TODO relies on syncron. jQ ajax text download
			if(gm.maps_loaded==='success')return;
		}
	};
	

})(jQuery);
