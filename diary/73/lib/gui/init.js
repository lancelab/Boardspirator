(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


		// This is a master space allocator for controls and playboard.
		// When it is done, gui/init_controls may run.

		//Here is a main divs tree created finally: for landscape mode:
		//
		//tree=gio.root_div
		//	->gio.board_wrap, pos=relative
		//		->gio.left_top_div - ? links to external sites
		//		->gio.captions_div_wrap pos=abs
		//		->gio.board. abs. b e l o w   c a p t i o n s. left = 0. top=c.height.
		//			->gm.board (=playboard) (is special for each map) top=0.
		//					set in init_map: left~=gio.style.controls.boardWidth>0
		//					//centered below is misleading: 
		//					//it is somewhere in "the middle of vertical dimension":
		//			->gio.centered_control_subboard left=0. top is dynamic, next to playing spot of map ...
		//					-> buttons, compelte-conrol-setup, status?				
		//						moves, status, unit, game
		//			->gio.cons_div top: dynamic, left: dynamic

		//For portrait mode, left-side controls are moved below the game board ...

	//create master divs
	gio.init_gui=function(){
		var w, ww;

		//remove JS waring which pollutes the body:
		var to_remove=tp.core.matchChild(/^\s*Game/i,document.body);
		if(to_remove){
			//fails in Safary and ?Android:
			//document.body.removeChild(to_remove);
			to_remove.style.display='none';
		}

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



		gio.setControlsByWindowShape=function(){
			var w,ww;
			var outsiders=gio.left_top_div;

			if(window.innerHeight < window.innerWidth){

				// captions above game board
				gio.captions_div_wrap.style.left=gio.style.controls.boardWidth+'px';


				//gio.left_top_div for external links
				var ws=outsiders.style;
				outsiders.style.display='block';
				ws.height=gio.style.captions.height+'px';
				ww=gio.top_left_board_links;
				ws.left	=ww.board.left;
				ws.top	=ww.board.top;



			}else{
				// captions above game board
				gio.captions_div_wrap.style.left='0px';
				//gio.left_top_div for external links
				outsiders.style.display='none';
			}
		};



		//========================================
		// gio.left_top_div for external links 
		//----------------------------------------
			w=gio.left_top_div=document.createElement('div');
			w.style.position='absolute';
			w.style.zIndex = gio.style.captions.zIndex;
			ww=gio.top_left_board_links;
			w.innerHTML=ww.innerHTML.replace(/#%style%#/g,ww.style);
			gio.board_wrap.appendChild(w);
		//========================================


		//========================================
		// captions area: title, collection, map
		//----------------------------------------
			//Append game title:
			w=gio.captions_div_wrap=document.createElement('div');

			//debug:
			//w.setAttribute('id','captions_div_wrap_debug');

			w.style.position='absolute';
			ws=w.style;
			ws.zIndex = gio.style.captions.zIndex;
			ws.top='0px';
			ws.height=gio.style.captions.height+'px';
			gio.board_wrap.appendChild(w);
		//========================================



		//========================================
		//game board
		//----------------------------------------
		gio.board=document.createElement('div');
		
		gio.board.setAttribute('id', 'gio_board_debug');

		gio.board.style.position = 'absolute';
		gio.board.style.zIndex = gio.style.playboard.zIndex;
		gio.board.style.top = gio.style.captions.height+'px';
		gio.board.style.left = 0+'px';
		// dynamic, set here to enable this property only: //TODm not good.
		gio.board.style.height = '200px';
		gio.board_wrap.appendChild(gio.board);
		//========================================



		//========================================
		// control area
		//----------------------------------------
		w=gio.centered_control_subboard=document.createElement('div');
		w.style.position = 'absolute';

		gio.board.setAttribute('id', 'centered_control_subboard_debug');

		w.style.left = '0px';
		w.style.zIndex = gio.style.controls.zIndex;
		//w.style.top = gio.style.captions.height+'px';
		w.style.backgroundColor=gio.style.controls.backgroundColor;
		w.style.color=gio.style.controls.color;
		gio.board.appendChild(w);
		//==================================



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
					backgroundColor:'#558855',
					innerHTML:	"<textarea style=\"position:relative; left:15px; top:50px; "+
								" width:565px; height:210px;\">::Input or Copy-Paste Map or Collection of Maps here\n</textarea>"
		});
		//TODm: style. tp.core.rpaste(w.popup_el.style,gio.style.messages);
		w.popup_el.style.zIndex=3000000;
		tp.gui.cornerize(gio.style.playboard.corners,w.popup_el);
		/*
			//These stubs can be used also:
			//w=tp.core.matchChild(/Input Map/i,w.popup_el); //w=text area now
		$(ww).after(gio.links_to_external_collections['wrapper']);
		tp.gui.cornerize(gio.style.playboard.corners,ww);
		*/

		gio.links_to_external_collections=tp.form.create_select_el({c:{
				gui:{	wmax:410,
						ddbox_backgroudColor:'#DDDDDD',
						style:{wrapper:{display:'none', top:'15px', left:'15px'}}}}
		});
		

		w=gio.input_text_popup;
		w.popup_el.appendChild(gio.links_to_external_collections['wrapper']);		

		var constyle=gio.style.controls;
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : 'Close',
								tooltip : 'Close and cancel your edit'
							}],
				callback :	gio.hide_text_editor
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'15px', left:'530px',
												fontFamily	: constyle.fontFamily
											},
								display:	{	fontSize	: constyle.fontSize+'px',
												fontStyle	: constyle.fontStyle,
												fontWeight	: constyle.buttonsFontWeight,
												color		: constyle.color
											}

						}
					}
			}
		};

		gio.text_editor_closing_button=tp.form.create_select_el(button_arg);
		button_arg.r=
			{	parent :	w.popup_el,
				options :	[{	title : 'Done',
								tooltip : 'Load your work and close editor'
							}],
				callback :	gio.load_from_text_editor
			},
		button_arg.c.gui.style.wrapper.left='460px';
		gio.text_editor_done_button=tp.form.create_select_el(button_arg);
		//==================================
		//Create input text popup:
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
				//ws.left='0px';
				//ws.top=gio.style.controls.STATUS_LINE_HEIGHT*5+'px';
				//ws.width='100%';
				//ws.height='100%';
				ws.paddingLeft='10px';
				ws.paddingRight='10px';
				ws.backgroundColor=gio.style.controls.backgroundColor;			
				ws.color=gio.style.controls.color;
				ws.zIndex=gio.style.controls.zIndex;			
				ws.visibility='hidden';
				//gio.centered_control_subboard.appendChild(w);
				gio.board.appendChild(w);

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
