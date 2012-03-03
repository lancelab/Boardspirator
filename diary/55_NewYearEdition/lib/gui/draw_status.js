(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	//////////////////////////////
	gio.draw_status=function()
	{ 
		var w,ww;
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];

		w=gio.modes[gm.mode_ix];
		gio.mode_div.innerHTML= w !== 'play' ? '<pre>Activity: '+ w +'</pre>' : '';

		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;
		var colony_ix=pos.colony_ix;
		var punits=pos[colony_ix];
		var colony=gm.colonies[colony_ix];

		//round information
		gio.round_div.innerHTML= gm.rounds.length>1 ? 
				'<pre>'+'Round: '+ gm.rounds.ix+'</pre>' :
				'';

		w = gm.number_of_active_colonies && gm.number_of_active_colonies > 1 ? 
				'Hero: '+gio.human_name(colony,punits.selected) : '';
		gio.status_div.innerHTML='<pre>'+w+'</pre>';

		
		//===== stat ============================
		w= gm.multiplayer ? ' Players' : '';
		ww= gm.multiplayer ? '  '+gm.multiplayer : '';
		gio.moves_div.innerHTML=
				'<pre>' + 	'Moves  Backs  Path '+w+"\n"+
				(round.current_pos_ix)+
				'  '+round.backs+
				'  '+round.moves.length+
				ww +
				'</pre>';
		//===== stat end ============================


		gio.draw_won_or_not();

		//Note: captions are already included into parent div top-shift:
		//Add 10px for nicer layout:
		w=Math.max($(window).scrollTop()-gio.style.captions.height, 10);
		$(gio.centered_control_subboard).css('top',w);


		//In-play console:
		ww=gm.dim_max_height+3*game.tile.height; //occupied by game board
		ww=ww-w;  //already taken by controls
		ww=Math.max(gio.style.controls.STATUS_LINE_HEIGHT*5, //necessary gap
					ww);
		gio.cons_div.style.top=ww+'px';
	};


	/////////////////////////////////////
	gio.draw_won_or_not=function(){ 
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];

		var w;
		if(!game.won_or_not)return; //do nothing if "no rules"

		var report=game.won_or_not();

		if(report==='won'){
			gio.map_caption_div.innerHTML='Won';
			gio.cons_div.style.backgroundColor=gio.style.WINNING_COLOR;
			gio.board.style.backgroundColor=gio.style.WINNING_COLOR;
			document.body.style.backgroundColor = gio.style.WINNING_COLOR;
		}else{
			gio.map_caption_div.innerHTML='Map';
			gio.cons_div.style.backgroundColor=gio.style.controls.backgroundColor;
			gio.board.style.backgroundColor=gio.style.controls.backgroundColor;
			document.body.style.backgroundColor = gio.style.rootColor;

			//sugar:
			if(	gm.filled_units>0 &&
				gm.filled_units !== gm.min_necessary_filled){
				gio.cons_add('completed '+ gm.filled_units +' ... remains '+(gm.min_necessary_filled - gm.filled_units) + ' ...');
			}
		}
	};


	gio.human_name=function(colony,ix){
		var game=gio.games[gio.game_ix];
		var ix_show = colony.units.length>1 ? ' '+(ix+1) : '';

		var name = (game.human_name && game.human_name(colony.nam)) || colony.nam; 
		return name + ix_show;
	};



})(jQuery);
