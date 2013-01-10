(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var clonem	=  tp.core.clone_many;

					var med		=  gio.map_editors;






					// //\\//	Prepares handlers which are common 
					//			for button-click or key-strike control events.




	med.display_game_path=function(){

			//if(!tp.core.allow_non_mainstream_browser()) return;
			gio.gui.procs.lock_controls('Displaying a path');
			gio.input_mode = 'path';
			med.show_text_editor();
			var ww=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
			var result = gio.navig.in_session.round.path2texts_current();
			ww.value = 	":::playpath\n" + result.path; 
			ww.value += result.co_path ? "\n\n:::co_playpath\n" + result.co_path : '';
			
				// Quick way to get stringified objects:
				// ww.value="albums=\n" + JSON.stringify( gio.def.albums, null, '\t');
			ww.focus();
	};


	/// Shows album-def-seeds
	med.display_albums=function(){
		gio.gui.procs.lock_controls( 'Displaying album-def-seeds' );
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
		gio.gui.procs.lock_controls('Displaying collections');
		gio.input_mode = 'collections';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="collections=\n" + gio.core.reflection.serialize_collections();
		w.focus();
	};
	*/

	med.display_game_defs=function(){
		var w;
		gio.gui.procs.lock_controls('Displaying Game Definitions');
		gio.input_mode = 'game_defs';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="game_definitions=\n" + gio.core.reflection.serialize_game_defs();
		w.focus();
	};

	/*
	med.display_base_game_inherited_def=function(){
		var w;
		gio.gui.procs.lock_controls('Displaying Base Game Definition');
		gio.input_mode = 'basegame_def';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="Basegame definition=\n" + gio.core.reflection.serialize_basegame_def();
		w.focus();
	};
	*/




	/// pops up textarea and populates it with current map script
	//	for further map redesign
	med.edit_custom_maps = function () {

		//if(!tp.core.allow_non_mainstream_browser()) return

		var gs=gio.getgs();
		var game=gs.gm.game;

		gio.gui.procs.lock_controls('Creating custom maps collection ... ');

		gio.input_mode = 'map';
		med.show_text_editor();
		var links = gs.gm.dresses_wrap.chosen_dress.links;

		if(links && links.length > 0){
			gio.domwrap.wraps.links_to_external_collections.reset(
				{r:{
					options				:links
				},
				c:{	
					choice_ix			:0
				}}
			);
			gio.domwrap.wraps.links_to_external_collections['wrapper'].style.display='block';
		}
		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];

		textarea.value =	tp.core.htmlencode(gs.gm.script.raw_map);
		textarea.focus();
	};//med.edit_custom_maps
	/// pops up textarea and populates it with current map script



	/// Pops up textarea and prompts to enter a link
	//
	med.submit_box_to_enter_collection_link = function () {

		var gs=gio.getgs();
		var game=gs.gm.game;

		gio.gui.procs.lock_controls( 'Preparing to enter link for external collection ... ' );

		//. sets mode which will be used as a flag when
		//	taking data back from popup input textarea
		gio.input_mode = 'external_link';

		med.show_text_editor();
		//. we don't use CSS-ids or classes, so this is how we find data acceptor
		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];

		textarea.value = "Enter link to external collection here";
		textarea.focus();

	};//med.edit_custom_maps
	/// pops up textarea and populates it with current map script






	// Input:	if "stringified" supplied, no "done(load)" button enabled
	med.do_init_save_load_popup=function(stringified){

		if(!tp.core.allow_non_mainstream_browser()) return

		var gs=gio.getgs();
		var game=gs.gm.game;

		gio.gui.procs.lock_controls( stringified ? 'Saving rounds' : 'Loading rounds');

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
			if( !dont_unlock ) gio.gui.procs.unlock_controls();
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

		gio.gui.procs.do_display_curr_board( false );
		med.hide_text_editor('don`t unlock controls');

		var custom_text = $(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0].value;


		//gio.input_mode =  // TODm make gio.session.dmodes.input gio.session.smodes.db
		if(gio.input_mode === 'path'){

			gio.input_mode = '';
			gio.gui.procs.inject_path_from_text( custom_text, 'do_messagify' );
			gio.gui.procs.do_display_curr_board( 'yes' );
			return;

		}else if( gio.input_mode === 'rounds' ) { 

			gio.input_mode = '';
			//. this may change the game and collection
			gio.navig.in_session.round.deserialize_rounds( custom_text );
			gio.gui.procs.unlock_controls();
			return;

		}else if( gio.input_mode === 'external_link' ) {

			wlink = $.trim( custom_text );
			var akey = gm.collection.ref.list.akey;

			var presc =
			{ 	coll	: true,
				env		: {	akey_advice : akey },
				link	: { link : wlink },
				list	: { title : "My Choice", chosen : true }
			};

			var downed_coll = gio.def.procs.download_scriptio (	presc );
			var success = !!downed_coll;

			if( success ) {
				var akey	= downed_coll.ref.list.akey;
				var cix		= downed_coll.ref.list.ix;
				var success = downed_coll.maps_loaded === 'success' ;
				if( success ) {
					var success = gio.navig.validate_coll_map( akey, cix, 0, 'do land' );
					if( !success ) gio.cons_add( "Failed landing on " + akey + ", " + ix );
				}else{
					gio.cons_add(	"No maps in collection ... perhaps are albums only ...\n" +
									"try to scroll to albums manually ... "							
					);
					//TODM do the scroll .... possibly use this: gdef.procs.get_preferred_album_def
				}
			}else{
				gio.cons_add( 'Failed custom scrith download for ' + wlink );
			}

			if( !success ) gio.gui.procs.do_display_curr_board( true );
			gio.gui.procs.unlock_controls();
			gio.input_mode='';
			return;

		}else if( gio.input_mode === 'map' ) {

			gio.add_map_text_and_land( custom_text );
			gio.navig.validate_coll_map( null, null, null, 'do_land' );
			gio.gui.procs.unlock_controls(); //only then clear it ...
			gio.input_mode='';

		}else{

			throw "Unknown editor mode"; //TODM improve
		}

	};	///	Multipurpose editor finalization subroutine



})(jQuery);
