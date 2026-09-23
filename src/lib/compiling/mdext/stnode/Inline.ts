/** 80**************************************************************************
 * @module lib/compiling/mdext/stnode/Inline
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import type { Loc } from "../../Loc.ts";
import type { MdextTk } from "../../Token.ts";
import { SortedSnt_id } from "../../util.ts";
import { MdextSn } from "./MdextSn.ts";
/*80--------------------------------------------------------------------------*/

export abstract class Inline extends MdextSn {
  /**
   * @primaryconst
   * @headconst @param loc_x
   */
  abstract tokenAt(loc_x: Loc): MdextTk;
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  override gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedSnt_id,
  ): uint {
    let ret = 0;
    if (
      this.sntStopLoc.posSE(drtStrtLoc_x) || this.sntStrtLoc.posGE(drtStopLoc_x)
    ) {
      unrelSnt_ss_x.add(this);
      ret = 1;
    }
    return ret;
  }
}
/*80--------------------------------------------------------------------------*/
