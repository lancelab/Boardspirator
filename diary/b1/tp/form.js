
//*************************************************
//jQuery subplugin:	for form
//Name:				$.fn.tp$.form
//Date:				December 08, 2011
//License:			jQuery license
//Copyright:		(c) 2011 Konstantin Kirillov 
//*************************************************


(function( $ ){	var tp		= $.fn.tp$;	
				var ceach	= tp.core.each;
				//var deb	= tp$.debug; //to debug Opera, IE, ... ; rem out if no need;

	var self_name='form';
	//dependency check:
	if(!tp)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	if(!tp.gui)alert('Package tp.gui must be loaded before tp$.'+self_name+' is loaded.');

	//Attach subplugin to jQuery:
	$.fn.tp$[self_name]=(function(){

		//shortcuts dd - dropdown, hmax - maximum height, ...

		var self={};
		var core=tp.core;



		//===================================
		//CREATE SELECT-ELEMENT
		//===================================
		//Input:	see arg={...
		//			only arg.options is required
		self.create_select_el=function(arg){ // argr_,argt_){
			arg = arg || {};

			//sample of input format for arg:
			var arg_settings={
				r	:{	//options passed by reference
						parent		:document.body,
						options		:[{}],	//apparently, program does not care about
											//what is inside an option, {},
											//but it is nice to have {title:...}
						callback	:null
					},
				c	:{	//options passed by content
						//should be true if resetting with changed number of items:
						dont_reset_styles :false,
						choice_ix	:-1, //0,
						gui			:{
									//general pars:
									height_of_box_limit		:170,
									hitem					:20,
									hmin					:25,
									wmax					:200,
									wbut					:30,
									itemindent				:null,
									itemOverColor			:'#666666',
									ddbox_backgroudColor	:'#333333',
									outColor				:'#CCCCCC',
									overColor				:'#EEEEEE',
									ddButtArrowOpacityColor	:'#CCCCCC',
									ddButtArrowOpacity		:.5,
									corners					:null,
									gradient				:true,
									gradientDepth			:0.7,
									//specific pars:
									style					:{	display	:{	fontSize	:'15px',
																			cursor		:'default'
																		},
																wrapper	:{	position	:'relative',
																			fontFamily	:'helvetica, arial'
																		}
															}
						} //gui
				}//c
			};//var arg_settings={

			var argr=arg_settings.r;
			var argt=arg_settings.c;
			core.rpaste(argr,arg.r);
			core.tpaste(argt,arg.c);
			//c onsole.log('creation of sel. el: args=',argr, argt);

			//master object which wraps "everything" in this constructor and
			//which is returned from constructor:
			var select_el = {parent:argr.parent, arg : arg_settings};

			//aux
			var elements;
			var item_settings;
			var hbox;
			var hmax;
			var hmin;
			var hitem;
			var ddbox_backgroudColor;


			var reset_styles=function(){
				var gui=argt.gui;

				//object shortcuts
				hbox						=gui.height_of_box_limit;
				hitem						=gui.hitem;
				ddbox_backgroudColor		=gui.ddbox_backgroudColor;

				//method shortcuts
				hmin						=gui.hmin;
				var wmax					=gui.wmax;
				var wbut					=gui.wbut;
				var itemindent				=gui.itemindent;
				var itemOverColor			=gui.itemOverColor;
				var outColor				=gui.outColor;
				var overColor				=gui.overColor;
				var ddButtArrowOpacityColor	=gui.ddButtArrowOpacityColor;
				var ddButtArrowOpacity		=gui.ddButtArrowOpacity;
				var corners					=gui.corners;


				//spawning parameters start
				var wbut2=Math.floor(wbut/2);
				if(!itemindent)itemindent=wbut2;
				var bottom_indent=hitem-2;
				var all_items_container_height=(argr.options.length)*hitem;
				var ibox_wrapper_height=hbox-bottom_indent;
				if(all_items_container_height<ibox_wrapper_height){
					ibox_wrapper_height=all_items_container_height;
					hbox=ibox_wrapper_height+bottom_indent;
				};
				hmax=hmin+hbox;
				var witem=wmax-wbut;
				var hbox2=Math.ceil(hbox/2);
				var nitmes=Math.ceil(hbox/hitem);
				var scroll_arrow_width=Math.floor(wbut*4/10);
				var scroll_arrow_height=Math.floor(wbut*4/10);
				var scroll_arrow_left=Math.floor(wbut*3/10);
				var scroll_arrow_gap=Math.floor(wbut*2/10);
				if(!gui.corners)gui.corners={r:wbut2};


				//spawning parameters end


				//element-specific settings:
				elements=[
					{	name	:'wrapper',
						parent	:'parent',
						style	:{
									width			:wmax+'px',
									height			:hmin+'px'
								}
					},
		
	
	
					///////////// strip start /////////////////////
					{	name	:'top_strip',
						parent	:'wrapper',
						style	:{
									width			:wmax+'px',
									height			:hmin+'px'
						}
					},
	
					{	name		:'ddbutton',
						parent		:'top_strip',
						style		:{
										width			:wbut+'px',
										height			:hmin+'px',
										right			:'0px',
										fontSize		:'14px'
									},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					},

					{	name		:'ddarrow_up',
						parent		:'ddbutton',
						style		:{
										visibility		:'hidden',
										width			:wbut+'px',
										height			:hmin+'px',
										backgroundColor	:ddButtArrowOpacityColor,
										opacity			:ddButtArrowOpacity
									},
						arrow		:{	direction		:'up',
										style			:{	width			:scroll_arrow_width,
															height			:scroll_arrow_height,
															left			:scroll_arrow_left,
															top				:scroll_arrow_gap
														}
									}
					},

					{	name		:'ddarrow_down',
						parent		:'ddbutton',
						style		:{
										width			:wbut+'px',
										height			:hmin+'px',
										backgroundColor	:ddButtArrowOpacityColor,
										opacity			:ddButtArrowOpacity
									},
						arrow		:{	direction		:'down',
										style			:{	width			:scroll_arrow_width,
															height			:scroll_arrow_height,
															left			:scroll_arrow_left,
															top				:scroll_arrow_gap
														}
									}
					},

					{	name	:'display',  //container for always visible selected item text 
						parent	:'top_strip',
						style	:{
									width			:witem-itemindent+'px',
									height			:hmin+'px',
									paddingLeft		:itemindent+'px',
									lineHeight		:Math.ceil(hmin*9/10)+'px',
									overflow		:'hidden'
						},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					},
					///////////// strip end /////////////////////


					///////////// box start /////////////////////
					{	name	:'ddbox',
						parent	:'wrapper',
						style	:{
									width			:wmax+'px',
									height			:hbox+'px',
									top				:hmin+'px',
									display			:'none',
									backgroundColor	:'transparent',
									overflow		:'hidden'
						}
					},
	
	
					{	name	:'itembox_wrap',
						parent	:'ddbox',
						style	:{
									overflow		:'hidden',
									width			:witem+'px',
									height			:ibox_wrapper_height+'px',
									top				:'0px'
						}
					},
	
					{	name	:'itembox',	//immediate container of all items;
											//if it is too big, then it
											//can be hidden by itembox_wrap;
											//NOTE: its div height is never set,
											//		it is dynamically calculated as
											//		all_items_container_height
						parent	:'itembox_wrap',
						style	:{
									width			:witem+'px',
									top				:'0px'
						}
					},
	
	
					//=========== scroll bars start ======================
					{	name	:'scroll_up',
						parent	:'ddbox',
						style	:{
									width			:wbut+'px',
									height			:hbox2+'px',
									right			:'0px'
						},
						arrow	:{	direction		:'up',
									style			:{	width			:scroll_arrow_width,
														height			:scroll_arrow_height,
														left			:scroll_arrow_left,
														top				:scroll_arrow_gap
													}
								},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					},
	
					{	name	:'scroll_down',
						parent	:'ddbox',
						style	:{
									width			:wbut+'px',
									height			:hbox2+'px',
									top				:hbox2+'px',
									right			:'0px'
						},
						arrow	:{	direction		:'down',
									style			:{	width			:scroll_arrow_width,
														height			:scroll_arrow_height,
														left			:scroll_arrow_left,
														bottom			:scroll_arrow_gap
													}
								},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					}
					//=========== scroll bars end ======================
					///////////// box end //////////////////////////////
				];
	
			
	
				item_settings={
					name	:'item',
					parent	:'itembox',
					style	:{
								overflow		:'hidden',
								left			:0+'px',
								width			:witem-itemindent+'px',
								height			:hitem+'px',
								backgroundColor	:ddbox_backgroudColor,
								paddingLeft		:itemindent+'px',
								color			:'#FFFFFF',
								fontSize		:'12px',
								cursor			:'default'
					},
					style_over	:{
								backgroundColor	:itemOverColor
					}
				};

				//auxiliary
				var setup_element=function(parameters){
						var w,div,gradColor,gradTip;
						var v=parameters;
						var name=v.name;
						if(select_el[name]){
							div=select_el[name];
						}else{
							div=select_el[name]= document.createElement('div');
							select_el[v['parent']].appendChild(div);
							//effects:
							
							if(argt.gui.gradient){
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
								if(gradColor)tp.gui.gradientizeOnce(gradColor, argt.gui.gradientDepth, gradTip, div);
							}
						}

						//vital for HTML debug:
						//div.setAttribute('id',name+'ForDebug');

						core.rpaste(div.style, v['style']);
						core.rpaste(div.style, argt.gui.style[name]); //override
						if(!div.style || !div.style.position || div.style.position !== 'relative' )div.style.position='absolute'; //hard-coding the default

						//-------------------------------
						//Opera and IE8? problems debug: 
						//Problem: abs pos is assigned right. Below is a proof:
						//But it is lost later on:
						//if(name==='scroll_up' || name==='ddbutton'){
						//	deb(v['style'],name + ' v[style]');
						//	deb(div.style.position, div.id+' after IE fix, div.style.position ');
						//	deb(div.style,'div.style');
						//}
						//-------------------------------

						if(gui.corners)tp.gui.cornerize(gui.corners,div);
						if(v['innerHTML'])div.innerHTML=v['innerHTML'];

						return div;
				};//var setup_element=function(parameters){



				//===================================
				//spawn divs and styles
				//-----------------------------------
				core.each(elements,function(ix,v){
					var w,ww;
					if(v.mousables){
						core.each(v.mousables,function(name,mousable){
							var m=core.tclone(v);
							//if(!argt.gui.gradient)
							core.rpaste(m.style,mousable); //add style to base-style
							m.name=v.name+'_'+name;

							//TODm attach mousable to proper parent to hide when 
							//no mouse events make sense:
							//m.parent=v.name;

							var div=setup_element(m);
							div.style.visibility=  name==='over' ? 'hidden' : 'visible';
						});
					}
					var el_already_created=select_el[v['name']] && true;
					w=setup_element(v);
					if(!el_already_created && v.arrow){
						ww=core.tclone(v.arrow,{parent:w});
						w=tp.gui.create_triangle(ww);
						//tp$.deb('triangle-div.style.position=',w.div.style.position,  ' parent.style.position= ',w.arg.parent.style.position);
						//w.div.style.position = 'absolute';
						//tp$.deb('after refixing triangle-div.style.position=',w.div.style.position);
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


				//=====================================================
				//Non-leading browser's q&d patch:
				//Opera and IE8 fix: abs. pos. is lost by some reason.
				//Here we restoring it:
				//TODm better solution should not slow everyone:
				//-----------------------------------------------------
					ceach(select_el, function(ix,val){
						if(ix !== 'parent' ){
							if(val.tagName){
								//deb(''+val.id+' '+val.tagName + 'id, tag');
								if(val.tagName.toLowerCase() === 'div' ){
									if(!val.style){
										//deb(val.id, 'no style at all. id');
									}else if( !val.style.position  || val.style.position !== 'absolute' ){
										//deb(val.style.position, val.id+' val.style.position');
										val.style.position = 'absolute';
										//deb(val.style.position, val.id+' val.style.position after fix');
									}
								}
							}
						}
					});						
				//-----------------------------------------------------
				//Opera and IE8 fix: abs. pos. is lost by some reason.
				//Here we restoring it:
				//=====================================================





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
						
					dd[s].display						=do_close ? 'none'			: 'block';
					sel['ddarrow_down'][s][v]			=do_close ? 'visible'		: 'hidden';
					sel['ddarrow_up'][s][v]				=do_close ? 'hidden'		: 'visible';
					sel['wrapper'][s].backgroundColor	=do_close ? 'transparent'	: ddbox_backgroudColor;
					sel['wrapper'][s].height			=do_close ? hmin+'px'		: hmax+'px';
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
				$(sel['top_strip']).bind('click',function(event){
					if(argr.options.length>1){
						toggle_dd();
					}else{ //button mode
						if(argr.callback)argr.callback(0,argr.options[0],select_el);
					}
					return true;
				});

				//outside click which closes control
				$(document).bind('click',function(event){
					if(!core.isAncestorOf(select_el['wrapper'],event.target)){
						toggle_dd('close');
					}
					return true;
				});

				//moseover	
				$(sel['top_strip']).bind('mouseenter',function(event){
					//if(argr.options.length<2)return true; //skip
					sel['ddbutton_over'][s][v]=vv;
					sel['ddbutton_out'][s][v]=hh;
					sel['display_over'][s][v]=vv;
					sel['display_out'][s][v]=hh;
					return false;
				});
	
				//mouseleave
				$(sel['top_strip']).bind('mouseleave',function(event){
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
					pos += hitem;
					if(pos<hitem) itembox.style.top=pos+'px';
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
					pos -= hitem;
					// TODO This place is thin: length+2 or length+1 makes "crucial" difference: do fix.
					// c onsole.log( ' scroll pos ix='+(pos/hitem)+' argr.options.length='+argr.options.length+ ' hbox/ss='+(hbox/hitem) );
					if(pos+(argr.options.length+2)*hitem>hbox) itembox.style.top=pos+'px';
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


						//============================================
						//core event: making selection by item click:
						//	poor doc: apparently this is a click on item from the
						//				list in drop-down box TODO
						//				... what give to "internals"?
						//				see p o s s i b l y   t h i s  below	
						$(div).bind('click',function(event){
							toggle_dd('close'); //hard style: close immediately
							var new_ix=i;
							if(argr.callback){

								//callback can modify or disprove selection process:
								// "p o s s i b l y   t h i s :"
								var result=argr.callback(i,argr.options[i],select_el,event);
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
							event.target.style.backgroundColor=item_settings.style_over.backgroundColor;
							return false;
						});

						//"beautify item" with effect
						$(div).bind('mouseleave',function(event){
							event.target.style.backgroundColor=item_settings.style.backgroundColor;
							return false;
						});
					}
					div=select_el.reserved_divs[counter];
					//.	unhides div if it was previously hidden when number of options
					//	was less than number of reserved_divs
					div.style.display = 'block';

					core.rpaste(div.style, item_settings.style);
					div.style.top=hitem*i+'px';
					div.innerHTML= v.title;
					div.title=v.tooltip || ''+(i+1);
	
					//TODm expensive binds ... css ?is better?:				
	

					counter++;
				});//core.each

				/// hides reserved_divs which exceed actual options
				for( var ii=select_el.reserved_divs.length-1; ii >= counter; ii-- )
				{
					select_el.reserved_divs[ii].style.display = 'none';
				}


				show_choice();
			};
			//-----------------------------------
			//reset=function
			//===================================

			reset_styles();
			bind_navigation_events();

			argt.dont_reset_styles=true;
			select_el.reset();
			//VITAL. Do this now. It's easy to forget:
			argt.dont_reset_styles=false;
			


			//===================================
			//remove interfering effects
			//-----------------------------------
			//selection
			$(select_el['wrapper']).css({
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


