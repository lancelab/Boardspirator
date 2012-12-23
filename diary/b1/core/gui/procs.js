(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gde		=  gio.domwrap.elems;
					var ggp		=  gio.gui.procs;





	var unlock_popup=function(){gio.gui.modes.common_popup_shown=true;};


	// Refresh gui, but don't if 
	// gm is supplied and not current in gui.
	ggp.refresh=function(gm){
		var gs = gio.getUnfinishedState();
		if(!gm || gs.gm === gm){
			gio.draw_scene();
			gio.draw_status();
		}
	};


	/// Input:	"do_messagify" enforces extra messages from "round".
	ggp.inject_path_from_text = function( path_text, do_messagify, do_stay_at_end ) {

		ggp.lock_controls('Validating generated playpath ...');
		var validator_msg = gio.navig.in_session.round.text2round( path_text );
		if(validator_msg) gio.cons_add(validator_msg);
		if( !do_stay_at_end ) {
			if( do_messagify ) {
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



	///	TODm design event model better to remove this:
	//	popup protection against closing by own click:
	gio.gui.modes.common_popup_shown=true;
	ggp.prolong_common_popup=function(){

		if(gio.common_popup.isVisible()){
			gio.gui.modes.common_popup_shown=false;
			setTimeout(unlock_popup,1000);
		}
	};


	// ***	locks and unlocks controls
	// **	locks and shows message:
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




	// Makes and returns a combined title from current state gs
	ggp.get_master_title_from_session_state = function () {
		var gs = gio.getgs();
		return ggp.calculate_game_titile_from_names(
				gs.gm.game.nam, gs.playalb.album_name );
	};

	// Makes and returns a combined title of game and album
	ggp.calculate_game_titile_from_names = function( game_name, album_name ) {
		var w = game_name;
		var title = w || '';
		if(album_name){
			title = ( w ? w + '. ' : '') + album_name;
			if(w) title+= '.';
		}
		return title;
	};


})(jQuery);
