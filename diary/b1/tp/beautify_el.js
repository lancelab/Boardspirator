(function( $ ){

	//Beautify controls.	jQuery sublugin.
	//Attached to			$.fn.tp$
	//... with name
	var own_name			='beautify_el';
	//Date:					December 08, 2011
	//License:				jQuery license
	//Copyright:			(c) 2011 Konstantin Kirillov 


	//============================================
	//check dependencies:
	(function(dep){
		for(var i=1; i<dep.length; i++){
			var d0=dep[0];
			var d1=dep[i];
			if(!$.fn[d0] || !$.fn[d0][d1]){
				alert('Package '+d0+'.'+d1+' must be loaded before '+d0+'.'+own_name+' is loaded.');
				return;
			}
		}
	})(['tp$','gui','form']); //dependencies
	//============================================


	var tp		=  $.fn.tp$;	
	var core	=  tp.core;	

	//Attach subplugin to jQuery:
	tp[own_name]=(function()
	{
		var beautify_el={};

		beautify_el.select=function(arg){

			var arg=arg || {};
			var argr=arg.r=arg.r || {};
			var argt=arg.c=arg.c || {};
			//preserve if any:
			var users_callback=argr.callback;

			var callback=function(ix, option){
					//call user-provided callback first:
					if(users_callback)users_callback(ix, option);
					postable.value=origin.options[ix].value;
					//c onsole.log(	'this is a selected option '+ix,option+"\n"+ 'postable=',postable);
			};

			var form=$.fn.tp$.form;
			var origin=this;

			var options=$.fn.tp$.core.each(origin.options, true, function(ix, option){
					return {body:option.value, title:option.text}
			});
			var original_name=origin.name;
			origin.setAttribute('name',original_name+'_tp')
			var postable=document.createElement('input');
			postable.setAttribute('type','hidden');
			postable.setAttribute('name',original_name);
			//Set hidden input:
			postable.value=origin.options[origin.selectedIndex].value;

			//c onsole.log('origin=',origin, origin.selectedIndex);

			//look is replacement inside dom-tree requested:

			argr.options	=options;
			argr.callback	=callback;
			argt.choice_ix	=origin.selectedIndex;
			var converted	=form.create_select_el(arg);

			if(!argr.parent){
				//well, no parent is specified, let's trully replace the element
				//eliminate surprises:
				converted.reset_arguments({r:{parent:origin.parentNode}});			
				//reattach:
				$(origin).after(converted['wrapper']);
			}
			//hide origin:
			$(origin).css('display','none');


			//add auxiliary objects to beautified for case ... perhaps a garbage:
			converted.postable=postable;
			converted.origin=origin;


			//return wrapper:
			//dom-element is =converted['wrapper']
			return converted; 

		};//beautify_el.select=function

		return beautify_el;
	})(); //$.fn.tp$[own_name]=(function
})( jQuery );

