(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	gio.style={
		edit_column_width			:200, //aux column right to the game 
		ad_column_width				:0,
		rootColor					:'#000000',
		DEFAULT_BACKGROUND_COLOR	:'#EEEEEE',
		CONTROL_BACKGROUND			:'#000000',
		CONTROL_COLOR				:'#FFFFFF',
		WINNING_COLOR				:'#111144',

		CONTROL_BOARD_WIDTH			:300,
		TITLE_BOARD_HEIGHT			:50,
		TITLE_BOARD_WIDTH			:500,
		TITLE_FONT_SIZE				:20,
		TITLE_FONT_STYLE			:'italic',
		MAX_ZINDEX					:2000000,

		controls					:{
										MAX_ZINDEX:1000000,
										STATUS_LINE_HEIGHT:30,
										PADDING:0,
										PADDING_HORIZONTAL:8
									},
		help_popup					:{
										owner:'help',
										width:600,
										height:400,
										backgroundColor:'#335533',
										color:'#FFFFFF'
									},

		about_popup					:{
										owner:'about',
										width:1000,
										height:1000,
										backgroundColor:'#332200',
										color:'#FFFFFF'
									}


	};



})(jQuery);

