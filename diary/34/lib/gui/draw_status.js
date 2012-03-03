
(function( $ ){
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};

	gio.draw_status=function()
	{ 
		var gm=gio.games[gio.game_ix];
		var round=gm.rounds[gm.rounds.ix];
		var pos=round.pos;
		var colony_ix=pos.colony_ix;
		var punits=pos[colony_ix];
		var colony=gm.colonies[colony_ix];

		gio.mode_div.innerHTML='<pre>'+'Game: '+ 
				gio.games[gio.game_ix].nam + ' ' +
				gio.modes[gm.mode_ix]+'</pre>';
		gio.round_div.innerHTML='<pre>'+'Round: '+ 
				gm.rounds.ix+'</pre>';
		gio.status_div.innerHTML=
				'<pre>' + 	'Unit: '+colony.nam+
				' '+punits.selected+
				'</pre>';
		gio.moves_div.innerHTML=
				'<pre>' + 	'Moves/Backs: '+round.moves.length+
				'/'+round.backs+
				'</pre>';
		gio.draw_report();
	};

	gio.console=function(msg){
		gio.console_div.innerHTML='<pre>'+msg+'</pre>';
	};


	gio.draw_report=function(){ 
		var gm=gio.games[gio.game_ix];
		if(!gm.doreport)return; //do nothing if "no rules"
		var gm=gio.games[gio.game_ix];
		gio.report_div.innerHTML='<pre>'+'Result: '+gm.doreport()+'</pre>';
	};



})(jQuery);
