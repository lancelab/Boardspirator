(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};



	//create master divs
	gio.init_gui=function()
	{


		//tree=gio.root_div->gio.board->gm.board (is special for each game)
		//                            ->gio.control_subboard



		////////////////////////////////////
		// centered root
		//==================================
		var root_div= gio.root_div=document.createElement('div');
		root_div.style.margin = 'auto';
		document.body.style.backgroundColor = gio.style.rootColor;
		document.body.appendChild(root_div);
		////////////////////////////////////




		////////////////////////////////////
		// control and play area
		//==================================
		//gio.board
		gio.board=document.createElement('div');
		gio.board.style.position = 'relative';
		root_div.appendChild(gio.board);
		////////////////////////////////////



		////////////////////////////////////
		// control area
		//==================================
		//gio.control_subboard
		var w=gio.control_subboard=document.createElement('div');
		w.style.position = 'fixed';
		w.style.top = gio.style.TITLE_BOARD_HEIGHT+'px';
		w.style.backgroundColor=gio.style.CONTROL_BACKGROUND;
		w.style.color=gio.style.CONTROL_COLOR;
		gio.board.appendChild(w);


		//gio.centered_control_subboard
		var w=gio.centered_control_subboard=document.createElement('div');

		//w.style.position = 'relative';
		//w.style.width='500px';
		//w.style.margin = 'auto';

		w.style.position = 'absolute';
		w.style.width='200px';

		w.style.backgroundColor=gio.style.CONTROL_BACKGROUND;
		w.style.color=gio.style.CONTROL_COLOR;
		gio.control_subboard.appendChild(w);
		//==================================
		// control area
		////////////////////////////////////


		if(!gio.blinker)gio.blinker=tp.core.blinker();
		gio.init_gui_controls();
	};


})(jQuery);
