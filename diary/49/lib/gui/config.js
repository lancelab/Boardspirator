(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	gio.style={
		edit_column_width			:200, //aux column right to the game 

		rootColor					:'#000000',
		backgroundColor				:'#EEEEEE',
		WINNING_COLOR				:'#111144',

		playboard					:{widthMin				:500,	//TODm artificial, Do improve.
									zIndex					:10
									},


		captions					:{
										height				:110,
										width				:500,
										fontSize			:25,
										fontStyle			:'italic',
										fontFamily			:'arial, helvetica',
										gameHeight			:40,
										collectionHeight	:30,
										mapHeight			:30,
										gaps				:2,
										subcaptionWidth		:100,
										bgColor				:'#000000',
										zIndex				:1001000,
										gameTitleColor 		: '#FFFFFF'
									},

		controls					:{
										boardWidth			:230,
										width				:200,
										helpWidth			:90,

										rulesWidth			:90,
										rulesLeft			:70,
										aboutWidth			:90,
										aboutLeft			:140,


										buttonsFontWeight	:'normal',

										STATUS_LINE_HEIGHT	:30,
										PADDING				:0,
										PADDING_HORIZONTAL	:8,
										fontSize			:'12',
										backgroundColor		:'transparent',
										color				:'#FFFFFF',
										zIndex	:1000000
									},

		popups						:{	zIndex				:1002000,
										help				:{
																owner:'help',
																position:'fixed',
																width:600,
																height:500,
																backgroundColor:'#335533',
																color:'#FFFFFF'
															},

										about				:{
																owner:'about',
																width:1000,
																height:1000,
																backgroundColor:'#332200',
																color:'#FFFFFF'
															}
									},

		messages					:{	zIndex				:1003000,
										padding				:'5px',
										paddingLeft			:'10px',
										width				:'300px',
										height				:'40px',
										fontSize			:'23px',
										fontFamily			:'Arial, Helvetica',
										textAlign			:'center',
										backgroundColor		:'#FFFFDD'
									}
	};

	gio.advertisement				={
										distanceFromGame	:100
	};


})(jQuery);

