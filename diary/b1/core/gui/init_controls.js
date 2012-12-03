(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;


	gio.gui.init.controls_and_game_list =	function(){

		var STATUS_LINE_HEIGHT=gstyle.controls.STATUS_LINE_HEIGHT;
		var STATUS_LINE_PERIOD=gstyle.controls.STATUS_LINE_PERIOD;
		var PADDING=gstyle.controls.PADDING;
		var PADDING_HORIZONTAL=gstyle.controls.PADDING_HORIZONTAL;

		var w,ww,ws;

		var cstyle=gstyle.captions;
		var constyle=gstyle.controls;

		var dwheaders = gio.domwrap.headers;

		//////////////////////////////////
		// aux
		var do_complete_control=function(w,left,top){
			w.style.position='absolute';
			ws=w.style;
			ws.height=STATUS_LINE_HEIGHT+'px';
			ws.left=left+'px';
			ws.top=top+'px';
			ws.width=gstyle.controls.width+'px';
			ws.padding=PADDING+'px';
			ws.paddingRight=PADDING_HORIZONTAL+'px';
			ws.paddingLeft=PADDING_HORIZONTAL+'px';
			ws.color=gstyle.controls.color;
			gde.chaser.appendChild(w);
		};
		//////////////////////////////////




			//=============================================================
			// CAPTIONS AREA
			//-------------------------------------------------------------


			// ** Dress selector creation
			ww = 	cstyle.collectionHeight +
					cstyle.gameHeight +
					cstyle.mapHeight +
					cstyle.gaps*3,

			dwheaders.dress_select_el=tp.form.create_select_el(

					{r	:	{	parent	:gdr.dsubtop 	},
					c	:	{	gui		:{
									wmax	:	cstyle.width-cstyle.subcaptionWidth,
									hmin	:	cstyle.dressHeight,
									gradientDepth	:0.4,
									style	:{	wrapper: 	{	position	:'absolute',
																left		:cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'11px',
																fontFamily	:cstyle.fontFamily
															},
												display:	{	fontSize	:'11px',
																//fontStyle	:cstyle.fontStyle,
																color		:'#EEEEEE'
															}
									},
									outColor				:'#666666',
									overColor				:'#999999'
								}	
					}}
			);
			// End of Dress selector



			//Collection and Selection
			//No collections exist at this moment ...
			//c onsole.log('Creating sel. box: Collection and Selection ... No collections exist at this moment');

			ww=cstyle.collectionHeight+cstyle.gameHeight+cstyle.gaps*2,
			dwheaders.map_select_el=tp.form.create_select_el(
					{r:{	parent	:gdr.dsubtop
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
												},
									height_of_box_limit : 300 //TODm 500 collides with console. Console is on top.
								}	
					}}
			);

			//Map caption:
			w=dwheaders.map_caption_div=document.createElement('div');
			w.style.position='absolute';
			w.style.color='#FFFFFF';
			w.style.width=(cstyle.subcaptionWidth-5)+'px';
			w.style.top=ww+Math.ceil(cstyle.mapHeight/3)+'px';
			w.style.fontFamily=cstyle.fontFamily;
			gdr.dsubtop.appendChild(w);
			w.innerHTML='Map';



			//Collection and Selection
			//No collections exist at this moment ...
			//c onsole.log('Creating sel. box: Collection and Selection ... No collections exist at this moment');
			ww=cstyle.gameHeight+cstyle.gaps;
			dwheaders.collection_select_el=tp.form.create_select_el(
					{r:{	parent	:gdr.dsubtop
					},
					c:{	gui		:{
									wmax:cstyle.width,  //-cstyle.subcaptionWidth,
									hmin:cstyle.collectionHeight,
									gradientDepth	:0.4,
									style:		{wrapper: 	{	position	:'absolute',
																left		:cstyle.width, //cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'15px',
																fontFamily	:cstyle.fontFamily
															}
												}
								}	
					}}
			);

			/*
			//Collection caption:
			w=document.createElement('div');
			w.style.position='absolute';
			w.style.color='#FFFFFF';
			w.style.top=ww+Math.ceil(cstyle.collectionHeight/3)+'px';
			w.style.fontFamily=cstyle.fontFamily;
			gdr.dsubtop.appendChild(w);
			w.innerHTML='Collection';
			*/


			//Game Title and Selection
			//c onsole.log('Creating sel. box. Game Title and Selection');
			dwheaders.title_select_el=tp.form.create_select_el(
					{r:{	parent		:gdr.dsubtop,
							options		:gio.playalbs
					},
					c:{	choice_ix		:gio.album_ix,
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
					{r:{	parent		: arg.parent,			//gde.chaser,
							options		: arg.options,			//[{	title:'Back',
																//		tooltip:'Revert move. Keys: Backspace or space.'
																//}],
							callback	:	function(i,option,select_el){
												arg.callback(i,option,select_el); //gio.gui.procs.do_manage_round(null,'back');
												if(arg.redraw_scene){
													gio.draw_scene();
													gio.draw_status();
												}
											}
					},

					c:{		choice_ix:0,
							gui:{	wmax : constyle[arg.name].width,		//gstyle.controls.aboutWidth,
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
				arg.parent = gde.chaser;
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
			w +=	www+'InterActs</td>';
			w +=	www+'Path</td>';
			w +=	wwww+'Backs</td>';
			w +=	'</tr><tr>';
			w +=	www+'Moves</td>';
			w +=	www+'InterActs</td>';
			w +=	www+'Path</td>';
			w +=	wwww+'Backs</td>';
			w +=	'</tr></table>';

			//Append round status:
			ww=gio.domwrap.status.main_status_div=document.createElement('div');
			do_complete_control(ww,0,STATUS_LINE_PERIOD*0);
			ww.innerHTML=w;
			//ww.setAttribute('id','moves_div_debug'); //debug
			w = $(ww).find('td');

			gde.movesCount=w[4];
			gde.interactionsNumber=w[5];
			gde.pathCount=w[6];
			gde.backsCount=w[7];
			//- - - - - - - - - - 
			// MainStatus
			//--------------------


			//Append unit status:
			w=gio.domwrap.status.unit_div=document.createElement('div');
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



			/////////////// Next z-level. Slot 8 //////////////////////
			w = [];
			if(gio.modes.sta_tic.db){
				 w =	[	{	title:'Load Session',
							tooltip:'Loads map`s playsession from database.'
							},
							{	title:'Save Session',
								tooltip:'Saves map`s playsession to database.'
							}
						]
			}
			w.push(	{	title:'Save Map Session',
						tooltip:'Shows map`s playsession to be copy-saved by Ctrl+A, Ctrl+C.'
					});
			w.push(	{	title:'Load Map Session',
						tooltip:'Loads map`s playsession from text.'
					});
			gio.controls.save_or_load=makeControl({
				name : 'save_or_load',
				options :	w,
				callback :	function(i,option){
								switch(option.title){
									case 'Save Map Session' :
											var stringified = gio.navig.in_session.round.serialize_rounds();
											gio.map_editors.do_init_save_load_popup(stringified);
											break;
									case 'Load Map Session' :
											gio.map_editors.do_init_save_load_popup();
											break;
									case 'Save Session' :
											var w = gio.data_io.core.save.object(
													gio.modes.sta_tic.db+'/game_sessions',			//rails controller url
													gio.data_io.session.session2db_ready_obj());	//object
											if(w.status === 'not logged'){
												alert('You must login to save the session');
												return;
											}else if(w.status === 'saved'){
												gio.cons_add('Playsession saved');
											}
											break;
									case 'Load Session' :
											var w = gio.data_io.core.load.object_synchronously(
												// Id 1 is ignored:
												gio.modes.sta_tic.db+'/game_sessions/1');
											if(w.status === 'not logged'){
												alert('You must login to load the session');
												return;
											}
											if(!w.session){
												gio.cons_add('Problems loading session');
												return;
											}
											var success = gio.data_io.session.load_jsoned_sess2sess(w.session);
											if(!success){
												gio.cons_add('Problems loading session');
												return;
											}
											success = gio.navig.select_album_and_collection();
											if(!success){
												gio.cons_add('Problems loading session');
												return;
											}
											gio.cons_add('Playsession loaded');
											break;
								}
							}
			});






			/////////////// Next z-level. Slot 7 //////////////////////

			gio.gui.solver_select_el = makeControl({
					name : 'solver_control',
					options :	[
									{	title:'---'
									},
									{	title:'---'
									},
									{	title:'---'
									},
									{	title:'---'
									},
									{	title:'---'
									}
								],
					callback :	function(dummy, item_option, select_el){

									var gs = gio.getgs();
									var gm = gs.gm;
									var msol = gm.solver;
									var options = select_el.arg.r.options;

									var do_search = '';									
									switch (item_option.title) {
									case 'Search First':
											do_search = 'first';
											break;
									case 'Search All':
											do_search = 'all';
											break;
									case 'Resume':
											do_search = 'resume';
											break;
									case 'Suspend':
											msol.stopped_bf = true;
											break;
									case 'Browse':
											msol.browser_mode = true;
											//. does empty move
											msol.browser.do_move();
											break;
									case 'Go to Play':
											msol.browser_mode = false;
											break;
									case 'Release Memory':
											msol.resume_memory();
											break;
									}

									gio.draw_status();

									if( do_search && msol.inactive_bf ) {
											msol.browser_mode = false;
											gm.solver.fire_up(
												do_search !== 'resume' && gs.round.pos,
												do_search !== 'all'
											);
									}
									gio.draw_status();
			
								}
			});
			gio.gui.solver_select_el.display.innerHTML = 'Solver';



			/////////////// Next z-level. Slot 6 //////////////////////

			gio.controls.editmap=makeControl({
				name : 'edit',
				options :	[	{	title:'Edit Map Scripts',
									tooltip:'Create own maps. Will add to "My Album". Key: e.'
								},
								{	title:'Edit Playpath',
									tooltip:'Edit or show playpath text. Key: w.'
								},
								{	title:'Albums Designer',
									tooltip:'Show JSONed Albums'
								},
								{	title:'Collection Designer',
									tooltip:'Show JSONed Albums'
								},
								{	title:'Game Designer',
									tooltip:'Show JSONed Game Definitions'
								},
								{	title:'Base Game Designer',
									tooltip:'Show Base Game Definition'
								}
							],
				callback :	function(i,option){
								switch(option.title){
									case 'Edit Map Scripts' :	
											gio.map_editors.edit_custom_maps();
											break;
									case 'Edit Playpath' :
											gio.map_editors.display_game_path();
											break;
									case 'Albums Designer' :
											gio.map_editors.display_albums();
											break;
									case 'Collection Designer' :
											gio.map_editors.display_collections();
											break;
									case 'Game Designer' :
											gio.map_editors.display_game_defs();
											break;
									case 'Base Game Designer' :
											gio.map_editors.display_base_game_inherited_def();
											break;
								}
							}
			});





		/////////////// Next z-level. Slot 5 //////////////////////
			// Bundled paths selection
			gio.domwrap.cpanel.controls.bundles_path_select_el=makeControl({
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
							options :	[{	title:'Replay',
											tooltip:'Forward automaticaly along playpath. Key: z.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.modes.play='autoplay';
											gio.navig.in_map.autoplay(300);
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
											gio.navig.in_session.round.init_round(gio.getgs().gm,'reset this round');
										}
			});
			gio.controls.newround=makeControl({
							name : 'newround',
							options :	[{	title:'New',
											tooltip:'Create new round. Preserve other rounds. Key: n.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_session.round.init_round(gio.getgs().gm);
											gio.gui.reset_rounds_select_el();
										}
			});
			gio.domwrap.cpanel.controls.rounds_select_el=makeControl({
							name : 'rounds',
							options		:[{	title:'Round',
											tooltip:'Select Round'
										}],
							callback :	null
			});




		/////////////// Next z-level. Slot 3 //////////////////////
			var help_callback=function(i,option){
				switch(option.title){
					case 'Help' :	
									gio.gui.procs.toggle_help();
									break;
					case 'Rules' :	
									gio.gui.procs.show_rules();
									break;
					case 'Objective' :	
									gio.gui.procs.show_objective();
									break;
					case 'Story' :
									gio.gui.procs.show_story();
									break;
					case 'About Map' :
									gio.gui.procs.toggle_about_map_pane();
									break;
				}
			};
			gio.domwrap.cpanel.controls.help_select_el=makeControl({
				name : 'help',
				options :	[	{	title : 'Help',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title : 'Rules',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title : 'Objective',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title : 'Story',
									tooltip : ('Keys '+gio.info.help.hint)
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
											gio.navig.in_map.back_forward_start('forward');
										}
			});
			gio.controls.restart=makeControl({
							name : 'restart',
							options :	[{	title:'Start',
											tooltip:'Display start position and preserve playpath. Key: s.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_map.back_forward_start('to beginning');
										}
			});
			gio.controls.move_back=makeControl({
							name : 'back',
							options :	[{	title:'Back',
											tooltip:'Revert move. Keys: Backspace or space.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_map.back_forward_start('back');
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
				innerHTML:'<pre>'+gio.info.help.main+'</pre>'
			});
			//gio.domwrap.popups.help_div = gio.domwrap.popups.common_div; //popups.modal_message_div;

			//Append about:
			gio.common_popup.update_owner(gstyle.popups.about);
			//gio.domwrap.popups.about_div=gio.domwrap.popups.common_div; //gio.common_popup.popup_el;

			//Append map comments:
			w=$.extend({},gstyle.popups.about);
			w.owner='map_comments';
			gio.common_popup.update_owner(w);
			//gio.domwrap.popups.map_comments_div = gio.domwrap.popups.common_div; //gio.common_popup.popup_el;
		//------------------------
		// ? Finalize common popup
		//========================
	};

})(jQuery);

