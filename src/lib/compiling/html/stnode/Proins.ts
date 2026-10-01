/** 80**************************************************************************
 * @module lib/compiling/html/stnode/Proins
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import { space } from "@fe-lib/util.ts";
import type { Loc } from "../../Loc.ts";
import type { SortedSn_id, SortedTk_id } from "../../util.ts";
import type { Insmod } from "../alias.ts";
import type { HTMLTk } from "../HTMLTk.ts";
import type { Proins_LI } from "../util.ts";
import { HTMLSn } from "./HTMLSn.ts";
/*80--------------------------------------------------------------------------*/

/**
 * Processing instruction
 * @final
 */
export class Proins extends HTMLSn {
  readonly tk;

  override get frstToken_1() {
    return this.frstTk$ = this.tk;
  }
  override get lastToken_1() {
    return this.lastTk$ = this.tk;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  //jjjj TOCLEANUP
  // /** against to  "targetParent" */
  // srcPa?: CtnrEl | undefined;

  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x);
    this.tk = tk_x;

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

    ret += this.tk.gathrSelf(drtStrtLoc_x, drtStopLoc_x, unrelTk_ss_x);
    return ret;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(indent_x: uint): string[] {
    const li_ = this.tk.lexdInfo as Proins_LI;
    const d_ = li_.data_$?.getText();
    return [
      `| ${space(indent_x)}<?${li_.target.getText()}${d_ ? ` ${d_}` : ""}?>`,
    ];
  }
}
/*80--------------------------------------------------------------------------*/
