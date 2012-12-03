
(function( ){	// Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.


				// * sets the name of subplugin which is extended by this file
				var self_name = 'core';
				// ** checks dependencies for this subplugin
				if(!jQuery.fn.tp$)			alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
				if(!jQuery.fn.tp$.core)		alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');
				// ** makes short reference for this subplugin
				var self = jQuery.fn.tp$[self_name];
				var tp = jQuery.fn.tp$;


	/// Truncates:	string "str" by number of "size_" characters and
	//				appends "dots" if really truncated.
	//				Adds prepend_me and postpend_me if they are supplied and
	//				if str is not empty.
	//	Input:		all is optional,
	//				empty str or invalid data do result in '' returned,
	//				dots - if omitted, set to '... '
	//				If size_ < 0, additionally html-escapes the result and \n with <br>.
	self.dotify = function ( str, size_, prepend_me, postpend_me, dots ) {
		if( !str ) return '';
		var size = Math.abs(size_);
		if( !size || size < 1 ) return '';
		dots = dots || '... ';
		str = str.length <= size ? str : str.substr( 0, size ) + dots;
		if( size_ < 0 ) {
			str = self.htmlencode(str).replace(/$/gm, "<br>");
			//. removes last <br>
			str = str.replace(/<br>$/, "");
		}
		return result = (prepend_me || '') + str + ( postpend_me || '' );
	};



	// ** pastes style properties to element
	var DONT_ADD_PX = { zIndex : true };
	self.paste_style = function(element, style)
	{
		if(typeof element === 'string') element = document.getElementById(element);
		if(!element || !style)return;
		for(var p in style )
		{
			if(style.hasOwnProperty(p))
			{
				var value = style[p];
				value = typeof value === 'number' && !DONT_ADD_PX[p] ? value + 'px' : '' + value;
				element.style[p] = value;
			}
		}
	};



	// ** adds attributes a to element e //TODm not used when created. Remove?
	self.add_attributes=function(e,a)
	{
		if(a)
		{
			for(p in a)
			{
				if(a.hasOwnProperty(p))
				{
					if(p==='style')
					{
						paste_style(e, a[p]);
					}else{
						e.setAttribute(p,a[p]);
					}
				}
			}
		}
	};



	// //\\ BUILDS NESTED CREDITS HTML-DISPLAYS

	//	/.\	AVAILABLE CREDIT KEYS
	var tooltipify_data			=	'title=description=version=version_name=author=';
	tooltipify_data				+=	'editor=copyright=license=date=creation_date=publication_date=web_site=source=';
	tooltipify_data				+=	'copied_from=copied_on=copy_date=bundling_date=influenced_by=';
	tooltipify_data				+=	'email=comments';
	//	\./	AVAILABLE CREDIT KEYS


	//. sets what to show in tooltip
	var tooltip_data			=	'author=title=editor=copyright=license=date=source=web_site=email';

	//. excludes these data from credits-table:
	var tooltipify_desrc_data	=	'description=download=language=usage_requirements';

	//. adds <a> tag
	var anchorize_data			=	'download=source=web_site=copied_from';

	var tooltipify_array		=	tooltipify_data.split('=');
	var tooltip_array			=	tooltip_data.split('=');
	tooltipify_data				=	'=' + tooltipify_data + '=';
	tooltipify_desrc_data		=	'=' + tooltipify_desrc_data + '=';
	tooltip_data				=	'=' + tooltip_data + '=';
	anchorize_data				=	'=' + anchorize_data + '=';
	self.tooltipify_data		=	tooltipify_data;
	

	///	Recreates:	coll.title_compiled_from_credits	
	//				coll.credits_table
	//				coll.description_table
	//				coll.tooltip
	//	Overrides:	coll.credits from description
	//	From:		coll.credits, caption, description
	//	Inputs:		caption, description, no_fixed_width - apparently optional?
	//				email_spam_protection - optional.
	//	Returns:	coll
	self.tooltipify = function ( coll, caption, description, no_fixed_width, email_spam_protection ) {

			caption		= caption || '';
			var cred	= coll.credits = description || coll.credits || {};
			var dot		= self.dotify; 
			var row		= self.add_credit_row;
			var capt	= ( caption && (caption + ' ') ) || '';

			//. protects from spam
			var protected_email = (cred.email && email_spam_protection) ? 
						cred.email.replace(/@/g, ' (a) ').replace(/\./g, '(.)') :
						cred.email;

			//: compiles title from credits
			var title	= dot( cred.title, -50 );
			title		= title || dot(cred.author, -50);
			title		= title || dot(cred.source, -50);
			coll.title_compiled_from_credits = title;


			/// compiles tooltip
			var ww_tt = '';
			self.each( tooltip_array, function (index, key) {
				var cap = titlify(key);
				if( key === 'author' || key === 'title' || key === 'editor' ) {
					cap = capt + cap + ': ';
				}else{
					cap = ' ' + cap + ': ';
				}
				//. makes correction only for email
				var value = key === 'email' ? protected_email : cred[key];
				//. 300 is hard-coded truncation limit
				ww_tt += dot(value,	300, cap, " *** \n");
			});
			coll.tooltip = self.htmlencode(ww_tt);



			// //\\ makes innerHTML-tables of descriptions

			var astub = '<a target="_blank" style="text-decoration:none; color:#AAAAFF; " ' +
							"onmouseover = \"this.style.color = '#CCFFFF';\" " +
							"onmouseout  = \"this.style.color = '#AAAAFF';\" " +
							'href="';
			var grad = tp.gui.set_grad_dynamically( '#009999', '#002222' );

			var tabstart =	'<div style="';
			if( !no_fixed_width ) tabstart +=	'width:400px; overflow:auto; ';
			tabstart +=	grad + ' padding : 7px; border-radius : 7px; font-family:arial, helvetica; ">';

			var tablestart = '<table style="border-spacing:0px; ">';
			var tabend = '</table></div>';

			/// builds credit and description tables
			//. credits table
			var tbl = '';
			//. description table
			var dt = tbl;
			self.each( tooltipify_array, function (index, key) {
				if( anchorize_data.indexOf( '=' + key + '=' ) > -1 ) {
					var ww = row( cred[key], titlify(key),	astub,
							"\">" + ( cred[key] && self.htmlencode( cred[key] )) + "</a>");
				}else{
					var ww = row(cred[key], titlify(key) );
				}
				dt += ww;
				if( tooltipify_desrc_data.indexOf( '=' + key + '=' ) < 0 ) tbl += ww;
			});



			var second_cred = '';
			if( cred.credits ) {
				tp.core.each( cred.credits, function( key, credit ) {
					var ob = { credits : credit }; 
					//console.log( 'credit adding to dt =', credit );
					var extra_credit = row( self.tooltipify( ob, '', null, 'no width' ).credits_table, 							
										   "Credits", "", "", "no_dot" );
					dt += extra_credit;
					tbl += extra_credit;
			});}

			capt					= capt && ( "<h3>" + capt + "</h3>" );
			coll.credits_table		= tabstart + capt +  tablestart + tbl + tabend;
			coll.description_table	= tabstart + capt +  tablestart + dt + tabend;
			return coll;
			// \\// makes innerHTML-tables of descriptions
	};



	self.add_credit_row = function ( data, caption, prefix, posfix, no_dotify ) {
		prefix = prefix || '';
		posfix = posfix || '';
		var trtd = "<tr><td style=\"vertical-align:top;\">";
		var tdtr = "</td></tr>";
		var tdtd = ":</td><td>";
		if( no_dotify ) return trtd + caption + tdtd + prefix + data + posfix + tdtr;
		return self.dotify( data, -300, trtd + caption + tdtd + prefix , posfix + tdtr);
	};

	// \\// BUILDS NESTED CREDITS HTML-DISPLAYS




	/// Returns function which parses by this fomat from beginning of string:
	//			marker --- key --- \s|:|= --- trimmed value with possible spacers ---
	//			where --- stands for possible space
	//	Inputs:	marker, part of reg-ex syntax resulting in non-empty token, match[1]
	self.make_kv_parser = function ( marker ) {
		var reg = new RegExp(
				"(" + marker + ")" +
				"\\s*([^\\t :=]+)\\s*(?:\\s|=|:)\\s*([^\\t :=](?:.*\\S|\\S)*)\\s*$", "i");

		///	This function does:
		//		if obj and key are supplied and key is discovered,
		//			then assigns obj[key] = value,
		//		returns match array or null if match failed
		//		Sugar:
		//			If discovered key is in format parent.child,
		//				obj[parent][child] is assumed.
		//	Inputs:	all except string is optional,
		//			if preserve_case supplied, then property is set as is,
		//			otherwise, property is taken as low-keys of discovered key
		return (function( string, obj, key, preserve_case ) {
			var match = string.match(reg);
			if( match && obj ) {
				if( key ) {
					if( match[2] === key && match[3] ) obj[key] = match[3];
				}else{
					if( match[2] ) {
						var property = preserve_case ? match[2] : match[2].toLowerCase();
						var value = self.str2multiline( match[3] );
						if( property.indexOf('.') > -1 ) {
							//:: splits key to parent and child properties
							var props = property.split('.');
							obj[props[0]] = obj[props[0]] || {};
							obj[props[0]][props[1]] = value;
						}else{
							obj[property] = value;
						}
					}
				}
			}
			return match || null;
		});
	};



	/// in given string, str, replaces \n and \\ with line-feed and slash
	var str2multiline_lf = /\\n/g;
	var str2multiline_sl = /\\\\/g;
	self.str2multiline = function ( str ) {
		if( !str ) return '';
		return str.replace( str2multiline_lf, "\n" ).replace( str2multiline_sl, "\\" );
	}



	/// Acts:		extends object's property-tree and assigns value to a leaf-property
	//	Usage:		call propertify( obj, 'credits', 'title', 'Work' ) assigns
	//				obj.credits.title = 'Work' even credits initially does not exist.
	//	Input:		if last argument, value, is !!value, then no job happens.
	//	Returns:	null if failed, otherwise returns obj itself 
	self.propertify = function () {

		var len = arguments.length - 2;
		if( len < 1 ) return null;
		var obj = arguments[0];
		if( !obj || (typeof obj !== 'object') ) return null;
		var value = arguments[len+1];
		if( !value ) return obj;
		var last_obj = obj;

		for( var ii=1; ii < len; ii++ ) {
			//:: appends objects if missed
			var prop = arguments[ii];
			if( (!obj[prop] || (typeof obj[prop] !== 'object')) && ii < len ) {
				obj[prop] = {};
			}
			var last_obj = obj[prop];
		}
		last_obj[arguments[len]] = value;
		return obj;
	};


	/// converts main_caption_title to "Main Caption Title"
	var _captionize =/^\S|_\S/g;
	var captionize = self.captionize = function( str ) {
			return str.replace(
					_captionize,
					function(match) {
						return match.toUpperCase().replace('_', ' ');
					}
			);
	}

	/// converts mr_Good_work to "Mr Good work"
	var _titlify_beg	=/^\S/;
	var _titlify_mid	=/_/g;
	var titlify = self.titlify = function( str ) {
			return str.replace(
					_titlify_beg,
					function(match) {
						return match.toUpperCase();
					}
			).replace( _titlify_mid, ' '
			);
	}


})();


