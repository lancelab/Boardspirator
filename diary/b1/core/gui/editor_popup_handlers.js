
( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var clonem	=  tp.core.clone_many;
					var exp_url	=  tp.core.expand_to_parent;

					var med		=  gio.map_editors;
					var ggp		=  gio.gui.procs;
					var conadd	=  function ( string ) { gio.cons_add( "Editor Handler: " + string ); };			



					// //\\//	Prepares handlers which are common 
					//			for button-click or key-strike control events.




	med.display_game_path = function ()
	{

			//if(!tp.core.allow_non_mainstream_browser()) return;
			ggp.lock_controls('Displaying a path');
			gio.input_mode = 'path';
			med.show_text_editor();
			var ww=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
			var result = gio.navig.in_session.round.path2texts_current();

			var directive	=	'playpath=' + result.metrics + "\n";
			ww.value		=	":::" + directive  + result.path; 
			ww.value		+=	result.co_path ? "\n\n:::co_" + directive + result.co_path : '';
			
				// Quick way to get stringified objects:
				// ww.value="albums=\n" + JSON.stringify( gio.def.albums, null, '\t');
			ww.focus();
	};


	/// Shows album-def-seeds
	med.display_albums=function(){
		ggp.lock_controls( 'Displaying album-def-seeds' );
		gio.input_mode = 'albums';
		med.show_text_editor('dont_show_done');
		var textarea = $(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		var value = JSON.stringify( gio.def.albums, null, '\t');
		textarea.value="{ \"albums\" : \n" + value + "\n}\n";
		textarea.focus();
	};

	/*
	med.display_collections=function(){
		var w;
		ggp.lock_controls('Displaying collections');
		gio.input_mode = 'collections';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="collections=\n" + gio.core.reflection.serialize_collections();
		w.focus();
	};
	*/

	med.display_game_defs=function(){
		var w;
		ggp.lock_controls('Displaying Game Definitions');
		gio.input_mode = 'game_defs';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="game_definitions=\n" + gio.core.reflection.serialize_game_defs();
		w.focus();
	};

	/*
	med.display_base_game_inherited_def=function(){
		var w;
		ggp.lock_controls('Displaying Base Game Definition');
		gio.input_mode = 'basegame_def';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="Basegame definition=\n" + gio.core.reflection.serialize_basegame_def();
		w.focus();
	};
	*/


	/// Runs autoplay virtually until the current path end or
	//	winning postion is detected.
	//	If winning position is detected, remetrifies the map.
	med.metrify_map = function ( show_metrics )
	{
		gio.modes.play='autoplay';
		gio.navig.in_map.move_till_condition( 'do GUI', function ( gm, round )
		{
			if( gm.game.won_or_not( gm, round.pos ) )
			{
				var metr = gm.metrics;
				metr.optpath	= metr.optpath || {};
				metr.optpath.p	= round.moves.length;
				metr.optpath.i	= round.interacts;
				metr.optpath.r	= round.peer_change;
				gio.session.reinit.metrify( gm );
				conadd( 'Remetrified' );
				ggp.draw_status_and_scene();
				if( show_metrics ) gio.gui.procs.toggle_about_map_pane();
			}else{
				conadd( 'No winning position is detected' );
				ggp.draw_status_and_scene();
			}
		});

	};




	/// pops up textarea and populates it with current map script
	//	for further map redesign
	med.edit_custom_maps = function ( task ) {

		var gs=gio.getgs();
		var game=gs.gm.game;
		var links = null;
		var rman = gio.navig.in_session.round;

		ggp.lock_controls( 'Doing task ' + task );
		if( task === 'pos_to_map' ) {
			var custom_text = rman.pos2map_script ( gs.round ); // no do_comap
		}else if( task === 'pos_to_comap' ) {
			var custom_text = rman.pos2map_script ( gs.round, 'do_comap' );
		}else{
			var links = gs.gm.dresses_wrap.chosen_dress.links;
			var custom_text = tp.core.htmlencode(gs.gm.script.raw_map);
		}

		//if(!tp.core.allow_non_mainstream_browser()) return



		gio.input_mode = 'map';
		med.show_text_editor();

		if( links && links.length > 0 )
		{
				gio.domwrap.wraps.links_to_external_collections.reset(
					{r:{
						options				:links
					},
					c:{	
						choice_ix			:0
					}}
				);
				gio.domwrap.wraps.links_to_external_collections[ 'wrapper' ].style.display = 'block';
		}

		var textarea	= $(gio.domwrap.popups.input_text_popup.popup_el).children( 'textarea' )[0];
		textarea.value	= custom_text;	
		textarea.focus();
	};//med.edit_custom_maps
	/// pops up textarea and populates it with current map script



	/// Pops up textarea and prompts to enter a link
	//
	med.submit_box_to_enter_collection_link = function () {

		var gs = gio.getgs();
		var game = gs.gm.game;

		ggp.lock_controls( 'Preparing to enter link for external collection ... ' );

		//. sets mode which will be used as a flag when
		//	taking data back from popup input textarea
		gio.input_mode = 'external_link';

		med.show_text_editor();
		//. we don't use CSS-ids or classes, so this is how we find data acceptor
		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];

		textarea.value = "Enter link to external collection here";
		textarea.focus();

	};




	/// Pops up textarea for gamion
	//
	med.submit_box_to_enter_gamion = function ( mode ) {

		var gs		= gio.getgs();
		var game	= gs.gm.game;

		ggp.lock_controls( 'Preparing to edit gamion ... ' );

		//. sets mode which will be used as a flag when
		//	taking data back from popup input textarea
		gio.input_mode = mode + '_gamion';

		med.show_text_editor();
		//. we don't use CSS-ids or classes, so this is how we find data acceptor
		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];

		textarea.value =	"// Enter your gamion or edit current one ...\n\n" +
							gs.coll.script.source_text;
		textarea.focus();

	};





	// Input:	if "stringified" supplied, no "done(load)" button enabled
	med.do_init_save_load_popup=function(stringified){

		if(!tp.core.allow_non_mainstream_browser()) return

		var gs=gio.getgs();
		var game=gs.gm.game;

		ggp.lock_controls( stringified ? 'Saving rounds' : 'Loading rounds');

		gio.input_mode = 'rounds';
		med.show_text_editor(stringified);

		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		textarea.value = stringified || '' ;	
		textarea.focus();
	};


	/// Auxiliary. Used in "Close" button of text editors.
	med.hide_text_editor = function( dont_unlock ) {

			gio.domwrap.wraps.links_to_external_collections.wrapper.style.display = 'none';
			med.text_editor_closing_button.wrapper.style.display = 'none';
			med.text_editor_done_button.wrapper.style.display = 'none';
			gio.domwrap.popups.input_text_popup.hide();
			if( !dont_unlock ) ggp.unlock_controls();
	};



	// Auxiliary
	med.show_text_editor = function( dont_show_done )
	{
		if( gio.input_mode === 'map' ) {
			gio.domwrap.wraps.links_to_external_collections.wrapper.style.display = 'block';
		}
		if( !dont_show_done ) med.text_editor_done_button.wrapper.style.display = 'block';
		med.text_editor_closing_button.reset(  {c:{gui:{style:{wrapper:{display:'block'}}}}}  );
		gio.domwrap.popups.input_text_popup.show();
	};






	///	Multipurpose editor finalization subroutine
	//
	med.load_from_text_editor = function () {

		var gs = gio.getgs();
		var gm = gs.gm;
		//gio.input_mode =  // TODm make gio.session.dmodes.input gio.session.smodes.db
		var imode = gio.input_mode;

		ggp.do_display_curr_board( false );
		med.hide_text_editor('don`t unlock controls');

		var custom_text = $(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0].value;


		if(imode === 'path'){

			gio.input_mode = '';
			ggp.inject_path_from_text( custom_text, 'do_messagify' );
			ggp.do_display_curr_board( 'yes' );
			return;

		}else if( imode === 'rounds' ) { 

			gio.input_mode = '';
			//. this may change the game and collection
			gio.navig.in_session.round.deserialize_rounds( custom_text );
			ggp.unlock_controls();
			return;



		///	Landing on gamion from external link ///////////////////////////
		}else if( imode === 'external_link' ) {

			var wlink		= $.trim( custom_text );
			var success		= !!wlink;  //TODM "courtecy work" check user input
			if( success )
			{
				var wlink		= exp_url ( $.trim( custom_text ) );
				var akey		= gm.collection.ref.list.akey;
				var downed_coll	= gio.data_io.download_gamion (
				{
					galfinition :
					{	penetrate_asingle	: true,
						title				: "My Album Choice",
						chosen				: true
					},

					mapfinition :
					{
						akey_advice			: akey,
						title				: "My Maps Choice",
						chosen				: true
					},

					common :
					{	
						//user_dynamic_link	: true,
						link				: wlink
					}
				});

				var success = !!downed_coll;
			}

			if( success ) {
				var akey	= downed_coll.ref.list.akey;
				var cix		= downed_coll.ref.list.ix;
				var success = downed_coll.maps_loaded === 'success' ;
				if( success ) {
					var success = gio.navig.validate_coll_map( akey, cix, 0, 'do land' );
					if( !success ) conadd( "Failed landing on " + akey + ", " + ix );
				}else{
					conadd(	"No maps in collection ... perhaps are albums only ...\n" + //TODM there must be a way to pull derived album or game from parsed heap and try to scroll to gkey or akey.
							"try to scroll to albums manually ... "							
					);
					//TODM do the scroll .... possibly use this: gdef.procs.get_preferred_album_def
				}
			}else{
				conadd( 'Failed custom scrith download for ' + wlink );
			}


			if( !success ) ggp.do_display_curr_board( true );
			ggp.unlock_controls();
			gio.input_mode='';
			return;




		///	Loading gamion from user text ///////////////////////////
		}else if( imode === 'edit_gamion' || imode === 'create_gamion' ) {

			var custom_text	= $.trim( custom_text );
			if( !custom_text )
			{
				ggp.do_display_curr_board( true );
				ggp.unlock_controls();
				gio.input_mode = '';
				return;
			}

			var akey		= gs.akey;
			var wedit		= imode === 'edit_gamion';
			var metag		=
			{
				galfinition :
				{	penetrate_asingle	: true,
					overdefine			: wedit,
					chosen				: true,
					title				: "My Galfinition"
				},

				mapfinition :
				{
					cix_to_insert1		: wedit ? gs.cix + 1 : 0,
					akey_advice			: akey,
					title				: "My Mapfinition",
					chosen				: true
				},

				common :
				{	
					//user_entered_gamion_text	: true,
					jwon						: true
				}
			};


			var downed_coll	= gio.data_io.download_gamion ( metag, custom_text );
			var success		= !!downed_coll;

			if( success ) {
				var akey	= downed_coll.ref.list.akey;
				var cix		= downed_coll.ref.list.ix;

				var success = downed_coll.maps_loaded === 'success' ;
				if( success )
				{
					//. ...don't land
					var success = gio.navig.validate_coll_map( akey, cix, 0, 'do land' );
					if( !success ) {
						conadd( "Failed landing on " + akey + ", " + ix );
					}
				}else{
					conadd(	"No maps in collection ... perhaps are albums only ...\n" +
									"try to scroll to albums manually ... "							
					);
					//TODM do the scroll .... possibly use this: gdef.procs.get_preferred_album_def
				}
			}else{
				conadd( 'Gamion parser failed.' );
			}

			if( !success ) ggp.do_display_curr_board( true );
			ggp.unlock_controls();
			gio.input_mode = '';
			return;







		}else if( imode === 'map' ) {

			gio.data_io.add_map_text_and_land( custom_text );
			ggp.unlock_controls();
			gio.input_mode='';



		}else{

			throw "Unknown editor mode"; //TODM improve
		}

	};	///	Multipurpose editor finalization subroutine



})(jQuery);
