---
title: PHP multi_curl
layout: post
---

PHP’s multi_curl has the saddest documentation I’ve ever encountered. What should have been an afternoon project in total(or 10 minutes in bash with xargs -P) ended up being 2 days to figure out. Now that I think I know how multi_curl works I can start making it actually do something.

Anyway, I’m posting my code because there aren’t enough examples of this kind of code on the web IMO. What this does is grab content from a bunch of hosts. It does this in parallel so that the whole execution time is that of the slowest host. But it also lets you limit how many connections to use at once (meaning that it will be the speed of several of the slowest hosts). This is to prevent PHP from crapping the bed if you open more connections than you have file handles. No, this is not heavily tested, but it’s better than anything I’ve found on google for similar purposes.

```php
// Report simple running errors
error_reporting(E_ERROR | E_WARNING | E_PARSE);

// urls to grab
$hosts = array(
'http://google.com',
'http://whatismyip.org',
'http://fakedomainthatprobablyisntevenregistered.mil',
'https://google.com',
'https://whatismyip.org',
'https://fakedomainthatprobablyisntevenregistered.mil',
);

$curling = array(); //active curl handles
$done = array(); //store finished host => content
$mh = curl_multi_init();
$is_running = null;
$handle_limit = 3;

do {
  //fill up the curl queue at start of reqs and if any urls have finished
  while (sizeof($curling) < $handle_limit && sizeof($hosts) > 0) {
    $host = array_pop($hosts) ;
    $curling[$host] = curl_init( $host );
    curl_setopt( $curling[$host], CURLOPT_CONNECTTIMEOUT, 10 );
    curl_setopt( $curling[$host], CURLOPT_RETURNTRANSFER, true );
    curl_multi_add_handle( $mh, $curling[$host] );
  }

  // run curl
  curl_multi_exec($mh, $is_running);

  //pop finished hosts.
  //curl_multi_remove_handle also removes the downloaded data, so we stash it for later.
  $ready = curl_multi_select($mh);
  $info = curl_multi_info_read($mh);
  if ( $info && $info['msg']==CURLMSG_DONE ) {
    //copy response
    $host = curl_getinfo( $info['handle'], CURLINFO_EFFECTIVE_URL );
    $http_code = curl_getinfo( $info['handle'], CURLINFO_HTTP_CODE );

    /* only keep valid urls */
    if ($http_code) {
      $content = curl_multi_getcontent( $info['handle'] );
      $done[$host] = $content;
    }
#print_r(curl_getinfo($info['handle']));

    //remove from queue and close handles.
    curl_multi_remove_handle( $mh, $curling[$host] );
    curl_close( $curling[$host] );
    unset( $curling[$host] );
#echo "finished: $host\n";
  }

} while ($is_running>0);

foreach($done as $host => $content) {
#$results = curl_multi_getcontent( $curling[$i] );
#echo "$i:\n$results\n\n";
  echo "\n$host\n$content\n";
}

curl_multi_close($mh);

echo "\ndone\n";

?>

```
