(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.init_gui_controls =	function()
	{

		var MAX_ZINDEX=gio.style.controls.MAX_ZINDEX;
		var STATUS_LINE_HEIGHT=gio.style.controls.STATUS_LINE_HEIGHT;
		var PADDING=gio.style.controls.PADDING;
		var PADDING_HORIZONTAL=gio.style.controls.PADDING_HORIZONTAL;

		var w,ws;

		//////////////////////////////////
		// aux
		var do_complete_control=function(w,left,top){
			w.style.position='absolute';
			ws=w.style;
			ws.height=STATUS_LINE_HEIGHT+'px';
			ws.left=left+'px';
			ws.top=top+'px';
			ws.padding=PADDING+'px';
			ws.paddingRight=PADDING_HORIZONTAL+'px';
			ws.paddingLeft=PADDING_HORIZONTAL+'px';
			ws.backgroundColor=gio.style.CONTROL_BACKGROUND;			
			ws.color=gio.style.CONTROL_COLOR;
			gio.centered_control_subboard.appendChild(w);
			//gio.control_subboard.appendChild(w);
		};

		var setp_gio_cons=function(){
			w=document.createElement('div');
			w.style.position='absolute';
			ws=w.style;
			ws.left='0px';
			ws.paddingLeft='10px';
			ws.top='0px';
			ws.backgroundColor=gio.style.CONTROL_BACKGROUND;			
			ws.color=gio.style.CONTROL_COLOR;
			ws.zIndex=MAX_ZINDEX;			
			ws.visibility='hidden';
			gio.centered_control_subboard.appendChild(w);
			return w;
		};
		//================================
		// aux
		//////////////////////////////////



		//Create common popup:
		w=gio.common_popup=tp.core.single_popup_manager(gio.style.help_popup);
		ws=w.popup_el.style;
		ws.paddingLeft='10px';
		ws.zIndex=MAX_ZINDEX;			


			//=============================================================
			// title
			//-------------------------------------------------------------
			//Append game title:
			w=gio.title_div_wrap=document.createElement('div');
			w.style.position='absolute';
			ws=w.style;
			ws.height=gio.style.TITLE_BOARD_HEIGHT+'px';
			ws.left=gio.style.CONTROL_BOARD_WIDTH+'px';
			//ws.margin='0px';
			//ws.top=0+'px';
			gio.board.appendChild(w);

			w=gio.title_div=document.createElement('div');
			w.style.position='absolute';
			ws=w.style;
			ws.height=gio.style.TITLE_BOARD_HEIGHT+'px';
			ws.left=0+'px';
			ws.top=0+'px';
			ws.width=gio.style.TITLE_BOARD_WIDTH;
			ws.padding=PADDING+'px';
			//ws.paddingRight=PADDING_HORIZONTAL+'px';
			//ws.paddingLeft=PADDING_HORIZONTAL+'px';
			ws.backgroundColor=gio.style.CONTROL_BACKGROUND;			
			ws.color=gio.style.CONTROL_COLOR;
			ws.fontSize=gio.style.TITLE_FONT_SIZE;
			ws.textAlign='left';
			ws.fontStyle=gio.style.TITLE_FONT_STYLE;
			gio.title_div_wrap.appendChild(w);


			//Append map status:
			w=gio.map_div=document.createElement('div');

			w.style.position='absolute';
			ws=w.style;
			ws.height=STATUS_LINE_HEIGHT+'px';
			ws.left=0+'px';
			w.style.bottom=5+'px';
			ws.padding='0px'; //PADDING+'px';
			//ws.paddingRight=PADDING_HORIZONTAL+'px';
			//ws.paddingLeft=PADDING_HORIZONTAL+'px';
			//ws.backgroundColor=gio.style.CONTROL_BACKGROUND;			
			ws.color=gio.style.CONTROL_COLOR;
			//w.parentNode.removeChild(w); //TODO need?
			gio.title_div_wrap.appendChild(w);
			//-------------------------------------------------------------
			// title
			//=============================================================



			//Append winning report:
			w=gio.report_div=document.createElement('div');
			do_complete_control(w,0,0);





			//Append round status:
			w=gio.round_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*2+4*PADDING);


			//Append unit status:
			w=gio.status_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*3+6*PADDING);

			//Append game status:
			w=gio.mode_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*4+8*PADDING);

			//Append moves:
			w=gio.moves_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*5+10*PADDING);

			//Append help hint:
			w=gio.help_hint_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*6+12*PADDING);

			//Append info:
			w=gio.info_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*7+14*PADDING);


			//Append help:
			gio.common_popup.update_owner({
				owner:'help',
				innerHTML:'<pre>'+gio.help+'</pre>'
			});
			gio.help_div=gio.common_popup.popup_el;
			gio.help_div.style.position='fixed'; //TODO q&d

			//Append about:
			gio.common_popup.update_owner(gio.style.about_popup);
			gio.about_div=gio.common_popup.popup_el;

			//In-play console:
			w=gio.cons_div=setp_gio_cons();
			w.style.visibility='visible';
			w.style.zIndex=MAX_ZINDEX-1;			
	
	};

})(jQuery);

