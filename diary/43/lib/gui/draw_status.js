(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	var console_text='';

	gio.draw_status=function()
	{ 
		var w;
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix];


		var game_mode='Mode: ';
		if(game.maps_loaded!=='success'){
			game_mode += 'load failed';
			gio.mode_div.innerHTML='<pre>'+ game_mode +'</pre>';
			return;
		}
		game_mode += gio.modes[gm.mode_ix];
		gio.mode_div.innerHTML='<pre>'+ game_mode +'</pre>';

		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;
		var colony_ix=pos.colony_ix;
		var punits=pos[colony_ix];
		var colony=gm.colonies[colony_ix];


		//map information
		w=gm.title ? gm.title : '';
		if(game.maps.length>1) w=game.map_ix+'. '+w; 
		gio.map_div.innerHTML= w ? '<pre>'+'Map: '+ w + '</pre>' :	'';

		//round information
		gio.round_div.innerHTML= gm.rounds.length>1 ? 
				'<pre>'+'Round: '+ gm.rounds.ix+'</pre>' :
				'';


		w='Unit: '+colony.nam;
		if(punits.length>1)w += ' '+punits.selected;
		gio.status_div.innerHTML='<pre>'+w+'</pre>';

		gio.moves_div.innerHTML=
				'<pre>' + 	'Moves/Backs/Recorded: '+(round.current_pos_ix)+
				'/'+round.backs+
				'/'+round.moves.length+
				'</pre>';

		gio.help_hint_div.innerHTML=
				'<pre>' + 'Help/Rules: '+gio.help_hint+
				'</pre>';

		if(game.load_maps){
			gio.info_div.innerHTML=
				'<pre>Info: <a href="'+game.path+'/maps.txt">maps</a>'+
				'</pre>';
		}	

		gio.draw_report();
	};

	gio.cons=function(msg){
		if(window.console && window.console.log)console.log(msg);
		console_text=msg;
		gio.cons_div.innerHTML='<pre>'+console_text+'</pre>';
	};

	gio.cons_add=function(msg){
		if(window.console && window.console.log)console.log(msg);
		console_text+="\n"+msg;
		gio.cons_div.innerHTML='<pre>'+console_text+'</pre>';
	};


	gio.draw_report=function(){ 
		var game=gio.games[gio.game_ix];
		var gm=game.maps[game.map_ix];

		var w;
		if(!game.doreport)return; //do nothing if "no rules"

		var report=game.doreport();

		if(report==='won'){
			gio.report_div.style.backgroundColor=gio.style.WINNING_COLOR;
			document.body.style.backgroundColor = gio.style.WINNING_COLOR;
		}else{
			gio.report_div.style.backgroundColor=gio.style.CONTROL_BACKGROUND;
			document.body.style.backgroundColor = gio.style.rootColor;
		}

		//TODm automate:
		w = report==='won'  ?  'Game is Won' : '';

		gio.report_div.innerHTML='<pre>'+w+'</pre>';
	};



})(jQuery);
