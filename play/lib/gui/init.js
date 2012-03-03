(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



		//Here is a main divs tree created finally:
		//
		//tree=gio.root_div
		//	->gio.board_wrap, pos=relative
		//		->gio.left_top_div
		//		->gio.captions_div_wrap pos=abs
		//		->gio.board  r i g h t   b e l o w   c a p t i o n s
		//			->gm.board (=playboard) (is special for each map) top=0.
		//					set in init_map: left~=gio.style.controls.boardWidth>0
		//					//centered below is misleading: 
		//					//it is somewhere in "the middle of vertical dimension":
		//			->gio.centered_control_subboard left=0. top is dynamic, next to playing spot of map ...
		//					-> buttons, compelte-conrol-setup, status?				
		//						moves, status, unit, game
		//					->cons_div. top: top includes controls ... game-heights



	//create master divs
	gio.init_gui=function()
	{

		var w, ww;

		//remove JS waring which pollutes the body:
		var to_remove=tp.core.matchChild(/^\s*Game/i,document.body);
		if(to_remove)document.body.removeChild(to_remove);


		if(leave_if_user_declined_browser())return false;


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
		//gio.board.setAttribute('id', 'gio_board_debug');

		gio.board.style.position = 'absolute';
		gio.board.style.zIndex = gio.style.playboard.zIndex;
		gio.board.style.top = gio.style.captions.height+'px';

		gio.board_wrap.appendChild(gio.board);
		////////////////////////////////////////



		//////////////////////////////////////////
		// gio.left_top_div for external links 
		//========================================
			//Append game title:
			w=gio.left_top_div=document.createElement('div');
			w.style.position='absolute';
			ws=w.style;
			ws.zIndex = gio.style.captions.zIndex;
			ws.height=gio.style.captions.height+'px';

			ww		=gio.top_left_board_links;			
			ws.left	=ww.board.left;
			ws.top	=ww.board.top;
			w.innerHTML=ww.innerHTML.replace(/#%style%#/g,ww.style);

			gio.board_wrap.appendChild(w);
		///////////////////////////////////////////




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
		w=gio.centered_control_subboard=document.createElement('div');
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
		////////////////////////////////////

		////////////////////////////////////
		//Create input text popup:
		//==================================
		w=gio.input_text_popup=tp.core.single_popup_manager({
					owner:'input_text',
					width:600,
					height:300,
					backgroundColor:'#555555',
					innerHTML:	"<textarea style=\"position:relative; left:10px; top:10px; "+
								" width:580px; height:250px;\">::Input or Copy-Paste Map or Collection of Maps here\n</textarea>"
		});
		w.popup_el.style.zIndex=3000000;
		gio.links_to_external_collections=tp.form.create_select_el({c:{
				gui:{	wmax:580,
						ddbox_backgroudColor:'#DDDDDD',
						style:{wrapper:{display:'none', top:'15px', margin:'auto'}}}}});
		
		//These stubs work also:
		//ww=tp.core.matchChild(/Input Map/i,w.popup_el); //w=text area now
		//$(ww).after(gio.links_to_external_collections['wrapper']);
	
		w.popup_el.appendChild(gio.links_to_external_collections['wrapper']);		

		//stub: $(gio.input_text_popup.popup_el).children('textarea')[0]
		//TODO: style. tp.core.rpaste(w.popup_el.style,gio.style.messages);

		////////////////////////////////////


		if(!gio.blinker)gio.blinker=tp.core.blinker();


		//////////  //Make all-purpose console:  ///////////////////////
		(function(){ 
			var STATUS_LINE_HEIGHT=gio.style.controls.STATUS_LINE_HEIGHT;
			var PADDING=gio.style.controls.PADDING;
			var PADDING_HORIZONTAL=gio.style.controls.PADDING_HORIZONTAL;

			var w,ws;
				w=document.createElement('div');
				w.style.position='absolute';
				ws=w.style;
				ws.left='0px';
				ws.top=gio.style.controls.STATUS_LINE_HEIGHT*5+'px';
				//ws.width='100%';
				//ws.height='100%';
				ws.paddingLeft='10px';
				ws.paddingRight='10px';
				ws.backgroundColor=gio.style.controls.backgroundColor;			
				ws.color=gio.style.controls.color;
				ws.zIndex=gio.style.controls.zIndex;			
				ws.visibility='hidden';
				gio.centered_control_subboard.appendChild(w);

				gio.cons_div=w;
				w.style.visibility='visible';
		})();

		return true;
	};



	//=============================================================
	// recommend or leave if insufficient browser declined by user
	//=============================================================
	var leave_if_user_declined_browser=function(){
		var getout=false;
		var version_barrier;
		var message='The '+gio.Description.Title+' was not designed for ';
		var recommendation='FireFox, Chrome, or Internet Explorer 9+ are recommended';
		var recommendation_standard='FireFox, Chrome, CSS standard, or mutually compatible browsers are recommended';
		var question='Continue on your own risk?';

		if($.browser.msie){
			version_barrier=7;
			//c onsole.log($.browser.version,'  ',parseInt($.browser.version,10));
			if(parseInt($.browser.version,10)<=version_barrier){
				message += ' Internet Explorer version '+$.browser.version+".\n"+
							recommendation+".\n"+question;
				getout=!confirm(message);
			} 	//else{
				//	alert(recommendation_standard + ' for ' + gio.Description.Title+'.');
				//}
		}else if(tp.core.browser.Opera){
				alert(recommendation_standard + '. Opera will run with simple laoyout.');
		}
		return getout;
	};


	//=========================================
	// create game's focuser
	//=========================================
	gio.create_game_focuser=function(game){
		var w=game.focuser_img=document.createElement('img');
		var width=game.tile.width*4/3;
		var height=game.tile.height*4/3;
		w.src='lib/gui/img/focuser.png';
		w.width=width;
		w.height=height;
		w.style.position='absolute';
		var ws=w.style;
		if( tp.core.browser.FireFox ){
			ws.left=(-width*1/10)+'px';
			ws.top=(-height*1/10)+'px';
		}else{
			ws.left=(-width*1/8)+'px';
			ws.top=(-height*1/8)+'px';
		}
		ws.zIndex=gio.style.playboard.zIndex+999000; //on top of every tile
		//do not append yet to anyone ...
	};






})(jQuery);
