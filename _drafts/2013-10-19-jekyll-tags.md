---
title: Jekyll tags
layout: post
tags: jekyll blog
---

I started (well, reinvigorated) this blog because a) Hacker News told me over and over that devs should blog.  And b) because I needed an excuse to play with Ruby.  Jekyll comes with tags out of the box, but they don't seem to do much.  Of course you can write a generator that makes pages of each tag, but that would be a custom plugin and Github wouldn't compile it.  Since I'm trying to keep this jekyll plugin free (my other blog that I'm still in the process of migrating will be more experimental) I figured I'd see what I could get out of tags as provided.

So what do jekyll tags do?

1. You can put a tag on a piece of content.
2. You can loop over a site's tags.
3. You can loop over a page's tags.

And that's about it.  Should be all we need though.  (Incidentally, categories seem to do exactly the same thing, but with different URLs.  Coming to terms with this (as I assumed there was an obvious difference I'd missed) delayed me quite a bit.)

Each post should display its tags.  If they can't do that, there's not much point in having the tags at all, right?

I did this step last, but it was easy.  Add this to your post file in _layouts.

```html
{% raw %}
  <span class="tags">
    {% for tag in page.tags %}
      {{ tag }}
    {% endfor %}
  </span>
{% endraw %}
```

Now posts show a little bit of metadata about the post.  But those tags aren't really useful yet.  They should go somewhere.  If you like one of the terms in my post, you should be able to see other pages tagged similarly.  That's kind of the point.

The popular solution online was to use a generator to build a page listing all posts.  Plenty of code is already out there for this.  

Let's make it easy for now and just start with a listing of all our tags.  I also want to have nice URLs, so I made a directory called tags and worked on an index.html file inside of it.  

```
{% raw %}
  {% for tag in site.tags %}
{% endraw %}
```

This will let us start looping over all our tags.  It works a little differently than `page.tags` though.  The tag's name is actually tag[0] and tag[1] gives us all the posts with that tag.  I think.  Documentation here wasn't even spotty, it was non-existant and I'm not sure how I figured out to treat tag like an array.  Probably Stack Overflow.  There might be more hidden goodies here, but my frustration beat out my curiosity at this point.

Anyway, looping over site.tags and printing tag[0] gives us a list of all the tags.  We can get a list of all the posts and their tags with:

```
{% raw %}
    {% for post in site.posts %}
    <li class="{{ post.tags | join ' ' }}">
      <a class="title" href="{{post.url}}">{{post.title}}</a>
    </li>
    {% endfor %}
{% endraw %}
```

Note the class.  Each of those links to posts includes the post's tags as a class.  We're going to use javascript to  
