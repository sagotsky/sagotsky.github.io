---
title: Bash alias args
layout: post
---

Long ago I learned that bash’s aliases don’t process args and you should just use functions instead. Turns out you can do args. This isn’t the most useful thing in the world because, well, functions. But it’s still cool.

Basically you write an alias to evaluate subshell like sh. Pass that $1 and $2, but do it in a single quote so they don’t evaluate. Your args get tacked onto the end of that and then it evaluates. You’re essentially treating sh as lambda.

Here’s the alias:
`alias arg="sh -c 'echo \$3 \$2 \$1' --"`

It looks little different if you check it in a shell, but I assure you it works:

```sh
<03:02:50> sagotsky@calculon:~$ alias arg
alias arg='sh -c '\''echo $3 $2 $1'\'' --'
<03:02:54> sagotsky@calculon:~$ arg a b c
c b a
```
