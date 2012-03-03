(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



		//Here is a main divs tree created finally:
		//
		//tree=gio.root_div
		//	->gio.board_wrap, pos=relative
		//		->gio.captions_div_wrap pos=abs
		//		->gio.board  r i g h t   b e l o w   c a p t i o n s
		//			->gm.board (=playboard) (is special for each map) top=0, left>0
		//			->gio.centered_control_subboard left=0. top is dynamic, next to playing spot of map ...
		//					-> buttons, compelte-conrol-setup, status?				
		//						moves, status, unit, game
		//					->cons_div. top: top includes controls ... game-heights




	//create master divs
	gio.init_gui=function()
	{

		//remove JS waring which pollutes the body:
		var to_remove=tp.core.matchChild(/^\s*Game/i,document.body);
		if(to_remove)document.body.removeChild(to_remove);



		////////////////////////////////////
		// centered root
		//==================================
		var root_div= gio.root_div=document.createElement('div');
		root_div.style.margin = 'auto';
		document.body.style.backgroundColor = gio.style.rootColor;
		document.body.appendChild(root_div);
		////////////////////////////////////




		////////////////////////////////////////
		// control and playboard
		//======================================
		//wrapper for playarea board and captions
		gio.board_wrap=document.createElement('div');
		gio.board_wrap.style.position = 'relative';
		root_div.appendChild(gio.board_wrap);



		////////////////////////////////////////
		//playboard
		gio.board=document.createElement('div');
		gio.board.style.position = 'absolute';
		gio.board.style.zIndex = gio.style.playboard.zIndex;
		gio.board.style.top = gio.style.captions.height+'px';
		gio.board_wrap.appendChild(gio.board);
		////////////////////////////////////////




		//////////////////////////////////////////
		// captions area: title, collection, map
		//========================================
			//Append game title:
			w=gio.captions_div_wrap=document.createElement('div');
			w.style.position='absolute';
			ws=w.style;
			ws.zIndex = gio.style.captions.zIndex;
			ws.top='0px';
			ws.height=gio.style.captions.height+'px';
			ws.left=gio.style.controls.boardWidth+'px';
			gio.board_wrap.appendChild(w);
		///////////////////////////////////////////





		////////////////////////////////////
		// control area
		//==================================
		var w=gio.centered_control_subboard=document.createElement('div');
		w.style.position = 'absolute';
		w.style.zIndex = gio.style.controls.zIndex;
		//w.style.top = gio.style.captions.height+'px';
		w.style.backgroundColor=gio.style.controls.backgroundColor;
		w.style.color=gio.style.controls.color;
		gio.board.appendChild(w);
		//==================================
		// control area
		////////////////////////////////////



		////////////////////////////////////
		//Create common popup:
		////////////////////////////////////
		w=gio.common_popup=tp.core.single_popup_manager(gio.style.popups.help);
		ws=w.popup_el.style;
		ws.paddingLeft='10px';
		ws.fontSize='12px';
		ws.fontFamily='Arial, Helvetica';
		ws.zIndex=gio.style.popups.zIndex;			



		////////////////////////////////////
		//Create message popup:
		//==================================
		w=gio.modal_message_popup=tp.core.single_popup_manager({owner:'modal'});
		tp.core.rpaste(w.popup_el.style,gio.style.messages);

		//lock and show message:
		gio.lock_controls=function(msg){
			gio.initiating_a_game_flag=true;
			gio.modal_message_popup.show({innerHTML: (msg || '')});
		};
		gio.unlock_controls=function(){
			gio.initiating_a_game_flag=false;
			gio.modal_message_popup.hide();
		};
		////////////////////////////////////

		////////////////////////////////////
		//Create input text popup:
		//==================================
		w=gio.input_text_popup=tp.core.single_popup_manager({
					owner:'input_text',
					width:400,
					height:300,
					innerHTML: '<textarea style="width:400px; height:250px;"></textarea>'
		});
		w.popup_el.style.zIndex=3000000;



		//stub: $(gio.input_text_popup.popup_el).children('textarea')[0]
		//TODO: style. tp.core.rpaste(w.popup_el.style,gio.style.messages);

		////////////////////////////////////



		if(!gio.blinker)gio.blinker=tp.core.blinker();
		gio.init_gui_controls_and_game_list();
	};


})(jQuery);
