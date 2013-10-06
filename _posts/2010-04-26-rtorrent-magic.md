---
title: Some light rtorrent magic
layout: post
tags: rss-torrents
---



This shouldn’t be difficult, but documentation is poor and scripting is unintuitive. Hopefully someone else will find this post useful.

I set up rtorrent to allow for better seeding. My previous config moved completed files to a new dir. rtorrent kept seeding from those (I guess because it still held the same filehandle), but if rtorrent ever got closed it lost the files. Since I’ve been shutting down the computer at night (a filthy practice, I know), I haven’t been a good little seeder.

This fixes that. Instead of moving completed files, we symlink them.

`on_finished = move_complete,"execute=ln,-s,$d.get_base_path=,~/torrents/finished/"`


Simple enough, right?

But I also didn’t want to have to clean up my symlinks and move files later. That should be done automatically. Thankfully rtorrent also gives the on_erase event. When you remove a file from rtorrent (which also cleans up the .torrent) it runs your on_erase event. I use this to move the files to where the symlink is.

Only it’s not that easy. mv won’t clobber a symlink. cp won’t copy either, realizing that the symlink points to the file you’re copying. rm followed by move seemed reasonable, but rtorrent gave me no way to concatenate “~/torrents/finished/” and $d.get_base_filename. (rtorrent also didn’t tell me $d.get_base_filename existed – I had to grab and grep their code to find that one).

Anyway, the only way I found to remove a file where the path and filename are separate arguments is to use find. I also could have made a script and called that from rtorrent, but I’m too stubborn for that.

```
on_erase = move_complete,"execute=find,~/torrents/finished,-name,$d.get_base_filename=,-maxdepth,1,-delete ;execute=mv,-u,$d.get_base_path=,~/torrents/finished"
```


A second execute= statement moves your downloaded files to where the symlink used to be. I’m still not sure why move_complete is used. There are other options for that, but I can’t tell if they make a difference and documentation on this is non-existent.

