/** 80**************************************************************************
 * @module lib/compiling/css/stnode/DeclarationList
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { sntFrstTk, sntLastTk } from "../../util.ts";
import type { Dact, Daqc } from "../alias.ts";
import { _repr_ } from "../util.ts";
import { CSSSn } from "./CSSSn.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class DeclarationList extends CSSSn {
  readonly #dact_a: Dact[];

  /* children$ */
  protected children$: Daqc[] | undefined;
  override get children(): Daqc[] {
    return this.children$ ??= this.#dact_a.filter((cv) => cv instanceof CSSSn);
  }
  /* ~ */

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   return sntKnown(this.#dact_a[0]) && sntKnown(this.#dact_a.at(-1)!);
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= sntFrstTk(this.#dact_a[0]);
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= sntLastTk(this.#dact_a.at(-1)!);
  }

  /** @const @param dact_a_x */
  constructor(dact_a_x: Dact[]) {
    super();
    this.#dact_a = dact_a_x;
    for (const dact of this.#dact_a) {
      if (dact instanceof CSSSn) dact.attachTo_$(this);
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.#dact_a.length);
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "#dact_a": this.#dact_a.map(_repr_),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
