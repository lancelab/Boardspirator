
	#run this file from command line like:
	#ruby parse_test_folder.rb

	me						= File.expand_path(__FILE__)
	source_folder			= File.dirname( me )
	#.	do test this 
	#	like this
	#test_folder			= source_folder + '/tp/test_folder'

	whirly_mark				= /^\s*:::\/\/definitions/
	placer_match			= /albums\/([^\/]+)\/collections\/([^\/]+)\/([^\/]+)$/

	test_folder				= source_folder + '/..'
	result_file_path		= source_folder + '/../def/albums/mozaic.js'
	forbidden_folders		= '=factory=feeder=skipme='
	forbidden_extensions	= /\.png$|\.gif$/
	verbose					= false



	require(source_folder + '/tp/organizer.rb')
	#require(source_folder + '/tp/dig.rb')

	result = ''
	result_counter = 0;

	TPDirParser.scan( test_folder, '', 0, verbose ) do |abs, rel, name, isdir, action, depth|
		indent = "  " * ( depth + 1 )
		if isdir
			if forbidden_folders.index('=' + name + '=')
				action['dostop'] = true
		 		puts ( name + " ... skipped\n" ) if verbose
				next
			end
		else

			if name.index(forbidden_extensions)

		 		puts ( name + " ... skipped\n" ) if verbose

			else

				pmatch  = rel.match( placer_match )
				if pmatch

					akey, ckey, fkey = pmatch.captures

					#::	here is the core part goes on
					#	fishing out self-controlled collections
					#

					fname = abs + '/' + rel
					File.open( fname, 'rb' ) do |f|
						text = f.read

						if text.match( whirly_mark );

							puts 'fkey match: ' + fkey

							result_counter += 1;
							result << ",\n" if result_counter > 1 
							result <<		"\t\t\t { \"list_title\" : \"" + fkey + "\", " + 
											"\"ref\" : { \"folder\" : { " +
											'"akey" : "' + akey + '", ' +
											'"ckey" : "' + ckey + '", ' +
											'"fkey" : "' + fkey + '" ' +
											" } } }"
						end
					end
				end
			end
		end
	end




	page_head=<<HEAD_OF_TEXT
(function(){ 	var tp  =  $.fn.tp$  =  $.fn.tp$ || {};	
				var gio =  tp.gio    =  tp.gio   || {};


	
	gio.def.albums[ 'mozaic' ] =
	{

		"gkey" : "whirly",

		"collections" : 
		[
HEAD_OF_TEXT


	page_bottom=<<BOTTOM_OF_TEXT
		]
	}

})();
BOTTOM_OF_TEXT


	page = page_head + result + "\n" + page_bottom
	#puts "Result=\n" + result
	File.open( result_file_path, 'w' ){ |f| f.write( page ) }

	puts result_counter.to_s + " gamion-collection(s) attached to app "



