/** 80**************************************************************************
 * @module lib/compiling/plain/PlainLexr_test
 * @license MIT
 ******************************************************************************/

import { assertEquals, assertStrictEquals } from "@std/assert";
import { after, afterEach, describe, it } from "@std/testing/bdd";
import { g_count } from "../../util/performance.ts";
import type { TestO } from "../_test.ts";
import { ran, redo, repl, repla, rv, test_o, undo } from "../_test.ts";
import { Bufr } from "../Bufr.ts";
import { g_ran_fac } from "../RanFac.ts";
import { PlainLexr } from "./PlainLexr.ts";
/*80--------------------------------------------------------------------------*/

const bufr = new Bufr();
const lexr = new PlainLexr(bufr);
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

describe("PlainLexr.lex()", () => {
  it("lex() one-line insert, delete, replace", () => {
    init_();

    repl(rv(0, 0), "d");
    /*
    d
     */
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [["strtBdry[0-0)", "plaintext[0-0,0-1)"], "stopBdry[0-1)", []],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [["strtBdry[0-0)"], "stopBdry[0-0)", []],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    redo();
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [["strtBdry[0-0)", "plaintext[0-0,0-1)"], "stopBdry[0-1)", []],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(ran(0, 0, 0).rv, "d");
    /*
    d
     */
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [["strtBdry[0-0)", "plaintext[0-0,0-1)"], "stopBdry[0-1)", []],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(ran(0).rv, "ef");
    /*
    def
     */
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-3)"],
        "stopBdry[0-3)",
        [],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(0, 1, 0, 2), "_+_");
    /*
    d_+_f
     */
    assertEquals(bufr.getTextA(), ["d_+_f"]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-5)"],
        "stopBdry[0-5)",
        [],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-3)"],
        "stopBdry[0-3)",
        [],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() multi-line insert, delete", () => {
    init_("*");

    repl(ran(0).rv, "\n");
    /*
    *
    ¶
     */
    assertEquals(bufr.getTextA(), ["*", ""]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-1)", "plaintext[0-1,1-0)"],
        "stopBdry[1-0)",
        [],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    assertEquals(bufr.getTextA(), ["*"]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [["strtBdry[0-0)", "plaintext[0-0,0-1)"], "stopBdry[0-1)", []],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    // undo();
    // assertEquals(bufr.getTextA(), [""]);
    // assertEquals(
    //   lexr.curLexTk_$._Repr_(),
    //   [["strtBdry[0-0)"], "stopBdry[0-0)", []],
    // );
    // assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    // redo();
    // assertEquals(bufr.getTextA(), ["*"]);
    // assertEquals(
    //   lexr.curLexTk_$._Repr_(),
    //   [["strtBdry[0-0)", "plaintext[0-0,0-1)"], "stopBdry[0-1)", []],
    // );
    // assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    // redo();
    // assertEquals(bufr.getTextA(), ["*", ""]);
    // assertEquals(
    //   lexr.curLexTk_$._Repr_(),
    //   [
    //     ["strtBdry[0-0)", "plaintext[0-0,0-1)", "plaintext[0-1,1-0)"],
    //     "stopBdry[1-0)",
    //     [],
    //   ],
    // );
    // assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    // repl(ran(0).rv, "ab\ncd\nef");
    // /*
    // *ab
    // cd
    // ef
    // ¶
    //  */
    // assertEquals(bufr.getTextA(), ["*ab", "cd", "ef", ""]);
    // assertEquals(
    //   lexr.curLexTk_$._Repr_(),
    //   [
    //     [
    //       "strtBdry[0-0)",
    //       "plaintext[0-0,0-3)",
    //       "plaintext[0-3,1-2)",
    //       "plaintext[1-2,2-2)",
    //     ],
    //     "plaintext[2-2,3-0)",
    //     ["stopBdry[3-0)"],
    //   ],
    // );
    // assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    // undo();
    // assertEquals(bufr.getTextA(), ["*", ""]);
    // assertEquals(
    //   lexr.curLexTk_$._Repr_(),
    //   [
    //     ["strtBdry[0-0)", "plaintext[0-0,0-1)"],
    //     "plaintext[0-1,1-0)",
    //     ["stopBdry[1-0)"],
    //   ],
    // );
    // assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    // redo();
    // assertEquals(bufr.getTextA(), ["*ab", "cd", "ef", ""]);
    // assertEquals(
    //   lexr.curLexTk_$._Repr_(),
    //   [
    //     [
    //       "strtBdry[0-0)",
    //       "plaintext[0-0,0-3)",
    //       "plaintext[0-3,1-2)",
    //       "plaintext[1-2,2-2)",
    //     ],
    //     "plaintext[2-2,3-0)",
    //     ["stopBdry[3-0)"],
    //   ],
    // );
    // assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() insert at sob of multi-line", () => {
    init_("a\nb");

    repl(rv(0, 0), ".");
    /*
    .a
    b
     */
    assertEquals(bufr.getTextA(), [".a", "b"]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)"],
        "plaintext[0-0,0-2)",
        ["plaintext[0-2,1-1)", "stopBdry[1-1)"],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() multi-line replace", () => {
    init_(["ab", "cd", "ef"]);

    // repl( rv(0,0,1,10), "12\n34" );
    repl(ran(0, 0, 1).rv, "12\n34");
    /*
    12
    34
    ef
     */
    const cnt_1 = ["12", "34", "ef"];
    assertEquals(bufr.getTextA(), cnt_1);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-2)", "plaintext[0-2,1-2)"],
        "plaintext[1-2,2-2)",
        ["stopBdry[2-2)"],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    /*
    ab
    cd
    ef
     */
    assertEquals(bufr.getTextA(), ["ab", "cd", "ef"]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-2)", "plaintext[0-2,1-2)"],
        "plaintext[1-2,2-2)",
        ["stopBdry[2-2)"],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    redo();

    repl(rv(1, 0, 1, 1), "$\n");
    /*
    12
    $
    4
    ef
     */
    assertEquals(bufr.getTextA(), ["12", "$", "4", "ef"]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        [
          "strtBdry[0-0)",
          "plaintext[0-0,0-2)",
          "plaintext[0-2,1-1)",
          "plaintext[1-1,2-1)",
        ],
        "plaintext[2-1,3-2)",
        ["stopBdry[3-2)"],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    assertEquals(bufr.getTextA(), cnt_1);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-2)", "plaintext[0-2,1-2)"],
        "plaintext[1-2,2-2)",
        ["stopBdry[2-2)"],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(1, 1, 2, 1), "__");
    /*
    12
    3__f
     */
    assertEquals(bufr.getTextA(), ["12", "3__f"]);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        ["strtBdry[0-0)", "plaintext[0-0,0-2)", "plaintext[0-2,1-4)"],
        "stopBdry[1-4)",
        [],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    undo();
    assertEquals(bufr.getTextA(), cnt_1);
    assertEquals(
      lexr.curLexTk_$._Repr_(),
      [
        [
          "strtBdry[0-0)",
          "plaintext[0-0,0-2)",
          "plaintext[0-2,1-2)",
          "plaintext[1-2,2-2)",
        ],
        "stopBdry[2-2)",
        [],
      ],
    );
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  it("lex() if aoa", () => {
    init_(["ab", "cd", "ef"]);

    /*
    ab
    cd
    ef
     */
    /* 3248 */ repla([
      { rv: rv(0, 0, 0, 1), txt: "" },
      { rv: rv(0, 1, 1, 2), txt: "" },
    ]);
    /*
    ¶
    ef
     */
    assertEquals(bufr.getTextA(), ["", "ef"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "plaintext[0-0,1-2)",
      ["stopBdry[1-2)"],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-1)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    /*
    ¶
    ef
     */
    undo();
    /*
  4 ab
  3 cd
  1 ef
     */
    assertEquals(bufr.getTextA(), ["ab", "cd", "ef"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      /* deno-fmt-ignore */ [
        "strtBdry[0-0)", "plaintext[0-0,0-2)", 
        "plaintext[0-2,1-2)", 
      ],
      "plaintext[1-2,2-2)",
      ["stopBdry[2-2)"],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-0)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    /*
  4 ab
  3 cd
  1 ef
     */
    repla([
      { rv: rv(0, 0, 0, 1), txt: "" },
      { rv: rv(1, 2, 2, 2), txt: "" },
    ]);
    /*
  4 b
  1 cd
     */
    assertEquals(bufr.getTextA(), ["b", "cd"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      /* deno-fmt-ignore */ [
        "strtBdry[0-0)", "plaintext[0-0,0-1)",
        "plaintext[0-1,1-2)",
      ],
      "stopBdry[1-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), []);
    assertEquals(lexr._reusdTk_ss_._repr_(), ["plaintext[0-2,1-2)"]);

    /*
    b
    cd
     */
    undo();
    /*
    ab
    cd
    ef
     */
    assertEquals(bufr.getTextA(), ["ab", "cd", "ef"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      /* deno-fmt-ignore */ [
        "strtBdry[0-0)", "plaintext[0-0,0-2)", 
        "plaintext[0-2,1-2)", 
        "plaintext[1-2,2-2)",
      ],
      "stopBdry[2-2)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-0,0-1)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), ["plaintext[0-1,1-2)"]);
  });

  it("drag on one line", () => {
    init_("0 xyz");

    repla([
      { rv: rv(0, 2, 0, 5), txt: "" },
      { rv: rv(0, 1), txt: "xyz" },
    ]);
    /*
    0xyz·
     */
    assertEquals(bufr.getTextA(), ["0xyz "]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "plaintext[0-0,0-5)"],
      "stopBdry[0-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-1,0-2)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    /* 3249 */ undo();
    assertEquals(bufr.getTextA(), ["0 xyz"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "plaintext[0-0,0-5)"],
      "stopBdry[0-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-4,0-5)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    /*
    0 xyz
     */
    redo();
    /*
    0xyz·
     */
    assertEquals(bufr.getTextA(), ["0xyz "]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "plaintext[0-0,0-5)"],
      "stopBdry[0-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-1,0-2)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);
  });

  it("drag on two lines", () => {
    init_(["0 abc", "1 xyz"]);

    repla([
      { rv: rv(0, 2, 0, 5), txt: "" },
      { rv: rv(1, 2), txt: "abc" },
    ]);
    /*
    0·
    1 abcxyz
     */
    assertEquals(bufr.getTextA(), ["0 ", "1 abcxyz"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "plaintext[0-0,0-2)", "plaintext[0-2,1-8)"],
      "stopBdry[1-8)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), []);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    undo();
    /*
    0 abc
    1 xyz
     */
    assertEquals(bufr.getTextA(), ["0 abc", "1 xyz"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "plaintext[0-0,0-5)", "plaintext[0-5,1-5)"],
      "stopBdry[1-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-2,1-2)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    redo();
    /*
    0·
    1 abcxyz
     */
    assertEquals(bufr.getTextA(), ["0 ", "1 abcxyz"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "plaintext[0-0,0-2)", "plaintext[0-2,1-8)"],
      "stopBdry[1-8)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), []);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);
  });

  it("drag on three lines", () => {
    init_(["0 abc", "1 xyz", "2 uvw"]);

    /*
  2 0 abc
  3 1 xyz
  1 2 uvw
     */
    repla([
      { rv: ran(1, 0, 2).rv, txt: "" },
      { rv: rv(0, 0), txt: "1 xyz\n2 uvw" },
    ]);
    /*
  4 1 xyz
  2 2 uvw0 abc
  1 ¶
     */
    assertEquals(bufr.getTextA(), ["1 xyz", "2 uvw0 abc", ""]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      /* deno-fmt-ignore */ [
        "strtBdry[0-0)", "plaintext[0-0,0-5)",
        "plaintext[0-5,1-10)",
        "plaintext[1-10,2-0)",
      ],
      "stopBdry[2-0)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-0,0-5)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    undo();
    assertEquals(bufr.getTextA(), ["0 abc", "1 xyz", "2 uvw"]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      /* deno-fmt-ignore */ [
        "strtBdry[0-0)", "plaintext[0-0,0-5)",
        "plaintext[0-5,1-5)",
        "plaintext[1-5,2-5)",
      ],
      "stopBdry[2-5)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[1-10,2-0)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);

    redo();
    assertEquals(bufr.getTextA(), ["1 xyz", "2 uvw0 abc", ""]);
    assertEquals(lexr.curLexTk_$._Repr_(), [
      /* deno-fmt-ignore */ [
        "strtBdry[0-0)", "plaintext[0-0,0-5)",
        "plaintext[0-5,1-10)",
        "plaintext[1-10,2-0)",
      ],
      "stopBdry[2-0)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    assertEquals(lexr.unrelTk_ss_$._repr_(), ["unknown[0-0,0-5)"]);
    assertEquals(lexr._reusdTk_ss_._repr_(), []);
  });
});
/*80--------------------------------------------------------------------------*/
