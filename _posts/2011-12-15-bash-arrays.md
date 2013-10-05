---
title: I finally used a bash array in a way that made sense and required no googling
layout: post
---



I’m not sure what’s wrong with me. In the past every time I’ve attempted to use an array in bash I reached the conclusion that arrays were the breaking point where I should give up and write a perl script instead. Finally found a case where the bash array was simple and reasonably elegant.

One of the constructs I find myself using on a daily basis is piping find into while read line, and then doing stuff with each line. In this case I was using sed to separate the file name and path to the file and then passing those off to some other functions. Seems like something find should be doing for me, don’t ya think?

Well, find does. Take a look at -printf in man find. Instead of printing the full path, you can tell find to give you whatever output you want. In my case I went with ‘%h %f\n’ which is the path, then the file.

Why does this make a difference? Because read has the -a option, which tells read to use an array instead of a scalar variable. Conveniently enough, array entries were delimited by a space.

The end result was that I could run the following:

```
find $PATH -printf '%h %f\n' | while read -a foo ; do
DIR=${foo[0]}
FILE=${foo[1]}
```

etc. It didn’t dramatically change the logic of what I was doing but cut out that sed cruft and removed any chance of me screwing up the regexes. And this will work for anything that find’s printf supports.

Alternatively, if remembered the indices of an array pisses you off, setting DIR=0 and FILE=1, would let you pretend to use an associative array by calling ${array[$DIR]} or something like that. I think I’d try this in a longer script, but it wasn’t necessary today so I haven’t actually tried it yet.

