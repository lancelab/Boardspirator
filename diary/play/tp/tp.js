
( function () {


	//	//\\//			Core application which wraps the rest of modules and plugins inside its namespace.

	var topNameSpace	= 'tp$';


	var tp = window[ topNameSpace ] = window[ topNameSpace ] || {};



	///	Convenience function.
	//	Checks dependency.
	//	Input:	arguments are names except optional parent which is an object.
	tp.checkDependency = function ( dependee, dependencies, parent )
	{
		parent = parent || tp;
		for( var ii=0; ii < dependencies.length; ii++ )
		{
			if( !parent[ dependencies[ii] ] )
			{
				alert( 'Module "' + dependee + '" cannont be loaded before module "' + dependencies[ii] + '" is loaded. ' );
				return false;
			}
		}
		return true;
	};	




	/// Primodal event binder
	tp.bindEvent = function ( eventName, element, callback ) 
	{
		if ( element.addEventListener )
		{
			element.addEventListener( eventName, callback, false );

		}else if ( element.attachEvent ) {

			elem.attachEvent( "on" + eventName, callback );
		}
	};



}) ();

