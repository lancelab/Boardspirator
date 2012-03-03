
(function( $ ){
	var tp=$.fn.tp$ = $.fn.tp$ || {};	
	var gio=tp.gio = tp.gio || {};

	gio.modes=['play', 'edit'];

	gio.init_gui=function()
	{

		var root_div= gio.root_div=document.createElement('div');
		root_div.style.margin = 'auto';
		document.body.style.backgroundColor = gio.style.rootColor;
		document.body.appendChild(root_div);

		gio.board=document.createElement('div');
		gio.board.style.position = 'relative';
		root_div.appendChild(gio.board);

		//=========================================================
		// control board
		//---------------------------------------------------------
		var w=gio.control_subboard=document.createElement('div');
		w.style.position = 'absolute';
		w.style.backgroundColor=gio.style.CONTROL_BACKGROUND;
		w.style.color=gio.style.CONTROL_COLOR;
		gio.board.appendChild(w);
		//=========================================================

		if(!gio.blinker)gio.blinker=tp.core.blinker();
		gio.init_gui_controls();
	};


})(jQuery);
