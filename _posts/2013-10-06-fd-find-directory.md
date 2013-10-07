---
layout: post
title: FD - find directory
tags: bash fd drupal
---

My favorite trick I taught bash is really stupid.  I almost didn't bother with it because it's so dumb it's hardly deserving of an alias.  Then I went and made it and liked it so much it lives in its own separate repository, outside of my dirty pile of dotfiles.  Here's fd:

[Github](https://github.com/sagotsky/fd/blob/master/fd.sh)

fd is short for find directory.  That's quite literally what it's for.  `cd $(find -type d -name $1)`  Hardly worth typing, but I use it every damn day.  Okay, I've added some more cruft than that, but this is how it started.

This function is great for when I know exactly what folder I want but I don't want to type out all that stuff in the middle to get there.  It's like having SublimeText's fuzzy search right in the middle of my terminal.  

That sounds lazy.  But look at my use case.  If I'm in my drupal root and I want to edit a box's class, I'm cd'ing into `profiles/openscholar/modules/os/modules/os_boxes/` before typing out the name of my box.  fd lets me type `fd os_boxes_mybox` and takes care of the rest.  Actually that's a lie.  Some of the cruft I mentioned is tab completion.  It lets me type `fd os_bo<TAB>my<TAB>` so I don't have to remember full paths, just how they start.

I was expecting this to be a lot slower, but it feels instantaneous as long as I use it in a project directory (not running it in ~).
