#?/usr/bin/ruby
#replace ? with ! in the first line and set permissions to executable to run this file standalone as ./file-name



# =========================================================================
#
# This module takes development index...htm file, scans its <script> tags, 
# accomulates all the scripts in one file and rewrites index...htm file
#
# usage: $ruby run.rb
#
# =========================================================================


	# require File.expand_path('../tp_ruby/dig.rb',__FILE__)
	require File.expand_path('../source_files_scanner.rb',__FILE__)

	#. target
	file_name = File.expand_path('../../index.htm',__FILE__)
	#: destinations
	# this works, but without Ruby doc. available for Ruby syntax, is a dangerous step:
	# tfolder = ARGV[0] || 'alpha'
	# more on the problem:
	# the only grammar: 
	# http://stackoverflow.com/questions/4360810/ruby-operator-method-calls-vs-normal-method-calls
	# http://stackoverflow.com/questions/2258673/operators-and-methods-in-ruby

	tfolder = ARGV[0] ? ARGV[0] : 'alpha'

	scaffold = File.expand_path('../../' + tfolder, __FILE__) + '/'

	production_file_name = scaffold + 'index.htm'
	prod_script_path_from_page = 'prod/app.js'
	production_script_name = scaffold + prod_script_path_from_page

	# input of deployer
	web_page = ''

	# ** outputs of deployer
	product			= ''
	product_scripts = ''

	# ** search keys
	keys		= 	[	/<script[^<]+\ssrc="([^"]+)"[^<]*<\/script>/,
						/<\/head>/
					]

	# ** sets replacements
	file_to_replace = 'core/config.js'
	replacement_pair =	[	
							# ** activates google application suite
							/^\s*enabled\s*:\s*(\w*),\s*\/\/\s*\*DONT-REMOVE-THIS-DEPLOYER-MACRO\*gio\.config\.google_apps\*\s*$/,
							"\t\t\tenabled			: true,"
						]	

	# * to remove one line comments
	one_line_comment =	/^\s*\/\/.*\n/
	one_line_comment_replacement = ''


	begin

		File.open(file_name,'r+') do |f|
			web_page=f.read
		end

		source_scanner = SourceFilesScanner.new

		state		= 'begin'
		source_scanner.scan_infinitely(web_page, 0, keys) do |p,t,s,i,m|
			
			# i = index of regex which was caught
			# s = total value of expression which was caught (separator)
			# t = token before separator
			product += t if state == 'begin' or state == 'end'

			state = 'parsing' if m and i == 0 and state == 'begin'

			if m and i == 1 and state == 'parsing'
				state = 'end' 
				product +=	'<script type="text/javascript" src="' + prod_script_path_from_page +
							'"></script>' + "\n"
				product += t + s;				
			elsif state == 'parsing' and m and m[1]
				target_script = File.expand_path('../../'+m[1],__FILE__)
				File.open(target_script,'r+') do |f|

					text = f.read
					# ** performs replacements
					if m[1] == file_to_replace
						match = text.match(replacement_pair[0]);
						text.sub!(replacement_pair[0],replacement_pair[1]);
					end
					text.gsub!(one_line_comment, one_line_comment_replacement)

					product_scripts += text + "\n"
				end
			end

			puts "got link #{m[1]}" if m and i == 0
			puts "got end #{m[0]}"  if m and i == 1
		
		end

	    File.open( production_file_name, 'w' ){ |f| f.write(product) }
	    File.open( production_script_name, 'w' ){ |f| f.write(product_scripts) }



	
	rescue Exception => e
		raise Exception, "Failed rebuild file #{file_name}. #{e}"
	end



=begin

	# code for testing
	test =<<EOFTEXT

	<html><script type="text/javascript" src="moo1"></script>
		<script type="text/javascript" src="moo1"></script>
		<script type="text/javascript" src="moo1"></script>
	</head>

	EOFTEXT

=end
