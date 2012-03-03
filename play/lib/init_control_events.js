(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	gio.init_control_events=function()
	{

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


		tp.bindEvents('keydown', function(a)
		{
			if(!a.event.ctrlKey || !gio.input_text_popup.isVisible())return true; //pass event

			switch(a.keyName){
				case 'z':	//cancel
					gio.links_to_external_collections['wrapper'].style.display='none';
					gio.input_text_popup.hide();
					gio.unlock_controls();
					break;
				case 'd':	//done with custom maps
					//c onsole.log('done...');

					var w;
					var game=gio.games[gio.game_ix];
					var collection=game.collections[game.collections.ix];
					var gm=collection.maps[collection.map_ix];

					if(gm.board)gm.board.style.display='none';

					var custom_text = $(gio.input_text_popup.popup_el).children('textarea')[0].value;


					////////////////////////////////////////////////////////////////////////////////////////////////
					//TODO all of this protection ... from copy-paste extra lf insertion is non-reliable. Do fix.
					//Hell: only FF can do this this way?:
					//custom_text=custom_text.replace("\n\n","\n",'g');

					//var w='#-+x<>';
					//custom_text=custom_text.split("\n").join(w).replace('/'+w+w+'/g',"\n").replace(/#-+x<>/,"\n");

					w=custom_text.split("\n");
					custom_text='';
					for(var ii=0; ii<w.length; ii++){
						if(!(ii%2) || w[ii]) custom_text+=w[ii]+"\n";
					}

					/*
					//debug
					var tt='';
					for(var ii=0; ii<custom_text.length; ii++){
						var cc=custom_text.charAt(ii);
						tt += ' '+ii+'-'+custom_text.charCodeAt(ii);
						if(cc==="\n")tt +="\n";
					}
					//c onsole.log(tt);
					*/
					////////////////////////////////////////////////////////////////////////////////////////////////

					gio.links_to_external_collections['wrapper'].style.display='none';
					gio.input_text_popup.hide();

					if(gio.input_mode==='path'){
						gio.text2round(custom_text);
						//TODm fails. why?:
							//gio.unlock_controls();
							//gio.draw_scene();
							//gio.draw_status();	
					}else{
						gio.load_custom_collection(custom_text); //TODm assumed: at least one valid collection exists:
					}
					w=gio.init_until_non_failed_collection(game.collections);
					if(w)gio.unlock_controls(); //only then clear it ...
					gio.input_mode='';
					return false;
			}
			return true;
		},gio.input_text_popup.popup_el);


		tp.bindEvents('keydown', function(a)
		{

			//////////////////////////////////////////////////
			// Always available events
			//================================================
			if(a.keyName === 'escape' && !a.event.altKey && !a.event.ctrlKey){	//cancellator:
					if(gio.play_mode==='autoplay')gio.play_mode='';
					gio.help_div.style.visibility = 'hidden'; 
					gio.about_div.style.visibility = 'hidden'; 
					if(gio.input_text_popup.isVisible()){
						gio.links_to_external_collections['wrapper'].style.display='none';
						gio.input_text_popup.hide();
						gio.unlock_controls();
					}
					//gio.cons_div.style.visibility = 'hidden'; 
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
					w = gm.raw_comments ? "\nMap Comments:\n"+
						gm.raw_comments+"\n\n" : '';
					w=tp.core.pre2html(w);
					w += "<pre>\nMap Text:\n"+
						tp.core.htmlencode(gm.raw_board)+"\n\n</pre>";
					gio.common_popup.dotoggle({owner:'map_comments', innerHTML:w});
					return false;
				case 'y':
					gio.common_popup.dotoggle({
						owner:'help',
						innerHTML:"<pre>The Story:\n\n"+game.story+'</pre>'
					});
					return false;

				case 'c':	//create custom maps
					gio.lock_controls('Creating custom collection ... ');
					gio.input_text_popup.show();
					if(game.links){
						gio.links_to_external_collections.reset(
							{r:{
								options				:game.links
							},
							c:{	
								choice_ix			:0
							}}
						);
						gio.links_to_external_collections['wrapper'].style.display='block';
					}
					$(gio.input_text_popup.popup_el).children('textarea')[0].focus();
					return false;
				case 'w':
					gio.lock_controls('Displaying a path');
					gio.input_mode='path';
					gio.input_text_popup.show();
					w=$(gio.input_text_popup.popup_el).children('textarea')[0];
					w.value=gio.path2text_current();
					w.focus();
					return false;
			}
			//================================================
			// Game related popups
			//////////////////////////////////////////////////
			return true;
		});


		//handle many keystrokes and arrows
		tp.bindEvents('keydown', function(a)
		{

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
						return gio.selecting_unit(a.keyName); //unit
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
				case 'e':	//play/edit
					len=gio.modes.length;
					gm.mode_ix=(gm.mode_ix+len+1)%len;
					gio.skip_inactive_colony(gm,'right');
					break;
				case 'g':	//game
					if(len===1)return true;
					if(gm.board)gm.board.style.display='none';
					gio.game_ix=(gio.game_ix+1)%len;
					gio.init_until_non_failed_game();
					return false;
				case 'l':	//collection
					w=game.collections;
					if(w.length===1)return true;
					if(gm.board)gm.board.style.display='none';
					w.ix=(w.ix+1)%w.length;

					gio.lock_controls('Switching collection ... ');
					w=gio.init_until_non_failed_collection(w);
					if(w)gio.unlock_controls(); //only then clear it ...

					return false;

				case 'p':	//map

					//TODO protect from load. rethink the design
					if(collection.maps.length===1)return true;
					if(gm.board)gm.board.style.display='none';
					collection.map_ix=(collection.map_ix+1)%collection.maps.length;
					gio.do_init_game_map();
					gio.map_select_el.reset_choice(collection.map_ix);
					return false;

				case 'o': 	//round
					var rr=gm.rounds;
					rr.ix=(rr.ix+1)%rr.length;
					break;
				case 'n':	//new round
					gio.init_round();
					break;
				case 'r':	//reset
					gio.init_round('reset this round');
					break;
				case 's':	//to start
					gio.do_record(null,'to beginning');
					break;
				case 'u':	//unit
					return gio.selecting_unit(a.keyName);
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
				if(gio.init_until_non_failed_game()){
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


				if(gio.init_until_non_failed_game()){
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
				gio.do_init_game_map();
				gio.unlock_controls();
				//return nothing, ignore.
			}
		}});
	};//gio.init_control_events


	gio.toggle_about_pane = function(){
		if(gio.initiating_a_game_flag)return;

		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];

		var gm=collection.maps[collection.map_ix];
		var about = 	"Credits:\n"+game.credits+"\n\n"+
						"Engine:\n";
		tp.core.each(gio.Description, function(k,v){
			about += '    '+k+': '+v+"\n";
		});
		if(collection.file_header){about +=
			"\nOriginal File Header or Credits:\n"+tp.core.htmlencode(collection.file_header);
		}
		gio.common_popup.dotoggle({owner:'about', innerHTML:'<pre>'+about+'</pre>'});
		gio.prolong_common_popup();
	};

	gio.select_colony=function(pointer){
		gio.virtual_select_colony();
		gio.draw_scene();
		gio.draw_status();
		return false;				
	};

	gio.selecting_unit=function(pointer)
	{
			var direction = isNaN(pointer) ? pointer : '';

			var game=gio.games[gio.game_ix];
			var collection=game.collections[game.collections.ix];
			var gm=collection.maps[collection.map_ix];

			var round=gm.rounds[gm.rounds.ix];
			var pos=round.pos;
			var colony_ix=pos.colony_ix;
			var punits=pos[colony_ix];
			var ulen=punits.length;
			var key=direction;

			var ix=punits.selected;
			if(key==='left' || key==='up')
			{
				ix=(ulen+ix-1)%ulen;
			}else{
				ix=(ulen+ix+1)%ulen;
			}
			punits.selected=ix;
			gio.draw_scene();
			gio.draw_status();
			return false;
	};

	var hide_current_board=function(){
		gio.gst(function(g,c,m){  if(m.board)m.board.style.display='none'; 	});
	};

})(jQuery);
