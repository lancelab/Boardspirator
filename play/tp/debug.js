
//===========================================================================================
//This is:		a tiny custom debugger
//Purpose:		1.	for case if is not convenient to have Firebug or other debugger,
//				2.	to timestamp execution of a code.
//				3.	stashes messages while no <body> yet loaded, but
//					able to paste them on <body> later
//Dependencies: none
//Package:		"tiny JavaScript package"
//For:			License, Copyright, WebSite, Contact, see this "Package"
//Pollution:	of global namespace is a name window.tp$
//Usual calls:  tp$.deb( arg1, arg2, ..., argN ), tp$.debc..., 
//				tp$.debug(ob [, title [, debug_window_ [, debug_window_parent_]]]);
//===========================================================================================





(function(){  var tp$ = window.tp$ = window.tp$ || {};

	//==============================================================================
	// Default setup
	//==============================================================================
    var CALLS_LIMIT				=1000;
	var TRUNCATE_STRING_TO		=2000;
    var SIZE_LIMIT				=50000;
    var LEVEL_LIMIT				=10;
	var DEFAULT_DEBUG_WINDOW_ID	='tpdebug';	//CSS-id


	//==============================================================================
	// Auxilairy variables and functions
	//==============================================================================
	//Debug-console: DOM-element where debug text will be shown to user
	var debug_window= null;
	var collected_in_session='';
	var calls_count;
	var r;

    var e$ = function(id){ return document.getElementById( id ); };
	//Purpose:	generate blank string comprised with char(32) characters.
	//Input:	length
	var space=function(length){
		var INDENT='                                                                                                           	                                                                              ';
		return INDENT.substr(0,length);
	};
	
	//Purpose:	apparently to add nice indent for tree nodes in deep levels:
	var indentize=function(s,length){
		if(s.length>TRUNCATE_STRING_TO){
			s=s.substr(0,TRUNCATE_STRING_TO)+' ... ';
		}
		return s.replace("\n", "\n" + space(length));
	};
	//==============================================================================
	// End of auxilairy variables and functions
	//==============================================================================




	//========================================================================
	//Purpose:	creates debug_window if not yet exists
	//			if not yet exists, than is taken from function call as object or 
	//			taken from DEFAULT_DEBUG_WINDOW_ID
	//Input:	debug_window_ - dom object. If not supplied, then DEFAULT_DEBUG_WINDOW_ID used to generate this window.
	//			debug_window_parent_ used to attach debug_window to it. If not supplied, attached to document.body
	//========================================================================
	var setup_debug_window=function(debug_window_, debug_window_parent_){
		if(debug_window)return;
        debug_window = debug_window_ || e$(DEFAULT_DEBUG_WINDOW_ID);
        if(debug_window_parent_ || document.body){
            debug_window = document.createElement('div');
			debug_window.setAttribute('id','tp_debug_window');
			debug_window.setAttribute('style',	'visibility:visible; opacity:0.5; position: absolute; '+
												'top: 0px; left:0px; color:#ffaaaa;'); // z-index: 900000000; ');

            //HTML DOM HTMLElement Object: http://ww.w3schools.com/jsref/dom_obj_all.asp
            //document.body.lastChild.appendChild(w);
            w = debug_window_parent_ ? debug_window_parent_ : document.body;
            w.appendChild(debug_window);
		}
	};


	//========================================================================
    //Purpose:		this is a workhorse of debugger. Recursively parses objects.
	//Does:			ads timestamp
	//How works:	collects all data parsed from object tree and adds them
	//				to "collected_in_session" string.
	//				Displays "collected_in_session" as innerHTML of console	
	//Input:		ob - required
	//				other parameters are optional
	//========================================================================
    var debug=tp$.debug=function(ob, title, debug_window_, debug_window_parent_, level){
		var s,w,ww;
		level=level	|| 0;
		title=title || '';
		if(!level){
			w=new Date();
			title=
				'' +(w.getHours()+1)+
				':'+(w.getMinutes()+1)+
				':'+(w.getSeconds()+1)+
				'.'+(w.getMilliseconds()+1)+
				' '+title+' ';
			calls_count=0;
			r=title;
		}
        if(r.length > SIZE_LIMIT)	return r;
		if(level > LEVEL_LIMIT)		return r;
        if(++calls_count > CALLS_LIMIT) return r;

		var t = (typeof ob ); 
        var n = "\n";
        var i = space(title.length);
	    if( t === 'string'){
            s = indentize(ob,i.length);
            r += s + n;
        }else if( t === 'function'){
			//TODm parse conditionally:
			//TODm replace with beatutifier to replace indent:
            s = indentize(ob.toString(),i.length);
            r += s + n;
        }else if( t === 'number' ){
            r += ob + n;
        }else if( t === 'boolean' ){
            r += ob + n;
        }else if( ob === null ){
            r += 'null' + n;
        }else if( t === 'undefined' ){
            r += 'undefined' + n;
        }else if( t === 'object' && ob.length  ){
            for( var j=0; j<ob.length; j++ ){
				w='['+j+']= ';
				r+=(j ? i : '')+w;
				debug(ob[j], space(i.length+w.length), null, null,level+1);
            }
			if(!ob.length)r +=n;
		}else if( t === 'object'){
			var pcount=0;
			for(var p in ob ){

				//Why IE breaks here?:
                //if(ob.hasOwnProperty(p))

                if(ob.hasOwnProperty && ob.hasOwnProperty(p))
				{
					w=' ' + p + '  : ';
					r+=(pcount ? i : '')+w;
					debug(ob[p],space(i.length+w.length), null, null,level+1);
					pcount++;
				}
            }
			//TODm add loop via __proto__
			if(!pcount.length)r +=n;
		}
		if(level===0){
			collected_in_session+=r;
			//Should catch history before page loaded.:
			setup_debug_window(debug_window_, debug_window_parent_);
			if(debug_window)debug_window.innerHTML="<pre>" + collected_in_session + "</pre>"; 
			if(typeof window.console !== 'undefined' && console.log)console.log(r);

			//====================
			//TODm
			//fails,? why?: (console && console.log) || 
			//if(window.console && window.console.log )console.log(r);
			//====================

		}
        return r;
    };


	//========================================================================================================================================
	//credit: https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js  (c) 2005-2010 Sam Stephenson http://www.prototypejs.org/
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    var IE=!!window.attachEvent && !isOpera;
    //var ua = navigator.userAgent;
    //var Opera=isOpera;
    //  WebKit:         ua.indexOf('AppleWebKit/') > -1,
    //  Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
    //  MobileSafari:   /Apple.*Mobile/.test(ua)
	//========================================================================================================================================


	//fails,? why?: (console && console.log) || 


	//==============================================================
	// External calls
	// Input sample:  tp$.deb( myObject, 'This is myObject', ... )
	//					the same for debc
	//--------------------------------------------------------------
	//Purpose:	if window.console exist, debut only to it:
	var debc=tp$.debc=
		(!IE && window.console && typeof console !== 'undefined' && console.log) ||  
		(function(){ for(var i=0; i<arguments.length; i++) debug(arguments[i]); });
	
	//Purpose:	debug to both custom debugger and if exist, to console:
	var deb=tp$.deb=function(){ for(var i=0; i<arguments.length; i++) debug(arguments[i]); };
	//--------------------------------------------------------------
	// External calls
	//==============================================================

})();
