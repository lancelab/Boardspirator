
	# //\\// regexes a folder in place


	#run this file from command line like:
	#ruby parse_test_folder.rb





	## //\\ files ###########################

	me						= File.expand_path(__FILE__)
	source_folder			= File.dirname( me )

	#. target folder to convert
	test_folder				= source_folder + '/../factory'
	#.	do test this 
	#	like this
	#test_folder				= source_folder + '/tp/test_folder'

	#. in case we need to log activity to this file
	result_file_path		= source_folder + '/test2/result.txt'

	puts "TARGET = " + test_folder + " LOG = " + result_file_path

	#. folders to skip
	forbidden_folders		= '=factory=feeder=skipme='

	#. file extensions to skip
	forbidden_extensions	= /\.png$|\.gif|\.jpg$/


	#: selects file by whirly_mark at the beginning of file text
	whirly_mark				= /^\s*\/:/
	whirly_mark				= /./		# selects all

	#: selects file by matching path to file
	placer_match			= /albums\/([^\/]+)\/collections\/([^\/]+)\/([^\/]+)$/
	placer_match			= /./		# selects all


	## \\// files ###########################






	## //\\ catchers ###########################

	to_catch				= /^\s*:::\.\s*credits\.([^\s:\r\n]+)(\s*)(:)*([^:].*$|\s*$)/i

	to_replace_beginning	= "/:\n{ \"credits\" :\n\t{\n"
	to_replace_end			= "\n\t}\n}\n/\\\\"
	
	#not used in final version
	#to_replace				= "\t\t/, \\1\\2\t\\4"


	# //\\ test cases
=begin
	puts "to_catch=" + to_catch.to_s + " to_replace=" + to_replace

	test = ' :::. title     : value '
	puts test.gsub( to_catch, to_replace )

	test = ' :::. title     :value2 '
	puts test.gsub( to_catch, to_replace )

	test = ":::.\t\ttitle\t\tvalue2 "
	puts test.gsub( to_catch, to_replace )

	test = ":::.\t\tti\ntle\t\tvalue2 "
	puts test.gsub( to_catch, to_replace )

	exit
=end
	# \\// test cases

	## \\// catchers ###########################






	#. to pollute output with words
	verbose					= false

	#: dependencies
	require(source_folder + '/tp/organizer.rb')
	#require(source_folder + '/tp/dig.rb')


	#: logging
	result = ''
	result_counter = 0;




	#// WORKER
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



					max_count = 0
					converted = '';

					fname = abs + '/' + rel
					#... perhaps wrong about the DOS b flag:
					#http://stackoverflow.com/questions/3682359/what-are-the-ruby-file-open-modes-and-options
					File.open( fname, 'rb+' ) do |f|
						text = f.read

						if text.match( whirly_mark );

							#converted = text.sub( to_catch, to_replace_beginning )
							#converted = converted.gsub( to_catch, to_replace )
							sub_counter = 0;
							text.gsub( to_catch ) do |match|
								sub_counter += 1;
							end
							max_count = sub_counter
							sub_counter = 0;
							if max_count > 0 

								converted = text.gsub( to_catch ) do |match|
									sub_counter += 1;
									#puts '' + sub_counter.to_s + match.to_s + "  1=" + $1 + " 2=" + $2.to_s + "  3=" + $3.to_s + " 4=" + $4.to_s + "\n\n"
									replacer =  "\t\t/"
									replacer =  to_replace_beginning + replacer if sub_counter == 1
									replacer += sub_counter == max_count ? '.' : ','
									replacer += "\t" + $1 + $2 + "\t" + $4
									replacer += "\n" + to_replace_end if sub_counter == max_count 
									#puts "\n*******replacer=\n" + replacer + "\n*********"
									replacer
								end
								#fails. when new file is smaller ?
								#f.rewind
								#f.write( converted )

								result_counter += 1;
								result << ",\n" if result_counter > 1 
								#result <<		"    converted: " + name + "\n" + converted
							end
						end
					end

					if max_count > 0 
						File.open( fname, 'w' ){ |f| f.write( converted ) }
					end

				end
			end
		end
	end





	# //\\ Finalizer

	page_head=<<HEAD_OF_TEXT
Log:
HEAD_OF_TEXT

	page_bottom=<<BOTTOM_OF_TEXT
End of log.
BOTTOM_OF_TEXT


	page = page_head + result + "\n" + page_bottom
	#puts "Result=\n" + result
	#File.open( result_file_path, 'w' ){ |f| f.write( page ) }

	puts result_counter.to_s + " files processed "

	# \\// Finalizer

