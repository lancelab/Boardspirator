//jQuery subplugin core continued
(function( $ ){

	//Date:				December 16, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 


	var self_name='core';
	//dependency check:
	if(!$.fn.tp$)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	if(!$.fn.tp$.core)alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');

	var self=$.fn.tp$[self_name];

		//=============================================================================
		//Create button element and its wrapper, x=create_popup()
		//	x.el	dom element.
		//			Created if id is not supplied or failed.
		//	x. show ... hide ... toggle 
		//Input: 	optionals: arg ~~ 
		//			{ width: height: color, backgroundColor, position, callbak} 
		//=============================================================================
		self.create_button=function(arg){

			// secure names and values:
			arg = arg || {};
			arg.r = arg.r || {};
			arg.c = arg.c || {};
			arg.c.style = arg.c.style || {};
			// secure dimensions:	
			arg.width = arg.width || 100;
			arg.height = arg.height || 50;

			var self={};

			// define positioning
			var pos= arg.position || 'absolute';

			var button_el=self.dom_el=document.createElement('div');
			if(arg.r.parent_el){
				parent_el.appendChild(popup_el);
			}
			if(arg.c.style.visibility){
				button_el.style.visibility=arg.c.style.visibility;
			}else{
				button_el.style.visibility='visible';
			}
		};//self.create_button=function(arg){

})( jQuery );


