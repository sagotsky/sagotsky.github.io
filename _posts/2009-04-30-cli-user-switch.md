---
title: CLI user switch
layout: post
---

The new gdm in Karmic Koala is deprecated and featureless.  It does not support this script.  I don’t know if other gdm’s will be so useless, but if you’re on Karmic, don’t waste your time with this one.

—-

I recently switched to xmonad but stuck with a gnome-panel due to my dependence on gnome’s user switcher applet and my girlfriend’s refusal to learn ctrl-alt-f8.  Google told me that several other people were stuck in this situation.

Anyway, I found a way to do ctrl-alt-f8 in the command line, provided you’re using GDM.

`gdmflexiserver -a -l -c "SET_VT #"`

Where # is the number of the virtual console you’d like to switch to.

I also wrote a script to get a list of running xservers, grep for a username, and switch to the first console owned by that user. It’s not robust or complete, but gdmflexiserver seems arcane so I’m publishing this anyway and hopefully someone will find it useful.

```
#!/bin/bash

# Takes an arg, switches to that user's gdm session or starts a new one
# if none is open

# needs to be -u user, -?h help
# needs option for locking

function usage() { sed -e 's/^  //' <<EndUsage
  gdmSwitch.sh usage:
    gdmSwitch.sh takes exactly one argument, which is a username.  If that username
    has an open xsession, switches to it.  This is kinda like a console version of
    gnome-switcher-applet except that (for now) it doesn't let you query for users
    and pick one.

    EndUsage
    exit 1
}

if [ $# -ne 1 ] ; then
  usage
  else
  NAME=$1
  VT=$(gdmflexiserver -c CONSOLE_SERVERS | sed -e "s/^.*$NAME,\([0-9]*\).*$/\1/")

  #check if we found a term or if the whole string didn't match by doing a character count
  N=$(echo "$VT" | wc -c)

  if [ $N -gt 2 ] ; then
    # no open session
    gdmflexiserver -a -l -c "FLEXI_XSERVER"
  else
    # switch to open session
    gdmflexiserver -a -l -c "SET_VT $VT"
  fi
fi
```
