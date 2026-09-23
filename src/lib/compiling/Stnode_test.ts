/** 80**************************************************************************
 * @module lib/compiling/Stnode_test
 * @license MIT
 ******************************************************************************/

import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import type { uint } from "../alias.ts";
import type { CalcCommonO_ } from "./Stnode.ts";
import { Stnode } from "./Stnode.ts";
import { SortedSn_depth, SortedSn_id } from "./util.ts";
/*80--------------------------------------------------------------------------*/

class TestStnode extends Stnode {
  #children?: TestStnode[];
  override get children() {
    return this.#children;
  }

  set child(_x: TestStnode) {
    _x.attachTo_$(this);
    this.#children ??= [];
    this.#children.push(_x);
  }

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   return true;
  // }
}

function tsn_(n_x: uint): TestStnode[] {
  const ret = [];
  while (n_x-- > 0) ret.push(new TestStnode());
  return ret;
}
function dep_(a_x: TestStnode[], ...i_a_x: uint[]) {
  return new SortedSn_depth(i_a_x.map((i) => a_x[i]));
}

let debug: CalcCommonO_["debug"];

describe("Stnode.calcCommon()", () => {
  it("sort by depth", () => {
    const t_ = tsn_(4);
    /*
    2
    | |
    1 3
    |
    0
    */
    t_[2].child = t_[1];
    t_[1].child = t_[0];
    t_[2].child = t_[3];

    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 0, 3));
    assertEquals(debug.a, [t_[3], t_[0]]);
    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 0, 1, 3));
    assertEquals(debug.a, [t_[1], t_[3], t_[0]]);
    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 0, 1, 2, 3));
    assertEquals(debug.a, [t_[2], t_[1], t_[3], t_[0]]);
    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 0, 3, 1, 2));
    assertEquals(debug.a, [t_[2], t_[3], t_[1], t_[0]]);
  });

  it("floatupTail()", () => {
    const t_ = tsn_(4);
    /*
    2
    | |
    1 3
    |
    0
    */
    t_[2].child = t_[1];
    t_[1].child = t_[0];
    t_[2].child = t_[3];

    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 1, 3, 3));
    assertEquals(debug.f, [[t_[1], t_[3]]]);
    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 2, 0));
    assertEquals(debug.f, [[t_[2]]]);
    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 3, 1, 0));
    assertEquals(debug.f, [[t_[3], t_[1]]]);
    debug = {};
    Stnode.calcCommon({ debug }, dep_(t_, 2, 3, 0));
    assertEquals(debug.f, [[t_[2], t_[3], t_[1]], [t_[2]]]);
  });

  it("unrelSn_sa, unrelSn_a", () => {
    const t_ = tsn_(5);
    /*
    2
    | | |
    0 1 3
    */
    t_[2].child = t_[0];
    t_[2].child = t_[1];
    t_[2].child = t_[3];
    const unrelSn_ss = new SortedSn_id();

    Stnode.calcCommon({ unrelSn_ss, unrelSn_a: [t_[4]] }, dep_(t_, 0, 3));
    assertEquals([...unrelSn_ss], [t_[1], t_[4]]);
  });
});
/*80--------------------------------------------------------------------------*/
