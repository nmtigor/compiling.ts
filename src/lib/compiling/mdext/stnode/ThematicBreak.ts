/** 80**************************************************************************
 * @module lib/compiling/mdext/stnode/ThematicBreak
 * @license MIT
 ******************************************************************************/

import type { lnum_t, uint } from "@fe-lib/alias.ts";
import type { Loc } from "../../Loc.ts";
import type { MdextTk } from "../../Token.ts";
import type { SortedSnt_id } from "../../util.ts";
import { gathrUnrelTk_$ } from "../util.ts";
import { Block } from "./Block.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class ThematicBreak extends Block {
  #tk;

  override get frstToken_1() {
    return this.frstTk$ ??= this.#tk;
  }
  override get lastToken_1() {
    return this.lastTk$ ??= this.#tk;
  }

  constructor(tk_x: MdextTk) {
    super();
    this.#tk = tk_x;

    this.ensureBdries();
  }

  override gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedSnt_id,
  ): uint {
    return gathrUnrelTk_$(this.#tk, drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
  }

  override lidxOf(loc_x: Loc): lnum_t | -1 {
    return loc_x.line_$ === this.#tk.sntFrstLine ? this.#tk.sntFrstLidx_1 : -1;
  }

  override reuseLine(_lidx_x: lnum_t, snt_a_x: MdextTk[]) {
    snt_a_x.push(this.#tk);
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(): string {
    return `<hr />`;
  }
}
/*80--------------------------------------------------------------------------*/
