---
title: Using Google Sheets like a developer
layout: post
tags: cloud tools javascript
---

As a programmer and CLI fanatic, I avoid normal power user tools like Excel.  I realize it's powerful and there's plenty of depth to be learned, but it just rubs me the wrong way.  Anyway, I bumped into some functionality in Google Sheets that bridged the gap between coding and spreadsheeting.  My coworkers hadn't seen it yet, so I figured I'd share it here.

Here's the problem.  I'm a gym rat.  I use a workout plan called 5/3/1 that tells me how much to lift in order to get stronger.  The 5/3/1 book even tells you how to set up a spreadsheet to help with the calculations.  

Here's what one of them looks like: `=CEILING((0.65*A3/5), 1)*5`

That's grabbing A3, which is my max bench press, takes 65% of it, and rounds to something divisible by 5, because that's the increment my weights come in.  

Each workout day has three percentages as I work up to a higher weight.  There are four different lifts, so four different days.  Oh and the program is four weeks long.  That's a lot of permutations of `=CEILING((PERCENTAGE*CELL/5), 1)*5`.  This is an unmaintainable mess and I pretty much have to start over each time I shuffle the order of the workout, or even the display of the spreadsheet.  Oh, and on top of that, the formula I've pasted doesn't even tell me what rep range it's for.  All it knows is a percentage and a cell ID.  The rounding math has to be repeated in each cell.

I didn't like maintaining my workout spreadsheet like an animal.  I wanted to write it the same way I would software.  I wanted it to be expressive and maintainable.  Here's what I did.

Google Sheets has a script editor buried in its tools menu.  I'd seen a few tutorials for using it as a data store for some custom blog software or accessing its API.  The API looked approachable so I figured I'd throw a few hours at it and see what happened.

I started by hardcoding the max weights for each of my lifts and the progression for each of the weeks.  Also wrote a function for rounding to numbers divisible by five and mapped the weights to that.  Pretty much what you'd expect.

While trying to figure out how to get that data back into the spreadsheet I found a feature called Named Range.  This let me pick a group of cells and give it a name.  Then I could access it by that name.  A3 became max_bench_press.  Cool!  I was wondering how I'd solve that.

But I was still left with figuring out how to run the script and push numbers into the spreadsheet.  This is the magic part.  It turns out you can call your script's functions directly from the spreadsheet.  

Instead of that `=CEILING()` nonsense, I could use `=FIVES()` to get my five rep day (I capitalized my script function so it would like like the other spreadsheet functions0.  Using named ranges as an argument, I get `=FIVES(bench)`.  Also gave each function a label argument, so the end result is something like `=FIVES(squat, 'Back Squat')`.  These functions recalculate on demand and they're infinitely more expressive than what had appeared.  

Oh and arrays do what you expect.  By which I mean that if my FIVES function returns an array of three target weights, the cell calling the function and the two following it will show the array's items.  I'm not using this functionality as described because it was too bulky, but I am returning a pair of label and joined weights.

One caveat.  Even though the script editor takes javascript, it's not running in the browser.  Google sends it out to some script runner service.  This is significant because Google makes the assumption that your functions are deterministic.  Early on I tried to run `=FIVES('Back Squat')`, assuming I could use the label to fetch the named range.  But FIVES('Back Squat') was cached immediately.  Changing the value in the range didn't trigger a refresh.  Calling `=FIVES(squat, 'Back Squat')` will translate to `=FIVES(275, 'Back Squat')` on its first load.  Then when I bump it up to 285, the next call is `=FIVES(285, 'Back Squat')`.  This result is NOT cached, so we get a fresh new value.  


