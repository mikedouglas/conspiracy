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
  = list
  / boolean
  / number
  / character
  / string
  / identifier
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

initial
  = [A-Za-z!$%&*/:<=>?^_~]

subseq
  = initial / [0-9+-.@]

list
  = "(" s:seq? ")"
  {
    return s;
  }

_
  = [ \t\n\r] { return whitespace; }

__
  = _* { return whitespace; }

___
  = _+ { return whitespace; }
