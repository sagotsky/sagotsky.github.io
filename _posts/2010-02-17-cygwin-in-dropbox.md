---
title: Cygwin in Dropbox
layout: post
---



I occasionally have to use windows for work.  I often end up using it for gaming.  If I ever try to get anything done in windows, unless I’m ssh’ing into a computer with a proper OS, I have to do it in cygwin.  But cygwin is slow and obnoxious to install.  And because I don’t use it often I don’t bother configuring a good environment for it.

Enter dropbox.  Useful for syncing files across machines.  Why not sync a cygwin installation?

The obvious way to do this is in a portable app.  Google tells me that Symbiosoft published a version.  Google does not tell me how to make that version work.  I mucked around with their scripts but didn’t get too far.  The version of cygwin they used is two years old and its packages can’t be updated anymore. Time to try making a portable version myself

This was easier than expected.  A default installation will work.  All you have to change is Cygwin.bat to reflect the changing location of Cygwin.

The version I came up with is this:

```
cd > tmpFile
set \p cygwin=<tmpFile
del tmpFile

chdir "%cygwin%\bin"
bash --login -i
```

The nonsense at the top is there because I couldn’t figure out how to run a command inside another for shell expansion.  Backticks or $(cmd) would work in a proper shell.  Unlike in linux, calling cd with no args tells you the current path, a la pwd.  chdir is wrapped in quotes because Dropbox installs to “Documents and Settings” by default, and the spaces are bad for windows.  Finally we run bash.  Feel free to replace this with “rxvt -e bash” to run a nicer terminal.

Happily this worked.  I’ve only tested on two windows installations, but that’s all I have access to so it’s good enough for me.  Dropbox installations had slightly different paths, which showed that the cd line was doing its thing correctly.

The only problem at this point was that Dropbox synced slowly.  Apparently there’s a lot of overhead between files, and cygwin has a lot of files.  The transfer (I went with defaults plus cvs, ssh, vim, and zip) was 148mb, but took several hours.  The dropbox daemon said it was going at 2.6k/s.  If I ever need a terminal fast it would be more efficient to install a new cygwin, but for machines I use regularly this was fine.

There was one other problem that I consider my own damn fault.  I had a different username at home and at work.  Cygwin reflected this, so my profile did not mirror itself.  I ended up making a symlink in /home.  I’m not sure how that will work out, but if it’s problematic I’ll just change usrnames.

– edit –

Ran into more username problems.  This time it was the same name being problematic.  /home/username was fine, but the /etc/passwd and /etc/group entries weren’t.  What I ended up doing is creating /etc/passwd.d and group.d and putting a file in there for each host I use.   Then I wrote a script to copy over the current host settings to /etc/passwd and group (originally I used a symlink, but that apparently doesn’t work for /etc/passwd).  The script also makes a settings file for the current host if none exists.  I didn’t bother figuring out what to do if there are machines that share a hostname.  I suppose that instead of basing it on the host you could use mac address or something.  Finally I edited /etc/profile (which is where the annoying mkpasswd.exe errors come from) and called my script in place of all the echoed errors at the bottom.  Now instead of griping about group errors, cygwin silently fixes them.  Note that this script WILL bludgeon any /etc/passwd and /etc/group files you already have.  I would never run this on a real linux machine, but for a terminal inside of a toy OS I don’t think it’ll do any harm.

Here’s the script. Consider this a work in progress.:

```
#!/bin/sh

# this script attempts to handle /etc/passwd and /etc/group in a portable
# cygwin installation.  it does so by making /etc/{passwd,group}.d and filling
# those with configs for each host, then symlinking to the current host.
# this is ugly but serviceable.  

# call this script from /etc/profile.  the case near the bottom
# handles mkpasswd errors.  just comment out the echoes and call
# this script instead.

echo "Fixing /etc/{mkpasswd,group} for this cygwin host."

HOST=$(hostname.exe)

  for FILE in passwd group ; do
  rm /etc/${FILE}

# check for .d directories - create if missing
  if [ ! -d "/etc/${FILE}.d" ] ; then
  mkdir /etc/${FILE}.d
  fi

# check for local files - create if missing
  if [ ! -f "/etc/${FILE}.d/${HOST}" ] ; then
  mk${FILE}.exe -l > /etc/${FILE}.d/${HOST}
  fi

  cp /etc/${FILE}.d/${HOST} /etc/${FILE}

  done
```


