/** 80**************************************************************************
 * @module lib/compiling/uri/URILexr_test
 * @license MIT
 ******************************************************************************/

import { assertEquals, assertStrictEquals } from "@std/assert";
import { after, afterEach, describe, it } from "@std/testing/bdd";
import { g_count } from "../../util/performance.ts";
import type { TestO } from "../_test.ts";
import { repl, repla, rv, test_o, undo } from "../_test.ts";
import { Bufr } from "../Bufr.ts";
import { g_ran_fac } from "../RanFac.ts";
import { ErrMsg } from "../util.ts";
import { URILexr } from "./URILexr.ts";
/*80--------------------------------------------------------------------------*/

const bufr = new Bufr();
const lexr = new URILexr(bufr);
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

describe("URILexr.lex()", () => {
  it("lex() IPv4", () => {
    init_("//127.0.0.1");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv4[0-2,0-11)"],
      "stopBdry[0-11)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(0, 6), "0");
    /*
    //127.00.0.1
     */
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "twoslash[0-0,0-2)",
      ["IPv4[0-2,0-12)", "stopBdry[0-12)"],
    ]);
    assertEquals(lexr._err_, [
      ["IPv4[0-2,0-12)", [{ msg: ErrMsg.ipv4_leading_0 }]],
    ]);

    repl(rv(0, 2, 0, 3), "3");
    /*
    //127.00.0.1
     */
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "twoslash[0-0,0-2)",
      ["IPv4[0-2,0-12)", "stopBdry[0-12)"],
    ]);
    assertEquals(lexr._err_, [
      ["IPv4[0-2,0-12)", [
        { msg: ErrMsg.ipv4_leading_0 },
        { msg: ErrMsg.ipv4_exceed_255 },
      ]],
    ]);

    undo();
    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv4[0-2,0-11)"],
      "stopBdry[0-11)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });

  describe("lex() IPv6", () => {
    it("ip_no_open_bracket and related", () => {
      init_("//[::]");
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv6[0-2,0-6)"],
        "stopBdry[0-6)",
        [],
      ]);
      assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

      repla([{ rv: rv(0, 2, 0, 3), txt: "" }, { rv: rv(0, 5, 0, 6), txt: "" }]);
      /*
      //::
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-4)", "stopBdry[0-4)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-4)", [
        { msg: ErrMsg.ip_no_open_bracket },
        { msg: ErrMsg.ipv6_no_h16 },
      ]]]);

      repl(rv(0, 4), "a");
      /*
      //::a
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-5)", "stopBdry[0-5)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-5)", [
        { msg: ErrMsg.ip_no_open_bracket },
        { msg: ErrMsg.ip_no_cloz_bracket },
      ]]]);

      repla([{ rv: rv(0, 2), txt: "[" }, { rv: rv(0, 5), txt: "]" }]);
      /*
      //[::a]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv6[0-2,0-7)"],
        "stopBdry[0-7)",
        [],
      ]);
      assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    });

    it("ipv6_no_h16 and related", () => {
      init_("//[::a:]");
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-8)", "stopBdry[0-8)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-8)", [
        { msg: ErrMsg.ipv6_no_h16 },
      ]]]);

      repla([{ rv: rv(0, 3), txt: "a:" }, { rv: rv(0, 5, 0, 7), txt: "" }]);
      /*
      //[a:::]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-8)", "stopBdry[0-8)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-8)", [
        { msg: ErrMsg.ipv6_no_h16 },
      ]]]);

      repl(rv(0, 5), "b:c:d:e:f:");
      /*
      //[a:b:c:d:e:f:::]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-18)", "stopBdry[0-18)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-18)", [
        { msg: ErrMsg.ipv6_no_h16 },
      ]]]);

      repl(rv(0, 15, 0, 17), "0");
      /*
      //[a:b:c:d:e:f:0]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-17)", "stopBdry[0-17)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-17)", [
        { msg: ErrMsg.ipv6_no_enough_h16 },
      ]]]);

      repl(rv(0, 16), ".1.2.3");
      /*
      //[a:b:c:d:e:f:0.1.2.3]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv6[0-2,0-23)"],
        "stopBdry[0-23)",
        [],
      ]);
      assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    });

    it("ipv6_no_2nd_colon and related", () => {
      init_("//[:]");
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-5)", "stopBdry[0-5)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-5)", [
        { msg: ErrMsg.ipv6_no_2nd_colon },
      ]]]);

      repl(rv(0, 3), "a");
      /*
      //[a:]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["stopBdry[0-6)"],
      ]);
      assertEquals(lexr._err_, [["stopBdry[0-6)", [
        { msg: ErrMsg.uri_inval_tail },
      ]]]);

      repl(rv(0, 5), "b:c:d:e:f:0:");
      /*
      //[a:b:c:d:e:f:0:]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)"],
        "twoslash[0-0,0-2)",
        ["IPv6[0-2,0-18)", "stopBdry[0-18)"],
      ]);
      assertEquals(lexr._err_, [["IPv6[0-2,0-18)", [
        { msg: ErrMsg.ipv6_no_2nd_colon },
      ]]]);

      repl(rv(0, 17), "1");
      /*
      //[a:b:c:d:e:f:0:1]
      */
      assertEquals(lexr.curLexTk_$._Repr_(), [
        ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv6[0-2,0-19)"],
        "stopBdry[0-19)",
        [],
      ]);
      assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
    });
  });

  it("lex() IPv7", () => {
    init_("//[v7.:]");
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv7[0-2,0-8)"],
      "stopBdry[0-8)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);

    repl(rv(0, 7), "✌🏼");
    /*
      //[v7.:✌🏼]
      */
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)"],
      "twoslash[0-0,0-2)",
      ["IPv7[0-2,0-7)", "stopBdry[0-11)"],
    ]);
    assertEquals(lexr._err_, [
      ["stopBdry[0-11)", [{ msg: ErrMsg.uri_inval_tail }]],
      ["IPv7[0-2,0-7)", [{ msg: ErrMsg.ip_no_cloz_bracket }]],
    ]);

    undo();
    assertEquals(lexr.curLexTk_$._Repr_(), [
      ["strtBdry[0-0)", "twoslash[0-0,0-2)", "IPv7[0-2,0-8)"],
      "stopBdry[0-8)",
      [],
    ]);
    assertStrictEquals(lexr.stopLexTk_$, lexr.curLexTk_$);
  });
});
/*80--------------------------------------------------------------------------*/
