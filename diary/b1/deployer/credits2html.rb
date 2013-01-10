
	# //\\// Converts skin-credits to html


	#run this file from command line like:
	#ruby parse_test_folder.rb

	me					= File.expand_path(__FILE__)
	source_folder		= File.dirname( me )

	#. do test this like this
	#test_folder			= source_folder + '/tp/test_folder'

	placer_match			= /skins\/([^\/]+)\/credits\/index.txt$/

	#. title must have : at the end
	title_m					= /^\s*([^:=]+)\s*(?::)\s*$/i
	#.	key must be followed by a separator; separator must be : or =
	#	= will result in wrapping a value into html-anchor-tag
	credit_m				= /^\s*([^:=]+)\s*(:|=)\s*([^:=\s](.*\S)*)\s*$/i
	file_m					= /^\s*file\s*$/i

	@anchored_keys			=
	[
		/^\s*downloaded\s*from\s*$/i,
		/^\s*contributor\s*profile\s*$/i,
		/^\s*author\s*profile\s*$/i,
		/^\s*profile\s*$/i,
		/^\s*License Downloaded Text\s*$/i,
		/^\s*License Link\s*$/i,
		/^\s*downloaded\s*$/i
	]

	@public_domain_lic_txt_link = "licenses/CreativeCommons1.0/legalcode.txt"

	### helps to decide to anchor or not
	def is_anchored ( string )
		@anchored_keys.each do |reg|
			return true if string.match( reg ) 
		end
		return false
	end

	path_from_here_to_skins	= "../def"
	test_folder				= source_folder + '/' + path_from_here_to_skins
	result_file_path		= source_folder + '/../doc/credits.htm'
	forbidden_folders		= '=factory=feeder=skipme='
	forbidden_extensions	= /\.png$|\.gif$/
	verbose					= false


	require(source_folder + '/tp/organizer.rb')
	#require(source_folder + '/tp/dig.rb')

	result = ''
	#.	is a flag for opened item's table
	#	item's title value
	title_v = nil
	license = ''

	def close_previous_item( license, result )

		res = ''
		#::	we have unclosed of previous item in the same file.
		#	Let's close its table
		if license == ''
				res << "<tr><td>License:</td><td>Public Domain</td></tr>\n"
				res << "<tr><td>License Text:</td><td><a href=\"" + 
				@public_domain_lic_txt_link + "\">" + 
				@public_domain_lic_txt_link + "</a></td></tr>\n"
		end

		res << "</table><br><br>\n"
	end


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

					skin = pmatch[1]

					#::	here is the core part goes on
					#	fishing out self-controlled collections
					#

					title_v = nil

					fname = abs + '/' + rel

					#/// processes a file
					File.open( fname, 'rb' ) do |f|
						text = f.read
						flines = text.split(/\r\n|\n/);


						result << "<h2>" + skin + "</h2>\n"

						# //\\	now, we have a text #####################
						#		do parse it and collect credits


						flines.each do |line|

							title_r = line.match( title_m )
							if title_r
								
								result << close_previous_item( license, result ) if title_v
								result << "<table>\n"
								title_v =  title_r[1]
								license = ''

							#/// we are in item-parsing-zone
							elsif title_v
								
								credit_r = line.match( credit_m )

								#/// parses encoutered credit-line
								if credit_r

									credit_k = credit_r[1]
									credit_s = credit_r[2]
									credit_v = credit_r[3]

									license = credit_v if credit_k.strip.downcase == 'license'

									if credit_v 
										credit_v = credit_v.gsub("\\n", "<br>").gsub("\\\\", "\\")
									end

									if is_anchored( credit_k ) or credit_s == "="
										credit_v = "<a href=\"" + credit_v +"\">" + credit_v + "</a>"
									end

									#// builds image sugar
									if credit_k.match( file_m )
										image_path = File.dirname( path_from_here_to_skins + "/" + rel ) # + "/" + credit_v
										image_path += '/' + credit_v
										credit_k =	"<a href=\"" + image_path + "\">" +
													"<img src=\"" + image_path + "\"></a>"

										credit_v =	"<a href=\"" + image_path + "\">" +
													title_v + "</a>"
									else
										credit_k += ':'
									end							

									result << "<tr><td>" + credit_k + "</td><td>" + credit_v + "</td></tr>\n"
								end	#/// parses encoutered credit-line
							end #/// we are in item-parsing-zone
						end

						result << close_previous_item( license, result ) if title_v

						# \\//	now, we have a text #####################

					end #/// processes a file
				end
			end
		end
	end




	page_head=<<HEAD_OF_TEXT
<!DOCTYPE html>

<html><head><title>Credits</title>

  <meta name="copyright" content="2011-2012 (c) Konstantin Kirillov">
  <meta name="description" content="Board Puzzle Framework"> 
  <meta name="keywords" content="board game, puzzle game, on line game, game development, educational game, sokoban"> 

  <link rel="stylesheet" href="css/credits.css">

</head>

<body>

<a class="menu" href="../">PlayZone</a> <a class="menu" href="guest_readme.htm">Readme</a> 


<h1>Credits</h1>

These images are used in the entire framework.<br>
Subdivision to following skins is approximate.<br><br>



HEAD_OF_TEXT


	page_bottom=<<BOTTOM_OF_TEXT

</body></html>
BOTTOM_OF_TEXT


	page = page_head + result + "\n" + page_bottom
	#puts "Result=\n" + result
	File.open( result_file_path, 'w' ){ |f| f.write( page ) }

	puts "Credits are done"



