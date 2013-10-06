---
title: dmenu and rhythmbox
layout: post
---



dmenu is cool. For a while I’ve been wanting to use it to jump to new tracks in rhythmbox. Had I realized how easy it was, I’d have done this sooner.

```bash
#!/bin/sh

# selects song from dmenu, plays in rhythmbox

# must be same as path in rhythmbox, or else rb will add to library
MUSIC="$HOME/Music/"
DMENU_OPTS="-l 12 -b -i -fn -misc-fixed-*-*-*-*-20-*-*-*-*-*-*-* -sb #112 -sf #afc -nf #579 -nb #112"

SONGFILE=$( find $MUSIC -iname "*.mp3" | sed -e "s/\/home\/sagotsky\/Music//g" | dmenu $DMENU_OPTS )

if [ $? -eq 0 ] ; then
  rhythmbox-client --play-uri="$MUSIC/$SONGFILE"
fi
```

dmenu takes a newline separated text. You select one line from that text and dmenu returns it. Beautifully simple. So all this script does is find your mp3s and tell rhythmbox to play the one you select.

It needs to display the whole path to each file. I’ve been thinking of just printing genre/artists/album/song and then doing a 2nd find to add it. This seems like overkill though.

I added some sed to filter out the path to my music folder. Unfortunately this is hard coded into $SONGFILE. I’d love for it to be derived from $MUSIC, but the forward slashes don’t play well with sed. I’m sure there’s a way around this, but I don’t care all that much.

Also, if you point to a new location for an old file, rhythmbox will add it as a second copy. Just make sure you set $MUSIC to the same location that RB uses for your music and this shouldn’t be a problem.

