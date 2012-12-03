(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};


	gio.config.style={

		rootColor			:'#000000',
		backgroundColor		:'#EEEEEE',
		WINNING_COLOR		:'#111144',

		playboard			:{	widthMin			:580,	//TODm artificial, Do improve.
								zIndex				:10,
								corners				:{r:20}
							},

		top_left_pane		:{	height				:40,
								left 				:10,
								top					:0
							},
		top_navig			:{	left 				: 0,
								top					: 0,
								height				: 25,
								link_style 			:	'style="text-decoration:none; color:#5555FF; font-family:Helvetica, Arial; '+
														'font-size:10px; font-weight:bold;"'
							},

		captions			:{
								height				:137,
								width				:580,
								fontSize			:25,
								fontStyle			:'italic',
								fontFamily			:'arial, helvetica',
								gameHeight			:40,
								collectionHeight	:30,
								dressHeight			:20,
								mapHeight			:30,
								gaps				:2,
								subcaptionWidth		:100,
								bgColor				:'#000000',
								zIndex				:1001000,
								gameTitleColor 		: '#FFFFFF'
							},

		controls			:{
								boardWidth			:240,
								width				:200,

								restart				:{ width : 87, left : 0, slot : 2 },
								forward				:{ width : 110, left : 68, slot : 2 },
								back				:{ width : 88, left : 158, slot : 2},

								help				:{ width : 140, left : 0, slot : 3 },

								reset				:{ width : 90, left : 0, slot : 4 },
								newround			:{ width : 85, left : 62, slot : 4 },
								rounds				:{ width : 109, left : 119, slot : 4 },

								bundle				:{ width : 130, left : 0, slot : 5 },
								autoplay			:{ width : 110, left : 140, slot : 5},

								edit				:{ width : 225, left : 0, slot : 6},
								solver_control		:{ width : 150, left : 0, slot : 7},

								save_or_load		:{ width : 170, left : 0, slot : 8},

								buttonsFontWeight	:'normal',

								STATUS_LINE_HEIGHT	:30,
								chaser_upshift_lim  :2,		// in units if status line height
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
														position: 'fixed', //'absolute',
														top: 20,
														width:500,
														height:400,
														backgroundColor:'#335533',
														color:'#FFFFFF'
													},

								about				:{
														owner:'about',
														position: 'absolute', //'fixed', // apparently independent from 'help'
														top: 20,
														width:500,
														height:500,
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
							},
		console				:{	

								horizontal_gap				: 28, //between consoles for scroll bars
								vertical_gap				: 20, //between consoles for scroll bars

								wrapper						: {
										width				: 290,
										height				: 340,
										overflow			: 'visible',
										backgroundColor		: 'transparent',
										color				: '#FFFFFF',
										visibility			: 'visible',
										fontSize			: 10
										//zIndex				: 1000000 //TODm rid?
								},
				
								common						: {
										color				: '#EEEEEE',
										paddingLeft			: 10,
										paddingRight		: 10,
										overflow			: 'auto',
										fontSize			: 10
								},

								playvigation				: {
										top					: 0,
										width				: 260,
										height				: 150,
										backgroundColor		: '#113311'
								},
								generic 					: {
										top					: 110,
										width				: 260,
										height				: 150,
										backgroundColor		: '#111133'
								},
								solver						: {
										top					: 320,
										width				: 560,
										height				: 150,
										backgroundColor		: '#220022'
								},
								debug						: {
										top					: 530,
										height				: 300,
										backgroundColor		: '#331111',
										visibility			: 'hidden',
										display				: 'none'
								}
							}


	};


})(jQuery);

