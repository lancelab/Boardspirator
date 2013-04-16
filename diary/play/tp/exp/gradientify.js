
( function( $ ) {

					$.fn.gradientify = function ( arg )
					{
						set_grad_dynamically( arg.topColor, arg.bottomColor, this[0] );
						return this;
					};						



	/// Q&D
	//	Input:		el is optional. 
	//				if supplied, el must have el.style working
	//	Returns:	string-stub to add to el's style 
	var set_grad_dynamically = function ( topColor, bottomColor, el ) {

		var stub = ''

		var br = browser;

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


		///	Browser detection.
		//	Apparently, jQuery phases out this feature, which is still irreplaceable ...
		//		... so add it here ...
		//	TODm possibly outdated.
		//	Sets browser.IE to booleable, and so on ...
		//	Usage: 	For IE, Mozilla, AppleWebKit, WebKit, Chrome, Gecko:
		//			like this:	if(browser.IE),
		//						then browser.IE[1] contains a version.
		var browser = ( function ()
		{
		    var isOpera =	Object.prototype.toString.call( window.opera ) ===
							'[object Opera]';
			var ua = navigator.userAgent;
			return {
				//IE			: !!window.attachEvent && !isOpera, //prototype style detection
				IE				: !isOpera && ua.match(/msie\s*([0-9.]*)/i),
				Mozilla			: ua.match(/mozilla.*rv:([0-9.]*)/i),
				FireFox			: ua.match(/FireFox\/([0-9.]*)/i),
				AppleWebKit		: ua.match(/AppleWebKit\/([0-9.]*)/i),
				WebKit			: ua.match(/WebKit\/([0-9.]*)/i),
				Chrome			: ua.match(/chrome\/([0-9.]*)/i),
				Gecko			: (ua.indexOf('KHTML') === -1) && ua.match(/Gecko\/([0-9.]*)/i),
				Safari			: ua.match(/Safari\/([0-9.]*)/i),
				MobileSafari	: ua.match(/Apple.*Mobile/),
				Opera			: isOpera
   			};
		})();




})( jQuery );


