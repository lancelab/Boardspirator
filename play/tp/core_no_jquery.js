(function( ){  // Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.


	var self_name='core';
	//dependency check:
	if(!$.fn.tp$)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	if(!$.fn.tp$.core)alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');

	var self=$.fn.tp$[self_name];


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

			if( (paper.length || paper.length === 0) && !wall.length && wall.length !== 0 )
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
					wall[p]=paste_non_arrays(wall[p],paper[p],level+1);
				}
			}
			return wall;
		};//cloneTwo
		



		// ========================================================================
		// Purpose: Hard cloning. Type, array or non-array, is cloned also.
		// Input:	if no arguments, returns {}
		// Returns: combined clone of trees of each argument
		//			if operand-properties contain array, their result begins array
		// Result:	does not change arguments.
		// ========================================================================
		self.clone_many=function()
		{
			var len=arguments.length; 
			var wall={};
			if(len<1) return wall;

			for(var i=0; i<len; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
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


		//Get parent from path ...XXX/XXX/file
		var getFileParentRegex=/(.*)\/[^\/]*$/;
		self.getFileParent=function(path){
			w=path.match(getFileParentRegex);
			return (w && w[1]) || '';
		};

		// Caption maker helper
		self.capitalizeFirstLetter=function(s){
			if(!s)return '';
			return s.charAt(0).toUpperCase() + s.substr(1);
		};

		// Joins dolength strings from_index in array "strings".
		// Input: from_index and dolength are optional.
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


		//=======================================================
		//Helper. Helps to display credentials and readme file.
		//Inserts credentials into readme.htm.
		//=======================================================
		self.rebuild_readme_html=function(Description_){
			var w;

			var tp =$.fn.tp$;	
			var gio=tp.gio;

			//remove JS waring which pollutes the body:
			var to_remove=tp.core.matchChild(/^\s*Readme/i,document.body);
			if(to_remove)document.body.removeChild(to_remove);

			var to_display=tp.core.matchChild(/#@Title@#/i,document.body);
			if(to_display){
				w=to_display.innerHTML;
				w=w.replace(/#@Title@#/g,Description_.Title);
				w=w.replace(/#@Description@#/g,Description_.Description);
				w=w.replace(/#@Version@#/g,Description_.Version);
				w=w.replace(/#@Date@#/g,Description_.Date);
				w=w.replace(/#@Language@#/g,Description_.Language);
				w=w.replace(/#@SystemRequirements@#/g,Description_.SystemRequirements);
				w=w.replace(/#@License@#/g,Description_.License);
				w=w.replace(/#@Copyright@#/g,Description_.Copyright);
				w=w.replace(/#@Contact@#/g,Description_.Contact);
				w=w.replace(/#@WebSite@#/g,Description_.WebSite);
				to_display.innerHTML=w;

				to_display.style.visibility='visible';
			}else{
				document.body.innerHTML='... cannot find readme ...';
			}
			document.title = Description_.Title;
		};//self.rebuild_readme_html=function(...

})();


