---
title: RSS Torrents re-redux
layout: post
---

I had a go at my own downloader.  It’s available at http://code.google.com/p/arrss/

It matches patterns in an RSS feed.  This lets you configure it for any RSS feed.  Configuration is still a little hairy but it works so far.

What I’m still a little shaky about is the episode/date comparison.  Users configure a regex to match the date/episode.  That regex includes several groups, which are concatenated together.  If they’re larger than the last download epi or date, the episode is considered new.  So a show with S02E12 would likely have a regex “S(\d{2})E(\d{2})” which returns 02 and 12 as the groups.  That show would be identified as 0212.  The show I’m using has its dates in YYYY-MM-DD format, so I get shows identified as 20080804.  This works reasonably well, but obviously won’t handle dates in other formats.

I like the elegance of treating episode numbers and dates the same.   It shouldn’t be too hard to throw in a group order option.  So a date in DD-MM-YYYY format would have a regex of “(\d{2})-(\d{2})-(\d{4})” and an order of “3,2,1″.  I just want to make sure this method works at all before imposing such an ugly config option.

