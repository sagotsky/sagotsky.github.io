---
title: Firefox 3 FTW
layout: post
tags: foss
---



Since Foxmarks let me into their beta program I’ve been experimenting with Firefox3 beta5.  The one feature I’ve been looking forward to more than anything else is better SVG support.  Once I settled into the browser I started updating my SVG project, GameFace, so it’ll work with Firefox3.

It didn’t take long till I found a bug.  I have a 30×30 inch SVG doc that loads in a div that is much smaller than 30×30 inches.  In firefox2 the SVG doc had scrollbars so you could navigate around the image.  Firefox3 does not.  No matter what I did they wouldn’t show up.

So I filed a report with bugzilla.  Within 15 minutes I got a reply.  Within 45 minutes jwatt saw the report, decided that he’d made a bad decision during the design process, and coded a fix.  It was beautiful.  I want to be on a software team that works like that.  The “team” I’m on now can barely handle CVS.  I mean, they deposit code in it occasionally.  But they put it in a zip file first.  It might as well be an FTP server.

