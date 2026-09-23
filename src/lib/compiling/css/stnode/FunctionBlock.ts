/** 80**************************************************************************
 * @module lib/compiling/css/stnode/FunctionBlock
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { ErrMsg, sntLastTk } from "../../util.ts";
import type { CVSnt } from "../alias.ts";
import { CSSTok } from "../CSSTok.ts";
import { _repr_ } from "../util.ts";
import { CVCtnr } from "./CVCtnr.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class FunctionBlock extends CVCtnr {
  readonly #openTk;
  readonly #clozTk: CSSTk | undefined;

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   let ret = this.#openTk.value !== BaseTok.unknown;
  //   if (!ret) return ret;

  //   ret = this.#clozTk
  //     ? this.#clozTk.value !== BaseTok.unknown
  //     : this.cv_a$.length
  //     ? sntKnown(this.cv_a$.at(-1)!)
  //     : this.#openTk.value !== BaseTok.unknown;
  //   return ret;
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= this.#openTk;
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= this.#clozTk ??
      (this.cv_a$.length ? sntLastTk(this.cv_a$.at(-1)!) : this.#openTk);
  }

  /**
   * @const @param openTk_x
   * @const @param clozTk_x
   * @const @param cv_a_x
   */
  constructor(openTk_x: CSSTk, clozTk_x?: CSSTk, cv_a_x?: CVSnt[]) {
    super(cv_a_x);
    this.#openTk = openTk_x;
    if (clozTk_x) {
      this.#clozTk = clozTk_x;
    } else {
      this.setErr({ msg: ErrMsg.css_func_open });
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.#openTk.value === CSSTok.function);
      if (!this.isErr) assert(this.#clozTk?.value === CSSTok.paren_cloz);
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "#openTk": `${this.#openTk}`,
      "cv_a$": this.cv_a$.map((cv) => _repr_(cv)),
      "#clozTk": this.#clozTk?.toString(),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
