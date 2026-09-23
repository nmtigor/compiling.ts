/** 80**************************************************************************
 * @module lib/compiling/css/stnode/StyleBlock
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { sntFrstTk, sntLastTk } from "../../util.ts";
import type { Daqc, Daqct } from "../alias.ts";
import { _repr_ } from "../util.ts";
import { CSSSn } from "./CSSSn.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class StyleBlock extends CSSSn {
  readonly #daqct_a: Daqct[];

  /* children$ */
  protected children$: Daqc[] | undefined;
  override get children(): Daqc[] {
    return this.children$ ??= this.#daqct_a.filter((cv) => cv instanceof CSSSn);
  }
  /* ~ */

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   return sntKnown(this.#daqct_a[0]) && sntKnown(this.#daqct_a.at(-1)!);
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= sntFrstTk(this.#daqct_a[0]);
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= sntLastTk(this.#daqct_a.at(-1)!);
  }

  /** @const @param daqc_a_x */
  constructor(daqc_a_x: Daqct[]) {
    super();
    this.#daqct_a = daqc_a_x;
    for (const daqc of this.#daqct_a) {
      if (daqc instanceof CSSSn) daqc.attachTo_$(this);
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.#daqct_a.length);
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "#daqct_a": this.#daqct_a.map(_repr_),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
