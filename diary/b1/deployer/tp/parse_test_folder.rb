
#run this file from command line like:
#ruby parse_test_folder.rb

me			= File.expand_path(__FILE__)
parent		= File.dirname( me )
test_folder	= parent + '/test_folder'

require(parent + '/organizer.rb')


     verbose = false
     r = "\n"
     TPDirParser.scan( test_folder, '', 0, verbose ) do |abs, rel, name, isdir, result, depth|
       indent = "  " * ( depth + 1 )
       r << indent + rel
       r << (isdir ? ' is a directory ' : ' is a file ')
       if name == 'skipme' 
			result['dostop'] = true
	 		r << " ... skipped\n"
			next
	   end
       r << "\n"
     end

     puts "Scanner Result=\n" + r




