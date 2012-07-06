(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var gstyle	=	gio.config.style;
					var ggp		=   gio.gui.procs;





	var console_text='';
	var unlock_popup=function(){gio.gui.modes.common_popup_shown=true;};


	//=============
	//console
	//-------------
	gio.cons=function(msg){
		console_text='';
		$.each(arguments,function(i,msg){
			if(window.console && window.console.log){					// ***** safe console
				// Empty string messages are annoying in FB:
				if(msg !== '')	console.log(msg);       				// ***** safe console
			}
			console_text+="\n"+msg;
		});
		gio.domwrap.elems.con_div_child.innerHTML='<pre>'+console_text+'</pre>';
	};




	gio.cons_add=function(){
		$.each(arguments,function(i,msg){
			if(window.console && window.console.log)console.log(msg);	// ***** safe console
			console_text+="\n"+msg;
		});
		gio.domwrap.elems.con_div_child.innerHTML='<pre>'+console_text+'</pre>';
	};
	//-------------
	//console
	//=============




	// Refresh gui, but don't if 
	// gm is supplied and not current in gui.
	ggp.refresh=function(gm){
		var gs=gio.getgs();
		if(!gm || gs.gm === gm){
			gio.draw_scene();
			gio.draw_status();
		}
	};



	// Input:	"do_messagify" enforces extra messages from "round".
	ggp.inject_path_from_text=function(path_text, do_messagify, do_stay_at_end){
		ggp.lock_controls('Validating generated playpath ...');
		var validator_msg = gio.navig.in_session.round.text2round(path_text);
		if(validator_msg) gio.cons_add(validator_msg);
		if(!do_stay_at_end){
			if(do_messagify){
				gio.navig.in_session.round.do_back_forw_start_record(gio.getgs().round, 'to beginning');
			}else{
				gio.gui.procs.do_manage_round(null,'to beginning');
			}
		}
		ggp.refresh();
		ggp.unlock_controls();
	};


	// Auxiliary
	ggp.hide_current_board=function(){
		gio.getgs(function(gs){
				if(gs.gm.board) gs.gm.board.style.display='none'; // TODm rid of "if(gs.gm.board
		});
	};

	ggp.unhide_current_dom_board=function(){
		gio.getgs(function(gs){
				if(gs.gm.board) gs.gm.board.style.display='block'; // TODm rid of "if(gs.gm.board
		});
	};



	//TODm design event model better to remove this:
	//popup protection against closing by own click:
	gio.gui.modes.common_popup_shown=true;
	ggp.prolong_common_popup=function(){
		if(gio.common_popup.isVisible()){
			gio.gui.modes.common_popup_shown=false;
			setTimeout(unlock_popup,1000);
		}
	};


	////////////////////////////////////
	//lock and unlock controls
	//==================================
	//lock and show message:
	ggp.lock_controls=function(msg){
		//gio.cons_add('locking ...');
		if(!gio.gui.modes.controls_locked){
			gio.domwrap.popups.modal_message_popup.show({innerHTML: (msg || '')});
			gio.gui.modes.controls_locked=true;
		}
	};
	ggp.unlock_controls=function(){
		//gio.cons_add('unlocking ...');
		gio.gui.modes.controls_locked=false;
		gio.domwrap.popups.modal_message_popup.hide();
	};
	////////////////////////////////////



	// Makes and returns a combined title from current state gs
	ggp.calculate_game_and_album_title=function(){
		var gs = gio.getgs();
		return ggp.calculate_game_titile_from_names(
				gs.gm.game.nam, gs.coll.plalb.album_name);
	};

	// Makes and returns a combined title of game and album
	ggp.calculate_game_titile_from_names=function(game_name, album_name){
		var w = game_name;
		var title = w || '';
		if(album_name){
			title = ( w ? w + '. ' : '') + album_name;
			if(w) title+= '.';
		}
		return title;
	};




})(jQuery);
