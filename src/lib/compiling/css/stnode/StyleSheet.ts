/** 80**************************************************************************
 * @module lib/compiling/css/stnode/StyleSheet
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { sntFrstTk, sntLastTk } from "../../util.ts";
import type { RCSn, RCSnt } from "../alias.ts";
import { _repr_ } from "../util.ts";
import { CSSSn } from "./CSSSn.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class StyleSheet extends CSSSn {
  readonly #rc_a: RCSnt[];

  /* children$ */
  protected children$: RCSn[] | undefined;
  override get children(): RCSn[] {
    return this.children$ ??= this.#rc_a.filter((cv) => cv instanceof CSSSn);
  }
  /* ~ */

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   return sntKnown(this.#rc_a[0]) && sntKnown(this.#rc_a.at(-1)!);
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= sntFrstTk(this.#rc_a[0]);
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= sntLastTk(this.#rc_a.at(-1)!);
  }

  /** @const @param rc_a_x */
  constructor(rc_a_x: RCSnt[]) {
    super();
    this.#rc_a = rc_a_x;
    for (const rc of this.#rc_a) {
      if (rc instanceof CSSSn) rc.attachTo_$(this);
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.#rc_a.length);
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "#rc_a": this.#rc_a.map(_repr_),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
