//===================================================================
//Helper:	for $.fn.tp$.form plugin
//Purpose: 	merge user-defined setting with	hard-coded-here-default
//			settings for form control subcontrols
//===================================================================



(function( $ ){var tp  =  $.fn.tp$;	//set environment

	var self_name='spawn_subcontrol_settings';


	//dependencies warning:
	var w='Package XXXX must be loaded before tp$.'+self_name+' is loaded.';
	if(!tp)alert(w.replace('XXXX','tp$'));
	if(!tp.gui)alert(w.replace('XXXX','tp$.gui'));






	//Attaches as $.fn.tp$.gui.form_control_settings
	$.fn.tp$.gui[self_name]=function(gui){
	
		var total_width				=gui.total_width;
		var header_height			=gui.header.height;
		var outColor				=gui.color.out;
		var overColor				=gui.color.over;
		var ddbutton				=gui.ddbutton;
		var ddbox					=gui.ddbox
		var item					=gui.item;
		var arrowcon				=gui.arrowcon;

		var subconSet=[
			//////////// topwrap of all control 
			{	name	:'topwrap',
				parent	:'parent',
				style	:{	width			:total_width+'px',
							height			:header_height+'px'
						}
			},
			
	
			//ooooooooooo header beginning oooooooooooooooooooo
			{	name	:'header',
				parent	:'topwrap',
				style	:{	width			:total_width+'px',
							height			:header_height+'px'
				}
			},
	
			///////////// right-hand button to make dropdown
			{	name		:'ddbutton',
				parent		:'header',
				style		:{	width			:ddbutton.width+'px',
								height			:header_height+'px',
								right			:'0px',
								fontSize		:'14px'
							},
				mousables	:{	out	:{backgroundColor	:outColor},
								over:{backgroundColor	:overColor}
							}
			}
		];


		//=================================
		// makes drop-down arrow controls
		//---------------------------------
		var subcon= {
				name		:'ddarrow_up',
				parent		:'ddbutton',
				//this style goes directly to "create_triangle" function
				style		:{	visibility		:'hidden',
								width			:ddbutton.width+'px',
								height			:header_height+'px',
								backgroundColor	:gui.arrowcon.opacityColor,
								opacity			:gui.arrowcon.opacity
							}
		};
		w=arrowcon.triangle_style;
		subcon.arrow = {	direction	:'up',
							style		:{	width			:w.width,
											height			:w.height,
											left			:w.left,
											top				:w.gap
										}
							};
		subconSet.push(subcon);
		//add arrow down:
		subcon = tp.core.tclone(subcon);
		subcon.name = 'ddarrow_down';
		subcon.arrow.direction = 'down';
		subconSet.push(subcon);
		//---------------------------------
		// makes drop-down arrow controls
		//=================================



		//container for always visible selected item text 
		subconSet.push({	
				name	:'display',  
				parent	:'header',
				style	:{	width			:item.vary.width-item.indent+'px',
							height			:header_height+'px',
							paddingLeft		:item.indent+'px',
							lineHeight		:Math.ceil(header_height*9/10)+'px',
							overflow		:'hidden'
				},
				mousables	:{	out	:{backgroundColor	:outColor},
								over:{backgroundColor	:overColor}
							}
		});
		//ooooooooooo header end oooooooooooooooooooo




		///////////// box start /////////////////////
		subconSet=subconSet.concat([
			{	name	:'ddbox',
				parent	:'topwrap',
					style	:{	width			:total_width+'px',
								height			:ddbox.height+'px',
								top				:header_height+'px',
								display			:'none',
								backgroundColor	:'transparent',
								overflow		:'hidden'
					}
			},
	
	
			{	name	:'itembox_mask',
				parent	:'ddbox',
				style	:{	overflow		:'hidden',
							width			:item.vary.width+'px',
							height			:gui.ddbox.vary.mask_height+'px',
							top				:'0px'
				}
			},
	
			{	name	:'itembox',	//immediate container of all items;
									//if it is too big, then it
									//can be hidden by itembox_mask;
									//NOTE: its div height is never set,
									//		it is dynamically calculated as
									//		all_items_container_height
				parent	:'itembox_mask',
				style	:{	width			:item.vary.width+'px',
							top				:'0px'
				}
			}
		]);
	
	
		//=========== scroll bars start ======================
		subcon=	{	
					name	:'scroll_up',
					parent	:'ddbox',
					style	:{	width			:ddbutton.width+'px',
								height			:ddbox.vary.height2+'px',
								right			:'0px'
					},
					mousables	:{	out	:{backgroundColor	:outColor},
									over:{backgroundColor	:overColor}
								}
		};
		w=arrowcon.triangle_style;
		subcon.arrow=	{	direction		:'up',
								style		:{	width			:w.width,
												height			:w.height,
												left			:w.left,
												top				:w.gap
											}
						};
		subconSet.push(subcon);
		subcon = tp.core.tclone(subcon);
		subcon.name = 'scroll_down';
		subcon.arrow.direction 	= 'down';
		subcon.style.top		= ddbox.vary.height2+'px';
		subcon.arrow.bottom		= arrowcon.triangle_style.gap;
		delete subcon.arrow.top;
		subconSet.push(subcon);


		//=================================
		// scroll-page controls
		//---------------------------------
		subcon={	
				name	:'scroll_page_up',
				parent	:'ddbox',
				style	:{
							width			:ddbutton.width+'px',
							height			:(ddbox.vary.height2-ddbutton.width)+'px',
							right			:'0px'
				},
				mousables	:{	out	:{backgroundColor	:outColor},
								over:{backgroundColor	:overColor}
							}
		};
		subconSet.push(subcon);
		subcon = tp.core.tclone(subcon);
		subcon.name = 'scroll_page_down';
		subcon.style.top	= ddbox.vary.height2+'px';
		subconSet.push(subcon);
		//---------------------------------
		// scroll-page controls
		//=================================


		//=========== scroll bars end ======================
		///////////// box end //////////////////////////////

		return subconSet;
	};
	
})( jQuery );


