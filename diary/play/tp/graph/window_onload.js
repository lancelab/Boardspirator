
( function () {



	var onload_original = window.onload;

	window.onload = function ()
	{

		if( onload_original ) onload_original();

		//.	Removes js warning
		var warning = document.getElementById( 'java-script-disabled' );
		if( warning ) warning.style.display = 'none';	


		tp$.graph.init(
		{

				//animation_is_allowed	: true,
				//use_setTimeout		: true,

				itemsMax			: 100,	// 2
				framesInCircle		: 500,	// 200
				animationInterval	: 20,
				boxMax				: 500,	// 300
				bodyRadiusMax		: 20,	// 100
				distance			: 200,
				scale				: 100

		});



		///	Sets dogo to stop/start on click.
		//	Sugar.
		document.body.addEventListener( 'click', function () {

					tp$.graph.animation_is_allowed = !tp$.graph.animation_is_allowed;

					//. Alternative debug
					//tp$.graph.do_trigger_animation( tp$.graph.animation_is_allowed );

					return false;
				},
				true
		);

	};



}) ();


