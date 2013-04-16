#!/bin/bash

################################################################
#
#  Finalizes package contents and
#  makes it ready to push to production as is.
#
#. Use it from running from this folder.
#  cd /var/www/METAP/apps/BOARD/board/public/play/deployer/
#
#
################################################################

ruby collections2mozaic.rb
ruby credits2html.rb
ruby project_files_tree2html.rb
ruby minifier.rb

