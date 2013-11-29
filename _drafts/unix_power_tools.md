Unix Power Tools
================
http://docstore.mik.ua/orelly/unix/upt/index.htm

Here are the bits and pieces I wanted to reference later, without keeping a 1000 page tome around.

String editing (Colon) Operators
--------------------------------

In history substitutions there's another syntax for str sub.

```
$ echo /a/b/c
/a/b/c
$ echo $!:h
/a/b
```

That :h gives the head of the pathname.

*This only works on history subs, which I don't do much of.  Revisit when I get around to learning those.*

History substitution
--------------------

!:n* grabs the last n args from the previous command

Do-over
------

`fc` lets you fix a command.  It opens the previous command in $EDITOR and then executes it.  

See man bash for more

Suppressing background output
-----------------------------

(Hi nuvolaplayer!)

Stopped jobs noising up your terminal?  `stty -tostop` will silence them.

tpipe
-----

`tpipe` is like `tee` but instead of writing to stdout and a file it writes to stdout and a pipe.  Not sure where I'll use this (or where it appears in Ubuntu's repos...) but it seems like it'll be a lifesaver in three years when I've forgotten it.

Automatic directory setup/cleanup
---------------------------------

Not sure how I feel about this yet.  The idea seems clever so I'm holding onto it.  But it also seems like a dirty hack that might turn into a trap when I've forgotten about it.

By rewriting `cd` as a function it can execute custom scripts upon entering or leaving a directory.

```bash
cd() {
  test -r .exit.sh && sh .exit.sh
  builtin cd "$1"
  test -r .enter.sh && sh .enter.sh
}
```

Seems like a dirty hack.  But the one place where I might want this is for certain git directories.  My bash prompt is unwieldy.  It might be less so if I could tell the git portion of my prompt not to go looking for .git directories, unless a certain shell script had said otherwise.  

Still letting this one steep.

Filename wildcards
------------------

These are close enough to regexes without being exactly the same that they've always confused me.

Wildcard|Function
--------|--------
*|Match 0 or more characters
?|Match exactly one character
[abc]|Match any character listed in the brackets
[a-z]|Match any character in range in brackets
[!a-z]|Match any character not in the brackets.  
{aaa,bbb,ccc}|Match any of the comma separated words.  *This is shell expansion, not a wildcard, but can be used in the same way when looking for specific files*
?(abc)|Match 0 or 1 instance of word abc
*(abc)|Match 0+ instances of word abc
+(abc)|Match 1+ instances of word abc
!(abc)|Match anything that doesn't contain abc
^pat|Match anything that doesn't match pattern, pat.  Pat must contain a wildcard.

Note that wildcards ignore dotfiles unless you explicitly match for it.

Recently changed files
----------------------

alias lr='ls -lagFqt \!* | head'

Custom tests in find
--------------------

`find`'s -exec can behave as a test using the return value of the script it executes.  

So if I want to find older files and ! -newer is only matching older and equally old, -exec older.sh could do the trick.

File protection
---------------

Setting the sticky bit in a directory prevents people who don't own the directory from moving files around, although they can still edit those files.

`chmod 1777` for instance

Printing the unprintable
------------------------

`cat -v` and `od -c` (??) can display the unprintable characters found in files.  

Vim buffers
-----------

(It still surprises me I haven't learned these guys yet.)

`"f` uses the buffer named f.
`"f4yy` yanks 4 lines
`"fp` pastes from the buffer f

Also, you have buffers 1-9 as the last 1-9 deletions.  These are filled and cycled automatically.

Vim substitution confirmation
-----------------------------

On a substitution use /c flag to get asked abotu each sub.

Vim saving parts of files
-------------------------

`:200,$ w newfile ` Writes lines 200 and up to a new file
`:.,600 w newfile` Writes from the current line until line 600 into a new file.

`:w >> oldfile` Appends to a file.  Never thought to try this.

Vim multiple search
---------------------

`/Fungible/;/tacos/` Does one search then the other, matching fungible and then the first instance of tacos that follows.

Vim word abbreviations
----------------------

`:ab abbr phrase` Automatically expands abbr into phrase.  So...
`:ab teh the` Will correct all my instances of teh.

Bash pass
---------

`:` is like pass in php.  It does nothing but sometimes you need a nothing command.  Can be used in while to loop infinitely.

Bash parameter substitution
------------------------------

Ever miss the ternary operator when setting up bash vars?  Don't.

Operator|Explanation
--------|----------
`${var:-default}`|Use default if var isn't set or is empty
`${var:=default}`|As above, but also sets var to default
`${var:+instead}`|If var is set and not empty, use instead.  Else null.  (Why?)
`${var:?message}`|Use var or die with message.

Still not sold on :+ but the rest look great.

Debugging bash
--------------------

Use `#!/bin/sh -xv` shows what's happening as your shell reads the script.  Same as `set -x`?

Deprecated
==========

Alas, this book is around 20 years old.  Some of the stuff on it hasn't been updated.  The following items looked interested but I haven't been able to get them to compile or able to find modern copies

Super LS
--------

`sls` is like ls on steroids.  Actually it's like ls printf with formatting.

Grabchars
------------

`read` waits for enter.  If you just want y/n with no enter, grabchars returns after a single keypress.

If only I could remember what script I wanted this for...

Local db
--------

`index` can be used as a simple DB in your dotfiles.  Not easily googleable though so I may have to skip this one.

