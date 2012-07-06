(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	gio.style={
		edit_column_width	:200, //aux column right to the game 

		rootColor			:'#000000',
		backgroundColor		:'#EEEEEE',
		WINNING_COLOR		:'#111144',

		playboard			:{	widthMin			:500,	//TODm artificial, Do improve.
								zIndex				:10,
								corners				:{r:20}
							},


		captions			:{
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

		controls			:{
								boardWidth			:230,
								width				:200,

								restart				:{ width : 87, left : 0, slot : 2 },
								forward				:{ width : 110, left : 68, slot : 2 },
								back				:{ width : 88, left : 158, slot : 2},

								help				:{ width : 140, left : 0, slot : 3 },

								reset				:{ width : 90, left : 0, slot : 4 },
								newround			:{ width : 85, left : 70, slot : 4 },
								//rounds			:{ width : 90, left : 0, slot : 4 },

								bundle				:{ width : 130, left : 0, slot : 5 },
								autoplay			:{ width : 110, left : 140, slot : 5},

								edit				:{ width : 155, left : 0, slot : 6},


								buttonsFontWeight	:'normal',

								STATUS_LINE_HEIGHT	:30,
								PADDING_HORIZONTAL	:8,
								STATUS_LINE_PERIOD	:40, //be > padding+height
								PADDING				:0,
								fontSize			:'12',
								backgroundColor		:'transparent',
								color				:'#FFFFFF',
								zIndex	:1000000
							},

		popups				:{	zIndex				:1002000,
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

		messages			:{	zIndex				:1003000,
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

	gio.advertisement		={	distanceFromGame	:100
	};


})(jQuery);

