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
        tail[i].shift() // remove whitespace before concat
        seqs = seqs.concat(tail[i]);
      }
      return seqs;
    }
  / comment

expr
  = quoted_expr
  / list
  / obj
  / boolean
  / number
  / character
  / string
  / identifier
//  / vector

obj
  = "{" __ head:kv_pair? tail:(__ "," __ kv_pair)* __ "}"
    {
      var obj = {};
      if (head)
        obj[head[0]] = head[1];
      else
        return {};
      for (var i = 0; i < tail.length; i++) {
        obj[tail[i][3][0]] = tail[i][3][1];
      }
      return obj;
    }

kv_pair
  = k:key __ ":" __ v:expr { return [k,v]; }

key
  = id:identifier { return id.name; }
  / string
  / n:number { return n.toString(); }

boolean
  = ("#t" / "#T") { return true; }
  / ("#f" / "#F") { return false; }

number
  = i:integer f:frac e:exp  { return parseFloat(i + f + e); }
  / i:integer f:frac        { return parseFloat(i + f); }
  / i:integer e:exp         { return parseFloat(i + e); }
  / integer

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

frac
  = "." digits:[0-9]+  { return "." + digits.join(""); }

exp
  = e:[eE] sign:[+-]? digits:[0-9]+ { return e + sign + digits.join(""); }

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
  / "," i:initial s:subseq*
  {
    return {type: "id", name: "," + i + s.join("")};
  }
  / ",@" i:initial s:subseq*
  {
    return {type: "id", name: ",@" + i + s.join("")};
  }
  / p:peculiar
  {
    return {type: "id", name: p};
  }

initial
  = [A-Za-z!$%&*/<=>?^_~]

subseq
  = initial / [0-9+-]

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

comment
  = ";" (!"\n" .)* { return whitespace; }
_
  = [ \t\n\r] { return whitespace; }
  / comment { return whitespace; }

__
  = _* { return whitespace; }
  / comment { return whitespace; }

___
  = _+ { return whitespace; }
