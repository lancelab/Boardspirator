<?php

	// Gets text content of external Web page
	// referenced in query string by 
	// key-value pair in format:
	// 		user_requested_link=XXlink
	// where link is a target link.



	//e rror_reporting(E_ALL);
	//i ni_set('display_errors','1');



	//Strips magic quotes if this mode is set:
	function strip_mq($s) {
		if(get_magic_quotes_gpc()) {
			return stripslashes($s);
		} else {
			return $s;
		}
	}

	// Returns key's value or '' if missed or problems.
	function getValue($key){
		if( !array_key_exists($key, $_REQUEST) )return '';
		$value=trim($_REQUEST[$key]);
		return strip_mq($value);
	}


	$link = getValue('user_requested_link');
	$link = substr($link,2);


	$content = <<<EOS
:::colorban
:::failed loading collection from external source: 
"$link"
is this link valid?

No maps available. Site load failed.

#--#--##--#--#-###
#--#-#--#-#--#-#--
##-#-0--X-##-#-##-
#-##-#--#-#-##-#--
#--#--##--#--#-###

EOS;

	if($link){
		$session = curl_init($link);						
		curl_setopt($session, CURLOPT_HEADER, false); 	    
		curl_setopt($session, CURLOPT_RETURNTRANSFER, true);


		// ------------------------------------------------------
		// Apparently fails on outdated PHP version:
		// curl_setopt($session, CURLOPT_TIMEOUT_MS, 10);

		// Possibly enough to load: modern sites are fast, and
		// file must be simple:
		curl_setopt($session, CURLOPT_TIMEOUT, 10);
		// ------------------------------------------------------



		// ------------------------------------------------------
		// No solution:
		// check data exists: http://stackoverflow.com/questions/4095193/check-that-file-exists-on-different-domain-without-reading-it
		// http://stackoverflow.com/questions/9062798/php-curl-timeout-is-not-working
		// CURLOPT_CONNECTTIMEOUT_MS: Added in cURL 7.16.2. Available since PHP 5.2.3.
		// if (!defined(CURLOPT_CONNECTTIMEOUT_MS)) define('CURLOPT_CONNECTTIMEOUT_MS', 156);
		// curl_setopt($session, CURLOPT_CONNECTTIMEOUT_MS, 10);

		curl_setopt($session, CURLOPT_CONNECTTIMEOUT, 4);
		// ------------------------------------------------------


		$returned = curl_exec($session);

		if(curl_errno($session)){
		 	$content .= "\n";
			// uncomment for debug:
		 	//$content .= "\n".'debug: ' . 'error:' . 
			//			curl_errno($session) . ' ' . curl_error($session);
		}else{
			$content=$returned;
		}
 		curl_close($session);
	}

	header("Content-Type: text/plain");
	echo $content; 

?>
