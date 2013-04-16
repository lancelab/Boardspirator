/*!
 * jQuery JavaScript Library v1.9.0
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-1-14
 */
(function( window, undefined ) {
"use strict";
var
	rootjQuery,
	readyList,
	document = window.document,
	location = window.location,
	_jQuery = window.jQuery,
	_$ = window.$,
	class2type = {},
	core_deletedIds = [],

	core_version = "1.9.0",
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,
	jQuery = function( selector, context ) {
		return new jQuery.fn.init( selector, context, rootjQuery );
	},
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
	core_rnotwhite = /\S+/g,
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};

jQuery.fn = jQuery.prototype = {
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;
		if ( !selector ) {
			return this;
		}
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}
			if ( match && (match[1] || !context) ) {
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;
				} else {
					elem = document.getElementById( match[2] );
					if ( elem && elem.parentNode ) {
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );
			} else {
				return this.constructor( context ).find( selector );
			}
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},
	selector: "",
	length: 0,
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},
	get: function( num ) {
		return num == null ?
			this.toArray() :
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},
	pushStack: function( elems ) {
		var ret = jQuery.merge( this.constructor(), elems );
		ret.prevObject = this;
		ret.context = this.context;
		return ret;
	},
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},
	push: core_push,
	sort: [].sort,
	splice: [].splice
};
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		if ( (options = arguments[ i ]) != null ) {
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				if ( target === copy ) {
					continue;
				}
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}
					target[ name ] = jQuery.extend( deep, clone, copy );
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	isReady: false,
	readyWait: 1,
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},
	ready: function( wait ) {
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}
		jQuery.isReady = true;
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}
		readyList.resolveWith( document, [ jQuery ] );
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {
			data = jQuery.trim( data );

			if ( data ) {
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}
		return core_concat.apply( [], ret );
	},
	guid: 1,
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();
		if ( document.readyState === "complete" ) {
			setTimeout( jQuery.ready );
		} else if ( document.addEventListener ) {
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			window.addEventListener( "load", jQuery.ready, false );
		} else {
			document.attachEvent( "onreadystatechange", DOMContentLoaded );
			window.attachEvent( "onload", jQuery.ready );
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}
rootjQuery = jQuery(document);
var optionsCache = {};
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		fired,
		firing,
		firingStart,
		firingLength,
		firingIndex,
		list = [],
		stack = !options.once && [],
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		self = {
			add: function() {
				if ( list ) {
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								add( arg );
							}
						});
					})( arguments );
					if ( firing ) {
						firingLength = list.length;
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			empty: function() {
				list = [];
				return this;
			},
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			disabled: function() {
				return !list;
			},
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !stack;
			},
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};
		promise.pipe = promise.then;
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];
			promise[ tuple[1] ] = list.add;
			if ( stateString ) {
				list.add(function() {
					state = stateString;
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});
		promise.promise( deferred );
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a, select, opt, input, fragment, eventName, isSupported, i,
		div = document.createElement("div");
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		getSetAttribute: div.className !== "t",
		leadingWhitespace: div.firstChild.nodeType === 3,
		tbody: !div.getElementsByTagName("tbody").length,
		htmlSerialize: !!div.getElementsByTagName("link").length,
		style: /top/.test( a.getAttribute("style") ),
		hrefNormalized: a.getAttribute("href") === "/a",
		opacity: /^0.5/.test( a.style.opacity ),
		cssFloat: !!a.style.cssFloat,
		checkOn: !!input.value,
		optSelected: opt.selected,
		enctype: !!document.createElement("form").enctype,
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",
		boxModel: document.compatMode === "CSS1Compat",
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;
	select.disabled = true;
	support.optDisabled = !opt.disabled;
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );
	support.appendChecked = input.checked;
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
			body.style.zoom = 1;
		}

		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;
	
function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",
		isNode = elem.nodeType,
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}
	if ( getByName ) {
		ret = thisCache[ name ];
		if ( ret == null ) {
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt /* For internal use only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i, l,

		isNode = elem.nodeType,
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {
			if ( !jQuery.isArray( name ) ) {
				if ( name in thisCache ) {
					name = [ name ];
				} else {
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}
	if ( !pvt ) {
		delete cache[ id ].data;
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),
	noData: {
		"embed": true,
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data, false );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name, false );
	},
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},
	
	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}
			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					jQuery._data( this, "__className__", this.className );
				}
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					ret.replace(rreturn, "") :
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;
				for ( ; i < max; i++ ) {
					option = options[ i ];
					if ( ( option.selected || i === index ) &&
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
						value = jQuery( option ).val();
						if ( one ) {
							return value;
						}
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			if ( typeof elem.getAttribute !== "undefined" ) {
				ret =  elem.getAttribute( name );
			}
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;
				if ( rboolean.test( name ) ) {
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});
boolHook = {
	get: function( elem, name ) {
		var
			prop = jQuery.prop( elem, name ),
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				elem.defaultValue = value;
			} else {
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}
if ( !getSetAttribute ) {
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = elem.nodeType !== 3 && elem.nodeType !== 8 && jQuery._data( elem );

		if ( !elemData ) {
			return;
		}
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			eventHandle.elem = elem;
		}
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();
			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			special = jQuery.event.special[ type ] || {};
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}
			jQuery.event.global[ type ] = true;
		}
		elem = null;
	},
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = event.type || event,
			namespaces = event.namespace ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};
		args[0] = event;
		event.delegateTarget = this;
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			noBubble: true
		},
		click: {
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;
	} else {
		this.type = src;
	}
	if ( props ) {
		jQuery.extend( this, props );
	}
	this.timeStamp = src && src.timeStamp || jQuery.now();
	this[ jQuery.expando ] = true;
};
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}
		if ( e.preventDefault ) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
		},

		postDispatch: function( event ) {
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}
			jQuery.event.remove( this, "._submit" );
		}
	};
}
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;
		if ( typeof types === "object" ) {
			if ( typeof selector !== "string" ) {
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				fn = data;
				data = undefined;
			} else {
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},
	whitespace = "[\\x20\\t\\r\\n\\f]",
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	identifier = characterEncoding.replace( "w", "w#" ),
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /\{\s*\[native code\]\s*\}/,
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		return high !== high ?
			escaped :
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					if ( elem && elem.parentNode ) {
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}
	document = doc;
	docElem = doc.documentElement;
	documentIsXML = isXML( doc );
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		return type !== "boolean" && type !== "string";
	});
	support.getByClassName = assert(function( div ) {
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});
	support.getByName = assert(function( div ) {
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );
		var pass = doc.getElementsByName &&
			doc.getElementsByName( expando ).length === 2 +
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );
		docElem.removeChild( div );

		return pass;
	});
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );
			if ( tag === "*" ) {
				for ( ; (elem = results[i]); i++ ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};
	rbuggyMatches = [];
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		assert(function( div ) {
			div.innerHTML = "<select><option selected=''></option></select>";
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			support.disconnectedMatch = matches.call( div, "div" );
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return ( ~b.sourceIndex || MAX_NEGATIVE ) - ( contains( preferredDoc, a ) && ~a.sourceIndex || MAX_NEGATIVE );
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			siblingCheck( ap[i], bp[i] ) :
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}
	expr = expr.replace( rattributeQuotes, "='$1']" );
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );
			if ( ret || support.disconnectedMatch ||
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = a && b && a.nextSibling;

	for ( ; cur; cur = cur.nextSibling ) {
		if ( cur === b ) {
			return -1;
		}
	}

	return a ? 1 : -1;
}
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		for ( ; (node = elem[i]); i++ ) {
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	return ret;
};

Expr = Sizzle.selectors = {
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}
			if ( match[4] ) {
				match[2] = match[4];
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				(excess = tokenize( unquoted, true )) &&
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];
						if ( forward && useCache ) {
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];
						} else {
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );
			if ( fn[ expando ] ) {
				return fn( argument );
			}
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),
		"lang": markFunction( function( lang ) {
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},
		"empty": function( elem ) {
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
					[] :
					results :
				matcherIn;
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
			if ( matcher[ expando ] ) {
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}
				if ( bySet ) {
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}
					setMatched = condense( setMatched );
				}
				push.apply( results, setMatched );
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		if ( match.length === 1 ) {
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}
			for ( i = matchExpr["needsContext"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}
Expr.pseudos["nth"] = Expr.pseudos["eq"];
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();
setDocument();
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < self.length; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < this.length; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}
		ret = this.pushStack( jQuery.unique( ret ) );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},
	index: function( elem ) {
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}
		return jQuery.inArray(
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
function winnow( elements, qualifier, keep ) {
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent && this.nodeType === 1 || this.nodeType === 11 ) {

				jQuery( this ).remove();

				if ( next ) {
					next.parentNode.insertBefore( elem, next );
				} else {
					parent.appendChild( elem );
				}
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
					jQuery.map( scripts, restoreScript );
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, data, e;
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}
		dest.removeAttribute( jQuery.expando );
	}
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {

		dest.defaultChecked = dest.checked = src.checked;
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, srcElements, node, i, clone,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			destElements = getAll( clone );
			srcElements = getAll( elem );
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var contains, elem, tag, tmp, wrap, tbody, j,
			l = elems.length,
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}
					if ( !jQuery.support.tbody ) {
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );
					tmp.textContent = "";
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}
					tmp = safe.lastChild;
				}
			}
		}
		if ( tmp ) {
			safe.removeChild( tmp );
		}
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );
			tmp = getAll( safe.appendChild( elem ), "script" );
			if ( contains ) {
				setGlobalEval( tmp );
			}
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( cache[ id ] ) {

						delete cache[ id ];
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var curCSS, getStyles, iframe,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
function vendorPropName( style, name ) {
	if ( name in style ) {
		return name;
	}
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else if ( !values[ index ] && !isHidden( elem ) ) {
			jQuery._data( elem, "olddisplay", jQuery.css( elem, "display" ) );
		}
	}
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},
	cssProps: {
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},
	style: function( elem, name, value, extra ) {
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
		if ( value !== undefined ) {
			type = typeof value;
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				type = "number";
			}
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}
		if ( extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		4 :
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	if ( val <= 0 || val == null ) {
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}
		if ( rnumnonpx.test(val) ) {
			return val;
		}
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );
		val = parseFloat( val ) || 0;
	}
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );
		if ( display === "none" || !display ) {
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";
			style.zoom = 1;
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {
				style.removeAttribute( "filter" );
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				add( prefix, v );

			} else {
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		add( prefix, obj );
	}
}
var
	ajaxLocParts,
	ajaxLocation,
	
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},
	allTypes = "*/".concat("*");
try {
	ajaxLocation = location.href;
} catch( e ) {
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
function addToPrefiltersOrTransports( structure ) {
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			while ( (dataType = dataTypes[i++]) ) {
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}
	if ( jQuery.isFunction( params ) ) {
		callback = params;
		params = undefined;
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {
			response = arguments;

			self.html( selector ?
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({
	active: 0,
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},
		converters: {
			"* text": window.String,
			"text html": true,
			"text json": jQuery.parseJSON,
			"text xml": jQuery.parseXML
		},
		flatOptions: {
			url: true,
			context: true
		}
	},
	ajaxSetup: function( target, settings ) {
		return settings ?
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),
	ajax: function( url, options ) {
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}
		options = options || {};

		var transport,
			cacheURL,
			responseHeadersString,
			responseHeaders,
			timeoutTimer,
			parts,
			fireGlobals,
			i,
			s = jQuery.ajaxSetup( {}, options ),
			callbackContext = s.context || s,
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			statusCode = s.statusCode || {},
			requestHeaders = {},
			requestHeadersNames = {},
			state = 0,
			strAbort = "canceled",
			jqXHR = {
				readyState: 0,
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
		s.type = options.method || options.type || s.method || s.type;
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
		if ( state === 2 ) {
			return jqXHR;
		}
		fireGlobals = s.global;
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}
		s.type = s.type.toUpperCase();
		s.hasContent = !rnoContent.test( s.type );
		cacheURL = s.url;
		if ( !s.hasContent ) {
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				delete s.data;
			}
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			return jqXHR.abort();
		}
		strAbort = "abort";
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				if ( state < 2 ) {
					done( -1, e );
				} else {
					throw e;
				}
			}
		}
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;
			if ( state === 2 ) {
				return;
			}
			state = 2;
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}
			transport = undefined;
			responseHeadersString = headers || "";
			jqXHR.readyState = status > 0 ? 4 : 0;
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}
			if ( status >= 200 && status < 300 || status === 304 ) {
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}
				if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		finalDataType = finalDataType || firstDataType;
	}
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		converters = {},
		i = 0,
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}
	for ( ; (current = dataTypes[++i]); ) {
		if ( current !== "*" ) {
			if ( prev !== "*" && prev !== current ) {
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];
				if ( !conv ) {
					for ( conv2 in converters ) {
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								if ( conv === true ) {
									conv = converters[ conv2 ];
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}
				if ( conv !== true ) {
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
			prev = current;
		}
	}

	return { state: "success", data: response };
}
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});
jQuery.ajaxTransport( "script", function(s) {
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
						script.onload = script.onreadystatechange = null;
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}
						script = null;
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};
		s.dataTypes[ 0 ] = "json";
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};
		jqXHR.always(function() {
			window[ callbackName ] = overwritten;
			if ( s[ callbackName ] ) {
				s.jsonpCallback = originalSettings.jsonpCallback;
				oldCallbacks.push( callbackName );
			}
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	createStandardXHR;
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var handle, i,
						xhr = s.xhr();
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}
					xhr.send( ( s.hasContent && s.data ) || null );
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;
						try {
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
								callback = undefined;
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}
								if ( isAbort ) {
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									xml = xhr.responseXML;
									responseHeaders = xhr.getAllResponseHeaders();
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										statusText = "";
									}
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						callback();
					} else if ( xhr.readyState === 4 ) {
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );
				if ( unit !== "px" && start ) {
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						scale = scale || ".5";
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}
			result = jQuery.css( tween.elem, tween.prop, "auto" );
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {
		return this.filter( isHidden ).css( "opacity", 0 ).show()
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;
			data.finish = true;
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}
			delete data.finish;
		});
	}
});
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	_default: 400
};
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			offset = elem.getBoundingClientRect();
		} else {
			offsetParent = this.offsetParent();
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					return elem.document.documentElement[ "client" + name ];
				}
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					jQuery.css( elem, type, extra ) :
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
window.jQuery = window.$ = jQuery;
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );






(function(){  var tp$ = window.tp$ = window.tp$ || {};
    var CALLS_LIMIT				=1000;
	var TRUNCATE_STRING_TO		=2000;
    var SIZE_LIMIT				=50000;
    var LEVEL_LIMIT				=10;
	var DEFAULT_DEBUG_WINDOW_ID	='tpdebug';	//CSS-id
	var debug_window= null;
	var collected_in_session='';
	var calls_count;
	var r;

    var e$ = function(id){ return document.getElementById( id ); };
	var space=function(length){
		var INDENT='                                                                                                           	                                                                              ';
		return INDENT.substr(0,length);
	};
	var indentize=function(s,length){
		if(s.length>TRUNCATE_STRING_TO){
			s=s.substr(0,TRUNCATE_STRING_TO)+' ... ';
		}
		return s.replace("\n", "\n" + space(length));
	};

	var c_onsole_log = 
		!IE && window.console &&
		typeof console !== 'undefined' &&
		console.log;  // *** safe c onsole.log	
	var c_onsole_clear = console.log &&  console.clear;  // *** safe c onsole.log
	var setup_debug_window=function(debug_window_, debug_window_parent_){
		if(debug_window)return;
        debug_window = debug_window_ || e$(DEFAULT_DEBUG_WINDOW_ID);
		if(debug_window)return;
        if(debug_window_parent_ || document.body){
            debug_window = document.createElement('div');
			debug_window.setAttribute('id','tp_debug_window');
			debug_window.setAttribute('style',	'visibility:visible; opacity:0.5; position: absolute; '+
												'top: 0px; left:0px; color:#ffaaaa;'); // z-index: 900000000; ');
            w = debug_window_parent_ ? debug_window_parent_ : document.body;
            w.appendChild(debug_window);
		}
	};
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

                if(ob.hasOwnProperty && ob.hasOwnProperty(p))
				{
					w=' ' + p + '  : ';
					r+=(pcount ? i : '')+w;
					debug(ob[p],space(i.length+w.length), null, null,level+1);
					pcount++;
				}
            }
			if(!pcount.length)r +=n;
		}
		if(level===0){
			collected_in_session+=r;
			setup_debug_window(debug_window_, debug_window_parent_);
			if(debug_window)debug_window.innerHTML="<pre>" + collected_in_session + "</pre>"; 
			if( c_onsole_log ) c_onsole_log( r );

		}
        return r;
    };
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    var IE=!!window.attachEvent && !isOpera;
	var debc=tp$.debc =
		c_onsole_log ||
		(function(){ for(var i=0; i<arguments.length; i++) debug(arguments[i]); });
	var deb = tp$.deb = function(){ 
		if( arguments.length === 0 ){
			if( debug_window ) debug_window.innerHTML = "<pre> </pre>"; 
			if( c_onsole_clear ) c_onsole_clear();
			collected_in_session = '';
		}
		for(var i=0; i<arguments.length; i++) debug(arguments[i]); 
	};
	window.cccc = function () {
		if( !c_onsole_log ) return;
		for( var ii=0; ii < arguments.length; ii++) {
			c_onsole_log( arguments[ ii ] );
		}
	}

})();


( function( $ ) {
	var Description={
		title			:'tp',
		description		:'Tool Package - jQuery.fn.tp$ plugin',
		version			:'0.0.96',
		date			:'June 15, 2012',
		license			:'Dual licensed under the MIT or GPL Version 2 licenses.',
		copyright		:'(c) 2011-2012 Konstantin Kirillov',
		web_site		:'landkey.net/gio/gio/bs/tp/',
		contact			:'e m a i l:  b e a v e r s c r i p t   a t   l a n d k e y . n e t'
	};
	var deb = window.tp$ && window.tp$.deb;
	$.fn.tp$ = ( function( choice, arg ) {

					var that= this && this[0];
					if( !that ) return;
					return $.fn.tp$.beautify_el[ choice ].call( that, arg );
	});
	$.fn.tp$.description=Description;	
	$.fn.tp$.core=(function(){

		var self={};
		self.do_center_vertically_in_screen=function(dom_el){
			var window_top=$(window).scrollTop();
			var el_top_gap=($(window).height()-$(dom_el).outerHeight())/2;
			$(dom_el).css('top',el_top_gap+window_top);
		};
		self.download_object = function( url, obj, property, do_paste, async, timeout ) {

			var obj_supplied		= !!obj;
			obj						= obj || {};
			property				= property || 'result';
			obj[ property ]			= obj[ property ] || null;

			var ajax_call = {
				url			: url,
				async		: !!async,
				cache		: false,
				dataType	: 'json',
				timeout		: timeout || 1000,
				success		: function( data, textStatus ) {

					if( textStatus === 'success' ) {
						if( do_paste ) {
							obj[ property ] = self.clone_many( obj[ property ], data );
						}else{
							obj[ property ] = data;
						}
					}
				}
			};
			$.ajax( ajax_call ).fail( function( explanation ) {
				var ww ='Ajax failed to load object.';
				if( deb ) {
					deb( ww + ' url=' + url + "\n");
					deb( "Possible error status = " + arguments[1]);
					deb( "Possible error expanation = " + arguments[2]);
				}
			});

			return obj[ property ];
		};


		return self; //tp return

	})(); //tp end
	
	
})( jQuery );




(function( ){	// Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.
				var self_name = 'core';
				if(!jQuery.fn.tp$)			alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
				if(!jQuery.fn.tp$.core)		alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');
				var self = jQuery.fn.tp$[self_name];
				var deb = window.tp$ && window.tp$.deb;



	self.userAgent = navigator.userAgent;
		self.browser = (function(){
		    var isOpera =	Object.prototype.toString.call(window.opera) ===
							'[object Opera]';
			var ua=self.userAgent;
			return {
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
		self.each = function( ob, fun )
		{
			if( typeof ob === 'object' && ob !== null ){
				var ret;
				var len=ob.length;
				if( len || len === 0 )
				{
					for(var i=0; i<len; i++)
					{
						ret = fun( i, ob[ i ] );
						if( ret !== undefined && !ret ) break; // (*)
					}
				}else{
					for( var p in ob )
					{
						if( ob.hasOwnProperty( p ) )
						{
							ret = fun( p, ob[ p ] );
							if( ret !== undefined && !ret ) break; // (**)
						}
					}
				}
			}
			return ob;
		}
		var paste_non_arrays = self.paste_non_arrays=function( wall, paper, level, skip_undefined )
		{

			level = level || 0;
			var t = typeof paper;
			if(!level && (t=='undefined' || paper === null )) return wall;

			if(t == 'undefined' || t == 'string' || t=='boolean' || t=='number' || t=='function' || paper === null)
			{
				return paper;
			}
			if(typeof wall !== 'object' || wall === null)
			{
				wall={};				
			}

			var arr_detector = !!paper.length || paper.length === 0;
			if( arr_detector && !wall.length && wall.length !== 0 ) //TODM Bad test. Use "Array protot" instead.
			{
				var wall_preserved = wall;
				wall = [];
				paste_non_arrays( wall, wall_preserved );
			}
			for(var p in paper )
			{
				if(paper.hasOwnProperty( p ) ) //TODO when works on arrays? when not fails on 'length'?
				{
					if( p !== 'length' )
					{
						var ww = paste_non_arrays( wall[ p ], paper[ p ], level + 1 );
						if( ! ( ( arr_detector || skip_undefined ) && typeof ww === 'undefined' )  )
						{
							wall[ p ] = ww;
						}


					}else{
						throw "Reserved word \"length\" used as a property"; //TODO
					}
				}
			}
			return wall;
		};// ...paste_non_arrays=function...
		


		self.tppaste = function ()
		{
			var len		= arguments.length; 
			var wall	= {};
			if( len < 1 ) return wall;

			wall = arguments[0] || wall;
			
			for( var i=1; i < len; i++ )
			{
				var ob = arguments[i];
				if( !ob || typeof ob !== 'object' ) continue;
				wall = paste_non_arrays( wall, ob );
			}
			return wall;
		};
		self.clone_many=function()
		{
			var len=arguments.length; 
			var wall={};
			if(len<1) return wall;

			for(var i=0; i<len; i++){
				var ob=arguments[i];
				if( !ob || typeof ob !== 'object' ) continue;
				wall = self.paste_non_arrays(wall, ob);
			}
			return wall;
		};
		self.tclone = function ()
		{
			var len		= arguments.length; 
			var wall	= {};
			if( len < 1 ) return wall;
			for( var i = 0; i < len; i++ )
			{
				var ob = arguments[ i ];
				if( !ob || typeof ob !== 'object' ) continue;
				wall = self.paste_non_arrays( wall, ob, 0, 'no undefines' );
			}
			return wall;
		};
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
		self.rclone=function(){
			var wall={};
			for(var i=0; i<arguments.length; i++){
				self.rpaste(wall,arguments[i])
			}
			return wall;
		};
		var htmlencode=self.htmlencode = function(s){
				return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		};
		self.pre2html=function(s){return htmlencode(s).replace(/\n/g,"<br />\n"); };
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
				if( parent === document )break;
				parent=parent.parentNode;
			}
			return false;
		};
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
		self.getQueryPar=function(key){
			var w=window.location.search;
			var re=new RegExp('(?:&|\\?)'+key+'(?:=([^&]*))*(?:&|$)');
			w=w.match(re);
			return !!w && (w[1] || true);
		};
		self.getIntegerQueryPar=function(key){
			var value=self.getQueryPar(key);
			if( typeof value !== 'string' ) return false;
			if(isNaN(value)) return false;
			value =Math.floor(parseInt(value));
			return value;
		}
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
		var getFileParentRegex=/(.*)\/[^\/]*$/;
		self.getFileParent=function(path){

			var ww=path.match(getFileParentRegex);
			return (ww && ww[1]) || '';
		};
		self.capitalizeFirstLetter=function(s){
			if(!s)return '';
			return s.charAt(0).toUpperCase() + s.substr(1);
		};
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
		self.rebuild_readme_html=function(Description_, CustomReplacement){
			var w;

			var tp =$.fn.tp$;	
			var gio=tp.gio;
			var astub = '<a href="http://';
			self.remove_warning_about_absent_JS( "if no JavaScript language enabled in your browser" );


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
		var lo_port = ( window.location.port && (window.location.port + '') ) || '';
		if( lo_port === '80' ) lo_port = '';
		lo_port = lo_port && ( ':' + lo_port );
		var lo_my_host = ( window.location.protocol + '//' + window.location.hostname + lo_port ).toLowerCase();
		self.reset_path_from_land_to_app_root = function ( from_land_to_root ) {
			self.path_from_page_to_app_root		=	from_land_to_root;
			self.webpath_to_land_folder_noslash	=	window.location.protocol + '//' + 
													self.getFileParent( window.location.hostname + lo_port + ( window.location.pathname || '/' ) );	
			self.app_webpath_noindex			=	self.webpath_to_land_folder_noslash +
													(self.path_from_page_to_app_root && ( '/' + self.path_from_page_to_app_root ));
		};
		self.do_match_own_host = function ( link ) {
			var ownhost = link && ( link.toLowerCase().indexOf( lo_my_host ) === 0 );
			return ownhost;
		};


		/*
		self.setup_doc_meta = function(name, text) {
			var metas = document.getElementsByTag('meta');
			self.each(metas, function(ix, tag){
				var attr = tag.getAttribute(name).toLowerCase();
				if(attr === 'description') {
					tag.setAttribute(text);
				}
			});		
	
			window.document.header
		};

		self.setup_doc_meta('description', 'Hello Hello');
		*/
		self.reset_path_from_land_to_app_root( ( window.tp$ && window.tp$.reset_path_from_land_to_app_root ) || '' );
		self.remove_warning_about_absent_JS = function ( warning_key_regex_string ) {
			var removal_regex = new RegExp( warning_key_regex_string, 'i' );
			var to_remove = self.matchChild( removal_regex, document.body );
			if( to_remove ) {

				to_remove.style.display='none';
			}

		};



})();




(function( ){	// Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.
				var self_name = 'core';
				if(!jQuery.fn.tp$)			alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
				if(!jQuery.fn.tp$.core)		alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');
				var self = jQuery.fn.tp$[self_name];
				var tp = jQuery.fn.tp$;
	self.dotify = function ( str, size_, prepend_me, postpend_me, dots ) {
		if( !str ) return '';
		var size = Math.abs(size_);
		if( !size || size < 1 ) return '';
		dots = dots || '... ';
		str = str.length <= size ? str : str.substr( 0, size ) + dots;
		if( size_ < 0 ) {
			str = self.htmlencode(str).replace(/$/gm, "<br>");
			str = str.replace(/<br>$/, "");
		}
		return result = (prepend_me || '') + str + ( postpend_me || '' );
	};
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
	var tooltipify_data			=	'title=description=version=version_name=maturity=';
	tooltipify_data				+=	'author=editor=influenced_by=inspired_by=contributed_by=contributed=';
	tooltipify_data				+=	'copyright=license=license_text=license_link=';
	tooltipify_data				+=	'created=date=creation_date=publication_date=';
	tooltipify_data				+=	'download=web_site=inspired_by_web_site=source=inspired_by_link=';
	tooltipify_data				+=	'copied_from=copied_on=copy_date=bundling_date=';
	tooltipify_data				+=	'email=developer_comment=comments=';
	var tooltip_data			=	'author=title=editor=copyright=license=date=source=web_site=email';
	var tooltipify_desrc_data	=	'description=maturity=language=usage_requirements=developer_comment';
	var anchorize_data			=	'inspired_by_web_site=download=source=web_site=copied_from=inspired_by_link=license_link=';

	var tooltipify_array		=	tooltipify_data.split('=');
	var tooltip_array			=	tooltip_data.split('=');
	tooltipify_data				=	'=' + tooltipify_data + '=';
	tooltipify_desrc_data		=	'=' + tooltipify_desrc_data + '=';
	tooltip_data				=	'=' + tooltip_data + '=';
	anchorize_data				=	'=' + anchorize_data + '=';
	self.tooltipify_data		=	tooltipify_data;
	self.tooltipify_array		=	tooltipify_array;
	self.tooltipify = function ( coll, caption, description, no_fixed_width, email_spam_protection ) {

			caption		= caption || '';
			var cred	= coll.credits = description || coll.credits || {};
			var dot		= self.dotify; 
			var row		= self.add_credit_row;
			var capt	= ( caption && (caption + ' ') ) || '';
			var protected_email = (cred.email && email_spam_protection) ? 
						cred.email.replace(/@/g, ' (a) ').replace(/\./g, '(.)') :
						cred.email;
			var title	= dot( cred.title, -50 );
			title		= title || dot(cred.author, -50);
			title		= title || dot(cred.source, -50);
			coll.title_compiled_from_credits = title;
			var ww_tt = '';
			self.each( tooltip_array, function (index, key) {
				var cap = titlify(key);
				if( key === 'author' || key === 'title' || key === 'editor' ) {
					cap = capt + cap + ': ';
				}else{
					cap = ' ' + cap + ': ';
				}
				var value = key === 'email' ? protected_email : cred[key];
				ww_tt += dot(value,	300, cap, " *** \n");
			});
			coll.tooltip = self.htmlencode(ww_tt);

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
			var tbl = '';
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
					var extra_credit = row( self.tooltipify( ob, '', null, 'no width' ).credits_table, 							
										   "Credits", "", "", "no_dot" );
					dt += extra_credit;
					tbl += extra_credit;
			});}

			capt					= capt && ( "<h3>" + capt + "</h3>" );
			coll.credits_table		= tabstart + capt +  tablestart + tbl + tabend;
			coll.description_table	= tabstart + capt +  tablestart + dt + tabend;
			return coll;
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
	self.make_kv_parser = function ( marker ) {

		var reg = new RegExp(
				"(^" + marker + ")" +
				"\\s*([^\\t :=]+)\\s*(?:\\s|=|:)\\s*([^\\t :=](?:.*\\S|\\S)*)\\s*$", "i");
		return (function( string, obj, key, preserve_case ) {
			var match = string.match(reg);
			if( match && obj ) {
				if( key ) {
					if( match[2] === key && match[3] ) obj[key] = match[3];
				}else{
					if( match[2] ) {
						var property = preserve_case ? match[2] : match[2].toLowerCase();
						var value = self.str2mline( match[3] );
						if( property.indexOf('.') > -1 ) {
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
	var str2multiline_lf = /\\n/g;
	var str2multiline_sl = /\\\\/g;
	self.str2mline = function ( str ) {
		if( !str ) return '';
		return str.replace( str2multiline_lf, "\n" ).replace( str2multiline_sl, "\\" );
	}
	self.propertify = function () {

		var len = arguments.length - 2;
		if( len < 1 ) return null;
		var obj = arguments[0];
		if( !obj || (typeof obj !== 'object') ) return null;
		var value = arguments[len+1];
		if( !value ) return obj;
		var last_obj = obj;

		for( var ii=1; ii < len; ii++ ) {
			var prop = arguments[ii];
			if( (!obj[prop] || (typeof obj[prop] !== 'object')) && ii < len ) {
				obj[prop] = {};
			}
			var last_obj = obj[prop];
		}
		last_obj[arguments[len]] = value;
		return obj;
	};
	var _captionize =/^\S|_\S/g;
	var captionize = self.captionize = function( str ) {
			return str.replace(
					_captionize,
					function(match) {
						return match.toUpperCase().replace('_', ' ');
					}
			);
	}
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
	self.expand_to_parent = function (
				own_url,	 // can be user-specified relative path
				external_url // can be web-path to album in remote server
	){
			if( !own_url ) return '';
			if(own_url.indexOf('//') === 0 ) {

					own_url = own_url.substr(2);
					if( external_url ) {
						var www = /(.*\/)[^\/]+$/;
						var ww = external_url.match(www);
						own_url = ww[1] + own_url; 

					}else{

						own_url =	self.app_webpath_noindex + '/' + own_url;
					}
			}
			return own_url;
	};



})();




(function( $ ){			//jQuery plugin


	$.fn.tp$ = $.fn.tp$ || {};  //attach plugin to jQuery
	$.fn.tp$.bindEvents=function(events, callbak, target)
	{
		target = target || document;
		$(document).ready(function() {
			$(target).bind(events,function(event){
				var keyName=whichKey(event.keyCode);
				return callbak	({	keyName:keyName,
									event: event,
									arrow:	(keyName==='up' || keyName === 'down' ||
											keyName === 'left' || keyName === 'right')
								});
			});
		});
	};
	KEY={	
				65	: [	'a','b','c','d','e','f','g','h','i','j','k','l','m','n',
						'o','p','q','r','s','t','u','v','w','x','y','z'],


				32	: 'space',
				13	: 'enter',
				9	: 'tab',
				27	: 'escape',
				8	: 'backspace',
				37	: 'left',
				38	: 'up',
				39	: 'right',
				40	: 'down',
				45	: 'insert',
				46	: 'delete',
				36	: 'home',
				35	: 'end',
				33	: 'pageup',
				34	: 'pagedown',
				112	: 'F1',
				113	: 'F2',
				114	: 'F3',
				115	: 'F4',
				116	: 'F5',
				117	: 'F6',
				118	: 'F7',
				119	: 'F8',
				120	: 'F9',
				121	: 'F10',
				122	: 'F11',
				123	: 'F12',
			16	: 'shift',
			17	: 'control',
			18	: 'alt',
			20	: 'capslock',
			144	: 'numlock',
			48	: 'zero',
			49	: 'one',
			50	: 'two',
			51	: 'three',
			52  : 'four',
			53  : 'five',
			54	: 'six',
			55	: 'seven',
			56	: 'eight',
			57	: 'nine',
			59	: 'colon',
			61	: 'plus',
			188	: 'comma',
			109	: 'hypen',
			190	: 'dot',
			191	: 'question',
			192	: 'tilde',
			219	: 'lbracket',
			220	: 'pipe',
			221	: 'rbracket',
			222	: 'quote'
	};		
	var	whichKey = function(keyCode)
	{
		if(!keyCode) return null;
		if( 65 <= keyCode && keyCode <= 90 ) return KEY[65][keyCode-65];
		return KEY[keyCode];
	}

})( jQuery );



(function( $ ){var tp  =  $.fn.tp$;	



	var self_name='gui';
	if(!tp)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	$.fn.tp$[self_name]=(function(){
		var self={};
		var core=tp.core;
		self.create_triangle=function(arg_){
			var arg={
				direction: 'down',
				style		:{
					width			: 20,
					height			: 20,
					backgroundColor	:'#AAAAAA'
				},
				parent		:document.body
			};
			tp.core.paste_non_arrays( arg.style, arg_.style );
			arg.direction	= arg_.direction || arg.direction;
			arg.parent		= arg_.parent || arg.parent;

			var slf={};


			var nstyle=normalize_style(arg.style);
			if(!nstyle.top && !nstyle.bottom)arg.style.top=0;
			if(!nstyle.left && !nstyle.right)arg.style.left=0;
			nstyle=normalize_style(arg.style);

			var borderBg=arg.style.backgroundColor;

			var triangle=document.createElement('div');
			triangle.style.position='absolute';

			nstyle.width='1px';
			nstyle.height='1px';
			nstyle.backgroundColor='transparent';

			var halfw=Math.ceil(arg.style.width/2);
			var halfh=Math.ceil(arg.style.height/2);


			if(arg.direction==='down' || arg.direction==='up'){
				nstyle.borderLeft=halfw+'px solid transparent';
				nstyle.borderRight=halfw+'px solid transparent';
				if(arg.direction==='down'){
					if(nstyle.bottom)nstyle.bottom=(arg.style.bottom-1)+'px';
					nstyle.borderTop=arg.style.height+'px solid '+borderBg;
					nstyle.borderBottm='none';
				}else{
					if(nstyle.top)nstyle.top=(arg.style.top-1)+'px';
					nstyle.borderBottom=arg.style.height+'px solid '+borderBg;
					nstyle.borderTop='none';
				}
			}else{
				nstyle.borderTop=halfh+'px solid transparent';
				nstyle.borderBottom=halfh+'px solid transparent';
				if(arg.direction==='left'){
					if(nstyle.left)nstyle.left=(arg.style.left-1)+'px';
					nstyle.borderRight=arg.style.width+'px solid '+borderBg;
					nstyle.borderLeft='none';
				}else{
					if(nstyle.right)nstyle.right=(arg.style.right-1)+'px';
					nstyle.borderLeft=arg.style.width+'px solid '+borderBg;
					nstyle.borderRight='none';
				}
			}
			tp.core.rpaste(triangle.style,nstyle);
			arg.parent.appendChild(triangle);
			return {div:triangle, arg:arg};
		};//self.make_triangle
		var normalize_style=function(style){
			var nstyle={};
			tp.core.each(style,function(k,v){
				switch(k){
					case 'width':
					case 'height':
					case 'top':
					case 'left':
					case 'bottom':
					case 'right': v=v+'px';
				}
				nstyle[k]=v;
			});
			return nstyle;
		};
		self.cornerize=function(arg,el){
			if(tp.core.browser.Opera)return;

			var style=el.style;
			if(!style)return false;
			var cssText=style.cssText;
			if(!cssText)return false;

			var addition='';
			tp.core.each(arg,function(k,val){
				var v=val+'px; ';
				switch(k){
					case 'tl': addition +=' border-top-left-radius:'			
									+v+' -moz-border-radius-topleft:'		
									+v+' -webkit-border-top-left-radius:'+v;
						break;
					case 'br': addition +=' border-bottom-right-radius:'
									+v+' -moz-border-radius-bottomright:'
									+v+' -webkit-border-bottom-right-radius:'+v;
						break;
					case 'bl': addition +=' border-bottom-left-radius:'
									+v+' -moz-border-radius-bottomleft:'
									+v+' -webkit-border-bottom-left-radius:'+v;
						break;
					case 'tr': addition +=' border-top-right-radius:'
									+v+' -moz-border-radius-topright:'
									+v+' -webkit-border-top-right-radius:'+v;
						break;
					case 'r': addition +=' border-radius:'
									+v+' -moz-border-radius:'
									+v+' -webkit-border-radius:'+v;
				}
			});		
			if(addition){
				cssText=$.trim(cssText);
				if(cssText.charAt(cssText.length-1) !== ';'){
					cssText += ';';
				}
				style.cssText=cssText+addition;

			}
		};
		self.gradientizeOnce=function(lightColor, range, lightSide, el, bakcgroundImageURL){
			if(tp.core.browser.Opera)return;

			var w,ww;
		
			var style=el.style;
			if(!style)return false;
			var cssText=style.cssText;
			if(typeof cssText!=='string')return false;

			var darkColor=self.scaleColor(range,lightColor);
			var fallBackColor=self.scaleColor((range+1)/2,lightColor);


			var former_webkit='';
			var former_ie='';
			switch(lightSide){
				case 'left':	former_webkit='left top, right top';
								break;
				case 'right':	former_webkit='right top, left top';
								break;
				case 'top'	:	former_webkit='left top, left bottom';
								former_ie=lightColor+"', endColorstr='"+darkColor;
								break;
				case 'bottom':	former_webkit='left bottom, left top';
								former_ie=darkColor+"', endColorstr='"+lightColor;
								break;
			}

			w='-linear-gradient('+lightSide+',  '+lightColor+', '+darkColor+'); ';
			ww=' background-image: ';

			var fallBackColor	=	' background: '+fallBackColor+'; ';
			var fallBackImage	=	bakcgroundImageURL ? ' background-image: url('+bakcgroundImageURL+') ' : '';
			var ie				=	" filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='"+former_ie+"'); ";
				ie				+=	ww+' -ms'		+w;
			var webkit			=	ww+' -webkit-gradient(linear, '+former_webkit+', from('+lightColor+'), to('+darkColor+')); ';
				webkit			+=	ww+' -webkit'	+w;
			var mozilla			=	ww+' -moz'		+w;
			var opera			=	ww+' -o'		+w;
			var css				=	ww				+w;

			var add =	fallBackColor + fallBackImage + ie + webkit + mozilla + opera + css;

			style.cssText=cssText+add;
		};
		self.scaleColor=function(scale, color){
			var red = parseInt( color.substr(1,2), 16 );
			var green = parseInt( color.substr(3,2), 16 );
			var blue = parseInt( color.substr(5,2), 16 );
			var newRed = core.num2hexstr( Math.min( scale * red, 255) );
			var newGreen = core.num2hexstr(  Math.min( scale * green, 255) );
			var newBlue = core.num2hexstr( Math.min( scale * blue, 255) );
			if( newRed.length < 2 ) newRed = "0" + newRed;
			if( newGreen.length < 2 ) newGreen = "0" + newGreen;
			if( newBlue.length < 2 ) newBlue = "0" + newBlue;
			return color = "#"+newRed + newGreen + newBlue;  
		};

		return self; //tp return
	})(); //$.fn.tp$[self_name] end
})( jQuery );




(function( ){	// Note, no $ here. We hope, dependency on jQuery is completely eliminated in this file.
				var self_name = 'gui';
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
				var self = tp[self_name];
				if( !self ) {
						alert('Top part of tp.'+self_name+' must be loaded before.');
						return;
				}
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



(function( $ ){


	var self_name='core';
	if(!$.fn.tp$)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	if(!$.fn.tp$.core)alert('Top part of tp.core must be loaded before tp$.'+self_name+' is loaded.');

	var self=$.fn.tp$[self_name];
		self.blinker=function(obj_, jQuerySetting1, jQuerySetting2, period_)
		{
			var blinker={};

			var READY=-1;
			var FIRST=0;
			var LAST=1;
			var state = READY;
			var stopper=false;

			var phases_queue=[];
			var obj_queue=null;
			var period_queue=-1;

			var phases=[];
			var obj=null;
			var period=-1;
			var doblink=function()
			{
				if(stopper && state===LAST)
				{
					stopper=false;
					state=READY;
					return; //finalize stopping
				}
				if(state===FIRST)
				{
					phases=phases_queue;
					obj=obj_queue;
					period=period_queue;
				}
				var phase=phases[state];
				state=(state+1)%2;
				$(obj).animate(phase,period,doblink);
			};

			blinker.dosetup_and_start=function(obj_, jQuerySetting1, jQuerySetting2, period_)
			{
				obj_queue=obj_;
				period_queue=period_;
				phases_queue=[jQuerySetting1, jQuerySetting2];
				blinker.dostart();
			};
			blinker.dostart	=function() { if(state!==READY) return; state=FIRST; doblink(); };
			blinker.dostop	=function()	{ stopper=true; };

			if(arguments.length === 4)
			{
				blinker.dosetup_and_start(obj_, jQuerySetting1, jQuerySetting2, period_);
			}
			return blinker;
			var do_stop_wait_start=blinker.do_stop_wait_start=function()
			{
				blinker.dostop();
				if(state===READY)
				{
					doblink();
					return;
				}else{
					setTimeout(do_stop_wait_start,500);
				}
			};	

		};
		self.create_popup=function(arg){
			arg = arg || {};
			var popup={};
			var pos= arg.position || 'absolute';
			var popup_el=document.createElement('div');
			document.body.appendChild(popup_el);
			$(popup_el).css('visibility','hidden').css('position',pos);
			popup.popup_el=popup_el;
			arg.width = arg.width || 200;
			arg.height = arg.height || 100;
			var update=function(args){
				args=args||{};
				$(popup_el).css('position',args.position || 'absolute');
				$(popup_el).css('width',args.width || $(popup_el).width());
				$(popup_el).css('height',args.height || $(popup_el).height());
				var winH = $(window).height();
				var winW = $(window).width();
				var top		= args.top	? args.top	: (winH-$(popup_el).height())/2;
				var left	= args.left	? args.left	: (winW-$(popup_el).width() )/2;
				if(top<0)top=0;
				if(left<0)left=0;
				$(popup_el).css('top',  top);
				$(popup_el).css('left', left);
				if(args.backgroundColor) $(popup_el).css('background-color', args.backgroundColor);
				if(args.color) $(popup_el).css('color', args.color);
				if(args.innerHTML) popup_el.innerHTML=args.innerHTML;
			};
			update(arg);
			popup.show=function(a){ 
				update(a);
				$(popup_el).css('visibility','visible');
				return popup_el;
			};	

/*
			popup.show_with_focus=function(a){ 
				popup.show(a);
				popup_el.focus();
			};	
*/
			popup.toggle=function(args){
				update(args);
				var v = 'visible'===$(popup_el).css('visibility') ? 'hidden' : 'visible';
				$(popup_el).css('visibility',v); 
			};

			popup.hide=function(){ $(popup_el).css('visibility','hidden'); };
			popup.isVisible=function(){return 'visible'===$(popup_el).css('visibility');};

			return popup;
		};
		self.single_popup_manager=function(args){
			var manager=self.create_popup(args);
			var owner='';
			var contents={};

			var update_owner=manager.update_owner=function(a){
				if(!a || !a.owner)return;
				owner=a.owner;
				contents[owner] = contents[owner] || {};
				$.extend(contents[owner],a);
			};

			if(args && args.owner)update_owner(args);

			manager.dotoggle=function(a){
				if(!a || !a.owner){
					manager.toggle();
				}else if(a.owner === owner){
					update_owner(a);
					manager.toggle(contents[owner]);
				}else{
					manager.doshow(a);
				}
			};

			manager.doshow=function(a){
				update_owner(a);
				manager.show(contents[owner]);
			};

			return manager;
		};

})( jQuery );











(function( $ ){	var tp		= $.fn.tp$;	
				var ceach	= tp.core.each;



	var self_name='form';
	if(!tp)alert('Package tp must be loaded before tp$.'+self_name+' is loaded.');
	if(!tp.gui)alert('Package tp.gui must be loaded before tp$.'+self_name+' is loaded.');
	$.fn.tp$[self_name]=(function(){

		var self={};
		var core=tp.core;
		self.create_select_el = function( arg ) {

			arg = arg || {};
			var arg_settings={

				r	:{	//options passed by reference
						parent		:document.body,
						options		:[{}],	//apparently, program does not care about
						callback	:null
					},

				c	:{	//options passed by content
						dont_reset_styles :false,
						choice_ix	:-1, //0,
						gui			:{
									height_of_box_limit		:170,
									hitem					:20,
									hmin					:25,
									wmax					:200,
									wbut					:30,
									itemindent				:null,
									itemOverColor			:'#666666',
									ddbox_backgroudColor	:'#333333',
									outColor				:'#CCCCCC',
									overColor				:'#EEEEEE',
									ddButtArrowOpacityColor	:'#CCCCCC',
									ddButtArrowOpacity		:.5,
									corners					:null,
									gradient				:true,
									gradientDepth			:0.7,
									style					:{	display	:{	fontSize	:'15px',
																			cursor		:'default'
																		},
																wrapper	:{	position	:'relative',
																			fontFamily	:'helvetica, arial'
																		}
															}
						} //gui
				}//c
			};//var arg_settings={

			var argr=arg_settings.r;
			var argt=arg_settings.c;

			core.rpaste(argr,arg.r);
			core.paste_non_arrays( argt, arg.c, 0, 'skip_undefined' );
			var select_el = { parent:argr.parent, arg : arg_settings };
			var elements;
			var item_settings;
			var hbox;
			var hmax;
			var hmin;
			var hitem;
			var ddbox_backgroudColor;
			var reset_styles = function () {

				var gui = argt.gui;
				hbox						=gui.height_of_box_limit;
				hitem						=gui.hitem;
				ddbox_backgroudColor		=gui.ddbox_backgroudColor;
				hmin						=gui.hmin;
				var wmax					=gui.wmax;
				var wbut					=gui.wbut;
				var itemindent				=gui.itemindent;
				var itemOverColor			=gui.itemOverColor;
				var outColor				=gui.outColor;
				var overColor				=gui.overColor;
				var ddButtArrowOpacityColor	=gui.ddButtArrowOpacityColor;
				var ddButtArrowOpacity		=gui.ddButtArrowOpacity;
				var corners					=gui.corners;
				var wbut2=Math.floor(wbut/2);
				if(!itemindent)itemindent=wbut2;
				var bottom_indent=hitem-2;
				var all_items_container_height=(argr.options.length)*hitem;
				var ibox_wrapper_height=hbox-bottom_indent;
				if(all_items_container_height<ibox_wrapper_height){
					ibox_wrapper_height=all_items_container_height;
					hbox=ibox_wrapper_height+bottom_indent;
				};
				hmax=hmin+hbox;
				var witem=wmax-wbut;
				var hbox2=Math.ceil(hbox/2);
				var nitmes=Math.ceil(hbox/hitem);
				var scroll_arrow_width=Math.floor(wbut*4/10);
				var scroll_arrow_height=Math.floor(wbut*4/10);
				var scroll_arrow_left=Math.floor(wbut*3/10);
				var scroll_arrow_gap=Math.floor(wbut*2/10);
				if(!gui.corners)gui.corners={r:wbut2};
				elements = [
					{	name	:'wrapper',
						parent	:'parent',
						style	:{
									width			:wmax+'px',
									height			:hmin+'px'
								}
					},
					{	name	:'top_strip',
						parent	:'wrapper',
						style	:{
									width			:wmax+'px',
									height			:hmin+'px'
						}
					},
	
					{	name		:'ddbutton',
						parent		:'top_strip',
						style		:{
										width			:wbut+'px',
										height			:hmin+'px',
										right			:'0px',
										fontSize		:'14px'
									},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					},

					{	name		:'ddarrow_up',
						parent		:'ddbutton',
						style		:{
										visibility		:'hidden',
										width			:wbut+'px',
										height			:hmin+'px',
										backgroundColor	:ddButtArrowOpacityColor,
										opacity			:ddButtArrowOpacity
									},
						arrow		:{	direction		:'up',
										style			:{	width			:scroll_arrow_width,
															height			:scroll_arrow_height,
															left			:scroll_arrow_left,
															top				:scroll_arrow_gap
														}
									}
					},

					{	name		:'ddarrow_down',
						parent		:'ddbutton',
						style		:{
										width			:wbut+'px',
										height			:hmin+'px',
										backgroundColor	:ddButtArrowOpacityColor,
										opacity			:ddButtArrowOpacity
									},
						arrow		:{	direction		:'down',
										style			:{	width			:scroll_arrow_width,
															height			:scroll_arrow_height,
															left			:scroll_arrow_left,
															top				:scroll_arrow_gap
														}
									}
					},

					{	name	:'display',  //container for always visible selected item text 
						parent	:'top_strip',
						style	:{
									width			:witem-itemindent+'px',
									height			:hmin+'px',
									paddingLeft		:itemindent+'px',
									lineHeight		:Math.ceil(hmin*9/10)+'px',
									overflow		:'hidden'
						},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					},
					{	name	:'ddbox',
						parent	:'wrapper',
						style	:{
									width			:wmax+'px',
									height			:hbox+'px',
									top				:hmin+'px',
									display			:'none',
									backgroundColor	:'transparent',
									overflow		:'hidden'
						}
					},
	
	
					{	name	:'itembox_wrap',
						parent	:'ddbox',
						style	:{
									overflow		:'hidden',
									width			:witem+'px',
									height			:ibox_wrapper_height+'px',
									top				:'0px'
						}
					},
	
					{	name	:'itembox',	//immediate container of all items;
						parent	:'itembox_wrap',
						style	:{
									width			:witem+'px',
									top				:'0px'
						}
					},
					{	name	:'scroll_up',
						parent	:'ddbox',
						style	:{
									width			:wbut+'px',
									height			:hbox2+'px',
									right			:'0px'
						},
						arrow	:{	direction		:'up',
									style			:{	width			:scroll_arrow_width,
														height			:scroll_arrow_height,
														left			:scroll_arrow_left,
														top				:scroll_arrow_gap
													}
								},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					},
	
					{	name	:'scroll_down',
						parent	:'ddbox',
						style	:{
									width			:wbut+'px',
									height			:hbox2+'px',
									top				:hbox2+'px',
									right			:'0px'
						},
						arrow	:{	direction		:'down',
									style			:{	width			:scroll_arrow_width,
														height			:scroll_arrow_height,
														left			:scroll_arrow_left,
														bottom			:scroll_arrow_gap
													}
								},
						mousables	:{	out	:{backgroundColor	:outColor},
										over:{backgroundColor	:overColor}
									}
					}
				];
	
			
	
				item_settings={
					name	:'item',
					parent	:'itembox',
					style	:{
								overflow		:'hidden',
								left			:0+'px',
								width			:witem-itemindent+'px',
								height			:hitem+'px',
								backgroundColor	:ddbox_backgroudColor,
								paddingLeft		:itemindent+'px',
								color			:'#FFFFFF',
								fontSize		:'12px',
								cursor			:'default'
					},
					style_over	:{
								backgroundColor	:itemOverColor
					}
				};
				var setup_element = function( parameters ) {

						var w,div,gradColor,gradTip;
						var v=parameters;
						var name=v.name;

						if( select_el[name] ) {

							div=select_el[name];
						}else{

							div = select_el[name] = document.createElement('div');
							select_el[ v['parent'] ].appendChild(div);
							
							if(argt.gui.gradient){
								gradColor='';
								gradTip='top';
								w = v.mousables;
								if(name === 'display_out')gradColor=w.out.backgroundColor;
								if(name === 'display_over')gradColor=w.over.backgroundColor;
								if(name === 'ddbutton_out')gradColor=w.out.backgroundColor;
								if(name === 'ddbutton_over')gradColor=w.over.backgroundColor;
								if(name === 'scroll_up_out')gradColor=w.out.backgroundColor;
								if(name === 'scroll_up_over')gradColor=w.over.backgroundColor;
								if(name === 'scroll_down_out')gradColor=w.out.backgroundColor;
								if(name === 'scroll_down_over')gradColor=w.over.backgroundColor;
								if(name === 'scroll_down_out' || name === 'scroll_down_over')gradTip='bottom';	
								if(gradColor)tp.gui.gradientizeOnce(gradColor, argt.gui.gradientDepth, gradTip, div);
							}
						}

						core.rpaste(div.style, v['style']);
						core.rpaste(div.style, argt.gui.style[name]); //override
						if(!div.style || !div.style.position || div.style.position !== 'relative' )div.style.position='absolute'; //hard-coding the default

						if( gui.corners ) tp.gui.cornerize( gui.corners, div );
						if( v['innerHTML'] ) div.innerHTML = v[ 'innerHTML' ];

						return div;
				}; // var setup_element = function (
				core.each( elements, function( ix, v ) {
					var w,ww;
					if(v.mousables){
						core.each(v.mousables,function(name,mousable){
							var m = core.tclone( v );
							core.rpaste(m.style,mousable); //add style to base-style
							m.name=v.name+'_'+name;

							var div=setup_element(m);
							div.style.visibility=  name==='over' ? 'hidden' : 'visible';
						});
					}
					var el_already_created = select_el[ v['name'] ] && true;
					w = setup_element( v );

					if(!el_already_created && v.arrow)
					{
						ww=core.tclone( v.arrow  );
						ww.parent = w; //TODO Very missing ... don't clone entire DOM ... 
						w=tp.gui.create_triangle( ww );
					}
				});
				select_el['ddbutton'].style.display=
					select_el['ddbutton_out'].style.display =
					select_el['ddbutton_over'].style.display=
						 argr.options.length<2 ? 'none' : 'block';
				ceach( select_el, function ( ix, val ) {
						if( ix !== 'parent' && ix !== 'arg' ) {
							if(val.tagName){
								if(val.tagName.toLowerCase() === 'div' ){
									if(!val.style){
									}else if( !val.style.position  || val.style.position !== 'absolute' ){
										val.style.position = 'absolute';
									}
								}
							}
						}
				});						

			};//...reset_styles=function
			var toggle_dd=function(action){
					var sel=select_el;
					var dd=sel['ddbox'];
					var s='style';
					var v='visibility';

					if(	argr.options.length<2 &&
						dd[s].display === 'none') return true; //skip openeing single-item

					var do_close = dd[s].display !=='none';
					if(action) do_close = action === 'close';
						
					dd[s].display						=do_close ? 'none'			: 'block';
					sel['ddarrow_down'][s][v]			=do_close ? 'visible'		: 'hidden';
					sel['ddarrow_up'][s][v]				=do_close ? 'hidden'		: 'visible';
					sel['wrapper'][s].backgroundColor	=do_close ? 'transparent'	: ddbox_backgroudColor;
					sel['wrapper'][s].height			=do_close ? hmin+'px'		: hmax+'px';
			};
			var show_choice=function(){
				if(argt.choice_ix<0){
					select_el['display'].innerHTML='';
					select_el['display'].title='';
					return;
				}
				var w=argr.options[argt.choice_ix];
				select_el['display'].innerHTML=w.title;
				if(w.tooltip)select_el['display'].title=w.tooltip;
			};
			select_el.reset_choice=function(choice_ix){
				if(	isNaN(choice_ix) || choice_ix<-1 ||
					choice_ix>=argr.options.length			)	return;
				argt.choice_ix=choice_ix;
				show_choice();
			};

			select_el.close=function(){
				toggle_dd('close');
			};
			var bind_navigation_events=function(){
				var itembox=select_el['itembox'];
				var s='style';
				var v='visibility';
				var vv='visible';
				var hh='hidden';
				var sel=select_el;
				$(sel['top_strip']).bind('click',function(event){
					if(argr.options.length>1){
						toggle_dd();
					}else{ //button mode
						if(argr.callback)argr.callback(0,argr.options[0],select_el);
					}
					return true;
				});
				$(document).bind('click',function(event){
					if(!core.isAncestorOf(select_el['wrapper'],event.target)){
						toggle_dd('close');
					}
					return true;
				});
				$(sel['top_strip']).bind('mouseenter',function(event){
					sel['ddbutton_over'][s][v]=vv;
					sel['ddbutton_out'][s][v]=hh;
					sel['display_over'][s][v]=vv;
					sel['display_out'][s][v]=hh;
					return false;
				});
				$(sel['top_strip']).bind('mouseleave',function(event){
					sel['ddbutton_over'][s][v]=hh;
					sel['ddbutton_out'][s][v]=vv;
					sel['display_over'][s][v]=hh;
					sel['display_out'][s][v]=vv;
					return false;
				});
	
	
				var s_u=sel['scroll_up'];
				var s_d=sel['scroll_down'];
				var s_u_h=sel['scroll_up_over'][s];
				var s_u_i=sel['scroll_up_out'][s];
				var s_d_h=sel['scroll_down_over'][s];
				var s_d_i=sel['scroll_down_out'][s];
				$(s_u).bind('mouseenter',function(event){
					s_u_h[v]=vv;
					s_u_i[v]=hh;
					return false;
				});
				$(s_u).bind('mouseleave',function(event){
					s_u_h[v]=hh;
					s_u_i[v]=vv;
					return false;
				});
				$(s_u).bind('click',function(event){
					var pos=parseInt(itembox.style.top);
					pos += hitem;
					if(pos<hitem) itembox.style.top=pos+'px';
					return false;
				});
				$(s_d).bind('mouseenter',function(event){
					s_d_h[v]=vv;
					s_d_i[v]=hh;
					return false;
				});
				$(s_d).bind('mouseleave',function(event){
					s_d_h[v]=hh;
					s_d_i[v]=vv;
					return false;
				});
				$(s_d).bind('click',function(event){
					var pos=parseInt(itembox.style.top);
					pos -= hitem;
					if(pos+(argr.options.length+2)*hitem>hbox) itembox.style.top=pos+'px';
					return false;
				});
			};//bind_navigation_events=function
			select_el.reset=function(arg){
				arg = arg || {};
				core.rpaste(argr,arg.r);
				core.paste_non_arrays( argt, arg.c, 0, 'skip_undefined' );


				if(!argt.dont_reset_styles)reset_styles();
				var itembox=select_el['itembox'];
				var counter=0;
				select_el.reserved_divs = select_el.reserved_divs || [];
				select_el.reserved_length = select_el.reserved_divs.length;
				core.each(argr.options,function(i,v){
					var div;
					if(counter >= select_el.reserved_length){
						div=document.createElement('div');
						itembox.appendChild(div);
						select_el.reserved_divs[counter]=div;
						div.style.position='absolute';
						$(div).bind('click',function(event){
							toggle_dd('close'); //hard style: close immediately
							var new_ix=i;
							if(argr.callback){
								var result=argr.callback(i,argr.options[i],select_el,event);
								if(!isNaN(result))new_ix=result;
							}
							if(new_ix>-1){
								argt.choice_ix=new_ix;
								show_choice();
							}
							return true;
						});
						$(div).bind('mouseenter',function(event){
							event.target.style.backgroundColor=item_settings.style_over.backgroundColor;
							return false;
						});
						$(div).bind('mouseleave',function(event){
							event.target.style.backgroundColor=item_settings.style.backgroundColor;
							return false;
						});
					}
					div=select_el.reserved_divs[counter];
					div.style.display = 'block';

					core.rpaste(div.style, item_settings.style);
					div.style.top=hitem*i+'px';
					div.innerHTML= v.title;
					div.title=v.tooltip || ''+(i+1);
	

					counter++;
				});//core.each
				for( var ii=select_el.reserved_divs.length-1; ii >= counter; ii-- )
				{
					select_el.reserved_divs[ii].style.display = 'none';
				}


				show_choice();
			};

			reset_styles();
			bind_navigation_events();

			argt.dont_reset_styles=true;
			select_el.reset();
			argt.dont_reset_styles=false;
			$(select_el['wrapper']).css({
	                   '-moz-user-select':'none',
	                   '-webkit-user-select':'none',
	                   'user-select':'none'
	               }).each(this.onselectstart=function(){return false;}); //for IE
			select_el.reset_arguments=function(arg){
				arg=arg || {};
				core.rpaste(argr,arg.r);
				core.paste_non_arrays( argt, arg.c, 0, 'skip_undefined' );

			};	

			return select_el; //return created object

		};//end of constructor: self.create_select_el=function...




		return self; //tp return
	})(); //tp end
	
	
})( jQuery );




( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;


					gio.config		= { 
										links : {},
										style : null,
										query : {
													slim : false,					// allows to manually set a limit 
													curl : '',
													aurl : '',						// loads ablums from Internet
													asingle : false,				// exclude default albums if albums is set
													akey : '',
													collection_ix : false,
													map_ix : false
										}	

									};

					gio.session		= 
					{		
							state : {},
							alist : [],
							alist_by_key : {},
							procs : {},  reinit : {}, server : {},
							init : {},
							stemmed_albums : {}
					};


					gio.def			= { base_game : {},
										games : {}, albums : {},
										default_album_key : 'album', 
										dresses : null,
										inherited_games : {}, dressed_gamed_albums : {},
										colls :
										{	maxcid : 0
										},

										colorban_map_decoder : null,
										procs : {}
					},

					gio.def.albums[ gio.def.default_album_key ] = {};

					gio.config.metrics =
					{


						EXPECTED_USER :
						{
							BOREDOM :
							{
								MIN_RULES	: 2, 	// When there are only two rules, say "push" and "pull",
								MIN_CELLS	: 16,	// When there are only 4*4 cells, don't say: hard to manage this board ...
								MIN_BREEDS	: 3,	// When there are only hero, goal for box, and goal for hero,
								RULES		: 8,	// 6 th rule becames boring, Chess has ~ 7 move rules +
								CELLS		: 64,	// Chess has 64, ...
								BREEDS		: 12	// Chess has 12 (non-couting 8-th-raw-"paun"-converting-cells),
							},
							MAX_KNOWN_CREATIVITY :
							{	SCORE : 194.9,
								QUERY : 'akey=flocks&ckey=wells&mkey=insanely_hard&dkey=default'
							}
						}
					};

					gio.modes		= {	
										sta_tic : { db : null },
										dynamic : { verbose : true },
										app_loaded : false
									};
					gio.gui			= { procs : {}, 	modes : {},  init : {}, create : {} };
					gio.data_io		= { 
											core : { load : {}, save : {} }, session : { load : {}, save : {} },
											add_gafions : function () { return; }
									};

					gio.core		= { procs : {}, reflection : {}, def : { map_format : {} } };
					gio.navig		= { in_session : { round : {} }, in_map : {}}; // TODm map must be in gio.gui
					gio.map_editors	= {};
					gio.solver		= {};
					gio.domwrap		= {	regions : {}, popups : {}, elems : {}, wraps : {},
										headers : {}, status : {},
										cpanel : 
										{	
													cont_rols : {}
										} 
									  };
					gio.info		= {	help : {},
										log : {
									}};
	gio.cons = null;
	gio.cons_add = null;
	gio.session.server.message = {	'form_authenticity_token'	: '',
									'craft_zone_url'			: 'https://boardspirator.herokuapp.com/auxiliary/howto.htm',
									'howto'						: 'doc/guest_readme.htm',
									'terms'						: 'user_terms.htm', // in feeder folder
									'login_url'					: 'https://boardspirator.herokuapp.com/login',
									'logout_url'				: 'https://boardspirator.herokuapp.com/logout',
									'loggedin'					: false,
									homehost					: 'landkey.net',
									homepath					: 'gio/gio/play',
									hide_db_site_links			: true
								};

	gio.session.server.top_menu_titles = {	
											'craft_zone_url'			: 'Craft',
											'howto'						: 'How',
											'terms'						: 'Terms',
											'login_url'					: 'Login',
											'logout_url'				: 'Logout',
											'dev'						: 'Dev',
											'more'						: 'More',
											'credits'					: 'Credits',
											'home'						: 'Boardy'
										};
	gio.config.links.dev_zone			='http://landkey.net/gio/';
	gio.config.links.more_zone			='http://landkey.net/games_of_choice/';
	gio.config.links.credits			='doc/credits.htm';
	gio.config.links.service_host		='http://landkey.net';


	gio.config.feeder					= { exists : false };
	gio.config.feeder.url				='feeder'; // in respect to app. root or full url
	gio.config.feeder.external_maps		='requested_map.php?user_requested_link=mm';
	gio.config.feeder.alb_req_stub	='requested_albums.php?aurl=';


	gio.config.defpaths	=	{	GAMES_DEF_PATH : 'def',
								ALBUMS_DEF_PATH : 'def/albums',
								COLLECTIONS_DEF_PATH : 'def/collections',
								SKINS_DEF_PATH : 'def/skins'
							}
	gio.modes.dynamic.controls_locked = false;


	gio.info.help.hint = 'h or ?';
	gio.info.help.main =
		"Keyboard Control:\n\n"+

		"h,?                       help\n"+
		"r                         rules\n"+
		"o                         objective\n"+
		"esc                       close popups, map editor, autoplay\n"+
		"arrows,j,k,i,m            move a unit\n"+
		"backspace,b,ctrl+space    move back\n"+
		"space, ctrl+shitf+arrows  toggle breeds or colonies\n"+
		"u, ctrl+arrows            toggle units\n"+
		"a/c/M                     albums/collections/maps\n"+
		"d                         rounds\n"+
		"n                         new round\n"+
		"f                         forward replay\n"+
		"s                         return to start\n"+
		"e                         return to end\n"+
		"z                         autoplay round lazily\n"+
		"t                         edit/create/show/import map\n"+
		"p                         playpath ... edit/create/show/import\n"+
		"ctrl+d                    done ... do load from map editor\n"+
		"S                         story\n"+
		"C                         credits\n"+
		"A                         about map\n";



	gio.solver.CONSTANTS =
	{
		CANON_STRING		: 1,
		CANON_ARRAY  		: 2,
		CANON_LINKED_LIST	: 3
	};

	gio.solver.config =
	{
								CANON_REPRESENTED_AS	: gio.solver.CONSTANTS.CANON_LINKED_LIST,
								TIME_TO_WAIT_MS : 500,
								TIME_TO_WORK_MS : 500,
								NODES_LIMIT : 300000,
								CRITICAL_WAIT_TIME : 2000,	//ms
								CRITICAL_VOLUME : 300000,	//canons

								help : 
									"Keyboard Control:\n\n"+

									"h,?                       help\n"+
									"esc                       close popups\n"+
									"left arrow                down inside a sphere\n"+
									"right arrow               up inside a sphere\n"+
									"up                        next upper sphere\n"+
									"down                      next lower sphere\n"+
									"Shift + up arrow          to highest point\n"+
									"Shift + down arrow        to lowest point\n"
								
	};

	gio.config.google_apps =
	{
			enabled			: true,
			forbidden_dirs			: [ "/a1/", "metap/apps/" ],
			forbidden_host_names	: [ 'localhost' ],


			ad		: 					// overriden by host if any
			{ 
						google_ad_client	: "pub-3835495802867304",
						/* LandkeyNet 300x250, created 9/18/10 */
						google_ad_slot		: "9886381946",
						google_ad_width		: 300,
						google_ad_height	: 250
			},


			hosts			:
			{
				'landkey.net'	:
				{ 
						'_setAccount'		: 'UA-26834667-1',
				},

				'landkey.org'	:
				{ 
						'_setAccount'		: 'UA-26834667-3',
						ad					:
						{
							google_ad_client	: "pub-3835495802867304",
							/* LandkeyNet 300x250, created 9/18/10 */
							google_ad_slot		: "9886381946",
							google_ad_width		: 300,
							google_ad_height	: 250
						}
				},
				'boardspirator.herokuapp.com'	:
				{
						'_setAccount'		: 'UA-26834667-4',
				},
				'boardspirator.com'	:
				{
						'_setAccount'		: 'UA-26834667-5',
				}
			}//hostnames

	};


	gio.config.advertisement =
	{			enabled				: true,		// updates dynamically
				streaming_started	: false,	// updates dynamically

				divs				:
				{ 
						wrap : null, 	// updates dynamically
						subwrap : null,	// updates dynamically
						receiver : null	// updates dynamically
				},


				distanceFromGame	: 60,
				permittedBrowsers	: [ 'FireFox', 'Chrome' ], //TODM find out why IE fails?, does Opera work?



				style_and_settings	:
				{
					ad_wrapp			:
					{
						top				: 0,
						width			: 200,
						height			: 100,
						backgroundColor	: '#555555',
						color			: '#EEEEEE',
						overflow		: 'visible'
					},
					ad_subwrap			: 
					{	  
						position		: 'absolute',
						top				: 0,
						left			: 0,
						width			: 300,
						height			: 25,
						paddingTop		: 5,
						fontSize		: 13,
						fontWeight		: 'bold',
						fontFamily		: 'arial, helvetica',
						backgroundColor	: '#CCCCCC',
						color			: '#FFFFFF',
						textAlign		: 'center',
				        warning			: 'Google ad. Not a part of this page:'
					},
				    ad_receiver			:
					{
						id				: 'ad_receiver',
						position		: 'absolute',
						left			: 0,
						top				: 25,
						paddingLeft		: 0,
						paddingRight	: 0,
						paddingTop  	: 0,
						paddingBottom	: 0
					}
				}//style_and_settings
	};//gio.config.advertisement





})();


(function(){	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};






	gio.config.style = {

		features :
		{	"kids" : ".back.forward.restart.playpaths.autoplay.help." 

		},

		annoyances :
		{
			DURATION_AFTER_START_LIMIT  : 30000, // ms
			MOVES_AFTER_START_LIMIT		: 15 // moves

		},

		rootColor			:'#000000',
		backgroundColor		:'#EEEEEE',
		WINNING_COLOR		:'#111144',

		solver_color		:{	BROWSER			:'#004400',
								BROWSER_WON		:'#005555',
								SEARCHING		:'#221100',
								SEARCHING_WON	:'#330055'
							},


		playboard			:{	widthMin			:580,	//TODm artificial, Do improve.
								zIndex				:10,
								corners				:{r:20}
							},

		top_left_pane		:{	height				:40,
								left 				:10,
								top					:0
							},
		top_navig			:{	left 				: 0,
								top					: 0,
								height				: 25,
								link_style 			:	'style="text-decoration:none; color:#5555FF; font-family:Helvetica, Arial; '+
														'font-size:10px; font-weight:bold;"'
							},

		captions			:{
								height				:137,
								width				:580,
								fontSize			:25,
								fontStyle			:'italic',
								fontFamily			:'arial, helvetica',
								gameHeight			:40,
								collectionHeight	:30,
								dressHeight			:20,
								mapHeight			:30,
								gaps				:2,
								subcaptionWidth		:100,
								bgColor				:'#000000',
								zIndex				:1001000,
								gameTitleColor 		: '#FFFFFF'
							},


		controls			:{
								boardWidth			:240,
								width				:200,

								restart				:{ width : 87, left : 0, slot : 2		},
								forward				:{ width : 110, left : 68, slot : 2		},
								back				:{ width : 88, left : 158, slot : 2		},

								help				:{ width : 140, left : 0, slot : 3		},



								playpaths			:{ width : 145, left : 0, slot : 4,		},
								autoplay			:{ width : 110, left : 150, slot : 4	},


								reset				:{ width : 90, left : 0, slot : 5		},
								newround			:{ width : 85, left : 62, slot : 5		},
								rounds				:{ width : 109, left : 119, slot : 5	},

								edit				:{ width : 225, left : 0, slot : 6},
								solver_control		:{ width : 150, left : 0, slot : 7},

								save_or_load		:{ width : 170, left : 0, slot : 8},

								load_external		:{ width : 170, left : 0, slot : 9},

								buttonsFontWeight	:'normal',

								STATUS_LINE_HEIGHT	:30,
								chaser_upshift_lim  :2,		// in units if status line height
								PADDING_HORIZONTAL	:8,
								STATUS_LINE_PERIOD	:40, //be > padding+height
								PADDING				:0,
								fontSize			:'12',
								backgroundColor		:'transparent',
								color				:'#FFFFFF',
								zIndex	:1000000
							},

		popups				:{	zIndex				:4002000, // why this fails?: 1002000,
								help				:{
														owner:'help',
														position: 'fixed', //'absolute',
														top: 20,
														width:500,
														height:400,
														backgroundColor:'#335533',
														color:'#FFFFFF'
													},

								about				:{
														owner:'about',
														position: 'absolute', //'fixed', // apparently independent from 'help'
														top: 20,
														width:500,
														height:500,
														backgroundColor:'#332200',
														color:'#FFFFFF'
													}
							},

		messages			:{	zIndex				:1003000,
								padding				:'5px',
								paddingLeft			:'10px',
								width				:'300px',
								height				:'40px',
								fontSize			:'23px',
								fontFamily			:'Arial, Helvetica',
								textAlign			:'center',
								backgroundColor		:'#FFFFDD'
							},
		console				:{	

								horizontal_gap				: 28, //between consoles for scroll bars
								vertical_gap				: 20, //between consoles for scroll bars

								wrapper	:
								{
										width				: 290,
										height				: 340,
										overflow			: 'visible',
										backgroundColor		: 'transparent',
										color				: '#FFFFFF',
										visibility			: 'visible',
										fontSize			: 10
								},
				
								common :
								{
										color				: '#EEEEEE',
										paddingLeft			: 10,
										paddingRight		: 10,
										overflow			: 'auto',
										fontSize			: 10
								},

								playvigation				: {
										top					: 0,
										width				: 260,
										height				: 150,
										backgroundColor		: '#113311'
								},
								generic 					: {
										top					: 110,
										width				: 260,
										height				: 150,
										backgroundColor		: '#111133'
								},
								solver						: {
										top					: 320,
										width				: 560,
										height				: 150,
										backgroundColor		: '#220022'
								},
								debug						: {
										top					: 530,
										height				: 300,
										backgroundColor		: '#331111',
										visibility			: 'hidden',
										display				: 'none'
								}
							}


	};


})();


( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};

					var gdef	= gio.def;
					var cpaste	= tp.core.paste_non_arrays;
					var clone	= tp.core.clone_many;

	var tt = gio.def.templates = 
	{

		def :
		{

			metag :
			{ 
								galfinition :
								{
								},
								mapfinition : {},
								common : {}
			},

			coll :
			{
				script :
				{
					metag : {}	
				},

				ref :
				{
					env :
					{
					},
					list :
					{
					},
					folder :
					{
						
					},
					link :
					{
						
					}
				},
				credits :
				{
				},
				state : {}
			},

			album :
			{
				collections : [],
				coll_ref : {},
				dresses : {},
				ref : 
				{
					env :
					{
					},
					link :
					{
					},
					list :
					{
					}
				}
			}
		}, /// def

		play :
		{
			coll : {}
		}

	};

	cpaste( tt.def.coll.script.metag, tt.def.metag );
	cpaste( tt.play.coll, tt.def.coll );
	cpaste( tt.play.coll,
		{
			script : { state : {}, parsed : {}, proc : {}, heap_json : {} }
		}
	);
	tt.normalize_metag	= function ( seed ) { return cpaste( cpaste( seed, tt.def.metag ), seed ); };
	tt.normalize_coll	= function ( seed ) { return cpaste( cpaste( seed, tt.def.coll ), seed ); };
	tt.normalize_album	= function ( seed ) { return cpaste( cpaste( seed, tt.def.album ), seed ); };



})();




( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;




	gio.description = {	title : 'Boardspirator' };

	core.paste_non_arrays( gio.description, {


		description			: gio.description.title + " (Boardy). Tool\n                 " +
							  "to play, edit, solve, or develop board puzzles.",
		version				: '0.1.200',
		version_name		: 'Mono',	// "Monoaction". In interaction, there is no significant reaction from actees back to actors.
		maturity			: 'Draft',
		date				: 'February 24, 2013',
		copyright			: '(c) 2011-2013 Konstantin Kirillov',

		license				: "MIT, BSD, and GPL\n							" +
							  "except data in \"def/albums\" and \"def/skins\"\n							" + 
							  "when they explicitly have own lincense.",
		download			: 'http://github.com/lancelab/Boardspirator/',

		language			: 'JavaScript',
		usage_requirements	: "2012-modern browser (on-line) or FireFox 3.6+ or IE 8+ (from harddrive).",
		usage				: "Do land browser on " + tp.core.app_webpath_noindex + '/index.htm',
		web_site			: 'http://landkey.net/gio/',
		email				: 'beaverscript(a)landkey(.)net',
		developer_comment	: "In GitHub, the most recent version is put in folder diary/b1\n" + 
							  "Ruby is not required, but helpful for deployment scripts.",
		credits				:[	
								{	"title"		: "jQuery",
									"copyright"	: "Copyright 2011, John Resig"
								},

								{	"title"		: "Sizzle.js",
									"copyright"	: "Copyright 2011, The Dojo Foundation"
								}
							],

		diary			: 	"Diary contains stand-alone versions. Usual landing page is index.htm:\n\n" +


						"   0.1.200     Feb. 24, 2013. \n" +
						"   0.1.199     Feb. 19, 2013. tp.core.each simplified.\n" +
						"                              //tp/in_progress/ removed.\n" +
						"                              Based on jQ self.tpaste = function ... removed.\n" +
						"                              Based on jQ self.tclone replaced.\n" +


						"   0.1.198     Feb. 19, 2013. Fixes to 1.197.\n" +
						"   0.1.197     Feb. 17, 2013. To be a Publishstone.\n" +
						"   0.1.196     Publishstone. IE 10 is basicly runnable, image cosmetic glitch exists.\n" +
						"   0.1.194     Feb 11. Creativity Metrics.\n" +
						"   0.1.192     Feb 3. URL-query has ckey=, mkey=, dkey= ...\n" +
						"   0.1.191     Feb 2. Mode: Canon as Linked List in Solver.\n" +
						"   0.1.190     Jan. 25. Going to jQuery 1.9.0.\n" +
						"   0.1.189     Jan. 23. Gamion on-line editor. Converter to co-position script.\n" +
						"   0.1.181     Jan. 9, 2013. GitHubed. \n" +
						"                             Last version which:\n" +
						"                                has game.json.txt instead of game.jwon.txt \n" +
						"                                not having app.js inside documentation.\n" +
						"   0.1.173     Jan. 5, 2013. Text related to database features removed from readmes. Loss. Find in former versions.\n" +
						"   0.1.170     Dec. 30, 2012. htarget_X added.\n" +
						"   0.1.170     all meta-maps-text info is in jwon, no more \"caption\" format. \n" +
						"   0.1.169nn   after this version, jwon is changed. In about 169qq.\n" +
						"	0.1.167hh	Dec. 12. Collection design concept changed. It is a gamion, self-controlling script, now.\n" +
						"	0.1.165tt	Dec. 2. Solver Browser is better. Still obscure round manager.\n" +
						"	0.1.164		Nov.  27. Refactoring of internal formats began. Not sure will version b1 survie.\n" +
						"	0.1.162		Nov.  23. Map header parser fix. Won-condition corrected by motives-min-number.\n" +
						"	0.1.162		Solver: canon2str added and makes memory resources 3 times effective; browser to top.\n" +
						"	0.1.160		Nov.  6. Commenting style ... //\\\\//: is established as a horizon\n" +
						"	0.1.155		Nov.  4. Nested credits.\n" +
						"	0.1.151		Oct. 31. Added jump-interaction and ghostban, ghostjump. Leap bug fix.\n" +
						"	0.1.148		Oct. 26. salvor: contactless-path-finder-stub added.\n" +
						"                        changed to ''doctype html''.\n" +
						"                        LeapPush and Co-LeapPush do work.\n" +
						"	0.1.147		Oct. 25. added stub to process move to an arbitrary point on map.\n" +
						"	0.1.142		Oct. 20. Copyrights. Interaction bug fix. Readmes macrosed.\n" +
						"	0.1.141		Oct. 17. Readmes and comments\n" +
						"	0.1.139		Oct. 15. fixed: int tp, select-element-control bug of extra bogus item\n" +
						"	0.0.132		is renamed to branch 0.1.132. Branch 0.0.2.XXXX is to be redesigned independently.\n" +
						"	0.0.130		URL-query input standartized\n" +
						"	0.0.127		Saves/loads session to db better\n" +
						"	0.0.125		Loads external collection supplied from URL-query\n" +
						"	0.0.123		Skins and their images moved outside of collections\n" +
						"	0.0.121		CoPullPush added and solves\n" +
						"	0.0.120		PullPush added\n" +
						"	0.0.117		game/collection scrolls changed and cleaned\n" +
						"	0.0.116		gui is protected when map logically invalid\n" +
						"	0.0.115		default_maps_text removed, consoles reshuffled\n" +
						"	0.0.115		bumpytargets game added\n" +
						"	0.0.114		simpler getgs()\n" +
						"	0.0.112		cb map fix, map normalizer fix\n" +
						"	0.0.109		ajaxed login popup added\n" +
						"	0.0.108		deployer script added\n" +
						"	0.0.105		spawned base_game def is in gio.def.games now\n" +
						"	0.0.104		and below: see versions in Diary folder\n"
	});


	core.tooltipify( gio, 'Engine', gio.description );


})();

jQuery('document').ready( jQuery.fn.tp$.gio.session.init.wrap );


(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
	var query 	=	gio.config.query = tp.core.clone_many( gio.config.query, tp.core.getQueryKeyPairs('integerify') );
	gio.debug	=	gio.debug || query.debug;
	gio.debly	=	function ( message ) { if( gio.debug) gio.cons_add( message ); };
	gio.debtp	=	function ( message ) { if( gio.debug) window.tp$.deb( message ); };
	gio.debsol	=	function ( message ) { if( gio.debug) gio.solver_cons_add( message ); };		
	gio.debtp( query );


	gio.solver.config.NODES_LIMIT	= query.slim || gio.solver.config.NODES_LIMIT; 

	(function () { // //\\ SPAWNS GOOGLE CONFIGURATION

		var gapps = gio.config.google_apps;
		if(query.nogoogle) gapps.enabled = false;
		var ww = window.location.pathname.toLowerCase();
		ceach( gapps.forbidden_dirs, function( dummy, dir ) { 
			if(	ww.indexOf( dir ) > -1 ) gapps.enabled = false;
		});
		var ww = window.location.hostname.toLowerCase();
		ceach( gapps.forbidden_host_names, function( dummy, host_name ) { 
			if(	ww.indexOf( host_name ) > -1 ) gapps.enabled = false;
		});


		gapps.host = gapps.hosts[window.location.hostname.toLowerCase()] || gapps.hosts['landkey.net'];
		tp.core.paste_non_arrays(gapps.ad, gapps.host.ad);
		var ad = gio.config.advertisement;
		var forbidden = true;
	
		if(ad.enabled && gapps.enabled ){
			if(!query.curl && !query.aurl) {
				ceach(ad.permittedBrowsers, function(key,name){
					if(tp.core.browser[name]) forbidden = false
				});
			}
		}
		ad.enabled = !forbidden;


	})(); // \\// SPAWNS GOOGLE CONFIGURATION
	var ww = gio.session.server.top_menu_titles;
	var www = {};
	tp.core.each( ww, function(k,v) {
		www[k] = '>' + v + '</a> ';
	});
	gio.session.server.top_menu_titles = www;
	var feeder = gio.config.feeder;
	if(feeder.url){
			var ww = tp.core.path_from_page_to_app_root;
			if(ww && !feeder.url.match('http://') ){
				feeder.url = ww + '/' + feeder.url;
			}
			var ww = tp.core.download_object( 
				feeder.url + "/" + feeder.external_maps + "&does_feeder_exist=yes",
				null, null, null, null,
				2000
			);
			if(typeof ww === 'object' && ww !== null && ww.feeder === "exists") feeder.exists = true;;
	}
	if( !feeder.exists ) gio.debtp( "No feeder exists at URL = " + feeder.url );


	if( !JSON || !JSON.parse || !JSON.stringify ) {
		var mess = 'No JSON features detected. Appliction halted.';
		gio.session.state.halted = mess;
		alert( mess );
		return;
	}


})();


( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var exp_url	=  core.expand_to_parent;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var dio		=  gio.data_io;
					var session	=  gio.session;
					var deb		=  function ( string ) { gio.debly( "DataLoader: " + string ); };			
					var conadd	=  function ( string ) { gio.cons_add( "DataLoader: " + string ); };			
	dio.download_gamion = function ( metag, coll_text ) {
		var cseed			= gdp.normalize_cseed();
		metag				= cpaste( cseed.script.metag, metag );
		var galfin			= metag.galfinition;
		var mapfin			= metag.mapfinition;
		var gafion			= galfin.gafion;
		var common			= metag.common;
		var query_is_source	= metag.common.query_is_source;
		var query_credits	= mapfin.query_credits;
		var cref			= cseed.ref;
		var cinsert 		= gafion ? 0 : metag.mapfinition.cix_to_insert1;
		var link			= metag.common.link;
		if( !coll_text && !link )
		{
			conadd('Possibly typo: link and gamion-text are missed ...');
			return false;
		}

		deb( "Prepares gamion." + ( ( link && ( ' Link = ' + link ) ) || '' ) );

		cref.list.cix_to_insert1	= cinsert;
		cref.list.chosen			= metag.mapfinition.chosen;
		cref.list.title				= mapfin.title;
		cref.link.link				= link;
		cref.jwon					= metag.common.jwon;

		if( query_credits )
		{
			var ww = cseed.credits;
			ceach( core.tooltipify_array, function (index, key) {
				core.propertify( ww, key, query_credits[ key ] );
			});
		}


		var parent_akey	= mapfin.akey_master || mapfin.akey_advice;
		var a_available	= !!parent_akey && gio.def.albums[ parent_akey ];


		if( gafion || ( !cinsert && ( !a_available || coll_text ) ) )
		{

			var downcoll = cpaste( cseed, gdef.templates.play.coll );
		}else{

			if( cinsert )
			{
				var gs			= gio.getgs();
				var parent_akey	= gs.akey;
				var cix			= cinsert - 1;
				deb( "Reuses album's collection a, c = " + parent_akey + ', ' + cix );
			}else{
				deb( "Adds coll-seed into album. akey = " + parent_akey );
			}
			cseed.ref.list.preserve_gui_state = !query_is_source;

			var merged_album = gdp.derive_album ( parent_akey, cseed );
			if( !merged_album )
			{	conadd( "Failed adding coll-seed to akey " + parent_akey );
				return false;
			}
			var ww = merged_album.collections;
			var downcoll = cinsert ? ww[ cix ] : ww[ ww.length - 1 ];
		}	
		if( coll_text ) {

			deb( 'Decodes gamion ... ' );
			downcoll.maps_loaded = 'began';
			downcoll.script.source_text = coll_text;
			gio.core.def.map_format.decode( downcoll );
			deb( 'Gamion decoder finished. akey = ' + downcoll.ref.list.akey + '.' );
			var success =
				downcoll.maps_loaded === 'success' ||
				downcoll.script.state.definitions_processed;
		}else{
			var success	= dio.download_cfile ( downcoll );
		}
		if( query_is_source && !success ) {
			var halted		= gio.description.title + ' is halted.';
			conadd( 'Failed download gafion from ' + link );
			session.state.halted = true;
			alert( halted );
		}

		return success ? downcoll : false;

	}; // dio.download_gamion
	dio.download_cfile = function( coll ) {

		var url;
		var coll_ix		= coll.ref.list.ix;
		var folder		= coll.ref.folder;
		var ref_db		= coll.ref.db;
		var ownhost		= gdp.detect_ownhost_url( coll );

		if( folder.full ) {
			url = core.app_webpath_noindex + '/' + folder.full;


		}else if( ref_db ) {
			if( !gio.modes.sta_tic.db ) {
				coll.maps_loaded += 'No db for db-collection akey "' + ref_db.akey + '"';
				return false;
			}
			var url = 	gio.modes.sta_tic.db + 
						'/collections/1?text=yes' +
						'&album_key='		+ ref_db.akey + 
						'&collection_key='	+ ref_db.ckey +
						'&file_key='		+ ref_db.fkey;

		}else{

				url = coll.ref.link.link;

				if( !ownhost ) {

					if( coll.ref.dbased ) {
						coll.maps_loaded += 'From db-collection this external link is forbidden "' + url + '"';
						return false;
					}

					if( gio.config.feeder.exists ) {
						url = gio.config.feeder.url + "/" + gio.config.feeder.external_maps + url;
					}else{
						coll.maps_loaded += 'No feeder exists for outhost: "' + url + '"';
						return false;
					}
				}
		}


		coll.maps_loaded='began';
		if(gio.debug) gio.cons( 'Began loading ' + url );

		var ajax_call = {

				url			: url,
				async		: false,
				cache		: false,
				dataType	: 'text',
				timeout		: 2000,
				success		: function( data, textStatus ) {

					if(coll.maps_loaded==='began' && textStatus==='success'){

						deb( coll.maps_loaded );
						coll.maps_loaded = 'ajax success';
						deb( 'data load ajax success' );

						if( data.match( /^:::failed/i ) )
						{
							coll.maps_loaded = 
									"Failed collection load.\nRedirector responded with text:\n" +
									data.substr(0, 200);
						}else{	

							coll.script.source_text = data;
							gio.core.def.map_format.decode( coll );
							deb( 'Finished maps decoder for akey ' + coll.ref.list.akey + '.' );
						}
					}
				}
		};

		$.ajax( ajax_call ).fail( function( explanation ) {
					var ww = " .. ajax download failed .. ";
					coll.maps_loaded += ww;
					ww += "\nurl=" + url;
					conadd( ww );
					gio.debtp( "Possible error status = " + arguments[1] );
					gio.debtp( "Possible error expanation = " + arguments[2] );
		});

		var w_success = coll.maps_loaded === 'success' || coll.script.state.definitions_processed;
		if( !w_success ) {
				var ww = "Collection \"" + url + "\"\nis failed.\n";
				if( !coll.script.state.definitions_processed ) ww += "No definitions.\n"
				ww	+= "coll.maps_loaded = " + coll.maps_loaded;
				conadd( ww );
		}

		return w_success;
	}; // dio.download_cfile
	dio.add_map_text_and_land = function( text ) {

		var gs						=	gio.getgs();
		var colln					=	gs.coll;
		colln.script.source_text	+= 	"\n" + colln.maps.length + "\n\n" + text;

		colln.maps_loaded = 'began';
		if( gio.debug ) gio.cons( 'adding map to coll ... ' );
		gio.core.def.map_format.decode ( colln );

		var failed = true;
		if( colln.maps_loaded === 'success' ) {
			var gm = colln.maps[ colln.maps.length-1 ];

			deb( 'Validates added-from-text-map ...' );
			if( session.reinit.landify_map( gm ) ) {
				deb( 'Lands on added-from-text-map ...' );
				gm.title = 'My Edited. ' + gm.title;
				failed = !gio.navig.landify_and_land_map( gm, 'do_land' );
				deb( 'Finished landing on added-from-text-map ...' );
			}
		}

		if( failed ) conadd( "Failed to edit map ... " + ( gm.invalid_map_message || '' ) );
	};





	dio.core.save.object=function(url, data){

		var obj = { result : null };
		var ajax_call={
				url: url,
				async:false,
				cache: false,
				dataType:'json',
				type : 'post',
				data : data,
				timeout:1000,
				success:function(data,textStatus){
					if(textStatus==='success'){
						obj.result = data;
						if(gio.debug) tp$.deb(data);
					}
				}
		};

		$.ajax(ajax_call).fail( function(explanation){
					var w='Ajax failed to upload object.';
					conadd(w+' url='+url+"\n");
					if(gio.debug) {
						tp$.deb( "Possible error status = " + arguments[1]);
						tp$.deb( "Possible error expanation = " + arguments[2]);
					}
		});
		return obj.result;
	};




})(jQuery);




( function () {	 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach   =  tp.core.each;

					var session	=  gio.session;
					var gsp		=  gio.session.procs;
					var deb		=  function ( string ) { if( gio.debug )	gio.cons_add( "Session State: " + string ); };			
	gio.getgs = function ( ) {

		var gs			= {};

		var state		= session.state;
		var akey		= state.akey__bf;
		if( !akey )		return gs;
		var aix			= akey ? state.album_ix : -1;
		var lst_alb		= gio.session.alist[ aix ];
		if( !lst_alb )	return gs;  //TODM garbage. remove

		var colls		= lst_alb.collections;
		var cix			= colls.ix;
		var coll		= colls[ cix ];
		var mix			= coll.map_ix;

		gs.playalb		= lst_alb;
		gs.colls 		= colls;
		gs.collection	= coll;
		gs.coll			= coll;

		gs.akey			= akey;
		gs.aix			= aix;
		gs.cix			= cix;
		gs.mix			= mix;

		var gm			= gs.gm = coll.maps[ mix ];

		gs.cols			= gm.cols;
		gs.col			= gm.acting_col;
		gs.board		= gm.board;

		var rounds		= gm.rounds;
		if( !rounds )	return gs;

		var round		= gs.round = gm.rounds[ gm.rounds.ix ];
		var pos			= gs.pos = round.pos;
		
		gs.cid			= gs.col.id;
		gs.unit			= gs.col.acting_unit;
		gs.uid			= gs.unit.id;
		if( pos ) {
			gs.lid		= pos.uid2lid[gs.uid];
			gs.loc		= gm.locs[gs.lid];
		}

		return gs;

	};	/// Gets state, gs





	gsp.get_listed_album = function ( album_key ) {
		return session.alist_by_key[ album_key ];
	};





	gsp.disable_GUI_state = function ( ) 
	{
		var sstt = session.state;
		if( !sstt.akey__bf ) return;
		deb(	'Disabling GUI state which is: aix, a = ' +
				sstt.album_ix + ', ' + sstt.akey__bf
		);
		sstt.akey__bf = '';
	};
	gsp.do_memorize_GUI_state = function ( akey, aix, cix, mix ) {

				var ss = session;
				if( akey )
				{
					var album	= gsp.get_listed_album( akey );
				}else if( aix || aix === 0 ) {
					var album = ss.alist[ aix ];
				}else{
					var album = ss.alist[ state.album_ix ];
				}

				if( !cix && cix !== 0 ) cix = album.collections.ix;
				var coll = album.collections[ cix ];

				if( !mix && mix !== 0 ) mix = coll.map_ix;
				ss.state.akey__bf = album.key;
				ss.state.album_ix	= album.ix;
				album.collections.ix = cix;
				coll.map_ix = mix;
	
				deb(	'Established state: aix,a,c,m = ' +
						ss.state.album_ix + ', ' + ss.state.akey__bf +  ', ' +
						cix + ', ' + mix
				);

	};


	gsp.debstate = function ( message )
	{
		var gs = gio.getgs();
		deb(	message + ' GUI State = akey, aix, cix, mix = ' +
				gs.akey + ', ' + gs.aix + ', ' +gs.cix + ', ' +gs.mix
		);
	};



})();


( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var deb		= function ( string ) { if( gio.debug )	gio.cons_add( "Virtual Landifying Map: " + string ); };			
					var conadd	= function ( string ) { gio.cons_add( "Virtual Landifying Map: " + string ); };			
	var boundarify = function ( map, left_wall, right_wall,  loc2lid, lid2uid )
	{

		var msize_x = map.size[0];
		var msize_y = map.size[1];
		var tops	= map.pos.tops;	
		var units	= map.units;


		var internal_cells_number = 0;
		var map_boundary	=	map.parsed.wall_boundary_encountered && 
								map.script.decoder_table[ map.game.rule_helpers.map_boundary ];
								deb( 'Map boundarness = ' + map_boundary ); //TODM  slow if scrolling maps

		for( var yy = 0; yy < msize_y; yy++ ) {
			
			var left	= boundarify_line(	1,	yy, msize_x, map_boundary, loc2lid, lid2uid, tops, units );
			var right	= boundarify_line(	-1,	yy, msize_x, map_boundary, loc2lid, lid2uid, tops, units );
			if( map_boundary && left === -1 && right === msize_x )
			{
				deb( "Walled map but walless line " + yy + ".\n" +
					'"Map: "' +  map.title + "'."
				);
			}
			if( left >= right ) right = left + 1;
			left_wall[ yy ]		= left;
			right_wall[ yy ]	= right;
			internal_cells_number += right - left - 1;
		}
		map.metrics.internal_cells_number = internal_cells_number;
	};
	var boundarify_line = function ( direction, yy, msize_x, map_boundary, loc2lid, lid2uid, tops, units )
	{

		var left = -1;
		for( var xx_v = 0; xx_v < msize_x; xx_v++ )
		{
			var xx = direction < 0 ? msize_x - xx_v - 1 : xx_v;

			var tower = loc2lid[ xx ][ yy ];
			var block = false;
			if( !tower )
			{
				if( left < 0 && map_boundary ) continue;
				block = true;

			} else {
				var top = tops[ xx ][ yy ];
				for( var zz = 1; zz <= top; zz++ )
				{
					var unit = units[ lid2uid[ tower[ zz ] ] ];
					if( unit.block || ( map_boundary && unit.cname === map_boundary ) )
					{
						block = true;
						break;
					}
				}								
			}
			if( block )
			{
				left = xx_v;
			}else{
				if( !map_boundary || left > -1 ) break;
			}
		}
		if( map_boundary && left < 0 ) left = msize_x;
		return ( direction > 0 ? left : msize_x - left - 1 );
	};
	var normalize_map = function( map )
	{

		var game = map.game;
		var roof = game.rule_helpers.map_roof;
		var rhelper_dyn = game.rule_helpers.one_dynamic_unit_on_top;
		var pos = map.pos;
		var lid2uid=pos.lid2uid;
		var lu=map.pos.lid2uid;
		var tops=pos.tops;	
		var units = map.units;
		var locs = map.locs;
		var loc2lid = map.loc2lid;
		var msize_x = map.size[0];
		var exists=map.xy_exists = [];
		map.digest = {};
		var hid2lid = map.digest.hid2lid = [];
		var hid2loc = map.digest.hid2loc = [];
		var lid2hid = map.digest.lid2hid = [];

		var internal_blocking_units = 0;

		var left_wall		= [];
		var right_wall		= [];
		boundarify ( map, left_wall, right_wall,  loc2lid, lid2uid );

		for(var xx=0; xx<map.size[0]; xx++){

			var ex = exists[xx] = [];

			var lx = loc2lid[xx] = loc2lid[xx] || [];
			for(var yy=0; yy<map.size[1]; yy++){

				var forbidden_xx = ( xx <= left_wall[ yy ] || xx >= right_wall[ yy ] ); //TODM why not to do continue when forbidden_xx?
				if(!lx[yy]){
					ex[yy]=false;
				}else{
					ex[yy]=true;
					var ly=lx[yy];
					for(var zz=0; zz<roof; zz++){
						if(!ly[zz] && ly[zz] !== 0){
							var nlid=locs.length;
							ly[zz] = nlid;
							locs[nlid]=[ xx,yy,zz ];
							lu[nlid]=-1; 
						}else{

							var lid = ly[zz];
							var uid = lu[lid];
							var unit = map.units[uid];
							if( unit.block )
							{
								ex[yy]=false;
								if( !forbidden_xx ) internal_blocking_units += 1;
							}
							if(rhelper_dyn && zz > 0){
								var lid_below = ly[zz-1];
								var uid_below = lu[lid_below];
								var unit_below = map.units[uid_below];
								var activity_below = unit_below.activity; 
								if( activity_below.active || activity_below.passive ){
									var activity = unit.activity; 
									if( activity.active || activity.passive ){

										map.load = 'invalid';
										conadd(	"Broken map. Two dynamic units in one cell.\n" +
														"Map: " +  map.title +
														" Unit below: " + unit_below.id + ", " +
														"Unit above: " + unit.id + ", " +
														"Cell: x,y,z: " + xx + ", " + yy + ", " + zz
										); //TODm Map validation must be separate from normilizer.
										return false;

									}else{
										lu[lid_below] = uid;
										lu[lid] = uid_below;
										map.pos.uid2lid[uid] = lid_below;
										map.pos.uid2loc[uid] = map.locs[lid_below];
										map.pos.uid2lid[uid_below] = lid;
										map.pos.uid2loc[uid_below] = map.locs[lid];
									}
								}								
							}
						}
					}
					if(ex[yy]){
						if( xx <= left_wall[yy] || xx >= right_wall[yy] ){
							ex[yy] = false;
						}else{
							var hid=hid2lid.length;
							hid2lid[hid]=ly[0];
							hid2loc[hid]=locs[ly[0]];
							for(var zz=0; zz<roof; zz++){
								var lid = ly[zz];
								lid2hid[lid]=hid;
							}
						}
					}
				} //.. loc2lid[xx][yy] exists ...
			} // yy
		} // xx
		/*
		c onsole.log('map.locs=',map.locs);
		c onsole.log('map.loc2lid=',map.loc2lid);
		c onsole.log('loc2lid=',map.pos.loc2lid);
		*/
		map.metrics.internal_blocking_units = internal_blocking_units;

		var corners = gio.solver.bays_builder(map); 
		gio.session.reinit.metrify( map );

		map.load = 'valid';
		return true;
	};
	gio.session.reinit.landify_map = function( gm ) {

		var coll = gm.collection;
		var game = gm.game;
		deb( 'Begins ... m,c,a = ' + gm.ix + ', ' + coll.ref.list.ix + ', ' + coll.ref.list.akey );

		if( gm.load === 'invalid') {
			gio.session.reinit.messages =
				"Invalid \"gm.load\" flag\n" +
				( gm.invalid_map_message || '') +
				"\nMap board = \n" +
				tp.core.dotify( gm.script.raw_board, 1000, "", "", "\n(....)" ) +
				"\n";
			return false;
		}

		if( gm.load !== 'parsed' ) {
			gio.debly(	'Map ' + gm.ix + ' on gkey=' + gm.game.gkey + 
						"is already finalized" );
			return true;
		}


		if( !normalize_map( gm ) ) return false;

		gm.solver = gio.solver.create_solver(gm);
		gio.navig.in_session.round.init_round(gm);
		gio.gui.create.board(gm);
		gio.gui.create.map_focuser(gm);
		gio.gui.create.tiles(gm);

		if(gm.playpaths){
			tp.core.each(gm.playpaths,function(ii,pp){
				pp.pos = tp.core.tclone( gm.pos );
			});
		}
		gm.load = 'finalized';

		gio.debly(	'Finalized map: validated, boardified, titled: m,c,a = ' +
					gm.ix + ', ' + gm.collection.ref.list.ix + ', ' + gm.collection.ref.list.akey
		);
		return true;
	};
	gio.gui.add_and_land_ppath = function ( gm, directive, start_pos, path_text, title, dont_land )
	{
		gm.playpaths = gm.playpaths || [];
		gm.playpaths.push(
		{
						title		: title,
						value		: path_text,
						pos			: tp.core.tclone( start_pos ),
						directive	: directive
		});


		var validator_err = '';
		if( gio.getgs().gm === gm )
		{
			var validator_err = gio.gui.reset_playpaths_select_el( !dont_land && ( gm.playpaths.length - 1 ) );
		}

		return validator_err;
	};


})();


( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};
	var do_boredomize = function ( a, amin, asense, name_str, summary )
	{
		var x = a / asense;
		if( x < 1 ) 
		{
			var x2		= x*x;
			var min		= amin / asense;
			var min2	= min * min;
			var y		= x2 - min2;
			if( y < 0 )
			{	
				y = 1;
			}else{

				y =  1 + y / ( 1 - min2 );  
			}
		}else{

			var y = 1 + x;
		}


		message =		"    " + name_str + " factor = " + y +
						" ( number, min, sense = " + a + ", " +
						amin + ", " +  asense + " )\n"; 
		summary.boredom *= y;
		summary.message += message; 
	};




	gio.session.reinit.metrify = function ( gm )
	{ 

		var returner	= gm.metrics.recalculated;
		returner.text	= '';

		var config		= gio.solver.config;
		var EU			= gio.config.metrics.EXPECTED_USER;
		var UB			= EU.BOREDOM;

		if( !gm.game.boredom ) return returner;

		var uu		= gm.dynamic_units.length;
		var nni		= gm.metrics.internal_cells_number;
		var aww		= gm.metrics.internal_blocking_units;
		var uuss	= nni - aww;
		var ss		= uuss - uu;
		var density = Math.min( 1, uu / Math.max( 1, ss ) );


		var result	=	"<pre>Parameters:\n";
		result		+=	"  Internal cells     = " + nni + "\n"; 
		result		+=	"  Blocks (walls),  w = " + aww + "\n"; 
		result		+=	"  Empty cells,     s = " + ss	+ "\n";  
		result		+=	"  Dynamic units,   u = " + uu	+ "\n"; 
		result		+=	"  Density ... u/s, g = " + density + "\n"; 
		result		+=	"\n\n</pre>"; 

		var summary	= { boredom : 1, message : '' };
		var bb		=	gm.cols.length - 2;
		do_boredomize( bb, UB.MIN_BREEDS, UB.BREEDS, 'breeds', summary );
		var nn		=	uuss + aww * 0.5;
		do_boredomize( nn, UB.MIN_CELLS, UB.CELLS, 'cells', summary );
		var rr		=	gm.game.boredom;
		do_boredomize( rr, UB.MIN_RULES, UB.RULES, 'rules', summary );

		result		+=	"<pre>E x p e c t e d    A u d i e n c e    P a r a m e t e r s\n\n";
		result		+=	"    Volumability, v = rules * breeds * cells = " + summary.boredom + "\n";
		result		+=	summary.message;
		result		+=	"\n</pre>"; 

		returner.text = result;
		var mmet = gm.metrics.optpath;
		if( !mmet ) return returner;

		var pp				= mmet.p;
		var ii				= mmet.i;
		var tt				= mmet.r;

		var It			 	= ( tt + ii ) / 1.5;
		var flat_diff			= pp + ii + tt;
		var progressive_diff	= ( pp + 2.0 * ii + 3.0 * tt ) / 6.0;
		var abs_diff			= It + density * ( pp - ii );
		var creativity_metric	= cm = abs_diff / summary.boredom;
		var estimation			= ( mmet.estimation === 'solpath' ) ? ' = ' : ' = ';

		result		+=	"<pre>\n"; 

		result		+=	"    Path, Inter, ReInter: p, i, t "		+ estimation + pp + ", " + ii + ", " + tt + "\n"; 
		result		+=	"    Flat Diff.,   F = p+i+t       "		+ estimation + flat_diff + "\n"; 
		result		+=	"    Progr. Diff., P = (p+2i+3t)/6 "		+ estimation + progressive_diff + "\n"; 
		result		+=	"    Effective Int., I = 2(t+i)/3  "		+ estimation	+ It + "\n"; 
		result		+=	"    Difficulty,  d = I+g(p-i)     "		+ estimation + abs_diff + "\n"; 
		result 		+=	"    Flat Creativity,       F/v     ~ "	+ flat_diff / summary.boredom + "\n"; 
		result 		+=	"    Creativity Metric, C = d/v     ~ "	+ cm + "\n"; 

		var maxc			=	EU.MAX_KNOWN_CREATIVITY.SCORE;
		var relative		=	cm * 100.0 / maxc;
		var relative_str	=	relative + '';
		relative_str		=	relative_str.substr(0,4) + '%';

		var ten_rounded		=	Math.max( Math.ceil( relative - 0.5 ), 1 );
		var ten_str			=	'' + ten_rounded;
		ten_str				=	ten_str.length === 1 ? '0' + ten_str : ten_str;
		var ww				=	ten_str.length - 1;
		ten_str				=	ten_str.substr( 0, ww)  + '.' + ten_str.substr( ww, 1);

		result 				+=	"    Whirps =  C/maxc ( 10-scale )  ~ "	+ ten_str + "\n"; 

		result 				+=	"    Whirps =  C/maxc ( %        )  ~ "	+ relative_str + "\n\n"; 
		result 				+=	"    <a style=\"color:#FFFFFF;\" href=" + 
								tp.core.app_webpath_noindex + "/?" +					
								EU.MAX_KNOWN_CREATIVITY.QUERY + ">Known maxc, " + maxc + ".</a>\n\n</pre>"; 

		returner.text			= result;
		returner.ten_rounded	= ten_str;
		returner.relative		= relative;
		return returner;

	};


})();


( function () {		var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
				  	var gio		=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;

					var rman	=  gio.navig.in_session.round;
					var ggp		=  gio.gui.procs;
					var cmd		=  gio.core.def.map_format;


					var dot_regex = /\./g;
					var space_regex = / /g;
	var do_slide_round_to_beginning=function(round){
		round.backs+=round.current_pos_ix;
		round.interacts = 0;
		round.peer_change = 0;

		delete round.pos;  //TODm memory leak
		round.pos=tclone(round.start_pos);
		round.current_pos_ix=0;
	};
	rman.create=function(gm, pos){
		var round = {};
		round.gm = gm;
		round.moves = [];
		round.pos = pos || tclone(gm.pos);
		round.start_pos = tclone(round.pos);	
		round.current_pos_ix = 0;
		round.backs = 0;
		round.interacts = 0;
		round.peer_change = 0;
		return round;
	};
	rman.set_gui_title=function(round, round_ix){
		if( !round_ix && round_ix !== 0) round_ix = round.gm.rounds.ix;
		round.title = 'Round '+ round_ix;
		round.tooltip = 'Pickup the round';
	};
	rman.init_round=function(gm, doreset, pos)
	{
		var game	= gm.game;
		var round	= rman.create(gm, pos);
		var rr		= gm.rounds = gm.rounds || [];

		if(doreset && (rr.ix || rr.ix === 0)){
			rr[rr.ix]=round;
			if(!pos){
				gio.cons("Round "+rr.ix+" cleaned up in map\n"+ gm.title);
			}else{
				gio.cons("Round "+rr.ix+" start pos is set to given position in map\n"+ gm.title);
			}
		}else{
			rr.ix=rr.length;
			rr.push(round);
			if(gio.debug) gio.cons(	"Round "+rr.ix+ " is created for map:\n" + gm.title);
		}
		rman.set_gui_title(round);
		return round;
	};
	gio.gui.procs.do_manage_round = function(steps,play_direction,action){
		var round=gio.getgs().round;

		if(play_direction==='back'){
			if(round.current_pos_ix===0){
				gio.plcons('Know nothing about past game ...');
			}
		}else if(play_direction==='forward'){
			if(round.current_pos_ix===round.moves.length){
				gio.plcons('Cannot predict the future step ...');
			}
		}

		rman.do_back_forw_start_record(round, play_direction, steps, action);

		if(play_direction==='back'){

			if( round.gm.multiplayer ) {
				ggp.do_one_scroll_of_colony('left');
			}

			if(gio.debug) gio.plcons('Back to the beginning ...');
		}else if(play_direction==='forward'){
			if( gio.modes.play !== 'autoplay') gio.cons('Forward to the end ...');
		}else if(play_direction==='to beginning'){
			if(gio.debug) gio.plcons_add('jumped to start of round');
		}
	};
	rman.do_back_forw_start_record = function(round, play_direction, steps, action){

		var gm=round.gm;
		var moves=round.moves;

		if(play_direction){
			var pos=round.pos;
			if( play_direction === 'back' )
			{
				if(round.current_pos_ix===0) return;
				var move = moves[ round.current_pos_ix - 1 ];

				gio.navig.process_move_record( gm, pos, move.steps, 'backward' );
				var pix = --round.current_pos_ix;
				if( move.action.intact )
				{
					round.interacts -= 1;
					if( pix > 0 )
					{
						var former_move = moves[ pix - 1 ];
						var former_peer = former_move.action.former_peer;
						if( former_peer && former_peer !== move.action.peer ) round.peer_change -= 1;
					}
				}
				round.backs++;

			}else if(play_direction==='forward'){

				if( round.current_pos_ix === moves.length ) return;
				var move = moves[ round.current_pos_ix ];
				gio.navig.process_move_record( gm, pos, move.steps );
				var pix = ++round.current_pos_ix;
				round.backs--;
				if( move.action.intact )
				{
					round.interacts += 1;
					var former_move = ( pix > 1 ) && moves[ pix - 2 ]; //TODM what is a syntax ... is array[-1] legal operation?
					var former_peer = former_move && former_move.action.former_peer;
					if( former_peer && former_peer !== move.action.peer ) round.peer_change += 1;
				}

			}else if(play_direction === 'to beginning'){
				do_slide_round_to_beginning(round);
			}
		}else{
			var move = { steps : steps, action : action };
			var pix = round.current_pos_ix;
			moves[ pix ] = move;
			var former_move		= ( pix > 0 ) && moves[ pix - 1 ];
			var former_peer		= former_move && former_move.action.former_peer;
			action.former_peer	= action.peer || former_peer;

			round.current_pos_ix++;
			round.moves = moves.slice( 0, round.current_pos_ix );
			if( action.intact )
			{
				round.interacts += 1;
				if( former_peer && former_peer !== action.peer ) round.peer_change += 1;

			}
		}
	};
	gio.navig.in_map.autoplay = function ( time_interval_between_steps_, till_won_callback ) //TODO possibly unsafe: does mode blocks user input?
	{
		time_interval_between_steps = time_interval_between_steps_ || 1;
		var till_won = !!till_won_callback;

		var repeated_autoplay = function ()
		{
			if( gio.modes.play !== 'autoplay' ) return;
	
			var gs		= gio.getgs();
			var gm		= gs.gm;
			var game	= gm.game;
			var round	= gs.round;

			round.gm.solver.browser_mode = false;
			var do_continue = round.current_pos_ix < round.moves.length

			if( do_continue )
			{
				gio.gui.procs.do_manage_round( null, 'forward' );

				if( time_interval_between_steps_ || round.current_pos_ix === round.moves.length )
				{
					gio.draw_scene();
					gio.draw_status();
				}
				if( till_won && game.won_or_not( gm, round.pos ) ||
					round.current_pos_ix >= round.moves.length
				){
					do_continue = false;
				}
			}

			if( do_continue )
			{
				setTimeout( repeated_autoplay, time_interval_between_steps );
			}else{
				gio.modes.play = '';
				if( till_won_callback ) till_won_callback( gm, round );
			}
		};
		repeated_autoplay();
	};
	gio.navig.in_map.move_till_condition = function ( do_redraw_GUI, till_won_callback )
	{
		var till_won	= !!till_won_callback;
		var gs			= gio.getgs();
		var gm			= gs.gm;
		var game		= gm.game;
		var round		= gs.round;

		var do_continue = round.current_pos_ix < round.moves.length

		while( do_continue )
		{
			rman.do_back_forw_start_record( round, 'forward', null ); // *

			if( till_won && game.won_or_not( gm, round.pos ) ||
				round.current_pos_ix >= round.moves.length
			){
				do_continue = false;
			}
		};

		if( do_redraw_GUI )
		{
			gio.draw_scene();
			gio.draw_status();
		}

		if( till_won_callback ) till_won_callback( gm, round );
	};
	rman.pos2map_script = function ( round, do_comap ) {

		var table			= cmd.colorban_encoder_table;
		var cotable			= cmd.colorban_encoder_cotable;
		var mapcut			= cmd.sugar_soko_mapcut;
		var TARGET_REGEX	= cmd.map_sugar.TARGET_REGEX;
		var TARGET			= cmd.map_sugar.TARGET;

			
		var gm			= round.gm;
		var units		= gm.units;
		var loc2lid		= gm.loc2lid;
		var x_size		= gm.size[0];
		var y_size		= gm.size[1];
		var xy_exists	= gm.xy_exists;
		var pos			= round.pos;
		var tops		= pos.tops;
		var lid2uid		= pos.lid2uid;

		var single_symbol_cells = true;
		var script = ":::map\n";

		if( do_comap )
		{
			script += ":::comment: MAKE SURE THERE IS A HERO DEFINED ON THIS MAP.\n";
			var co_game = 'co_' + gm.game.gkey;
			var co_game = co_game.replace( /^co_co_/, '' );
			if( gio.def.games[ co_game ] ) {
				script += ":::context_akey=" + co_game + "\n";	
			}else{
				script += ":::comment: there is no co game, " + co_game + ", defined ... \n";
			}		
		}

		var board = '';
		for( var yy = 0; yy < y_size; yy++ ) {

			for( var xx = 0; xx < x_size; xx++ ) {

				var tower	= loc2lid[ xx ][ yy ];
				if( !tower ) break;

				var top		= tops[ xx ][ yy ];
				var tower_script = '';
				var short_symbols = true;

				for( var zz_virt = 0; zz_virt <= top; zz_virt++ ) {


					var zz = do_comap ? (top - zz_virt) : zz_virt; 

					var lid = tower[ zz ];
					var uid = lid2uid[ lid ];
					var unit = units[ uid ];
					var symbol =	do_comap ? 
									cotable[ unit.cname ] :
									table[ unit.cname ];
					if( symbol === cmd.map_sugar.GROUND ) {
						if( top > 0 )
						{
							if( zz_virt < top ) tower_script += '.';
							continue;
						}
						symbol = cmd.map_sugar.GROUND;
					}
					if( symbol.length > 1 ) short_symbols = false;
					tower_script += symbol;
					if( zz_virt < top || top === 0 ) tower_script += '.';
				}
				if( short_symbols ) tower_script = tower_script.replace( dot_regex, '' );
				if( mapcut[ tower_script ] ) tower_script = mapcut[ tower_script ];

				if( tower_script.length > 1 ) single_symbol_cells = false;
				board += tower_script + ' ';
			}
			board += "\n";
		}

		if( single_symbol_cells ) {
			board = board.replace( space_regex, '' ).replace( TARGET_REGEX, TARGET );
		}
		script += board + ":::board_end\n";

		return script;

	}; //rman.pos2map_script
	rman.path2texts=function(round, sugar_do_inverse_path){

		var ww					= cmd.playpath;
		var DIRECTION			= ww.DIRECTION;
		var TOKEN_SEPARATOR		= ww.TOKEN_SEPARATOR;
		var SUBTOKEN_SEPARATOR	= ww.SUBTOKEN_SEPARATOR;

		var text='', count=0, c;
		var gm=round.gm;
		var colonies=gm.cols;
		var breed2color = gm.actors>1 && cmd.breed2color;


		var sugar_inverse_path = '';
		var copathy = gm.game.post_definition_copathy;

		var move_token;
		tp.core.each(round.moves, function(ix,move){

			var direction=move.action.direction; //steps[0];
			switch(direction){
				case -1:	c='l';
							break;
				case  1:	c='r';
							break;
				case -2:	c='u';
							break;
				case  2:	c='d';
							break;
			}

			move_token = '';
			if(breed2color){

				var unit=gm.units[move.action.uid];
				var symbol=breed2color[unit.cname];
				move_token = TOKEN_SEPARATOR+symbol+SUBTOKEN_SEPARATOR+unit.ix+'.';
			}
			if(move.steps.length>1)	c=c.toUpperCase();

			text += move_token + c;

			if( copathy ) {
				sugar_inverse_path = move_token + copathy( gm, move, sugar_inverse_path, c );
			}
			count +=1;
			if((count === 15 && breed2color) || count === 40 ){
				count=0;
				text += "\n";
				if( copathy ) sugar_inverse_path = "\n" + sugar_inverse_path;
			}
		});

		return {	path : text,
					co_path : (copathy && sugar_inverse_path ) || '',
					metrics : '' + round.moves.length + '.' + round.interacts + '.' + round.peer_change
		};
	};
	rman.path2texts_current = function()
	{
		return rman.path2texts( gio.getgs().round );
	};
	rman.text2round = function( text_, round )
	{

		var ww					= cmd.playpath;
		var DIRECTION			= ww.DIRECTION;
		var TOKEN_SEPARATOR		= ww.TOKEN_SEPARATOR;
		var SUBTOKEN_SEPARATOR	= ww.SUBTOKEN_SEPARATOR;

		var verbose				= gio.modes.dynamic.verbose || gio.debug;
		var gs					= gio.getgs();
		round					= round || gs.round;
		var	gm					= round.gm;
		var game				= gm.game;
		var colony				= gm.acting_col;
		var unit_ix				= 0;

		var text				= text_.replace(/\n|\r|\t| /g,'');
		var colonies			= gm.cols;
		var validator_err		= '';
		var move_validator;

		do_slide_round_to_beginning(round);
		var color2breed	= gm.actors > 1 && cmd.color2breed; //gm.script.color2breed;
		var multiactor		= (color2breed && text.indexOf(TOKEN_SEPARATOR) > -1);
		var splitter		= multiactor ? TOKEN_SEPARATOR : ''
		var textArray		= text.split(splitter);

		if(gio.debug){
			gio.cons_add('Converting text to path. ');
			gio.cons_add(	'Multiactor='+multiactor+' actors='+gm.actors+
							' gkey='+gm.game.gkey);
		}
		var debugText = '';
		for(var i=0; i<textArray.length; i++){

			var token=textArray[i];
			debugText += token;
			if(token === '' )continue;
			
			var detoken;
			var direction='missed';
			var directionSymbol='missed';
			if(multiactor){

				detoken=token.split(SUBTOKEN_SEPARATOR);
				var colonyName = color2breed[detoken[0]];
				if(!colonyName){
					validator_err=	'No active breed exists for map symbol '+detoken[0] + "\n";
				}else if(!colonies[colonyName]){
					validator_err=	'No such breed found in this map: '+colonyName + "\n";
				}else{
					colony=colonies[colonyName];
					if(isNaN(detoken[1])){
						validator_err=	'Cannot interpret unit number.'+
										'Token in path='+token+'.' + "\n";
					}else{
						unit_ix=parseInt(detoken[1]);
						directionSymbol=detoken[2];
					}
				}
			}else{
				directionSymbol=token;
			}

			if(!validator_err){
				direction=DIRECTION[directionSymbol.toLowerCase()];
				if(!direction){
					validator_err += 'Cannot recognize symbol(s) "'+directionSymbol+'" in a map';
				}else{
					try{ // TODm inconsistent design .... why error can happen here at all?
						move_validator=gio.do_process_move(direction, gm, round.pos, colony.units[unit_ix], round )
					}catch( error ){
						validator_err +=  
								"Error decoding token " + token + "\n" +
								"Direction symbol = " + directionSymbol + "\n" +
								"Error = " + error.message;
						move_validator = false;
					}	
					if(!move_validator){
						validator_err += gio.info.log.move + "\n" +
						"Move of "+colony.units[unit_ix].hname+" is failed\n";
					}else if(verbose){
						debugText += ' ' + gio.info.log.move;
					}
				}
			}
			if(validator_err){
				validator_err += "Retrieved only " + round.moves.length + " moves\n" + 
								 "Parsed text is = " + debugText + "\n";
				break;
			}
		}// Steps loop

		if(verbose) gio.cons_add('Parsed path = '+debugText);

		return validator_err;
	};//rman.text2round...



})();


(function(){	 	var tp   	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  	=  tp.gio    =  tp.gio   || {};
					var tclone	=  tp.core.tclone;
					var rman	=  gio.navig.in_session.round;
	rman.serialize_rounds = function(gm, no_json){
		var gm = gm || gio.getgs().gm;
		var rounds = gm.rounds;
		var stash = {};

		stash.akey = gm.collection.ref.list.akey;
		stash.collection_ix = gm.collection.ref.list.ix;
		stash.map_ix = gm.ix;
		stash.current_round_ix = rounds.ix;
		
		stash.rounds = [];
		for(var rix=0; rix<rounds.length; rix++){
			var round = rounds[rix];
			var sr = stash.rounds[rix]={};
			sr.path = gio.navig.in_session.round.path2texts(round).path;

			var pstate = gm.solver.adapter.createdNode( round.start_pos );
			sr.pstate = tclone(pstate);
		}
		stash.current_round_ix = rounds.ix;

		var result = no_json ? stash : JSON.stringify(stash,null,'\t');

		return result;
	};
	rman.deserialize_rounds = function(rounds_input, already_unjasoned, no_refresh, gm){

		var success_flag = false;

		var des = already_unjasoned ? rounds_input : JSON.parse(rounds_input);

		if(!gm){
			if(gio.debug){
				gio.cons_add('Deserializing rounds. Going to select game and collection.');
			}
			var result = gio.navig.validate_coll_map(
				des.akey,
				des.collection_ix,
				des.map_ix,
				'do_load'
			);
			if(!result){
				gio.cons_add('Failed to load rounds for game '+des.akey);
				return false;
			}
			gm = gio.getgs().gm;
		}


		if(gio.debug){
			gio.cons_add('We have successfully positioned on map ix = ' + 
					gm.ix + ' game.basekey=' + gm.game.basekey +
					' game.gkey=' + gm.game.gkey +
					' bundle=' + gm.collection.ref.list.akey );
			gio.cons_add('Beginning loop of expanding round(s). Number of rounds = '+des.rounds.length);
		}


		var successfully_restored_round = -1;
		var dsuccess_flag = true;
		for(var rix=0; rix<des.rounds.length; rix++){
			var dround		= des.rounds[rix];
			var start_pos	= gm.solver.adapter.doReStorePosition(dround.pstate); // TODO No validation? Do it. Needs separate converter to avoid hurting a speed.
			var round;
			if( rix < gm.rounds.length ){
				gm.rounds.ix = rix;
				round = rman.init_round(gm, 'reset', start_pos);
			}else{
				round = rman.init_round(gm, '', start_pos);
			}
			var validationError = gio.navig.in_session.round.text2round(dround.path, round);
			if(validationError){
				dsuccess_flag = false;
				gio.cons_add('Round restoration failed: ' + validationError);
			}else if( successfully_restored_round < 0 || rix === des.current_round_ix ){
				successfully_restored_round = rix;
			}
		}

		if(successfully_restored_round > -1){
			gm.rounds.ix = successfully_restored_round;
			for(var rix=gm.rounds.length-1; rix >= des.rounds.length; rix--){
				gm.rounds.pop();
			}
			if( !no_refresh ) {
				gio.navig.validate_coll_map( null, null, null, 'do_land' );
			}
		}

		if(gio.debug){
			gio.cons_add('Map session load ' + (dsuccess_flag ? 'success' : 'falure')) + '.';
		}
		return dsuccess_flag;
	};


})();


(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var tclone	=  core.tclone;
					var rman	=  gio.navig.in_session.round;
					var dios	=  gio.data_io.session;
		dios.session2db_ready_obj = function(){
			var session = {};
			core.each(gio.session.alist, function(gix, playalb){
				core.each(playalb.collections, function(coll_ix, coll){
					var coll_key = 'c'+coll_ix;
					if( coll.maps_loaded !== 'success' ) return true;
					core.each(coll.maps, function(mix, gm){
						var map_key = 'm'+mix;
						if( !gm.rounds ) return true;
						var sg = session[playalb.key] = session[playalb.key] || {};
						var sgc = sg[coll_key] = sg[coll_key] || {};
						sgc[map_key] = { raw_board : gm.script.raw_board,
										 rounds : rman.serialize_rounds(gm, 'no json')
										}
					});			
				});			
			});
			session = 	{	authenticity_token : gio.session.server.message.form_authenticity_token,
							jsoned_session : JSON.stringify(session,null,'\t')
						};
			return session;		
		};
		dios.load_jsoned_sess2sess = function(jsoned_session){

			var session = JSON.parse(jsoned_session);
			var success = true;
			var last_gm = null;
			core.each(gio.session.alist, function(gix, playalb){

				if( !session[playalb.key] ) return true;
				core.each(playalb.collections, function(coll_ix, coll){

					var coll_key = 'c'+coll_ix;
					if( !session[playalb.key][coll_key] ) return true;
					if( !coll.maps_loaded ) gio.data_io.download_cfile(coll);
					if( coll.maps_loaded !== 'success' ) return true;
					core.each(coll.maps, function(mix, gm){

						var map_key = 'm'+mix;
						var sess_map = session[playalb.key][coll_key][map_key];
						if( !sess_map ) return true;
		
						var ww = sess_map.raw_board;
						if( gm.script.raw_board !== ww ){
							gio.cons_add(	'Since session saved, map ' + gm.ix +
											" \"" + gm.title + "\" has been changed.\n" +
											"Former map = \n" + ww + "\n"+
											"New map = \n" + gm.script.raw_board + "\n"   );
							return true;
						}
						if(gm.load === 'parsed') gio.session.reinit.landify_map( gm );
						if(gm.load === 'invalid'){
							gio.cons_add('Map ' + gm.ix + ' is invalid and cannot take session rounds.');
							return true;
						}

						if(gio.debug){
							gio.cons_add('Going to deserialize map ' + gm.ix +
										' game.basekey=' + gm.game.basekey  +
										' game.gkey=' + gm.game.gkey +
										' bundle='+gm.collection.ref.list.akey);
						}
						var this_success = rman.deserialize_rounds(
							sess_map.rounds,
							'unjasoned',
							'dont refresh',
							gm
						);
						if(this_success) last_gm = gm;
						if(!this_success) success = false;

					});			
				});			
			});

			if(	last_gm &&
				!gio.navig.validate_coll_map (
								last_gm.collection.ref.list.akey,
								last_gm.collection.ref.list.ix,
								last_gm.ix,
								'do_land'
				)
			){
				gio.cons_add( 'Failed to load rounds for map ' + gm.title );
				return false;
			}

			return success;
		};


})();


(function(){		var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;

					var procs	=  gio.core.procs;
					var ggp		=  gio.gui.procs;
	gio.do_process_move = function(
			direction,
			gm,
			pos,
			unit,
			round_or_play_flag,
			dont_change_pos_and_leave,
			forbid_contacts,
			dropx, dropy, dropz	// landed-cell coordinates
	){
			if(gio.debug){
				gio.cons_add(	'Firing move. gkey=' + gm.game.gkey +
								' uname=' + unit.uname +
								' hname=' + unit.hname +
								' direction=' + direction);
				if( !isNaN(gio.debug) &&  gio.debug % 3 === 0 ){
					var ww = gio.core.procs.check_uid2lid_and_lid2uid( gm, pos.lid2uid, pos.tops, pos.uid2lid );
					if(ww){
						gio.cons_add( ww.message );
						return null; //TODO must crash app, but not let it working in broken state
					}
				}
			}
			var move		= { pos:pos, steps:[], action : { direction : direction, uid : unit.id } }
			var new_move	= gio.core.procs.do_interaction( direction, unit, move, null, forbid_contacts, null, dropx, dropy, dropz  );
			var new_move	= gio.core.procs.do_interaction( direction, unit, move, 1, forbid_contacts, null, dropx, dropy, dropz  );

			gio.modes.dynamic.verbose = (typeof round_or_play_flag === 'string');
			var verbose = gio.modes.dynamic.verbose || gio.debug;
			if( !new_move ){
				if( verbose ) gio.plcons_add(gio.info.log.move + "Move failed");
				return null;
			}
			if(gm.game.herd_sense>0 && new_move.steps.length > 1){
				new_move = gm.game.herd_rules(new_move,gm);
			}
			if(dont_change_pos_and_leave){
				if( verbose ) gio.plcons_add(gio.info.log.move + "Position preserved");
				return new_move;
			}
			var steps	= new_move.steps;
			var locs	= gm.locs;
			var tops	= pos.tops;
			var lid2uid = pos.lid2uid;
			var uid2lid = pos.uid2lid;
			var uid2loc = pos.uid2loc;




			/*
			if(steps[0].lid === 27 ){
				var xx = locs[28][0];
				var yy = locs[28][1];
				var tower = ' tower=';
				for(var ii=0; ii<gm.loc2lid[xx][yy].length; ii++){
					var lid = gm.loc2lid[xx][yy][ii];
					var uid = lid2uid[lid];
					var name = uid > -1 && gm.units[uid] ? ' ' + gm.units[uid].hname : ' uid='+uid;
					tower += ' z='+ii+ name; 
				}
				c onsole.log('Before units removal. step departure = 27  tops='+ tops[xx][yy] + tower + ' loc=',locs[27]);
			}				
			*/
			if( verbose && steps.length > 1){
				gio.info.log.move += "There are "+ new_move.steps.length + " steps in new move\n";
			}
			for(var s=0; s<steps.length; s++){
				var lid = steps[s].lid;
				var ww_uid = lid2uid[lid];

				lid2uid[lid]=-1;
				var xx = locs[lid][0];
				var yy = locs[lid][1];
				tops[xx][yy] -= 1;
				if( gio.debug && !isNaN(gio.debug) &&  gio.debug % 3 === 0 ) {
					gio.cons_add(	'Unit ' + ww_uid + ' "' + ( gm.units[ww_uid] && gm.units[ww_uid].hname ) + '" ' +
									'removed from lid, xx,yy=' + lid + ', ' + xx + ',' + yy +
									' on step=' + s + ' of ' + steps.length
					);
				}
			}
			/*
			if(steps[0].lid === 27 ){
				var tower = ' tower=';
				for(var ii=0; ii<gm.loc2lid[xx][yy].length; ii++){
					var lid = gm.loc2lid[xx][yy][ii];
					var uid = lid2uid[lid];
					var name = uid > -1 && gm.units[uid] ? ' ' + gm.units[uid].hname : ' uid='+uid;
					tower += ' z='+ii+ name; 
				}
				c onsole.log('step departure = 27  tops='+ tops[xx][yy] + tower + ' loc=',locs[lid]);
			}				
			*/
			var roof = gm.game.rule_helpers.map_roof;
			for(var s=0; s<steps.length; s++){

				var step		= steps[s];
				var suid		= step.uid;
				var xx			= step.new_loc[0];
				var yy			= step.new_loc[1];
				var zz			= tops[xx][yy]+1;
				if( zz >= roof ) {
					throw	{ message :	'Trying to put unit '+suid+ ' "' + gm.units[suid].hname + //TODO there is no cather ... bad
										'" higher than roof. Step=' + s + ', x,y,z=' + xx + ', ' + yy + ', ' + zz
							};
				}
				tops[xx][yy]	= zz;
				var zlid=gm.loc2lid[xx][yy][zz];
				lid2uid[zlid] = suid;
				if(gio.debug && !isNaN(gio.debug) &&  gio.debug % 3 === 0 ) {
					gio.cons_add( 'Moved unit '+suid+ ' "' + gm.units[suid].hname + '" to '+xx+','+yy+','+zz+'. lid='+zlid 	);
				}
				uid2lid[suid] = zlid;
				uid2loc[suid] = locs[zlid];
				step.new_lid = zlid;
			}
			if( gio.debug && !isNaN(gio.debug) &&  gio.debug % 3 === 0 ){
					var ww = gio.core.procs.check_uid2lid_and_lid2uid( gm, pos.lid2uid, pos.tops, pos.uid2lid );
					if(ww){
						gio.cons_add( ww.message );
						return null; //TODO must crash app, but not let it working in broken state
					}
			}



			if(round_or_play_flag){
				if(typeof round_or_play_flag === 'string'){
					gio.gui.procs.do_manage_round(new_move.steps, false, new_move.action);
					if(gm.multiplayer){
						ggp.do_one_scroll_of_colony( 'right' );
						gio.plcons_add('Hero ' + gio.getgs().unit.hname + ' selected');
					}
					if(verbose) gio.plcons_add(gio.info.log.move);
				}else{
					var round = round_or_play_flag;
					gio.navig.in_session.round.do_back_forw_start_record(
							round,
							'',
							new_move.steps,
							new_move.action);
				}
			}
			return new_move;
	};
	gio.navig.process_move_record = function ( gm, pos, steps, backward )
	{
			var locs = gm.locs;
			var tops = pos.tops;
			var lid2uid = pos.lid2uid;
			var uid2lid = pos.uid2lid;
			var uid2loc= pos.uid2loc;
			for(var s=0; s<steps.length; s++){
				var former_lid = backward ? steps[s].new_lid : steps[s].lid;
				lid2uid[former_lid]=-1;
				var loc = locs[former_lid];
				tops[loc[0]][loc[1]] -= 1;
			}
			for(var s=0; s<steps.length; s++){
				var step=steps[s];
				var suid=step.uid;
				var former_lid	= backward ? step.new_lid : step.lid;
				var new_lid		= backward ? step.lid : step.new_lid;
				lid2uid[new_lid]=suid;
				uid2lid[suid]=new_lid;
				uid2loc[suid]=gm.locs[new_lid];

				var loc = locs[new_lid];
				var xx=loc[0];
				var yy=loc[1];
				var zz = tops[xx][yy]+1;
				tops[xx][yy]=zz;
			}
	};
	procs.check_uid2lid_and_lid2uid = function( gm, lid2uid, tops, uid2lid ) {
		var failed = procs.check_uid2lid_units_integrity( gm, uid2lid );
		if( failed ) return failed;
		return procs.check_lid2uid_tops_integrity( gm, lid2uid, tops );
	};
	procs.check_uid2lid_units_integrity = function( gm, uid2lid ) {
		for(var uid=0, len=gm.units.length; uid < len; uid++ ) {
			var lid = uid2lid[uid];	
			if( !lid && lid !== 0 ) return { message : "Unit " + uid + " " + gm.units[uid].hname + " is no longer on the map." };
		}
		return null;
	};
	procs.check_lid2uid_tops_integrity = function( gm, lid2uid, tops )
	{
		var locs = gm.locs;
		var roof = gm.game.rule_helpers.map_roof;
		for( var lid=0; lid<locs.length; lid++){

			var loc = locs[lid];
			if( (!loc && loc !== 0) ) return { message : "sparce loc. array. No loc. for lid = "+lid }; //was "throw"
			if( loc[3] < 0 || loc[3] > 0 ) continue;
			var xx = loc[0];
			var yy = loc[1];			
			var tower = gm.loc2lid[xx][yy];
			var calculated_top = -1;

			if(tower.length !== roof ){
				return {	xx : xx, yy : yy, tower : tower, 
							message :	"tower.length !== roof:" +
										tower.length + ", " + roof
						}
			}

			for( var zz=0; zz<tower.length; zz++){
				var tlid = tower[zz];	
				var uid = lid2uid[tlid];
				if( uid < 0 ) break;
				calculated_top = zz;	
			}


			if( calculated_top !== tops[xx][yy] ){
				return {	xx : xx, yy : yy, tower : tower, 
							message :	"calculated_top = " +
										calculated_top + " != tops[xx][yy] = " + tops[xx][yy]
						}
			}


		}// lid
		return null;

	};




})();


( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;

					var gdef	=  gio.def;
					var session	=  gio.session;
					var state	=  session.state;
					var ggp		=  gio.gui.procs;
					var gsp		=  gio.session.procs;
				
					var conadd		= function ( string ) { gio.cons_add( "Landing Tasks: " + string ); };			
					var deb			= function ( string ) { if( gio.debug) conadd( string ); };			
	gio.navig.landify_and_land_map = function( gm, do_land, dkey ) {

			var coll	= gm.collection;
			var list	= coll.ref.list;
			var akey	= list.akey;
			var album	= session.stemmed_albums[ akey ];
			var colls	= album.collections;
			var cix		= list.ix;

			var validated = session.reinit.landify_map( gm );
			if( !validated )
			{	deb(	"Cannot land m,c,a = " + gm.ix + ', ' +
						cix + ', ' + akey + "\n" +
						(session.reinit.messages || '' ) + "\n"
				);
			}
			if( !do_land || !validated ) return validated;
			ggp.do_display_curr_board	( false );
			gsp.do_memorize_GUI_state	( akey, null, cix, gm.ix );
			album.title					= ggp.get_master_title_from_session_state();
			ggp.virtual_reselect_dress	( gm, dkey );
			gio.gui.unhide_map			( gm ); //TODO validation ... what if this GUI fails ?

			return true;
	};	/// Validates map and lands if requested
	gsp.scroll_till_landable_album = function( aix, do_land ) {

		var len = session.alist.length;
		var start_aix = aix || aix === 0 ?  aix : state.album_ix;

		for( var i=0; i < len; i++ ) {

			var state_aix	= ( start_aix + i) % len;
			playalb			= session.alist[ state_aix ];
			var mess		= " scroll to album " + state_aix + " " + playalb.title;
			deb( "Doing " + mess );
		
			var found_coll_ix1	= gsp.scroll_till_landable_coll(
					playalb.collections.ix, playalb.collections,
					!i, do_land
			);

			if( found_coll_ix1 ) return true;
			deb( "Failed " + mess );
		}

		var ww = 'No games available';
		conadd( ww );
		return false;
	};
	gsp.scroll_till_landable_coll = function( start_ix, collections, download_external_if_first, do_land ) {

		if( ! (collections && collections.length) ) return false;
		var len = collections.length;

		for( var i = 0; i < len; i++){

			var current_coll_ix = ( i + start_ix ) % len;
			var coll			= collections[ current_coll_ix ];
			if( !coll.ref.link.link || (download_external_if_first && !i) ) { //TODM rid
				var success = gio.navig.validate_coll_map( coll.ref.list.akey, coll.ref.list.ix, null, do_land ); 
			}else{
				deb( "Skipped scroll of external coll" );
			}
			if( success ) return ( current_coll_ix + 1 );
		}
		
		conadd( "Scroll failed for colls at akey = \"" + collections[0].ref.list.akey + "\"" );
		return false;
	};
	gio.navig.validate_coll_map = function(

			akey,
			cref,
			map_ref,
			do_land,
			dkey
	){
		if( akey ) {
			var lista = gio.session.stemmed_albums[ akey ];// session.alist_by_key[ akey ];
			if( lista ) {
				var album_ix = lista.ix;
			}else{
				deb( 'Missed akey ' + akey + ' in GUI-album-set');
				return false;
			}
		}else{
			var album_ix = state.album_ix;
			var lista = session.alist[ album_ix ];
		}
		var coll = ( typeof cref === 'string' ) && cref && lista.coll_ref[ cref ];
		if( !coll )
		{
			if( typeof cref === 'number' )
			{
				var cix = cref;
				if( lista.collections.length <= cix || cix < 0) return false;
			}else{
				var cix = lista.collections.ix;
			}
			var coll = lista.collections[ cix ];
		}
		if( !coll.maps_loaded ) gio.data_io.download_cfile( coll );
		if(	coll.maps_loaded !== 'success' ) {
			deb( 'Failed maps load. Message: ' + coll.maps_loaded );
			return false;
		}
		if( !map_ref && map_ref !== 0 )	map_ref = 0;
		var gm = ( typeof map_ref === 'string' ) ? coll.maps_ref[ map_ref ] : coll.maps[ map_ref ];
		if( !gm )
		{
			deb( 'Unable to find map by map_ref = ' + map_ref + '.' );
			return false;
		}


		var finalized = gio.navig.landify_and_land_map( gm, do_land, dkey );

		if( !finalized ) return false;
		return coll;
	};
	gdef.procs.get_preferred_album_def = function ( from_listed ) {

		var first_album = null;
		if( from_listed ) {
			ceach( gdef.albums, function( akey, album ) {
				if( gio.session.alist_by_key[ akey ] ) {
					first_album	= { album : album, key : akey };
					return false;
				}
			});
		}else{
			var first_album = core.get_first_or_null( gdef.albums );
		}
		if( !first_album ) return { album : null, key : '' };
		var chosen_akey = first_album.key;
		var state_aix = state.album_ix;
		var state_akey = state_aix || state_aix === 0 ? 
				session.alist[ state.album_ix ] : '';
		ceach( gdef.albums, function( akey, album ) {
			chosen_akey = ( album.ref.list.chosen && akey )	|| chosen_akey;
		});
		ceach( gdef.albums, function( akey, album ) {
			chosen_akey = ( album.ref.list.listify_on_top && akey ) || chosen_akey;
		});

		chosen_akey = chosen_akey || state_akey;

		return { album : gdef.albums[ chosen_akey ],   key : chosen_akey };
	};




})();


( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ceach	= core.each;
					var exp_url	= core.expand_to_parent;

					var dio		= gio.data_io;
					var ggi		= gio.gui.init;
					var gdef	= gio.def;
					var gdp		= gdef.procs;
					var smode	= gio.modes.sta_tic;
					var gconf	= gio.config;
					var feeder	= gconf.feeder;
					var session	= gio.session;

					var conadd		= function ( string ) { gio.cons_add( "Preload: " + string ); };			
					var deb			= function ( string ) { if( gio.debug) conadd( string ); };			
	session.init.load_core_gamions = function () {

		if( session.state.halted ) return 'Skipped "load_core_gamions".';
		var query 		= gconf.query;
		gdp.spawn_base_game_and_dress();
		var success = dio.download_gamion ( 
			{
				galfinition : { gafion : true },
				common :
				{
						link :	core.app_webpath_noindex + '/' +
								gconf.defpaths.GAMES_DEF_PATH +
								'/games.jwon.txt'
				}
			}
		);
		var ww = "Core folder-games load " + ( success ? 'success.' : 'failure.' );
		if( !success ) return ww;
		deb( ww );
		if( smode.db ) {	
			core.download_object(
					smode.db + '/games',
					gdef, 'games',
					'do paste'
			);
			deb( "Core db-games load finished." );
		}

		gdp.normalize_album_defs( gdef.albums );
		deb( "Derives scode-bundled albums ..." );
		ceach( gdef.albums, function( akey, dummy ) { gdp.derive_album( akey );	});
		deb( "Finished deriving scode-bundled albums ... " );
		deb( "Downloads standalone-albums if any ..." );
		dio.add_gafions();
		gdp.normalize_album_defs( gdef.albums ); // TODM extra junk job
		deb( "Finished standalone-albums if any ... " );



		if( smode.db ) {	
				var db_albums = {};
				var ww = core.download_object(	
						smode.db + '/albums',
						db_albums, 'albums'
				);
				gdp.normalize_album_defs( db_albums.albums );
				ceach( db_albums.albums, function( xx, album ) { album.ref.db = true; });
				core.rpaste ( gdef.albums, crpaste( {}, db_albums.albums, gdef.albums ) );

				deb( "Db-albums, if any, load finished." );
		}
		ceach( gdef.albums, function( akey, adummy ) { gdp.derive_album( akey ); });


		if( query.aurl ) {

			deb( "Album from query " + query.aurl );
			var link = exp_url ( query.aurl );

			var downed_alb = dio.download_gamion (
			{
				galfinition :
				{	penetrate_asingle	: true,
					derive_at_download	: true,
					listify_on_top		: true,
					gafion				: true
				},
 
				common :
				{	link				: link,
					query_is_source		: true,
					jwon				: query.jwon
				}
			});

			var ww = "Album from query " + link + ( downed_alb ? ' success.' : ' failure.' );
			if( !downed_alb ) return ww;
			deb( ww );
		}

		var pakey = gdp.get_preferred_album_def().key;
		if( !pakey ) return "No album definitions are loaded.";
		var downed_coll = false;
		if( query.curl )
		{

			var link		= exp_url ( query.curl, query.aurl );
			var downed_coll	= dio.download_gamion (
			{
				galfinition :
				{	penetrate_asingle	: true,
					derive_at_download	: true
				},

				mapfinition :
				{	passive				: query.cpassive,
					akey_master			: query.akey,
					akey_advice			: pakey,
					chosen				: true,
					title				: "From Query",
					query_credits		: query
				},
 
				common :
				{	link				: link,
					query_is_source		: true,
					jwon				: query.jwon
				}
			});

			if( !downed_coll ) return 'Failed download coll from query.url = ' + link;
			deb( "Coll download success." );
		}


		if( session.alist.length === 0 ) return( 'GUI album list is empty.' );

		session.init.downed_coll = downed_coll;

		return '';
	};




})();




( function () {		var tp		= jQuery.fn.tp$ = jQuery.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var ggi		= gio.gui.init;
					var halted	= gio.description.title + ' is halted.';

					var gdef	= gio.def;
					var gdp		= gdef.procs;
					var smode	= gio.modes.sta_tic;
					var feeder	= gio.config.feeder;
					var session	= gio.session;
					var conadd	= function ( string ) { gio.cons_add( "Core Entry: " + string ); };			
					var deb		= function ( string ) { gio.debly( "Core Entry: " + string ); };			
	session.init.entry = function () {

		if( leave_if_user_declined_browser() )		return "User declined browser";
		deb( "Going to finalize app." );		
		gio.domwrap.regions.droot.style.display		= 'block';
		ggi.create_controls_and_game_list();
		var query 			= gio.config.query;
		var pakey			= gdp.get_preferred_album_def( 'from listed albums' ).key;
		var akey			= query.akey || pakey;
		var coll_ref		= query.ckey || query.cix || query.collection_ix || 0;
		var map_ref			= query.mkey || query.mix || query.map_ix || 0;
		var downed_coll		= session.init.downed_coll;

		if( downed_coll ) {
			if( downed_coll.ref.list.akey && downed_coll.maps_loaded === 'success' ) {
				var akey			= downed_coll.ref.list.akey;
				var coll_ref		= query.ckey || downed_coll.ckey;
			}
		}
		var ww_land = 	" akey, cref, mref = \""	+
						akey					+ "\", \"" + 
						coll_ref				+ "\"" + "\", \"" +
						map_ref					+ "\". ";
		deb( "Landing to" + ww_land );
		if( !gio.navig.validate_coll_map( akey, coll_ref, map_ref, 'do_land', query.dkey ) ) {
				conadd(	"Failed to land on" + ww_land + "\nAttempting preferred akey." );
				if( !gio.navig.validate_coll_map( pakey, 0, 0, 'do_land' ) )
				{
					if( !gio.gui.procs.scroll_till_valid_album( 0, 'do_land' ) ) {
						return( "No valid albums." );
					}
				}
		}
		ggi.control_events();
		ggi.step_events();
		session.state.start_time = (new Date()).getTime(); 
		gio.modes.app_loaded = true;
		var path = query.optpath || query.solpath || query.playpath;
		var path_validator = '\\e\\';
		if( !path || path.substr( path.length -3, 3 ) !== path_validator )
		{
			path = '';
		}else{
			path = path.substr( 0, path.length -3 );
		}
		var gs = gio.getgs();
		if( path )
		{
			var directive = query.optpath ? 'optpath' : ( query.solpath ? 'solpath' : 'playpath' );
			var validator_err = gio.gui.add_and_land_ppath ( gs.gm, directive, gs.gm.pos, path, 'From URL' );
			if( validator_err )
			{
				alert( validator_err );
			}else{
				if( directive === 'optpath' || directive === 'solpath' || query.metrify )
				{
					gio.map_editors.metrify_map( 'show_metrics' );
				}
			}
		}else if( query.pix || query.pix === 0 ) {
			gio.gui.inject_playpath ( query.pix, gs.gm );
			if( query.metrify ) gio.map_editors.metrify_map( 'show_metrics' );
		}else if( query.solve ) {
			gio.solver.fire_button_callback( 'dummy', { title : "Search First" } );
		}		

		return '';

	};// session.init.entry
	var leave_if_user_declined_browser = function() {

		var getout = false;
		var question = "Would you like to continue?";
		var immature_project	= gio.description.title + " is under development and not completely tested.\n";
		immature_project		+= "All tests are positive, but incorrect execution is possible.\n\n";
		var message = question;
		if( core.browser.IE ) {

			var version_barrier = 8;

			var IEVersion = parseInt( core.browser.IE[1] );

			if( IEVersion <= version_barrier )
			{
				var message =
								"Your Internet Explorer version " + IEVersion +
								" is too low.\n\n" + 
								gio.description.title + " is designed for " +
								"Fire Fox, Chrome, or Mobile browsers or\npossibly " +
								"Internet Explorer version " + version_barrier + " or higher.\n\n" +
								question;
				getout = !confirm( message );

			}else if( IEVersion > 10 ) {

				var message =	gio.description.title + " is not tested in this browser.\n" +
								"Fire Fox, Chrome, or Mobile browsers are recommended.\n\n" +
								question;
				getout = !confirm( message );

			}

		}else if( tp.core.browser.Opera ) {
			var message = 	gio.description.title + ' was not tested and not developed in Opera.\n' + 
								"Fire Fox, Chrome, or WebKit browsers are recommended\n";
			getout = !confirm( message );

		}else{
			getout = false; // !confirm( immature_project + question );
		}
		return getout;
	};
	session.init.wrap =	function() { return session.init.entry(); };
	var halt_if_failed = function ( message, area ) {
		if( !message ) return;
		if( area ) message = area + ": " + message;
		gio.cons_add( message );
		session.state.halted = true;
		alert( message + "\n" + halted );
	};
	jQuery( 'document' ).ready( 

		function () {

			var init = session.init;
			var state = session.state;
									halt_if_failed( gio.gui.init.entry(),		"GUI Entry" );
			if( !state.halted ) 	halt_if_failed( init.load_core_gamions(),	"Preload" );
			if( !state.halted ) 	halt_if_failed( session.init.wrap(),		"Init.wrap" );
		}
	);




}) ();




(function(){ 		var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var procs		=  gio.core.procs;
					var ceach		=  tp.core.each;

					var do_debug	= gio.debug && !isNaN(gio.debug) &&  gio.debug % 5 === 0;
	procs.debug_tower = function(xx,yy,gm,pos){
		var tower = gm.loc2lid[xx][yy];
		var top = pos.tops[xx][yy];
		var result = 'Tower in ('+xx+','+yy+') ';
		for(var zz=0; zz<=top; zz++){
			var lid = tower[zz];
			var peer_uid = pos.lid2uid[lid];
			var unit = gm.units[peer_uid];
			result += unit.id + ' ' + unit.hname + ', ';
		}
		return result;
	};
	var is_dynamic_unit_climbed = function(xx,yy,gm,pos,verbose){
			var tower = gm.loc2lid[xx][yy];
			var top = pos.tops[xx][yy];
			for(var zz=0; zz<=top; zz++){
				var lid = tower[zz];
				var peer_uid = pos.lid2uid[lid];
				var activity = gm.units[peer_uid].activity;
				if(activity && (activity.active || activity.passive)){
					if(verbose) gio.info.log.move += 'Cannot climb on '+
								gm.units[peer_uid].hname + "\n";
					return true;
				}
			}
			return false;
	};
	procs.do_interaction = function (
			direction, unit, move, recursion_depth, forbid_contacts, step_length,
			dropx, dropy, dropz, 
			forbidden_interaction
	){
		var log = gio.info.log;
		var steps = move.steps;
		if( !steps.length ) log.move = '';
		var verbose = gio.modes.dynamic.verbose || gio.debug;
		var new_move = gio.prepare_step( direction, unit, move, '', step_length, dropx, dropy, dropz);
		if( !new_move ) return null;
		var pos = move.pos;
		var new_steps = new_move.steps;
		var movers_number = new_steps.length;


		if( !recursion_depth ) {
			recursion_depth = movers_number;
		}
		var ww = new_steps[ movers_number-1 ].new_loc;
		var xx = ww[0];
		var yy = ww[1];
		var gm				= unit.gm;
		var game			= gm.game;
		var imatrix			= game.interact;	
		var DEEPNESS_LIMIT	= game.DEEPNESS_LIMIT;
		var tower			= gm.loc2lid[xx][yy];
		var top				= pos.tops[xx][yy];
		var lid2uid			= pos.lid2uid;


		if(do_debug) {
			gio.cons_add(	'Interacting ... game.gkey=' + game.gkey + 
							' Proposed new_move: direction ' + direction 
			);
		}
		tower_loop: for( var zz=0; zz <= top; zz++ ) {

			var lid = tower[zz];
			var peer_uid = lid2uid[lid];
			for( var ss = 0; ss < steps.length; ss++ ) {
				if( steps[ ss ].uid === peer_uid ) {
					break tower_loop;
				}
			}


			var peer = gm.units[ peer_uid ];
			if(do_debug) {
					gio.cons_add(	'Interacting with ' + peer_uid + ' "' + peer.hname +
									'" peer.pass=' + peer.pass );
			}
			if( peer.pass ) continue;
			var MSG_XY = 'In cell '+ xx+','+yy+','+zz+".\n";
			var MSG_PEERS = unit.hname +' is blocked by '+ peer.hname +".\n";
			if( peer.block ) {
				if( verbose ) log.move += MSG_PEERS + MSG_XY;
				return null;
			}


			if( !imatrix[unit.cname] || !imatrix[unit.cname][peer.cname] ) {
					if( peer.race === 'wall' ) { //TODM races must indiced, not strings?

						if( unit.color_ix === peer.color_ix || unit.color === 0 ) {
							if( verbose ) log.move +=	MSG_PEERS + MSG_XY;
							return null;
						}else {
							continue;
						}
					}else if( peer.race === 'ground' ) {

						if( unit.color_ix === peer.color_ix || unit.color === 0 ) {
							continue;
						}else {
							if( verbose ) log.move +=	MSG_PEERS + MSG_XY;
							return null;
						}
					}
					if( verbose ) log.move +=	MSG_PEERS + MSG_XY;
					return null;


			}else{

				var int_act = imatrix[unit.cname][peer.cname];
				if( verbose ) {
						var mess_stub =
							MSG_PEERS + MSG_XY + "Cannot " + int_act +
							" more than " +
							DEEPNESS_LIMIT+"\n";
				}


				if( int_act === 'pass') {
					if(do_debug) gio.cons_add( 'Continue bs 	int_act = pass' );
					continue;
				}
				if( forbid_contacts ) return false;
				if( int_act && recursion_depth === 1 )
				{
					move.action.intact		= int_act;
					new_move.action.intact	= int_act;
					move.action.peer		= peer;
					new_move.action.peer	= peer;
				}
				if( forbidden_interaction === int_act ) {
						if( verbose ) log.move +=	"Cannot " + int_act + " with " + peer.hname + "\n";
						return null;
				}
				if( int_act === 'push' ) {
					if(recursion_depth > DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					new_move=procs.do_interaction(
							direction, peer, new_move,
							recursion_depth+1
					);
					return new_move;
				}else if( int_act === 'pull' ) {

					if(recursion_depth > DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					new_move.steps.splice( new_move.steps.length - 2, 1 );
					new_move = procs.do_interaction(
							-direction, unit, new_move,
							recursion_depth+1,
							undefined, undefined, undefined, undefined, undefined,
							'pull'
					);
					if( !new_move ) return null;
					new_move = procs.do_interaction(
							-direction, peer, new_move,
							recursion_depth + 1
					);
					return new_move;
				}else if(int_act === 'swap'){
					if(recursion_depth > DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					new_move = procs.do_interaction(
							-direction, peer, new_move,
							recursion_depth+1
					);
					return new_move;
				}else if(int_act === 'leap'){

					if(recursion_depth > DEEPNESS_LIMIT){
						if(verbose) log.move +=	mess_stub;
						return null;
					}
					new_move = procs.do_interaction( -direction, peer, new_move, recursion_depth + 1, undefined, 2 );
					if( !new_move ) return null;
					new_move.steps.splice( 0, 1 );

					if(do_debug && new_move ) gio.cons_add(	'Leap is valid.'	);
					return new_move;
				}else if( int_act === 'jump') {

					if( recursion_depth > DEEPNESS_LIMIT ) {
						if(verbose) log.move +=	mess_stub;
						return null;
					}

					var step_length = recursion_depth+1;
					new_move = procs.do_interaction (
						direction, unit, move, recursion_depth + 1, undefined, step_length
					);
					return new_move;





				}else{

					if(verbose) log.move +=	MSG_PEERS + MSG_XY;
					return null;
				}

			}//	if(imatrix[accol.nam])
		}

		return new_move;
	};//do_interaction()
	gio.prepare_step=function(
		direction, unit, move, dynamic_units_do_block, step_length,
		dropx, dropy, dropz
	){

		var verbose = gio.modes.dynamic.verbose || gio.debug;
		var gm = unit.gm;
		var uid = unit.id;
		var pos = move.pos;
		var loc = gm.locs[pos.uid2lid[uid]];

		if(gio.debug){
			gio.cons_add(	'Preparing step ... game.gkey='+gm.game.gkey+
							' u/h name=' + unit.uname + '/'+unit.hname +
							' direction=' + direction + ' shift=' + shift +
							' dropx, dropy, dropz='+dropx + ', ' + dropy + ', ' + dropz);
		}


		var dimension = Math.abs(direction)-1;
		if( dropx || dropx === 0 ) {
			var new_loc=[dropx, dropy, dropz]; //TODO not tested solution
		}else{


			if(dimension < 0) return null;
			var dir = direction > 0 ? 1 : -1;
			var shift = dir * ( step_length || 1 );

			var new_loc=[loc[0],loc[1],loc[2]];
			var locd = loc[dimension];
			var new_locd = locd + shift;
			if(new_locd<0 || new_locd >= gm.size[dimension]){
				if(verbose){
					 gio.info.log.move += "Step from " +
						gm.dresses_wrap.chosen_dress.DIMENSION_NAMES[dimension] +
						"=" + locd + " to " +
						new_locd + " is outside of map.\n";
				}
				return null;
			}
			new_loc[dimension] = new_locd;
		}
		var xx=new_loc[0];
		var yy=new_loc[1];
		var zz=new_loc[2];
		if(!gm.xy_exists[xx][yy]){
			if(verbose) gio.info.log.move += 'Unreachable cell '+xx+', '+yy+"\n";
			return null;
		}

		var lid = gm.loc2lid[loc[0]][loc[1]][loc[2]];
		var new_lid = gm.loc2lid[xx][yy][zz];
		if(dynamic_units_do_block){
			if(is_dynamic_unit_climbed(xx,yy,gm,pos,verbose)) return null;
		}


		var step={	uid : uid,
					direction : direction,
					loc : loc,
					lid : lid,
					new_loc : new_loc,
					new_lid : new_lid
				 };

		var new_move = {
					pos : pos,
					action : move.action,
					steps : tp.core.paste_non_arrays( [], move.steps )
		};
		new_move.steps.push(step);
		return new_move;
	};



	var inside_plain_square=function(center_loc, test_loc, radius)
	{
		return 	Math.abs(test_loc[0]-center_loc[0])<=radius &&
				Math.abs(test_loc[1]-center_loc[1])<=radius;
	};



})();

( function () {	 	var tp		= $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		= tp.gio    =  tp.gio   || {};
					var cpaste	= tp.core.paste_non_arrays;
	gio.core.reflection.serialize_collections=function(){

		var res = [];
		var len=gio.session.alist.length;
		for(var alix=0; alix<len; alix++){

			var alb=gio.session.alist[alix];
			for(var collix=0; collix<alb.collections.length; collix++){

				var coll = alb.collections[collix];
				if( coll.ref.link.link ) continue;
				if( !coll.maps_loaded ) gio.data_io.download_cfile(coll);
				if( coll.maps_loaded !== 'success' ) continue;
				var scoll = res[res.length] = 
					cpaste( {}, gio.def.templates.play.coll );
				var folder = coll.ref.folder;
				scoll.akey = folder.akey;
				scoll.ckey = folder.ckey;
				scoll.file_key = folder.fkey;
				scoll.script.source_text = coll.script.source_text;
			}
		}
		return JSON.stringify(res,null,'\t');
	};
	gio.core.reflection.serialize_game_defs=function(){
		return JSON.stringify(gio.def.games,null,'\t');
	};

	/*
	gio.core.reflection.serialize_basegame_def=function(){
		var def = gio.def.inherited_games[	gio.def.base_game.basekey  ];
		return JSON.stringify( def,null,'\t' );
	};
	*/


}) ();

(function(){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio  =  tp.gio    =  tp.gio   || {};


				var config	= gio.solver.config;
	gio.solver.Adapter = function( map_sol_ver, gm  ) { 

		var w;
		var adapter={};

		var lid2hid = gm.digest.lid2hid;
		var hid2lid = gm.digest.hid2lid;
		var hid2loc = gm.digest.hid2loc;

		var loc2lid = gm.loc2lid;
		var dynamic_units = gm.dynamic_units;
		var dynamic_cols = gm.dynamic_cols;
		var dynamic_cols_len = dynamic_cols.length;
		var units = gm.units;
		var locs = gm.locs;
		var game = gm.game;
		var CANON_REPRESENTED_AS	= config.CANON_REPRESENTED_AS;
		var wCON					= gio.solver.CONSTANTS;
		var CANON__STRING			= CANON_REPRESENTED_AS	=== wCON.CANON_STRING;
		var CANON__ARRAY			= CANON_REPRESENTED_AS	=== wCON.CANON_ARRAY;
		var CANON__LINKED_LIST		= CANON_REPRESENTED_AS	=== wCON.CANON_LINKED_LIST;
		var ww				= gio.solver.POSPOINT;
		var STATE			= ww.STATE;
		var HID				= ww.HID;
		var UPLINKS			= ww.UPLINKS;
		var l_pos=tp.core.tclone(gm.pos);
		var l_lid2uid	= l_pos.lid2uid;
		var l_tops		= l_pos.tops;
		var l_uid2lid	= l_pos.uid2lid;
		var l_uid2loc	= l_pos.uid2loc;
		var node_dimension=0;
		var NOT_YET_FILLED = -1;
		var limit = 1.0;
		(function( map_sol_ver ) {
			var permitted_hids = hid2lid.length;
			for(var did=0; did<dynamic_cols_len; did++){
				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				node_dimension += ulen;

				var repetition = 1;
				for(var uix=0; uix<ulen; uix++){
					repetition *= (uix+1);
					limit *= permitted_hids;
					permitted_hids -= 1;
				}
				limit /= repetition;
			}

		})();


		adapter.get_stat_info = function( map_sol_ver ) {
			map_sol_ver.stat.flat_dynamics_top_nodes_estimation = limit;
			map_sol_ver.stat.hids_number = hid2lid.length;
			map_sol_ver.stat.node_dimension = node_dimension;
		}
		adapter.createdNode = function( input_pos, sphere_id, angle_id, nodes_repository ) {

			var ground_always_on_level_0 = game.rule_helpers.ground_always_on_level_0;

			var ordered_hids	= [];
			var lid2uid			= input_pos.lid2uid;
			var tops			= input_pos.tops;
			var count			= 0;

			for(var hid=0; hid<hid2lid.length; hid++){

				var loc0 = hid2loc[hid];
				var xx = loc0[0];
				var yy = loc0[1];
				var zz = tops[xx][yy];
				if( !zz && ground_always_on_level_0 ) continue;
				var lid = loc2lid[xx][yy][zz];
				var uid = lid2uid[lid];

				var unit = units[uid];
				var activity = unit.activity;
				if( !(activity.passive || activity.active) ) continue;
				var did = unit.col.did;
				ordered_hids[did] = ordered_hids[did] || [];
				ordered_hids[did].push(hid);
				count +=1;
				if(count === node_dimension) break;

			}//for( hid=...


			if( !nodes_repository ) {
				return CANON__ARRAY ? ordered_hids : canon2str( ordered_hids );
			}


			count = 0;
			var nd = nodes_repository;
			for(var did=0; did < dynamic_cols_len; did++){
				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				var w_oh_did = ordered_hids[did];

				for(var uix=0; uix < ulen; uix++){
					count += 1;
					var hid = w_oh_did[uix];
					var ndh = nd[ hid + UPLINKS ];
					if( !ndh ) {

						ndh = nd[ hid + UPLINKS ] = [];
						if( CANON__LINKED_LIST )
						{
							ndh[ STATE ]		= count === 1 ? null : nd;
							ndh[ HID ]			= hid;
						}
						if(count === node_dimension) {
							if( CANON__LINKED_LIST )
							{
								return ndh;
							}else{
								nd[ hid ] = true;
								return CANON__STRING ? canon2str( ordered_hids ) : ordered_hids;
							}
						}
					}
					if( count === node_dimension ) {
						return null;
					}

					nd = ndh; //[ hid + UPLINKS ];
				}
			}

		};
		adapter.doReStorePosition = function( ordered_hids ) {
			for(var ix=0; ix<dynamic_units.length; ix++){
				var unit=dynamic_units[ix];
				var lid=l_uid2lid[unit.id];
				l_lid2uid[lid]=-1;
				var loc = locs[lid];
				l_tops[loc[0]][loc[1]] -= 1;
			}
			for(var did=0; did<dynamic_cols_len; did++){

				var col = dynamic_cols[did];
				var cunits = col.units; 
				var ulen = cunits.length;
				var ohids = ordered_hids[did] ;

				for(var uix = 0; uix < ulen; uix++){

					var uid = cunits[uix].id;
					var hid = ohids[uix];

					var loc0 = hid2loc[hid];
					var xx = loc0[0];
					var yy = loc0[1];

					var zz = l_tops[xx][yy]+1;
					l_tops[xx][yy] = zz;

					var tlid=loc2lid[xx][yy][zz];
					l_lid2uid[tlid]=uid;

					l_uid2lid[uid]=tlid;
					l_uid2loc[uid]=locs[tlid];
				}//uix
			}//did
			return l_pos;
		};//adapter.doReStorePosition
		adapter.canode2pos = function( canode ) {
			var l_u = l_lid2uid;
			var l_t = l_tops;
			var l_l = l_uid2lid;
			var l_o = l_uid2loc;
			for(var ix = 0, wlen = dynamic_units.length; ix < wlen; ix++ ) {
				var unit				= dynamic_units[ ix ];
				var lid					= l_l[ unit.id ];
				l_u[ lid ]				= -1;
				var lc					= locs[ lid ];
				l_t[ lc[0] ][ lc[1] ]	-= 1;
			}

			var len = dynamic_cols_len;

			for( var dcol = len-1; dcol > -1; dcol-- )
			{
				var col		= dynamic_cols[ dcol ];
				var units	= col.units; 
				var ulen	= units.length;

				for( var dunit = ulen - 1; dunit > -1; dunit-- )
				{
					var uid = units[ dunit ].id;
					var hid = canode[ HID ];
					var loc0		= hid2loc[ hid ];
					var xx			= loc0[0];
					var yy			= loc0[1];
					var zz			= l_t[xx][yy] + 1;
					l_t[ xx ][ yy ]	= zz;
					var tlid	= loc2lid[ xx ][ yy ][ zz ];
					l_u[ tlid ]	= uid;
					l_l[ uid ]	= tlid;
					l_o[ uid ]	= locs[ tlid ];
					canode = canode[ 0 ];
				}
			}
			return l_pos;
		};	// adapter.canode2p..



		/*
		adapter.doCompareSpots=function(a,b)
		{
			for(var did=0; did<dynamic_cols_len; did++){
				var au = a[did];
				var bu = b[did];
				var len = au.length; // TODm do shortcut this
				for(var ix=0; ix<len; ix++){
					if( au[ix] !== bu[ix] )	return false;
				}
			}
			return true;
		};
		*/
		var canon2str = adapter.canon2str = function( ordered_hids ) //TODMS
		{	
			var result = '';
			for( var dcol = 0, len = ordered_hids.length; dcol < len; dcol++ )
			{
				var collection_group = ordered_hids[dcol];
				for( var dunit = 0, ulen = collection_group.length; dunit < ulen; dunit++ )
				{
					var hid = collection_group[dunit];
					result += hid;
					if( dunit < ulen-1 ) result += '.';
				}
				if( dcol < len-1 ) result += ':';
			}
			return result;
		};
		adapter.str2canon = function( str ) //TODMS
		{	
			var breeds = str.split(':');
			var canon = [];
			for( var dcol = 0, len = breeds.length; dcol < len; dcol++ )
			{
				var group = canon[dcol] = breeds[dcol].split('.');
				for( var dunit = 0, ulen = group.length; dunit < ulen; dunit++ )
				{
					group[dunit] = parseInt(group[dunit]);					
				}
			}
			return canon;
		};
		adapter.canode2canon = function( canode )
		{	
			var canon = [];
			var len = dynamic_cols_len;

			for( var dcol = len-1; dcol > -1; dcol-- )
			{
				var col = dynamic_cols[ dcol ];
				var cunits = col.units; 
				var ulen = cunits.length;
				var sub_canon = canon[ dcol ] = [];
				for( var dunit = ulen - 1; dunit > -1; dunit-- )
				{
					sub_canon[ dunit ] = canode[ HID ];
					canode = canode[ 0 ];
				}
			}
			return canon;
		};



		return adapter;
	}; /// Constructs adapter for given map_sol_ver


})();


( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var solver			= gio.solver;
					var config			= solver.config;
					var NODES_LIMIT		= config.NODES_LIMIT;
					solver.POSPOINT = {
							STATE			: 0,
							HID				: 1,
							PARENT_SPHERE	: 2,
							PARENT_ANGLE	: 3,
							DIRECTION		: 4, // action.direction at Aug 8, 2012 app. version
							UNIT_HID		: 5,
							UPLINKS			: -1 // defined dynamically
					};
	gio.solver.create_solver = function( gm_ ) {

		var self={};
		var ww				= gio.solver.POSPOINT;
		var STATE			= ww.STATE;
		var PARENT_SPHERE	= ww.PARENT_SPHERE;
		var PARENT_ANGLE	= ww.PARENT_ANGLE;
		var DIRECTION		= ww.DIRECTION;
		var HID				= ww.HID;
		var UNIT_HID		= ww.UNIT_HID;
		var CANON_REPRESENTED_AS	= config.CANON_REPRESENTED_AS;
		var wCON					= gio.solver.CONSTANTS;
		var CANON__STRING			= CANON_REPRESENTED_AS	=== wCON.CANON_STRING;
		var CANON__ARRAY			= CANON_REPRESENTED_AS	=== wCON.CANON_ARRAY;
		var CANON__LINKED_LIST		= CANON_REPRESENTED_AS	=== wCON.CANON_LINKED_LIST;
		solver.POSPOINT.UPLINKS		= CANON__LINKED_LIST ? 2 : 0;
		var forbid_contacts;
		var dont_slice_time;

		var gm		= gm_;
		var game	= gm.game;
		var units	= gm.units;
		var spheres;
		var alive_nodes;
		var startPos;
		var phase;
		var solutions = self.solutions = [];
		var stat;
		var spawned_states_number;
		var stop_when_solution_found;
		var stopTime;
		var msg;
		var one_solution_is_added;
		var wait_TIME = config.TIME_TO_WAIT_MS;
		var	loc2lid = gm.loc2lid;
		var	lid2hid = gm.digest.lid2hid;
		var	hid2lid = gm.digest.hid2lid;
		var	hid2loc = gm.digest.hid2loc;


		self.inactive_bf = true;
		self.stopped_bf = false;
		self.browser_mode = false;
		self.never_ran = true;
		var adapter = self.adapter = solver.Adapter( self, gm );
		var createdNode = adapter.createdNode;
		self.fire_up = function(
									startPos_,					// where to start, used ONLY at first fire
									stop_when_solution_found_,	
									forbid_contacts_,			// traverse only interactionless moves
									dont_slice_time_			// search without interruptions
		){

			if(	gm.game.gkey !== 'sokoban' && gm.game.gkey !== 'colorban' && gm.game.gkey !== 'co_sokoban' && 
				gm.game.gkey !== 'boximaze' && 
				!gio.config.query.luckedin ) {
				NODES_LIMIT = 300000;
			}
			dont_slice_time				= dont_slice_time_;
			forbid_contacts				= forbid_contacts_;
			stop_when_solution_found	= stop_when_solution_found_;
			self.inactive_bf	= false;
			self.stopped_bf		= false;
			self.browser_mode	= false;
			self.never_ran		= false;

			if( !startPos_ && !( phase.sphere === 0 && phase.angle === 0 ) ) {
				self.do_searches();
				return;
			}

			self.resume_memory();
			
			startPos = self.startPos = tp.core.tclone(startPos_);
			one_solution_is_added = false;
			spheres[0]=[[]];
			try {

				if( CANON__LINKED_LIST )
				{
					spheres[0][0] = createdNode( startPos, 0, 0, alive_nodes );
				}else{
					spheres[0][0][STATE] = createdNode( startPos, 0, 0, alive_nodes );
					spheres[0][0][UNIT_HID] = -1;			// sane?: 32 bits
				}

			}catch (error) {
				gio.cons_add(	"setting zero position: " + 
								( typeof error === 'object' && error !== null ? error.message : '' + error )
				);
				return;
			}
			spheres[0][0][PARENT_SPHERE] = -1;	// max = 16 bits
			spheres[0][0][PARENT_ANGLE] = -1;	// 32 bits
			spheres[0][0][DIRECTION] = 0;		// 3 bits
			self.browser.position.sphere = 0;
			self.browser.position.angle = 0;
			stat.total_states			= 1
			stat.completed_ball_size	= 1;
			stat.total_milliseconds		= 0;
			adapter.get_stat_info( self );
			if( game.won_or_not( gm, startPos ) ) {
				if( stop_when_solution_found ) {
					gio.solver_cons( 'Already on solution' );
					self.inactive_bf = true;
					return;
				}
			}
			setTimeout( self.do_searches, wait_TIME ); 

		};/// Fires up solving beginning from startPos
		self.resume_memory = function () {

			spheres = self.spheres = [];
			alive_nodes = [];
			gio.solver.create_browser( self, gm );
			phase = { sphere : 0, angle : 0 };	
			solutions = self.solutions = [];
			stat = self.stat = {};
			gio.debsol( "Memory resumed" );
		}
		self.do_searches = function () {

			var return_bf = self.do_search();

			if( solutions.length > 0 ) {
				if(stop_when_solution_found){
						gio.solver_cons('Solution is found');
				}else{
						gio.solver_cons('First found solution');
				}

				if( !one_solution_is_added ) {
					one_solution_is_added = true;
					self.browser.position.sphere = solutions[0][0];
					self.browser.position.angle = solutions[0][1];
					self.browser.do_move( null, null, 'Just Solved', 'do_metrify_optimal' );
				}
			}

			if( return_bf ) {

				switch (return_bf) {
				case 's': 
					gio.solver_cons('Solver suspended');
					break;
				case 'm': 
					gio.solver_cons('Solver stopped by memory restriction');
					break;
				case 'f': 
					gio.solver_cons('Solver stopped at first found solution');
					break;
				case 'e': 
					gio.solver_cons('Solver stopped by exhausting search space');
					break;
				case 'b':
					gio.solver_cons('Solver stopped because of internal crash');
				}
				if( solutions.length === 0 ) self.browser.do_move( null, 'to end' );
				print_messages();
				self.stopped_bf		= false;
				self.inactive_bf	= true;
				gio.gui.procs.draw_status_and_scene();
				return;
			}

			var ww
			if( stop_when_solution_found ) {
				var ww = '... searching first solution ';
			}else{
				var ww = '... collecting all paths ';
			}
			gio.solver_cons( ww + 'on map "' + gm.title + '"');
			print_messages();
			if( !dont_slice_time ) setTimeout( self.do_searches, wait_TIME ); 
		};
		self.do_search = function(){

			msg 						= '';
			var start_time				= (new Date()).getTime(); 
			var stopTime				= start_time + solver.config.TIME_TO_WORK_MS;
			var terminate_iterations	= '';
			infsearch: while(true){
				var sphere = spheres[phase.sphere];
				if( self.space_exhausted() ) {
					terminate_iterations = 'e';
					return terminate_iterations;
				}
				if( !spheres[phase.sphere+1] ) spheres[phase.sphere+1] = [];
				for( var an=phase.angle; an < sphere.length; an++ ){

					phase.angle				= an;
					var cycle_is_done_bf	= false;				
					if( !dont_slice_time && (new Date()).getTime() > stopTime ) {
						break infsearch;
					}


					if( self.stopped_bf ) {
						terminate_iterations = 's';
						break infsearch;
					}else if( stop_when_solution_found && solutions.length > 0 ) {
						terminate_iterations = 'f';
						break infsearch;
					}

					if( stat.total_states > NODES_LIMIT ) {
						msg=	'po-states memory limit, '+ NODES_LIMIT+", is exceeded.\n";
						terminate_iterations = 'm';
						break infsearch;
					}

					var spoint	= sphere[an];
					spawned_states_number = 0;
						unitsIterator( spoint );
/*
					}catch (error) {

							gio.cons_add(	"Internal error at sphere ix, angle ix = " + 
											phase.sphere + ' ' + phase.angle + ' ' + 
											( typeof error === 'object' && error !== null ? error.message : '' + error )
							);
							terminate_iterations = 'b';
							break infsearch;
					}	
*/
					stat.total_states += spawned_states_number;

					cycle_is_done_bf = true;

				} /// loops via angles in departure-sphere


				if( !cycle_is_done_bf ) return terminate_iterations;
				var volume	= spheres[ phase.sphere+1 ].length;
				wait_TIME	= volume > config.CRITICAL_VOLUME ? 
								config.CRITICAL_WAIT_TIME :
								config.TIME_TO_WAIT_MS;
				stat.completed_ball_size += volume;
				phase.sphere	+= 1;
				phase.angle		= 0;



			} /// loops via po-spheres in po-ball
			

			stat.total_milliseconds	+=	(new Date()).getTime() - start_time;
			stat.ms_per_last_step	=	Math.ceil(stat.total_milliseconds / spheres.length);
			stat.mks_per_state		=	Math.ceil(stat.total_milliseconds * 1000 / stat.total_states);

			return terminate_iterations;
		};
		var spaceIterator=function(unit, pos, unit_hid ) {
			for(var x=-1; x<2; x++){
				for(var y=-1; y<2; y++){
					if( x !== 0 && y !== 0 ) continue;
					if( x === 0 && y === 0 ) continue;
					var direction = y !==0 ? 2*y : x;
					var new_move = doHandleMove(  direction, pos, unit, unit_hid );
					if(new_move) gio.navig.process_move_record(gm, pos, new_move.steps, 'backward');
				}
			}
			return false;
		};
		var unitsIterator = function( spoint ) {

			if( CANON__LINKED_LIST )
			{
				var pos	= adapter.canode2pos( spoint );
			}else{
				var canpos	= spoint[STATE];
				canpos		= CANON__STRING && adapter.str2canon( canpos );
				var pos		= adapter.doReStorePosition( canpos );
			}

			for( var ii=0; ii<gm.actor_cols.length; ii++ ) {
				var col = gm.actor_cols[ii];
				var cunits=col.units;
				for( var uix=0; uix < cunits.length; uix++ ) {
					var unit = cunits[ uix ];
					var lid = pos.uid2lid[ unit.id ];
					var unit_hid = lid2hid[ lid ];
					spaceIterator( unit, pos, unit_hid );
				}
			}
		};
		var doHandleMove = function ( direction, pos, unit, unit_hid ) {
			var new_move = gio.do_process_move(direction, gm, pos, unit, null, null, forbid_contacts);
			if( !new_move ) return false;

			var growing = spheres[phase.sphere+1];
			var growing_angle = growing.length;


			try {
					var new_canon = createdNode( new_move.pos, phase.sphere+1,  growing_angle,  alive_nodes );
			}catch (error) {
					gio.cons_add(	"Solver: Error: In doHandleMove: sphere ix, angle ix= " +
									phase.sphere + ' ' + phase.angle + ' ' + 
									( typeof error === 'object' && error !== null ? error.message : '' + error )
					);
					throw "Solver failed";
			}




			if( !new_canon ) return new_move;
			if( CANON__LINKED_LIST )
			{
				var new_canode = new_canon;
			}else{
				var new_canode = [];
				new_canode[ STATE ] = new_canon;
			}
			new_canode[ PARENT_SPHERE ]	= phase.sphere;
			new_canode[ PARENT_ANGLE ]	= phase.angle;

			new_canode[ UNIT_HID ]		= unit_hid;
			new_canode[ DIRECTION ]		= direction;

			growing[ growing_angle ] = new_canode;
			spawned_states_number += 1;
			if( game.won_or_not( gm, new_move.pos ) ) {
				solutions.push( [ phase.sphere + 1, growing_angle ] );
			}
			return new_move;
		};//doHandleMove=function


		self.space_exhausted = function () {
			return self.spheres[phase.sphere].length === 0;
		};
		var print_messages = function () {

			var res	= msg + "\n";


			var ww	= spheres.length-2 >= 0 ? spheres[spheres.length-2].length : 0;

			res		+=	'DEPARTURE:  ' +
						phase.sphere + '.' +
						stat.completed_ball_size + '.' +
						ww + '.' +
						phase.angle +
						" = move.ball.sphere.sphere_departed \n";

			var 	last_move_count = spheres.length-1;
			if(		!spheres[last_move_count].length  ) last_move_count -= 1;

			res		+=	'ARRIVAL:    '
			res		+=	last_move_count ? last_move_count : '  ' ;
			res		+=	'.' + stat.total_states + '.' +
						spheres[spheres.length-1].length  + 
						" = move.total.sphere"+ "\n";
			res 	+=	'Boundary =      '	+ stat.flat_dynamics_top_nodes_estimation + "\n";
			res 	+=	stat.node_dimension	+ " = canon_dimension\n";
			res 	+=	stat.hids_number	+ " = hids, ";
			res 	+=	"ms="				+ stat.total_milliseconds + ", ";
			res 	+=	"ms/total_moves="	+ stat.ms_per_last_step + ", ";
			res 	+=	"mks/total_pos="	+ stat.mks_per_state + "\n";
			res		+=	"moves:\n";
			for( var ss = 1; ss < spheres.length; ss++ ) {
				res += ss + '.' + spheres[ss].length + "\n";
			} 
			gio.solver_cons_add(res);
		}; /// Prints messages and statistics ///


		return self;

	};///	Creates core solver subroutines
	gio.solver.fire_button_callback = function( dummy, item_option, select_el_dummy )
	{
									gio.debly( "Ordered: " + item_option.title );
									var gs = gio.getgs();
									var gm = gs.gm;
									var msol = gm.solver;

									var do_search = '';									
									switch ( item_option.title ) {
									case 'Search First':
											do_search = 'first';
											break;
									case 'Search All':
											do_search = 'all';
											break;
									case 'Resume':
											do_search = 'resume';
											break;
									case 'Suspend':
											msol.stopped_bf = true;
											break;
									case 'Browse':
											msol.browser_mode = true;
											msol.browser.do_move();
											break;
									case 'Go to Play':
											msol.browser_mode = false;
											break;
									case 'Release Memory':
											msol.resume_memory();
											break;
									}

									gio.draw_status();

									if( do_search && msol.inactive_bf ) {
											gm.solver.fire_up(
												do_search !== 'resume' && gs.round.pos,
												do_search !== 'all'
											);
									}
									gio.draw_status();
			

	};



})();



( function () {	 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};

					var solver			= gio.solver;
					var config			= solver.config;
					var NODES_LIMIT		= config.NODES_LIMIT;
	solver.create_browser = function ( map_solver, gm_ ) {

		var msol			= map_solver;
		var ww				= solver.POSPOINT;
		var PARENT_SPHERE	= ww.PARENT_SPHERE;
		var PARENT_ANGLE	= ww.PARENT_ANGLE;
		var DIRECTION		= ww.DIRECTION;
		var HID				= ww.HID;
		var UNIT_HID		= ww.UNIT_HID;
		var gm				= gm_;
		var units			= gm.units;
		var	loc2lid			= gm.loc2lid;
		var	lid2hid			= gm.digest.lid2hid;
		var	hid2lid			= gm.digest.hid2lid;
		var	hid2loc			= gm.digest.hid2loc;
		var spheres			= msol.spheres;


		msol.browser		= { position : {} };
		msol.browser.do_move = function( 
											direction,
											sphere_spot,
											add_title_to_gm_playpaths,
											do_metrify_optimal
		){
			var bp			= msol.browser.position;
			var new_angle	= bp.angle;
			var new_sphere	= bp.sphere;
			if(sphere_spot === 'forward' || direction === -2){
				if(	bp.sphere + 1 < spheres.length &&
					0 < spheres[bp.sphere+1].length){
						new_angle = 0;
						bp.sphere += 1;
				}

			}else if(sphere_spot === 'back' || direction === 2){
				if(bp.sphere > 0){
						bp.sphere -= 1;
						new_angle = spheres[bp.sphere].length-1;
				}

			}else if(sphere_spot ==='to beginning'){
				bp.sphere = 0;
				new_angle = 0;

			}else if(sphere_spot ==='to end'){
				bp.sphere = spheres.length - 1;
				if( !spheres[bp.sphere].length && bp.sphere > 0 ) bp.sphere -= 1; //TODMQ&D
				if( !spheres[bp.sphere].length && bp.sphere > 0 ) bp.sphere -= 1; //TODMQ&D
				new_angle = spheres[bp.sphere].length-1;
				if( new_angle < 0 ) { //TODMQ&D
					bp.sphere = 0;
					new_angle = 0;
				}
			}else if(direction === 1){
				new_angle = bp.angle + 1;
				if(	new_angle >= spheres[bp.sphere].length){
					if(	bp.sphere + 1 < spheres.length &&
						0 < spheres[bp.sphere+1].length){
						new_angle = 0;
						bp.sphere += 1;
					}else{
						new_angle= bp.angle;
					}
				}

			}else if(direction === -1){
				new_angle = bp.angle - 1;
				if(new_angle < 0 ){
					if(bp.sphere > 0){
						bp.sphere -= 1;
						new_angle = spheres[bp.sphere].length-1;
					}else{
						new_angle= bp.angle;
					}
				}
			}
			bp.angle = new_angle;
			var spoint = spheres[bp.sphere][bp.angle];
			gio.navig.in_session.round.init_round( gm, 'doreset', msol.startPos );
			var paths = msol.do_expand_path( 
							spoint,
							[bp.sphere, bp.angle],
							( do_metrify_optimal ? 'do_metrify_optimal' : 'only inject_into_session' ),
							add_title_to_gm_playpaths
			);

			gio.solver_cons_add(
					' p-point = '	+ bp.sphere + '.' + bp.angle + ' l-index='+spoint[UNIT_HID] +
					' parent = '	+ spoint[PARENT_SPHERE] + '.' + spoint[PARENT_ANGLE] +
					' dir='			+ spoint[DIRECTION] + "\n" +
					":::playpath=from solver\n" + paths.path + "\n\n" +
					(paths.co_path && (":::co-playpath=from solver\n" + paths.co_path ))

			);

		};
		msol.do_expand_path = function( spoint, slocation, inject_into_session, add_title_to_gm_playpaths )
		{

			var pos		= tp.core.tclone( msol.startPos ); //TODm waste of pos: make one pos per solver
			var len		= slocation[0]; //spoint[OWN_SPHERE];
			var moves	= [];

			for( var ss = 0; ss < len; ss++ ) {
				
				moves[len-ss-1]= { hid : spoint[UNIT_HID], action : { direction : spoint[DIRECTION] } } ;

				spoint = spheres[ spoint[ PARENT_SPHERE ] ][ spoint[ PARENT_ANGLE ] ];
				if( !spoint ) break;
			}
			var uid_moves = [];


			for(var ss=0; ss<len; ss++) {

				var hid		= moves[ss].hid;
				var loc0	= hid2loc[hid];
				var xx		= loc0[0];
				var yy		= loc0[1];
				var zz		= pos.tops[xx][yy];
				var lid		= loc2lid[xx][yy][zz];
				var uid		= pos.lid2uid[lid];


				moves[ss].action.uid = uid;

				var new_move = gio.do_process_move(
						moves[ss].action.direction,
						gm,
						pos,
						units[uid]
				);
				if(!new_move){
					gio.solver_cons_add("Path reconstruction failed: \n"+gio.info.log.move);
					return;
				}
				uid_moves[ss] = new_move;
				pos = new_move.pos;
			}


			var pseudo_round = { gm : gm, moves : uid_moves }
			var path_texts = gio.navig.in_session.round.path2texts( pseudo_round, 'sugar_do_co_path' );

			var path_text	= path_texts.path;
			var co_path		= path_texts.co_path;

			if( inject_into_session )
			{
				var w_gs = gio.getgs();
				var round = gm.rounds[ gm.rounds.ix ];
				if( w_gs.gm === gm )
				{
					gio.gui.procs.inject_path_from_text( path_text, null, 'stay_at_the_end' ); //TODM do validation
				}else{

					var w_validator_msg = gio.navig.in_session.round.text2round( path_text, round ); //TODM do validation
				}

				if( 'do_metrify_optimal' === inject_into_session )
				{
					gm.metrics.optpath		= gm.metrics.optpath || {};
					gm.metrics.optpath.p	= round.moves.length;
					gm.metrics.optpath.i	= round.interacts;
					gm.metrics.optpath.r	= round.peer_change;
					gio.session.reinit.metrify( gm );
				}
			}
			if( add_title_to_gm_playpaths ) {

				if( 'do_metrify_optimal' === inject_into_session )
				{
					var ww = gm.metrics.optpath;
					var directive = 'optpath=' + ww.p + '.' + ww.i + '.' + ww.r + "\n";
				}else{
					var directive = "playpath=" + add_title_to_gm_playpaths + "\n";
				}
				var ww = directive;

				gio.solver_cons_add( ":::" + ww + path_text + (co_path && ("\n:::co_" + ww + co_path )) );
				gm.playpaths = gm.playpaths || [];
				gm.playpaths.push({	title : add_title_to_gm_playpaths,
									value : path_text,
									pos : tp.core.tclone(msol.startPos)
				});
				if( gio.getgs().gm === gm ) gio.gui.reset_playpaths_select_el();

			} // \\// adds path to gm.playpaths


			return path_texts;

		};/// Expands:	path from startPos till spoint

			
	};/// creates spoints browser
	

})();


(function( $ ){ 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};



	gio.solver = gio.solver || {};

	gio.solver.bays_builder=function(gm){ 

		var hid2lid = gm.digest.hid2lid;
		var hid2loc = gm.digest.hid2loc;
		var lid2hid = gm.digest.lid2hid;
		var xy_exists = gm.xy_exists;
		var loc2lid = gm.loc2lid;
		var shifts = [ [-1,0],[0,-1],[1,0],[0,1]  ];
		var corners=[];

		for(var hid=0; hid<hid2lid.length; hid++){
			var loc = hid2loc[hid];
			var lid = hid2lid[hid];
			var xx = loc[0];
			var yy = loc[1];
			for(var dir=0; dir<4; dir++){
				var ss = shifts[dir];
				var xx1 = xx + ss[0];
				var yy1 = yy + ss[1];
				if( xy_exists[xx1] && xy_exists[xx1][yy1] ) continue;
				var dir2 = (dir+1)%4;
				var ss = shifts[dir2];
				var xx2 = xx + ss[0];
				var yy2 = yy + ss[1];
				if( xy_exists[xx2] && xy_exists[xx2][yy2]  ) continue;
				var corner = { hid : hid, lid : lid, loc : loc, dir : dir, dir2 : dir2 }
				corners.push(corner);
			}
		}
		return corners;
		var bays = [];

		for(var cc=0; cc<corners.length; cc++){
			var corner = corners[cc];


		}


	};

})(jQuery);


( function( $ ) { 	var tp   	=  $.fn.tp$      =  $.fn.tp$ || {};	
					var gio  	=  tp.gio        =  tp.gio   || {};
					var ceach  	=  tp.core.each;

					var navigm	=  gio.navig.in_map;
					var ggp		=  gio.gui.procs;
	var is_there_an_actor=function(x, y, gm, pos){

		var tower = gm.loc2lid[x][y];
		for(var zz=0; zz<tower.length; zz++){
			var lid = tower[zz];
			var uid = pos.lid2uid[lid];
			if(uid<0) continue;
			var unit = gm.units[uid];
			if( unit.activity.active ){
				navigm.toggle_unit_selection(unit);
				gio.draw_scene();
				gio.draw_status('hide_won_status'); //TODm meaning?
				return unit;
			}
		}
		return null;
	};
	var are_positions_next_to_each_other=function(xcenter, ycenter, x, y){ 
		return 	(	Math.abs(xcenter-x) === 1 && ycenter === y ||
					Math.abs(ycenter-y) === 1 && xcenter === x    );
	};





	gio.gui.procs.move_acting_unit = function(direction, extra_key){
		var gs = gio.getgs();
		var gm = gs.gm;
		if(gm.solver.browser_mode){
			gm.solver.browser.do_move(direction, extra_key);
		}else{
			gio.plcons('');
			var result = gio.do_process_move(direction, gm, gs.pos, gs.unit, 'do in gui' );
			if(!result) return false;
		}

		if(gm.game.won_or_not) {
			if(gm.game.won_or_not()){
				gio.config.google_apps.track.play_event('Playsession', 'Won');
			}
		}

		gio.draw_scene();
		gio.draw_status();
		return true;
	};
	navigm.back_forward_start = function(direction){
		gio.plcons('');
		var gm = gio.getgs().gm;
		gm.solver.browser_mode = false;
		if( direction === 'do reset' ){
			gio.navig.in_session.round.init_round(gm, 'do reset');
		}else if(direction !== ''){
			gio.gui.procs.do_manage_round(null,direction);
		}
		gio.draw_scene();
		gio.draw_status();
	}
	navigm.toggle_unit_selection=function(unit){
		var gs=gio.getgs();
		if(unit){
			navigm.toggle_unit_selection();
			var col = gs.gm.acting_col = unit.col;
			col.acting_unit = unit;
			col.focused = true;
			gio.plcons('Selected '+ unit.hname);
		}else{
			gs.col.focused=false;
			gio.plcons('Unselected '+ gs.unit.hname);
		}
	};
	navigm.handle_click_on_flat_cell=function(unit){ //TODm overall scenario is still dim. Do make clear.

		var gs=gio.getgs();

		if(!gs.col){
			gio.plcons("No actors exist on this map.\n");
			return true; //respect other elements
		}

		var gm=gs.gm;
		var pos=gs.pos;
		var loc=pos.uid2loc[unit.id];

		if(gs.unit){
			var acting_loc=pos.uid2loc[gs.unit.id];

			if(acting_loc[0] === loc[0] && acting_loc[1] === loc[1]){
				if(!gm.dresses_wrap.chosen_dress.playvigation.UNIT_IS_UNSELECTABLE){
					gs.col.focused = !gs.col.focused;
					gio.draw_scene();
					gio.draw_status('no_won_redraw');
				}
			}else{
				if(gs.col.focused){
					if(are_positions_next_to_each_other(
						acting_loc[0], acting_loc[1],
						loc[0], loc[1] )
					){
						var direction='';
						if(acting_loc[0] === loc[0] ){
							direction = acting_loc[1] > loc[1]  ? -2 : 2;
						}else{
							direction = acting_loc[0] > loc[0]  ? -1 : 1;
						}
						if(!gio.gui.procs.move_acting_unit(direction)){
							is_there_an_actor(loc[0],loc[1],gm, pos);
						};
						return true;
					}else if(!is_there_an_actor(loc[0],loc[1],gm, pos)){


						var virtual_pos = tp.core.clone_many( gs.pos );
						var virtual_move = gio.do_process_move(
								0, gm, virtual_pos, gs.unit, 
								'',				 //round_or_play_flag
								null, 			 //dont_change_pos_and_leave,
								true, 			 //forbid_contacts,
								loc[0],loc[1], 0 //dropx, dropy, dropz	// landed-cell coordinates
						);
						if(virtual_move) {
							var virtual_pos = virtual_move.pos;

							var salvor = gio.solver.create_solver(gm);
							var canon = salvor.adapter.createdNode( virtual_pos );

						}else{
							gio.plcons(	
								unit.hname + " is out of immediate reach\n" +
								"of "+ gs.unit.hname + "\nTry to do more steps\n"
							);
						}
					}	
				}else{
					if(gm.game.active_units_do_interact){
						var ww = false;
					}else{
						var ww = is_there_an_actor(loc[0],loc[1],gm, pos);
					}
					if(!ww && gio.debug) gio.plcons("No unit selected.\n");
				}
			}
		}else{
				if(!is_there_an_actor(loc[0],loc[1],gm, pos)){
					gio.plcons(	"Actor must be selected first\n" +
								"to do something at this cell on" + unit.hname);
				}
		}//... is any unit of active colony selected?
		return true; //respect elements nearby
	};//handle_click_on_flat_cell





	navigm.scroll_colony=function(pointer){
		ggp.do_one_scroll_of_colony();
		gio.draw_scene();
		gio.draw_status();
		return false;				
	};

	gio.navig.do_land_to_map = function( coll, map_ix ) {
		gio.navig.validate_coll_map( null, coll.ref.list.ix, map_ix, 'do_land' );
	};


})(jQuery);

(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gdr		=  gio.domwrap.regions;






	gio.draw_scene = function () {

		var gs		= gio.getgs();
		var gm		= gs.gm;
		if( !gm || gm.load !== 'finalized') return;
		var game	= gm.game;

		var dtile	= gm.dresses_wrap.chosen_dress.tile;
		var uid2lid	= gs.pos.uid2lid;
		var locs	= gm.locs;

		gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		tp.core.each(gm.units, function(uid,unit){
			var style = unit.tile.div.style;
			var loc=locs[uid2lid[uid]];
			style.left=(loc[0]+1)*dtile.width+'px';
			style.top =(loc[1]+1)*dtile.height+'px';
		});
		var acting_unit = gs.unit;
		var do_set_focuser = gm.actors > 1;
			
		if(acting_unit && gs.col.focused ){
			gio.domwrap.wraps.blinker.dosetup_and_start(acting_unit.tile.div, {opacity:0.5},{opacity:1.0},500);
			acting_unit.tile.div.insertBefore(gm.focuser_img, acting_unit.tile.img);

		}else{
			do_set_focuser=false;
			gio.domwrap.wraps.blinker.dostop();
		}

		if( gm.dresses_wrap.chosen_dress.focuser === '' ) do_set_focuser = false;
		if(do_set_focuser){
			gm.focuser_img.style.display='inline';
		}else{
			gm.focuser_img.style.display='none';
		}


	};// gio.draw_scene




})(jQuery);

(function( ){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var gdw		=  gio.domwrap;
					var gde		=  gio.domwrap.elems;
					var gdr		=  gio.domwrap.regions;
	gio.gui.init.entry=function(){

		var w, ww;
		tp.core.remove_warning_about_absent_JS( "if no JavaScript language" );
		var droot = gdr.droot=document.createElement('div');
		droot.style.margin = 'auto';
		droot.style.display = 'none';
		document.body.style.backgroundColor = gstyle.rootColor;
		document.body.appendChild(droot);
		droot.setAttribute('id', 'droot_debug');
		root_relativizer = document.createElement('div');
		root_relativizer.style.position = 'relative';
		droot.appendChild(root_relativizer);
		root_relativizer.setAttribute('id', 'root_relativizer_debug');
		w=gdr.dtopleft=document.createElement('div');
		w.style.position='absolute';
		w.style.zIndex = gstyle.captions.zIndex;
		var ws=w.style;
		ws.top='0px';
		root_relativizer.appendChild(w);
		w.setAttribute('id', 'dtopleft_debug');
		w=gdr.dtopcenter=document.createElement('div');
		w.style.position='absolute';
		ws=w.style;
		ws.zIndex = gstyle.captions.zIndex+1;
		ws.left=gstyle.top_navig.left+'px';
		ws.top=gstyle.top_navig.top+'px';
		ws.height=gstyle.top_navig.height+'px';
		root_relativizer.appendChild(w);
		w.setAttribute('id', 'dtopcenter_debug');
		w=gdr.dsubtop=document.createElement('div');
		w.style.position='absolute';
		ws=w.style;
		ws.zIndex = gstyle.captions.zIndex;
		ws.top=gstyle.top_navig.height+'px';
		ws.height=gstyle.captions.height+'px';
		root_relativizer.appendChild(w);
		w.setAttribute('id', 'dsubtop_debug');
		var dcenter = w = gdr.dcenter=document.createElement('div');
		w.style.position = 'absolute';
		w.style.zIndex = gstyle.playboard.zIndex;
		w.style.top = gstyle.captions.height+gstyle.top_navig.height+'px';
		w.style.left = 0+'px';
		root_relativizer.appendChild(w);
		w.setAttribute('id', 'dcenter_debug');
		w.style.display = 'block';
		w=gde.chaser=document.createElement('div');
		w.style.position = 'absolute';
		w.style.left = '0px';
		w.style.zIndex = gstyle.controls.zIndex;
		w.style.backgroundColor=gstyle.controls.backgroundColor;
		w.style.color=gstyle.controls.color;
		dcenter.appendChild(w);
		w.setAttribute('id', 'chaser_debug');
		gio.config.google_apps.create_ad_divs();


		gio.core.procs.update_top_links();

		if(!gdw.wraps.blinker)gdw.wraps.blinker=tp.core.blinker();

		gio.gui.init.popups();
		gio.gui.init.create_consoles();

		return '';
	};


})();

(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdw		=  gio.domwrap;
					var gdr		=  gio.domwrap.regions;
					var med		=  gio.map_editors;




	gio.gui.init.popups=function(){


		var dcenter = gdr.dcenter;

		var ww = gio.common_popup = tp.core.single_popup_manager( gstyle.popups.help );
			ws = ww.popup_el.style;
			ws.paddingLeft='15px';
			ws.fontSize='12px';
			ws.fontFamily='Arial, Helvetica';
			ws.zIndex=gstyle.popups.zIndex;
			ws.overflow='auto';

		tp.gui.cornerize(gstyle.playboard.corners, ww.popup_el);
		tp.gui.gradientizeOnce(gstyle.popups.help.backgroundColor,0.2,'top',ww.popup_el);

		gio.domwrap.popups.hide_common = function(dont_unlock){
			gio.common_popup.popup_el.style.visibility = 'hidden'; 

			/*
			gio.domwrap.popups.help_close_button.hide();
			gio.domwrap.popups.help_close_button.wrapper.style.display='none'
			if(!dont_unlock)gio.gui.procs.unlock_controls();
			*/
		};



		/*

		gio.domwrap.popups.show_common = function() {
			gio.common_popup.popup_el.style.visibility = 'visible';
			gio.domwrap.popups.help_close_button.reset({c:{gui:{style:{wrapper:{display:'block'}}}}});
		};


		var ww = gio.domwrap.popups.common_div = document.createElement('div');
			ww.style.position = 'absolute';
			ws = ww.popup_el.style;
			ws.top = '0px';
			ws.left = '0px';
			ws.paddingLeft='10px';
			ws.fontSize='12px';
			ws.fontFamily='Arial, Helvetica';
			ws.zIndex=gstyle.popups.zIndex;
			ws.overflow='auto';

			ws.width = gstyle.popups.help.width + 'px';
			ws.height = gstyle.popups.help.height;
			ws.backgroundColor = gstyle.popups.help.backgroundColor;
			ws.color = gstyle.popups.help.color;
			gdw.popups.modal_message_popup.popup_el.appendChild(ww);

		
		var constyle=gstyle.controls;
		var button_arg={
			r:{	parent :	gdw.popups.modal_message_popup.popup_el,
				options :	[{	title : 'Close',
								tooltip : 'Close the window'
							}],
				callback :	function () {
					gio.domwrap.popups.hide_common();
				}
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'-120px', left : '230px',
												fontFamily	: constyle.fontFamily
											},
								display:	{	fontSize	: constyle.fontSize+'px',
												fontStyle	: constyle.fontStyle,
												fontWeight	: constyle.buttonsFontWeight,
												color		: constyle.color
											}

						}
					}
			}
		};
		gio.domwrap.popups.help_close_button = tp.form.create_select_el(button_arg);

		*/
		var ww = gdw.popups.modal_message_popup = tp.core.single_popup_manager({owner:'modal'});
		tp.core.rpaste( ww.popup_el.style, gstyle.messages );
		w=gdw.popups.input_text_popup=tp.core.single_popup_manager({
					owner:'input_text',
					width:500,
					height:300,
					backgroundColor:'#558855',
					innerHTML:	"<textarea style=\"position:relative; left:15px; top:50px; "+
								" width:465px; height:210px;\">::Input or Copy-Paste Map or Collection of Maps here\n</textarea>"
		});

		tp.gui.cornerize(gstyle.playboard.corners,w.popup_el);
		w.popup_el.style.zIndex='3000000';

			/*
				$(ww).after(gdw.wraps.links_to_external_collections['wrapper']);
				tp.gui.cornerize(gstyle.playboard.corners,ww);
			*/

		gdw.wraps.links_to_external_collections=tp.form.create_select_el({c:{
				gui:{	wmax:310,
						ddbox_backgroudColor:'#DDDDDD',
						style:{wrapper:{display:'none', top:'15px', left:'15px'}}}}
		});
		

		w=gdw.popups.input_text_popup;
		w.popup_el.appendChild(gdw.wraps.links_to_external_collections['wrapper']);		


		var constyle=gstyle.controls;
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : 'Close',
								tooltip : 'Close or cancel your edit'
							}],
				callback :	gio.map_editors.hide_text_editor
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'15px', left:'430px',
												fontFamily	: constyle.fontFamily
											},
								display:	{	fontSize	: constyle.fontSize+'px',
												fontStyle	: constyle.fontStyle,
												fontWeight	: constyle.buttonsFontWeight,
												color		: constyle.color
											}

						}
					}
			}
		};

		gio.map_editors.text_editor_closing_button=tp.form.create_select_el(button_arg);
		button_arg.r=
			{	parent :	w.popup_el,
				options :	[{	title : 'Done',
								tooltip : 'Load your work and close editor'
							}],
				callback :	gio.map_editors.load_from_text_editor
			},
		button_arg.c.gui.style.wrapper.left='360px';
		gio.map_editors.text_editor_done_button=tp.form.create_select_el(button_arg);
		w=gdw.popups.login=tp.core.single_popup_manager({
					owner:'login',
					width : 350,
					height : 200,
					backgroundColor:'#111111',
					color : '#EEEEEE',
					innerHTML :
								"<form method=\"post\" accept-charset=\"UTF-8\" action=\"" + 
								gio.session.server.message.login_url +
								"\">\n" +

							"<div	style=\"position:absolute; left:15px; top:10px; " +
							"		width:260px; height:20px; font-size : 10px; color:#FFAADD\">\n" +
							"</div>\n" +

							"<div	style=\"position:absolute; left:15px; top:50px; " +
							"		width:335px; height:20px;\">\n" +
							"	Login: <input id=\"email\" type=\"text\" name=\"email\" " +
							"		style=\" position:absolute; right : 20px; width:200px; height:20px;\">\n" +
							"</div>\n" +

							"<div	style=\"position:absolute; left:15px; top:85px; " +
							"		width:335px; height:20px;\"/>" +
							"	Password: <input type=\"password\" id=\"password\" name=\"password\" " +
							"		style=\" position:absolute; right : 20px; width:200px; height:20px;\">\n" +
							"</div>\n" +
							"</form>"

		});

		w.popup_el.style.fontFamily = 'arial, helvetica';
		w.popup_el.style.fontSize = '13px';
		w.popup_el.setAttribute('id','login_popup_div_debug');

		tp.gui.cornerize(gstyle.playboard.corners,w.popup_el);
		w.popup_el.style.zIndex='3000000';

		tp.gui.gradientizeOnce('#880000',0.3,'top',w.popup_el);






		w=gdw.popups.login;
		var constyle=gstyle.controls;

		/*
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : '<a href="#" style="text-decoration : none; color : #FFFFFF; " >Login</a>',
								tooltip : 'Click to login'
							}],
				callback :	med.send_login_request
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'125px', left:'15px',
												fontFamily	: constyle.fontFamily
											},
								display:	{	fontSize	: constyle.fontSize+'px',
												fontStyle	: constyle.fontStyle,
												fontWeight	: constyle.buttonsFontWeight,
												color		: constyle.color
											}

						}
					}
			}
		};

		med.login_submit_button = tp.form.create_select_el(button_arg);
		*/
		var register = document.createElement('div');
		register.style.position = 'absolute';
		var ww = register.style;
		ww.left = '15px';
		ww.top = '165px';
		gdw.popups.login.popup_el.appendChild(register);
		register.innerHTML = 
					"		<a	href=\"/register?send_verification_email=yes\" " +
					"			style=\"color : #8888FF; text-decoration : none; font-size : 11px; font-family : arial, helvetica; \"> " +
					"			Register. Forgot your password? Unfinished account activation?</a>";
		var button_arg={
			r:{	parent :	w.popup_el,
				options :	[{	title : '<a href="#" style="text-decoration : none; color : #FFFFFF; " >Close</a>',
								tooltip : 'Leave login window'
							}],
				callback :	med.hide_login
			},
			c:{	choice_ix:0,
				gui:{	wmax:90,
						ddbox_backgroudColor:'#AAFFAA',
						style:{	wrapper	:	{	display:'none', top:'15px', left:'270px',
												fontFamily	: constyle.fontFamily
											},
								display:	{	fontSize	: constyle.fontSize+'px',
												fontStyle	: constyle.fontStyle,
												fontWeight	: constyle.buttonsFontWeight,
												color		: constyle.color
											}

						}
					}
			}
		};
		med.login_closing_button=tp.form.create_select_el(button_arg);
		var password_el = $(gdw.popups.login.popup_el).find('input')[1];
		tp.bindEvents( 
			'keydown',
			function(a){
				if(a.keyName == 'enter'){
					med.send_login_request();
					return false;
				}
				return true;
			},
			password_el
		);
		tp.bindEvents( 
			'keydown',
			function(a){
				if(a.keyName == 'escape'){
					med.hide_login();
					return false;
				}
				return true;
			},
			gdw.popups.login.popup_el
		);


		return true;
	};
	med.hide_login=function(dont_unlock){
			med.login_closing_button.wrapper.style.display='none';
			gio.domwrap.popups.login.hide();
			if(!dont_unlock)gio.gui.procs.unlock_controls();
	};



})(jQuery);


( function () { 	var tp		=  jQuery.fn.tp$  =  jQuery.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdw		=  gio.domwrap;
					var gde		=  gio.domwrap.elems;
	gio.gui.init.create_consoles=function(){

			var dcenter = gio.domwrap.regions.dcenter;
			var cstyle  = gstyle.console;
			var pstyle  = tp.core.paste_style;
			var con_wrap				= document.createElement('div');
			gde.con_div					= con_wrap;
			dcenter.appendChild(		  con_wrap);
			con_wrap.style.position		= 'absolute';
			pstyle(						  con_wrap, cstyle.wrapper );
			if( gio.debug )				  con_wrap.style.overflow = "visible";
			tp.gui.cornerize(			  gstyle.playboard.corners, con_wrap);
			con_wrap.setAttribute(		  'id','cons_wrap_deb');
			var ww					= document.createElement('div');
			gde.con_div_child		= ww;
			con_wrap.appendChild(	  ww );
			ww.style.position		= 'absolute';
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.generic );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			ww.setAttribute(		  'id','gen_cons_deb');
			var ww					= document.createElement('div');
			gde.playvig_cons		= ww;
			con_wrap.appendChild(	  ww );
			ww.style.position		= 'absolute';
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.playvigation );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			ww.setAttribute(		  'id','playvig_cons_deb');
			var ww					= document.createElement('div');
			gde.solver_cons			= ww;
			con_wrap.appendChild(	  ww );
			ww.style.position		= 'absolute';
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.solver );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			ww.setAttribute(		  'id','solver_cons_deb');
			var ww					= document.createElement('div');
			gde.debug_cons			= ww;
			con_wrap.appendChild(	  ww);
			ww.style.position		= 'absolute';
			var ss					= ww.style;
			pstyle(					  ww, cstyle.common );
			pstyle(					  ww, cstyle.debug );
			tp.gui.cornerize(		  gstyle.playboard.corners, ww);
			if(gio.debug)			  ss.display = 'block';
			if(gio.debug)			  ss.visibility = 'visible';
			ww.setAttribute(		  'id','tpdebug');

	};


})();

(function(){	 	var tp		=  jQuery.fn.tp$	=  jQuery.fn.tp$ || {};	
					var gio		=  tp.gio			=  tp.gio   || {};
					var gde		=  gio.domwrap.elems;
					var ggp		=  gio.gui.procs;
	var CreatesConsole = function ( name, div_name ) {

		var console_text = '';
		var self = {};

		var basic_cons = self.cons_add = function( msg, doclean ) {

			if( doclean ) console_text = '';
			if( window.console && window.console.log && msg !== '' ) {  // ***** safe console
				console.log( msg );                                     // ***** safe console
			}
			console_text += "\n" + msg;
			if( gde[ div_name ] ) {
				gde[ div_name ].innerHTML = '<pre>' + console_text + '</pre>';
			}
		};

		self.cons = ( function( msg ) { basic_cons( msg, 'doclean') } );
		gio[ name ] = self.cons;
		gio[ name + '_add'] = self.cons_add;
		return self;
		
	};
	CreatesConsole( 'cons', 'con_div_child' );
	CreatesConsole( 'plcons', 'playvig_cons' );
	CreatesConsole( 'solver_cons', 'solver_cons' );


})();


( function () { 	var tp   =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio  =  tp.gio    =  tp.gio   || {};




	gio.gui.inject_playpath = function ( ix, gm )
	{
		var ppath = gm.playpaths[ ix ];
		if( !ppath ) return;
										/*
										if(	!gio.session.server.message.loggedin && 
											!gio.config.query.luckedin &&
											gm.ix &&
											!gm.collection.ref.link.link &&
											!gio.getgs().playalb.ref.link.link){ //TODM messy gm, gs ... get them at once inside of callback
											alert('Available for logged-in users');
											return false;
										}
										*/
		gio.gui.procs.lock_controls( 'Validating playpath text ...' );
		if( ppath.pos ) gio.navig.in_session.round.init_round( gm, 'doreset', ppath.pos );

		var validator_err = gio.navig.in_session.round.text2round( ppath.value );
		if( validator_err )
		{
			gio.cons_add( validator_err );
		}else{
			gio.gui.procs.do_manage_round( null, 'to beginning' );
		}
		gio.gui.procs.draw_status_and_scene();
		gio.gui.procs.unlock_controls();
		return validator_err;
	};
	gio.gui.reset_playpaths_select_el = function ( cursor_ix )
	{

		var gm = gio.getgs().gm;
		var validator_err = '';
		if( gm.playpaths ) {

				gio.domwrap.cpanel.cont_rols.playpaths.reset(

					{r:{
						options		: gm.playpaths,
						callback	: function ( ix, vvdummy ) { gio.gui.inject_playpath ( ix, gm ); }
					},
					c:{	dont_reset_styles	:false,
						choice_ix			: ( cursor_ix || 0 )  //,
					}}
				);
			if( cursor_ix || cursor_ix === 0  )
			{
				var validator_err = gio.gui.inject_playpath ( cursor_ix, gm );
			}
		}

		return validator_err;

	};//reset_playpaths




	var do_reset_rounds_select_el = function(){
		var gm = gio.getgs().gm;

		gio.domwrap.cpanel.cont_rols.rounds.reset(
					{r:{
						options		:gm.rounds,
						callback	:function(i,v){
										gm.rounds.ix = i;
										gio.gui.procs.draw_status_and_scene();
									}
						},
					c:{	dont_reset_styles	:false,
						choice_ix			:gm.rounds.ix,
						gui					:{style:{wrapper:{display:'block'}}}
						}
					}
		);
	};
	



	gio.gui.reset_rounds_select_el=function(){

		var gm = gio.getgs().gm;
		if(gm.rounds.length > 1){

			do_reset_rounds_select_el();
		}else{

			gio.domwrap.cpanel.cont_rols.rounds.reset(
				{c:{gui:{style :{wrapper:{display:'none'}}}}});
		}
	};//reset_rounds



})();

(function( $ ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var ggc		=  gio.gui.create;
					var gdr		=  gio.domwrap.regions;
					var clonem	=  tp.core.clone_many;
					var ceach	=  tp.core.each;
	ggc.board = function( gm ) {
		gm.board = document.createElement('div');
		gm.board.style.position = 'absolute';
		tp.gui.cornerize( gstyle.playboard.corners, gm.board );
		gio.gui.procs.reset_web_text_selection_appearance( gm.board, 'none' );
		gdr.dcenter.appendChild( gm.board );
		gm.board.setAttribute( 'id', 'gm_board_debug' );
		finalize_dresses_for_board( gm );
		if(gio.debug) gio.cons_add( 'Created board for gm_ix ' + gm.ix + ' on gkey=' + gm.game.gkey );
	};
	ggc.tiles = function(gm){
		tp.core.each(gm.cols, function(cid,colony){

			var cname=colony.nam;
			var zorder=colony.zorder; //TODm rid

			$.each(colony.units, function(unit_ix,unit){

					var unit_id=unit.id;
					var tile=unit.tile={ ix : unit_ix }; 
					var div = tile.div= document.createElement('div');
					div.style.position = 'absolute';

					var s=div.style;
					s.overflow='visible';
					gm.board.appendChild(div);
					s.zIndex=''+gstyle.playboard.zIndex+zorder; //TODm rid

					var img = unit.tile.img = document.createElement('img');
					div.appendChild(img);
					$(div).bind('click',function(event){
						return gio.navig.in_map.handle_click_on_flat_cell(unit);
					});
			
			});				
		});
		if(gio.debug) gio.cons_add('Created tiles for gm_ix ' + gm.ix + ' on gkey=' + gm.game.gkey);
	};
	ggc.map_focuser=function(gm){
		var ww = gm.focuser_img=document.createElement('img');
		ww.style.position = 'absolute';
		var ws=ww.style;
		ws.left=0;
		ws.top=0;
		ws.zIndex='-1';
	};
	var finalize_dresses_for_board = function( gm ) {

		var chosen_map_dkey = '';
		if( gm.dresses ) {
			ceach( gm.dresses, function( dkey, dress ) {
				if( dress.chosen ) chosen_map_dkey = dkey;
			});
			ceach( gm.dresses, function( dkey, dress ) {
				var inherit_from = dress.inherit_from || dkey
				var ww = gm.game.dresses[ inherit_from ] || gio.def.default_dress;
				var ww = clonem( ww, dress );
				tp.core.paste_non_arrays( dress, ww );
			});
			var all =  clonem( gm.game.dresses, gm.dresses );


		}else{
			var all =  gm.game.dresses;
		}

		if( !tp.core.get_first_or_null( all ) ) {
			var all = { dresses : gio.def.default_dress };
		}

		gm.dresses_wrap = { all : all };

		mapDresserArray( gm, chosen_map_dkey || gm.game.dresses_chosen_key );

	};
	var mapDresserArray = function(gm, initial_dkey){

		var dresses		= gm.dresses_wrap.all;
		var arr			= [];
		var chosen_ix	= -1;
		var counter		= -1;

		ceach(dresses, function(dkey,dress){

				if(dress.skip) return true;
				counter +=1;

				var title = dress.credits.title || tp.core.capitalizeFirstLetter(dkey.replace(/_/g,' '));
				arr[counter] = { 
						title : title,
						dress : dress
				};		
				if(initial_dkey === dkey){
					chosen_ix = counter;
				} 
				tp.core.tooltipify( dress, "Dress" );
		});

		if( chosen_ix < 0 ) chosen_ix = 0;
		gm.dresses_wrap.arr = arr;
		gm.dresses_wrap.chosen_ix = chosen_ix;
		gm.dresses_wrap.chosen_dress = arr[chosen_ix].dress;
	};



})(jQuery);


( function( $ ) { 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var ggc		=  gio.gui.create;
					var gdr		=  gio.domwrap.regions;
					var clonem	=  tp.core.clone_many;
					var ceach	=  tp.core.each;
	gio.gui.reskinnify_board = function(){

		var gs			= gio.getgs();
		var gm			= gs.gm;
		var game		= gm.game;		
		var album		= gs.playalb;
		var dress		= gm.dresses_wrap.chosen_dress;
		var img_dec		= dress.image_decoder;
		var dstyle		= dress.style;
		var parstyle	= dstyle.parent || {};
		var plstyle		= dstyle.play || {};
		var gboard_stl	= gm.board.style;
		var dcenter_stl	= gdr.dcenter.style;
		var BCOLOR		= 'transparent';
		document.title = gio.gui.procs.get_master_title_from_session_state();
		gboard_stl.position='absolute';
		var skin_standard_path	=	gio.config.defpaths.SKINS_DEF_PATH + '/'+ dress.skin_key
		dcenter_stl.height='100%';
		dcenter_stl.backgroundColor = parstyle.backgroundColor || BCOLOR;
		if(parstyle.backgroundImage){
			var ww = parstyle.backgroundImage;
			var img	= ww.indexOf('/') > -1 ? ww : (skin_standard_path + '/' + ww);
			img = "url('" + img + "')";
		}else{
			img = 'none';
		}
		dcenter_stl.backgroundImage = img;
		gboard_stl.backgroundColor = plstyle.backgroundColor || BCOLOR;
		if(plstyle.backgroundImage){
			var ww = plstyle.backgroundImage;
			var img	= ww.indexOf('/') > -1 ? ww : (skin_standard_path + '/' + ww);
			img = "url('" + img + "')";
		}else{
			img = 'none';
		}
		gboard_stl.backgroundImage = img;
		var twidth = dress.tile.width;
		var theight = dress.tile.height;
		var mwidth = 0;
		var mheight = 0;
		var ww=gm.focuser_img;
		ww.width  = twidth;
		ww.height = theight;
		tp.core.each(gm.cols, function(cid,colony){
			var cname=colony.nam;
			$.each(colony.units, function(unit_ix,unit){
					colony.hname = dress.human_name(colony.nam);
					unit.hname = colony.hname + (gio.debug ? ' id=' + unit.id : '');
					if(colony.units.length > 1) unit.hname += ' '+unit_ix;
					var loc=gm.pos.uid2loc[unit.id];
					var xx=loc[0];
					var yy=loc[1];
					var div = unit.tile.div;
					var ss = div.style;
					var activity = colony.activity;
					if(!colony.activity.frozen)	div.title=unit.hname;

					var ww=(twidth * xx);
					if(mwidth<ww+twidth) mwidth=ww+twidth;
					ss.left = ww + 'px';

					ww=theight * yy;
					if(mheight<ww+theight) mheight=ww+theight;

					ss.top = ww + 'px';
					ss.width = twidth + 'px';
					ss.height = theight + 'px';

					var img = unit.tile.img;

					var w_key = cname + '_' + xx + '_' + yy;
					var w_img = img_dec[ w_key ] || img_dec[ cname ] || (cname + '.png');
					img.src		= w_img.indexOf('/') > -1 ? w_img : (skin_standard_path + '/' + w_img);
					img.width	= twidth;
					img.height	= theight;
					img.style.visibility='visible';

			});
		});
		gm.dim_max_width = mwidth;
		gm.dim_max_height = mheight;
		ggc.reset_unit_focuser(gm);
		var dress_display_flag = gm.dresses_wrap.arr.length < 2 ? 'none' : 'block';
		gio.domwrap.headers.dress_select_el.reset({
				r:	{
						options				:gm.dresses_wrap.arr
					},
				c:	{	dont_reset_styles	:false,
						choice_ix			:gm.dresses_wrap.chosen_ix,
						gui:{style :{wrapper:{display : dress_display_flag}}}
					}
		});
		if(gio.debug){ gio.cons_add(	'Reskinnified board for gm_ix ' + gm.ix + ' on gkey=' +
										gm.game.gkey+ ' dress.key=' + dress.key);
		}
	};//reskinnify_board = function()
	ggc.reset_unit_focuser = function(gm) {
		var ww = gm.focuser_img;
		if( gm.dresses_wrap.chosen_dress.focuser !== '' ) {
			var www = gm.dresses_wrap.chosen_dress.focuser || 'default'; 
			ww.src = gio.config.defpaths.SKINS_DEF_PATH + '/' + www + '/focuser/focuser.png';
		}
	};
	gio.gui.unhide_map = function ( gm ) {
			var coll	= gm.collection;
			var lkey	= coll.ref.list.akey;
			var colls	= gio.session.procs.get_listed_album( lkey ).collections;
			gio.gui.procs.visualize_collection_titles( coll, colls );

			gio.gui.procs.do_display_curr_board( 'yes' );

			gio.gui.reset_playpaths_select_el();
			gio.gui.reset_rounds_select_el( gm );
			gio.gui.reskinnify_board();
			gio.gui.procs.draw_status_and_scene();

	};


})(jQuery);


( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;
					var gdh		=  gio.domwrap.headers;
					
					var bC				= 'backgroundColor';
					var iH				= 'innerHTML';
					var tL				= 'title';
					var tT				= 'tooltip';

					var ANNOYANCE_MOVES	= gio.config.style.annoyances.MOVES_AFTER_START_LIMIT;
					var ANNOYANCE_DURATION = gio.config.style.annoyances.DURATION_AFTER_START_LIMIT;
					var annoyance_count = 0;
					var annoyance_stop_time = -1;
	gio.draw_status = function( dont_redraw_won_status )
	{ 


		var gs		= gio.getgs();
		var gm		= gs.gm;
		if( !gm || gm.load !== 'finalized') {
			gde.chaser.style.display = 'none'; //TODm allow help. Redesign GUI scenarios.
			gio.debly( "No GUI status. Malformed gm.");
			return;
		}
		gio.debly( "Drawing GUI status ... ");
		if( annoyance_stop_time < 0 ) {
			annoyance_stop_time = ANNOYANCE_DURATION + (new Date()).getTime();
		} 
		gdr.dcenter.style.display = 'block';
		var album__cur	= gs.playalb;
		album__cur[tL]	= gio.gui.procs.get_master_title_from_session_state();
		gdh.title_select_el[iH] = album__cur[tL];


		gio.core.procs.update_top_links();
		gio.config.google_apps.reset_ad_visibility();
		var gs		= gio.getgs();
		var round	= gs.round;
		var pos		= round.pos;
		gde.chaser.style.display = 'block';
		var ww = ( gm.actor_cols.length > 1 && gs.unit.col.focused && gs.unit.hname ) || ''; 
		gio.domwrap.status.unit_div[iH] = '<pre>' + ww + '</pre>';


		var dress = gm.dresses_wrap.chosen_dress;
		var dress_features = dress.features;
		if( !dress_features || dress_features.statistics ) {
			gde.RePartsCount[iH]		= '' + round.peer_change;
			gde.interactionsNumber[iH]	= '' + round.interacts;
			gde.movesCount[iH]			= '' + round.current_pos_ix;
			gde.backsCount[iH]			= '' + round.backs;
			gde.pathCount[iH]			= '' + round.moves.length;

			gio.domwrap.status.main_status_div.style.display = "block";

		}else{

			gio.domwrap.status.main_status_div.style.display = "none";
		}
		var solo = gio.domwrap.cpanel.cont_rols.solver_control.arg.r.options;
		var msol = gm.solver;
		solo[1][tL] = "---";
		solo[2][tL] = "---";
		solo[3][tL] = "---";
		solo[4][tL] = "---";
		var mess_stub1 =	"Discards previous search data and releases its memory. " +
							"Searches on other maps are preserved and not affected.";

		if( msol.inactive_bf ) {
			solo[0][tL] = "Search First";
			solo[0][tT] = 'Searches and stops when first solution is found, ' + mess_stub1;
			solo[1][tL] = "Search All";
			solo[1][tT] = 'Does not stop when first solution is found, ' + mess_stub1;
			if( msol.stat && msol.stat.total_states > 1 ) {
				if( msol.space_exhausted() ) {
					solo[2][tL] = "Exhausted";
					solo[2][tT] = 'All positions reachable from start position are collected.';
				}else{
					solo[2][tL] = "Resume";
					solo[2][tT] = 'Resumes suspended search';
				}
			}
			if( msol.browser_mode ) {
				solo[3][tL] = "Go to Play";
				solo[3][tT] = 'Leaves solver browser and returns to palying game';
			}else if( msol.stat && msol.stat.total_states > 1 ) {
				solo[3][tL] = "Browse";
				solo[3][tT] = 'Browses collected positions space';
				solo[4][tL] = "Release Memory";
				solo[4][tT] =	'Deletes collected positions only for given map.' +
									'Does not release memory for searches made in other maps.';
			}
			gio.debsol( "Inactive solver statuses set for display" );
		}else if( msol.stopped_bf ) {
			solo[0][tL] = "Suspending ...";
			solo[1][tL] = "Suspending ...";
			solo[2][tL] = "Suspending ...";
		}else {
			solo[0][tL] = "Suspend";
			solo[0][tT] = "Suspends search. Can be resumed later.";
			solo[1][tL] = "Suspend";
			solo[1][tT] = "Suspends search. Can be resumed later.";
			solo[2][tL] = "Suspend";
			solo[2][tT] = "Suspends search. Can be resumed later.";
		}
		gio.domwrap.cpanel.cont_rols.solver_control.reset();
		var ww = gio.domwrap.cpanel.cont_rols.solver_control.display;
		if( msol.inactive_bf && msol.solutions.length > 0 ) {
			ww[iH] = 'Solved';
		}else if( msol.inactive_bf && msol.stat && msol.stat.total_states > 1 ) {
			ww[iH] = 'Finished';
		}else{
			ww[iH] = 'Solver';
		}	
		gde.solver_cons.style.display =		msol.never_ran  ? 'none' : 'block';

		if( !msol.never_ran ) gio.debsol( "Solver controls redrawn" );
		var ww_won = !dont_redraw_won_status ?  draw_decorations() : false;

		var ww_s = document.body.style;
		var ww_c = gstyle.solver_color;
		if( msol.browser_mode ) {
			ww_s[bC] = ww_won ? ww_c.BROWSER_WON : ww_c.BROWSER;
		}else if( msol.inactive_bf ) {
			if( !ww_won ) ww_s[bC] = gstyle.rootColor;
		}else{
			ww_s[bC] = ww_won ? ww_c.SEARCHING_WON : ww_c.SEARCHING;
		}
		do_filter_features_display( gm, round );
		if( !dress_features || dress_features.consoles ) {
			gde.con_div.style.display = "block";
		}else{
			gde.con_div.style.display = "none";
		}

	};// draw_status
	var do_filter_features_display = function ( gm, round ) {

		var dress = gm.dresses_wrap.chosen_dress;
		var dress_features = dress.features;
		var w_config = false;
		if( dress_features ) {
			var w_config = gio.config.style.features[ dress_features ];
		}
		var w_controls = gio.domwrap.cpanel.cont_rols;

		tp.core.each( w_controls, function ( name, vv ) {
			var do_display = "block";
			if( w_config ) {
				do_display = w_config.indexOf( '.' + name + '.' ) > -1 ? "block" : "none";
			}
			if( name === "forward" || name === "autoplay" ) {
				do_display = round.current_pos_ix < round.moves.length ? do_display : 'none';
			}

			if( name === "back" || name === "restart" ) {
				do_display = round.current_pos_ix > 0 ?		do_display : 'none'
			}

			if( name === "playpaths" ) {
				do_display = gm.playpaths ?	do_display : 'none';
			}
			do_display = {c:{gui:{style :{wrapper:{ display : do_display }}}}};
			w_controls[name].reset( do_display );
		});
	}; /// Blocks controls which are forbidden by dress or by
	var draw_decorations = function () { 

		var gs			= gio.getgs();
		var gm			= gs.gm;
		var won_or_not	= gm.game.won_or_not;
		var pos			= gs.pos;
		var WCOLOR		= gstyle.WINNING_COLOR;
		var mcap		= gdh.map_caption_text_div;
		annoyance_count	+= 1;
		var show_annoynaces =	annoyance_count < ANNOYANCE_MOVES &&
								(new Date()).getTime() < annoyance_stop_time;
		mcap[iH]			=	show_annoynaces ? 'Map Level' : '';
		if( !show_annoynaces ) {
			gdr.dtopcenter.style.display = "none";
		}
		var rating_total	= gdh.map_caption_total_div;
		var w_total			= parseInt( rating_total.style.width );
		var relative		= gm.metrics.recalculated.relative;
		if( relative && !isNaN( w_total ) )
		{
			var w_content				= gdh.map_caption_total_content_div;
			var w_width					= Math.ceil( w_total * relative / 100.0 );
			w_width						= Math.max( Math.min( w_total, w_width ), 1 ); 
			var rating_div				= gdh.map_caption_highlighter_div;
			rating_div.style.width		= w_width + 'px';
			var tooltip					= gm.metrics.recalculated.ten_rounded + ' whirps out of 10. Estimated.';
			w_content.innerHTML			= '' + gm.metrics.recalculated.ten_rounded;
			rating_div.setAttribute		( 'title', tooltip );
			rating_total.setAttribute	( 'title', tooltip );
			rating_total.style.display	= 'block';
			mcap.style.display			= 'none';
		}else{
			rating_total.style.display	= 'none';
			mcap.style.display			= 'block';
		}
		if( !won_or_not ) return false;
		var report = won_or_not();


		if(report){
			mcap[iH]				= 'Won';
			gde.con_div.style[bC]	= WCOLOR;
			gdr.dcenter.style[bC]	= WCOLOR;
			document.body.style[bC]	= WCOLOR;

		}else{
			gde.con_div.style[bC]				= gstyle.console[bC];
			gdr.dcenter.style[bC]				= gstyle.controls[bC];
			document.body.style[bC]				= gstyle.rootColor;
			if( gio.debug ) {
				if(	pos.filled_units>0 &&
					pos.filled_units < gm.objective.necessary &&
					gio.modes.play !== 'autoplay'){
						gio.plcons_add(		'Completed '+ pos.filled_units +' goal(s) ... remains '+
											(gm.objective.necessary - pos.filled_units) + ' ...');
				}
			}
		}

		return report;
	};	///	Predisplays winning/unwinning status ...
	gio.core.procs.update_top_links = function(){

		var gcl		= gio.config.links;
		var gsm		= gio.session.server.message;
		var mtit	= gio.session.server.top_menu_titles;
		var anchor	= '<a ' + gstyle.top_navig.link_style + ' href="';
		var target	= '" target="_blank" ';
		var w_p		= anchor + '#" onclick="jQuery.fn.tp$.gio.map_editors.';		
		
		if(gsm.loggedin){
			var logio	=	w_p + 'send_logout_request(); return false;" ' +
							mtit.logout_url;
		}else if( gio.modes.sta_tic.db ){
			var logio	=	w_p + 'invoke_login(); return false;" ' +
							mtit.login_url;
		}else{
			var logio	= anchor + gsm.login_url + target + mtit.login_url;
		}

		var craft		= gsm.craft_zone_url ? 
								anchor + gsm.craft_zone_url	+ target + mtit.craft_zone_url :
								'';

		if(gsm.hide_db_site_links) logio = '';
		if(gsm.hide_db_site_links) craft = '';

		var home = '';
		if(	(	!gio.config.feeder.exists || gio.config.query.aurl ) && 
				gsm.homehost && gsm.homepath
		) {
			var home		=	anchor + 'http://' + gsm.homehost + '/' + gsm.homepath +
								target + mtit.home;
		}		

		/* //TODM do detect iframe and exclude_alubms and add home:
		if( window.location.hostname.toLowerCase() === gsm.homehost &&
			){
			home = '';
		}
		*/


		var howto		= anchor + gsm.howto		+ target + mtit.howto;

		var terms		= '';
		if( gio.config.feeder.exists ) {
			terms		= anchor + gio.config.feeder.url + '/' + gsm.terms + target + mtit.terms;
		}

		var dev			= anchor + gcl.dev_zone		+ target + mtit.dev
		var more		= anchor + gcl.more_zone	+ target + mtit.more;
		var credits		= anchor + 'javascript:jQuery.fn.tp$.gio.gui.procs.toggle_about_pane(); "' + mtit.credits;
		gdr.dtopcenter[iH] = howto + home + logio + craft + more + terms + credits;
	};/// updates top links to related sites ...




})();


( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;





	gio.gui.init.create_controls_and_game_list = function () {

		var STATUS_LINE_HEIGHT=gstyle.controls.STATUS_LINE_HEIGHT;
		var STATUS_LINE_PERIOD=gstyle.controls.STATUS_LINE_PERIOD;
		var PADDING=gstyle.controls.PADDING;
		var PADDING_HORIZONTAL=gstyle.controls.PADDING_HORIZONTAL;

		var w, ww, ws;

		var cstyle=gstyle.captions;
		var constyle=gstyle.controls;

		var dwheaders = gio.domwrap.headers;
		var do_complete_control=function(w,left,top){
			w.style.position='absolute';
			ws=w.style;
			ws.height=STATUS_LINE_HEIGHT+'px';
			ws.left=left+'px';
			ws.top=top+'px';
			ws.width=gstyle.controls.width+'px';
			ws.padding=PADDING+'px';
			ws.paddingRight=PADDING_HORIZONTAL+'px';
			ws.paddingLeft=PADDING_HORIZONTAL+'px';
			ws.color=gstyle.controls.color;
			gde.chaser.appendChild(w);
		};
		ww = 	cstyle.collectionHeight +
				cstyle.gameHeight +
				cstyle.mapHeight +
				cstyle.gaps*3;

		dwheaders.dress_select_el = tp.form.create_select_el(

				{	r :		{	parent	:gdr.dsubtop 	},
					c :	
					{		gui :
							{
									wmax	:	cstyle.width-cstyle.subcaptionWidth,
									hmin	:	cstyle.dressHeight,
									gradientDepth	:0.4,
									style	:
									{			wrapper: 	{	position	:'absolute',
																left		:cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'11px',
																fontFamily	:cstyle.fontFamily
															},
												display:	{	fontSize	:'11px',
																color		:'#EEEEEE'
															}
									},
									outColor				:'#666666',
									overColor				:'#999999'
							}	
					}
				}
		); ///	Dress selector creation

		var ww = cstyle.collectionHeight+cstyle.gameHeight+cstyle.gaps*2;

		dwheaders.map_select_el = tp.form.create_select_el(
					{r:{	parent	:gdr.dsubtop
					},
					c:{	gui		:{
									wmax:cstyle.width-cstyle.subcaptionWidth,
									hmin:cstyle.mapHeight,
									gradientDepth	:0.4,
									style:		{wrapper: 	{	position	:'absolute',
																left		:cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'15px',
																fontFamily	:cstyle.fontFamily
															}
												},
									height_of_box_limit : 300 //TODm 500 collides with console. Console is on top.
								}	
					}}
		);
		var w = dwheaders.map_caption_div = document.createElement( 'div' );
		w.style.position='absolute';
		w.style.color='#FFFFFF';
		w.style.width=(cstyle.subcaptionWidth-5)+'px';
		w.style.top=ww+Math.ceil(cstyle.mapHeight/3)+'px';
		w.style.fontFamily=cstyle.fontFamily;
		gdr.dsubtop.appendChild(w);
		var ww = dwheaders.map_caption_text_div = document.createElement( 'div' );
		ww.style.position='absolute';
		w.style.color='#FFFFFF';
		w.style.width=(cstyle.subcaptionWidth-5)+'px';
		w.style.top=ww+Math.ceil(cstyle.mapHeight/3)+'px';
		w.style.fontFamily=cstyle.fontFamily;
		dwheaders.map_caption_div.appendChild( ww );
		var ww = dwheaders.map_caption_total_div = document.createElement( 'div' );
		ww.style.position='absolute';
		ww.style.backgroundColor='#0000DD';
		ww.style.width = '50px';
		ww.style.height = '15px';
		ww.style.top = '0px';
		ww.style.display = 'none';
		dwheaders.map_caption_div.appendChild( ww );
		tp.gui.cornerize( { r : 3 }, ww );
		var ww = dwheaders.map_caption_total_content_div = document.createElement( 'div' );
		ww.style.position='absolute';
		ww.style.width = '50px';
		ww.style.height = '15px';
		ww.style.top = '0px';
		ww.style.paddingTop = '2px';
		ww.style.color='#FFFFFF';
		ww.style.textAlign = 'center';
		ww.style.fontFamily=cstyle.fontFamily;
		ww.style.fontSize = '10px';
		dwheaders.map_caption_total_div.appendChild( ww );
		var ww = dwheaders.map_caption_highlighter_div = document.createElement( 'div' );
		ww.style.position='absolute';
		ww.style.backgroundColor='#FFAAAA';
		ww.style.width = '0px';
		ww.style.height = '15px';
		ww.style.top = '0px';
		ww.style.fontFamily=cstyle.fontFamily;
		dwheaders.map_caption_total_div.appendChild( ww );
		tp.gui.cornerize( { r : 3 }, ww );
		jQuery( ww ).css( { opacity : 0.6 } );		
		var ww = cstyle.gameHeight+cstyle.gaps;
		dwheaders.collection_select_el=tp.form.create_select_el(
					{r:{	parent	:gdr.dsubtop
					},
					c:{	gui		:{
									wmax:cstyle.width,  //-cstyle.subcaptionWidth,
									hmin:cstyle.collectionHeight,
									gradientDepth	:0.4,
									style:		{wrapper: 	{	position	:'absolute',
																left		:cstyle.width, //cstyle.subcaptionWidth+'px',
																top			:ww+'px',
																fontSize	:'15px',
																fontFamily	:cstyle.fontFamily
															}
												}
								}	
					}}
		);
		dwheaders.title_select_el = tp.form.create_select_el (
					{r:{	parent		:gdr.dsubtop,
							options		:gio.session.alist
					},
					c:{	choice_ix		:gio.session.state.album_ix,
						gui:{	wmax:cstyle.width,
								hmin:cstyle.gameHeight,
								outColor				:'#888888',
								overColor				:'#CCCCCC',
								gradientDepth			:0.4,
								style:		{wrapper: 	{	position	:'absolute',
															left		:'0px',
															top			:'0px',
															fontSize	:'15px',
															fontFamily	:cstyle.fontFamily
														},
											display:	{	fontSize	:cstyle.fontSize+'px',
															fontStyle	:cstyle.fontStyle,
															fontWeight	:'bold',
															color		:cstyle.gameTitleColor
														}
											}
						}
					}}
		);
		var makeSelectElement = function( arg ) {

				constyle=gstyle.controls;
				return select_el=tp.form.create_select_el(
					{r:{	parent		: arg.parent,			//gde.chaser,
							options		: arg.options,			//[{	title:'Back',
							callback	:	function(i,option,select_el){
												arg.callback(i,option,select_el);
												if(arg.redraw_scene){
													gio.draw_scene();
													gio.draw_status();
												}
											}
					},

					c:{		choice_ix:0,
							gui:{	wmax : constyle[arg.name].width,		//gstyle.controls.aboutWidth,
									hmin:STATUS_LINE_HEIGHT,
									outColor				:'#888888',
									overColor				:'#CCCCCC',
									gradientDepth			:0.3,

									style:	{wrapper: 	{	position	: 'absolute',
															left		: constyle[arg.name].left+'px', //'120px',
															top			: STATUS_LINE_PERIOD*constyle[arg.name].slot+'px'
														},
											display:	{	fontSize	: constyle.fontSize+'px',
															fontStyle	: constyle.fontStyle,
															fontWeight	: constyle.buttonsFontWeight,
															color		: constyle.color
														}
								}
						}
					}}
				);
		};
		var makeControl = function( arg ) {
				arg.parent = gde.chaser;
				var rr = gio.domwrap.cpanel.cont_rols[ arg.name ] = makeSelectElement( arg );
				return rr;
		};

		var ww = '<td style="width:50px; border:none; padding:2px; text-align:right;';
		var www = ww + ' background-color:#333333;">';
		var wwww = ww + ' background-color:#222244;">';
		ww = '<td style="border:none; background-color:#333333; padding:2px;" >'
		w = 	'<table style="border:none; color:#FFFFFF; font-family:Helvetica, Arial; font-size:10px;">';
		w +=	www+'Moves</td>';
		w +=	www+'Path</td>';
		w +=	www+'InterActs</td>';
		w +=	www+'ReInter</td>';
		w +=	wwww+'Backs</td>';
		w +=	'</tr><tr>';
		w +=	www+'Moves</td>';
		w +=	www+'Path</td>';
		w +=	www+'InterActs</td>';
		w +=	www+'ReInter</td>';
		w +=	wwww+'Backs</td>';
		w +=	'</tr></table>';
		var ww = gio.domwrap.status.main_status_div = document.createElement( 'div' );
		do_complete_control( ww, 0, STATUS_LINE_PERIOD*0 );
		ww.innerHTML=w;
		w = $(ww).find('td');

		gde.movesCount			= w[5];
		gde.pathCount			= w[6];
		gde.interactionsNumber	= w[7];
		gde.RePartsCount		= w[8];
		gde.backsCount			= w[9];
		w=gio.domwrap.status.unit_div=document.createElement('div');
		do_complete_control(w,0,STATUS_LINE_PERIOD*1);

		/*
		w=gio.mode_div=document.createElement('div');
		do_complete_control(w,0,STATUS_LINE_PERIOD*2+8*PADDING);
		*/
		if( gio.config.feeder.exists ) {
			makeControl( {
				name : 'load_external',
				options :	[	{	title	: 'Land on External',
									tooltip	: 'Load external collection from Internet'
								}
							],
				callback :	function(i,option){
								switch(option.title){
									case 'Land on External' :	
										gio.map_editors.submit_box_to_enter_collection_link();
										break;
								}
							}
			});
		}


/*
		var w = [];
		if(gio.modes.sta_tic.db){
				 w =	[	{	title:'Load Session',
							tooltip:'Loads map`s playsession from database.'
							},
							{	title:'Save Session',
								tooltip:'Saves map`s playsession to database.'
							}
						]
		}
		w.push(	{	title:'Save Map Session',
					tooltip:'Shows map`s playsession to be copy-saved by Ctrl+A, Ctrl+C.'
				});
		w.push(	{	title:'Load Map Session',
					tooltip:'Loads map`s playsession from text.'
				});
		makeControl( {
				name : 'save_or_load',
				options :	w,
				callback :	function(i,option){
								switch(option.title){
									case 'Save Map Session' :
											var stringified = gio.navig.in_session.round.serialize_rounds();
											gio.map_editors.do_init_save_load_popup(stringified);
											break;
									case 'Load Map Session' :
											gio.map_editors.do_init_save_load_popup();
											break;
									case 'Save Session' :
											var w = gio.data_io.core.save.object(
													gio.modes.sta_tic.db+'/game_sessions',			//rails controller url
													gio.data_io.session.session2db_ready_obj());	//object
											if(w.status === 'not logged'){
												alert('You must login to save the session');
												return;
											}else if(w.status === 'saved'){
												gio.cons_add('Playsession saved');
											}
											break;
									case 'Load Session' :
											var w = tp.core.download_object(
												gio.modes.sta_tic.db+'/game_sessions/1');
											if(w.status === 'not logged'){
												alert('You must login to load the session');
												return;
											}
											if(!w.session){
												gio.cons_add('Problems loading session');
												return;
											}
											var success = gio.data_io.session.load_jsoned_sess2sess(w.session);
											if(!success){
												gio.cons_add('Problems loading session');
												return;
											}
											success = gio.navig.validate_coll_map( null, null, null, 'do_land' );
											if(!success){
												gio.cons_add('Problems loading session');
												return;
											}
											gio.cons_add('Playsession loaded');
											break;
								}
							}
		});

		*/

		makeControl({
					name : 'solver_control',
					options :	[
									{	title:'---'
									},
									{	title:'---'
									},
									{	title:'---'
									},
									{	title:'---'
									},
									{	title:'---'
									}
								],
					callback :	gio.solver.fire_button_callback
		});
		gio.domwrap.cpanel.cont_rols.solver_control.display.innerHTML = 'Solver';

		makeControl( {
				name : 'edit',
				options :	[
								{	title:'Create Gamion',
									tooltip:'Create your game, album, or map scripts.'
								},
								{	title:'Edit Gamion',
									tooltip:'Edit current game, album, or map scripts.'
								},
								{	title:'Edit Map Scripts',
									tooltip:'Edit current map in context of current collection.'
								},
								{	title:'Edit Position',
									tooltip:'Convers current position to board-script to be edited.'
								},
								{	title:'Edit Co-Position',
									tooltip:'Convers current position to co-position board-script to be edited.'
								},
								{	title:'Edit Playpath',
									tooltip:'Edit or show playpath text.'
								},

								{	title : 'Metrify Map',
									tooltip : '(Re)metrifies currently existing path with winning position.'
								},

								{	title:'Album Definitions',
									tooltip:'Shows Albums available to build upon.'
								},

								/*
								{	title:'Collection Designer',
									tooltip:'Show JSONed Albums'
								},
								*/

								{	title:'Game Definitions',
									tooltip:'Shows Game Definition Seeds available to build upon.'
								}

								/*
								{	title:'Base Def Info',
									tooltip:'Shows Base Game Definition'
								}
								*/

							],
				callback :	function(i,option){
								switch(option.title){
									case 'Create Gamion' :	
											gio.map_editors.submit_box_to_enter_gamion( 'create' );
											break;
									case 'Edit Gamion' :	
											gio.map_editors.submit_box_to_enter_gamion( 'edit' );
											break;
									case 'Edit Map Scripts' :	
											gio.map_editors.edit_custom_maps( 'edit_map_scripts' );
											break;
									case 'Metrify Map' :	
											gio.map_editors.metrify_map();
											break;
									case 'Edit Position' :	
											gio.map_editors.edit_custom_maps( 'pos_to_map' );
											break;
									case 'Edit Co-Position' :	
											gio.map_editors.edit_custom_maps( 'pos_to_comap' );
											break;
									case 'Edit Playpath' :
											gio.map_editors.display_game_path();
											break;
									case 'Album Definitions' :
											gio.map_editors.display_albums();
											break;
									/*
									case 'Collection Designer' :
											gio.map_editors.display_collections();
											break;
									*/
									case 'Game Definitions' :
											gio.map_editors.display_game_defs();
											break;
									/*
									case 'Base Def Info' :
											gio.map_editors.display_base_game_inherited_def();
											break;
									*/
								}
							}
		});
			makeControl( {
							name : 'reset',
							options :	[{	title:'Reset',
											tooltip:'Reset round and clear its playpath.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_session.round.init_round(gio.getgs().gm,'reset this round');
										}
			});
			makeControl( {
							name : 'newround',
							options :	[{	title:'New',
											tooltip:'Create new round. Preserve other rounds. Key: n.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_session.round.init_round(gio.getgs().gm);
											gio.gui.reset_rounds_select_el();
										}
			});
			makeControl( {
							name : 'rounds',
							options		:[{	title:'Round',
											tooltip:'Select Round'
										}],
							callback :	null
			});
			makeControl( {
							name : 'playpaths',
							options		:[{	title:'Prerecorded',
											tooltip:'Load playpath to walk through or see a solution. '+
													'Wait for "Path" cell to repopulate while loading ...'
										}],
							redraw_scene : true,
							callback :	null
			});
			makeControl( {
							name : 'autoplay',
							options :	[{	title:'Replay',
											tooltip:'Forward automaticaly along playpath. Key: z.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.modes.play='autoplay';
											gio.navig.in_map.autoplay(300);
										}
			});
			var help_callback=function(i,option){
				switch(option.title){
					case 'Help' :	
									gio.gui.procs.toggle_help();
									break;
					case 'Rules' :	
									gio.gui.procs.show_rules();
									break;
					case 'Objective' :	
									gio.gui.procs.show_objective();
									break;
					case 'Story' :
									gio.gui.procs.show_story();
									break;
					case 'About Map' :
									gio.gui.procs.toggle_about_map_pane();
									break;
					case 'Credits' :
									gio.gui.procs.toggle_about_pane();
									break;
				}
			};
			makeControl( {
				name : 'help',
				options :	[	{	title : 'Help',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title : 'Rules',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title : 'Objective',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title : 'Story',
									tooltip : ('Keys '+gio.info.help.hint)
								},
								{	title:'About Map',
									tooltip:'About Map Information. Key x'
								},
								{	title:'Credits',
									tooltip:'Credits for all game components. Shift + c.'
								}
							],
				callback :	help_callback
			});
			makeControl( {
							name : 'forward',
							options :	[{	title:'Forward',
											tooltip:'Forward along playpath. Key: f.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_map.back_forward_start('forward');
										}
			});
			makeControl( {
							name : 'restart',
							options :	[{	title:'Start',
											tooltip:'Display start position and preserve playpath. Key: s.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_map.back_forward_start('to beginning');
										}
			});
			makeControl( {
							name : 'back',
							options :	[{	title:'Back',
											tooltip:'Revert move. Keys: Backspace or space.'
										}],
							redraw_scene : true,
							callback :	function(){
											gio.navig.in_map.back_forward_start('back');
										}
			});
			gio.common_popup.update_owner({
				owner:'help',
				innerHTML:'<pre>'+gio.info.help.main+'</pre>'
			});
			gio.common_popup.update_owner(gstyle.popups.about);
			w=$.extend({},gstyle.popups.about);
			w.owner='map_comments';
			gio.common_popup.update_owner(w);
		gio.debtp( 'create_controls_and_game_list is done.' );

	};

})(jQuery);



( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gde		=  gio.domwrap.elems;
					var gdr		=  gio.domwrap.regions;
					var ggp		=  gio.gui.procs;
	gio.gui.procs.reset_web_text_selection_appearance = function( div, setting ){
			return $(div).css({
				'-moz-user-select' : setting,
				'-webkit-user-select ' : setting,
				'-ms-user-select' : setting,
				'-khtml-user-select' : setting,
				'user-select' : setting
			});

	};
	gio.gui.init.control_events=function(){
		var ww = gio.gui.procs.reset_web_text_selection_appearance;
		ww(	gde.chaser, 'none');
		ww(	gdr.dtopleft, 'none');
		ww(	gdr.dtopcenter, 'none');
		ww(	gdr.dsubtop, 'none');
		ww(	gde.playvig_cons, 'none');


		
		tp.bindEvents('click', function(){
			if(!gio.gui.modes.common_popup_shown){
				return true;
			}
			gio.domwrap.popups.hide_common();
			return true;
		});
		tp.bindEvents(
			'keydown',
			function(a){
				if(!a.event.ctrlKey || !gio.domwrap.popups.input_text_popup.isVisible())return true; //pass event
				switch(a.keyName){
					case 'd':	//done with custom maps
						gio.map_editors.load_from_text_editor();
						return false;
					}
					return true;
			},
			gio.domwrap.popups.input_text_popup.popup_el
		);




		tp.bindEvents('keydown', function(a){
			if(a.keyName === 'escape' && !a.event.altKey && !a.event.ctrlKey){	//cancellator:
					if(gio.modes.play==='autoplay')gio.modes.play='';
					gio.domwrap.popups.hide_common();
					if(gio.domwrap.popups.input_text_popup.isVisible()){
						gio.map_editors.hide_text_editor();
					}
			}
			if(a.keyName === 'question' || a.keyName === 'h' ){
					if( gio.input_mode ) return true;
					gio.gui.procs.toggle_help();
					return !!a.event.ctrlKey; //allow native browser help
			}
			if(	gio.gui.modes.controls_locked ||
				a.event.altKey || a.event.ctrlKey ||
				gio.domwrap.popups.input_text_popup.isVisible() // TODm redundancy with gio.gui.modes.controls_locked. Must be redesigned.
			)return true;

			var w;
			var gs		= gio.getgs();
			var gm		= gs.gm;
			if(gm.load	!== 'finalized') return true;


			switch(a.keyName){

				case 'c':	//credits

					if( a.event.shiftKey ) {
						gio.gui.procs.toggle_about_pane();
						return false;
					}
					return true;

				case 'a':

					if( a.event.shiftKey ) {
						gio.gui.procs.toggle_about_map_pane();
						return false;
					}
					return true;

				case 's':

					if( a.event.shiftKey ) {
						gio.gui.procs.show_story();
						return false;
					}
					return true;

				case 'r':

					if( !a.event.shiftKey ) {
						gio.gui.procs.show_rules();
						return false;
					}
					return true;


				case 'o':

					if( !a.event.shiftKey ) {
						gio.gui.procs.show_objective();
						return false;
					}
					return true;


				case 't':
					if(gm.load	!== 'finalized') return true;
					gio.map_editors.edit_custom_maps();
					return false;

				case 'p':
					if(gm.load	!== 'finalized') return true;
					gio.map_editors.display_game_path();
					return false;
			}
			return true;
		});//tp.bindEvents('keydown', function(a){
		tp.bindEvents('keydown', function(a){
			if(gio.gui.modes.controls_locked)return true;
			if(gio.common_popup.isVisible())return true;

			var w;
			var gs			= gio.getgs();

			var gs		= gio.getgs();
			var gm		= gs.gm;
			if(gm.load	!== 'finalized') return true;
			var gs		= gio.getgs();

			var album		= gs.playalb;
			var collection	= gs.collection;
			var gm			= gs.gm;
			var len			= gio.session.alist.length;

			if(a.event.ctrlKey){
				if(a.arrow){ //select unit
					if(a.event.shiftKey){
						return gio.navig.in_map.scroll_colony(a.keyName); //breed
					}else{
						return ggp.do_one_scroll_of_unit_in_colony(a.keyName); //unit
					}
				}else if(a.keyName==='space'){
					gio.navig.in_map.back_forward_start('back');
					return false
				}
				return true;
			}
			if(a.event.altKey) return true;

			switch(a.keyName){


				case 'a':	//album

					if( !a.event.shiftKey ) {
						if(len===1)return true;
						gio.gui.procs.do_display_curr_board( false );
						var w_aix = ( gio.session.state.album_ix + 1 ) % len;
						gio.gui.procs.scroll_till_valid_album( w_aix, 'do_land' );
						return false;
					}
					return true;


				case 'c':	//collection

					if( !a.event.shiftKey ) {

						var w_colls = album.collections;
						if( w_colls.length === 1 ) return true;

						gio.gui.procs.do_display_curr_board( false );
						gio.domwrap.headers.collection_select_el.close();
						gio.domwrap.headers.map_select_el.close();

						w_colls_ix = ( w_colls.ix + 1 ) % w_colls.length;
						gio.gui.procs.scroll_till_valid_coll( w_colls_ix, w_colls, 'do_land' );

						return false;
					}
					return true;

				case 'm':	//map

					if( a.event.shiftKey ) {
						var w_mix = ( collection.map_ix + 1 ) % collection.maps.length;
						gio.navig.do_land_to_map( collection, w_mix );
						return false;
					}
					return true;


				case 'd': 	//round
					var rr=gm.rounds;
					rr.ix=(rr.ix+1)%rr.length;
					gio.gui.reset_rounds_select_el();
					break;

				case 'n':	//new round
					gio.navig.in_session.round.init_round(gm);
					gio.gui.reset_rounds_select_el();
					break;

				case 's':	//to start
					if( !a.event.shiftKey ) {
						gio.gui.procs.do_manage_round(null,'to beginning');
						break;
					}
					return true;
	
				case 'e':	//to end
					if( !a.event.shiftKey )
					{
						gio.navig.in_map.move_till_condition( 'do redraw GUI' );
						break;
					}
					return true;
	
				case 'u':	//unit
					return ggp.do_one_scroll_of_unit_in_colony(a.keyName);
				case 'space': //tribe-type-breed-colony
					return gio.navig.in_map.scroll_colony('right');
				case 'backspace': 
				case 'b':	//backmove
					gio.navig.in_map.back_forward_start('back');
					return false;
				case 'f':	//forward
					gio.navig.in_map.back_forward_start('forward');
					return false;
				case 'z':	//lazy autoplay
					gio.modes.play='autoplay';
					gio.navig.in_map.autoplay(300);
					break;
				default	: return true;
			}
			gio.draw_scene();
			gio.draw_status();
			return false;
		});//tp.bindEvents('keydown', function(a)
		$(window).resize(function(event){
			if(!gio.modes.app_loaded) return;
			var gm=gio.getgs().gm;
			gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		});
		$(window).scroll(function(event){
			if(!gio.modes.app_loaded) return;
			var gm=gio.getgs().gm;
			if(!gio.common_popup.isVisible()){ //TODm q&d buttons interfere with "info"
					gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
			}
		});
		gio.domwrap.headers.title_select_el.reset( 
			{	r:
				{
					callback : function( selected_ix, selected_game ) {

									if( gio.common_popup.isVisible() ) return -1;
									if( gio.gui.modes.controls_locked ) return -1;

									gio.gui.procs.do_display_curr_board( false );

									gio.config.google_apps.track.variable( 'Album Selected', selected_game.key );
		
									if( gio.gui.procs.scroll_till_valid_album( selected_ix, 'do_land' ) ) {
										return gio.session.state.album_ix;
									}else{
										return -1; //disprove
									}
					}
				}
			}
		);
		gio.domwrap.headers.collection_select_el.reset({r:{
			callback:function(
					selected_ix,
					selected_collection,
					dummy_select_el,
					event
			){

				var dontload = event && event.originalEvent.target && event.originalEvent.target.getAttribute('class');
				if( dontload === 'dontload_external' ) {
						return -1;
				}

				/*
					var try_to_load = event.originalEvent.target && event.originalEvent.target.innerHTML;
					try_to_load = try_to_load && try_to_load.toLowerCase() === 'try to load';
					if(!try_to_load) return -1;
				*/

				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				var success = gio.navig.validate_coll_map(  null, selected_ix, null, 'do_land'  );
				return ( success ? gio.getgs().colls.ix : -1 ); 
			}
		}}); /// Resets collection_select_el
		gio.domwrap.headers.map_select_el.reset({r:{
			callback:function(selected_ix,selected_map){
				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				gio.gui.procs.lock_controls('Initiating a map ...');

				var collection = gio.getgs().coll;
				if(collection.maps.length<2){
					gio.gui.procs.unlock_controls();
					return null; //ignore
				}
				gio.navig.do_land_to_map( collection, selected_ix );

				gio.gui.procs.unlock_controls();
			}
		}});
		gio.domwrap.headers.dress_select_el.reset(  {r:{

			callback:function(selected_ix, dress_el){

				if(gio.common_popup.isVisible())return -1;
				if(gio.gui.modes.controls_locked)return -1;

				gio.gui.procs.lock_controls('Initiating a dress ...');

				var gm = gio.getgs().gm;

				if(gm.dresses_wrap.arr.length<2){
					gio.gui.procs.unlock_controls();
					return null; //ignore
				}

				gm.dresses_wrap.chosen_ix = selected_ix;
				gm.dresses_wrap.chosen_dress = dress_el.dress;

				gio.gui.reskinnify_board();
				gio.gui.procs.draw_status_and_scene();

				gio.gui.procs.unlock_controls();
			}
		}});

	};//...control_events
	gio.gui.init.step_events=function()
	{
		tp.bindEvents('keydown', function(arg){
			if(gio.gui.modes.controls_locked)return true;
			if(gio.common_popup.isVisible())return true;
			var gs = gio.getgs();

			if( gs.gm.solver.browser_mode && arg.event.shiftKey ) {
				switch(arg.keyName){
					case 'up':
								gio.gui.procs.move_acting_unit(null, 'to end');
								return false;
					case 'down':	
								gio.gui.procs.move_acting_unit(null, 'to beginning');
								return false;
				}
			}



			if(	arg.event.ctrlKey || arg.event.shiftKey ||
				arg.event.altKey )return true;
			var mkey=arg.keyName;
			if( !arg.arrow ){
				switch(arg.keyName){
					case 'i':	mkey=-2;
								break;
					case 'j':	mkey=-1;
								break;
					case 'k':	mkey=1;
								break;
					case 'm':	mkey=2;
								break;
					default	:	return true;
				}
			}else{
				switch(arg.keyName){
					case 'up':		mkey=-2;
									break;
					case 'left':	mkey=-1;
									break;
					case 'right':	mkey=1;
									break;
					case 'down':	mkey=2;
									break;
					case 'pagedown'	: 
									return true;
					case 'pageup'	: 
									return true;
					default	:	return true;
				}
			}

			gio.gui.procs.move_acting_unit(mkey);
			return false;
		});
	}; //...step_events





})(jQuery);


( function () {		var tp   		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var core		=  tp.core;
					var gio  		=  tp.gio    =  tp.gio   || {};

					var gworkers	=  gio.gui.procs;







	var anchor_stub = 	"<a style=\"color:#AAAAFF; text-decoration:none; font-weight:bold;\" " +
						"onmouseover = \"this.style.color = '#FFAAAA';\" " +
						"onmouseout  = \"this.style.color = '#AAAAFF';\" " +
						"target = \"_blank\" " +
						"href=\"";
	var anchor_http = 	anchor_stub + 'http://';
	gworkers.toggle_about_pane = function(){

		if(gio.gui.modes.controls_locked) return;

		var gs = gio.getgs();
		var collection = gs.coll;
		var gm = collection.maps[collection.map_ix];

		var shell_div_style =	"position:relative; top:15px; left:10px; " +
								"font-size : 10px; width : 460px; height : 450px; overflow : auto; " +
								"border-radius : 7px; ";

		var about	= "<h1>C r e d i t s</h1>";
		if( gm.coll__eff !== collection ) {
			about		+= "<h2>Original Collection:</h2>";
			about		+= gm.coll__eff.credits_table;
			about		+= "<h2>Wrapping Collection:</h2>";
		}

		about		+= collection.credits_table;

		if( !collection.ref.link.ownhost ) {
			about += 		"<br>External contents can be changed unexpectedly and\n" +
							"are out of " + gio.description.title + " control.<br><br>\n";
		}

 		about += gworkers.get_map_credits().credits_table;
		about += gm.game.credits_table;
		about += gm.dresses_wrap.chosen_dress.credits_table;
		about += "<br>" + anchor_stub + gio.config.links.credits + "\"><h2>S k i n s</h2></a><br>\n";
		about += gio.description_table; //TODM move to About Engine button

		if( collection.script.parsed.file_header.raw ) {
			var flines = collection.script.flines;
			var ww = collection.script.parsed.file_header.raw;
			ww = core.joinRange(flines, ww.start, ww.end - ww.start);
			var style = "font-size : 10px; width : 420px; overflow : auto; border-radius : 7px;";
			about +=	"<div style=\"" + style + "\"><pre>" + 
							"\n\nO r i g i n a l   C o l l e c t i o n   H e a d e r:\n\n"+
							core.htmlencode(ww) +
						"</pre></div>";
		}
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;
 
		gio.common_popup.dotoggle({
				owner:'about', innerHTML: "<div style=\"" +
				shell_div_style + "\">" + about + "</div>" });
		gio.gui.procs.prolong_common_popup();

	};






	gworkers.toggle_help=function(){
		var gs=gio.getgs();
		gio.common_popup.dotoggle({
				owner:'help',
				innerHTML:	'<pre>' +
							(  gs.round && gs.round.gm.solver.browser_mode ? gio.solver.config.help : gio.info.help.main  ) +
							"\n"+'</pre>'
		}); //TODM hell. gs.round.gm.solver ... when popup can happen??
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup();
	};
	gworkers.toggle_about_map_pane = function(){

		var res = '';
		var gs = gio.getgs();
		var gm = gs.gm;
		var dsmap = gm.script.data_source_map;

		if( dsmap ) {
			res +=	"<pre>\nO r i g i n a l    B o a r d:\n\n" + 
					core.htmlencode(dsmap.script.raw_board) +
					"</pre>";
		}else{
			if( gm.script.raw_board) {
				res +=	"<pre>\nB o a r d:\n\n" + 
						core.htmlencode(gm.script.raw_board) +
						"</pre>";
			}
		}


		res += gm.metrics.recalculated.text;


		res += gworkers.get_map_credits('with_externals').description_table; //credits_table;


		if( dsmap ) {
			res +=	"<pre>\nO r i g i n a l    M a c r o s - D e c o d e d    P o s t - B o a r d:\n\n" + 
					core.htmlencode(dsmap.parsed.macrosed_postboard) +
					"</pre>";
		}else{
			res +=	"<pre>\nM a c r o s - D e c o d e d     P o s t - B o a r d:\n\n" + 
					core.htmlencode(gm.parsed.macrosed_postboard) +
					"</pre>";
		}


		if( core.get_first_or_null( gm.collection.macros ) ) {
			res +=	"<pre>\nR a w    M a p    T e x t:\n\n" + 
					core.htmlencode(gm.script.raw_map) +
					"</pre>";
		}

		if( dsmap ) {
			if( core.get_first_or_null( dsmap.collection.macros ) ) {
				res +=	"<pre>\nO r i g i n a l    M a p    R a w    T e x t:\n\n" + 
						core.htmlencode(dsmap.script.raw_map) +
						"</pre>";
			}
		}

		gio.common_popup.dotoggle( { owner:'map_comments', innerHTML : res } );
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};
	gworkers.get_map_credits = function( with_external ) {
		var gs		=	gio.getgs();
		var gm		=	gs.gm;
		
		var original_map = gm.script.data_source_map;
		if( original_map ) {
			var final_credits = core.clone_many( original_map.credits );
			final_credits.credits = [ core.clone_many( gm.credits ) ];
		}else{
			var final_credits = core.clone_many( gm.credits );
		}

		var external = gm.coll__eff.ref.link;
		if( external.link && with_external) {
			final_credits.web_site = gm.coll__eff.credits.web_site;
			final_credits.source = gm.coll__eff.ref.link.link;
		}
		var stub_obj = {};

		core.tooltipify( stub_obj, "Map", final_credits );
		return stub_obj;
	};






	gworkers.show_rules = function () {
		gio.common_popup.dotoggle({
			owner:'help',
			innerHTML:"<pre>R u l e s\n\n" + gio.getgs().gm.dresses_wrap.chosen_dress.rules + '</pre>'
		});
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};

	gworkers.show_objective = function () {
		gio.common_popup.dotoggle({
			owner:'help',
			innerHTML:"<pre>O b j e c t i v e\n\n" + gio.getgs().gm.dresses_wrap.chosen_dress.objective + '</pre>'
		});
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};

	gworkers.show_story = function () {
		gio.common_popup.dotoggle({
			owner:'help',
			innerHTML:"<pre>S t o r y\n\n" + gio.getgs().gm.dresses_wrap.chosen_dress.story + '</pre>'
		});
		gio.common_popup.popup_el.style.zIndex = gio.config.style.popups.zIndex;

		gio.gui.procs.prolong_common_popup(); //don't close now by own click
	};




})();


( function( $ ) { 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var clonem	=  tp.core.clone_many;
					var exp_url	=  tp.core.expand_to_parent;

					var med		=  gio.map_editors;
					var ggp		=  gio.gui.procs;
					var conadd	=  function ( string ) { gio.cons_add( "Editor Handler: " + string ); };			




	med.display_game_path = function ()
	{
			ggp.lock_controls('Displaying a path');
			gio.input_mode = 'path';
			med.show_text_editor();
			var ww=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
			var result = gio.navig.in_session.round.path2texts_current();

			var directive	=	'playpath=' + result.metrics + "\n";
			ww.value		=	":::" + directive  + result.path; 
			ww.value		+=	result.co_path ? "\n\n:::co_" + directive + result.co_path : '';
			ww.focus();
	};
	med.display_albums=function(){
		ggp.lock_controls( 'Displaying album-def-seeds' );
		gio.input_mode = 'albums';
		med.show_text_editor('dont_show_done');
		var textarea = $(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		var value = JSON.stringify( gio.def.albums, null, '\t');
		textarea.value="{ \"albums\" : \n" + value + "\n}\n";
		textarea.focus();
	};

	/*
	med.display_collections=function(){
		var w;
		ggp.lock_controls('Displaying collections');
		gio.input_mode = 'collections';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="collections=\n" + gio.core.reflection.serialize_collections();
		w.focus();
	};
	*/

	med.display_game_defs=function(){
		var w;
		ggp.lock_controls('Displaying Game Definitions');
		gio.input_mode = 'game_defs';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="game_definitions=\n" + gio.core.reflection.serialize_game_defs();
		w.focus();
	};

	/*
	med.display_base_game_inherited_def=function(){
		var w;
		ggp.lock_controls('Displaying Base Game Definition');
		gio.input_mode = 'basegame_def';
		med.show_text_editor('dont_show_done');
		w=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		w.value="Basegame definition=\n" + gio.core.reflection.serialize_basegame_def();
		w.focus();
	};
	*/
	med.metrify_map = function ( show_metrics )
	{
		gio.modes.play='autoplay';
		gio.navig.in_map.move_till_condition( 'do GUI', function ( gm, round )
		{
			if( gm.game.won_or_not( gm, round.pos ) )
			{
				var metr = gm.metrics;
				metr.optpath	= metr.optpath || {};
				metr.optpath.p	= round.moves.length;
				metr.optpath.i	= round.interacts;
				metr.optpath.r	= round.peer_change;
				gio.session.reinit.metrify( gm );
				conadd( 'Remetrified' );
				ggp.draw_status_and_scene();
				if( show_metrics ) gio.gui.procs.toggle_about_map_pane();
			}else{
				conadd( 'No winning position is detected' );
				ggp.draw_status_and_scene();
			}
		});

	};
	med.edit_custom_maps = function ( task ) {

		var gs=gio.getgs();
		var game=gs.gm.game;
		var links = null;
		var rman = gio.navig.in_session.round;

		ggp.lock_controls( 'Doing task ' + task );
		if( task === 'pos_to_map' ) {
			var custom_text = rman.pos2map_script ( gs.round ); // no do_comap
		}else if( task === 'pos_to_comap' ) {
			var custom_text = rman.pos2map_script ( gs.round, 'do_comap' );
		}else{
			var links = gs.gm.dresses_wrap.chosen_dress.links;
			var custom_text = tp.core.htmlencode(gs.gm.script.raw_map);
		}



		gio.input_mode = 'map';
		med.show_text_editor();

		if( links && links.length > 0 )
		{
				gio.domwrap.wraps.links_to_external_collections.reset(
					{r:{
						options				:links
					},
					c:{	
						choice_ix			:0
					}}
				);
				gio.domwrap.wraps.links_to_external_collections[ 'wrapper' ].style.display = 'block';
		}

		var textarea	= $(gio.domwrap.popups.input_text_popup.popup_el).children( 'textarea' )[0];
		textarea.value	= custom_text;	
		textarea.focus();
	};//med.edit_custom_maps
	med.submit_box_to_enter_collection_link = function () {

		var gs = gio.getgs();
		var game = gs.gm.game;

		ggp.lock_controls( 'Preparing to enter link for external collection ... ' );
		gio.input_mode = 'external_link';

		med.show_text_editor();
		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];

		textarea.value = "Enter link to external collection here";
		textarea.focus();

	};
	med.submit_box_to_enter_gamion = function ( mode ) {

		var gs		= gio.getgs();
		var game	= gs.gm.game;

		ggp.lock_controls( 'Preparing to edit gamion ... ' );
		gio.input_mode = mode + '_gamion';

		med.show_text_editor();
		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];

		textarea.value =	"// Enter your gamion or edit current one ...\n\n" +
							gs.coll.script.source_text;
		textarea.focus();

	};
	med.do_init_save_load_popup=function(stringified){

		if(!tp.core.allow_non_mainstream_browser()) return

		var gs=gio.getgs();
		var game=gs.gm.game;

		ggp.lock_controls( stringified ? 'Saving rounds' : 'Loading rounds');

		gio.input_mode = 'rounds';
		med.show_text_editor(stringified);

		var textarea=$(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0];
		textarea.value = stringified || '' ;	
		textarea.focus();
	};
	med.hide_text_editor = function( dont_unlock ) {

			gio.domwrap.wraps.links_to_external_collections.wrapper.style.display = 'none';
			med.text_editor_closing_button.wrapper.style.display = 'none';
			med.text_editor_done_button.wrapper.style.display = 'none';
			gio.domwrap.popups.input_text_popup.hide();
			if( !dont_unlock ) ggp.unlock_controls();
	};
	med.show_text_editor = function( dont_show_done )
	{
		if( gio.input_mode === 'map' ) {
			gio.domwrap.wraps.links_to_external_collections.wrapper.style.display = 'block';
		}
		if( !dont_show_done ) med.text_editor_done_button.wrapper.style.display = 'block';
		med.text_editor_closing_button.reset(  {c:{gui:{style:{wrapper:{display:'block'}}}}}  );
		gio.domwrap.popups.input_text_popup.show();
	};
	med.load_from_text_editor = function () {

		var gs = gio.getgs();
		var gm = gs.gm;
		var imode = gio.input_mode;

		ggp.do_display_curr_board( false );
		med.hide_text_editor('don`t unlock controls');

		var custom_text = $(gio.domwrap.popups.input_text_popup.popup_el).children('textarea')[0].value;


		if(imode === 'path'){

			gio.input_mode = '';
			ggp.inject_path_from_text( custom_text, 'do_messagify' );
			ggp.do_display_curr_board( 'yes' );
			return;

		}else if( imode === 'rounds' ) { 

			gio.input_mode = '';
			gio.navig.in_session.round.deserialize_rounds( custom_text );
			ggp.unlock_controls();
			return;
		}else if( imode === 'external_link' ) {

			var wlink		= $.trim( custom_text );
			var success		= !!wlink;  //TODM "courtecy work" check user input
			if( success )
			{
				var wlink		= exp_url ( $.trim( custom_text ) );
				var akey		= gm.collection.ref.list.akey;
				var downed_coll	= gio.data_io.download_gamion (
				{
					galfinition :
					{	penetrate_asingle	: true,
						title				: "My Album Choice",
						chosen				: true
					},

					mapfinition :
					{
						akey_advice			: akey,
						title				: "My Maps Choice",
						chosen				: true
					},

					common :
					{	
						link				: wlink
					}
				});

				var success = !!downed_coll;
			}

			if( success ) {
				var akey	= downed_coll.ref.list.akey;
				var cix		= downed_coll.ref.list.ix;
				var success = downed_coll.maps_loaded === 'success' ;
				if( success ) {
					var success = gio.navig.validate_coll_map( akey, cix, 0, 'do land' );
					if( !success ) conadd( "Failed landing on " + akey + ", " + ix );
				}else{
					conadd(	"No maps in collection ... perhaps are albums only ...\n" + //TODM there must be a way to pull derived album or game from parsed heap and try to scroll to gkey or akey.
							"try to scroll to albums manually ... "							
					);
				}
			}else{
				conadd( 'Failed custom scrith download for ' + wlink );
			}


			if( !success ) ggp.do_display_curr_board( true );
			ggp.unlock_controls();
			gio.input_mode='';
			return;
		}else if( imode === 'edit_gamion' || imode === 'create_gamion' ) {

			var custom_text	= $.trim( custom_text );
			if( !custom_text )
			{
				ggp.do_display_curr_board( true );
				ggp.unlock_controls();
				gio.input_mode = '';
				return;
			}

			var akey		= gs.akey;
			var wedit		= imode === 'edit_gamion';
			var metag		=
			{
				galfinition :
				{	penetrate_asingle	: true,
					overdefine			: wedit,
					chosen				: true,
					title				: "My Galfinition"
				},

				mapfinition :
				{
					cix_to_insert1		: wedit ? gs.cix + 1 : 0,
					akey_advice			: akey,
					title				: "My Mapfinition",
					chosen				: true
				},

				common :
				{	
					jwon						: true
				}
			};


			var downed_coll	= gio.data_io.download_gamion ( metag, custom_text );
			var success		= !!downed_coll;

			if( success ) {
				var akey	= downed_coll.ref.list.akey;
				var cix		= downed_coll.ref.list.ix;

				var success = downed_coll.maps_loaded === 'success' ;
				if( success )
				{
					var success = gio.navig.validate_coll_map( akey, cix, 0, 'do land' );
					if( !success ) {
						conadd( "Failed landing on " + akey + ", " + ix );
					}
				}else{
					conadd(	"No maps in collection ... perhaps are albums only ...\n" +
									"try to scroll to albums manually ... "							
					);
				}
			}else{
				conadd( 'Gamion parser failed.' );
			}

			if( !success ) ggp.do_display_curr_board( true );
			ggp.unlock_controls();
			gio.input_mode = '';
			return;







		}else if( imode === 'map' ) {

			gio.data_io.add_map_text_and_land( custom_text );
			ggp.unlock_controls();
			gio.input_mode='';



		}else{

			throw "Unknown editor mode"; //TODM improve
		}

	};	///	Multipurpose editor finalization subroutine



})(jQuery);

(function( $ ){ 	var tp	=	$.fn.tp$  =  $.fn.tp$ || {};	
					var gio	=	tp.gio    =  tp.gio   || {};
					var med	=	gio.map_editors;



	med.invoke_login=function(){

		var login = gio.domwrap.popups.login;
		gio.gui.procs.lock_controls('Pulling login ... ');

		login.show();
		med.login_closing_button.reset({	c:{	gui:{style:{wrapper:{display:'block'}}}}});

		$(login.popup_el).find('input')[0].focus();
		$(login.popup_el).find('a')[1].href = gio.session.server.message.craft_zone_url;
		$(login.popup_el).children('div')[0].innerHTML = '';

	};


	med.send_login_request = function(){

		var login = gio.domwrap.popups.login;
		var alias_el = $(login.popup_el).find('input')[0];
		var password_el = $(login.popup_el).find('input')[1];
		var message_div = $(login.popup_el).children('div')[0];

		$.ajax({
			type: 'POST',
			url: gio.session.server.message.login_url,
			async : true,
			cache : false,
			data : {	users : { email : alias_el.value, password : password_el.value },
						authenticity_token : gio.session.server.message.form_authenticity_token,
						commit : 'Login'
			},
			success: function(data){
					if( data.status == 'success' ){
						message_div.innerHTML = 'Login success'
						gio.session.server.message.loggedin = true;
						gio.session.server.refresh_state('refresh gui'); //TODm not dry, must update ..server.message in one ajax call
						med.hide_login();
						alias_el.value = '';
						password_el.value = '';
					}else{
						message_div.innerHTML = data.message || 'Invalid server response';
					}
               }, 
			dataType: 'json'
		});
	};


	med.send_logout_request = function(){
		$.ajax({
			type: 'POST',
			url: gio.session.server.message.logout_url,
			async : true,
			cache : false,
			data : {},
			success: function(data){
					if( data.status == 'success' ){
						gio.session.server.message.loggedin = false;
						gio.session.server.refresh_state('reset gui');
					}else{
						gio.cons_add( data.message || 'Invalid server response' );
					}
               }, 
			dataType: 'json'
		});
	};
})(jQuery);

(function( $ ){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var gstyle	=  gio.config.style;
					var ggp		=  gio.gui.procs;
					var gdr		=  gio.domwrap.regions;
					var gde		=  gio.domwrap.elems;

					var ads		=  gio.config.advertisement;
	ggp.adjustDispositionsByBrowserWindow=function(gm){

		var landscape = ( window.innerHeight * 13 /10 ) <  window.innerWidth; 

		set_lefttop_by_landscape(landscape); 

		var gs		= gio.getgs();
		var gm		= gs.gm;
		var dress	= gm.dresses_wrap.chosen_dress;
		var droot	= gdr.droot;

		var scrollTop			= Math.max($(window).scrollTop() - 
									gstyle.captions.height-gstyle.top_navig.height, 10);

		var chaser_top;
		var chaser_width		= gstyle.controls.boardWidth;
		var playboard_height	= gm.dim_max_height	+2*dress.tile.height;
		var playboard_width		= gm.dim_max_width	+2*dress.tile.width;
		playboard_width			= Math.max(gstyle.playboard.widthMin, playboard_width);
		var play_area_width		= playboard_width;
		var play_area_height	= playboard_height + dress.tile.height;

		var adstyle				= ads.enabled && dress.features !== 'kids' ? ads.divs.wrap.style : null; //TODM 'kids' is hard coded. Not good. Ad is a policy. Kids-zone myst have subpolicy, not controlled by dress at all.
		var ad_area_width		= ads.enabled ? ads.distanceFromGame + parseInt(adstyle.width) : 0;
		gm.board.style.width = playboard_width +'px';
		gm.board.style.height = playboard_height +'px';

		if(landscape){
			gm.board.style.left				=	chaser_width+'px';
			gdr.dtopcenter.style.left		=	chaser_width+'px';
			gdr.dsubtop.style.left			=	chaser_width+'px';
			droot.style.width				=	play_area_width + chaser_width + ad_area_width + 'px';
			chaser_top						=	scrollTop - 
												gstyle.controls.STATUS_LINE_HEIGHT * 
												gstyle.controls.chaser_upshift_lim;
			if(ads.enabled)	adstyle.left	=	play_area_width + chaser_width +
												ads.distanceFromGame +'px';
			shuffles_consoles(true);
		}else{
			gm.board.style.left				=	'0px';
			gdr.dtopcenter.style.left		=	'0px';
			gdr.dsubtop.style.left			=	'0px';
			droot.style.width				=	play_area_width + ad_area_width + 'px';
			chaser_top						=	playboard_height;
			if(ads.enabled) adstyle.left	=	play_area_width + ads.distanceFromGame +'px';
			shuffles_consoles(false);
		}

		$(gde.chaser).css('top',chaser_top);
		w = chaser_top;
		w +=  gstyle.controls.STATUS_LINE_PERIOD * 8 + 10;
		ww=playboard_height; //gm.dim_max_height+3*gm.game.tile.height; 
		if( playboard_height > w ) w=playboard_height;
		var cons_stl =  gde.con_div.style;
		if(landscape){
			cons_stl.top		= play_area_height+'px';
			cons_stl.left		= chaser_width+'px';
			cons_stl.width		= play_area_width + 'px';
		}else{
			var console_width			= play_area_width-chaser_width;
			if(console_width < 10 )		console_width = 10;
			cons_stl.top		= play_area_height+'px';
			cons_stl.left		= chaser_width+'px';
			cons_stl.width		= console_width + 'px';
		}
	}
	var shuffles_consoles = function(landscape){
		var ccc			= gio.config.style.console;
		var gheight		= ccc.generic.height;
		var plheight	= ccc.playvigation.height;
		var slheight	= ccc.solver.height;
		var hgap		= ccc.horizontal_gap;
		var vgap		= ccc.vertical_gap;

		var plstyle		= gde.playvig_cons.style;
		var gstyle		= gde.con_div_child.style;
		var slstyle		= gde.solver_cons.style;
		var debstyle	= gde.debug_cons.style;


		var gm			= gio.getgs().gm;
		var solver_states_are_on =	!gm.solver.inactive_bf || 
									!!gm.solver.browser_mode;
		var solver_height		= solver_states_are_on ? slheight : 0;

		if(landscape){
			plstyle.left		=	'0px';  
			plstyle.top			=	'0px';  
			gstyle.left			=	hgap + ccc.playvigation.width + 'px';
			gstyle.top			=	'0px';
			slstyle.left		=	'0px';  
			slstyle.top			=	vgap + plheight + 'px';
			slstyle.width		=	ccc.solver.width + 'px';

			var total_height	=	plheight + solver_height + vgap * 2;
			if(gio.debug){
				debstyle.left	=	'0px';
				debstyle.top	=	total_height + 'px';
				total_height	+=	ccc.debug.height + vgap;
			}	
		}else{
			plstyle.left		=	'0px';
			plstyle.top			=	'0px';
			gstyle.left			=	'0px';
			gstyle.top			=	vgap + plheight + 'px';
			slstyle.left		=	'0px';  
			slstyle.top			=	plheight + vgap +
									gheight + vgap + 'px';
			slstyle.width		=	ccc.generic.width + 'px';
			var total_height	=	plheight + solver_height +
									gheight + vgap * 4;
			if(gio.debug){
				debstyle.left	=	'0px';
				debstyle.top	=	total_height + 'px';
				total_height	+=	ccc.debug + vgap;
			}	
		}
		gde.con_div.style.height = total_height + 'px';
	};
	var set_lefttop_by_landscape=function(landscape){
			var ss = gdr.dtopleft.style;
			if(landscape){
				ss.display='block';
				var conf	= gio.config.style.top_left_pane;
				ss.left		= conf.left+'px';
				ss.top		= conf.top+'px';
				ss.height	= conf.height+'px';
			}else{
				ss.display='none';
			}
	};

})(jQuery);


( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var gstyle	=  gio.config.style;
					var gde		=  gio.domwrap.elems;
					var ggp		=  gio.gui.procs;
					var deb		=  function ( string ) { if( gio.debug ) gio.cons_add( "GUI Procs: " + string ); };			






	var unlock_popup=function(){gio.gui.modes.common_popup_shown=true;};
	ggp.draw_status_and_scene = function ( gm ) {

		var gs = gio.getgs();
		if( !gm || !gs.gm || gs.gm !== gm )
		{
			gio.draw_scene();
			gio.draw_status();
		}
	};
	ggp.virtual_reselect_dress = function ( gm, dkey )
	{
		if( !dkey ) return;
		var selected_ix = -1;
		var arr = gm.dresses_wrap.arr;
		for( var ix = 0, len = arr.length; ix < len; ix ++ )
		{
			var wrap = arr[ ix ];
			if( dkey === wrap.dress.key )
			{
				selected_ix = ix;
				break;
			}
		}
		if( selected_ix < 0 ) return;

		gm.dresses_wrap.chosen_ix = selected_ix;
		gm.dresses_wrap.chosen_dress = arr[ selected_ix ].dress; //TODM redundant. Poor design. Remove.
	};
	ggp.inject_path_from_text = function( path_text, do_messagify, do_stay_at_end ) {

		ggp.lock_controls('Validating generated playpath ...');
		var validator_msg = gio.navig.in_session.round.text2round( path_text );
		if(validator_msg) gio.cons_add(validator_msg);
		if( !do_stay_at_end ) {
			if( do_messagify ) {
				gio.navig.in_session.round.do_back_forw_start_record(gio.getgs().round, 'to beginning');
			}else{
				gio.gui.procs.do_manage_round(null,'to beginning');
			}
		}
		ggp.draw_status_and_scene();
		ggp.unlock_controls();
	};
	ggp.do_display_curr_board = function ( do_display ) {
		var gs = gio.getgs();
		var board = gs.board;
		if( board )
		{
			var mess	=  do_display ? 'Displays' : 'Hides';
			mess		+= ' board. a,c,m = ' + gs.akey + ', ' + gs.cix + ', ' + gs.mix;
			deb( mess );
			board.style.display = do_display ? 'block' : 'none';
		}
	};
	gio.gui.modes.common_popup_shown=true;
	ggp.prolong_common_popup=function(){

		if(gio.common_popup.isVisible()){
			gio.gui.modes.common_popup_shown=false;
			setTimeout(unlock_popup,1000);
		}
	};
	ggp.lock_controls=function(msg){
		if(!gio.gui.modes.controls_locked){
			gio.domwrap.popups.modal_message_popup.show({innerHTML: (msg || '')});
			gio.gui.modes.controls_locked=true;
		}
	};
	ggp.unlock_controls=function(){
		gio.gui.modes.controls_locked=false;
		gio.domwrap.popups.modal_message_popup.hide();
	};
	ggp.get_master_title_from_session_state = function () {
		var gs = gio.getgs();
		return ggp.calculate_game_titile_from_names(
				gs.gm.game.nam, gs.playalb.album_name );
	};
	ggp.calculate_game_titile_from_names = function( game_name, album_name ) {
		var w = game_name;
		var title = w || '';
		if(album_name){
			title = ( w ? w + '. ' : '') + album_name;
			if(w) title+= '.';
		}
		return title;
	};




	ggp.visualize_collection_titles = function( collection, collections ) {

			gio.domwrap.headers.collection_select_el.reset(
						{r:{
							options				:collections
						},
						c:{	dont_reset_styles	:false,
							choice_ix			:collections.ix
						}}
			);

			gio.domwrap.headers.map_select_el.reset(
					{r:{
						options				:collection.maps
					},
					c:{	dont_reset_styles	:false,
						choice_ix			:collection.map_ix
					}}
			);

			var state = gio.session.state;
			gio.domwrap.headers.title_select_el.reset( {c:{choice_ix:state.album_ix}} ); // TODm do we need to shake options?:

			return true;
	};











})();

(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var ggp		=  gio.gui.procs;
					var gsp		=  gio.session.procs;
	var skip_inactive_colony = function( gm, direction )
	{
			if(gm.actor_cols.length < 1) return;
			var len=gm.cols.length;
			var cid=gm.acting_col.id;

			for(var i=0; i<len; i++)
			{
				if(gm.cols[cid].activity.active)
				{
					gm.acting_col = gm.cols[cid];
					return;
				}
				if(  direction === 'left' || direction === 'up'   ) 
				{
					cid=(cid+len-1)%len;
				}else{
					cid=(cid+1)%len;
				}
			}
	};

	ggp.do_one_scroll_of_colony = function( pointer )
	{
		var gs=gio.getgs();
		if(!gs.col) return; //TODm rid
		var gm=gs.gm;
		var cid=gs.cid;

		var len=gm.cols.length;

		if(  pointer === 'left' || pointer === 'up'   ){
			cid=(cid+len-1)%len;
		}else{
			cid=(cid+1)%len;
		}

		gm.acting_col = gm.cols[cid];
		skip_inactive_colony( gm, pointer );
	};
	ggp.do_one_scroll_of_unit_in_colony = function( pointer )
	{
			var gs = gio.getgs();
			var units = gs.col.units;
			var ulen = units.length;

			var direction = isNaN(pointer) ? pointer : 'down';
			var uix=gs.unit.ix;	

			if(direction==='left' || direction==='up'){
				uix=(ulen*2+uix-1)%ulen;
			}else{
				uix=(ulen*2+uix+1)%ulen;
			}
			gs.col.acting_unit = units[uix];
			ggp.draw_status_and_scene();
			return false;
	};
	ggp.scroll_till_valid_album = function(  aix, do_land  ) {
		ggp.lock_controls( 'Scrolling to landable album ... ' );
		var success = gsp.scroll_till_landable_album( aix, do_land );
		ggp.unlock_controls();
		return success;
	};
	ggp.scroll_till_valid_coll = function( start_cix, collections, download_external_if_first, do_land ) {
		ggp.lock_controls( 'Scrolling to landable coll ... ' );
		var success = gsp.scroll_till_landable_coll( start_cix, collections, download_external_if_first, do_land );
		ggp.unlock_controls();
		return success;
	};
	


})();


( function () {	 	var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var ceach		=  tp.core.each;
					var cmd			=  gio.core.def.map_format;
					var str2mline	=  tp.core.str2mline;
					var conadd		= function ( string ) { gio.cons_add( "Decodes Gamion: " + string ); };			
					var deb			= function ( string ) { if( gio.debug) conadd( string ); };			
					var trim_match	= cmd.trim_match = /^\s*|\s*$/g;
					var reg_ex_r	= /\r/g;

					var conf		={ 
										backward_title_range : 40
									 };
					var _ckv_match					= /^(:::)([^=.][^=]*)(?:=\s*(\S.*\S|\S)){0,1}\s*$/i;
					var colorbanKV					= cmd.colorbanKV = function(line){ return line.match(_ckv_match) || []; };
					var comment_escape_char			= /^;/;
					var file_lines_split_re			= /\r\n|\r|\n/g;
					var sokoban_board_line_match	=/^( |-)*(#|\*|B).*(#|\*|B)(\s|-)*(?:<br>)*$/;
	cmd.decode = function ( colln ) {
		var MAP_LOOKUP	= 0;	// Map-ended		zone	is entered.
		var BOARD		= 1;	// Map's board		zone	is entered.
		var AFTER_BOARD	= 2;	// Map's postboard	zone	is entered.

		var script				= colln.script;
		var parsed				= script.parsed;
		parsed.lines_number		= parsed.lines_number || 0;
		var area_flag					= MAP_LOOKUP;					// file is entered or map completed
		var rescan_bflag				= !!parsed.lines_number;
		var parsed_file_header_bflag	= !!parsed.file_header;
		var cbzone_bf					= false;


		var map_ix = -1;
		var map_key = '';
		var maps_text = script.source_text;

		var flines = script.flines = maps_text.split( file_lines_split_re );  //TODM wastes performance when appending text to collection; don't do split again;
		var trimmed_lines = script.trimmed_lines = [];
		tp.core.each( flines, function( ix, val ) {
			trimmed_lines[ ix ] = '';
		}); 

		


		if( rescan_bflag ) {

			map_ix = colln.maps.length - 1;
			var ww = '.. rescan began for map ix ' + ( map_ix + 1 );
			colln.maps_loaded += ww;
			deb( ww );

		}else{
			colln.maps = [];
			colln.maps_ref = {};
			map_ix = -1;
			colln.map_ix = 0;
			colln.maps_loaded += '..decoding began..';
		}
		script.proc.jwon	= cmd.CreateJwon( colln );
		var jwon			= script.proc.jwon;	
		var parse_jwon		= jwon.parse;
		var ww = gio.def.procs.detect_ownhost_url( colln ); //TODM slow. make test "mandatory" and logged.
		if( !ww && !jwon.detect_format( maps_text ) ) {
			jwon.parser_disabled_bf = true;
			deb( "Jwon format missed ... " );
		}
		if( colln.ref.jwon === 'yes' )	jwon.parser_disabled_bf = false;
		if( colln.ref.jwon === 'no' )	jwon.parser_disabled_bf = true;
		deb( 'Jwon parser = ' +	(!jwon.parser_disabled_bf) );
		var postboard = { start : parsed.lines_number, lim : -1 };

		var map = null;
		var raw_board_lines;
		var raw_map;
		var line = '';
		var backward_soko_title = '';
		var conf_bt = conf.backward_title_range;
		for( var yy = parsed.lines_number; yy < flines.length; yy++ ) {

			var master_line		= flines[yy] = flines[yy].replace(reg_ex_r, '');
			trimmed_lines[yy]	= master_line.replace( trim_match, '' );

			if( !jwon.parser_disabled_bf && parse_jwon( yy ) ) {
				postboard.lim = -1;
				continue;
			}
			var map_fin_raised		= false;
			var header_raised		= false;
			var board_line_raised	= false;
			var map_init_raised		= false;
			var cb_match = colorbanKV( master_line );
			if( cb_match[2] ) {
				var cb_detector = cb_match[2];
				if(	cb_detector === 'map' ) {

					if( !parsed_file_header_bflag )				header_raised = true;
					if( cbzone_bf || area_flag !== MAP_LOOKUP )	map_fin_raised = true;
					if( postboard.lim > -1 ) postboard.lim = yy;

					cbzone_bf = true;
					map_init_raised = true;
					area_flag = BOARD;
					var map_key = cb_match[3] || '';


				}else if( cbzone_bf ) { 

					if( cb_detector === 'map_end' ) {

						map_fin_raised = true;
						if( postboard.lim > -1 ) postboard.lim = yy;
						area_flag = MAP_LOOKUP;
						cbzone_bf = false;

					}else if( cb_detector === 'board_end' ) {
						area_flag = AFTER_BOARD;
						continue;
					}else if(cb_detector === 'akey'){
						if( area_flag === BOARD ) map.bundled__ref.akey = cb_match[3];
						continue;

					}else if(cb_detector === 'collection_index'){
						if( area_flag === BOARD ) {
							var ww = parseInt( cb_match[3] );
							map.bundled__ref.coll_ref = isNaN( ww ) ? '' : ww;
						}
						continue;

					}else if(cb_detector === 'map_index'){
						if( area_flag === BOARD ) {
							var ww = parseInt( cb_match[3] );
							map.bundled__ref.map_ref = isNaN( ww ) ? '' : ww;
						}
						continue;

					}else if( cb_detector === 'mkey' ) {
						if( area_flag === BOARD ) map.bundled__ref.map_ref = cb_match[3];
						continue;

					}else if( cb_detector === 'ckey' ) {
						if( area_flag === BOARD ) map.bundled__ref.coll_ref = cb_match[3];
						continue;


					}else if( cb_detector === 'context_akey' ){

						if( area_flag === BOARD ) {
							var ww = gio.def.procs.derive_album( cb_match[3] );
							if( ww ) {
								map.game = ww.dgame;
							}else{
								var ww = "Failed to find dressed game context " +
									cb_match[3]+ "\nfor map "+map.ix;
								colln.maps_loaded += ww;
								gio.cons( ww );
								return; //failed collection
							}
						}
						continue;
					}


				}//.. else cbzone_bf

			}else if( cbzone_bf ) {

				if( area_flag === BOARD ) board_line_raised=true;

			}else{

				var soko_board_line = sokoban_board_line_match.test(master_line);
				if(	soko_board_line ){
					if(area_flag !== BOARD ){
						if( !parsed_file_header_bflag ) header_raised = true;

						if( area_flag !== MAP_LOOKUP ) map_fin_raised = true;

						map_init_raised = true;
						area_flag = BOARD;
						var map_key = '';

					}
					board_line_raised=true;

				}else{
					if(area_flag === BOARD ){
						area_flag = AFTER_BOARD;
					}
				}
			}



			if( header_raised ) {
				cmd.finalize_file_header( postboard, colln );
				if( colln.script.metag.galfinition.gafion ) {
					deb( 'Ignoring mapfinitions in gafion' );
					area_flag = MAP_LOOKUP;
					break;
				}
				parsed_file_header_bflag = true;
			}


			if( map_fin_raised ) {
					var ww = cmd.finalize_map( map, postboard );
					if( ww ) {
						conadd( ww );
						colln.maps_loaded += ww;
						if(rescan_bflag) break;
						return;
					}
			}


			if( map_init_raised ) {
					map_ix++;
					map =
					{
						ix : map_ix,
						key : map_key,
						game : colln.dgame,
						collection : colln,
						skin:{},
						parsed : { backward_soko_title : str2mline( backward_soko_title ) },
						script : {	cbzone_bf : !!cbzone_bf,
									color2breed : !!cbzone_bf && cmd.color2breed,
									breed2color : !!cbzone_bf && cmd.breed2color,
									decoder_table : cbzone_bf ? cmd.colorban_decoder_table : cmd.sokoban_decoder_table,
									flines : flines,
									first_map_line : ( postboard.lim > -1 ? postboard.lim : yy ), 
									raw_board_lines : []
						},

						bundled__ref : {},
						units : [],
						dynamic_units : [],
						locs : [],
						size : [2,2,2],
						loc2lid : [],
						pos :	{	lid2uid : [],
									tops	: [],
									uid2lid : [], 
									uid2loc : []
								},
						acting_col : null,

						cols:[],
						actor_cols : [],
						dynamic_cols : [],
						objective : { target_units : [], baton_units : [] },
						metrics : { recalculated : { text : '' } }
					};
					map_key = '';
					raw_board_lines = map.script.raw_board_lines;
				}
			if(board_line_raised) raw_board_lines.push(flines[yy]);


			if( map_fin_raised || header_raised ){
					postboard.lim = -1;

					backward_soko_title = '';
					continue;
			}
			if( area_flag !== BOARD ) {
				if( postboard.lim === -1) {
					postboard.lim = yy + 1;
					postboard.start = yy;
				}

				if(	!cbzone_bf ) {
					if( trimmed_lines[yy].length > 0 ) {
						backward_soko_title = trimmed_lines[yy].replace( comment_escape_char, '' );
						postboard.lim = yy;
					}else if( postboard.lim + conf_bt < yy ) {
						postboard.lim = yy + 1;	
						backward_soko_title = '';
					}
				}
			}
		}


		var in_the_middle_of_the_map_bflag = area_flag !== MAP_LOOKUP;
		var in_the_middle_of_the_soko_board_bflag = area_flag === BOARD;

		cmd.finalize_collection(
				colln,
				rescan_bflag,
				map,
				postboard,
				in_the_middle_of_the_map_bflag,
				in_the_middle_of_the_soko_board_bflag
		);

	};





})();



(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;
	var breed2color = cmd.breed2color={};
	var color2breed = cmd.color2breed={};
	cmd.playpath	={	
						DIRECTION : {d : 2, u : -2, l : -1, r : 1},

						TOKEN_SEPARATOR : '|',
						SUBTOKEN_SEPARATOR : '.'
					};	

	cmd.map_sugar	=
	{
		GROUND : '-',
		WALL : '#',
		TARGET : '.',
		TARGET_REGEX : /0/g
	};

	cmd.sugar_soko_mapcut =
	{
		'h0.x' : '&',
		'h0.X' : '%',
		'x.h0' : '&',
		'X.h0' : '%',

		'0X'   : '*',
		'0x'   : '+',
		'X0'   : '*',
		'x0'   : '+',

		'x'    : '@',
		'X'    : '$',

		'.h0'  : '!',
		'h0.'  : '!'
	}
	cmd.sokoban_decoder_table = {

		'u':'wall_a', //extra
		'v':'wall_b', //extra


		'@':'hero_x',
		'p':'hero_x',

		'+':['target_x','hero_x'],
		'P':['target_x','hero_x'],
		'&':['htarget_x','hero_x'],


		'$':'box_x',
		'b':'box_x',
		'*':['target_x','box_x'],
		'%':['htarget_x','box_x'],
		'B':['target_x','box_x'],

		'.':'target_x',
		'!':'htarget_x',
		'o':'target_x',
		
		' ':'ground_x',
		'_':'ground_x'
	};

	cmd.sokoban_decoder_table [ cmd.map_sugar.WALL ] = 'wall_x';
	cmd.sokoban_decoder_table [ cmd.map_sugar.GROUND ] = 'ground_x';
	cmd.colorban_decoder_table = {
		'_':'ground_x',
		'$':'box_x',
		'@':'hero_x',
		'.':'target_x',
		'!':'htarget_x',

		'+':['target_x','hero_x'],
		'*':['target_x','box_x'],
		'&':['htarget_x','hero_x'],
		'%':['htarget_x','box_x']
	};

	cmd.colorban_decoder_table [ cmd.map_sugar.WALL ] = 'wall_x';
	cmd.colorban_decoder_table [ cmd.map_sugar.GROUND ] = 'ground_x';
	cmd.colorban_encoder_table={};
	cmd.colorban_encoder_cotable={};
	cmd.finalize_colorban_decoder_table = function( game ) {

		var cnames = game.cnames;
		for(var ii=0; ii<game.colors.length; ii++){

			var tt = cmd.colorban_decoder_table;
			var et = cmd.colorban_encoder_table;
			var ct = cmd.colorban_encoder_cotable;
			var cc = game.colors[ ii ];
			var msw = game.wall_map_symbols[ ii ];
			var kkk = cc;
			var vvv = cnames.hero[ii]; 
			tt[kkk] = vvv;    et[vvv] = kkk;
			breed2color[ tt[ cc ] ] = cc;
			color2breed[ cc ] = tt[ cc ];
			var kkk = cc.toUpperCase();
			var vvv = cnames.box[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;

			var kkk = '' + ii;
			var vvv = cnames.target[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//0,1,2,3 --- for target_x, target_a, target_b ...

			var kkk = 'h' + ii;
			var vvv = cnames.htarget[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//h0,h1,h2,h3 --- for htarget_x, htarget_a, htarget_b ...

			var kkk = msw;
			var vvv = cnames.wall[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//y,j,k,l,  - walls
			ct[vvv] = kkk;
			if( ii === 0 )
			{
				et[vvv] = cmd.map_sugar.WALL;
				ct[vvv] = cmd.map_sugar.WALL;
			}



			var kkk = msw.toUpperCase();
			var vvv = cnames.ground[ ii ]; 
			tt[kkk] = vvv;    et[vvv] = kkk;			//Y,J,K, ... 1J,..2K, - grounds 
			ct[vvv] = kkk;
			if( ii === 0 )
			{
				et[vvv] = cmd.map_sugar.GROUND;
				ct[vvv] = cmd.map_sugar.GROUND;
			}
			var vvv = cnames.hero[ii]; 
			var co_vvv = cnames.htarget[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			var vvv = cnames.box[ii]; 
			var co_vvv = cnames.target[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			var vvv = cnames.target[ii]; 
			var co_vvv = cnames.box[ ii ]; 
			ct[vvv] = et[co_vvv]; 

			var vvv = cnames.htarget[ii]; 
			var co_vvv = cnames.hero[ ii ]; 
			ct[vvv] = et[co_vvv]; 


		}

	}; 	// \\// Configures colorban decoder table. Part I and II.



})();



( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};

					var core	=  tp.core;
					var ceach	=  core.each;
					var cmd		=  gio.core.def.map_format;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var crpaste	=  core.rpaste;

					var deb		=  gio.debly;
					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var do_deb	=  gio.debug;
					var dodeb	= function ( string ) { if( do_deb ) gio.cons_add( "FileHeader: " + string ); };


					var macro_def_match				=/^(\S+)=(.+)$/;
					var linef						=/\\n/g;
					var macros_flag_match			=/^::\s*Macros/i;
					var macros_flag_stop			=/^::\s+/i;
	cmd.finalize_file_header = function( postboard, colln ) {


		colln.script.proc.jwon.finalize();

		var flines = colln.script.flines;
		var pfh = colln.script.parsed.file_header =
		{		macros : {},
				raw : {}
		};
		pfh.raw.start	= postboard.start;
		pfh.raw.end		= postboard.lim === -1 ? 0 : postboard.lim - 1;
		var macros		= pfh.macros;
		var macros_area	= false;
		for( var master_y = postboard.start; master_y < postboard.lim; master_y++ ) {

			var master_line = flines[ master_y ];
			if(macros_flag_match.test(master_line)){
				macros_area=true;
				continue;
			}
			if(macros_flag_stop.test(master_line)){
				macros_area=false;
				continue;
			}

			if(macros_area){
				var match=master_line.match(macro_def_match);
				if(match){ // && match.length===2){
					var mkey = match[1].toLowerCase();
					macros[mkey] =
					{ 		regex	: new RegExp( '<#' + mkey + '#/>', 'gi' ),
							val		: match[2].replace(linef,"\n") 
					};
				}			
			}
		}; /// builds macros-definitions






		var jwon_heap = colln.script.heap_json;
		cpaste( colln.credits, jwon_heap.credits );
		var ww = colln.script.metag;
		var galfin	= ww.galfinition;
		var mapfin	= ww.mapfinition;
		if( jwon_heap.interact && !jwon_heap.games && !jwon_heap.albums && !jwon_heap.collection ) {
			var ww = jwon_heap;
			jwon_heap = { games : { game : ww }, albums : { game : {} }, collection : { akey : 'game' } };
		}
		var ww = core.get_first_or_null( jwon_heap.games );
		var estimated_master_gkey = ww && ww.key;
		var ww = core.get_first_or_null( jwon_heap.albums );
		var estimated_master_akey = (ww && ww.key) || estimated_master_gkey ;
		if( jwon_heap.games || jwon_heap.albums ) {
			deb( 'Galfinition detected.');

			var w_dg = gdef.games;
			var w_da = gdef.albums;
			gdp.normalize_album_defs( jwon_heap.albums );

			if( galfin.overdefine )
			{	//:
				deb( 'Pastes overridingly albums or games from gamion.');
				crpaste ( w_da, jwon_heap.albums );
				crpaste ( w_dg, jwon_heap.games );
				ceach( jwon_heap.games, function( gkey, game ) {
					gdp.derive_game( gkey, true );
				});
			}else{
				deb( 'Pastes preventively albums or games from gamion.');
				crpaste ( w_da, crpaste( {}, jwon_heap.albums, w_da ) );
				crpaste ( w_dg, crpaste( {}, jwon_heap.games, w_dg ) );
			}
			ceach( jwon_heap.albums, function( albkey, walbum )
			{
				var ww = walbum.ref;
				ww.link.link				= colln.ref.link.link;
				ww.list.listify_on_top		= galfin.listify_on_top;
				ww.list.penetrate_asingle	= galfin.penetrate_asingle;
				if( colln.ref.db ) ww.db	= true;
				if( galfin.derive_at_download )
				{
					deb( 'Derives album ' + albkey + ' from gamion.');
					gdp.derive_album( albkey, ( galfin.overdefine ? 'overdefine' : '' ) );
				}
			});
			colln.script.state.definitions_processed = true;
		}

		

		var do_albumize = ! ( galfin.gafion || ( mapfin.passive && colln.state.shellified ) );

		if( do_albumize ) {

			if( !jwon_heap.collection ) {
				if( colln.state.shellified ) {
					do_albumize = false;
				}else{
					var akey_probe =	mapfin.akey_master ||
										estimated_master_akey ||
										mapfin.akey_advice ||
										gdef.default_album_key;
					var hcoll = clonem( gdef.templates.def.coll );	
				}
			}else{

				var hcoll = jwon_heap.collection;
				gdp.normalize_cseed( hcoll );
				colln.credits = clonem( colln.credits, hcoll.credits );

				var akey_probe =	mapfin.akey_master ||
									hcoll.akey ||
									hcoll.ref.env.akey ||
									estimated_master_akey ||
									mapfin.akey_advice ||
									colln.ref.list.akey ||
									gdef.procs.get_preferred_album_def().key ||
									gdef.default_album_key;

				if( colln.ref.list.akey === akey_probe ) {
					deb (	'Skipping (re)albumizing of collection. akey_probe = ' + akey_probe +
							' is equal to ' + colln.ref.list.akey );
					do_albumize = false;
				}
				var wa = gio.session.stemmed_albums[ akey_probe ] || gdef.albums[ akey_probe ];
				wa.ref.list.listify_on_top = true;


			}
		}
		if( do_albumize ) {

				var w_source	= colln.ref.link.link && ( 'from gamion link ' +  colln.ref.link.link );
				w_source		= w_source || 'possibly from text. ';
				dodeb(	'Attaches coll to akey = "' + akey_probe + '" ' + w_source );
				gdp.normalize_cseed				( hcoll );
				hcoll.ckey						= colln.ckey;					
				hcoll.ref.link					= clonem( colln.ref.link );
				hcoll.ref.already_downloaded	= true;
				hcoll.ref.list.chosen			= hcoll.ref.list.chosen || mapfin.chosen;
				hcoll.credits					= clonem( colln.credits, jwon_heap.credits, hcoll.credits );
				hcoll.map_title_source			= hcoll.map_title_source || colln.map_title_source;
				var w_album						= gdp.derive_album ( akey_probe, hcoll ); // TODO error check and // TODM aways false: why? , meg.preserve_GUI_state ); 
				var wcoll						= w_album.collections[ w_album.collections.length -1 ];

				gdp.paste_coll_to_from			( colln, wcoll );

		} /// Collection derives album if not done, 


		core.tooltipify( colln, "Collection" );
		gdp.assembly_coll_title( colln );
		return;

	};///	Finalizes_file_header





})();



( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var clonem	=  core.clone_many;
					var propertify		=  core.propertify;
					var cmd				=  gio.core.def.map_format;
					var str2mline		=  core.str2mline;
					var tooltipify_data	=  core.tooltipify_data;


					var empty_match					= /^\s*$/g;
					var macro_match					= /<#(.*)#\/>/g;
					var multiplayer_match			= /^:::multiplayer=\s*(\S*)\s*$/i;
					var _get_malformatted_author	= /^\s*Author\s*(?::|=)\s*(\S(?:.*\S|\S)*)\s*$/i;
					var _get_malformatted_title		= /^\s*Title\s*(?::|=)\s*(\S(?:\S.*\S|\S)*)\s*$/i;
					var _kvsoko_match				= /^(;)\s*(\S*[^\t :=])\s*(?:\s|=|:)\s*([^\t :=](?:.*\S|\S)*)\s*$/;
	cmd.finalize_map = function( map, postboard )
	{
		map.load				= 'invalid';

		var master_y;
		var colorbanKV			= cmd.colorbanKV;
		var script				= map.script;
		var cbzone_bf			= script.cbzone_bf;
		var collection			= map.collection;
		var parsed				= map.parsed;

		var flines				= collection.script.flines;
		var trimmed_lines		= collection.script.trimmed_lines;

		var parsed_file_header	= collection.script.parsed.file_header;
		var rbl__own			= script.raw_board_lines;

		script.last_map_line	= postboard.lim-1;
		var www	= '';
		var ww	= script.last_map_line;
		for( master_y = script.first_map_line; master_y <= ww; master_y++ ) {
			www += flines[master_y] + "\n";
		}
		script.raw_map = www;
		var ww_b = '';
		for(var yy=0; yy < rbl__own.length; yy++){
			ww_b += rbl__own[yy] + "\n";
		}
		script.raw_board = ww_b;
		var w_r		= map.bundled__ref;
		var w_cref	= w_r.coll_ref;
		var ref_alb	= w_r.akey;
		if( !ref_alb || !(w_cref || w_cref === 0) ) {
			
			var map__eff = map;

		}else{
			var map_ref		= w_r.map_ref;
			var coll__eff	= gio.navig.validate_coll_map( ref_alb, w_cref, map_ref );
			if( !coll__eff ) {
				return	'Failed download referred map: ref_alb = ' + ref_alb + 
						' w_cref=' + w_cref + ' map_ref=' + map_ref;
			}

			var map__eff = ( typeof map_ref === 'string' ) ? coll__eff.maps_ref[ map_ref ] : coll__eff.maps[ map_ref ];
			if( !map__eff ){
				return	'Map with ref ' + map_ref + ' does not exist' + "\n" +
						'Failed download referred map: ref_alb = ' + ref_alb + 
						' w_cref=' + w_cref;
			}
			script.data_source_map = map__eff.script.data_source_map || map__eff;

			map.data_source_coll	= coll__eff;
			map.data_source_coll_credits = clonem( coll__eff.credits, map__eff.credits );			

		}
		map.coll__eff		= map__eff.coll__eff || map__eff.collection;
		var dtable			= map__eff.script.decoder_table;
		var rbl__eff		= clonem( map__eff.script.raw_board_lines );			
		if( !rbl__eff.length ) return 'Empty map`s board. Map ix=' + map.ix;
		var playpath_tray	= { pp : null, cbflag : false, map : map, playpaths : [], title : '' };
		var dress_tray	= {	dr : null, zoneon_flag : false,
							counter : 0, dresses : {}, map : map
						  };
		var macrosed_postboard = ''; 
		for( master_y = postboard.start; master_y<postboard.lim; master_y++ ) {
			var master_line			= flines[ master_y ]; 
			var master_line_trimmed	= trimmed_lines[ master_y ];
			core.each(parsed_file_header.macros, function( nam, macro ){
				master_line = master_line.replace( macro.regex, macro.val );
			});
			macrosed_postboard += master_line + "\n";

			var pkey = colorbanKV(master_line);
			var pkey1 = pkey[1];
			var pkey2 = pkey[2];
			var pkey3 = pkey[3];
			if( cmd.extract_to_playpaths (
				playpath_tray,
				master_line_trimmed,
				pkey,
				cbzone_bf
			)) continue;


			try{
				if( cmd.extract_to_dresses (
					dress_tray,
					master_line_trimmed,
					pkey,
					master_line,
					dtable
				)) continue;
			}catch(err){
				return "Invalid dress format\n"+err;
			}


			if(cbzone_bf && pkey1){

				var lcasekey = pkey2.toLowerCase();
				pkey3 = str2mline( pkey3 );

				if(	pkey2==='multiplayer' ){
						if(isNaN(pkey3))return 'Invalid map settings. multiplayer='+pkey3;
						map.multiplayer=parseInt(pkey3);
				}
				if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
					propertify( parsed, 'credits', lcasekey, pkey3 );
					continue;
				}	
			}//if(cbzone_bf){




			if( !cbzone_bf ) {

				var soko_keys = master_line.match(_kvsoko_match) || [];
				var pkey3 = str2mline( soko_keys[3] );

				if( soko_keys[2] ) {
					var lcasekey = soko_keys[2].toLowerCase();
					if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
						propertify( parsed, 'credits', lcasekey, pkey3 );
						continue;
					}	
				}
				if( !parsed.credits || !parsed.credits.author ) {
					var match = master_line.match(_get_malformatted_author);
					propertify( parsed, 'credits', 'author', match && match[1] );
				}
				if( !parsed.credits || !parsed.credits.title ) {
					var match = master_line.match(_get_malformatted_title);
					propertify( parsed, 'credits', 'title', match && match[1] );
				}

			}
		} ///.. does loop through postboard

		if( playpath_tray.playpaths.length > 0 )	map.playpaths = playpath_tray.playpaths;
		if( dress_tray.counter )	map.dresses = dress_tray.dresses;
		map.parsed.macrosed_postboard = macrosed_postboard;

		map.key = map.key || 'map_' + map.ix;

		var ww_final_title = (parsed.credits && parsed.credits.title) || '';
		if(!cbzone_bf){
			if( !( collection.map_title_source === 'comment' && ww_final_title ) ){
				ww_final_title = parsed.backward_soko_title;
			}
		}	
		propertify( parsed, 'credits', 'title', ww_final_title );
		map.credits = map.credits || {};

		if( map.data_source_coll_credits ) {
			if( parsed.credits ) {


				map.credits = clonem( map.data_source_coll_credits );
				map.credits.credits = [ clonem( parsed.credits ) ];

			}else{
				map.credits = map.data_source_coll_credits;
			}
		}else if( parsed.credits ) {
				map.credits = clonem( parsed.credits );
		}


		if( !map.credits.title ) map.credits.title = 'Map ' + map.ix;
		map.title	=	core.dotify( map.credits.title, 50 );
		map.tooltip	=	core.dotify( map.credits.author, 200, 'Author: ', '. '  );
		map.tooltip	+=	core.dotify( map.credits.title, 200, 'Title: ', '. '  );
		map.tooltip	+=	'zcount: ' + map.ix + '.';
		cmd.parse_board_lines( rbl__eff, map, map__eff.script.cbzone_bf, dtable );
		map.size[1] = rbl__eff.length;
		var actors=0;
		ceach(map.actor_cols, function(dummy,col){
			actors +=col.units.length;
		});
		map.actors = actors;
		var obj = map.objective;
		obj.necessary = Math.min( obj.baton_units.length, obj.target_units.length );
		if( map.acting_col ) {
			map.load = 'parsed';
		}else{
			map.invalid_map_message = "no actor on the map";
		}
		collection.maps[ map.ix ]		= map;
		collection.maps_ref[ map.key ]	= map;


		return '';
	};/// FINALIZES MAP



})();



(function(){	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;





	cmd.finalize_collection=function(
				colln,
				rescan_bflag,
				map,
				postboard,
				in_the_middle_of_the_map_bflag,
				in_the_middle_of_the_soko_board_bflag
		){


		var flines = colln.script.flines;

		if(!rescan_bflag && !colln.script.parsed.file_header){
			cmd.finalize_file_header( postboard, colln );
		}


		if( in_the_middle_of_the_map_bflag ){
			if( !in_the_middle_of_the_soko_board_bflag) postboard.lim = flines.length;

			var w=cmd.finalize_map(map, postboard);
			if(w){
				colln.maps_loaded +=w;
				gio.cons(w);
				return; //failed collection
			}
		}




		if(colln.maps.length){
			if(!rescan_bflag) colln.map_ix=0; //default

			colln.script.parsed.lines_number = flines.length;
			colln.maps_loaded ='success';
			if(gio.debug)gio.cons(colln.dgame.nam+' maps decoder success');
		}else{

			var w='..no maps found in text';
			colln.maps_loaded +=w;
			if( !colln.script.metag.galfinition.gafion ) {
				gio.cons(w);
			}
		}
	};

})();




( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var cmd		=  gio.core.def.map_format;
					var sokoban_playpath_line_match	= /^( |\t)*(l|r|u|d|\[|\]|\*|[0-9])*(l|r|u|d)(l|r|u|d|\[|\]|\*|[0-9])*\s*$/i;
					var reg_ex_und = /_/g;		
	var grab_optpath = function ( pptt, pkey3, pkey2 )
	{
		var ww			= pkey3.split('.');
		var pp			= parseInt( ww[0] );
		var ii			= ww[1] ? parseInt( ww[1] ) : 0;
		var rr			= ww[2] ? parseInt( ww[2] ) : 0;
		pptt.optpath	= null;
		if( isNaN(pp) || isNaN(ii) || isNaN(rr) ) return;
		pptt.optpath = { p : pp, i : ii, r : rr, estimation : pkey2 };
		pptt.map.metrics.optpath = pptt.optpath;
		if( pptt.pp ) pptt.optpath.path = pptt.pp;

		var metrified_title = ( pkey2 === 'optpath' ? 'Opt.' : 'Est.' ) + pkey3;
		pptt.title = pptt.title || metrified_title;
		if( pptt.pp) pptt.pp.title = pptt.pp.title || metrified_title;
	};
	var terminate_playpath = function ( pptt )
	{
		if( !pptt.pp.value ) 	pptt.playpaths.pop();
		pptt.cbflag				= false;
		pptt.optpath			= null;
		pptt.title				= '';
		pptt.pp = null;
	};
	cmd.extract_to_playpaths = function (

			playpath_tray,
			master_line_trimmed,
			pkey,
			cbzone_bf
	){

			var pptt			= playpath_tray;
			var add_to_soko_pp	= false;
			var initiate_pp		= false;

			var pkey2 = pkey[2];
			var pkey3 = pkey[3];
			if( pptt.cbflag ) {

				if( pkey2 === 'optpath' || pkey2 === 'solpath'  )
				{
					grab_optpath ( pptt, pkey3, pkey2 );
					return true;
				}
				if( master_line_trimmed.length === 0 )
				{
					terminate_playpath( pptt );
				}else{
					pptt.pp.value += "\n" + master_line_trimmed;
				}
				return true;
			}
			if( pkey2 === 'playpath' || pkey2 === 'optpath' || pkey2 === 'solpath') {
				pptt.cbflag	= true;
				if( pkey2 === 'optpath' || pkey2 === 'solpath')
				{
					grab_optpath ( pptt, pkey3, pkey2 );
				}else{
					pptt.title = pkey3;
				}
				initiate_pp		= true;
			}else if( !cbzone_bf || ( pptt.pp && !pptt.cbflag ) ) {
				var ww = master_line_trimmed.match( sokoban_playpath_line_match );

				if( ww ) {
					if( !pptt.pp ) initiate_pp = true;
					add_to_soko_pp = true;

				}else if( pptt.pp ) {
					terminate_playpath( pptt );

				}else{
					return false;
				}
			}

			if( initiate_pp ) {
				var ww = pptt.playpaths.length;
				pptt.title = pptt.title || 'Playpath ' + ww;
				pptt.pp = pptt.playpaths[ ww ] =
				{
					title : tp.core.capitalizeFirstLetter( pptt.title.replace( reg_ex_und, ' ') ),
					value : ''
				};
				if( pptt.optpath ) pptt.optpath.path = pptt.pp;
			}

			if( add_to_soko_pp ) pptt.pp.value += master_line_trimmed + "\n";
			if( add_to_soko_pp || initiate_pp) return true;

			return false;
	};	///	Collects data to playpaths



})();



(function() { 	var tp			= $.fn.tp$  =  $.fn.tp$ || {};	
				var gio			= tp.gio    =  tp.gio   || {};
				var cmd			= gio.core.def.map_format;
				var propertify	= tp.core.propertify;
				var tooltipify_data	= tp.core.tooltipify_data;
	cmd.extract_to_dresses = function (
			dress_tray,			// dress wrap established in finalize_map.js
			master_line_trimmed,
			pkey,				// colorbanKV(master_line)
			dummy_master_line,
			dtable 				// map__eff.script.decoder_table
	){

			var ddtt			= dress_tray;
			var add_to_dress	= false;
			var initiate_dress	= false;
			var dresses			= ddtt.dresses;
			var map				= ddtt.map;
			var trim_match		= cmd.trim_match;
			var dkey;
			if( ddtt.zoneon_flag ) {
				if( master_line_trimmed.length === 0 ) {
					ddtt.dr				= null;
					ddtt.zoneon_flag	= false;
					return true;
				}
				add_to_dress = true;
			}


			var lcasekey	= ( pkey[2] && pkey[2].toLowerCase() ) || '';
			var pkeym		= ( lcasekey && pkey[3] && tp.core.str2mline( pkey[3] ) ) || '' ;
			if( lcasekey === 'dress' ) {

				ddtt.zoneon_flag		= true;
				dkey					= pkeym || map.game.dresses_chosen_key;
				ddtt.common_skin_key	= dkey;
				setup_img_path( ddtt );

	
				ddtt.dr = dresses[dkey] =
				{
					key : dkey,
					style : { play : {}, parent : {} },
					image_decoder : {},
					skip : false
				};
				ddtt.counter += 1;
				return true;
			} /// initiates new dress-parsing-zone




			if( !add_to_dress ) return false;
			var dress = ddtt.dr;



			if( lcasekey === 'image' || lcasekey === 'back_image' || lcasekey === 'center_image' ) {
					if( lcasekey === 'image' ) {
						var reskin = pkeym.split('=');
						var imagep = reskin[1] && reskin[1].replace(trim_match,'');
					}else{
						imagep = pkeym;
					}	
					if( !imagep ) {
						throw 'Invalid skin image assignment '+ pkey[0];
					}

					if(imagep.indexOf('//') === 0 ) {
						imagep = tp.core.expand_to_parent ( imagep, map.collection.ref.link.link );
					}else{
						imagep =	imagep.indexOf('/') > -1 ? 
									imagep : 
									ddtt.current_img_path + '/' + imagep;
					}
					if( lcasekey === 'image' ) {
							var w_key = reskin[0];
							w_key = w_key.length > 1 ? w_key : dtable[ w_key ];
							dress.image_decoder[ w_key ] = imagep;
					}else if( lcasekey === 'back_image' ) {
							dress.style.play.backgroundImage = imagep;
					}else{	
							dress.style.parent.backgroundImage = imagep;
					}

			}else if( lcasekey === 'skin' ) {
				ddtt.common_skin_key = pkeym;
				setup_img_path(ddtt);

			}else if( lcasekey === 'chosen' ) {
				dress.chosen = ( pkeym.toLowerCase() !== 'false' );

			}else if( lcasekey === 'skip' ) {
				dress.skip = ( pkeym.toLowerCase() !== 'false' );


			}else if( tooltipify_data.indexOf('=' + lcasekey + '=' ) > -1 ) {
					propertify( dress, 'credits', lcasekey, pkeym );
			}else{
					propertify( dress, lcasekey, pkeym );
			}

			return true;
	}; ///	Parses or initiates parsing of dress
	var setup_img_path = function( ddtt ) {
			var map = ddtt.map;
			ddtt.current_img_path =	gio.config.defpaths.SKINS_DEF_PATH + 
									'/'+ ddtt.common_skin_key;
	};

})();



( function () {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;
					var cmd		=  gio.core.def.map_format;

					var unspased_board_match	= /^ *(#|-)[^ ]*(#|-)$/;	//for map sugar
					var reg_ex_cont_space		= /\s+/g;					//for map sugar
	var sugar;
	var sugar_color;
	var sugar_range;
	var breed2color = cmd.breed2color;
	var color2breed = cmd.color2breed;
	cmd.parse_board_lines = function(raw_board_lines, map, cbzone_bf, dtable){
		sugar		= map.collection.sugar;
		sugar_range	= sugar && sugar.do_colorize_randomly;
		sugar_color	= map.sugar_color = map.sugar_color || {};

		breed2color = cmd.breed2color;
		color2breed = cmd.color2breed;

		map.parsed.wall_boundary_encountered = false;
		for(var yy=0; yy<raw_board_lines.length; yy++){
			cmd.parse_board_line(yy,raw_board_lines[yy],map,cbzone_bf,dtable);
		}
	};
	cmd.parse_board_line=function( board_y, line, map, cbzone_bf, dtable){

		var w,i,j,len;
		var game=map.game;
		var size=map.size;
		var rank;
		var rhelper_ground = game.rule_helpers.ground_always_on_level_0;
		var sugar_speed_map_boundary = game.rule_helpers.map_boundary;
		var mparsed = map.parsed;
		line=line.replace(/\s+$|<br>/gi,''); 
		line=line.replace(/\t/g,' ');  //TODm sugar. slow
		if( cbzone_bf ) line=line.replace(reg_ex_cont_space, ' ');
		var oneSymbolPerCell = (!cbzone_bf) || unspased_board_match.test( line );

		w	=	oneSymbolPerCell ? '' : ' ';
		line_arr=line.split(w);
		if(size[0]<line_arr.length)size[0]=line_arr.length;

		var ll = map.loc2lid;
		var ts = map.pos.tops;
		for(var x=0; x<line_arr.length; x++){

			var locx = ll[x] = ll[x] || [];
			var locy = locx[board_y] = locx[board_y] || [];
			var tsx = ts[x] = ts[x] || [];

			var c=line_arr[x];
			var units=[]; //array of units contained in one cell
			if( cbzone_bf && !oneSymbolPerCell ) {
				var wsplitter = c.indexOf( '.' ) > -1 ? '.' : '';
			}else{
				var wsplitter = '';
			}
			var cluster = c.split( wsplitter ); //fe: a1,b,- ...
			if( !cluster[ cluster.length - 1 ] ) cluster.pop();
			if( !cluster[ 0 ] ) cluster[ 0 ] = 'Y';
			for(i=0, len=cluster.length; i<len; i++){

				var utoken = cluster[i];
				var ranked_unit = false;
				if( utoken.indexOf( ':' ) > 1 ) {
					ranked_unit = true;
					var ww = utoken.split( ':' );
					rank=parseInt( ww[1] );
					utoken = ww[0];
				}				

				if( utoken === sugar_speed_map_boundary ) mparsed.wall_boundary_encountered = true;

				var ww = dtable[ utoken ]; //.charAt(i)]; //c[i]
				if( !ww ) ww = dtable[ '#' ];
				if( typeof ww === 'object' ) {
						units = units.concat( ww );
				}else{
						if( ranked_unit )	ww = [ ww, rank ];
						units.push( ww );
				}
			} /// Loops trough cluster
			if( rhelper_ground ){
				var ww = true;
				for(i=0; i<units.length; i++){
					if( ground_check(units[i]) ) ww=false;
					if(!ww) break;
				}
				if(ww) units.splice(0,0,'ground_x');
			}
			tsx[board_y] = units.length-1;
			for(var zz=0; zz<units.length; zz++){
				var lid=map.locs.length;
				locy[ zz ] = lid;
				map.locs[ lid ]=[ x, board_y, zz ];


				u=units[zz];

				rank=-1;
				if(typeof u === 'object'){
					rank=u[1];
					u=u[0];
				}


				var colonies = map.cols;
				var colony = colonies[u];
				var gcol = game.cols[u];
				var race = gcol.race;
				if( sugar_range ) {

					mparsed.wall_boundary_encountered = false;
					var sugarr = sugar_range[race];
					if(	sugarr && ( race === 'box' || race === 'hero' || race === 'target') ){
						if(gcol.color_ix === 0){
							next_color_ix = gcol.color_ix || 1;
							var u = game.cnames[race][next_color_ix];
							var colony = colonies[u];
							var gcol = game.cols[u];
						}

						if(colony){
							var previous_colony_color = sugar_color[race];
							var next_color_ix = ( previous_colony_color + 1) % sugarr;
							next_color_ix = next_color_ix || 1;
						}

						var u = game.cnames[race][next_color_ix];
						var gcol = game.cols[u];
						var colony = colonies[u];
						sugar_color[race] = next_color_ix;
					}else if(u === 'wall_x'){
						var u = 'box_x';
						var gcol = game.cols[u];
						gcol.baton = false;
						var colony = colonies[u];
					}
				}

				var activity = gcol.activity;
				if(!colony){
						colony = colonies[colonies.length]={id:colonies.length};
						colonies[u] = colony;
						colony.nam = u;
						colony.zorder = ground_check(u) ? 10 : 200;
						colony.zorder = gcol.target ? 100 : colony.zorder;

						colony.units = [];

						colony.color_ix = gcol.color_ix;

						colony.activity = activity;
						colony.race = race;
						colony.baton = !!gcol.baton;
						colony.target = !!gcol.target;
						colony.block = !!gcol.block;
						colony.pass = !!gcol.pass;
						colony.focused = true;

						if(activity.active){
							map.actor_cols.push(colony);
							if(!map.acting_col){
								map.acting_col=colony;
							}
						}
						if(activity.active || activity.passive){
							colony.did = map.dynamic_cols.length;
							map.dynamic_cols.push(colony);
						}

				}

				unit_ix=colony.units.length;
				var unit_id=map.units.length;
				
				var unit=map.units[unit_id]={
						id : unit_id, 		//addr in parent
						ix : unit_ix, 		//addr in colony attr
						did : colony.did,	//addr in dynamic col

						rank : rank, //attr
						color_ix : colony.color_ix,
						race : colony.race,
						pass : colony.pass,
						block : colony.block,
						target : colony.target,
						baton : colony.baton,
						activity : activity, //sugar

						col : colony, 
						gm : map,
						cname : colony.nam,
						uname : colony.nam + '_' + unit_ix + '_' + unit_id,						

						src : u				// for delayed decoding TODm rid?
				};
				
				map.units[unit_id]=unit;
				if(activity.active || activity.passive){
					map.dynamic_units.push(unit);
				}
				if( colony.target ) {
					unit.motive_name = colony.nam.replace( 'htarget', 'hero' ).replace( 'target', 'box' ); //TODQ 
					unit.motive_race = colony.race.replace( 'htarget', 'hero' ).replace( 'target', 'box' );
					map.objective.target_units.push( unit );
				}
				if( colony.baton ) map.objective.baton_units.push( unit );
				

				colony.units[unit_ix] = unit;
				map.pos.lid2uid[lid] = unit_id;
				map.pos.uid2lid[unit_id]=lid;
				map.pos.uid2loc[unit_id]=map.locs[lid];

				if(unit_ix === 0) colony.acting_unit=unit;



			} /// Loops trough normalized cluster in single cell

		}/// Loops via cells

		return true;
	};
	var ground_check=function(name){
		if(typeof name === 'object')name=name[0];
		if(name.indexOf('ground_')===0)return true;
		return false;
	};



})();



(function(){	 	var tp			=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio			=  tp.gio    =  tp.gio   || {};
					var cmd			=  gio.core.def.map_format;
					var jwon_str_left		= "^(\\s*)";
					var jwon_default_marker	= '\/';
					var jwon_str_right		= "(\\S)\\s*(?:(\\S+)(?:(\\s+)(\\S.*\\S|\\S)){0,1}\\s*){0,1}$";

					var left_trim_re	= /^(\s*)/;
					var dquotes_re		= new RegExp( '"',  "g" );
					var tab_re			= new RegExp( '\t', "g" );
					var JWON_INITIALIZATION	= "{";  // initiates parser

					var JWON_BEGINNING		= ":";  // resumes parser if not finalized
					var JWON_END			= "\\";	// suspends parsing
					var JWON_FINALIZATION	= "}";  // finalizes and disables parser

					var JWON_SINGLE			= ".";	// in-line sub-property insertion
					var JWON_FOLLOWED		= ",";	// in-line sub-property insertion
					var JWON_ASSIGMENT		= "=";	// in_line root-property assignment: /= my_key my_value

					var TEXT_BRACKETS		= '"';
					var COMMENT				= "/";
	cmd.CreateJwon = function ( colln, jwon_marker ) {

		var self_jwon					= {};
		self_jwon.parser_disabled_bf 	= false;

		var jwon_marker				= jwon_marker || jwon_default_marker;
		var jwon_re					= new RegExp( jwon_str_left + jwon_default_marker + jwon_str_right, "i" );

		var flines					= colln.script.flines;
		var heap_json				= colln.script.heap_json = colln.script.heap_json || {};
		var parsing__bf				= false;
		var text_mode_key			= '';
		var text					= '';
		var trim_indent__bf			= '';
		var raw						= '';
		var ww						= jwon_marker + JWON_INITIALIZATION;
		var format_detector_re		= new RegExp ( '^(\s\n\r)*' + ww );
		self_jwon.detect_format = function ( text )
		{
			return format_detector_re.test( text )
		};
		self_jwon.parse = function ( line_ix ) {

			if( self_jwon.parser_disabled_bf ) return false; //TODM slow. Yes. But consistent.

			var line = flines[ line_ix ];

			var match = line.match( jwon_re );
			if( match ) {
				var indent		= match[1] || '';
				var dir			= match[2];
				var key			= match[3] || '';
				var kv_spacer	= match[4] || '';
				var value		= match[5] || '';
				if( parsing__bf ) {

					if( !text_mode_key ) {
						if( dir === TEXT_BRACKETS ) {
							trim_indent__bf = indent;
							text_mode_key = key || TEXT_BRACKETS;
							text = '';
							return true;
						}
			
					}else{
						var w_term	= text_mode_key === TEXT_BRACKETS ? dir : dir + key;
						if( w_term === text_mode_key ) {
							var string_remainder = text_mode_key === TEXT_BRACKETS ?
									key + kv_spacer + value :
									kv_spacer + value;

							raw += 
								'"' + 
								text.replace(/\\/g, "\\\\").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t") +
								'"' +
								string_remainder;
							text = '';
							text_mode_key = '';
							return true;
						}
						if( text ) text += "\n";
						text += trim_indent__bf ? line.replace( left_trim_re, '' ) : line;
						return true;

					}
				} // if( !parsing__bf ) {
				if( dir === JWON_END || dir === JWON_FINALIZATION ) { // TODM possibly slow
					parsing__bf = false;
					if( dir === JWON_FINALIZATION ) {
						raw += "\n}";
						self_jwon.finalize ();
					}
					return true;
				}
				if( dir === JWON_SINGLE || dir === JWON_FOLLOWED ) {
					var ww = dir === JWON_FOLLOWED ? "," : "";
					if( value ) {
						value = value.replace( dquotes_re, '\\"').replace( tab_re, "\\t" );
					}else{
						value = "";
					}
					raw += indent + '"' + key + "\" : \"" + value + "\"" + ww + "\n";
					return true;
				}
				if( dir === JWON_BEGINNING || dir === JWON_INITIALIZATION ) {
					parsing__bf = true;
					if( dir === JWON_INITIALIZATION ) {
						raw = "{\n";
					}
					return true;
				}else if( JWON_ASSIGMENT === dir && key ) {
					heap_json[ key ] = ( heap_json[ key ] || '' ) + ( value && tp.core.str2mline( value ) );
					return true;
				}
				if( parsing__bf ) return true;
				return false;

			} /// DIRECTIVE DETECTED
			if( text_mode_key ) {
					text += "\n";
					text += trim_indent__bf ? line.replace( left_trim_re, '' ) : line;
					return true;
			}
			if( parsing__bf ) {
				raw += line + "\n";
				return true;
			}


			return false;
		} /// Parses
		self_jwon.finalize = function () {

			if( self_jwon.parser_disabled_bf ) return;

			if( raw ) {
				try {
					tp.core.rpaste( heap_json, JSON.parse( raw ) );
				}catch( error ) {
					gio.cons_add(
						"JWON error \n" +
						( typeof error === 'object' && error !== null ? error.message : '' + error )
					);
					if( gio.debug ) tp$.deb( error );
					gio.debly( "JSON input text=\n" + raw );
				}
			}
			self_jwon.parser_disabled_bf = true;
		};


		return self_jwon;

	};


})();



( function () {	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var exp_url	=  core.expand_to_parent;

					var gdef	=  gio.def;
					var gdp		=  gdef.procs;
					var ggp		=  gio.gui.procs;
					var dotify	=  core.dotify;
					var gdt		=  gio.def.templates;


					var sess	=  gio.session; 
					var gsp		=  gio.session.procs;
					var do_deb	=  gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;
					var conadd		= function ( string ) { 				gio.cons_add( "Derive: " + string ); };			
					var deb			= function ( string ) { if( gio.debug)	conadd( string ); };			
					var dodeb		= function ( string ) { if( do_deb )	conadd( string ); };
	gdp.normalize_album_defs = function ( album_defs ) {
		ceach( album_defs, function( akey, ad ) {

			gdt.normalize_album( ad );
			ad.key = akey;
			ad.album_name = ad.album_name || '';
		});
	};
	gdp.derive_game = function( gkey, overdefine ) {
		if( !overdefine ) {
			var idef = gdef.inherited_games[gkey];
			if(idef) return clonem( idef );
		}
		var gdg = gdef.games[ gkey ];
		if( !gdg ) {
			deb(	'Missed seed definition  for gkey "'+ gkey + '". Base ' +
					gdef.base_game.basekey + ' used instead.'
			);
			gkey = gdef.base_game.basekey;
			var idef = gdef.inherited_games[ gkey ];
			if( idef ) return clonem( idef );
			var gdg = gdef.games[ gkey ];
		}
		gdg.basekey = gdg.basekey || gdef.base_game.basekey;
		

		if( gdg.basekey === gkey ){ //TODM this does not protect from deeper level loop
			idef = clonem( gdg );


		}else{

			idef=gdp.derive_game( gdg.basekey, overdefine );
			var ww = gdg.post_definition;
			if(ww && gio.def.post_definitions[ww]){
				gio.def.post_definitions[ww](idef);
			}


			idef = clonem( idef, gdg );
		}
		if( idef.post_definition ) delete idef.post_definition;
		var ww = idef.post_definition_copathy;
		if( ww && (typeof ww === 'string') ) idef.post_definition_copathy = ww && gio.def.sugar[ww];
		idef.credits.title = idef.nam;
		core.tooltipify(idef, "Game");
		idef.gkey = gkey;
		gdef.inherited_games[gkey]=idef;
		return clonem(idef);
	};
	gdp.dressi_gami_fy_album = function ( akey, overdefine ) {

		if( !overdefine ) {
			var dgame = gdef.dressed_gamed_albums[ akey ];
			if( dgame ) return clonem( dgame );
		}		

		var album_def = gdef.albums[ akey ];
		if( album_def ) {
			var gkey = album_def.gkey || akey;
		}else{
			deb( 'No def for akey "' + akey + '". Using game.');
			var gkey = akey;
		}
		dgame = gdp.derive_game( gkey, overdefine );
		var dress_akey = album_def && album_def.ref.env.dress_akey;
		var env_dgame = null;
		if( dress_akey && dress_akey !== akey ) {
			env_dgame = gdp.dressi_gami_fy_album( dress_akey, overdefine );
		}
		dgame.dresses = clonem( dgame.dresses, env_dgame && env_dgame.dresses, album_def && album_def.dresses );
		ceach( dgame.dresses, function( dkey, dress ) {
			var ww = clonem(gio.def.default_dress, dress);
			cpaste( dress, ww );
		});
		var chosen_dkey = '';
		var first_dkey = '';
		ceach(dgame.dresses, function( dkey, dress ) {

			if( !first_dkey ) first_dkey = dkey;
			if( dress.skip ) return true;
			if( dress.chosen ) chosen_dkey = dkey;
			if( dress.credits.license === "host-based" ) {
				dress.credits.license =	"All rights reserved. Free when used as part of " +
										gio.config.links.service_host + " service. ";
			}

		});
		dgame.dresses_chosen_key = chosen_dkey || first_dkey;
		ceach(dgame.dresses, function(dkey,dress){
				dress.key = dkey;
				var ww =	'Follow links to find maps. Paste maps only in text format.' +
							'Text and markup surrounding map is usually successfully ignored.';
				ceach(dress.links,  function(ix,link){link.tooltip=ww;});
		});
		dgame.akey = akey;
		gdef.dressed_gamed_albums[ akey ] = dgame;

		return clonem( dgame );
	}; /// Dresses album ...
	var add_cseed = function( akey, album, cseed_to_add, gs )
	{

			dodeb( 'Merges cseed into akey = "' + akey + '" ... ' );

			var coll_to_add = clonem( cseed_to_add, gdt.play.coll );
			var ww = cseed_to_add.ref.list.cix_to_insert1;
			if( ww ) {
				var cix = ww - 1;
				cseed_to_add.ref.list.cix_to_insert1 = 0;
				if( akey === gs.akey && gs.cix === cix ) {
					gio.gui.procs.do_display_curr_board ( false );
					gsp.disable_GUI_state();
				}
				album.collections[ cix ] = coll_to_add;
				var ww = 'Coll overrode coll on'; 
			}else{
				album.collections.push( coll_to_add );
				var cix = album.collections.length - 1;
				var ww = 'Coll added to'; 
			}
			dodeb( ww + ' cix = ' + cix );
			if( !cseed_to_add.ref.list.preserve_gui_state )
			{
				if( akey === gs.akey ) {
					ggp.do_display_curr_board ( false );
					gsp.disable_GUI_state();
				}
				if( coll_to_add.chosen || coll_to_add.ref.list.chosen )
				{
					dodeb( 'Album pointed to  stated-cix = ' + cix );
					album.collections.ix = cix;
				}
			}
			gdp.spawn_coll_up_down_links( album, cix );

	}; /// Adds cseed
	gdp.derive_album = function ( akey, modifier )
	{

		var gs				= gio.getgs();
		var album			= sess.stemmed_albums[ akey ];
		var overdefine		= modifier === 'overdefine';
		var cseed_to_add	= !overdefine && modifier;
		var overdefined		= false;

		if( album && !modifier ) return album;
		if( !album || overdefine )
		{

			overdefined = overdefine && !!sess.stemmed_albums[ akey ];
			dodeb( (overdefined ? 'Over' : '' ) + 'Derives akey "' + akey + '" ... ' );
			if( overdefined && akey === gs.akey )
			{
				ggp.do_display_curr_board ( false );
				gsp.disable_GUI_state();
			}
			var album_def	= gdef.albums[ akey ] || {};
			album			= clonem( album_def );
			var dgame		= gdp.dressi_gami_fy_album( akey, overdefine );
			album.dgame		= dgame;
			try{

				for( var cix=0, wlen = album.collections.length; cix < wlen; cix++ ) {
					gdp.externify_and_hostify( album.collections[ cix ], album )
				};
				if( !gio.config.feeder.exists ) {
					dodeb( 'Removes external colls from album: ' + akey );
					var w_purged = [];
					ceach( album.collections, function( i, coll ) {
						if( coll.ref.link.ownhost ) {
							dodeb(	'Preserved ownhosted cix, coll.list_title = ' + i +
									' ' + coll.list_title 
							);
						w_purged.push( coll );
						}
					});
					album.collections = w_purged
				}
				for( var cix=0, wlen = album.collections.length; cix < wlen; cix++ )
				{
					var coll =  album.collections[ cix ];
					cpaste( coll, gdt.play.coll );
					if( cix === 0 || coll.ref.list.chosen ) album.collections.ix = cix;
					gdp.spawn_coll_up_down_links( album, cix, 'externified' );
				}

			} catch ( error ) {

				conadd(	"Error deriving akey " + akey + ".\n" +
						( typeof error === 'object' && error !== null ? error.message : '' + error )
				);
				gio.debtp( error );
				return false;
			}
			sess.stemmed_albums[ akey ] = album;

		} ///	(Over)Derives album


		if( cseed_to_add ) add_cseed ( akey, album, cseed_to_add, gs );
		if(		(	!sess.alist_by_key[ akey ] ||  overdefined )	&& 
					album.collections.length > 0					&&
				(	!gio.config.query.asingle || 
					album.ref.list.listify_on_top ||
					album.ref.list.penetrate_asingle
				)
		){

				if( overdefined )
				{
					var target_album			= sess.alist_by_key[ akey ];
					var target_aix				= target_album.ix;
					sess.alist[ target_aix ]	= album;					
					sess.alist_by_key[ akey ]	= album;
					album.ix					= target_aix;
					var www						= 'Album replaced in';

				}else{

					var ww						= sess.alist.length;
					album.ix					= ww;
					sess.alist[ ww ]			= album;
					sess.alist_by_key[ akey ]	= album;
					var www						= 'Album added to';
				}

				dodeb( www + ' list: akey, aix = "' + akey + '", ' + album.ix + '.' );

		} /// Enables album in GUI
		if( album.collections.length > 0 )
		{
			var coll	= album.collections[ album.collections.ix ];
			album.title	= gio.gui.procs.calculate_game_titile_from_names( coll.dgame.nam, album.album_name );
		}
		dodeb( "Finished derive_album subroutine. akey = " + akey );

		return album;



	}; /// Spawns album from its definition and parents




})();



( function( ){	 	var tp  	=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio 	=  tp.gio    =  tp.gio   || {};
					var core	=  tp.core;
					var ceach	=  core.each;
					var cpaste	=  core.paste_non_arrays;
					var clonem	=  core.clone_many;
					var dotify	=  core.dotify;
					var exp_url	=  core.expand_to_parent;


					var gdef	=  gio.def;
					var gdp		=  gdef.procs;

					var do_deb	=  gio.debug && !isNaN(gio.debug) &&  gio.debug % 7 === 0;
					var dodeb	=  function ( string ) { if( do_deb )		gio.cons_add( "SpawnColl: " + string ); };
					var deb		=  function ( string ) { if( gio.debug )	gio.cons_add( "SpawnColl: " + string ); };			
					var conadd	=  function ( string ) { 					gio.cons_add( "SpawnColl: " + string ); };			
	gdp.assembly_coll_title = function ( colln ) {
			if( !gdp.detect_ownhost_url( colln ) ) return;

			var dotify			= tp.core.dotify;
			var dumb_title		= "Collection " + colln.ref.list.ix;

			var l_title		= colln.ref.list.title || colln.list_title;
			var l_title_r	= ( l_title && ( ' ::: ' + l_title ) ) || '';
			var l_title_l	= ( l_title && ( l_title + ' :: ' ) ) || '';

			var title			= colln.title_compiled_from_credits;

			if( !title ) {
				title		= l_title;
			}else{
				title		+= l_title_r;
			}

			if( !title	) {
				var title		=	dotify( colln.ref.link.link, -50 );
				var title		=	title && ( title + l_title_r );
				var title 		=	title || colln.list_title; 
			}

			colln.title			= title || dumb_title;

	};
	gdp.paste_coll_to_from = function ( coll_to, coll_from )
	{
		coll_from.script = coll_to.script;
		core.rpaste( coll_to, coll_from );

		var akey		= coll_from.ref.list.akey;
		var cix			= coll_from.ref.list.ix;
		var album_from	= gio.session.stemmed_albums[ akey ];
		album_from.collections[ cix ]		= coll_to;
		album_from.coll_ref[ coll_to.ckey ]	= coll_to;
	};
	gdp.spawn_coll_up_down_links = function( album, cix, externified ) {

		var coll			= album.collections[ cix ];
		gdp.normalize_cseed( coll );
		if( !coll.ref.cid || coll.ref.cid !== 0 )
		{
			coll.ref.cid = gio.def.colls.maxcid;
			gio.def.colls.maxcid += 1;
		}
		var ww = coll.ckey || 'col_' + coll.ref.cid;


		/*
		var ww_item = coll.ckey && gio.def.colls.items[ coll.ckey ];
		if(	!album_overdefines && !coll.ref.list.cix_to_insert1 &&
			ww_item && ww_item !== coll )
		{
			coll.ckey = 'col_' + coll.ref.cid;
		}
		gio.def.colls.items[ coll.ckey ] = coll;
		*/
		album.coll_ref[ coll.ckey ] = coll;
		var akey			= album.key;
		coll.ref.list.akey	= akey;
		coll.ref.list.ix	= cix;
		var dgkey =	coll.ref.env.dgkey = coll.ref.env.dgkey || coll.ref.env.akey || akey;
		var cgame = album.dgame;
		if( dgkey !== akey ) {
			cgame = gdp.dressi_gami_fy_album( dgkey );
			cpaste( cgame.dresses, game.dresses );
		}
		coll.dgame = cgame;

		if( !externified ) gdp.externify_and_hostify( coll, album );
		core.tooltipify( coll, "Collection" );
		gdef.procs.assembly_coll_title( coll );

		coll.state.shellified = true;
		dodeb(	'"' + dotify( coll.title, 50 ) + '" up-down links done. a, c = ' +
				coll.ref.list.akey	+ ', ' +
				coll.ref.list.ix	+ '.' );

		
		return true;

	}; /// spawns collection-seed and mutifies
	gdp.detect_ownhost_url = function ( coll ) {

		var ref		= coll.ref;
		var link	= ref.link;
		var ll		= link.link;
		if( ref.db ) {
			link.ownhost = true;
		}else if( ll ) {
			if( core.do_match_own_host( ll ) ) {
				link.ownhost = true;
			}else{
				link.ownhost = false;
			}
		}else{
			link.ownhost = true;
		}
		return link.ownhost;
	};
	gdp.externify_and_hostify = function ( coll, album ) {

		gdp.normalize_cseed( coll );

		if( album.ref.db ) coll.ref.dbased = true;
		if( coll.ref.link.link ) {
				externify( coll, album.ref.link.link );
				coll.credits.source = coll.ref.link.link;
		}else{

			spawn_coll_folder_address( coll, album.key );
		}
		gdp.detect_ownhost_url( coll );

	}; 	/// Externifies and detects own host
	var externify = function ( external_collection, xurl )
	{

		var coll		= external_collection;
		var ext			= coll.ref.link;
		var cred		= coll.credits;

		ext.link		= exp_url( ext.link,		xurl );
		cred.web_site	= exp_url( cred.web_site,	xurl );

		if( gdp.detect_ownhost_url( external_collection ) ) {
			return;
		}
		var astub	= '<a target="_blank" style="text-decoration:none;" href="';
		var title	= dotify( cred.title, 30 );
		title		= title || dotify( cred.author, 30 );
		title		= title || dotify( cred.web_site, 30 );
		title		= title && ("External: " + title );
		title		= title || "External"; 
		title		= core.htmlencode( title );
		if( cred.web_site ) {
			var ext_cred	=	astub + cred.web_site +
								'"><span class="dontload_external" style="color:#00FF00">Site: ' +
								title + "</span></a>\n";
		}else{
			var ext_cred	=	'<span class="dontload_external" >' + title + "</span>\n";
		}
		ext_cred 			+=	astub + ext.link +
								'"><span class="dontload_external" style="color:#00FFFF">Text</span></a> ';
		coll.title			=	ext_cred + '<span style="color:#FF8888; cursor:pointer;" >Try to load</span>';


	}; ///	expands definition of ...
	var spawn_coll_folder_address =  function ( coll, akey ) {
			if( coll.ref.already_downloaded ) return;

			var has_folder = core.get_first_or_null( coll.ref.folder );
			var ff = has_folder ? coll.ref.folder : coll.ref.db;

			if( !ff ) {
				if( coll.ref.dbased ) {
					ff = coll.ref.db = {};
				}else{
					ff = coll.ref.folder = {};
				}
			}
			ff.akey	= ff.akey	|| akey;
			ff.ckey	= ff.ckey	|| 'default';
			ff.fkey	= ff.fkey	|| 'maps.txt';

			if( coll.ref.folder ) {
				ff.full	=	gio.config.defpaths.ALBUMS_DEF_PATH + 
							'/' + ff.akey +
							'/collections/'+ff.ckey +
							'/'+ ff.fkey;
			}

	};
	gdp.normalize_cseed = function ( coll ) {

		coll = gio.def.templates.normalize_coll( coll );
		coll.ref.env.akey = coll.akey || coll.ref.env.akey;
		if( coll.hasOwnProperty( 'akey') ) delete coll.akey;
		return coll;

	};

})();




(function(){	 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};
	gio.def.base_game = {

		basekey						: 'whirly',
		nam							: 'Whirly',

		DEEPNESS_LIMIT				: 1,	//how many boxes can be pushed
		herd_sense					: 1,	//flag. >0 for flock behaviour
		herd_dimensionality			: 2,	//2 is for planar
		active_units_do_interact	: false,
		races		: {
							ground	: {		activity	: { frozen : true }
									  },
							wall	: {		activity	: { frozen : true }
									  },
							target	: {		activity	: { frozen : true },
											target		: true,
											pass		: true 
									  },
							htarget	: {		activity	: { frozen : true },
											target		: true,
											pass		: true
									  },
							box		: {		activity	: { passive : true },
											baton		: true
									  },
							hero	: {		activity	: { active : true },
											baton		: true
									  }
					  },
		colors				: ['x','a','b','c','d','e','f','g','h','i'],
		wall_map_symbols	: ['y','j','k','l','m','n','o','p','q','r'], // TODm text-map symbols sneaked here ...
		interact_rules	:{
			block				:{wall_x:true}, 	//does block unconditionally; does not depend on imatrix

			pass				:{ground_x:true}	//unconditional; does not depend on imatrix

		},
		interact				:{},

		credits : {
			"author"	: "",
			"title"		: "",
			"copyright"	: "",
			"license"	: "Public Domain",
			"web_site"	: "http://landkey.net/gio/gio/play",
			"comments"	: "",
			"date"		: "",
			"email"		: "beaverscript (a) landkey (.) net"
		},
		rule_helpers : {
			one_dynamic_unit_on_top : true,  //TODO does it make check during game play?
			ground_always_on_level_0 : true,  // Range: true. IMPLEMENTATION-RESTRICTION
			map_roof		: 3,
			map_boundary	: '#'
		}




	}; //gio.def.base_game
	

})();



(function( ) {	 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		=  tp.gio    =  tp.gio   || {};
					var ceach	=  tp.core.each;

					var gdf		=  gio.def;


	gio.def.sugar = {};

	var sugar_inverse_path_symbols =
	{
		d : 'u', u : 'd', l : 'r', r : 'l',		//(*)
		D : 'U', U : 'D', L : 'R', R : 'L' 
	};
	gio.def.sugar.copathy = function ( gm, move, copath, ccc ) {

				if(move.steps.length === 1){
					ccc = sugar_inverse_path_symbols[ccc];

				}else if(	move.steps.length === 2 && 
							( gm.game.gkey === 'co_pullswappush' || gm.game.gkey === 'pullswappush' ||
							  gm.game.gkey === 'co_ghostban'	|| 	gm.game.gkey === 'ghostban'	 )
							)
				{
					var passee_id = move.steps[1].uid;
					var passee = gm.units[passee_id];
					var passee_color = passee.color_ix;			
					var actee_id = move.steps[0].uid;
					var actee = gm.units[actee_id];
					var actee_color = actee.color_ix;
					if(	(gm.game.gkey === 'pullswappush' && passee_color < actee_color) ||
						(gm.game.gkey === 'co_pullswappush' && passee_color > actee_color) ||
						(
							(gm.game.gkey === 'co_ghostban'	|| 	gm.game.gkey === 'ghostban'	 ) &&
							actee_color === 2 && passee_color !== 2
						)
					) {
						ccc = sugar_inverse_path_symbols[ccc];
					}
				}
				copath = ccc + copath;
				return copath;
	};//gio.def.sugar.copathy
	var unmatched_col_int_extender = function( initiator_is_lower, initiator_is_higer, even ) {

		return function( game ) {


			var colors = game.colors;
			var itr = game.interact;

			for( var color_ix=1; color_ix < colors.length; color_ix++ ) {

				var color = colors[ color_ix ];

				if( even && ( (color_ix % 2) != 0 ) ) continue;

				tp.core.each( game.races, function( race_name, race ) {

					if(	(race_name !== 'box' && race_name !== 'hero') ||
						color_ix === 0 ){
						return true;
					}


					var initiator_name = game.cnames[ race_name ][ color_ix ];	
					for( var color_jx=1; color_jx < colors.length; color_jx++ ) {
						var color = colors[color_jx];
						var peer_name = 'box_'+ color;

						if( even ) {

							if( color_ix == color_jx ) itr[ initiator_name ][ peer_name ] = initiator_is_lower;

						}else{

							if( color_ix < color_jx ) itr[ initiator_name ][ peer_name ] = initiator_is_lower;
							if( color_ix > color_jx ) itr[ initiator_name ][ peer_name ] = initiator_is_higer;
						}
					}
				});//game.races
			}//for(var color_ix
	  	};
	};///	Extends interactons to added_interaction









	gio.def.post_definitions = {
		pullpush_inversifier :  function( game ) {

			ceach( game.interact, function( peerA, peersB ) {
				ceach( peersB, function( peerB, interaction ) {

					if( interaction === 'pull' ) {
						peersB[ peerB ] = 'push';
					}else if( interaction === 'push' ) {
						peersB[ peerB ] = 'pull';
					}
				});
			});
		},
		pullpush		: unmatched_col_int_extender( 'pull', 'pull' ),
		leappush		: unmatched_col_int_extender( 'leap', 'leap' ),

		pullswappush	: unmatched_col_int_extender( 'swap', 'pull' ),
		pullorpush		: unmatched_col_int_extender( 'pull', null, 'even' )

	};//gio.def.post_definitions
})();



(function(){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio		=  tp.gio    =  tp.gio   || {};
				var ceach	=  tp.core.each;
				var gdf		=  gio.def;
	gdf.procs.spawn_base_game_and_dress = function () {
		spawn_base_game_def();
		spawn_base_game_dress();
		gio.core.def.map_format.finalize_colorban_decoder_table( 
			gdf.games[ gdf.base_game.basekey ]
		);
	};
	var spawn_base_game_def = function () {

		var game							= tp.core.clone_many( gdf.base_game );
		gdf.games[ gdf.base_game.basekey ]	= game;


		game.won_or_not			=	function(gm, pos){ return gio.colorban_is_game_won(gm, pos); };
	  game.herd_rules = function( move, gm ) {

		var verbose = gio.modes.dynamic.verbose || gio.debug;
		var log = gio.info.log;
		var game=this;
		var steps = move.steps;
		var orig_step=steps[1];
		var dir = orig_step.direction > 0 ? 1 : -1;
		var orig_unit=gm.units[orig_step.uid];
		var colony=orig_unit.col;
		var pos=move.pos;
		var orig_loc = pos.uid2loc[orig_unit.id];
		var sense = game.herd_sense;
		var xy_exists = gm.xy_exists;
		var dimensionality=game.herd_dimensionality;
		var dim=Math.abs(orig_step.direction)-1;
		var orth_dim = (dim + 1 ) % dimensionality;
		var zz = orig_loc[2];
		var fellow_loc=[];
		for(var nx=sense; nx >= -sense; nx--){
			fellow_loc[dim]= nx*dir + orig_loc[dim];
			for(var ny=sense; ny >= -sense; ny--){
				if( nx === 0 && ny === 0 ) continue;

				fellow_loc[orth_dim]=ny*dir + orig_loc[orth_dim];

				var xx=fellow_loc[0];
				if( !xy_exists[xx] ) continue;

				var yy=fellow_loc[1];
				if( !xy_exists[xx][yy] ) continue;
				var tower = gm.loc2lid[xx][yy];
				for(var zz=1; zz<tower.length; zz++){
					var lidn = tower[zz];
					var uidn = pos.lid2uid[lidn];
					if(uidn<0)continue;

					var unitn = gm.units[uidn];
					var already_moving=false;
					for(var s=0; s<steps.length; s++){
						if(steps[s].uid === unitn.id){
							already_moving=true;
							break;
						}
					}
					if(already_moving) break;
					if(unitn.cname !== colony.nam) continue;
					var result=gio.core.procs.do_interaction( orig_step.direction, unitn, move, 2  );
					if(result){
						move=result;
						steps = move.steps;
					}else{
						if(verbose) log.move +=	unitn.hname + " cannot follow the leader " + unitn.hname +"\n";
					}
					break;	
				}
			}
		}
		return move;
	  };  /// Extra Rules
	  ( function( game ) {
	
		var w;
		var colors = game.colors;
		var itr = game.interact;
		var itrr = game.interact_rules;
		game.cnames = {};


		for(var color_ix=0; color_ix<colors.length; color_ix++){
			var color = colors[color_ix];

			tp.core.each(game.races, function( race_name, race ){

						var cnames = game.cnames[race_name] = game.cnames[race_name] || [];
						var cname = cnames[color_ix] = race_name + '_'+ color;	
						if(race.pass) itrr.pass[cname]=true;
						var cols = game.cols = game.cols || {}; 
						var col = cols[cname] = {
								color_ix : color_ix,
								race : race_name,
								activity : race.activity,
								baton : race.baton,
								target : race.target,
								block : !!itrr.block[cname],
								pass : !!itrr.pass[cname]
						};						
						if( race_name === 'hero' || race_name === 'box' ) itr[cname]={}; 
			});

			var hh=game.cnames['hero'][color_ix];
			var bb=game.cnames['box'][color_ix];
			var gg=game.cnames['ground'][color_ix];

			var blackb = game.cnames['box' ][0];
			var blackh = game.cnames['hero'][0]; 

			itr[ blackh ][bb]='push';	//blackhero can push every box
			itr[hh][ bb     ]='push';	//color hero can push boxes only of own color
			itr[hh][ blackb ]='push';	//color hero can push boxes of black

			itr[ blackb ][bb]='push';	//black box can push boxes of any color
			itr[bb][ bb     ]='push';	//color box can push boxes of own color
			itr[bb][ blackb ]='push';	//color box can push boxes of black color

		}
		delete game.interact_rules

	  })(game);
	}; /// Derives base-game from
	var spawn_base_game_dress = function () {

		var bgame = gdf.games[gdf.base_game.basekey];
		var ddress = gio.def.default_dress;
		var hname = ddress.hname_table;
		var colors = bgame.colors;

		for( var color_ix=0; color_ix < colors.length; color_ix++ ) {
			tp.core.each(bgame.races, function( race_name, race ) {

				var cname = bgame.cnames[race_name][color_ix];
				hname[ cname ] = color_ix ? race_name : cname;
			});
		}
		ddress.human_name = function( nkey ) { return this.hname_table[ nkey ] || nkey; };
		bgame.dresses = { "default" : ddress };
	};



})();



( function () {	 	var tp		= $.fn.tp$  =  $.fn.tp$ || {};	
					var gio		= tp.gio    =  tp.gio   || {};
					var ceach	= tp.core.each;
	gio.colorban_is_game_won = function( gm, pos ) { 

		if( !gm ) {
			var gs	= gio.getgs();
			gm		= gs.gm;
			pos		= gs.pos;
		}

		var uid2loc		= pos.uid2loc;
		var objective	= gm.objective;

		var necessary_to_fill = objective.necessary;
		if( !necessary_to_fill ) return 0;

		var filled_units	= 0;
		var units			= objective.baton_units;

		for( var nn = 0, len = units.length; nn < len; nn++ ) {
			var unit = units[ nn ];

			var loc = pos.uid2loc[ unit.id ];
			if( loc[2] < 2 ) continue;

			var peer_lid	= gm.loc2lid[ loc[0] ][ loc[1] ] [ 1 ]; 
			var peer_uid	= pos.lid2uid[ peer_lid ];
			var peer		= gm.units[ peer_uid ];
			
			if( peer.target && 
				(	peer.motive_name === unit.cname ||
					( ( peer.color_ix === 0 || unit.color_ix === 0 ) && peer.motive_race === unit.race )
				)
			){
				filled_units += 1;
				if( filled_units >= necessary_to_fill ) break;
			}

		}
		pos.filled_units	= filled_units;
		result				= filled_units >= necessary_to_fill ? 1 : 0;
		return result
	};

})();

(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	





	gio.def.default_dress = 
	{

			credits :
			{
				"title"		: "Boxiland",
				"author"	: "Konstantin Kirillov",
				"license"	: "Public Domain",
				"copyright"	: "",
				"web_site"	: "http://landkey.net/gio/gio/play",
				"comments"	: "",
				"date"		: "",
				"email"		: "beaverscript (a) landkey (.) net"
			},
			skin_key	:	'default',
			tile		:{	width : 25, height: 25 },
			style		:{	
							play:{
									backgroundImage : "", // for example, alternative is: background.png',
									backgroundColor : 'transparent'
							},
		
							parent:{
									backgroundImage : "",
									backgroundColor : "#000000"
							}
						}, 

			image_decoder	:{},
			focuser			: 'default',
			playvigation	:{	
								UNIT_IS_UNSELECTABLE : true // should be set to false for interacting heros
			},
			rules			:	"Hero can push only one box with matching color.\n"+
								"Moved box carries away matching neighbours.\n"+
								"Black, matches any color.\n",
			objective		:	"Deliver boxes to color-matching targets till \nall boxes are delivered or all targets are filled",
			story			:	"Stubborn boxes ... ",
			hname_table		:	{},
			DIMENSION_NAMES	:	[ 'x', 'y', 'z' ]



	}//	'default'





})();



(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
gio.def.albums['flocks']={

	gkey : 'flocks',

	collections : 
			[
				{	ckey : 'beginner', credits : { title	: "Beginner" } },

				{ 	ckey : 'wells', "ref" : { "folder" : { fkey	: 'wells.txt' } },
					credits : { title	: "Wells" }
				}
			],



	dresses  :{


		"default"	:{	tile	:{	width : 60, height: 60 },
						rules	:	"Heros push boxes of match-color ...\nBlack matches own and any color ...\nBoxes are sticky:\npushed box moves contacting boxes.\n"
					},

		/* abandoned, see bugs ...  why ..
		"chickens_promoted" :
		{
			skip : true,
			skin : "flockgarden"

		},
		*/

		chicken_garden :
		{

			credits : {
								"title" : "Chicken Garden",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"date"		: "December 30, 2012"
			},
			tile	:{	width : 60, height: 60 },
			style	:{	play:{ backgroundImage : 'background.png' } },			
			skin_key : "flockgarden",
			rules : "Each manager can push subject \nonly of own breed.",
			objective : "Put each breed in to own eggs.",
			skip : true,

			image_decoder :
			{
					"hero_f"	: "blue_man2.png",
					"box_f"		: "blue_chick.png",
					"target_f"  : "blue_target.png",
					"box_g"		: "red_chick.png",
					"hero_g"	: "red_man2.png",
					"target_g"  : "red_target.png",
					"ground_x"  : "egg_ground.png"
			},
			hname_table	:{
				hero_x	: 'grey manager',
				hero_a	: 'blue manager',
				hero_b	: 'green manager',
				hero_c	: 'red manager',
				hero_d	: 'manager',
				hero_e	: 'manager',
				hero_f	: 'blue manager',
				hero_g	: 'red manager',
				hero_h	: 'manager',
				hero_i	: 'manager',
				box_f	: 'blue chick',
				box_g	: 'red chick',
				box_h	: 'chick'
			}
		},


		flocks :{

			skin_key : 'flocks',
			chosen : true,

			credits : {
								"title"		: "Flocks",
								"author"	: "Konstantin Kirillov",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"web_site"	: "http://landkey.net/gio/gio/play",
								"date"		: "November 2, 2012"
			},
			tile	:{	width : 60, height: 60 },
			style	:{	play:{ backgroundImage : 'background.png' } },			


			rules	:
				"When fellow is pushed, fellows nearby\n"+
				"mock its move if space allows.\n"+
				"Each breed pushed by own teacher.\n",

			objective:
				"Fill out all available targets. \nEach breed has own targets to occupy.",

			story:
				"The Law of school says: the pupil can only be taught\n" +
				"when it is in his chair or egg\n" +
				"It is permittable to leave own place\n" + 
				"in break time, but be sure to get back\n" +
				"when classes begin ...\n" +
				"One who has lost its furniture, no longer can be taught...\n" +
				"....\n" +
				"When Teachers woke up afte a nap, \nthey found themselves at difficult task ...\n",


			hname_table	:{
				hero_x	: 'Teacher',
				hero_a	: 'Monkey shepherd',
				hero_b	: 'Chicken shepherd',
				hero_c	: 'Rabbit shepherd',
				box_a	: 'Fellow monkey',
				box_b	: 'Fellow chick',
				box_c	: 'Fellow rabbit',
				box_x	: 'Monkey'
			}
		}, ///flocks




		forest :{
			skin_key : 'forest',
			skip : true,

							
			credits : {
								"title"		: "Forest",
								"author"	: "Konstantin Kirillov",
								"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
								"license"	: "host-based",
								"web_site"	: "http://landkey.net/gio/gio/play",
								"date"		: "November 2 2012"
			},

			tile	:{	width : 80, height: 80 },
						style	:{	play:{
									backgroundImage : 'background.png'
					},
			},

			rules	:
				"Hunter pushes monkeys and birds.\n"+
				"Pushed fellow entails own-breed neighbours " +
				"if they can.\n",

			objective:
				"Bring monkeys to bananas and birds to eggs.",

			"story" :

				"... walking through a foggy forest,\n" +
				"Birds and monkeys mocking me.\n" +
				"Round by round around corners,\n" +
				"Thought by thought around tree.\n" +
				"\n" +
				"What a darkeness in this valley,\n" +
				"Cannot see beyond next step.\n" +
				"Drink not from the wells around you,\n" +
				"Dreamy water does not help.\n" +
				"\n" +
				"Path is long and mind is tired,\n" +
				"Back to place from where I went.\n" +
				"Am I first here lost impaired,\n" +
				"Can one stretch a hand of lead ...\n",


			hname_table	:{
				hero_x	: 'hunter',
				box_a	: 'fellow monkey',
				box_b	: 'fellow chick'
			}


		}///forest
	}//dresses


};
})();



(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
	gio.def.albums['pullpush'] = {

		album_name	: 'TyaNee-TolKy',

			collections :
			[ 
				{	"ckey": "beginner", "list_title" : "Beginner" },


				{	"list_title"	: "Unexplored. David Holland. dh1.",				"ref" : { "folder" : {  "akey" : "sokoban", "fkey": "authentic_David_Holland_dh1.txt",	"ckey": "holland"  } }, 	
					/*,
					sugar :
					{ 
						do_colorize_randomly :
						{
									box : 3,
									target : 3,
									hero : 3
						}
					} */
				},

			{	

				"list_title"	: "Unexplored. D. W. Skinner. Microban.",			"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban1.txt",	"ckey": "skinner" }  },

				sugar : { 
							do_colorize_randomly : {
								box : 4,
								target : 4,
								hero: 4
							}
				}


			}
		],



		dresses  :
		{ 
			'default' :
			{
				tile	: { width : 30, height: 30 },
				rules	: "The hero pushes boxes of matching colors and\npulls boxes of other colors"
			},

			'pullpush' :
			{

					skin_key	: 'pullpush',
					chosen		: true,

					credits : {
						"title"		: "Dinner",
						"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
						"license"	: "host-based",
						"web_site"	: "http://landkey.net/gio/gio/play",
						"date"		: "November 2 2012",
						"email"		: "beaverscript (a) landkey (.) net"
					},

					tile	:{	width	: 60, height: 60 },
					style	:{	play	:{	backgroundImage:'background.png',
											backgroundColor:''
										},
							},			

					rules 		: "Hero pushes gold and food of own color and \npulls food of other colors",
					objective	: "Put food on color-matching plate.",
					story		: "It is already evening and heros are hungry.\nHelp them to serve a dinner.",


					hname_table	:{
							hero_b	: 'Rabbit',
							box_b	: 'cabbage',
							box_c	: 'carrot',
							box_x	: 'gold',
							wall_x	: 'obstacle'
					}
			}

		}// dresses

	};


	gio.def.albums['co_pullpush'] = {

		gkey	: 'co_pullpush',
		"env" : { "dress_akey" : "pullpush" },

		dresses  :
		{ 
			'default' :
			{
				rules	: "The hero pulls boxes of matching color and pushes boxes of other color."
			},

			"pullpush" :
			{
				"rules" 	: "Hero pulls food of own color and \npushes food of other colors"
			}

		}// dresses

	};



})();



(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};



	
	gio.def.albums['monkeyban']={


		gkey		: 'monkeyban' ,
		album_name	: 'Island School',


		collections	: [


				{	"ckey" : "beginner", "credits" : {	"title"		: "Beginner" 	}  },

				{	"list_title"	: "Microban",		"ref" : { "folder" : { "fkey": "monkey_microban1.txt" }  } },

				{	"list_title"	: "Unexplored. D. W. Skinner. Microban.",			"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban1.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Microban II.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban2.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Microban III.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban3.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Microban IV.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban4.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Microban V.",			"ref" : { "folder" : { "akey" : "sokoban", "fkey": "microban5.txt",	"ckey": "skinner" }  } },

				{	"list_title"	: "David Holland. dh1.",							"ref" : { "folder" : {  "akey" : "sokoban", "fkey": "authentic_David_Holland_dh1.txt",	"ckey": "holland" } }, 	"map_title_source"	: "comment" },

				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch.",			"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch1.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch II.",		"ref" : { "folder" : {  "akey" : "sokoban", "fkey": "sasquatch2.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch III.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch3.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch IV.", 		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch4.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch V.", 		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch5.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch VI.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch6.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch VII.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch7.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch VIII.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch8.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch IX.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch9.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch X.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch10.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch XI.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch11.txt",	"ckey": "skinner" }  } },
				{	"list_title"	: "Unexplored. D. W. Skinner. Sasquatch XII.",		"ref" : { "folder" : { "akey" : "sokoban", "fkey": "sasquatch12.txt",	"ckey": "skinner" }  } },


				{
					"ref" : { "folder" : {	"akey" : "sokoban", ckey: 'grigoriev', fkey: 'grigr2001.txt' } },
					credits : { "title" : "Unexplored. Evgeny Grigoriev. 2001." },
					map_title_source :'comment'
				},

				{
					"ref" : { "folder" : {	"akey" : "sokoban", ckey: 'grigoriev', fkey: 'grigr2002.txt' } },
					credits : { "title"		: "Unexplored. Evgeny Grigoriev. 2002." },
					map_title_source	:'comment'
				}

		],


		dresses  :
		{ 
			'default' :
			{
				tile	:{ width : 30, height: 30 }
			},

			'monkeyban' :
			{

					skin_key : 'monkeyban',
					chosen	: true,


					credits : {
						"title"		: "Yard",
						"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
						"license"	: "host-based",
						"web_site"	: "http://landkey.net/gio/gio/play",
						"date"		: "November 2 2012",
						"email"		: "beaverscript (a) landkey (.) net"
					},


					links	:	[
						{title:'<a target="_blank" href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
						{title:'<a target="_blank" href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
						{title:'<a target="_blank" href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
						{title:'<a target="_blank" href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'}
					],
					tile	:{ width : 40, height: 40 },
					style	:{	play:{
										backgroundImage:'background.png',
										backgroundColor:''
								},
						},			
					rules	:
						"The schoolkeeper is not dexterous to pull monkey, but can push it.\n"+
						"Monkeys in contact with the moved fellow\n"+
						"will do the same move whenever possible.\n"+
						"Monkeys can run over chairs and schoolkeeper\nlearned do the same from them.\n",

					objective:
						"Put each monkey into class chair",

					story:
						"It's hard to take classes in summer time ... that's why these monkeys\n"+
						"at large ... Help bring them back to learning ...\n",
						hname_table	:{ //optional
							hero_x	: 'klasskeeper',
							box_x	: 'monkey'
						},

						image_decoder	:{
							'hero_x':'portablejim_Man_Standing_OCAL_2008_www.openclipart.org.png',
							'ground_b' : 'ground_x.png'
						}
			}// monkeban

		}// dresses

	};


})();



(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
gio.def.albums['flockmasters']={

	gkey : 'flockmasters',
	"ref" : { "env" : { dress_akey : "flocks" } },

	
	collections : 
			[
				{ credits : { title	:'Beginner' } },

				{
					"ref" : { "folder" : { fkey	: 'wells.txt' } },
					credits : { title	: "Wells" }
				}
			],
	dresses  :{

			"default" :
			{ rules : "Heros push boxes of match-color and \nPull boxes of alien color.\nBlack matches own and any color ...\nBoxes are sticky: moved box moves its neighbours ...\n" },


		flocks :{ 

			skin_key : 'flocks',
			credits : { "date"		: "November 6, 2012" },

			rules	:
				"Teacher pushes brown Monkeys and pulls Antimonkeys.\n" +
				"When fellow is pushed or pulled, fellows of similar breed nearby\n"+
				"mock its move (if no obstacles prevent this).",

			objective : "Bring Monkeys to chairs of their color or to white or black color.",

			story:
				"The Law of school says: the pupil can only be taught\n" +
				"when it is in his chair or egg\n" +
				"It is permittable, in break time to leave own place\n" + 
				"but be sure to get back when classes begin ...\n" +
				"One who has lost its furniture, no longer can be taught...\n" +
				"....\n" +
				"When Teachers woke up afte a nap,\nthey found themselves at difficult task ...\n",

			hname_table	:{
				hero_x	: 'Teacher',
				hero_a	: 'Monkey shepherd',
				hero_b	: 'Antimonkey shepherd',
				hero_c	: 'Rabbit`s shepherd',
				box_a	: 'Monkey',
				box_b	: 'Antimonkey',
				box_c	: 'Rabbit',
				box_x	: 'Real monkey'
			},

			image_decoder	:{
					"box_b"		: "box_b_anti.png",
					"wall_b"	: "wall_b_anti.png",
					"target_a"	: "target_a_anti.png",
					"target_b"	: "target_b_anti.png"
			}
		}, //flocks

		chicken_garden :
		{
			rules : "Each bread has own Master to push.\nMaster's of other breed pull its species"
		},
		forest :{

			credits		: { "date" : "November 2 2012" },

			rules	:
				"Hunter pushes monkeys and pulls antimonkeys.\n"+
				"Pushed fellow entails own-breed neighbours " +
				"if they can.\n",

			objective:
				"Bring monkeys to bananas",

			story : "Everyone is lost and lost own things ... ",

			hname_table	:{
				hero_a	: 'Hunter',
				hero_i	: 'Hunter',
				box_a	: 'Monkey',
				box_b	: 'Antimonkey'
			},

			image_decoder	:{
					"box_b"		: "box_b_anti.png",
					"wall_b"	: "wall_b_anti.png",
					"target_a"	: "target_a.png",
					"target_b"	: "target_b_anti.png"
			}
		}///forest

	}///dresses
};

})();



(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums[ 'sokoban' ] =
	{
			collections :[

				{	"ckey" : "holland",		 "list_title"	: "David Holland. dh1.",					"ref" : { "folder" : { "fkey": "authentic_David_Holland_dh1.txt",	"ckey": "holland" } }, 	"map_title_source"	: "comment" },

				{	"ckey" : "microban1",	 "list_title"	: "David W Skinner. Microban.",				"ref" : { "folder" : { "fkey": "microban1.txt",	"ckey": "skinner"  } } },
				{	"ckey" : "microban2",	 "list_title"	: "David W Skinner. Microban II.",			"ref" : { "folder" : { "fkey": "microban2.txt",	"ckey": "skinner"  } } },
				{	"ckey" : "microban3",	 "list_title"	: "David W Skinner. Microban III.",			"ref" : { "folder" : { "fkey": "microban3.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Microban IV.",			"ref" : { "folder" : { "fkey": "microban4.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Microban V.",			"ref" : { "folder" : { "fkey": "microban5.txt",	"ckey": "skinner"  } } },

				{	
					"ref" :
					{ 
						link :
						{	
							link : 'http://users.bentonrea.com/~sasquatch/sokoban/m5'
						}
					},
					credits : { "author"	: "David W Skinner",
								"title"		: "Microban V (26 puzzles, October 2010, this set is unfinished)",
								"copyright" : "Copyright (c) 2010 David W Skinner",
								"license"	: "The sets Sasquatch and Microban may be freely distributed provided they remain properly credited.",
								"web_site"	: "http://users.bentonrea.com/~sasquatch/sokoban/",
								"email"		: "s a s q u a t c h (a) b e n t o n r e a . c o m"
							  }
				},



				{	"list_title"	: "David W Skinner. Sasquatch.",			"ref" : { "folder" : { "fkey": "sasquatch1.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch II.", 		"ref" : { "folder" : { "fkey": "sasquatch2.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch III.", 		"ref" : { "folder" : { "fkey": "sasquatch3.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch IV.", 		"ref" : { "folder" : { "fkey": "sasquatch4.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch V.", 			"ref" : { "folder" : { "fkey": "sasquatch5.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch VI.", 		"ref" : { "folder" : { "fkey": "sasquatch6.txt",	"ckey": "skinner"  } } },
				{	"ckey" : "sasquatch7",	 "list_title"	: "David W Skinner. Sasquatch VII.", 		"ref" : { "folder" : { "fkey": "sasquatch7.txt",	"ckey": "skinner"  } } },
				{	"ckey" : "sasquatch8",	 "list_title"	: "David W Skinner. Sasquatch VIII.", 		"ref" : { "folder" : { "fkey": "sasquatch8.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch IX.", 		"ref" : { "folder" : { "fkey": "sasquatch9.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch X.", 			"ref" : { "folder" : { "fkey": "sasquatch10.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch XI.", 		"ref" : { "folder" : { "fkey": "sasquatch11.txt",	"ckey": "skinner"  } } },
				{	"list_title"	: "David W Skinner. Sasquatch XII.", 		"ref" : { "folder" : { "fkey": "sasquatch12.txt",	"ckey": "skinner"  } } },


			{
				"ckey" : "egrig2001",	 "ref" : { "folder" : {	ckey: 'grigoriev', fkey: 'grigr2001.txt' } },
				credits : { "title"		: "Evgeny Grigoriev. 2001." },
				map_title_source	:'comment'
			},

			{
				"ckey" : "egrig2002",	 "ref" : { "folder" : {	ckey: 'grigoriev', fkey: 'grigr2002.txt' } },
				credits : { "title"		: "Evgeny Grigoriev. 2002." },
				map_title_source	:'comment'
			},



			{
				"ref" : { "folder" : {	ckey: 'weirdy' } },
				credits : { "title"		: "Weirdy" 	},
				map_title_source	:'comment'
			}

		],
		dresses  :
		{	'default' :
			{

				links	:	[
					{title:'<a target="_blank" href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
					{title:'<a target="_blank" href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
					{title:'<a target="_blank" href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
					{title:'<a target="_blank" href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'},
					{title:'<a target="_blank" href="http://sneezingtiger.com/sokoban/levels.html">Some Levels</a>'},
					{title:'<a target="_blank" href="http://www.sneezingtiger.com/sokoban/levels/yoshioText.html">Non Researched Source</a>'},
					{title:'<a target="_blank" href="http://sokoban.ws/">MF8 Sokoban Competition</a>'}
				],

				rules: 	"robot can push a box",
				objective: 	"push all boxes into black cells",
				story: 	"Our Hero, the robot, walks through the maze and pushes the boxes to dark cells."

			}, // default

			'pullpush' :
			{

					skin_key	: 'pullpush',

					credits : {
						"title"		: "Dinner",
						"author"	: "Konstantin Kirillov",
						"copyright"	: "Copyright (C) 2012 Konstantin Kirillov",
						"license"	: "host-based",
						"web_site"	: "http://landkey.net/gio/gio/play",
						"date"		: "November 2 2012",
						"email"		: "beaverscript (a) landkey (.) net"
					},

					tile	:{	width	: 40, height: 40 },
					style	:{	play	:{	backgroundImage:'background.png',
											backgroundColor:''
										}
							},			

					rules 		: "Rabbit can push cabbage",
					objective	: "Fill dishes with food",
					story		: "It is already evening and hero is hungry.\nWho can help to serve the dinner?",


					hname_table	:{
							hero_b	: 'Rabbit',
							box_b	: 'cabbage',
							wall_x	: 'vase'
					},

					image_decoder	:{
							hero_x		:	"hero_a_hat.png",
							box_x		:	"box_b.png",
							target_x	:	"target_b.png"
					}
			}

		}/// dresses
	};

})();



(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};




	
	gio.def.albums[ 'colorban' ] = 
	{

		gkey : 'colorban',
		collections :
		[
				{
					"ckey" : "team_of_two",
					"credits" : { "title"		: "Team of Two"	},
					"ref" : { "folder" : { fkey : 'team_of_two.txt'	} }
				},

				{
					"ckey" : "soko_derivations",
					"credits" : {	"title"		: "Soko Derivations" },
					"ref" : { "folder" : { fkey : 'soko_derivations.txt' } }
				},

				{
					"credits" : { "title"		: "Beginner"	}
				}

		],


		dresses :
		{	"default" :
			{
				rules : "Heros push boxes of match-color.\nBlack matches own and any color ...\n",

				links	:
				[
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
					{title:'<a href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
					{title:'<a href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'}
				],

				style	:
				{	play :
					{
						"backgroundImage": "",
						"backgroundColor": "#666666"
					}
				}
	
			}, // default
			"colorban_vases" :
			{

				skin_key : 'colorban_vases',
				skip	: true,
				credits : { title : "Rozen Stones", "date" : "January 4, 2013" },
				tile	: {	width : 100, height: 100 },
				"style"	:
				{			"play" :
							{	"backgroundImage" : "background.png",
								"backgroundColor" : ""
							}
				},			
				focuser : '',

				rules : "Rozen Stones are very delicate ...\n" +
						"They survive only if handled by Gardeners dressed in their \n" +
						"own color and planted in vases with their own color ...\n" +
						"Only the Black Rose recognizes any color, and \n" +
						"Black Gardener admitted by any Rose.\n" + 
						"The Crocodiles are devoted to plant Roses in this \n" +
						"annoying desert ... \n",

				objective : "Plant all Roses",


				hname_table	:{
					hero_x	: 'Black Master',
					hero_a	: 'Blue Gardener',
					hero_b	: 'Green Gardener',
					hero_c	: 'Red Gardener',
					hero_d	: 'Yellow Gardener',
					box_x	: 'Black Rose',
					box_a	: 'Blue Rose',
					box_b	: 'Green Rose',
					box_c	: 'Red Rose',
					box_d	: 'Yellow Rose'
				},



				links	:
				[
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/handmade/index.html">Yoshio Murase and Masato Hiramatsu. Handmade.</a>'},
					{title:'<a href="http://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/index.html">Yoshio Murase. Autogenerated.</a>'},
					{title:'<a href="http://www.sourcecode.se/sokoban/levels.php">Possibly enough for one human life ...</a>'},
					{title:'<a href="http://users.bentonrea.com/~sasquatch/sokoban/">Sokoban puzzles by David W. Skinner</a>'}
				]
	
			} /// colorban_vases


		} // dresses
	}; //gio.def.albums[ 'colorban' ]




	gio.def.albums['co_colorban'] = {

		"ref" : { "env" : { dress_akey	: "colorban" } },

		dresses  :
		{ 
			"default" :
			{
				rules	: "The heros pull boxes of matching color."
			}
		}

	};



})();



( function( ) { 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

			var wrap = gio.data_io.add_gafions;
			gio.data_io.add_gafions = function ()
			{
				wrap();
				gio.data_io.download_gamion (
				{
					galfinition :
					{	penetrate_asingle	: true, 
						gafion				: true
					},
					common :
					{	link :	tp.core.app_webpath_noindex + '/' +
								gio.config.defpaths.ALBUMS_DEF_PATH +
								'/colortrain/album.jwon.txt',
					}
				});
			};

})();



( function( ) { 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

			var wrap = gio.data_io.add_gafions;
			gio.data_io.add_gafions = function ()
			{
				wrap();

				gio.data_io.download_gamion (
				{
					galfinition :
					{	penetrate_asingle	: true, 
						gafion				: true
					},
					common :
					{	link :	tp.core.app_webpath_noindex + '/' +
								gio.config.defpaths.ALBUMS_DEF_PATH +
								'/boximaze/album.jwon.txt',
					}
				});

			};

})();



(function( ){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};
	




	gio.def.albums['pullswappush'] = {

		dresses  :
		{ 
			"default" :
			{
				tile		: { width : 30, height: 30 },
				rules		: "The heros push boxes of matching color, pull boxes of lower color\nand swap with higher colors.",
				objective	: "Fill available targets",
			},


			"busytable" :
			{

					skin_key : 'pullswappush',
					chosen	: true,
					credits :
					{
						"title"		: "Busy Table"
					},
					tile	:{ width : 60, height: 60 },
					style	:{	play:{
										backgroundImage:'background.png',
										backgroundColor:''
								},
						},			
					rules		: "The heros push food of matching color, pull food of lower color\nand swap with higher colors.",
					objective	: "Put food on plate of own color",
					story		: 'It is already evening and heros are hungry. Help them to serve a dinner.',
					hname_table	:{
						hero_b	: 'rabbit',
						box_b	: 'cabbage',
						box_c	: 'carrot',
						wall_x	: 'vase'
					}

			},



			"pullswappush" :
			{

					skin_key : 'pullpush',
					chosen	: true,
					title	: 'Dinner',
					tile	: { width : 50, height: 50 },
					tile	:{ width : 60, height: 60 },
					style	:{	play:{
										backgroundImage:'background.png',
										backgroundColor:''
								},
						},			
					rules		: "The heros push food of matching color, pull food of lower color\nand swap with higher colors.",
					objective	: "Put food on plate of own color",
					story		: 'It is already evening and heros are hungry. Help them to serve a dinner.',
					hname_table	:{
						hero_b	: 'rabbit',
						box_b	: 'cabbage',
						box_c	: 'carrot',
						wall_x	: 'vase'
					}

			}

		}// dresses

	};



	gio.def.albums['co_pullswappush'] = {

		"env" : { "dress_akey" : "pullswappush" },

		dresses  :
		{ 
			"default" :
			{
				rules	: "The heros push boxes of matching color, pull boxes of lower color\nand swap with higher colors."
			},
			"pullswapppush" :
			{
					"rules"	: "The heros pull food of matching color, push food of lower color\nand swap with higher colors.",
			}

		}

	};



})();



( function( ) { 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
					var gio =  tp.gio    =  tp.gio   || {};

			var wrap = gio.data_io.add_gafions;
			gio.data_io.add_gafions = function ()
			{
				wrap();
				gio.data_io.download_gamion (
				{
					galfinition :
					{	penetrate_asingle	: true, 
						gafion				: true
					},
					common :
					{	link :	tp.core.app_webpath_noindex + '/' +
								gio.config.defpaths.ALBUMS_DEF_PATH +
								'/album.jwon.txt'
					}
				});
			};


})();



(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums[ 'mozaic' ] =
	{

		"gkey" : "whirly",

		"collections" : 
		[

		]
	}

})();

(function( $ ){		var tp		= $.fn.tp$ = $.fn.tp$ || {};	
					var gio		= tp.gio   = tp.gio   || {};
					var core	= tp.core;
					var smode	= gio.modes.sta_tic;
	gio.session.server.refresh_state = function(reset_gui){

		if( smode.db ){
			ww = gio.session.server;
			core.download_object(	
					smode.db + '/albums?server_message=yes',
					ww, 'message'
			);
			if(gio.session.server.message.loggedin) gio.config.advertisement.enabled=false;
		}

		if(gio.config.google_apps.reset_ad_visibility) gio.config.google_apps.reset_ad_visibility();
		if(reset_gui){
			gio.core.procs.update_top_links();
			var gm = gio.getgs().gm;
			if(gm) gio.gui.procs.adjustDispositionsByBrowserWindow(gm);
		}
	};


	(function(){
		var ww = core.getQueryPar('db');
		if( ww ){
			if( typeof ww === 'string'){
				smode.db = ww === 'no' ? '' : ww;
			}else{
				smode.db = 
						window.location.protocol+'//'+
						window.location.host;
			}
		}
		gio.session.server.refresh_state();

	})();


})(jQuery);



(function(){ 	var tp		=  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio		=  tp.gio    =  tp.gio   || {};
				var ads		=  gio.config.advertisement;
				var ggaps	=  gio.config.google_apps;

	ggaps.track = {};
	ggaps.track.variable = function( variable, value ) {

			if(!ggaps.enabled) return;

			if(gio.debug) gio.cons_add("Sending to GA: " + variable + "=" + value);

			_gaq.push(['_setCustomVar',
		      	1,					// To occupy slot 1? Required.
		      	''+variable,		// User activity.  Required.
		      	''+value,			// Value. Required.
		      	2					// Session level scope. Optional.
			]);

			_gaq.push(['_trackEvent',
				'Navigation',		// Category
				''+variable,		// Action
			]);
	};		
	ggaps.track.play_event = function( category, action, value ) {

			if(!ggaps.enabled) return;

			if(gio.debug) gio.cons_add("Sending event to GA: " + category + ',' + action + ',' + value);

			var arg = ['_trackEvent', category, action];
			if(value) arg[4] = value;
			arg[5] = true; // skip bounce count
			_gaq.push(arg);
	};		
	ggaps.init_analytics = function(){
		if(!ggaps.enabled) return;
    
	    var _gaq = window._gaq = window._gaq || [];
	    _gaq.push([    '_setAccount',   ggaps.host['_setAccount'] ]);
	    _gaq.push(['_trackPageview']);

	    (function() {
			var ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' == document.location.protocol ?
								'https://ssl' : 
								'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(ga, s);
	    })();


	};
	ggaps.init_analytics();

	ggaps.insert_ad_div_with_script = function(){
			if(!ads.enabled) return;
			var ad_script = "" +
				"<div id=\"google_ad_receiver\">" +
				"	<script type=\"text/javascript\">" +
				"		(function(){ " +
		 		"			var ww = jQuery.fn.tp$.gio.config.google_apps.ad;" +
		        "    		 window.google_ad_client	= ww.google_ad_client;" +
		        "    		 window.google_ad_slot		= ww.google_ad_slot;" +
		        "    		 window.google_ad_width		= ww.google_ad_width;" +
		        "    		 window.google_ad_height	= ww.google_ad_height;" +
				"		})(); " +
				"	<" + "/script>" +
				"	<script	type=\"text/javascript\" " +
				"			src=\"http://pagead2.googlesyndication.com/pagead/show_ads.js\" >" +
				"	<"+"/script>" +
				"</div>";
			document.write(ad_script);
	};




	ggaps.reset_ad_visibility = function()
	{
		if( !ads.divs.wrap ) return;
		ads.divs.wrap.style.display	= ads.enabled ? 'block' : 'none';

		/*
		var this_function_fails = true;
		if(this_function_fails) return;
		if(!ads.streaming_started){
			ads.streaming_started = true;
			var ww = ggaps['landkey.net'];
			window.google_ad_client	= ww.google_ad_client;
			window.google_ad_slot	= ww.google_ad_slot;
			window.google_ad_width	= ww.google_ad_width;
			window.google_ad_height	= ww.google_ad_height;
			var script				= document.createElement('script');
            script.setAttribute('type', 'text/javascript');
			script.src				= "http://pagead2.googlesyndication.com/pagead/show_ads.js";
			ads.divs.receiver.appendChild(script);
		}
		*/
	};
	ggaps.create_ad_divs = function()
	{
		if(!ads.enabled) return;

		var style = ads.style_and_settings.ad_wrapp;
		var wrap			= ads.divs.wrap = document.createElement('div');
		wrap.id				= 'ad_wrapp_debug';
		wrap.style.position	= 'absolute';
		var ww				= wrap.style;
		ww.top				= style.top + 'px';
		ww.width			= style.width + 'px';
		ww.height			= style.height + 'px';
		ww.backgroundColor	= style.backgroundColor;
		ww.color			= style.color;
		ww.overflow			= style.overflow;
		ww.display			= 'none';
		gio.domwrap.regions.dcenter.appendChild(wrap);
		var style				= ads.style_and_settings.ad_subwrap;
		var subwrap				= document.createElement('div');
		subwrap.style.position	= style.position;
		subwrap.id				= 'ad_subwrap_debug';
		var ww					= subwrap.style;
		ww.position				= style.position;
		ww.top					= style.top + 'px';
		ww.left					= style.left + 'px'
		ww.width				= style.width + 'px'
		ww.height				= style.height + 'px'
		ww.paddingTop			= style.paddingTop + 'px';
		ww.fontSize				= style.fontSize;
		ww.fontWeight			= style.fontWeight;
		ww.fontFamily			= style.fontFamily;
		ww.backgroundColor		= style.backgroundColor;
		ww.color				= style.color;
		ww.textAlign			= style.textAlign;
		subwrap.innerHTML		= style.warning;
		wrap.appendChild(subwrap);
		var receiver = ads.divs.receiver = document.getElementById('google_ad_receiver');

		var style				= ads.style_and_settings.ad_receiver;
		receiver.style.position	= style.position;
		var ww					= receiver.style;
		ww.position				= style.position;
		ww.top					= style.top + 'px';
		ww.left					= style.left + 'px';
		ww.paddingTop			= style.paddingTop + 'px';
		ww.paddingLeft			= style.paddingLeft + 'px';
		ww.paddingRight			= style.paddingRight + 'px';
		ww.paddingBottom		= style.paddingBottom + 'px';



		subwrap.appendChild(receiver);
	};//create_ad_divs



})();



