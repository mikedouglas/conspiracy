start
  = seq

seq
  = __ e:expr __ s:seq*
    {
      var seqs = [e];
      for (var i = 0; i < s.length; i++) {
        seqs = seqs.concat(s[i]);
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
  = "#t" / "#T" / "#f" / "#F"

number
  = integer
//  / float

integer
  = s:[+-]? nums:[0-9]+
  {
    return parseInt(s + nums.join(""), 10);
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
  = "(" s:seq ")"
  {
    return s;
  }

_
  = [ \t\n\r]

__
  = _*
