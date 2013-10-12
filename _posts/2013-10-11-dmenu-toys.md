---
title: Some dmenu toys
layout: post
tags: bash dmenu
---

[dmenu](http://tools.suckless.org/dmenu/) is one of my favorite stupidly simply programs.  It reads stdin, pops up a menu with each line as an entry, and returns the one you select.  I think I've mentioned this before.

I use it pretty often and have become addicated to writing small scripts with it.  None of them are worthy of their own posts, so I've bundled them up together here.  I've also included my keybinding, because why not.  Beyond the usual mod-x launcher, we've got...

cli-board
---------
 
[https://github.com/sagotsky/.dotfiles/blob/master/scripts/cli-board.sh](https://github.com/sagotsky/.dotfiles/blob/master/scripts/cli-board.sh)

`mod-y`

My snippets/templates/scripts clipboard copier.  This one reads in a directory as its input.  Selecting a file will either read or execute it, depending on if it's executable, and copy its contents or output to the clipboard.  Selecting a directory will use that as a directory instead.  I use it for templates and snippets.  I've also got an IP address one liner in there.

The best copy script in there is the one that takes a screenshot, sends it to imgur (with oauth no less, so my account can later edit the video) and returns the url in github flavored markdown.  Makes posting screenshots to work's issue queue a breeze.

cheat-sheet
-----------

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/cheat-sheet.sh](https://github.com/sagotsky/.dotfiles/blob/master/scripts/cheat-sheet.sh)

`mod-shift-y`

This one is pretty similar to cli-board.  The difference is that it shows me a text file and copies the line I select.  I use it more for quickly reading a file.  If I forget how to do tables in markdown, it's a few keypresses away.  This is the first time I'm using dmenu as display rather than for selecting.

dmenu-hist
----------

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/dmenu_hist.sh](https://github.com/sagotsky/.dotfiles/blob/master/scripts/dmenu_hist.sh)

I've seen a few rewrites that do this, but I found the wrapper pretty light.  This dmenu wrapper stores a history so that the next time you make the call, the most popular items are shown first.  It stores these counts in separate buckets.

fmarks
------

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/fmarks.sh](https://github.com/sagotsky/.dotfiles/blob/master/scripts/fmarks.sh)

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/fmarks.rb](https://github.com/sagotsky/.dotfiles/blob/master/scripts/fmarks.rb)

`mod-g`

This one reads bookmarks from firefox and opens the selected bookmark in whichever browser has focus.  

I sometimes like to explore new browsers.  Firefox has all my bookmarks (and keyword searches) synced via xmarks, so it always ends up as my master browser.  This script frees me from that.  You'll have to add browsers by name to the case in the bash script if they aren't supported yet.

rb-jump
-------

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/rb-jump.sh](https://github.com/sagotsky/.dotfiles/blob/master/scripts/rb-jump.sh)

`mod-m` play song

`mod-shift-m` enqueue song

`mod-ctrl-m` enqueue album

rhythmbox jump.  This one plays songs from my music library.  As far as I can tell this is everyone's first dmenu script once they realize it's good for more than launching programs.  One thing mine does that I haven't seen elsewhere is it can also be used to enqueue songs, or even whole albums

Oh yeah, it uses this one which is unrelated.

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/music-client.sh](https://github.com/sagotsky/.dotfiles/blob/master/scripts/music-client.sh)

music-client.sh isn't part of my dmenu setup, but it's what rb-jump is calling to control rhythmbox.  I have a few music players I use.  My multimedia keys call up this script, which tries to figure out which music player is running and control it. 
ssh menu
--------

```bash
HOST=$(grep '^host ' .ssh/config | cut -f 2 -d' ' | ~/scripts/dmenu_hist.sh ssh -l 10 -i -s 0 -sb '#cfb000' -sf '#000' -nf '#fff' -nb '#4a525a' -fn -*-  terminus-bold-r-*-*-16) && xterm -e 'ssh $HOST'
```

`mod-s`

I wrote this one out of spite.  It doesn't really save time over typing `ssh hostname`.  But someone was showing me a fancy dropdown he installed in OS X and I wanted to do it with a one liner.

All this does is read hosts from your `.ssh/config` (you do use `.ssh/config` and not a series of bash aliases, right?) pops open an xterm and sshes into that host.o

I think this is the only script here using the dmenu-hist option mentioned earlier.

xdgmenu
-------

[https://github.com/sagotsky/.dotfiles/blob/master/scripts/xdmenug.py](https://github.com/sagotsky/.dotfiles/blob/master/scripts/xdmenug.py)

`mod-shift-x` 

Oh hey, we're back to a launcher.  This one is different though.  Instead of reading from your `$PATH` it reads your gnome menu and lets you navigate that.

Wait, what?

Yeah, that kinda defeats the point of why I tried out dmenu to begin with.  Here's the thing.  There are some apps I lose track of, especially between distros.  There's a whole slew of configurators that have one name in debian but are prefixed with redhat-config- in redhat systems.  Sometimes I have to discover one of them in a menu in order to find it.  That's what this is for.

Ok, that's only part of it.  I've also bought all those Humble Indy Bundles that give me games and give charity my money.  Their installers put things in different places, some of which aren't in my path.  But they're pretty reliable about creating a menu entry.  

This reads your xdg menu and presents it in a dmenu.  Yes it will dive into folders.
