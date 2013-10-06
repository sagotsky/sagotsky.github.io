---
title: RSS torrents
layout: post
---



This is something I’ve been working on periodically for a month or two. To provide content for my XBMC media box I’ve been bittorrenting TV shows via RSS feeds. The concept is brilliant. Each show has its own feed and when a new episode comes out a new .torrent file appears for download.

Managing all this is way trickier than I expected though. I’m putting some actual thought into packaging up whatever scripts I write and distributing them for this purpose. Other people have solved this problem already, but not in ways that I find satisfactory. As far as I can tell, most RSS Torrent applications expect you to leave a GUI open whenever you’re downloading. If you’re into that kind of thing, fine, whatever. I want a daemon. I don’t particularly care to tell you why you should want a daemon too. All I know is I want to use my computer as usual and every so often have new TV shows appear in one of my video folders.

This requires three things. RSS feeds. An RSS feed reader to parse the feeds and give me .torrent files. And a torrent downloader to handle things once we have torrents.

RSS feeds were easy. http://tvrss.net provides exactly the RSS feeds we need. It doesn’t have everything though, but I’m more than happy to get started with just this site and then generalize later for things like mininova searches with RSS results.

Parsing the feeds was harder than expected, so I’m really glad that someone else did this for me. The problem that had me scared was figuring out which season and episode a particular torrent is. This is especially hard when different release groups use different labels. A few badass regexps could probably handle things, but I was willing to fold on this one and include a release group to search for with each show. PyTVShows does the job for me though. It’s a script that gets run from cron. Its config file (which introduced me to pyconfig – very cool!) keeps track of which episode is current. It even does this for daily shows, like .. umm … the Daily Show, which are date based rather than episode number based. My one complaint here is that PTS is hardcoded to look on tvrss.net and nowhere else. When you give it a show to download, all you do is give it search terms. PTS find the show itself. I gave it a feed override option, but found that mininova uses different elements and attributes in its attributes than tvrss.net. It looks like I’d have to write a separate handler for each tracker with its own format for RSS. Since I’m okay with only using tvrss for the time being, this isn’t a huge setback. Once I get downloading working right I’ll revisit this. I’m just hoping to find another RSS app before having to redo this portion itself.

Finally the torrents. I tried a number of clients, but one stood out. ctorrent. Why is ctorrent special? It lets you specify how long to seed before quitting. This is essential if I’m not going to intervene. ctorrent also does a reasonable job at giving me metadata from torrents before I start downloading them. I wasn’t expecting this to be important, but when some shows come in folders and others in avis, seeing the contents of the torrent before downloading it becomes vital.

ctorrent is not without problems though. Instead of quitting when it has seeded it crashes. I can’t figure out if this is normal behavior or not. The -X option for executing code when it finishes a download flat out doesn’t work (maybe because it crashed before it got to that point?). And most importantly, nobody has worked on it since 2006.

At any rate, everything works, but dubiously. Torrents don’t always delete themselves and videos end up in the wrong directory. There’s no way to automatically resume downloads if canceled prematurely. And I’m still stuck with rsstv (not that rsstv is bad, it’s just missing a couple shows (maybe I should work on providing those shows for rsstv rather than rewriting this mess)). I want to live with this for a couple months (testing takes a while when your shows come out once a week) before redoing it. I’m sort of hoping that I stumble into the cool kids table where everybody has been rss’ing their torrents the right way for years.

Right now I use two cronjobs to handle the actual downloads. I have an rsstv folder in my videos folder. PyTVShows is called once an hour to drop .torrent files into rsstv/.torrents/. Every four ours I run a script of my own to pick a torrent file, move that to rsstv/.incoming/ and download it. I figured these should run at an interval to help with the bandwidth. In theory a torrent whose sorted to the end could never download if the folder was populated with lower sorting torrents more often than every four hours. Given that I’m currently getting 2 TV shows a week, that’s not a concern. If it is I can always sort by mtime when picking a file.

Here’s the ctorrent script. It has a lot of debuggery messages in there at the moment that could probably be removed. Oh well.

```sh
#!/bin/bash
# run this as a cronjob to handle torrents pulled from RSS

#             ratio    hours  port   up    down
BT="ctorrent -E 1.5:1 -e 6 -p 34569 -U 20 -D 100 "
RSSTV="/home/sagotsky/Video/rsstv"
LOGFILE="/tmp/autoTorrent.log"

function download() {
    mv -v "$1" "$RSSTV/.incoming/"
    TORRENT=$(echo $1 | sed -e 's/^.*\/\(.*\.torrent\)/\1/')
    cd "$RSSTV/.incoming/"

    VID=$(ctorrent -x "$TORRENT" | grep "Directory" | sed -e 's/Directory: //')
    CHAR=$(echo $VID | wc -m)
    echo "Debuggery ... Torrent: $TORRENT" >>$LOGFILE
    echo "Debuggery ... VID: $VID" >>$LOGFILE
    echo "Debuggery ... CHAR = $CHAR" >>$LOGFILE

    if [ "$CHAR" == "1" ] ; then
      VID=$(ctorrent -x "$TORRENT" | egrep -i "avi|mpg|mpeg|mp4" | sed -e 's/^<[0-9]*>\W*//' -e 's/\W*\[[0-9]*\]$//')
    fi


    echo "" >> $LOGFILE
    echo "Downloading: $VID" >> $LOGFILE

    $BT "$RSSTV/.incoming/$TORRENT"
    if [ $? -ne 1 ] ; then
      echo "ctorrent fail" >> $LOGFILE
    fi

    mv -v "$RSSTV/.incoming/$VID" "$RSSTV/" >>$LOGFILE
    rm -v "$TORRENT" >> $LOGF

    echo "Finished $VID" >> $LOGFILE
    echo "" >> $LOGFILE
}

FILE=$(find $RSSTV/.torrents/ -iname "*.torrent" | head -n 1)
if [ "$FILE" != "" ] ; then
  download "$FILE"
fi
```

So, uh, is any of this worth developing? I’m not so interested in writing anything real. Just packaging and documenting things so anyone can get their TV torrents. Are there any better tools out there for what I’m doing?

