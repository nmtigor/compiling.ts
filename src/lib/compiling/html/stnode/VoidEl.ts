/** 80**************************************************************************
 * @module lib/compiling/html/stnode/VoidEl
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import type { Loc } from "../../Loc.ts";
import type { SortedSn_id, SortedTk_id } from "../../util.ts";
import type { Insmod } from "../alias.ts";
import { TextCat } from "../alias.ts";
import type { HTMLTk } from "../HTMLTk.ts";
import { Elment } from "./Elment.ts";
/*80--------------------------------------------------------------------------*/

export abstract class VoidEl extends Elment {
  declare readonly opntagTk: HTMLTk;

  /** @implement */
  get frstToken_1() {
    return this.frstTk$ = this.opntagTk;
  }
  /** @implement */
  get lastToken_1() {
    return this.lastTk$ = this.opntagTk;
  }

  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, tagname_x: string, opntagTk_x: HTMLTk) {
    super(insmod_x, tagname_x, opntagTk_x);
    //jjjj TOCLEANUP
    // opntagTk_x.htmlSn_$ = this;
    this.textCat$ = TextCat.void;

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @implement */
  gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelTk_ss_x: SortedTk_id,
    unrelSn_ss_x: SortedSn_id,
  ): uint {
    if (unrelSn_ss_x.includes(this)) {
      return this.gathrAllTks(unrelTk_ss_x);
    }

    let ret = this.gathrSelf(drtStrtLoc_x, drtStopLoc_x, unrelSn_ss_x);
    if (ret) {
      return ret += this.gathrAllTks(unrelTk_ss_x);
    }

    ret += this.opntagTk.gathrSelf(drtStrtLoc_x, drtStopLoc_x, unrelTk_ss_x);
    return ret;
  }
}
/*80--------------------------------------------------------------------------*/
