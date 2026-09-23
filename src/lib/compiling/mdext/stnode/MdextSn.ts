/** 80**************************************************************************
 * @module lib/compiling/mdext/MdextSn
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import type { Loc } from "../../Loc.ts";
import { Stnode } from "../../Stnode.ts";
import type { SortedSn_id, SortedSnt_id } from "../../util.ts";
import type { MdextLexr } from "../MdextLexr.ts";
import type { MdextTok } from "../MdextTok.ts";
/*80--------------------------------------------------------------------------*/

export abstract class MdextSn extends Stnode<MdextTok> {
  /**
   * @borrow @primaryconst @param _drtStrtLoc_x
   * @borrow @primaryconst @param _drtStopLoc_x
   * @out @param _unrelSnt_ss_x
   * @borrow @primaryconst @param _unrelSn_ss_x
   * @return count of what's gathered
   */
  gathrUnrelSnt(
    _drtStrtLoc_x: Loc,
    _drtStopLoc_x: Loc,
    _unrelSnt_ss_x: SortedSnt_id,
    _unrelSn_ss_x?: SortedSn_id,
  ): uint {
    return 0;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @headconst @param _lexr_x */
  _toHTML_(_lexr_x: MdextLexr): string {
    return "";
  }
}
/*80--------------------------------------------------------------------------*/
