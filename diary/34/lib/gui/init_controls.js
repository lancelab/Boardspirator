
(function( $ ){
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};

	gio.style={
		edit_column_width			:200,
		ad_column_width				:0,
		rootColor					:'#000000',
		DEFAULT_BACKGROUND_COLOR	:'#EEEEEE',
		CONTROL_BACKGROUND			:'#000000',
		CONTROL_COLOR				:'#FFFFFF'
	}
	var MAX_ZINDEX=1000000;
	var STATUS_LINE_HEIGHT=25;
	var PADDING=8;

	var help = gio.help =
		"Keyboard Control:\n"+
		"h,?,ctrl+h,ctrl+?      help\n"+
		"g                      games\n"+
		"o                      rounds\n"+
		"r/n                    reset/new round\n"+
		"t, ctrl+shitf+arrows   unit types\n"+
		"u, ctrl+arrows         units\n"+
		"p                      play/edit\n"+
		"b,backspace            move back\n"+
		"arrows,j,k,i,m         move a unit\n"+
		"a                      about and credits\n";

	gio.init_gui_controls =	function()
	{
			var gm=gio.games[gio.game_ix];
			var w,ws;


			//Create common popup:
			w=gio.common_popup=tp.core.single_popup_manager({
					owner:'common',
					backgroundColor:gio.style.CONTROL_BACKGROUND,
					color:gio.style.CONTROL_COLOR
			});
			ws=w.popup_el.style;
			ws.paddingLeft='10px';
			ws.zIndex=MAX_ZINDEX;			


			//Append game status:
			w=gio.mode_div=document.createElement('div');
			do_complete_control(w,0,0);

			//Append round status:
			w=gio.round_div=document.createElement('div');
			do_complete_control(w,180,0);


			//Append unit status:
			w=gio.status_div=document.createElement('div');
			do_complete_control(w,300,0);

			//Append winning report:
			w=gio.report_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT+2*PADDING);

			//Append moves:
			w=gio.moves_div=document.createElement('div');
			do_complete_control(w,180,STATUS_LINE_HEIGHT+2*PADDING);

			//Append help:
			gio.common_popup.update_owner({
				owner:'help',
				width:1000,
				height:800,
				innerHTML:'<pre>'+help+'</pre>'
			});
			gio.help_div=gio.common_popup.popup_el;


			//In-play console:
			w=gio.console_div=aux_setup_help_screens();
			w.style.visibility='visible';
			w.style.zIndex=MAX_ZINDEX-1;			
			w.style.top=STATUS_LINE_HEIGHT*2+4*PADDING+'px';

			//Append about:
			gio.common_popup.update_owner({
				owner:'about',
				width:1000,
				height:800
			});
			gio.about_div=gio.common_popup.popup_el;
	};

	var do_complete_control=function(w,left,top){
		w.style.position='absolute';
		ws=w.style;
		ws.height=STATUS_LINE_HEIGHT+'px';
		ws.left=left+'px';
		ws.top=top+'px';
		ws.padding=PADDING+'px';
		ws.backgroundColor=gio.style.CONTROL_BACKGROUND;			
		ws.color=gio.style.CONTROL_COLOR;			
		gio.control_subboard.appendChild(w);
	};

	var aux_setup_help_screens=function(){
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
			gio.control_subboard.appendChild(w);
			return w;
	};



})(jQuery);

