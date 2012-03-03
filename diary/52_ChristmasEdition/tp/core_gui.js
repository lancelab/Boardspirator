//jQuery subplugin core continued
(function( $ ){

	//Date:				December 16, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 


	var self_name='core';
	//dependency check:
	if(!$.fn.tp$)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	if(!$.fn.tp$.core)alert('Beginning of tp.core must be loaded before tp$.'+self_name+' is loaded.');

	var self=$.fn.tp$[self_name];


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

})( jQuery );


