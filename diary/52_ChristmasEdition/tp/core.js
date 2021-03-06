(function( $ ){


	///////////////////////////////////////////////////////////////////////////
	var Description={
		Title			:'tp',
		Description		:'tiny JavaScript package - jQuery.fn.tp$ plugin',
		Version			:'0.0.51',
		Date			:'December 17, 2011',
		License			:'Dual licensed under the MIT or GPL Version 2 licenses.',
		Copyright		:'(c) 2011 Konstantin Kirillov',
		WebSite			:'landkey.net',
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

	//attach subplugin
	$.fn.tp$.core=(function()
	{
		var self={};

		//set core.browser.IE or .....Opera to true or false:
		//usage: 	if(tp.core.browser.IE){ ...
	    self.browser={Opera:Object.prototype.toString.call(window.opera) == '[object Opera]'};
		self.browser.IE = !!window.attachEvent && !(window.core && core.browser && core.browser.Opera);


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
		//Action:			paste trees of objects' sequence into first oblect
		//		 			undefined, nulls, non-objects are igonred
		//					all properties are copied overridingly
		//Implementation:	based on jQuery
		//Note:				check of circular loop is unknown
		//					it relies on jQuery
		//Input:			no restrictions, nulls, undefines, ... are allowed
		//========================================================================
		self.tpaste=function(){
			var len=arguments.length; 

		    var tree_mode=arguments[i];
			var arg_shift=1;
			if(typeof tree_mode === 'boolean'){
				arg_shift=2;
			}else{
				tree_mode=true;					
			}

			var wall={};
			if(len<=arg_shift) return wall;
			wall=arguments[arg_shift-1] || wall; //TODO if ob is arr but wall not

			for(var i=arg_shift; i<len; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				if(tree_mode){
					$.extend(true,wall,ob);
				}else{
					$.extend(wall,ob);
				}
			}
			return wall;
		};


		//Same as tpaste, but only first-level nodes of object tree are pasted.
		self.rpaste=function(){
			var wall=arguments[0] || {};
			for(var i=1; i<arguments.length; i++){
				var ob=arguments[i];
				if(!ob || typeof ob !== 'object')continue;
				self.each(ob,function(k,v){
					wall[k]=v;
				});
				//$.extend(wall,ob);
			}
			return wall;
		};

		//Same as tpaste, but all is pasted into {} which is returned then.
		self.tclone=function(){
			var wall={};
			for(var i=0; i<arguments.length; i++){
				self.tpaste(wall,arguments[i])
			}
			return wall;
		};

		//"References" clone:
		//Same as rpaste, but only first-level nodes of object tree are pasted.
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



		//Emulate "sticky-to-screen-vertical-position-for-popup" dom_el:
		//Credit: http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
		self.do_center_vertically_in_screen=function(dom_el){
			var window_top=$(window).scrollTop();
			var el_top_gap=($(window).height()-$(dom_el).outerHeight())/2;
			$(dom_el).css('top',el_top_gap+window_top);
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


		//=======================================================
		//Helper. Helps to display credentials and readme file.
		//Inserts credentials into readme.htm.
		//=======================================================
		self.rebuid_readme_html=function(Description_){
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
		};//self.rebuid_readme_html=function(...


		return self; //tp return
	})(); //tp end
	
	
})( jQuery );


