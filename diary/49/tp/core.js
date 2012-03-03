(function( $ ){			//jQuery sublugin for generic methods

	//Name:				$.fn.tp$.core
	//Date:				November 22, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 


	//Attach plugin to jQuery:
	$.fn.tp$ = $.fn.tp$ || {};
	$.fn.tp$.core=(function()
	{
		var self={};

		//set core.browser.IE or .....Opera to true or false:
		//usage: 	if(tp.core.browser.IE){ ...
	    self.browser={Opera:Object.prototype.toString.call(window.opera) == '[object Opera]'};
		self.browser.IE = !!window.attachEvent && !(window.core && core.browser && core.browser.Opera);


		//==============================================================================
		//Iterator through first-level nodes.
		//If ob has length property,	assume it is an array and iterate
		//		 						through its elements.
		//						        NOTE: undefined elements still trigger callback.
		//Otherwise,					iterate through "hasOwnProperty".
		//Behaviour						stops iteration if callback returns false.
		//==============================================================================
		self.each=function(ob,fun){
			if( typeof ob === 'object' && ob !== null ){
				var ret;
				var len=ob.length;
				if(len || len === 0){
					for(var i=0; i<len; i++){
						ret=fun(i,ob[i]);
						if( ret !== undefined && !ret ) break; 
					}
				}else{
					for(var p in ob){
						if(ob.hasOwnProperty(p)){
							ret = fun(p,ob[p]);
							if( ret !== undefined && !ret ) break; 
						}
					}
				}
			}
			return ob;
		}


		//////////////////////////////////////////////////////////////////////////
		// Cloners
		//========================================================================
		//Action:			paste trees of objects' sequence into first oblect
		//		 			undefined, nulls, non-objects are igonred
		//					all properties are copied overridingly
		//Implementation:	based on jQuery
		//Note:				check of circular loop is unknown
		//					it relies on jQuery
		//Input:			no restrictions, nulls, undefines, ... are allowed
		//========================================================================
		self.tpaste=function(){
			var len=arguments.length; 

		    var tree_mode=arguments[i];
			var arg_shift=1;
			if(typeof tree_mode === 'boolean'){
				arg_shift=2;
			}else{
				tree_mode=true;					
			}

			var wall={};
			if(len<=arg_shift) return wall;
			wall=arguments[arg_shift-1] || wall; //TODO if ob is arr but wall not

			for(var i=arg_shift; i<len; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				if(tree_mode){
					$.extend(true,wall,ob);
				}else{
					$.extend(wall,ob);
				}
			}
			return wall;
		};


		//Same as tpaste, but only first-level nodes of object tree are pasted.
		self.rpaste=function(){
			var wall=arguments[0] || {};
			for(var i=1; i<arguments.length; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				self.each(ob,function(k,v){
					wall[k]=v;
				});
				//$.extend(wall,ob);
			}
			return wall;
		};

		//Same as tpaste, but all is pasted into {} which is returned then.
		self.tclone=function(){
			var wall={};
			for(var i=0; i<arguments.length; i++){
				self.tpaste(wall,arguments[i])
			}
			return wall;
		};

		//"References" clone:
		//Same as rpaste, but only first-level nodes of object tree are pasted.
		self.rclone=function(){
			var wall={};
			for(var i=0; i<arguments.length; i++){
				self.rpaste(wall,arguments[i])
			}
			return wall;
		};
		//=====================================================
		// Cloners
		///////////////////////////////////////////////////////




		//========================================================================
		//Returns blinker object to be bound to specific DOM element
		//	blinker.dosetup sets up blinking, but not fires it
		//	blinker.dostart, dostop start and stop blinking
		//			dostart does noting unless previous animation ends ...
		//	no need to stop, if redoing the dosetup
		//Sugar:
		//	blinker.dobegin does both dosetup and dostart
		//  if contsructor's arguments.length === 4, it does dobegin immediately
		//========================================================================
		self.blinker=function(obj_, jQuerySetting1, jQuerySetting2, period_)
		{
			var blinker={};

			var READY=-1;
			var FIRST=0;
			var LAST=1;
			var state = READY;
			var stopper=false;

			var phases_queue=[];
			var obj_queue=null;
			var period_queue=-1;

			var phases=[];
			var obj=null;
			var period=-1;

			//workhorse:
			var doblink=function()
			{
				if(stopper && state===LAST)
				{
					stopper=false;
					state=READY;
					return; //finalize stopping
				}
				if(state===FIRST)
				{
					phases=phases_queue;
					obj=obj_queue;
					period=period_queue;
				}
				var phase=phases[state];
				state=(state+1)%2;
				$(obj).animate(phase,period,doblink);
			};

			blinker.dosetup_and_start=function(obj_, jQuerySetting1, jQuerySetting2, period_)
			{
				obj_queue=obj_;
				period_queue=period_;
				phases_queue=[jQuerySetting1, jQuerySetting2];
				blinker.dostart();
			};
			blinker.dostart	=function() { if(state!==READY) return; state=FIRST; doblink(); };
			blinker.dostop	=function()	{ stopper=true; };

			////////////////////sugar:

			if(arguments.length === 4)
			{
				blinker.dosetup_and_start(obj_, jQuerySetting1, jQuerySetting2, period_);
			}
			return blinker;

			//not tested:
			var do_stop_wait_start=blinker.do_stop_wait_start=function()
			{
				blinker.dostop();
				if(state===READY)
				{
					doblink();
					return;
				}else{
					setTimeout(do_stop_wait_start,500);
				}
			};	

		};



		//=============================================================================
		//Create popup_el and its wrapper, x=create_popup()
		//	x.popup_el -	dom element.
		//					Created if id is not supplied or failed.
		//	x.open ... show ... hide ... toggle 
		//Plainly: popup window which will lurk hidden until called ...
		//Input: 	optionals: arg ~~ 
		//			{ width: height: color, backgroundColor, innerHTML, position} 
		//=============================================================================
		self.create_popup=function(arg){

			//secure names:
			arg = arg || {};
			var popup={};

			//define positioning
			var pos= arg.position || 'absolute';

			//naturalize:
			var popup_el=document.createElement('div');
			document.body.appendChild(popup_el);
			$(popup_el).css('visibility','hidden').css('position',pos);
			popup.popup_el=popup_el;
	

			//secure dimensions:	
			arg.width = arg.width || 200;
			arg.height = arg.height || 100;


			//prepare helper:
			//===============================================
			//Centralize and update for pars supplied in args
			//	Only a few prpperties can be updated:
			//			dimensions, position, colors,
			//			innerHTML
			//===============================================
			var update=function(args){
				args=args||{};

				//define positioning
				$(popup_el).css('position',args.position || 'absolute');

				//Dimensions:
				$(popup_el).css('width',args.width || $(popup_el).width());
				$(popup_el).css('height',args.height || $(popup_el).height());


				//================================================
				// Centralize
				//------------------------------------------------				
				//Apparently window, not document:
				//Get the window height and width
				var winH = $(window).height();
				var winW = $(window).width();

				//Set popup window position to center 
				//if top and left are not supplied:
				var top		= args.top	? args.top	: (winH-$(popup_el).height())/2;
				var left	= args.left	? args.left	: (winW-$(popup_el).width() )/2;
				if(top<0)top=0;
				if(left<0)left=0;
				$(popup_el).css('top',  top);
				$(popup_el).css('left', left);
				//------------------------------------------------				
				// Centralize
				//================================================

				//Colors:
				if(args.backgroundColor) $(popup_el).css('background-color', args.backgroundColor);
				if(args.color) $(popup_el).css('color', args.color);

				//Content:
				if(args.innerHTML) popup_el.innerHTML=args.innerHTML;
			};

			//finalize creation:
			update(arg);

			//show popup. args are optional.
			popup.show=function(a){ 
				update(a);
				$(popup_el).css('visibility','visible');
				return popup_el;
			};	

/*
			//same as show, but attempts to set a focus:
			popup.show_with_focus=function(a){ 
				popup.show(a);
				popup_el.focus();
			};	
*/
			//toggle popup. args are optional.
			popup.toggle=function(args){
				update(args);
				var v = 'visible'===$(popup_el).css('visibility') ? 'hidden' : 'visible';
				$(popup_el).css('visibility',v); 
			};

			popup.hide=function(){ $(popup_el).css('visibility','hidden'); };
			popup.isVisible=function(){return 'visible'===$(popup_el).css('visibility');};

			return popup;
		};


		//============================================================
		//Share and tooggle single popup between different contents
		//------------------------------------------------------------
		//Returns	create_popup() object with added methods:
		//			update_owner,dotoggle,doshow.
		//Reason	holds properties for different owners
		//			and changes popup to args.owner.
		//Input:	In all methods:	args, a - optional and 
		//							their properties are optinal.
		//------------------------------------------------------------
		self.single_popup_manager=function(args){
			var manager=self.create_popup(args);
			var owner='';
			var contents={};

			var update_owner=manager.update_owner=function(a){
				if(!a || !a.owner)return;
				owner=a.owner;
				contents[owner] = contents[owner] || {};
				$.extend(contents[owner],a);
			};

			if(args && args.owner)update_owner(args);

			manager.dotoggle=function(a){
				if(!a || !a.owner){
					manager.toggle();
				}else if(a.owner === owner){
					update_owner(a);
					manager.toggle(contents[owner]);
				}else{
					manager.doshow(a);
				}
			};

			manager.doshow=function(a){
				update_owner(a);
				manager.show(contents[owner]);
			};

			return manager;
		};
		//------------------------------------------------------------
		//Share and tooggle single popup between different contents
		//============================================================


		//replace unsafe chars &,<,> with html entities:
		var htmlencode=self.htmlencode = function(s){
				return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		};
		self.pre2html=function(s){return htmlencode(s).replace(/\n/g,"<br />\n"); };

		//Find first child matching regEx in its innerHTML
		self.matchChild=function(regEx,parent){
			var found=null;
			self.each(parent && parent.childNodes, function(ix,el){
				if(el.innerHTML && el.innerHTML.match(regEx)){
					found=el;
					return false;
				};
			});
			return found;
		};




		//Emulate "sticky-to-screen-vertical-position-for-popup" dom_el:
		//Credit: http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
		self.do_center_vertically_in_screen=function(dom_el){
			var window_top=$(window).scrollTop();
			var el_top_gap=($(window).height()-$(dom_el).outerHeight())/2;
			$(dom_el).css('top',el_top_gap+window_top);
		};

		self.isAncestorOf=function (ancestor, element){
			var parent=element.parentNode;
			while( parent ){
				if(parent===ancestor)return true;
				//paranoid fear:
				if( parent === document )break;
				parent=parent.parentNode;
			}
			return false;
		};

		//Round non-negative number to floor and then convert:
		//Relies on non-folat division and % errorness in JS implementation.
		var DIGITS = [ '0', '1','2','3','4','5','6','7','8','9','A','B','C','D','E','F' ];
		self.num2hexstr=function(i){
          var i = Math.floor(i);
          if( i<=0 ) return "0";
          var result = "";
          while( i > 0 ){
              var rem = i % 16;
              result = DIGITS[rem] + result;
              i = (i - rem )/16;
          }
          return result; 
		};

		return self; //tp return
	})(); //tp end
	
	
})( jQuery );


