
( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gde		=  gio.domwrap.elems;
					var gdr		=  gio.domwrap.regions;
					var ggp		=  gio.gui.procs;


	// //\\// 	Initiates handlers for events which have meaning at the end of "Master Entry"
	//			This is why these handlers are wrapped inside function "gio.gui.init.control_events"
	//			defined below.




	// ***	Input:	setting: 'text' or 'none'
	//		Note:	ignores outdated IE version ... sorry not time for IE fixes
	gio.gui.procs.reset_web_text_selection_appearance = function( div, setting ){
			return $(div).css({
				'-moz-user-select' : setting,
				'-webkit-user-select ' : setting,
				'-ms-user-select' : setting,
				'-khtml-user-select' : setting,
				'user-select' : setting
			});

		// * failed way:
		//gio.gui.procs.reset_web_text_selection_appearance(gio.domwrap.regions.dcenter, 'none');
		// * allows selection on c o n s o l e s
		//gio.gui.procs.reset_web_text_selection_appearance(gde.con_div, 'text');
		//gio.gui.procs.reset_web_text_selection_appearance(gde.con_div_child, 'text');

		// what is this?: each(this.onselectstart=function(){return false;}); //for IE
		// why this fails?:
		// document.ondragstart=function(){return false;};

	};




	///	is called at finalizing  of core/entry.js
	gio.gui.init.control_events=function(){

		// **	destroys all interfering events
		//		it's hard to reselect ... since doing selective unselect div by div:
		var ww = gio.gui.procs.reset_web_text_selection_appearance;
		ww(	gde.chaser, 'none');
		ww(	gdr.dtopleft, 'none');
		ww(	gdr.dtopcenter, 'none');
		ww(	gdr.dsubtop, 'none');
		ww(	gde.playvig_cons, 'none');


		
		tp.bindEvents('click', function(){

			/// Accomplishes poorly designed scenario:
			//		when popup is being shown by click, the same click may close it,
			//		to avoid immediate close, modes.common_popup_shown is "falsely" set to false
			//		which is detected below and closing action is skipped ...
			//		Then, because modes.common_popup_shown = true is set in setTimeout,
			//		the true "true" status is restored and popup is kept open until a "true-closing" click.
			//		See: 	ggp.prolong_common_popup=function(){ in core/gui/procs.js
			if(!gio.gui.modes.common_popup_shown){
				return true;
			}

			//close popups by click
			gio.domwrap.popups.hide_common();
			return true;
		});
		


		/// Sugarifies:	proven to be a good helper:
		//				keyboard shortcut Ctrl+d to avoid mouse click when saving text-job.
		tp.bindEvents(
			'keydown',
			function(a){
				if(!a.event.ctrlKey || !gio.domwrap.popups.input_text_popup.isVisible())return true; //pass event
				switch(a.keyName){
					case 'd':	//done with custom maps
						gio.map_editors.load_from_text_editor();
						return false;
					}
					return true;
			},
			//. is attachee of the handler
			gio.domwrap.popups.input_text_popup.popup_el
		);




		tp.bindEvents('keydown', function(a){


			//: Always available events
			if(a.keyName === 'escape' && !a.event.altKey && !a.event.ctrlKey){	//cancellator:
					if(gio.modes.play==='autoplay')gio.modes.play='';
					gio.domwrap.popups.hide_common();
					//gio.domwrap.popups.help_div.style.visibility = 'hidden'; 
					//gio.domwrap.popups.about_div.style.visibility = 'hidden'; 
					if(gio.domwrap.popups.input_text_popup.isVisible()){
						gio.map_editors.hide_text_editor();
					}
			}
			if(a.keyName === 'question' || a.keyName === 'h' ){
					if( gio.input_mode ) return true;
					gio.gui.procs.toggle_help();
					return !!a.event.ctrlKey; //allow native browser help
			}





			//////////////////////////////////////////////////
			// Game related popups
			//================================================
			if(	gio.gui.modes.controls_locked ||
				a.event.altKey || a.event.ctrlKey ||
				gio.domwrap.popups.input_text_popup.isVisible() // TODm redundancy with gio.gui.modes.controls_locked. Must be redesigned.
			)return true;

			var w;
			var gs		= gio.getgs();
			var gm		= gs.gm;
			if(gm.load	!== 'finalized') return true;


			switch(a.keyName){

				case 'c':	//credits

					if( a.event.shiftKey ) {
						gio.gui.procs.toggle_about_pane();
						return false;
					}
					return true;

				case 'a':

					if( a.event.shiftKey ) {
						gio.gui.procs.toggle_about_map_pane();
						return false;
					}
					return true;

				case 's':

					if( a.event.shiftKey ) {
						gio.gui.procs.show_story();
						return false;
					}
					return true;

				case 'r':

					if( !a.event.shiftKey ) {
						gio.gui.procs.show_rules();
						return false;
					}
					return true;


				case 'o':

					if( !a.event.shiftKey ) {
						gio.gui.procs.show_objective();
						return false;
					}
					return true;


				case 't':
					if(gm.load	!== 'finalized') return true;
					gio.map_editors.edit_custom_maps();
					return false;

				case 'p':
					if(gm.load	!== 'finalized') return true;
					gio.map_editors.display_game_path();
					return false;
			}
			//================================================
			// Game related popups
			//////////////////////////////////////////////////
			return true;
		});//tp.bindEvents('keydown', function(a){






		//handle many keystrokes and arrows
		tp.bindEvents('keydown', function(a){

			//brute solution: forbid everything ... good and bad if in transit: ...
			if(gio.gui.modes.controls_locked)return true;

			//no controlling and playing when common popups are on:
			if(gio.common_popup.isVisible())return true;

			var w;
			var gs			= gio.getgs();

			var gs		= gio.getgs();
			var gm		= gs.gm;
			if(gm.load	!== 'finalized') return true;
			var gs		= gio.getgs();

			var album		= gs.playalb;
			var collection	= gs.collection;
			var gm			= gs.gm;
			var len			= gio.session.alist.length;

			if(a.event.ctrlKey){
				if(a.arrow){ //select unit
					if(a.event.shiftKey){
						return gio.navig.in_map.scroll_colony(a.keyName); //breed
					}else{
						return ggp.do_one_scroll_of_unit_in_colony(a.keyName); //unit
					}
				}else if(a.keyName==='space'){
					gio.navig.in_map.back_forward_start('back');
					return false
				}
				return true;
			}

			// * permits events like bookmarks: Alt+b ...
			if(a.event.altKey) return true;

			switch(a.keyName){


				case 'a':	//album

					if( !a.event.shiftKey ) {
						if(len===1)return true;
						gio.gui.procs.do_display_curr_board( false );
						var w_aix = ( gio.session.state.album_ix + 1 ) % len;
						gio.gui.procs.scroll_till_valid_album( w_aix, 'do_land' );
						return false;
					}
					return true;


				case 'c':	//collection

					if( !a.event.shiftKey ) {

						var w_colls = album.collections;
						if( w_colls.length === 1 ) return true;

						gio.gui.procs.do_display_curr_board( false );
						gio.domwrap.headers.collection_select_el.close();
						gio.domwrap.headers.map_select_el.close();

						w_colls_ix = ( w_colls.ix + 1 ) % w_colls.length;
						gio.gui.procs.scroll_till_valid_coll( w_colls_ix, w_colls, 'do_land' );

						//gio.draw_scene(); //TODO rid
						//gio.draw_status(); //TODO rid

						return false;
					}
					return true;

				case 'm':	//map

					if( a.event.shiftKey ) {
						var w_mix = ( collection.map_ix + 1 ) % collection.maps.length;
						gio.navig.do_land_to_map( collection, w_mix );
						return false;
					}
					return true;


				case 'd': 	//round
					var rr=gm.rounds;
					rr.ix=(rr.ix+1)%rr.length;
					gio.gui.reset_rounds_select_el();
					break;

				case 'n':	//new round
					gio.navig.in_session.round.init_round(gm);
					gio.gui.reset_rounds_select_el();
					break;

				case 's':	//to start
					if( !a.event.shiftKey ) {
						gio.gui.procs.do_manage_round(null,'to beginning');
						break;
					}
					return true;
	
				case 'e':	//to end
					if( !a.event.shiftKey )
					{
						gio.navig.in_map.move_till_condition( 'do redraw GUI' );
						break;
					}
					return true;
	
				case 'u':	//unit
					return ggp.do_one_scroll_of_unit_in_colony(a.keyName);
				case 'space': //tribe-type-breed-colony
					return gio.navig.in_map.scroll_colony('right');
				case 'backspace': 
				case 'b':	//backmove
					gio.navig.in_map.back_forward_start('back');
					return false;
				case 'f':	//forward
					gio.navig.in_map.back_forward_start('forward');
					return false;
				case 'z':	//lazy autoplay
					gio.modes.play='autoplay';
					gio.navig.in_map.autoplay(300);
					break;
				default	: return true;
			}
			gio.draw_scene();
			gio.draw_status();
			return false;
		});//tp.bindEvents('keydown', function(a)




		//===========================================
		// TODm wrong place for these handlers.
		// But we don't have auxilairy place yet:
		$(window).resize(function(event){
			if(!gio.modes.app_loaded) return;
			var gm=gio.getgs().gm;
			gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		});
		$(window).scroll(function(event){
			if(!gio.modes.app_loaded) return;
			var gm=gio.getgs().gm;
			if(!gio.common_popup.isVisible()){ //TODm q&d buttons interfere with "info"
					gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
			}
		});
		//===========================================





		//setup title selection-callback
		//c onsole.log('setting up title callback, when setting events ...');
		gio.domwrap.headers.title_select_el.reset( 
			{	r:
				{
					callback : function( selected_ix, selected_game ) {

									if( gio.common_popup.isVisible() ) return -1;
									if( gio.gui.modes.controls_locked ) return -1;

									gio.gui.procs.do_display_curr_board( false );

									gio.config.google_apps.track.variable( 'Album Selected', selected_game.key );
		
									if( gio.gui.procs.scroll_till_valid_album( selected_ix, 'do_land' ) ) {
										return gio.session.state.album_ix;
									}else{
										return -1; //disprove
									}
					}
				}
			}
		);




		/// Resets collection_select_el
		gio.domwrap.headers.collection_select_el.reset({r:{
			callback:function(
					selected_ix,
					selected_collection,
					dummy_select_el,
					event
			){

				var dontload = event && event.originalEvent.target && event.originalEvent.target.getAttribute('class');
				if( dontload === 'dontload_external' ) {
						// c onsole.log('not going to fire select element ');
						return -1;
				}

				/*
					// ** works but too restrictive
					var try_to_load = event.originalEvent.target && event.originalEvent.target.innerHTML;
					try_to_load = try_to_load && try_to_load.toLowerCase() === 'try to load';
					if(!try_to_load) return -1;
				*/

				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				var success = gio.navig.validate_coll_map(  null, selected_ix, null, 'do_land'  );

				//. return -1 to disprove
				return ( success ? gio.getgs().colls.ix : -1 ); 
			}
		}}); /// Resets collection_select_el





		/// sets up map selection-callback
		gio.domwrap.headers.map_select_el.reset({r:{
			callback:function(selected_ix,selected_map){
				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				gio.gui.procs.lock_controls('Initiating a map ...');

				var collection = gio.getgs().coll;
				if(collection.maps.length<2){
					gio.gui.procs.unlock_controls();
					return null; //ignore
				}
				gio.navig.do_land_to_map( collection, selected_ix );

				gio.gui.procs.unlock_controls();
				//return nothing, ignore.
			}
		}});



		// ======================================
		// Dresses init for selection el
		// ======================================
		gio.domwrap.headers.dress_select_el.reset(  {r:{

			callback:function(selected_ix, dress_el){

				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				gio.gui.procs.lock_controls('Initiating a dress ...');

				var gm = gio.getgs().gm;

				if(gm.dresses_wrap.arr.length<2){
					gio.gui.procs.unlock_controls();
					return null; //ignore
				}

				gm.dresses_wrap.chosen_ix = selected_ix;
				gm.dresses_wrap.chosen_dress = dress_el.dress;

				gio.gui.reskinnify_board();
				gio.gui.procs.draw_status_and_scene();

				gio.gui.procs.unlock_controls();
				//return nothing, ignore.
			}
		}});

	};//...control_events



	// **	these gui key-stroke-events is a beginning point
	//		to fire unit move processing scenarios
	gio.gui.init.step_events=function()
	{
		// Move acting unit
		tp.bindEvents('keydown', function(arg){

			//brute solution: forbid everything ... good and bad if in transit: ...
			if(gio.gui.modes.controls_locked)return true;

			//no controlling and playing when common popups are on:
			if(gio.common_popup.isVisible())return true;

			/// solver events
			var gs = gio.getgs();

			if( gs.gm.solver.browser_mode && arg.event.shiftKey ) {
				switch(arg.keyName){
					case 'up':
								gio.gui.procs.move_acting_unit(null, 'to end');
								return false;
					case 'down':	
								gio.gui.procs.move_acting_unit(null, 'to beginning');
								return false;
				}
			}



			if(	arg.event.ctrlKey || arg.event.shiftKey ||
				arg.event.altKey )return true;
			var mkey=arg.keyName;
			if( !arg.arrow ){
				switch(arg.keyName){
					case 'i':	mkey=-2;
								break;
					case 'j':	mkey=-1;
								break;
					case 'k':	mkey=1;
								break;
					case 'm':	mkey=2;
								break;
					default	:	return true;
				}
			}else{
				switch(arg.keyName){
					case 'up':		mkey=-2;
									break;
					case 'left':	mkey=-1;
									break;
					case 'right':	mkey=1;
									break;
					case 'down':	mkey=2;
									break;
					//. stub
					case 'pagedown'	: 
									return true;
					//. stub
					case 'pageup'	: 
									return true;
					default	:	return true;
				}
			}

			gio.gui.procs.move_acting_unit(mkey);
			return false;
		});
	}; //...step_events





})(jQuery);
