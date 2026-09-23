/** 80**************************************************************************
 * @module lib/compiling/uri/stnode/Query
 * @license MIT
 ******************************************************************************/

import type { URITk } from "../../Token.ts";
import { URISn } from "./URISn.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class Query extends URISn {
  #tk;

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   return this.#tk.value !== BaseTok.unknown;
  // }

  override get frstToken_1(): URITk {
    return this.frstTk$ ??= this.#tk;
  }
  override get lastToken_1(): URITk {
    return this.lastTk$ ??= this.#tk;
  }

  /** @const @param tk_x  */
  constructor(tk_x: URITk) {
    super();
    this.#tk = tk_x;

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override toString() {
    return this._info_;
  }
}
/*80--------------------------------------------------------------------------*/
