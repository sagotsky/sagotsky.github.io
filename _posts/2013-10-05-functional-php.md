---
title: Functional PHP
layout: post
---

I have a confession to make.  I use PHP.  HackerNews tells me that makes me a bad person.

Okay, that's not the real confession.  I use PHP because I use Drupal at work, and no that's not the real confession despite how HN and Reddit shame me for it.

Ok, here it is.  I'm addicted to anonymous functions in PHP.  

I say that like it's a bad thing.  My RoR friends get to have nice things, so why can't I?  Why does it feel like I'm somehow cheating when I drop a function in an array_map one liner?

Well, I think it goes against Drupal convention.  I say I think because I'm honestly not sure.  Drupal's [Coding Standards](https://drupal.org/coding-standards) doc doesn't mention them.  That means I can use anonymous functions as I see fit, right?

Okay, that's presumptuous so let's have a tangent.  

My team met up with one of our outside contractors at DrupalCon this year.  He told me he could tell which of us had written a piece of code at a glance.  At first I thought that was really cool, but then it seemed downright embarrassing.  His rule of thumb was that instead of memorizing conventions we should just make our code look like Drupal core's, and we were all failing to do that in our own unique ways.  I didn't ask what my idiosyncracies were and I regret it.

So back to anonymous functions.  I've been vague so far, so lets clarify things.  I'm not doing anything weird or tricky.  One well known drupalism is that everything is an array.  Functions with magic names (aka 'hooks') get a chance to modify that array before it gets processed into something else.  As such a lot of drupal code looks like this:

```php
<?
$return = array();
foreach ($nested_array as $array) {
  $return[] = $array['name'];
}
?>
```

Or something like that.  Some function are just a series of 3 or 5 line piles of foreaches.  It's monotonous.

Instead, I've been doing things like this:

```php
<?
  $return = array_map(function($a) {return $a['name'];}, $nested_array);
?>
```

It's just tighter.  I've got less to type, so less chance of a typo.  And I can fit many more of these on the screen at a time, so there's less to memorize.  If I felt like naming the anonymous function I could even write a unit test for it.

Oh and before you ask, you can do the same thing with associative arrays (aka hashes anywhere but PHP), you just have to use array_reduce.

```php
<?
  $return = array_reduce($nested_array, function($ret, $a) {$ret[$a['id']] = $a['name']; return $ret;});
?>
```

So I've been doing a lot of this.  Not just for Drupal internals, but on results from rest apis.  I don't have a measure for it, but I feel like I've been more productive if only from doing less typing.  So why am I babbling about this again?

Well, I want to stick with convention.  The docs don't tell me what to do, so I looked at the source.  Drupal 7 only uses 35 calls to array_map and 3 to array_reduce.  That's not a lot of examples to work with.  Oh and they all use named functions.  I realize anonymous functions are new to PHP 5.3, but create_function has been around forever.

Where are we?  I'm coding in a way that feels expressive, powerful, and efficient.  My framework doesn't code this way.  Am I doing something wrong by going against the grain or am I doing something wrong by using the wrong framework?


