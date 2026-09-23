/** 80**************************************************************************
 * @module lib/compiling/css/CSSLexr_test
 * @license MIT
 ******************************************************************************/

import { assertEquals, assertStrictEquals } from "@std/assert";
import { after, afterEach, describe, it } from "@std/testing/bdd";
import { g_count } from "../../util/performance.ts";
import type { TestO } from "../_test.ts";
import { ran, repl, rv, test_o, undo } from "../_test.ts";
import { Bufr } from "../Bufr.ts";
import { g_ran_fac } from "../RanFac.ts";
import { ErrMsg } from "../util.ts";
import { CSSLexr } from "./CSSLexr.ts";
/*80--------------------------------------------------------------------------*/

const bufr = new Bufr();
const lexr = new CSSLexr(bufr);
Object.assign(test_o, { bufr, lexr } as Partial<TestO>);

const init_ = (text_x?: string | string[]) => {
  lexr.reset_Lexr();
  bufr.repl_actr.init(lexr);

  if (text_x) repl(rv(0, 0), text_x);
};

const fina_ = () => {
  bufr.reset_Bufr();
  lexr.destructor();
};

afterEach(() => {
  fina_();
  assertEquals(g_count.newToken, g_count.oldToken);
});

after(() => {
  console.log(`g_count.newLoc: ${g_count.newLoc}`);
  console.log(`g_count.newRan: ${g_count.newRan}`);
  console.log(`g_count.newToken: ${g_count.newToken}`);
  console.log(`g_count.oldToken: ${g_count.oldToken}`);
  console.log(`g_ran_fac: ${g_ran_fac}`);
});

describe("CSSLexr.lex()", () => {
  it("lex() comment", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), "/*");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [],
      "strtBdry[0-0)",
      ["comment[0-0,0-2)", "stopBdry[0-2)"],
    ]);
    assertEquals(lexr._err_, [
      ["comment[0-0,0-2)", [{ msg: ErrMsg.block_comment_open }]],
    ]);
    repl(ran(0).rv, "*/");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "comment[0-0,0-4)"],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    repl(rv(0, 2), "*\n**");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "comment[0-0,1-4)"],
      "stopBdry[1-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "comment[0-0,0-4)"],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [],
      "strtBdry[0-0)",
      ["comment[0-0,0-2)", "stopBdry[0-2)"],
    ]);
    assertEquals(lexr._err_, [
      ["comment[0-0,0-2)", [{ msg: ErrMsg.block_comment_open }]],
    ]);
    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "stopBdry[0-0)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() whitespace", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), " ");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "whitespace[0-0,0-1)"],
      "stopBdry[0-1)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    repl(ran(0).rv, "\t");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "whitespace[0-0,0-2)"],
      "stopBdry[0-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    ·→
    */
    repl(ran(0).rv, "\n");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "whitespace[0-0,1-0)"],
      "stopBdry[1-0)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    ·→
    ¶
    */
    repl(ran(0).rv, "n");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [
        "strtBdry[0-0)",
        "whitespace[0-0,0-2)",
        "ident[0-2,0-3)",
        "whitespace[0-3,1-0)",
      ],
      "stopBdry[1-0)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    /*
    ·→n
    ¶
    */
    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "whitespace[0-0,1-0)",
      ["stopBdry[1-0)"],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() string", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), "'");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [],
      "strtBdry[0-0)",
      ["string[0-0,0-1)", "stopBdry[0-1)"],
    ]);
    assertEquals(lexr._err_, [
      ["string[0-0,0-1)", [{ msg: ErrMsg.quoted_string_open }]],
    ]);
    repl(rv(0, 0), "'");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "string[0-0,0-2)"],
      "stopBdry[0-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    ''
    */
    repl(rv(0, 1), "\n");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [],
      "strtBdry[0-0)",
      ["string[0-0,1-0)", "string[1-0,1-1)", "stopBdry[1-1)"],
    ]);
    assertEquals(lexr._err_, [
      ["string[0-0,1-0)", [{ msg: ErrMsg.quoted_string_open }]],
      ["string[1-0,1-1)", [{ msg: ErrMsg.quoted_string_open }]],
    ]);
    repl(ran(0).rv, "\\");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "string[0-0,1-1)"],
      "stopBdry[1-1)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    '\
    '
    */
    repl(ran(0).rv, "'");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [],
      "strtBdry[0-0)",
      ["string[0-0,1-0)", "string[1-0,1-1)", "stopBdry[1-1)"],
    ]);
    assertEquals(lexr._err_, [
      ["string[0-0,1-0)", [{ msg: ErrMsg.quoted_string_open }]],
      ["string[1-0,1-1)", [{ msg: ErrMsg.quoted_string_open }]],
    ]);
    /*
    '\'
    '
    */
    repl(ran(0).rv, "\\");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "string[0-0,1-1)"],
      "stopBdry[1-1)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() hash", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), "#");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "delim[0-0,0-1)"],
      "stopBdry[0-1)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    repl(ran(0).rv, "1");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "hash[0-0,0-2)"],
      "stopBdry[0-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    #1
    */
    repl(ran(0).rv, "2");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "hash[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    #12
    */
    repl(rv(0, 1), " ");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [
        "strtBdry[0-0)",
        "delim[0-0,0-1)",
        "whitespace[0-1,0-2)",
        "number[0-2,0-4)",
      ],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    /*
    # 12
    */
    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "hash[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    /*
    #12
    */
    repl(rv(0, 2), " ");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      [
        "strtBdry[0-0)",
        "hash[0-0,0-2)",
        "whitespace[0-2,0-3)",
        "number[0-3,0-4)",
      ],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    /*
    #1 2
    */
    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "hash[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("Prepending lex() hash", () => {
    init_("url");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(0, 0), "#");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "hash[0-0,0-4)"],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("Appending lex() number, dimension, percentage", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), "-");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "delim[0-0,0-1)"],
      "stopBdry[0-1)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    repl(ran(0).rv, "1");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "number[0-0,0-2)"],
      "stopBdry[0-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    -1
    */
    repl(ran(0).rv, ".");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "number[0-0,0-2)", "delim[0-2,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    -1.
    */
    repl(ran(0).rv, "2");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "number[0-0,0-4)"],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    -1.2
    */
    repl(ran(0).rv, "e");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "dimension[0-0,0-5)"],
      "stopBdry[0-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    -1.2e
    */
    repl(ran(0).rv, "+");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "dimension[0-0,0-5)", "delim[0-5,0-6)"],
      "stopBdry[0-6)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    -1.2e+
    */
    repl(ran(0).rv, "3");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "number[0-0,0-7)"],
      "stopBdry[0-7)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    -1.2e+3
    */
    repl(ran(0).rv, "%");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "percentage[0-0,0-8)"],
      "stopBdry[0-8)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("Appending lex() at_keyword", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), "@");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "delim[0-0,0-1)"],
      "stopBdry[0-1)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    repl(ran(0).rv, "\\123");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "at_keyword[0-0,0-5)"],
      "stopBdry[0-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    @\123
    */
    repl(ran(0).rv, "\\");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "at_keyword[0-0,0-5)",
      ["delim[0-5,0-6)", "stopBdry[0-6)"],
    ]);
    assertEquals(lexr._err_, [
      ["delim[0-5,0-6)", [{ msg: ErrMsg.css_inval_esc }]],
    ]);
    /*
    @\123\
    */
    repl(ran(0).rv, "\\");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "at_keyword[0-0,0-7)"],
      "stopBdry[0-7)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("Prepending lex() at_keyword", () => {
    init_("url");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(0, 0), "@");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "at_keyword[0-0,0-4)"],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("Appending lex() ident", () => {
    init_();
    assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
    assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

    repl(rv(0, 0), "--");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-2)"],
      "stopBdry[0-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    repl(ran(0).rv, "_");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    --_
    */
    repl(ran(0).rv, "-");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-4)"],
      "stopBdry[0-4)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("Prepending lex() ident", () => {
    init_("url");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-3)"],
      "stopBdry[0-3)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(0, 0), "_");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "ident[0-0,0-4)",
      ["stopBdry[0-4)"],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    /*
    _url
    */
    repl(rv(0, 0), "-");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "ident[0-0,0-5)"],
      "stopBdry[0-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  // it("lex() filtered code points", () => {
  //   init_();
  //   assertEquals(lexr.curLexTk_$.toString(), "strtBdry[0-0)");
  //   assertEquals(lexr.stopLexTk_$.toString(), "stopBdry[0-0)");

  //   repl(rv(0, 0), "𠮷");
  //   assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  //   assertEquals(bufr.getTextA(), []);
  // });
});
/*80--------------------------------------------------------------------------*/
