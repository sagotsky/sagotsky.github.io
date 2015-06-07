---
title: Go go gadget method_missing
layout: post
tags: ruby metaprogramming 
---

I started doing a stupid ruby project.  Not gonna talk about the details yet.  The point of the project isn't so much to solve a problem as it is to future proof myself from future problems.  

I'm taking all the stupid ruby tricks I see on the web - namely DSLs, metaprogramming, and eigenclasses - and sticking them in a small project.  Every time I see a blog post about all the clever things you can do with these techniques, I fixate on them.  They have no place in an everyday rails form, but I still find myself dwelling on how to add them.  I figure this project will satisfy that curiosity and let me write simple, basic code at work.

Anyway, today's irritation is method_missing.  I'm using it as intended to catch methods that I couldn't have known I'd need prior to runtime.  I actually did try to do some define_method, but had trouble convincing the dynamically created methods to take a block.  method_missing didn't have that one particular problem, so I gave it another shot.

Grievance the first.  method_missing grabs EVERYTHING.  I think I thought I could work around that, but it's way more obnoxious than intended.  

Here's a similar problem being solved in a similarly naive way.

Consider an html tag.  `<a href="http://example.com">`.  You want to grab http://example.com with a regular expression.  Because this is the naive way, you write `/.*"(.*)".*/` or something.  Then you run into `<a href="http://example.com/haha-fooled-you" title="this one has two attributes, sucka!">`  

A non-greedy `.*?` will fix that, but that's not the point.

method_missing has no non-greedy option.  It grabs everything from now until eternity.

Grievance the second.

Except when it doesn't.  method_missing grabs every method that doesn't exist.  But methods that do exist as usual.  I had a few generically named methods, format and exec.  define_method attached them to my class as expected.  method_missing was set up to respond to these, but it didn't.  Something in Object or Kernel already had those names, so my calls to format and exec went there instead.  I only noticed because pry's show-method feature showed me unfamiliar code.

Both these problems are unpleasant to debug.  I don't intend to use method_missing again if I can help it.
