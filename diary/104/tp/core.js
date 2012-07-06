(function( $ ){


	///////////////////////////////////////////////////////////////////////////
	var Description={
		Title			:'tp',
		Description		:'Tool Package - jQuery.fn.tp$ plugin',
		Version			:'0.0.96',
		Date			:'June 15, 2012',
		License			:'Dual licensed under the MIT or GPL Version 2 licenses.',
		Copyright		:'(c) 2011-2012 Konstantin Kirillov',
		WebSite			:'landkey.net/gio/gio/bs/tp/',
		Contact			:'spam-protection@landkey.net where spam-protection=beaverscript'
	};
	///////////////////////////////////////////////////////////////////////////


	//File description: tp$.core	subplugin for generic methods


	//attach plugin to jQuery:
	$.fn.tp$ = (function(choice,arg){
					var that=this && this[0];
					if(!that)return;
					return $.fn.tp$.beautify_el[choice].call(that,arg);
	});

	//add Description:
	$.fn.tp$.Description=Description;	



	//Attaches top part of tp$.core subplugin
	$.fn.tp$.core=(function(){

		var self={};




		//////////////////////////////////////////////////////////////////////////
		// Cloners
		//========================================================================
		//Pitfall:			Array is not pasted in to object-non-array
		//					Object-non-array does not change type to array.
		//
		//Action:			paste trees of objects' sequence into first oblect
		//		 			undefined, nulls, non-objects are igonred
		//					all properties are copied overridingly
		//Implementation:	based on jQuery extend
		//					tree_mode is on (deep copy)
		//Usage:			tpaste(wall,paster1,paster2,...)
		//Input:			1. If paster is arr but wall not result is not array
		//						based on jquery 1.7
		//					2. Checking against circular object loop is
		//					   responsibility of a caller.
		//					3. No restrictions: nulls, undefines, ... are allowed
		//========================================================================
		self.tpaste=function(){
			var len=arguments.length; 
			var wall={};
			if(len<1) return wall;
			wall=arguments[0] || wall;
			
			for(var i=1; i<len; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				$.extend(true,wall,ob);
			}
			return wall;
		};


		//Same as tpaste, but all is pasted into {} which is returned then.
		//self.tclone_INIACCURATE=function(){
		self.tclone=function(){
			var wall={};
			for(var i=0; i<arguments.length; i++){
				self.tpaste(wall,arguments[i])
			}
			return wall;
		};
		//=====================================================
		// Cloners
		///////////////////////////////////////////////////////





		//Emulate "sticky-to-screen-vertical-position-for-popup" dom_el:
		//Credit: http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
		self.do_center_vertically_in_screen=function(dom_el){
			var window_top=$(window).scrollTop();
			var el_top_gap=($(window).height()-$(dom_el).outerHeight())/2;
			$(dom_el).css('top',el_top_gap+window_top);
		};


		return self; //tp return
	})(); //tp end
	
	
})( jQuery );


