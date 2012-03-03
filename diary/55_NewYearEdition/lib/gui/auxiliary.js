(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};


	//=============
	//console
	//-------------
	var console_text='';

	gio.cons=function(msg){
		if(!gio.debug)console_text='';
		$.each(arguments,function(i,msg){
			if(window.console && window.console.log)console.log(msg);
			console_text+="\n"+msg;
		});
		gio.cons_div.innerHTML='<pre>'+console_text+'</pre>';
	};

	gio.cons_add=function(){
		$.each(arguments,function(i,msg){
			if(window.console && window.console.log)console.log(msg);
			console_text+="\n"+msg;
		});
		gio.cons_div.innerHTML='<pre>'+console_text+'</pre>';
	};
	//-------------
	//console
	//=============


})(jQuery);
