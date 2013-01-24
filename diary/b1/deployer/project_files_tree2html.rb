
#run this file from command line like:
#ruby parse_test_folder.rb

me					= File.expand_path(__FILE__)
source_folder		= File.dirname( me )

#. do test this like this
#test_folder			= source_folder + '/tp/test_folder'

test_folder				= source_folder + '/..'
result_file_path		= source_folder + '/../doc/project_files.htm'
forbidden_folders		= '=factory=feeder=skipme=prod='
forbidden_extensions	= /\.png$|\.gif$/
verbose					= false


	require(source_folder + '/tp/organizer.rb')
	result = ''

	TPDirParser.scan( test_folder, '', 0, verbose ) do |abs, rel, name, isdir, action, depth|
		indent = "  " * ( depth + 1 )
		if isdir
			if forbidden_folders.index('=' + name + '=')
				action['dostop'] = true
		 		puts ( name + " ... skipped\n" ) if verbose
				next
			end
			result << indent + name + "\n"
		else
			if name.index(forbidden_extensions)
		 		puts ( name + " ... skipped\n" ) if verbose
			else
				result << indent + '<a href="../'+ rel + '">' + name + "</a>\n"
			end
		end
	end




	page=<<END_OF_TEXT
<!DOCTYPE html>
 <html><head>
  <!-- doctype for html 4 is only to satisfy IE -->
  
  <meta name="copyright" content="2011-2012 (c) Konstantin Kirillov">
  <meta name="description" content="Board Puzzle Framework"> 
  <meta name="keywords" content="board game, puzzle game, on line game, game development, educational game, sokoban"> 

  <title>Application Files</title>

  <link rel="stylesheet" href="css/readme.css">

</head><body><div style="color:#666666;"><pre>

	<h1>Project Files</h1>

	<h4>These files may be copyrighted. For license information, look at the file or "Credits" link on front page.</h4>

END_OF_TEXT

	page += result + "\n"
	page += "\n</pre></div></body></html>"

	puts "proj2html is done"
	#puts "Result=\n" + result

	File.open( result_file_path, 'w' ){ |f| f.write( page ) }



