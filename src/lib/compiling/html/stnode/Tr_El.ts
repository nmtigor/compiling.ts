/** 80**************************************************************************
 * @module lib/compiling/html/stnode/Tr_El
 * @license MIT
 ******************************************************************************/

import type { Insmod } from "../alias.ts";
import type { HTMLTk } from "../HTMLTk.ts";
import { SpecialCtnrEl } from "./SpecialCtnrEl.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class Tr_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "tr", tk_x);
  }
}
/*80--------------------------------------------------------------------------*/
