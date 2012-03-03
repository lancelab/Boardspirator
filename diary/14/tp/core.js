
(function( $ ){			//jQuery sublugin for generic methods

	//Name:				$.fn.tp$.core
	//Date:				November 13, 2011
	//License:			jQuery license
	//Copyright:		(c) 2011 Konstantin Kirillov 


	//Attach plugin to jQuery:
	$.fn.tp$ = $.fn.tp$ || {};
	$.fn.tp$.core=(function()
	{
		self={};

		//Iterate through object ob.
		//If ob has length property, assume it is an array and iterate
		//		 through its elements.
		//Otherwise, iterate through "hasOwnProperty".
		self.each=function(ob,fun)
		{
			if( typeof ob === 'object' && ob !== null )
			{
				if(ob.length || ob.length === 0)
				{
					$.each(ob,fun); //resort to jQuery				
				}else{
					for(var p in ob)
					{
						if(ob.hasOwnProperty(p))
						{
							var ret = fun(p,ob[p]);
							if( ret !== undefined && !ret ) break; 
						}
					}
				}
			}
		}
		return self;
	})();

})( jQuery );


