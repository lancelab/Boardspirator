(function( $ ){ 	var tp	=	$.fn.tp$  =  $.fn.tp$ || {};	
					var gio	=	tp.gio    =  tp.gio   || {};
					var med	=	gio.map_editors;


	// The purpose of this file is to prepare handlers which
	// are common for button-click or key-strike control events.




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


	// Game designer helper
	med.display_albums=function(){
		var w;
		gio.gui.procs.lock_controls('Displaying albums');
		gio.input_mode = 'albums';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="albums=\n" + JSON.stringify( gio.def.albums, null, '\t');
		w.focus();
	};

	med.display_collections=function(){
		var w;
		gio.gui.procs.lock_controls('Displaying collections');
		gio.input_mode = 'collections';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="collections=\n" + gio.core.reflection.serialize_collections();
		w.focus();
	};

	med.display_game_defs=function(){
		var w;
		gio.gui.procs.lock_controls('Displaying Game Definitions');
		gio.input_mode = 'game_defs';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="game_definitions=\n" + gio.core.reflection.serialize_game_defs();
		w.focus();
	};

	med.display_base_game_inherited_def=function(){
		var w;
		gio.gui.procs.lock_controls('Displaying Base Game Definition');
		gio.input_mode = 'basegame_def';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="Basegame definition=\n" + gio.core.reflection.serialize_basegame_def();
		w.focus();
	};



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



	/// pops up textarea and populates it with current map script
	//	for further map redesign
	med.submit_box_to_enter_collection_link = function () {

		//if(!tp.core.allow_non_mainstream_browser()) return

		var gs=gio.getgs();
		var game=gs.gm.game;

		gio.gui.procs.lock_controls('Preparing to enter link for external collection ... ');

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


	// Auxiliary
	med.hide_text_editor=function(dont_unlock){
			gio.domwrap.wraps.links_to_external_collections.wrapper.style.display='none';
			med.text_editor_closing_button.wrapper.style.display='none';
			med.text_editor_done_button.wrapper.style.display='none';
			gio.domwrap.popups.input_text_popup.hide();
			if(!dont_unlock)gio.gui.procs.unlock_controls();
	};

	// Auxiliary
	med.show_text_editor=function(dont_show_done){
		if(gio.input_mode === 'map'){
			gio.domwrap.wraps.links_to_external_collections.wrapper.style.display='block';
		}
		if(!dont_show_done) med.text_editor_done_button.wrapper.style.display='block';
		med.text_editor_closing_button.reset({c:{gui:{style:{wrapper:{display:'block'}}}}});
		gio.domwrap.popups.input_text_popup.show();
	};



	// Auxiliary
	med.load_from_text_editor=function(){ 	// TODO the scenario of this function became clumsy and unclear. Do refresh it.

		var w;
		var gs = gio.getgs();
		var gm = gs.gm;

		gio.gui.procs.hide_current_board();

		var custom_text = $(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0].value;

		med.hide_text_editor('don`t unlock controls');

		if(gio.input_mode === 'path'){

			gio.input_mode='';
			gio.gui.procs.inject_path_from_text(custom_text, 'do_messagify');
			gio.gui.procs.unhide_current_dom_board();
			return;

		}else if( gio.input_mode === 'rounds' ) { 
			gio.input_mode='';
			// * this may change the game and collection
			gio.navig.in_session.round.deserialize_rounds(custom_text);
			gio.gui.procs.unlock_controls();
			return;

		}else if( gio.input_mode === 'external_link' ) {
			// Now, state is: gio.input_mode = 'map'  // TODm make gio.session.dmodes.input gio.session.smodes.db

			custom_text = $.trim( custom_text );

			var akey = gm.collection.lkey;
			var new_collection = gio.def.procs.attach_external_collection (	custom_text, akey );
			if( new_collection ) {
					gio.navig.select_album_and_collection(
						new_collection.lkey,
						new_collection.coll_ix,
						0
					);
			}else{
				gio.cons_add( 'Faild download collection url = ' + custom_text );
			}

			gio.gui.procs.unlock_controls(); //only then clear it ...
			gio.input_mode='';
			return;
		}

		// Now, state is: gio.input_mode = 'map'  // TODm make gio.session.dmodes.input gio.session.smodes.db
		gio.load_custom_collection(custom_text);
		gio.navig.select_album_and_collection();
		gio.gui.procs.unlock_controls(); //only then clear it ...
		gio.input_mode='';
	};//gio.load_from_text_editor=function

})(jQuery);
