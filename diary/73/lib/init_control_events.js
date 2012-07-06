(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	// Purpose: initiates handlers for events which have meaning only after startup2.
	//			This is why these handlers are wrapped inside following function:

	gio.init_control_events=function(){

		//====================================================
		//destroy all interfering events
		//----------------------------------------------------

			//selection
			$(gio.board).css({
	                   '-moz-user-select':'none',
	                   '-webkit-user-select':'none',
	                   'user-select':'none'
	               }).each(this.onselectstart=function(){return false;}); //for IE
	
			//keyboard extras
			//$(document).bind('keyup', function(e){ return e.keyCode!==9; });
			//$(document).bind('keypress', function(e){ return e.keyCode!==9; });
	
			//why this fails?:
			//document.ondragstart=function(){return false;};
		//----------------------------------------------------
		//destroy all interfering events
		//====================================================

		tp.bindEvents('click', function(){
			if(!gio.aux.common_popup_shown){
				//c onsole.log('not destroying popup by click event. gio.aux.help_popup_shown='+gio.aux.common_popup_shown);
				return true;
			}
			//close popups by click
			//c onsole.log('destroying popup by click event. gio.aux.help_popup_shown='+gio.aux.common_popup_shown);
			gio.help_div.style.visibility = 'hidden'; 
			gio.about_div.style.visibility = 'hidden'; 
			//gio.cons_div.style.visibility = 'hidden'; 
			return true;
		});


		tp.bindEvents('keydown', function(a){

			if(!a.event.ctrlKey || !gio.input_text_popup.isVisible())return true; //pass event

			switch(a.keyName){
				case 'd':	//done with custom maps
					gio.load_from_text_editor();
					return false;
				}
				return true;
			},
			gio.input_text_popup.popup_el
		);//tp.bindEvents('keydown', function(a){


		tp.bindEvents('keydown', function(a){

			//////////////////////////////////////////////////
			// Always available events
			//================================================
			if(a.keyName === 'escape' && !a.event.altKey && !a.event.ctrlKey){	//cancellator:
					if(gio.play_mode==='autoplay')gio.play_mode='';
					gio.help_div.style.visibility = 'hidden'; 
					gio.about_div.style.visibility = 'hidden'; 
					if(gio.input_text_popup.isVisible()){
						gio.hide_text_editor();
					}
			}

			if(a.keyName === 'question' || a.keyName === 'h' ){
					gio.toggle_help();
					return !!a.event.ctrlKey; //allow native browser help
			}
			//================================================
			// Always available events
			//////////////////////////////////////////////////




			//////////////////////////////////////////////////
			// Game related popups
			//================================================
			if(	gio.initiating_a_game_flag ||
				a.event.altKey || a.event.ctrlKey ||
				gio.input_text_popup.isVisible()
			)return true;

			var w;
			var game, collection, gm;
			gio.gst(function(g,c,m){  game=g; collection=c, gm=m;	});


			switch(a.keyName){
				case 'a':
					gio.toggle_about_pane();
					return false;
				case 'x':
					gio.toggle_about_map_pane();
					return false;
				case 'y':
					gio.common_popup.dotoggle({
						owner:'help',
						innerHTML:"<pre>The Story:\n\n"+game.story+'</pre>'
					});
					return false;

				case 'e':
					gio.edit_custom_maps();
					return false;
				case 'w':
					gio.display_game_path();
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
			if(gio.initiating_a_game_flag)return true;

			//no controlling and playing when common popups are on:
			if(gio.common_popup.isVisible())return true;

			var w;

			var len=gio.games.length;
			var game=gio.games[gio.game_ix];
			var collection=game.collections[game.collections.ix];
			var gm=collection.maps[collection.map_ix];

			if(a.event.ctrlKey){
				if(a.arrow){ //select unit
					if(a.event.shiftKey){
						return gio.select_colony(a.keyName); //breed
					}else{
						return gio.scrolling_units(a.keyName); //unit
					}
				}else if(a.keyName==='space'){
					gio.do_record(null,'forward');
					gio.draw_scene();
					gio.draw_status();
					return false
				}
				return true;
			}

			switch(a.keyName){

				case 'g':	//game
					if(len===1)return true;
					if(gm.board)gm.board.style.display='none';
					gio.game_ix=(gio.game_ix+1)%len;
					gio.scroll_till_non_failed_game();
					return false;
				case 'l':	//collection
					w=game.collections;
					if(w.length===1)return true;
					if(gm.board)gm.board.style.display='none';
					w.ix=(w.ix+1)%w.length;

					gio.lock_controls('Switching collection ... ');
					w=gio.scroll_till_non_failed_collection(w);
					if(w)gio.unlock_controls(); //only then clear it ...

					return false;

				case 'p':	//map

					//TODO protect from load. rethink the design
					if(collection.maps.length===1)return true;
					if(gm.board)gm.board.style.display='none';
					collection.map_ix=(collection.map_ix+1)%collection.maps.length;
					gio.reinit_or_create_div_board_and_pos();
					gio.map_select_el.reset_choice(collection.map_ix);
					return false;

				case 'o': 	//round
					var rr=gm.rounds;
					rr.ix=(rr.ix+1)%rr.length;
					break;
				case 'n':	//new round
					gio.init_round(gm);
					break;
				case 's':	//to start
					gio.do_record(null,'to beginning');
					break;
				case 'u':	//unit
					return gio.scrolling_units(a.keyName);
				case 't':	//tribe-type-breed-colony
					return gio.select_colony('right');
				case 'backspace':
				case 'space':
				case 'b':	//backmove
					gio.do_record(null,'back');
					break;
				case 'f':	//forward
					gio.do_record(null,'forward');
					break;
				case 'z':	//lazy autoplay
					gio.play_mode='autoplay';
					gio.autoplay(300);
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
			var gm=gio.posIsInitiated();
			if(gm)gio.adjustDispositionsByBrowserWindow(gm);
		});
		$(window).scroll(function(event){
			var gm=gio.posIsInitiated();
			if(gm){
				if(!gio.common_popup.isVisible()){ //TODm q&d buttons interfere with "info"
					gio.adjustDispositionsByBrowserWindow(gm);
				}
			}
		});
		//===========================================



		//setup title selection-callback
		//c onsole.log('setting up title callback, when setting events ...');
		gio.title_select_el.reset({r:{
			callback:function(selected_ix,selected_game){
				if(gio.common_popup.isVisible())return -1;
				if(gio.initiating_a_game_flag)return -1;

				//gio.initiating_a_game_flag=true;
				//c onsole.log('game title selected. selected_ix='+selected_ix);
				hide_current_board();
				gio.lock_controls('Initiating a game ...');


				gio.game_ix=selected_ix;
				if(gio.scroll_till_non_failed_game()){
					//gio.initiating_a_game_flag=false;
					gio.unlock_controls();
					return gio.game_ix;
				}else{
					return -1; //disprove
				}
			}
		}});

		//set up collection selection-callback
		gio.collection_select_el.reset({r:{
			callback:function(selected_ix,selected_collection){
				if(gio.common_popup.isVisible())return -1;
				if(gio.initiating_a_game_flag)return -1;

				//gio.initiating_a_game_flag=true;
				hide_current_board();
				gio.lock_controls('Initiating a map ...');


				var game=gio.games[gio.game_ix];
				game.collections.ix=selected_ix;


				if(gio.scroll_till_non_failed_game()){
					//gio.initiating_a_game_flag=false;
					gio.unlock_controls();
					game=gio.games[gio.game_ix];
					return game.collections.ix;
				}else{
					return -1; //disprove
				}
			}
		}});

		//set up map selection-callback
		gio.map_select_el.reset({r:{
			callback:function(selected_ix,selected_map){
				if(gio.common_popup.isVisible())return -1;
				if(gio.initiating_a_game_flag)return -1;

				gio.lock_controls('Initiating a map ...');

				var game=gio.games[gio.game_ix];
				var collection=game.collections[game.collections.ix];
				if(collection.maps.length<2){
					gio.unlock_controls();
					return null; //ignore
				}

				//c onsole.log('map selected. selected_ix='+selected_ix);
				hide_current_board();

				var game=gio.games[gio.game_ix];
				var collection=game.collections[game.collections.ix];
				collection.map_ix=selected_ix;
				gio.reinit_or_create_div_board_and_pos();
				gio.unlock_controls();
				//return nothing, ignore.
			}
		}});

	};//gio.init_control_events
	
	// Auxiliary
	var hide_current_board=function(){
		gio.gst(function(g,c,m){  if(m.board)m.board.style.display='none'; 	});
	};

})(jQuery);
