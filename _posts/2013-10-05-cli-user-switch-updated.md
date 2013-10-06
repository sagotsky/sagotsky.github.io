---
title: (updated) CLI user switch
layout: post
---

[Last time]({% post_url 2009-04-30-cli-user-switch %}) we used gdm to switch between virtual terminals.  gdm3 still hasn't restored that feature, so here's what I've been using instead.

`chvt`

This command existed the whole time.  I guess I just found the gdmflexiserver option first.  Here's the script:

```sh
#!/bin/bash

# switch to a user or make a new login screen

if [ $# != 1 ] ; then
    echo 'Specify a user'
    exit 1
fi

USER=$1
SESSION=$(w | grep "^$USER.*gdm-session"

if [ "$SESSION" == "" ] ; then
    gdmflexiserver 
else
    TTY=$(echo $SESSION | cut -f 2 -d ' ' | tr -d '[:alpha:]' )
    sudo chvt $TTY
fi
```

The arg is a user name.  If it finds a session owned by that user, switch to it.  Otherwise start up a new session.  The only hairy bit is sudo.  I use this script from a keyboard shortcut, so entering a password is not ideal.  Got around that with visudo:

```
%sagotsky  ALL = NOPASSWD: /usr/bin/chvt
```

