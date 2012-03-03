(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	gio.init_gui_controls_and_game_list =	function()
	{

		var STATUS_LINE_HEIGHT=gio.style.controls.STATUS_LINE_HEIGHT;
		var PADDING=gio.style.controls.PADDING;
		var PADDING_HORIZONTAL=gio.style.controls.PADDING_HORIZONTAL;

		var w,ww,ws;

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
		//================================
		// aux
		//////////////////////////////////



		var gstyle=gio.style;
		var cstyle=gstyle.captions;
		var constyle=gstyle.controls;

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


			//===================================================
			//Append help hint:
			//---------------------------------------------------
			gio.help_select_el=tp.form.create_select_el(
					{r:{	parent		:gio.centered_control_subboard,
							options		:[{	title:'Help',
										tooltip:'Use keys '+gio.help_hint+' for fast help'
									}],
							callback	:gio.toggle_help
					},
					c:{		choice_ix:0,
							gui:{	wmax:gio.style.controls.helpWidth,
								hmin:STATUS_LINE_HEIGHT,
								outColor				:'#888888',
								overColor				:'#CCCCCC',
								gradientDepth			:0.3,
								style:		{wrapper: 	{	position	:'absolute',
															left		:'0px',
															top			:'0px',
															fontFamily	:constyle.fontFamily
														},
											display:	{	fontSize	:constyle.fontSize+'px',
															fontStyle	:constyle.fontStyle,
															fontWeight	:constyle.buttonsFontWeight,
															//kills? hover ... backgroundColor : '#AAAAAA', //constyle.backgroundColor,
															color		:constyle.color
														}
											}
						}
					}}
			);
			//===================================================

			//===================================================
			//Append rules hint:
			//---------------------------------------------------
			gio.rules_select_el=tp.form.create_select_el(
					{r:{	parent		:gio.centered_control_subboard,
							options		:[{	title:'Rules',
											tooltip:'Use keys '+gio.help_hint+' for fast help'
										}],
							callback	:gio.toggle_help
					},
					c:{	choice_ix:0,
						gui:{	wmax:gio.style.controls.rulesWidth,
								hmin:STATUS_LINE_HEIGHT,
								outColor				:'#888888',
								overColor				:'#CCCCCC',
								gradientDepth			:0.3,
								style:		{wrapper: 	{	position	:'absolute',
															left		:gio.style.controls.rulesLeft+'px',
															top			:'0px',
															fontFamily	:constyle.fontFamily
														},
											display:	{	fontSize	:constyle.fontSize+'px',
															fontStyle	:constyle.fontStyle,
															fontWeight	:constyle.buttonsFontWeight,
															//kills? hover ... backgroundColor : '#AAAAAA', //constyle.backgroundColor,
															color		:constyle.color
														}
											}
						}
					}}
			);
			//===================================================

			//===================================================
			//Append about hint:
			//---------------------------------------------------
			gio.about_select_el=tp.form.create_select_el(
					{r:{	parent		:gio.centered_control_subboard,
							options		:[{	title:'About',
											tooltip:'Use keys '+gio.help_hint+' for fast help'
										}],
							callback	:gio.toggle_about_pane
					},
					c:{		choice_ix:0,
							gui:{	wmax:gio.style.controls.aboutWidth,
									hmin:STATUS_LINE_HEIGHT,
									outColor				:'#888888',
									overColor				:'#CCCCCC',
									gradientDepth			:0.3,
									style:		{wrapper: 	{	position	:'absolute',
																left		:gio.style.controls.aboutLeft+'px',
																top			:'0px',
																fontFamily	:constyle.fontFamily
															},
												display:	{	fontSize	:constyle.fontSize+'px',
																fontStyle	:constyle.fontStyle,
																fontWeight	:constyle.buttonsFontWeight,
																//kills? hover ... backgroundColor : '#AAAAAA', //constyle.backgroundColor,
																color		:constyle.color
															}
												}
							}
					}}
			);
			//===================================================

			//Append moves:
			w=gio.moves_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT+2*PADDING);


			//Append round status:
			w=gio.round_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*2+4*PADDING);

			//Append unit status:
			w=gio.status_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*3+6*PADDING);

			//Append game status:
			w=gio.mode_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*4+8*PADDING);

			////////////// Bundled paths selection ///////////////
			w=gio.bundled_paths_div=document.createElement('div');
			do_complete_control(w,0,STATUS_LINE_HEIGHT*2+4*PADDING);




			////////////// Bundled paths selection ///////////////
			//TODm this is a code prolifiration: 
			gio.bundles_path_select_el=tp.form.create_select_el(
					{r:{	parent		:gio.centered_control_subboard,
							options		:[{	title:'Prerecorded',
										tooltip:'Possible solution or hints'
									}],
							callback	:null //gio.toggle_help
					},
					c:{		choice_ix:0,
							gui:{	wmax:gio.style.controls.bundleWidth,
								hmin:STATUS_LINE_HEIGHT,
								outColor				:'#888888',
								overColor				:'#CCCCCC',
								gradientDepth			:0.3,
								style:		{wrapper: 	{	position	:'absolute',
															left		:'0px',
															top			:STATUS_LINE_HEIGHT*4+'px',
															fontFamily	:constyle.fontFamily
														},
											display:	{	fontSize	:constyle.fontSize+'px',
															fontStyle	:constyle.fontStyle,
															fontWeight	:constyle.buttonsFontWeight,
															//kills? hover ... backgroundColor : '#AAAAAA', //constyle.backgroundColor,
															color		:constyle.color
														}
											}
						}
					}}
			);
			////////////// Bundled paths selection ///////////////



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


	
	};

})(jQuery);

