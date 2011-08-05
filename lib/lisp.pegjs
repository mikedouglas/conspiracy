{
  whitespace = {type: "whitespace"};
}

start
  = seq

seq
  = __ head:expr tail:(___ expr)* __
    {
      var seqs = [head];
      for (var i = 0; i < tail.length; i++) {
        if (tail[i][0] === whitespace)
          tail[i].shift() // remove whitespace before concat
        seqs = seqs.concat(tail[i]);
      }
      return seqs;
    }

expr
  = quoted_expr
  / list
  / boolean
  / number
  / character
  / string
  / identifier
//  / quoted_expr
//  / vector

boolean
  = ("#t" / "#T") { return true; }
  / ("#f" / "#F") { return false; }

number
  = integer
//  / float

integer
  = s:[+-]? inum:[1-9] nums:[0-9]*
  {
    if (nums)
      nums = nums.join("");
    return parseInt(s + inum + nums, 10);
  }
  / "0"
  {
    return 0;
  }

character
  = "#\\" c:[A-Za-z]
  {
    return {type: "character", char: c};
  }

string
  = ("\"" s:([^"]*) "\"")
  {
    return s.join("");
  }
  / ("'" s:([^']*) "'")
  {
    return s.join("");
  }

identifier
  = i:initial s:subseq*
  {
    return {type: "id", name: i + s.join("")};
  }
  / p:peculiar
  {
    return {type: "id", name: p};
  }

initial
  = [A-Za-z!$%&*/:<=>?^_~,]

subseq
  = initial / [0-9+-.@]

peculiar
  = [+-] / "..."

list
  = "(" s:seq? ")"
  {
    return s || [];
  }
  / "(" __ ")"
  {
    return [];
  }

quoted_expr
   = "'" e:expr
   {
     return [{type: 'id', name: 'quote'}, e];
   }
   / "`" e:expr
   {
     return [{type: 'id', name: 'quasiquote'}, e];
   }

_
  = [ \t\n\r] { return whitespace; }

__
  = _* { return whitespace; }

___
  = _+ { return whitespace; }
