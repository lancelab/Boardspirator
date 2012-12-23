
#run this file from command line like:
#ruby parse_test_folder.rb

me			= File.expand_path(__FILE__)
parent		= File.dirname( me )
test_folder	= parent + '/test_folder'

require(parent + '/organizer.rb')


     d = File.expand_path(__FILE__)
     d = File.dirname(d) + 'test_folder'
     verbose = false
     r = "\n"
     TPDirParser.scan( test_folder, '', 0, verbose ) do |abs, rel, depth|
       indent = "  " * ( depth + 1 )
       r << indent + rel + " scanned\n"		
     end

     #puts "Scanner Result=\n" + r


     r = TPDirParser.scan_as_top_tree( test_folder, '', verbose )
     puts r.to_s

     #this works
     #require(parent + '/dig.rb')
     #r.dig
