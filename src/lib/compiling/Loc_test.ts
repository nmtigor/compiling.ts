/** 80**************************************************************************
 * @module lib/compiling/Loc_test
 * @license MIT
 ******************************************************************************/

import { assert, assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import type { Bidir } from "../Bidi.ts";
import { Bidi } from "../Bidi.ts";
import type { BufrDir, lnum_t, loff_t } from "../alias.ts";
import { loadBidi } from "../loadBidi.ts";
import { Bufr } from "./Bufr.ts";
import type { Line } from "./Line.ts";
import type { _BidiO_ } from "./Loc.ts";
import type { TestO } from "./_test.ts";
import { loc, test_o } from "./_test.ts";
/*80--------------------------------------------------------------------------*/

await loadBidi();

const bufr = new Bufr();
Object.assign(test_o, { bufr } as Partial<TestO>);

let bidiO_: _BidiO_;

const init_ = (
  text_x?: string,
  dir_x = "ltr" as BufrDir,
  wrapData_x?: Record<number, loff_t[]>,
) => {
  bufr.dir_mo.set_Moo(dir_x); //! must before `.setLines()`
  bufr.setLines(text_x);

  bidiO_ = new EdtrMock_(bufr, wrapData_x);
};

afterEach(() => {
  bufr.reset_Bufr();
});

describe("Move Loc, nowrap, rtl", () => {
  beforeEach(() => {
    init_("abc אמנון\n\n0123 xyz", "rtl");
  });

  it("validate()", () => {
    assertEquals(bufr.lineN, 3);

    const bidi_0 = bidiO_.bidi_1(0).validate();
    assertEquals(
      Array.from(bidi_0.embedLevels.levels),
      [2, 2, 2, 1, 1, 1, 1, 1, 1],
    );
    assertEquals(bidi_0._visul_a_, [6, 7, 8, 5, 4, 3, 2, 1, 0]);
    assertEquals(bidi_0._logal_a_, [8, 7, 6, 5, 4, 3, 0, 1, 2]);

    const bidi_1 = bidiO_.bidi_1(1).validate();
    assertEquals(Array.from(bidi_1.embedLevels.levels), []);
    assertEquals(bidi_1._visul_a_, []);
    assertEquals(bidi_1._logal_a_, []);

    const bidi_2 = bidiO_.bidi_1(2).validate();
    assertEquals(
      Array.from(bidi_2.embedLevels.levels),
      [2, 2, 2, 2, 1, 2, 2, 2],
    );
    assertEquals(bidi_2._visul_a_, [4, 5, 6, 7, 3, 0, 1, 2]);
    assertEquals(bidi_2._logal_a_, [5, 6, 7, 4, 0, 1, 2, 3]);
  });

  it("visulLeftenIn()", () => {
    const bidi_0 = bidiO_.bidi_1(0);
    const bidi_1 = bidiO_.bidi_1(1);
    const bidi_2 = bidiO_.bidi_1(2);
    const l_ = loc(0);
    l_.visulFarrigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(rigt),r:0,l:9");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(midl),r:0,l:2");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(midl),r:0,l:1");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(midl),r:0,l:0");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:5(midl),r:0,l:3");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:4(midl),r:0,l:4");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:3(midl),r:0,l:5");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(midl),r:0,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(left),r:0,l:9");

    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:-1(rigt),r:0,l:0");

    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:7(rigt),r:0,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:7(midl),r:0,l:3");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:6(midl),r:0,l:2");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:4(midl),r:0,l:0");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:3(midl),r:0,l:4");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:2(midl),r:0,l:7");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:1(midl),r:0,l:6");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:0(midl),r:0,l:5");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:0(left),r:0,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:0(left),r:0,l:8");
  });

  it("visulRigtenIn()", () => {
    const bidi_0 = bidiO_.bidi_1(0);
    const bidi_1 = bidiO_.bidi_1(1);
    const bidi_2 = bidiO_.bidi_1(2);
    const l_ = loc(2);
    l_.visulFarleftenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:0(left),r:0,l:8");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:0(midl),r:0,l:5");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:1(midl),r:0,l:6");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:3(midl),r:0,l:4");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:4(midl),r:0,l:0");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:5(midl),r:0,l:1");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:7(midl),r:0,l:3");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_2._last_, "v:7(rigt),r:0,l:8");

    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:-1(left),r:0,l:0");

    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(left),r:0,l:9");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(midl),r:0,l:8");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:1(midl),r:0,l:7");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:5(midl),r:0,l:3");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(midl),r:0,l:0");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(midl),r:0,l:1");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(midl),r:0,l:2");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(rigt),r:0,l:9");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(rigt),r:0,l:9");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(rigt),r:0,l:9");
  });
});

describe("Move Loc, with wrap, ltr", () => {
  beforeEach(() => {
    init_("abc אמנון\n0123 xyz", "ltr", { [0]: [7, 9], [1]: [7, 8] });
  });

  it("validate()", () => {
    assertEquals(bufr.lineN, 2);

    const bidi_0 = bidiO_.bidi_1(0).validate();
    assertEquals(
      Array.from(bidi_0.embedLevels.levels),
      [0, 0, 0, 0, 1, 1, 1, 1, 1],
    );
    assertEquals(bidi_0._visul_a_, [0, 1, 2, 3, 6, 5, 4, 8, 7]);
    assertEquals(bidi_0._logal_a_, [0, 1, 2, 3, 6, 5, 4, 8, 7]);

    const bidi_1 = bidiO_.bidi_1(1).validate();
    assertEquals(
      Array.from(bidi_1.embedLevels.levels),
      [0, 0, 0, 0, 0, 0, 0, 0],
    );
    assertEquals(bidi_1._visul_a_, [0, 1, 2, 3, 4, 5, 6, 7]);
    assertEquals(bidi_1._logal_a_, [0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("visulRigtenIn()", () => {
    const bidi_0 = bidiO_.bidi_1(0);
    const bidi_1 = bidiO_.bidi_1(1);
    const l_ = loc(0);
    l_.visulFarleftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(left),r:0,l:0");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:3(midl),r:0,l:3");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:4(midl),r:0,l:6");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:5(midl),r:0,l:5");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(midl),r:0,l:4");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(midl),r:1,l:8");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(midl),r:1,l:7");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(rigt),r:1,l:9");

    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:0(left),r:0,l:0");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:6(midl),r:0,l:6");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(midl),r:1,l:7");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(rigt),r:1,l:8");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(rigt),r:1,l:8");
  });

  it("visulLeftenIn()", () => {
    const bidi_0 = bidiO_.bidi_1(0);
    const bidi_1 = bidiO_.bidi_1(1);
    const l_ = loc(1);
    l_.visulFarrigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(rigt),r:1,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(midl),r:1,l:7");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:6(midl),r:0,l:6");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:0(midl),r:0,l:0");

    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(rigt),r:1,l:9");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(midl),r:1,l:7");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(midl),r:1,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(midl),r:0,l:4");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:4(midl),r:0,l:6");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:3(midl),r:0,l:3");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(midl),r:0,l:0");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(left),r:0,l:0");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(left),r:0,l:0");
  });
});

describe("Move Loc, with wrap, rtl", () => {
  beforeEach(() => {
    init_("abc אמנון\n0123 xyz", "rtl", { [0]: [7, 9], [1]: [7, 8] });
  });

  it("validate()", () => {
    assertEquals(bufr.lineN, 2);

    const bidi_0 = bidiO_.bidi_1(0).validate();
    assertEquals(
      Array.from(bidi_0.embedLevels.levels),
      [2, 2, 2, 1, 1, 1, 1, 1, 1],
    );
    assertEquals(bidi_0._visul_a_, [4, 5, 6, 3, 2, 1, 0, 8, 7]);
    assertEquals(bidi_0._logal_a_, [6, 5, 4, 3, 0, 1, 2, 8, 7]);

    const bidi_1 = bidiO_.bidi_1(1).validate();
    assertEquals(
      Array.from(bidi_1.embedLevels.levels),
      [2, 2, 2, 2, 1, 2, 2, 2],
    );
    assertEquals(bidi_1._visul_a_, [3, 4, 5, 6, 2, 0, 1, 7]);
    assertEquals(bidi_1._logal_a_, [5, 6, 4, 0, 1, 2, 3, 7]);
  });

  it("visulLeftenIn()", () => {
    const bidi_0 = bidiO_.bidi_1(0);
    const bidi_1 = bidiO_.bidi_1(1);
    const l_ = loc(0);
    l_.visulFarrigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(rigt),r:0,l:9");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(midl),r:0,l:2");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:4(midl),r:0,l:0");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:3(midl),r:0,l:3");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:2(midl),r:0,l:4");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(midl),r:0,l:6");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(midl),r:1,l:7");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(midl),r:1,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(left),r:1,l:9");

    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:6(rigt),r:0,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:6(midl),r:0,l:3");
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:3(midl),r:0,l:0");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:2(midl),r:0,l:4");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:1(midl),r:0,l:6");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:0(midl),r:0,l:5");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(midl),r:1,l:7");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(left),r:1,l:8");
    l_.visulLeftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(left),r:1,l:8");
  });

  it("visulRigtenIn()", () => {
    const bidi_0 = bidiO_.bidi_1(0);
    const bidi_1 = bidiO_.bidi_1(1);
    const l_ = loc(1);
    l_.visulFarleftenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(left),r:1,l:8");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:7(midl),r:1,l:7");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:0(midl),r:0,l:5");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:1(midl),r:0,l:6");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:2(midl),r:0,l:4");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:3(midl),r:0,l:0");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:6(midl),r:0,l:3");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_1._last_, "v:6(rigt),r:0,l:8");

    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(left),r:1,l:9");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:7(midl),r:1,l:8");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:8(midl),r:1,l:7");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:0(midl),r:0,l:6");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:2(midl),r:0,l:4");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:3(midl),r:0,l:3");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:4(midl),r:0,l:0");
    l_.visulRigtenIn(bidiO_);
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(midl),r:0,l:2");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(rigt),r:0,l:9");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(rigt),r:0,l:9");
    l_.visulRigtenIn(bidiO_);
    assertEquals(bidi_0._last_, "v:6(rigt),r:0,l:9");
  });
});
/*64----------------------------------------------------------*/

class ELineMock_ implements Bidir {
  //jjjj TOCLEANUP
  // bline_$;

  readonly #bidi = new Bidi();
  get bidi(): Bidi {
    //jjjj TOCLEANUP
    // return this.#bidi.valid ? this.#bidi : this.bline_$.bidi;
    return this.#bidi;
  }

  /**
   * @const @param bln_x
   * @const @param wrap_a_x
   */
  constructor(bln_x: Line, wrap_a_x?: loff_t[]) {
    //jjjj TOCLEANUP
    // this.setBLine_$(bln_x);
    this.#bidi.reset_Bidi(
      bln_x.text,
      bln_x.bufr.dir,
      wrap_a_x,
      bln_x.bidi.embedLevels,
    );
    //jjjj TOCLEANUP
    // if (wrap_a_x?.length as any > 1) {
    //   this.#bidi.validate();
    // }
  }
}

class EdtrMock_ {
  readonly elidx_m = new Map<lnum_t, ELineMock_>();
  /** @const @param lidx_x */
  bidi_1(lidx_x: lnum_t) {
    return this.elidx_m.get(lidx_x)!.bidi;
  }

  /**
   * @headconst @param bufr_x
   * @const @param wrapData_x
   */
  constructor(bufr_x: Bufr, wrapData_x?: Record<lnum_t, loff_t[]>) {
    let bln = bufr_x.frstLine;
    let eln = new ELineMock_(bln, wrapData_x?.[bln.lidx_1]);
    this.elidx_m.set(bln.lidx_1, eln);

    const VALVE = 100;
    let valve = VALVE;
    while (bln.nextLine && --valve) {
      bln = bln.nextLine;
      eln = new ELineMock_(bln, wrapData_x?.[bln.lidx_1]);
      this.elidx_m.set(bln.lidx_1, eln);
    }
    assert(valve, `Loop ${VALVE}(±1) times!`);
  }
}
/*80--------------------------------------------------------------------------*/
