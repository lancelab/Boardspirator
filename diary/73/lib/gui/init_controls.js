(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.init_gui_controls_and_game_list =	function(){

		var STATUS_LINE_HEIGHT=gio.style.controls.STATUS_LINE_HEIGHT;
		var STATUS_LINE_PERIOD=gio.style.controls.STATUS_LINE_PERIOD;
		var PADDING=gio.style.controls.PADDING;
		var PADDING_HORIZONTAL=gio.style.controls.PADDING_HORIZONTAL;

		var w,ww,ws;

		var gstyle=gio.style;
		var cstyle=gstyle.captions;
		var constyle=gstyle.controls;
		gio.controls={};

		//////////////////////////////////
		// aux
		var do_complete_control=function(w,left,top){
			w.style.position='absolute';
			ws=w.style;
			ws.height=STATUS_LINE_HEIGHT+'px';
			ws.left=left+'px';
			ws.top=top+'px';
			ws.width=gio.style.controls.width+'px';
			ws.padding=PADDING+'px';
			ws.paddingRight=PADDING_HORIZONTAL+'px';
			ws.paddingLeft=PADDING_HORIZONTAL+'px';
			ws.color=gio.style.controls.color;
			gio.centered_control_subboard.appendChild(w);
		};
		//////////////////////////////////




			//=============================================================
			// CAPTIONS AREA
			//-------------------------------------------------------------


			//Collection and Selection
			//No collections exist at this moment ...
			//c onsole.log('Creating sel. box: Collection and Selection ... No collections exist at this moment');

			ww=cstyle.collectionHeight+cstyle.gameHeight+cstyle.gaps*2,
			gio.map_select_el=tp.form.create_select_el(
					{r:{	parent	:gio.captions_div_wrap
					},
					c:{	gui		:{
									wmax:cstyle.width-cstyle.subcaptionWidth,
									hmin:cstyle.mapHeight,
									gradientDepth	:0.4,
									style:		{wrapper: 	{	position	:'absolute',
																left		:cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'15px',
																fontFamily	:cstyle.fontFamily
															}
												}
								}	
					}}
			);

			//Map caption:
			w=gio.map_caption_div=document.createElement('div');
			w.style.position='absolute';
			w.style.color='#FFFFFF';
			w.style.top=ww+Math.ceil(cstyle.mapHeight/3)+'px';
			w.style.fontFamily=cstyle.fontFamily;
			gio.captions_div_wrap.appendChild(w);
			w.innerHTML='Map';



			//Collection and Selection
			//No collections exist at this moment ...
			//c onsole.log('Creating sel. box: Collection and Selection ... No collections exist at this moment');
			ww=cstyle.gameHeight+cstyle.gaps;
			gio.collection_select_el=tp.form.create_select_el(
					{r:{	parent	:gio.captions_div_wrap
					},
					c:{	gui		:{
									wmax:cstyle.width-cstyle.subcaptionWidth,
									hmin:cstyle.collectionHeight,
									gradientDepth	:0.4,
									style:		{wrapper: 	{	position	:'absolute',
																left		:cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'15px',
																fontFamily	:cstyle.fontFamily
															}
												}
								}	
					}}
			);

			//Collection caption:
			w=document.createElement('div');
			w.style.position='absolute';
			w.style.color='#FFFFFF';
			w.style.top=ww+Math.ceil(cstyle.collectionHeight/3)+'px';
			w.style.fontFamily=cstyle.fontFamily;
			gio.captions_div_wrap.appendChild(w);
			w.innerHTML='Collection';



			//Game Title and Selection
			//c onsole.log('Creating sel. box. Game Title and Selection');
			gio.title_select_el=tp.form.create_select_el(
					{r:{	parent		:gio.captions_div_wrap,
						options		:gio.games
					},
					c:{	choice_ix		:gio.game_ix,
						gui:{	wmax:cstyle.width,
								hmin:cstyle.gameHeight,
								outColor				:'#888888',
								overColor				:'#CCCCCC',
								gradientDepth			:0.4,
								style:		{wrapper: 	{	position	:'absolute',
															left		:'0px',
															top			:'0px',
															fontSize	:'15px',
															fontFamily	:cstyle.fontFamily
														},
											display:	{	fontSize	:cstyle.fontSize+'px',
															fontStyle	:cstyle.fontStyle,
															fontWeight	:'bold',
															color		:cstyle.gameTitleColor
														}
											}
						}
					}}
			);
			//-------------------------------------------------------------
			// CAPTIONS AREA
			//=============================================================



			//====================================================
			// Local shortcut to create select or button element
			// Arg:	see call usage below
			//====================================================
			var makeSelectElement=function(arg){
				constyle=gstyle.controls;
				return select_el=tp.form.create_select_el(
					{r:{	parent		: arg.parent,			//gio.centered_control_subboard,
							options		: arg.options,			//[{	title:'Back',
																//		tooltip:'Revert move. Keys: Backspace or space.'
																//}],
							callback	:	function(i,option){
												arg.callback(i,option);	//gio.do_record(null,'back');
												if(arg.redraw_scene){
													gio.draw_scene();
													gio.draw_status();
												}
											}
					},

					c:{		choice_ix:0,
							gui:{	wmax : constyle[arg.name].width,		//gio.style.controls.aboutWidth,
									hmin:STATUS_LINE_HEIGHT,
									outColor				:'#888888',
									overColor				:'#CCCCCC',
									gradientDepth			:0.3,

									style:	{wrapper: 	{	position	: 'absolute',
															left		: constyle[arg.name].left+'px', //'120px',
															top			: STATUS_LINE_PERIOD*constyle[arg.name].slot+'px'
															//fontFamily	: constyle.fontFamily
														},
											display:	{	fontSize	: constyle.fontSize+'px',
															fontStyle	: constyle.fontStyle,
															fontWeight	: constyle.buttonsFontWeight,
															//kills? hover ... backgroundColor : '#AAAAAA', //constyle.backgroundColor,
															color		: constyle.color
														}
								}
						}
					}}
				);
			};


			//====================================================
			// Local shortcut to create control element
			//====================================================
			var makeControl=function(arg){
				arg.parent = gio.centered_control_subboard;
				return makeSelectElement(arg);
			};



			//====================================================
			// Construct status controls
			//----------------------------------------------------
			
			//--------------------
			// MainStatus
			//- - - - - - - - - - 
			ww = '<td style="width:50px; border:none; padding:2px; text-align:right;';
			www = ww + ' background-color:#333333;">';
			wwww = ww + ' background-color:#222244;">';

			// fails ... why?: -moz-border-radius:3px;  border-radius:3px;
			ww = '<td style="border:none; background-color:#333333; padding:2px;" >'
			w = 	'<table style="border:none; color:#FFFFFF; font-family:Helvetica, Arial; font-size:10px;">';
			w +=	www+'Moves</td>';
			w +=	www+'Backs</td>';
			w +=	www+'Path</td>';
			w +=	wwww+'Round</td>';
			w +=	'</tr><tr>';
			w +=	www+'Moves</td>';
			w +=	www+'Backs</td>';
			w +=	www+'Path</td>';
			w +=	wwww+'Round</td>';
			w +=	'</tr></table>';

			//Append round status:
			ww=gio.main_status_div=document.createElement('div');
			do_complete_control(ww,0,STATUS_LINE_PERIOD*0);
			ww.innerHTML=w;
			//ww.setAttribute('id','moves_div_debug'); //debug
			w = $(ww).find('td');

			gio.movesCount_div=w[4];
			gio.backsCount_div=w[5];
			gio.pathCount_div=w[6];
			gio.roundNumber_div=w[7];
			//- - - - - - - - - - 
			// MainStatus
			//--------------------


			//Append unit status:
			w=gio.status_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_PERIOD*1);

			/*
			//Append game status:
			//TODm abandoned:
			w=gio.mode_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_PERIOD*2+8*PADDING);
			*/
			//----------------------------------------------------
			// Construct status controls
			//====================================================




		/////////////// Next z-level. Slot 6 //////////////////////
			gio.controls.editmap=makeControl({
				name : 'edit',
				options :	[	{	title:'Edit Map Scripts',
									tooltip:'Create or edit map in raw map format. Key: e.'
								},
								{	title:'Edit Playpath',
									tooltip:'Edit or show playpath text. Key: w.'
								}
							],
				callback :	function(i,option){
								switch(option.title){
									case 'Edit Map Scripts' :	
											gio.edit_custom_maps();
											break;
									case 'Edit Playpath' :
											gio.display_game_path();
											break;
								}
							}
			});





		/////////////// Next z-level. Slot 5 //////////////////////
			// Bundled paths selection
			gio.bundles_path_select_el=makeControl({
							name : 'bundle',
							options		:[{	title:'Prerecorded',
											tooltip:'Load playpath to walk through or see a solution. '+
													'Wait for "Path" cell to repopulate while loading ...'
										}],
							redraw_scene : true,
							callback :	null
			});
			gio.controls.autoplay=makeControl({
							name : 'autoplay',
							options :	[{	title:'Autoplay',
											tooltip:'Forward automaticaly along playpath. Key: z.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.play_mode='autoplay';
											gio.autoplay(300);
										}
			});







		/////////////// Next z-level. Slot 4 //////////////////////
			gio.controls.reset=makeControl({
							name : 'reset',
							options :	[{	title:'Reset',
											tooltip:'Reset round and clear its playpath.'
										}],
							redraw_scene : true,
							callback :	function(){
											var gm;
											gio.gst(function(g,c,m){gm=c;});
											gio.init_round(gm,'reset this round');
										}
			});
			gio.controls.newround=makeControl({
							name : 'newround',
							options :	[{	title:'New',
											tooltip:'Create new round. Preserve other rounds. Key: n.'
										}],
							redraw_scene : true,
							callback :	function(){
											var gm;
											gio.gst(function(g,c,m){gm=c;});
											gio.init_round(gm);
										}
			});




		/////////////// Next z-level. Slot 3 //////////////////////
			var help_callback=function(i,option){
				switch(option.title){
					case 'Help Summary' :	
					case 'Rules' :	
									gio.toggle_help();
									break;
					case 'About' :	gio.toggle_about_pane();
									break;
					case 'About Map' :
									gio.toggle_about_map_pane();
									break;
				}
			};
			gio.help_select_el=makeControl({
				name : 'help',
				options :	[	{	title : 'Help Summary',
									tooltip : ('Keys '+gio.help_hint)
								},
								{	title : 'Rules',
									tooltip : ('Keys '+gio.help_hint)
								},
								{	title:'About',
									tooltip:'Key: a.'
								},
								{	title:'About Map',
									tooltip:'About Map Information. Key x'
								}
							],
				callback :	help_callback
			});




		/////////////// Next z-level. Slot 2 //////////////////////
			gio.controls.move_forward=makeControl({
							name : 'forward',
							options :	[{	title:'Forward',
											tooltip:'Forward along playpath. Key: f.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.do_record(null,'forward');
										}
			});
			gio.controls.restart=makeControl({
							name : 'restart',
							options :	[{	title:'Start',
											tooltip:'Display start position and preserve playpath. Key: s.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.do_record(null,'to beginning');
										}
			});
			gio.controls.move_back=makeControl({
							name : 'back',
							options :	[{	title:'Back',
											tooltip:'Revert move. Keys: Backspace or space.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.do_record(null,'back');
										}
			});









		//========================
		// ? Finalize common popup
		// Apparently this section does not change popups address in dom-tree and
		//		does not change popup's properties, it simply adds more
		//		users-owners waiting for this popup.
		// 
		// Apparently all these popups share the same dom-div-el 
		// which is equal to gio.common_popup.popup_el.
		//------------------------
			//Append help:
			gio.common_popup.update_owner({
				owner:'help',
				innerHTML:'<pre>'+gio.help+'</pre>'
			});
			gio.help_div=gio.common_popup.popup_el;

			//Append about:
			gio.common_popup.update_owner(gio.style.popups.about);
			gio.about_div=gio.common_popup.popup_el;

			//Append map comments:
			w=$.extend({},gio.style.popups.about);
			w.owner='map_comments';
			gio.common_popup.update_owner(w);
			gio.map_comments_div=gio.common_popup.popup_el;
		//------------------------
		// ? Finalize common popup
		//========================
	};

})(jQuery);

