//jQuery subplugin for form
(function( $ ){var tp  =  $.fn.tp$;	



	//Name:				$.fn.tp$.form
	//Date:				February 03, 2012
	//License:			jQuery license
	//Copyright:		(c) 2012 Konstantin Kirillov 
	var self_name		='form';




	//dependencies warning:
	var w='Package XXXX must be loaded before tp$.'+self_name+' is loaded.';
	if(!tp)alert(w.replace('XXXX','tp$'));
	if(!tp.gui)alert(w.replace('XXXX','tp$.gui'));
	if(!tp.gui.spawn_subcontrol_settings)alert(w.replace('XXXX','tp$.gui.spawn_subcontrol_settings'));




	//Attach subplugin to jQuery:
	$.fn.tp$[self_name]=(function(){



		//==================================
		// shortcuts and shortcut variables
		//----------------------------------
		// shortcuts dd - dropdown
		var self={};
		var core=tp.core;
		//----------------------------------
		// shortcuts and shortcut variables
		//==================================




		//*************************************************
		// Main function of plugin: self.create_select_el
		//*************************************************
		//Input:	see arg={...
		//			only arg.options is required
		self.create_select_el=function(arg){





			//==============================================
			// s a m p l e   o f   a r g    f o r m a t
			// and default settings at the same time
			//----------------------------------------------
			arg = arg || {};
			var arg_settings={
				r	:{	//options passed by reference
						parent				:document.body,
						options				:[{}],	//apparently, program does not care about
													//what is inside an option, {},
													//but it is nice to have {title:...}
						callback	:		null
					},
				c	:{	//should be true if resetting with changed number of items:
						dont_reset_styles	:false,
						choice_ix			:-1, //0,
						gui					:{
							total_width			:	200,
							pictureless			:	true,
							corners				:	{	enabled	: true,
													 	vary		: { value	: 'auto' }, //values:	'auto'	- half of button size will be assigned
																							//			{...}	- see gui.cornerize
													},
							color				:	{	out : '#CCCCCC',	over : '#EEEEEE'},
							gradient			:	{	enabled : true, depth : 0.7},
							arrowcon			:	{	opacityColor	:'#CCCCCC',
														opacity			:.5,
														triangle_style	:{}
													},
							header				:	{	height			:25 },
							ddbox				:	{	height_limit	:170,
														backgroudColor	:'#333333',
														vary			:{}	
													},
							ddbutton			:	{	width 			:30,
														vary			:{color :{}}
													},	
							item				:	{	height			:20,
														indent			:null,
														color			:{out :'#000000', over :'#666666'},
														vary			:{}
													},

							subconSet			:	{	topwrap	:{	position	:'relative',
																	fontFamily	:'helvetica, arial'
																},
														display	:{	fontSize	:'15px',
																	cursor		:'default'
																}
													},
							vary				:	{}
						} //gui
				}//c
			};//var arg_settings={
			var argr=arg_settings.r;
			var argt=arg_settings.c;
			core.rpaste(argr,arg.r);
			core.tpaste(argt,arg.c);
			//----------------------------------------------
			// s a m p l e   o f   a r g    s e t t i n g s
			//==============================================






			//================================================================
			// master object which wraps "everything" in this constructor and
			// which is returned from constructor:
			//---------------------------------------------------------------
			var select_el={parent:argr.parent};

			//this variables are in closure of auxiliary functions and
			//must be not moved into deeper closure:
			var itemSet;
			var subconSet;
			var gui=argt.gui;



			//------------------------------------------------
			// Function which changes outlook of html-control
			//------------------------------------------------
			var reset_styles=function(){


				//oooooooooooooooooooooooooooooooooooooooooooooo
				// starts spawning parameters from arguments
				//----------------------------------------------
				var w;
				//JS has no block vars, so "emulate" them below:
				var wbut,wbut2,wheight,wsummed_height,wbottom_indent;

				wheight			=gui.ddbox.height_limit;
				wbut			=gui.ddbutton.width;
				wbut2			=Math.floor(wbut/2);
				wsummed_height	=(argr.options.length)*gui.item.height;
				if(!gui.item.indent) gui.item.indent=wbut2;
				wbottom_indent	=gui.item.height-2;
		

				//begin shrink ddbox if too few items
				w=gui.ddbox.vary.mask_height	=wheight-wbottom_indent;
				if(wsummed_height<w){
					w		=wsummed_height;
					wheight	=w+wbottom_indent;
				};
				gui.ddbox.vary.mask_height=w;
				gui.ddbox.vary.height=wheight;
				//end shrink ddbox if too few items


				gui.vary.total_height	=gui.header.height+wheight;
				gui.ddbox.vary.height2	=Math.ceil(wheight/2);
				gui.item.vary.width		=gui.total_width - gui.ddbutton.width;
				//note: nitmes			=Math.ceil(wheight/gui.item.height);

				w		=gui.arrowcon.triangle_style;
				w.width =Math.floor(wbut*4/10);
				w.height=Math.floor(wbut*4/10);
				w.left	=Math.floor(wbut*3/10);
				w.gap	=Math.floor(wbut*2/10);
	
				if(gui.corners.enabled && gui.corners.vary.value === 'auto')gui.corners.vary.value={r:wbut2};

				gui.ddbutton.vary.color.out=gui.color.out;
				gui.ddbutton.vary.color.over=gui.color.over;
				//vital debug:
				//tp$.debug(gui,'gui');
				//return;
				//----------------------------------------------
				// starts spawning parameters
				//oooooooooooooooooooooooooooooooooooooooooooooo








				subconSet	= tp.gui.spawn_subcontrol_settings(gui);
				itemSet		= {
					name	:'item',
					parent	:'itembox',
					style	:{
								left			:0+'px',
								width			:gui.total_width-gui.ddbutton.width-gui.item.indent+'px',
								height			:gui.item.height+'px',
								paddingLeft		:gui.item.indent+'px',
								overflow		:'hidden',
								backgroundColor	:gui.ddbox.backgroudColor,
								color			:'#FFFFFF',
								fontSize		:'12px',
								cursor			:'default'
							},
					style_over :{backgroundColor	:gui.item.color.over	}
				};

				//vital debug:
				//tp$.debug(subconSet,'subconSet returnsd',3);
				//tp$.debug(itemSet,'itemSet');

				//auxiliary
				var setup_element=function(parameters){
						var w,div,gradColor,gradTip;
						var v=parameters;
						var name=v.name;
						if(select_el[name]){
							//don't regenerate DOM's-div, take existing one:
							div=select_el[name];
						}else{
							//generate DOM's-div
							div=select_el[name]= document.createElement('div');
							select_el[v['parent']].appendChild(div);
							//effects:

							//gradient is static: cannot be reset: created only once: //TODm make dynamic							
							if(gui.gradient.enabled){
								gradColor='';
								gradTip='top';
								w = v.mousables;
								if(name === 'display_out')gradColor=w.out.backgroundColor;
								if(name === 'display_over')gradColor=w.over.backgroundColor;
								if(name === 'ddbutton_out')gradColor=w.out.backgroundColor;
								if(name === 'ddbutton_over')gradColor=w.over.backgroundColor;
								if(name === 'scroll_up_out')gradColor=w.out.backgroundColor;
								if(name === 'scroll_up_over')gradColor=w.over.backgroundColor;
								if(name === 'scroll_down_out')gradColor=w.out.backgroundColor;
								if(name === 'scroll_down_over')gradColor=w.over.backgroundColor;
								if(name === 'scroll_down_out' || name === 'scroll_down_over')gradTip='bottom';	
								if(gradColor)tp.gui.gradientizeOnce(gradColor, gui.gradient.depth, gradTip, div);
							}
						}

						//some style, v['style'], can be reset:
						core.rpaste(div.style, v['style']);

						if(gui.corners.enabled)tp.gui.cornerize(gui.corners.vary.value,div);
						if(!v['style'].position)div.style.position='absolute'; //default

						core.rpaste(div.style, gui.subconSet[name]); //override

						if(v['innerHTML'])div.innerHTML=v['innerHTML'];

						//good for debug:
						div.setAttribute('id',name+'ForDebug');

						return div;
				};//... setup_element=function






				//===================================
				//spawn divs and styles
				//-----------------------------------
				core.each(subconSet,function(ix,subcon){
					var w,ww;
					if(subcon.mousables){
						core.each(subcon.mousables,function(name,mousable){
							var cloned=core.tclone(subcon);
							//if(!gui.gradient.enabled)
							core.rpaste(cloned.style,mousable); //add style to base-style
							cloned.name=subcon.name+'_'+name;

							//TODm attach mousable to proper parent to hide when 
							//no mouse events make sense:
							//cloned.parent=v.name;

							var div=setup_element(cloned);
							div.style.visibility=  name==='over' ? 'hidden' : 'visible';
						});
					}
					var el_already_created=select_el[subcon['name']] && true;
					w=setup_element(subcon);

					//add arrows in shape of triangles:
					if(gui.pictureless && !el_already_created && subcon.arrow){
						ww=core.tclone(subcon.arrow,{parent:w});
						tp.gui.create_triangle(ww);
					}

				});

				//toggle button/select operational mode:
				select_el['ddbutton'].style.display=
					select_el['ddbutton_out'].style.display =
					select_el['ddbutton_over'].style.display=
						 argr.options.length<2 ? 'none' : 'block';
				//-----------------------------------
				//spawn divs and styles
				//===================================

				//tp$.debug(select_el,'select_el');


			};//...reset_styles=function




			////////////////////////////////////////
			//Helpers
			//======================================
			
			//Input		action = 'close', 'open'. 
			//			Optional.
			var toggle_dd=function(action){
					var sel=select_el;
					var dd=sel['ddbox'];
					var s='style';
					var v='visibility';

					if(	argr.options.length<2 &&
						dd[s].display === 'none') return true; //skip openeing single-item

					var do_close = dd[s].display !=='none';
					if(action) do_close = action === 'close';
						
					dd[s].display						=do_close ? 'none'					: 'block';
					sel['ddarrow_down'][s][v]			=do_close ? 'visible'				: 'hidden';
					sel['ddarrow_up'][s][v]				=do_close ? 'hidden'				: 'visible';
					sel['topwrap'][s].backgroundColor	=do_close ? 'transparent'			: gui.ddbox.backgroudColor;
					sel['topwrap'][s].height			=do_close ? gui.header.height+'px'	: gui.vary.total_height+'px';
			};

			//Action	show existing choice, argt.choice_ix.
			var show_choice=function(){
				if(argt.choice_ix<0){
					select_el['display'].innerHTML='';
					select_el['display'].title='';
					return;
				}
				var w=argr.options[argt.choice_ix];
				select_el['display'].innerHTML=w.title;
				if(w.tooltip)select_el['display'].title=w.tooltip;
			};

			//TODm q&d. need a light-weight methods: no style, no options
			select_el.reset_choice=function(choice_ix){
				if(	isNaN(choice_ix) || choice_ix<-1 ||
					choice_ix>=argr.options.length			)	return;
				argt.choice_ix=choice_ix;
				show_choice();
			};

			select_el.close=function(){
				toggle_dd('close');
			};
			//======================================
			//Helpers
			////////////////////////////////////////







			//===================================
			//bind_navigation_events
			//-----------------------------------
			var bind_navigation_events=function(){
				var itembox=select_el['itembox'];
				var s='style';
				var v='visibility';
				var vv='visible';
				var hh='hidden';
				var sel=select_el;

				//drow down event
				$(sel['header']).bind('click',function(event){
					if(argr.options.length>1){
						toggle_dd();
					}else{ //button mode
						if(argr.callback)argr.callback(0,argr.options[0]);
					}
					return true;
				});

				//outside click which closes control
				$(document).bind('click',function(event){
					if(!core.isAncestorOf(select_el['topwrap'],event.target)){
						toggle_dd('close');
					}
					return true;
				});

				//moseover	
				$(sel['header']).bind('mouseenter',function(event){
					//if(argr.options.length<2)return true; //skip
					sel['ddbutton_over'][s][v]=vv;
					sel['ddbutton_out'][s][v]=hh;
					sel['display_over'][s][v]=vv;
					sel['display_out'][s][v]=hh;
					return false;
				});
	
				//mouseleave
				$(sel['header']).bind('mouseleave',function(event){
					sel['ddbutton_over'][s][v]=hh;
					sel['ddbutton_out'][s][v]=vv;
					sel['display_over'][s][v]=hh;
					sel['display_out'][s][v]=vv;
					return false;
				});
	
	
				var s_u=sel['scroll_up'];
				var s_d=sel['scroll_down'];
				var s_u_h=sel['scroll_up_over'][s];
				var s_u_i=sel['scroll_up_out'][s];
				var s_d_h=sel['scroll_down_over'][s];
				var s_d_i=sel['scroll_down_out'][s];
	
	
				//-----------------------------------------
				// upper part
				//- - - - - - - - - - - - - - - - - - - - - 
				$(s_u).bind('mouseenter',function(event){
					s_u_h[v]=vv;
					s_u_i[v]=hh;
					return false;
				});
				$(s_u).bind('mouseleave',function(event){
					s_u_h[v]=hh;
					s_u_i[v]=vv;
					return false;
				});
				$(s_u).bind('click',function(event){
					var pos=parseInt(itembox.style.top);
					pos += gui.item.height;
					if(pos<gui.item.height) itembox.style.top=pos+'px';
					return false;
				});
				//-----------------------------------------


				//-----------------------------------------
				// lower part
				//- - - - - - - - - - - - - - - - - - - - - 
				$(s_d).bind('mouseenter',function(event){
					s_d_h[v]=vv;
					s_d_i[v]=hh;
					return false;
				});
				$(s_d).bind('mouseleave',function(event){
					s_d_h[v]=hh;
					s_d_i[v]=vv;
					return false;
				});
				$(s_d).bind('click',function(event){
					var pos=parseInt(itembox.style.top);
					pos -= gui.item.height;
					if(pos+(argr.options.length+1)*gui.item.height>gui.ddbox.vary.height) itembox.style.top=pos+'px';
					return false;
				});
			};//bind_navigation_events=function
			//-----------------------------------
			//bind_navigation_events
			//===================================







			//===================================
			//reset=function
			//-----------------------------------
			//Input: format: see arg={... all optional
			select_el.reset=function(arg){
				arg = arg || {};
				core.rpaste(argr,arg.r);
				core.tpaste(argt,arg.c);

				if(!argt.dont_reset_styles)reset_styles();
				var itembox=select_el['itembox'];
				var counter=0;
				select_el.reserved_divs = select_el.reserved_divs || [];
				select_el.reserved_length = select_el.reserved_divs.length;

				//iterate through items:
				core.each(argr.options,function(i,v){
					var div;
					if(counter >= select_el.reserved_length){
						//generate a new one
						div=document.createElement('div');
						itembox.appendChild(div);
						select_el.reserved_divs[counter]=div;
						div.style.position='absolute';
						//debug:
						div.setAttribute('class','item '+i);
tp$.debug(div,'item in loop');
console.log('item in lop',div);

						//============================================
						//core event: making selection by item click:
						$(div).bind('click',function(event){
							toggle_dd('close'); //hard style: close immediately
							var new_ix=i;
							if(argr.callback){
								//callback can modify or disprove selection process:
								var result=argr.callback(i,argr.options[i]);
								if(!isNaN(result))new_ix=result;
							}
							if(new_ix>-1){
								argt.choice_ix=new_ix;
								show_choice();
							}
							return true;
						});
						//============================================

	
						//"beautify item" with effect
						$(div).bind('mouseenter',function(event){
							event.target.style.backgroundColor=itemSet.style_over.backgroundColor;
							return false;
						});

						//"beautify item" with effect
						$(div).bind('mouseleave',function(event){
							event.target.style.backgroundColor=itemSet.style.backgroundColor;
							return false;
						});
					}
					div=select_el.reserved_divs[counter];
if(i===0)tp$.debug(itemSet,'first itemSet');

					core.rpaste(div.style, itemSet.style); //inject style into item's div
					div.style.top=gui.item.height*i+'px';
					div.innerHTML= v.title;
					div.title=v.tooltip || ''+(i+1);
	
					//TODm expensive binds ... css ?is better?:				
	

					counter++;
				});//core.each

				show_choice();
			};
			//-----------------------------------
			//reset=function
			//===================================

			reset_styles();
			//tp$.debug('reset styles completed');

			bind_navigation_events();

			argt.dont_reset_styles=true;
			select_el.reset();
			//VITAL. Do this now. It's easy to forget:
			argt.dont_reset_styles=false;
			


			//===================================
			//remove interfering effects
			//-----------------------------------
			//selection
			$(select_el['topwrap']).css({
	                   '-moz-user-select':'none',
	                   '-webkit-user-select':'none',
	                   'user-select':'none'
	               }).each(this.onselectstart=function(){return false;}); //for IE
			//===================================

			//helper, just to reset stored arguments without changing anything:
			select_el.reset_arguments=function(arg){
				arg=arg || {};
				core.rpaste(argr,arg.r);
				core.tpaste(argt,arg.c);
			};	

			return select_el; //return created object
		};//end of constructor: self.create_select_el=function...

		return self; //tp return
	})(); //tp end
	
	
})( jQuery );


