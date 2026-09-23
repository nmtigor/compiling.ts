/** 80**************************************************************************
 * @module lib/compiling/mdext/stnode/Emphasis
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import { fail } from "@fe-lib/util.ts";
import { DEBUG, INOUT } from "@fe-src/preNs.ts";
import type { Loc } from "../../Loc.ts";
import type { MdextTk } from "../../Token.ts";
import { Token } from "../../Token.ts";
import type { SortedSnt_id } from "../../util.ts";
import type { MdextLexr } from "../MdextLexr.ts";
import { _toHTML_, gathrUnrelTk_$ } from "../util.ts";
import { Inline } from "./Inline.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class Emphasis extends Inline {
  #strong;

  #frstTk;
  #lastTk;
  #textSnt_a;

  #children?: Inline[];
  override get children(): Inline[] {
    if (this.#children) return this.#children;

    const ret: Inline[] = [];
    for (const snt of this.#textSnt_a) {
      if (snt instanceof Inline) ret.push(snt);
    }
    return this.#children = ret;
  }

  override get frstToken_1() {
    return this.frstTk$ ??= this.#frstTk;
  }
  override get lastToken_1() {
    return this.lastTk$ ??= this.#lastTk;
  }

  /**
   * @headconst @param frstTk_x
   * @headconst @param lastTk_x
   * @headconst @param textSnt_a_x
   */
  constructor(
    frstTk_x: MdextTk,
    lastTk_x: MdextTk,
    textSnt_a_x: (MdextTk | Inline)[],
  ) {
    super();
    this.#frstTk = frstTk_x;
    this.#lastTk = lastTk_x;
    this.#strong = frstTk_x.length_1 > 1;
    this.#textSnt_a = textSnt_a_x;

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @implement */
  tokenAt(loc_x: Loc): MdextTk {
    if (this.lastToken_1.touch(loc_x)) return this.lastToken_1;

    for (let i = this.#textSnt_a.length; i--;) {
      const snt = this.#textSnt_a[i];
      if (snt.touch(loc_x)) {
        return snt instanceof Inline ? snt.tokenAt(loc_x) : snt;
      }
    }

    if (this.frstToken_1.touch(loc_x)) return this.frstToken_1;

    return /*#static*/ DEBUG ? fail("Should not run here!") : this.frstToken_1;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  override gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedSnt_id,
  ): uint {
    let ret = super.gathrUnrelSnt(drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
    if (ret) return ret;

    ret += gathrUnrelTk_$(
      this.#frstTk,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
    );

    for (const snt of this.#textSnt_a) {
      if (snt instanceof Token) {
        ret += gathrUnrelTk_$(snt, drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
      } else {
        ret += snt.gathrUnrelSnt(drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
      }
    }

    ret += gathrUnrelTk_$(
      this.#lastTk,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
    );
    return ret;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(lexr_x: MdextLexr): string {
    return lexr_x._enableTags
      ? [
        this.#strong ? "<strong>" : "<em>",
        _toHTML_(lexr_x, this.#textSnt_a),
        this.#strong ? "</strong>" : "</em>",
      ].join("")
      : _toHTML_(lexr_x, this.#textSnt_a);
  }
}
/*80--------------------------------------------------------------------------*/
