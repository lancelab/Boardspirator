(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};
					//	header-time-execution


	// The purpose of this file is to prepare handlers which
	// are common for button-click or key-strike control events.



	var allowOnlyFFChromeOperaIE=function(){
		if( !tp.core.browser.FireFox &&
			!tp.core.browser.Chrome &&
			!tp.core.browser.Opera &&
			!tp.core.browser.IE){
			alert('This feature is enabled only in FireFox, Chrome, Opera, or Internet Explorer.');		
			return false;
		}
		return true;
	};


	gio.display_game_path=function(){
			var w;
			if(!allowOnlyFFChromeOperaIE()) return;
			gio.lock_controls('Displaying a path');
			gio.input_mode='path';
			gio.show_text_editor();
			//gio.input_text_popup.show();
			w=$(gio.input_text_popup.popup_el).children('textarea')[0];
			w.value=gio.path2text_current();
			w.focus();
	};


	gio.edit_custom_maps=function(){

		if(!allowOnlyFFChromeOperaIE()) return

		var game, collection, gm;
		gio.gst(function(g,c,m){  game=g; collection=c, gm=m;	});
		gio.lock_controls('Creating custom maps collection ... ');

		gio.input_mode = 'map';
		gio.show_text_editor();

		if(game.links && game.links.length > 0){
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
		var textarea=$(gio.input_text_popup.popup_el).children('textarea')[0];
		textarea.value =	(collection.colorban_map ? gio.colorban_maps_decoder.colorban_maps_flag +"\n" : '') +
							tp.core.htmlencode(gm.raw_board) + "\n" +
							tp.core.htmlencode(gm.raw_comments) + "\n";
		textarea.focus();
	};


	// Auxiliary
	gio.hide_text_editor=function(dont_unlock){
			gio.links_to_external_collections.wrapper.style.display='none';
			gio.text_editor_closing_button.wrapper.style.display='none';
			gio.text_editor_done_button.wrapper.style.display='none';
			gio.input_text_popup.hide();
			if(!dont_unlock)gio.unlock_controls();
	};

	// Auxiliary
	gio.show_text_editor=function(){
		if(gio.input_mode !== 'path'){
			gio.links_to_external_collections.wrapper.style.display='block';
		}
		gio.text_editor_done_button.wrapper.style.display='block';
		gio.text_editor_closing_button.reset({c:{gui:{style:{wrapper:{display:'block'}}}}});
		gio.input_text_popup.show();
	};


	// Auxiliary
	gio.load_from_text_editor=function(){
		//c onsole.log('done...');

		var w;
		var game=gio.games[gio.game_ix];
		var collection=game.collections[game.collections.ix];
		var gm=collection.maps[collection.map_ix];

		if(gm.board)gm.board.style.display='none';

		var custom_text = $(gio.input_text_popup.popup_el).children('textarea')[0].value;


		////////////////////////////////////////////////////////////////////////////////////////////////
		//TODOnon-critical FF adds extra empty lines. We made a ureliable potection. Need to improve it.
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

		gio.hide_text_editor('don`t unlock controls');

		if(gio.input_mode==='path'){
			gio.text2round(custom_text);
			//TODm fails. why?:
				//gio.unlock_controls();
				//gio.draw_scene();
				//gio.draw_status();	
		}else{
			gio.load_custom_collection(custom_text); //TODm assumed: at least one valid collection exists:
		}
		w=gio.scroll_till_non_failed_collection(game.collections);
		if(w)gio.unlock_controls(); //only then clear it ...
		gio.input_mode='';
	};//gio.load_from_text_editor=function

})(jQuery);
