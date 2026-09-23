/** 80**************************************************************************
 * @module lib/compiling/css/stnode/SimpleBlock
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

export class SimpleBlock extends CVCtnr {
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
  //     : true;
  //   return ret;
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= this.#openTk;
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= this.#clozTk ??
      (this.cv_a$.length ? sntLastTk(this.cv_a$.at(-1)!) : this.#openTk);
  }

  get isCurly() {
    return this.#openTk.value === CSSTok.curly_open &&
      this.#clozTk?.value === CSSTok.curly_cloz;
  }
  get isParen() {
    return this.#openTk.value === CSSTok.paren_open &&
      this.#clozTk?.value === CSSTok.paren_cloz;
  }
  get isSquar() {
    return this.#openTk.value === CSSTok.squar_open &&
      this.#clozTk?.value === CSSTok.squar_cloz;
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
      this.setErr({ msg: ErrMsg.css_simple_block_open });
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      if (!this.isErr) assert(this.isCurly || this.isParen || this.isSquar);
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
