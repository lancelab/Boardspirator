(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	// Purpose: initiates handlers for events which have meaning only after startup2.
	//			This is why these handlers are wrapped inside following function:





	gio.gui.init.control_events=function(){


		//====================================================
		//destroy all interfering events
		//----------------------------------------------------
			//selection
			$(gio.domwrap.regions.dcenter).css({
	                   '-moz-user-select':'none',
	                   '-webkit-user-select':'none',
	                   'user-select':'none'
	               }).each(this.onselectstart=function(){return false;}); //for IE
			//why this fails?:
			//document.ondragstart=function(){return false;};
		//====================================================



		tp.bindEvents('click', function(){
			if(!gio.gui.modes.common_popup_shown){
				return true;
			}
			//close popups by click
			gio.domwrap.popups.help_div.style.visibility = 'hidden'; 
			gio.domwrap.popups.about_div.style.visibility = 'hidden'; 
			return true;
		});



		// Sugar:	keyboard shortcut Ctrl+d to avoid mouse click when saving text-job.
		// TODm Do think. This sugar takes extra effort. Do we need it?
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
			gio.domwrap.popups.input_text_popup.popup_el
		);




		tp.bindEvents('keydown', function(a){

			//////////////////////////////////////////////////
			// Always available events
			//================================================
			if(a.keyName === 'escape' && !a.event.altKey && !a.event.ctrlKey){	//cancellator:
					if(gio.modes.play==='autoplay')gio.modes.play='';
					gio.domwrap.popups.help_div.style.visibility = 'hidden'; 
					gio.domwrap.popups.about_div.style.visibility = 'hidden'; 
					if(gio.domwrap.popups.input_text_popup.isVisible()){
						gio.map_editors.hide_text_editor();
					}
			}

			if(a.keyName === 'question' || a.keyName === 'h' ){
					if(gio.input_mode !== '' ) return true;
					gio.gui.procs.toggle_help();
					return !!a.event.ctrlKey; //allow native browser help
			}
			//================================================
			// Always available events
			//////////////////////////////////////////////////




			//////////////////////////////////////////////////
			// Game related popups
			//================================================
			if(	gio.gui.modes.controls_locked ||
				a.event.altKey || a.event.ctrlKey ||
				gio.domwrap.popups.input_text_popup.isVisible() // TODO redundancy with gio.gui.modes.controls_locked. Must be redesigned.
			)return true;

			var w;
			var gs		= gio.getgs();
			var gm		= gs.gm;
			var plgam	= gm.game;
			var dress	= gm.dresses_wrap.chosen_dress;


			switch(a.keyName){
				case 'a':
					gio.gui.procs.toggle_about_pane();
					return false;
				case 'x':
					gio.gui.procs.toggle_about_map_pane();
					return false;
				case 'y':
					gio.common_popup.dotoggle({
						owner:'help',
						innerHTML:"<pre>The Story:\n\n"+dress.story+'</pre>'
					});
					return false;

				case 'e':
					gio.map_editors.edit_custom_maps();
					return false;
				case 'w':
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
			var plalb		= gs.plalb;
			var collection	= gs.collection;
			var gm			= gs.gm;
			var len			= gio.playalbs.length;

			if(a.event.ctrlKey){
				if(a.arrow){ //select unit
					if(a.event.shiftKey){
						return gio.navig.in_map.scroll_colony(a.keyName); //breed
					}else{
						return gio.do_one_scroll_of_unit_in_colony(a.keyName); //unit
					}
				}else if(a.keyName==='space'){
					gio.navig.in_map.back_forward_start('back');
					return false
				}
				return true;
			}

			switch(a.keyName){

				case 'g':	//game
					if(len===1)return true;
					gio.gui.procs.hide_current_board();
					gio.game_ix=(gio.game_ix+1)%len;
					gio.scroll_till_valid_game();
					return false;

				case 'l':	//collection
					w=plalb.collections;
					if(w.length===1)return true;
					gio.gui.procs.hide_current_board();
					w.ix=(w.ix+1)%w.length;

					gio.gui.procs.lock_controls('Switching collection ... ');
					gio.scroll_till_non_failed_collection(w);
					gio.gui.procs.unlock_controls();

					return false;

				case 'p':	//map
					w = (collection.map_ix+1)%collection.maps.length;
					gio.navig.do_land_to_map(collection, w)
					return false;

				case 'o': 	//round
					var rr=gm.rounds;
					rr.ix=(rr.ix+1)%rr.length;
					break;
				case 'n':	//new round
					gio.navig.in_session.round.init_round(gm);
					gio.gui.reset_rounds_select_el();
					break;
				case 's':	//to start
					gio.gui.procs.do_manage_round(null,'to beginning');
					break;
				case 'u':	//unit
					return gio.do_one_scroll_of_unit_in_colony(a.keyName);
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
			var gm=gio.getgs().gm;
			if(gm)gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		});
		$(window).scroll(function(event){
			var gm=gio.getgs().gm;
			if(gm){
				if(!gio.common_popup.isVisible()){ //TODm q&d buttons interfere with "info"
					gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
				}
			}
		});
		//===========================================





		//setup title selection-callback
		//c onsole.log('setting up title callback, when setting events ...');
		gio.domwrap.headers.title_select_el.reset({r:{
			callback:function(selected_ix,selected_game){
				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				//gio.gui.modes.controls_locked=true;
				//c onsole.log('game title selected. selected_ix='+selected_ix);
				gio.gui.procs.hide_current_board();
				gio.gui.procs.lock_controls('Initiating a game ...');


				gio.game_ix=selected_ix;
				if(gio.scroll_till_valid_game()){
					//gio.gui.modes.controls_locked=false;
					gio.gui.procs.unlock_controls();
					return gio.game_ix;
				}else{
					return -1; //disprove
				}
			}
		}});


		// ======================================
		// Collection init for selection el.
		// ======================================
		gio.domwrap.headers.collection_select_el.reset({r:{
			callback:function(selected_ix,selected_collection){
				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				//gio.gui.modes.controls_locked=true;
				gio.gui.procs.hide_current_board();
				gio.gui.procs.lock_controls('Initiating a map ...');
				gio.getgs().colls.ix = selected_ix;

				if(gio.scroll_till_valid_game()){
					//gio.gui.modes.controls_locked=false;
					gio.gui.procs.unlock_controls();
					return gio.getgs().colls.ix;
				}else{
					return -1; //disprove
				}
			}
		}});

		//set up map selection-callback
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

				//c onsole.log('map selected. selected_ix='+selected_ix);
				gio.navig.do_land_to_map(collection, selected_ix)
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
				gio.gui.procs.refresh();

				//c onsole.log('map selected. selected_ix='+selected_ix);
				//gio.navig.do_land_to_map(collection, selected_ix)

				gio.gui.procs.unlock_controls();
				//return nothing, ignore.
			}
		}});

	};//...control_events



	gio.gui.init.step_events=function()
	{
		// Move acting unit
		tp.bindEvents('keydown', function(arg){

			//brute solution: forbid everything ... good and bad if in transit: ...
			if(gio.gui.modes.controls_locked)return true;

			//no controlling and playing when common popups are on:
			if(gio.common_popup.isVisible())return true;

			if(	arg.event.ctrlKey || arg.event.shitKey ||
				arg.event.altKey )return true;
			var mkey=arg.keyName;
			if(!arg.arrow){
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
					default	:	return true;
				}
			}

			gio.gui.procs.move_acting_unit(mkey);
			return false;
		});
	}; //...step_events





})(jQuery);
