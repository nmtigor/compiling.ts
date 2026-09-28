/** 80**************************************************************************
 * @module lib/compiling/html/stnode/HTMLSn
 * @license MIT
 ******************************************************************************/

import { uint } from "@fe-lib/alias.ts";
import type { Loc } from "../../Loc.ts";
import { Stnode } from "../../Stnode.ts";
import type { SortedSn_id } from "../../util.ts";
import type { HTMLTok } from "../HTMLTok.ts";
import { ErrRepr, Insmod } from "../alias.ts";
import type { SortedHTMLSnt_id } from "../util.ts";
import { _reprErr_ } from "../util.ts";
/*80--------------------------------------------------------------------------*/

export abstract class HTMLSn extends Stnode<HTMLTok> {
  override get _err_(): ErrRepr[] {
    const retA: ErrRepr[] = [];
    if (this.err_ss$) {
      for (const err of this.err_ss$) {
        retA.push(_reprErr_(err, this));
      }
    }
    return retA;
  }

  readonly insmod;

  /** @const @param insmod */
  constructor(insmod_x: Insmod) {
    super();
    this.insmod = insmod_x;

    this.NErr$ = 64;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /**
   * @primaryconst
   * @borrow @primaryconst @param _drtStrtLoc_x
   * @borrow @primaryconst @param _drtStopLoc_x
   * @out @param _unrelSnt_ss_x
   * @borrow @primaryconst @param _unrelSn_ss_x
   * @return count of what're gathered
   */
  abstract gathrUnrelSnt(
    _drtStrtLoc_x: Loc,
    _drtStopLoc_x: Loc,
    _unrelSnt_ss_x: SortedHTMLSnt_id,
    _unrelSn_ss_x: SortedSn_id,
  ): uint;
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @const @param _indent_x */
  _toHTML_(_indent_x: uint = 0): string[] {
    return [];
  }
}
/*80--------------------------------------------------------------------------*/
