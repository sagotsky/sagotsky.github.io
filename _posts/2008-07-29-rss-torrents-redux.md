---
title: RSS torrents redux
layout: post
tags: rss-torrents
---

I’m still using pytvshows and I’m pretty happy with it. The only problem is that it is limited to tvrss.net. I tried adding support for other RSS feeds, but it just wasn’t happening. tvrss.net only misses one of my shows (and a whole lot of the better half’s shows) so it’s not really a big deal.

I ditched my own scripts in favor of rtorrent though. I’ve even ditched other bittorrent clients in favor of rtorrent. It’s a terminal based torrent client designed for running inside of screen. I added a script to start this up to my /etc/rc2.d. rtorrent’s configuration allows you to set a watch directory and it downloads any torrent file you place in that directory. Guess where pytvshows points? It does some other weirdness with tying torrent files to shows and I don’t entirely understand what’s going on there, but out of the box it works and fighting with it only makes it not work.

What rtorrent does way better than any script I ever could have written is manage active torrent sessions. This is a huge deal since I’ve been cutting back on electricity consumption and no longer leave my computer running all the time (blasphemy!). Since rtorrent starts up automatically my torrents resume downloading whenever my machine comes back on.

rtorrent also has settings for stopping seeding after a certain ratio or number of hours has been reached. This is a nice touch, but I’m not totally sure it works and I’ve been removing things manually before they hit the limits anyway.

At any rate, here are the relevant lines from my .rtorrent.rc:

```
directory = ~/Video/rsstv/.torrents
session = ~/Video/rsstv/.session
schedule = watch_directory,5,5,load_start=~/Video/rsstv/.watch/*.torrent
schedule = untied_directory,5,5,stop_untied=
schedule = ratio,60,60,"stop_on_ratio=200,200M,200"
on_finished = move_complete,"execute=mv,-u,$d.get_base_path=,~/Video/rsstv/ ;$d.set_directory=~/Video/rsstv/"
```

It sets the download, session, and watch directory as well as schedules me for a 2:1 upload ratio or 200MB (useful for small torrents) or 2 days, and finally moves completed (but still uploading) torrents to a folder that isn’t hidden so I know when they’re done.

So far so good, but I suppose the real test comes in the fall when all my TV shows start up again. If that works then I’ll put some thought into finding a way to scrape other rss feeds for torrents.

