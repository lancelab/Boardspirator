
(function( ){	// Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.


				//. sets the name of subplugin which is extended by this file
				var self_name = 'gui';
				//:: checks dependencies for this subplugin
				if( !window.jQuery || !jQuery.fn.tp$) {
					alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
					return;
				}
				var tp = jQuery.fn.tp$;
				var core = tp.core;
				if(!core) {
					alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');
					return;
				}
				//. makes short reference for this subplugin
				var self = tp[self_name];
				/// protects from dependency missing
				if( !self ) {
						alert('Top part of tp.'+self_name+' must be loaded before.');
						return;
				}



	/// Q&D
	//	Input:		el is optional. 
	//				if supplied, el must have el.style working
	//	Returns:	string-stub to add to el's style 
	self.set_grad_dynamically = function ( topColor, bottomColor, el ) {

		var stub = ''

		var br = core.browser;

		if( br.FireFox	||	br.Mozilla ) {
			stub = "-moz-linear-gradient(top, " + topColor + ", " + bottomColor + " )";
		}
		if( br.AppleWebKit	||	br.Safari	||	br.MobileSafari	||	br.WebKit	||	br.Chrome ) {
			stub = "-webkit-linear-gradient(top, " + topColor + ", " + bottomColor + " )";
		}
		if( br.Opera ) {
			stub = "-o-linear-gradient(top, " + topColor + ", " + bottomColor + " )";
		}
		if( br.IE )	{
			stub = "-ms-linear-gradient(top, " + topColor + ", " + bottomColor + " )";
		}

		if( el && el.style ) {
			el.style.background = bottomColor;
			el.style.backgroundImage = stub;
		}
		return "background : " + bottomColor + ";  background-image : " + stub + "; ";
	};

})();


