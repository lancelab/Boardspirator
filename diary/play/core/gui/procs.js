
( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var gde		=  gio.domwrap.elems;
					var ggp		=  gio.gui.procs;
					var deb		=  function ( string ) { if( gio.debug ) gio.cons_add( "GUI Procs: " + string ); };			






	var unlock_popup=function(){gio.gui.modes.common_popup_shown=true;};



	///	Refreshes gui, but don't if 
	//	gm is supplied and not current in gui.
	ggp.draw_status_and_scene = function ( gm ) {

		var gs = gio.getgs();
		if( !gm || !gs.gm || gs.gm !== gm )
		{
			gio.draw_scene();
			gio.draw_status();
		}
	};



	/// Finds dress by dkey and sets GUI-dress to this dress
	//	Does not refresh GUI except 
	ggp.virtual_reselect_dress = function ( gm, dkey )
	{
		if( !dkey ) return;
		var selected_ix = -1;
		var arr = gm.dresses_wrap.arr;
		for( var ix = 0, len = arr.length; ix < len; ix ++ )
		{
			var wrap = arr[ ix ];
			if( dkey === wrap.dress.key )
			{
				selected_ix = ix;
				break;
			}
		}
		if( selected_ix < 0 ) return;

		// c ccc( ' index is set to ' + selected_ix + ' was = ' + gm.dresses_wrap.chosen_ix );

		gm.dresses_wrap.chosen_ix = selected_ix;
		gm.dresses_wrap.chosen_dress = arr[ selected_ix ].dress; //TODM redundant. Poor design. Remove.

		//.	reskinnify_board does this job
		//gio.domwrap.headers.dress_select_el.reset_choice( selected_ix );

		//: Not our responsibility
		//	gio.gui.reskinnify_board();
		//	gio.gui.procs.draw_status_and_scene();
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
		ggp.draw_status_and_scene();
		ggp.unlock_controls();
	};


	// Auxiliary
	ggp.do_display_curr_board = function ( do_display ) {
		var gs = gio.getgs();
		var board = gs.board;
		if( board )
		{
			var mess	=  do_display ? 'Displays' : 'Hides';
			mess		+= ' board. a,c,m = ' + gs.akey + ', ' + gs.cix + ', ' + gs.mix;
			deb( mess );
			board.style.display = do_display ? 'block' : 'none';
		}
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



	/// Resets:	header's-selects.
	//	Input:	all args are opt. Omitted args are not reset. Title is always reset.
	ggp.visualize_collection_titles = function( collection, collections ) {

		if( collections )
		{
			gio.domwrap.headers.collection_select_el.reset(
						{r:{
							options				:collections
						},
						c:{	dont_reset_styles	:false,
							choice_ix			:collections.ix
						}}
			);
		}

		if( collection )
		{
			gio.domwrap.headers.map_select_el.reset(
					{r:{
						options				:collection.maps
					},
					c:{	dont_reset_styles	:false,
						choice_ix			:collection.map_ix
					}}
			);
		}

		var state = gio.session.state;
		gio.domwrap.headers.title_select_el.reset( {c:{choice_ix:state.album_ix}} );
		//.	Does vital debug.
		//	if( !collections ) c ccc( 'gio.domwrap.headers.title_select_el.reset=', gio.domwrap.headers.title_select_el.arg.r.options );
		return true;
	};











})();
