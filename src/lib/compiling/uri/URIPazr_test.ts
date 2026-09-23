/** 80**************************************************************************
 * @module lib/compiling/uri/URIPazr_test
 * @license MIT
 ******************************************************************************/

import { assertEquals } from "@std/assert";
import { after, afterEach, describe, it } from "@std/testing/bdd";
import { g_count } from "../../util/performance.ts";
import type { TestO } from "../_test.ts";
import { repl, rv, test_o } from "../_test.ts";
import { Bufr } from "../Bufr.ts";
import { g_ran_fac } from "../RanFac.ts";
import { URIPazr } from "../uri/URIPazr.ts";
import { ErrMsg } from "../util.ts";
import { URILexr } from "./URILexr.ts";
/*80--------------------------------------------------------------------------*/

const bufr = new Bufr();
const lexr = new URILexr(bufr);
const pazr = new URIPazr(lexr);
Object.assign(test_o, { bufr, lexr, pazr } as Partial<TestO>);

const init_ = (text_x?: string | string[]) => {
  lexr.reset_Lexr();
  pazr.reset_Pazr();
  bufr.repl_actr.init(lexr, pazr);

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

describe("URIPazr.paz_impl$()", () => {
  it("#pazAuthority()", () => {
    init_("//");
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(pazr.root?._newInfo_, "URI,0 [ twoslash[0-0,0-2) ]");
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( PathPart,1,any ( Authority,2 ( //)))",
    );

    repl(rv(0, 2), "@[::]:0");
    /*
    //@[::]:0
     */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "URI,0 [ twoslash[0-0,0-2), port[0-7,0-9) ]",
    );
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( PathPart,1,any ( Authority,2 ( //userinfo[0-2,0-3) IPv6[0-3,0-7) port[0-7,0-9))))",
    );
  });

  it("#pazPathPart()", () => {
    init_("///");
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "URI,0 [ twoslash[0-0,0-2), path_abempty[0-2,0-3) ]",
    );
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( PathPart,1,any ( Authority,2 ( //) path_abempty[0-2,0-3)))",
    );

    repl(rv(0, 1), "✌🏼");
    /*
    /✌🏼//
     */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "URI,0 [ path_absolute[0-0,0-6) ]",
    );
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( PathPart,1,any ( path_absolute[0-0,0-6)))",
    );

    repl(rv(0, 0), "😀:");
    /*
    😀:/✌🏼//
     */
    assertEquals(lexr._err_, [["stopBdry[0-9)", [
      { msg: ErrMsg.uri_inval_tail },
    ]]]);
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "URI,0 [ path_noscheme[0-0,0-2) ]",
    );
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( PathPart,1,rel ( path_noscheme[0-0,0-2)))",
    );

    repl(rv(0, 0, 0, 4), "a:");
    /*
    a:✌🏼//
     */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "URI,0 [ scheme[0-0,0-2), path_rootless[0-2,0-7) ]",
    );
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( scheme[0-0,0-2) PathPart,1,abs ( path_rootless[0-2,0-7)))",
    );
  });

  it("#pazURI()", () => {
    init_("  ");
    assertEquals(pazr.root, undefined);

    repl(rv(0, 1), "??/#✌🏼");
    /*
    ·??/#✌🏼·
     */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "URI,0 [ query[0-1,0-4), fragment[0-4) ]",
    );
    assertEquals(
      pazr.root?.toString(),
      "URI,0 ( Query,1 Fragment,1)",
    );
  });
});
/*80--------------------------------------------------------------------------*/
