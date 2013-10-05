---
title: Volume Notifications
layout: post
---



Wrote a script to update my xmobar whenever the volume changes. Previously this was based on writing to a FIFO whenever I changed the volume. That worked, but only within my account. Other users could change the volume and I wouldn’t know until I made noise. Prior incarnations simply polled amixer.

Anyway, this script is post worthy because it does 3 things that are new for me.

```sh
#!/bin/sh

# Prints volume changes to stdout.
# Depends on inotify-tools package

SOUND_DEV="/dev/snd/controlC1"

volume() {
  amixer -D default sget Master,0 \
  | grep dB \
  | head -n 1 \
  | cut -f 7 -d " " \
  | sed -e's/\[//g' -e 's/\]//g'
}

# loop only runs when inotify didn't fail (not present on all systems)
# and when parent process is xmobar. this _should_ ensure script quits after xmonad resets
while [ $? -eq 0 ] && [[ $(ps p $PPID | grep xmobar) ]];
do
  volume
  inotifywait $SOUND_DEV -e ACCESS -e CLOSE_WRITE > /dev/null 2>/dev/null
  done

# also check PID of parent. if that's gone or not xmobar, bail.
```

[ $? -eq 0 ] – Okay, checking the exit status isn’t that new to me. But doing it as the condition in a loop is. Maybe I learned something from that perl book after all. Anyway, I was worried that inotify-tools was non standard and I didn’t want the script looping forever if the package was missing.

ps p $PPID | grep xmobar – This is the other condition of the loop. This demands more explanation. I’m calling this script from xmobar, which is a panel for displaying output from my window manager. It’s not interactive, but shows a ton of information. I find it a lot easier to get this to do my bidding than something like gnome-panel which depends on applets. Anyway, xmobar has a CommandReader module that runs a script or program and shows its stdout. The problem is that whenever xmobar gets restarted another instance of my script gets run. Realistically this isn’t a big problem, but I wanted to try to fix it the right way.

My first idea was to store my script’s pid and kill any other instances of the script. But I’ve done that before and wanted to try something new. Instead, we use ps to check for $PPID. What is $PPID? It’s the pid of the parent of this process. In this case it’s the xmobar that spawned my script. We use grep to check that the process is still xmobar. If the original xmobar is killed, grep finds nothing and the loop ends. There is a chance that a second xmobar will spawn with the original pid, but that’s a low enough chance that I can’t be bothered to care.

Finally, inotifywait is why I wrote the script. inotifywait lets you monitor your filesystem. It will sit there blocking the script until certain events take place. When they do it tells me what those events were (although I’m ignoring them in this case and using inotifywait’s completion to mean its time for the rest of the script to run). It’s pretty straightforward, but I had no idea this package existed until earlier today.


