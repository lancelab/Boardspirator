
(function( ){	// Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.


				// * sets the name of subplugin which is extended by this file
				var self_name = 'core';
				// ** checks dependencies for this subplugin
				if(!jQuery.fn.tp$)			alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
				if(!jQuery.fn.tp$.core)		alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');
				// * makes short reference for this subplugin
				var self = jQuery.fn.tp$[self_name];


				// //\\		VITAL HELP
				//			regex: http://blog.stevenlevithan.com/archives/singleline-multiline-confusing

				// \\//



	self.userAgent = navigator.userAgent;

		//===============================================================================
		// Browser detection
		// Apparently, jQuery phases out this feature, which is still irreplaceable ...
		// ... so add it here ...
		// TODm possibly outdated.
		// Sets core.browser.IE to truthful/falsness, and so on ...
		// Usage: 	For IE, Mozilla, AppleWebKit, WebKit, Chrome, Gecko:
		//			like this:	if(tp.core.browser.IE),
		//						then tp.core.browser.IE[1] contains a version.
		//--------------------------------------------------------------------------------
		self.browser = (function(){
		    var isOpera =	Object.prototype.toString.call(window.opera) ===
							'[object Opera]';
			var ua=self.userAgent;
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
		//tp$.deb(self, 'self at its startup'); //vital debug
		//===============================================================================


		self.allow_non_mainstream_browser=function(){
			if( !self.browser.FireFox &&
				!self.browser.Chrome &&
				!self.browser.Opera &&
				!self.browser.IE){
				alert('This feature is enabled only in FireFox, Chrome, Opera, or Internet Explorer.');		
				return false;
			}
			return true;
		};




		//==============================================================================
		//Iterator through first-level nodes.
		//If ob has length property,	assume it is an array and iterate
		//		 						through its elements.
		//						        NOTE: undefined elements still trigger callback.
		//Otherwise,					iterate through "hasOwnProperty".
		//Behaviour						stops iteration if callback returns false.
		//Input							
		//			signature:	ob,callback - action: iterates with callback
		//						ob,true,callbak	- action: iterates and builds
		//													array/object with elements
		//													taken as returns from 
		//													callback
		//Drawback				constructed collection cannot have false, '', null, 0
		//						as its elements
		//==============================================================================
		self.each=function(ob,do_construct,fun){
			if( typeof ob === 'object' && ob !== null ){
				var ret;
				var len=ob.length;
				if(typeof do_construct !== 'boolean'){
					fun=do_construct;
					do_construct=false;
				}
				var constructed=null;
				if(len || len === 0){
					if(do_construct)constructed=[];
					for(var i=0; i<len; i++){
						ret=fun(i,ob[i]);
						if( ret !== undefined && !ret ) break; 
						if(do_construct)constructed.push(ret);
					}
				}else{
					if(do_construct)constructed={};
					for(var p in ob){
						if(ob.hasOwnProperty(p)){
							ret = fun(p,ob[p]);
							if( ret !== undefined && !ret ) break; 
							if(do_construct)constructed[p]=ret;
						}
					}
				}
			}
			if(do_construct){
				return constructed;
			}else{
				return ob;
			}
		}




		//////////////////////////////////////////////////////////////////////////
		// Cloners
		//========================================================================

		//========================================================================
		// Purpose: Hard cloning. Type, array or non-array, is cloned also.
		// Input:	level can be omitted at initial call.
		//			No anti-recursion protection.
		// Returns:	combined clone of wall and paper.
		//			In case if both wall and paper do not have arrays in their trees,
		//			makes wall a correct paste of paper; otherwise
		//			paste result not always correct.
		// Result:  wall changes
		var paste_non_arrays = self.paste_non_arrays=function(wall,paper,level)
		{

			level = level || 0;

			// TODm slow:
			var t = typeof paper;

			// On top level, pasting nothing does not change wall:
			if(!level && (t=='undefined' || paper === null )) return wall;

			if(t == 'undefined' || t == 'string' || t=='boolean' || t=='number' || t=='function' || paper === null)
			{
				// tp$.deb('Paper is a plain value with type='+t+'. Returning paper.');
				return paper;
			}

			// tp$.deb('Paper is non-void array or object. Checking wall.');
			if(typeof wall !== 'object' || wall === null)
			{
				// tp$.deb('Wall is a plain value array. Making it an empty object');
				wall={};				
			}

			if( (paper.length || paper.length === 0) && !wall.length && wall.length !== 0 ) //TODM Bad test. Use "Array protot" instead.
			{
				// tp$.deb(' Paper is an array and wall not. Generating array. Breaking paste feature.');
				var wall_preserved = wall;
				wall=[];
				paste_non_arrays(wall,wall_preserved);
			}

			// tp$.deb(' Now both wall and paper are objects of the same type. Pasting their properties.');
			for(var p in paper )
			{
				if(paper.hasOwnProperty(p))
				{
					if( p !== 'length' ) {
						wall[p]=paste_non_arrays(wall[p],paper[p],level+1);
					}else{
						throw "Reserved word \"length\" used as a property"; //TODO
					}
				}
			}
			return wall;
		};//cloneTwo
		



		// ========================================================================
		// Purpose: Hard cloning. Type, array or non-array, is cloned also.
		// Input:	if no arguments or all arguments are !!-false, returns {}
		// Returns: combined clone of trees of each argument
		//			if operand-properties contain array, their result begins array
		// Result:	does not change arguments.
		// TODM:	? clonem must be able to produce null from all nulls
		// ========================================================================
		self.clone_many=function()
		{
			var len=arguments.length; 
			var wall={};
			if(len<1) return wall;

			for(var i=0; i<len; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object' || ob === null)continue;
				wall = self.paste_non_arrays(wall, ob);
			}
			return wall;
		};


		// ========================================================================
		// Purpose: Paste first-level references.
		// 			Only first-level-node object refs. are pasted.
		// ========================================================================
		self.rpaste=function(){
			var wall=arguments[0] || {};
			for(var i=1; i<arguments.length; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				self.each(ob,function(k,v){
					wall[k]=v;
				});
			}
			return wall;
		};



		// ====================================================
		// Purpose: Clone first-level references.
		// ====================================================
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



		//To eliminate annoying check for existing objects in chain:
		//of properties:
		//Input sample: prop(window, 'document.myObject.object2'):
		self.prop=function(obj,path){
			if(!obj)return null;
			var test=path.split('.');
			var prop=obj;
			for(var i=0; i<test.length; i++){
				if( !(prop=prop[test[i]])  )return null;
			}
			return prop;
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



		// Rounds non-negative number to floor and then convert:
		// Relies on non-float division and % errorless in JS implementation.
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


		// Gets parameter from URL query string.
		// Returns: non-false-like-value if exists;
		//			otherwise returns true or false
		//			depending on key's existence
		self.getQueryPar=function(key){
			var w=window.location.search;
			var re=new RegExp('(?:&|\\?)'+key+'(?:=([^&]*))*(?:&|$)');
			w=w.match(re);
			// c onsole.log('reg=',re,'parsed q=',!!w && (w[1] || true));
			return !!w && (w[1] || true);
		};



		// Gets integer from URL query string.
		// Returns: if retrieval is failed, returns false.
		self.getIntegerQueryPar=function(key){
			var value=self.getQueryPar(key);
			if( typeof value !== 'string' ) return false;
			if(isNaN(value)) return false;
			value =Math.floor(parseInt(value));
			return value;
		}



		///	Converts:	URL-query string [?]key1=val1&key2=val2 .... to
		//				{ ... key : vala, .... } object
		//				keys without "=value" assigned value JS-constant true
		//	Input:		integerify - optoinal; if given, integerifies all numeric parameters.
		//	Returns:	[] if nothing detected
		self.getQueryKeyPairs = function( integerify ) {
			var ww = window.location.search;
			if(ww.charAt(0) === '?'){
				ww = ww.substr(1);
			}
			if( !ww || ww.length === 0 ) return null;
			var splitted = ww.split('&');
			var pairs = {};
			for(var i=0; i<splitted.length; i++){
				var token = splitted[i];
				if( token === '' ) continue;
				var pair = token.split('=');
				if( pair.length === 1 ){
					pairs[token] = true;
					continue;
				}
				var value = pair[1];
				if(integerify){
					if(!isNaN(value)) value = Math.floor(parseInt(value));
				}
				pairs[pair[0]] = value;
			}
			return pairs;
		};



		/// Gets parent ...XXX/XXX from path ...XXX/XXX/file
		//	without the ending slash
		var getFileParentRegex=/(.*)\/[^\/]*$/;
		self.getFileParent=function(path){

			var ww=path.match(getFileParentRegex);
			return (ww && ww[1]) || '';
		};

		// Caption maker helper
		self.capitalizeFirstLetter=function(s){
			if(!s)return '';
			return s.charAt(0).toUpperCase() + s.substr(1);
		};

		// Joins dolength strings from_index in array "strings".
		// Input: from_index and dolength are optional.
		//			absent dolength enforces joing all remaining lines after "from",
		//			negative or zero dolength "joins" nothing
		self.joinRange=function(strings, from_index, dolength){

			if(!strings.length) return '';
			if(!from_index && from_index !== 0) from_index = 0;
			if(!dolength && dolength !== 0)dolength=strings.length-from_index;

			var limit=from_index + dolength;
			var result = '';
			for(var ix=from_index; ix<limit; ix++){
				result += strings[ix]+"\n";
			}
			return result;
		};


		///	Replaces:	tokens found in body of html-page,
		//				replaces with tokens defined in gio.description and
		//				optionally CustomReplacement tokens.
		//	Purpose:	finalize documentation pages macrifation.
		//
		//	Inputs:		CustomReplacement - optional. Collection of tokens to replace.
		//				No need to append '#@....@#' prefixes.
		self.rebuild_readme_html=function(Description_, CustomReplacement){
			var w;

			var tp =$.fn.tp$;	
			var gio=tp.gio;
			var astub = '<a href="http://';

			//remove JS waring which pollutes the body:
			var to_remove=tp.core.matchChild(/^\s*Readme/i,document.body);
			if(to_remove)document.body.removeChild(to_remove);

			var to_display=tp.core.matchChild(/#@title@#/i,document.body);
			if(to_display){
				w=to_display.innerHTML;
				w=w.replace(/#@title@#/g,Description_.title);
				w=w.replace(/#@WebSiteWithTitle@#/g,  astub + Description_.web_site + '">' + Description_.title + '</a>');

				w=w.replace(/#@description@#/g,Description_.description);
				w=w.replace(/#@version@#/g,Description_.version);
				w=w.replace(/#@date@#/g,Description_.date);
				w=w.replace(/#@language@#/g,Description_.language);
				w=w.replace(/#@usage_requirements@#/g,Description_.usage_requirements);
				w=w.replace(/#@license@#/g,Description_.license);
				w=w.replace(/#@download@#/g,	astub + Description_.download + '">' + Description_.download + '</a>');
				w=w.replace(/#@copyright@#/g,Description_.copyright);
				w=w.replace(/#@email@#/g, Description_.email );
				w=w.replace(/#@web_site@#/g,		astub + Description_.web_site + '">' + Description_.web_site + '</a>');

				w=w.replace(/#@AppRoot@#/g, tp.core.app_webpath_noindex );
				w=w.replace(/#@AppRootTagged@#/g, astub + tp.core.app_webpath_noindex + '/">' + tp.core.app_webpath_noindex + '</a>');


				if( CustomReplacement ) {
					self.each( CustomReplacement, function (key, value) {
						var re = new RegExp( '#@' + key + '@#', 'g' );
						w=w.replace(re, value);
					});
				}


				to_display.innerHTML=w;

				to_display.style.visibility='visible';
			}else{
				document.body.innerHTML='... cannot find readme ...';
			}
			document.title = Description_.title;
		};//self.rebuild_readme_html=function(...



		/// Gets:		first met non-empty property from object
		//	Returns:	null if object is void
		//	TODM:		slow
		self.get_first_or_null = function (obj) {
			if( !obj || typeof obj !== 'object' ) return null;
			var counter = 0;
			var first = '';
			self.each( obj, function (key, value) {
				first = first || key; 
				counter++;
			});
			return counter ? { key : first, counter : counter } : null;
		};


		/// (re)sets primary paths:
		//		when appropriate, with format: http(s):://host[pathname],
		//	 	webpath_to_land_folder_noslash has no tailing slash
		self.reset_path_from_land_to_app_root = function ( from_land_to_root ) {
			self.path_from_page_to_app_root		=	from_land_to_root;
			self.webpath_to_land_folder_noslash	=	window.location.protocol + '//' + 
													self.getFileParent( window.location.hostname + ( window.location.pathname || '/' ) );	
			self.app_webpath_noindex			=	self.webpath_to_land_folder_noslash +
													(self.path_from_page_to_app_root && ( '/' + self.path_from_page_to_app_root ));
		};


		/// Matches http(s):://my_host.com to link http(s)://my_host.com/some
		//	Weak job. TODm improve.
		self.do_match_own_host = function ( link ) {
			var my = ( window.location.protocol + '//' + window.location.hostname ).toLowerCase();
			var ownhost = link && ( link.toLowerCase().indexOf( my ) === 0 );
			return ownhost;
		};


		/*
		self.setup_doc_meta = function(name, text) {
			var metas = document.getElementsByTag('meta');
			// c onsole.log(metas);
			self.each(metas, function(ix, tag){
				var attr = tag.getAttribute(name).toLowerCase();
				if(attr === 'description') {
					tag.setAttribute(text);
			// c onsole.log('new attr='+tag.getAttribute(name));
				}
			});		
	
			window.document.header
		};

		self.setup_doc_meta('description', 'Hello Hello');
		*/



		//. Sets land-root as default app root:
		//	If different, modify after insertion of core_no_jquery.js
		self.reset_path_from_land_to_app_root('');


})();


