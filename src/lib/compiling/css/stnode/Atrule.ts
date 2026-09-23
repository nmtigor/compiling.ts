/** 80**************************************************************************
 * @module lib/compiling/css/stnode/Atrule
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { ErrMsg, sntLastTk } from "../../util.ts";
import type { CVSn, CVSnt } from "../alias.ts";
import { CSSTok } from "../CSSTok.ts";
import { _repr_ } from "../util.ts";
import { CSSSn } from "./CSSSn.ts";
import { CVCtnr } from "./CVCtnr.ts";
import { SimpleBlock } from "./SimpleBlock.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class Atrule extends CVCtnr {
  readonly #openTk;
  readonly #clozTk: CSSTk | undefined;

  readonly #tailblock: SimpleBlock | undefined;
  get _tailblock_() {
    return this.#tailblock;
  }

  /* children$ */
  override get children(): CVSn[] {
    if (this.children$) return this.children$;

    this.children$ = this.cv_a$.filter((cv) => cv instanceof CSSSn);
    if (this.#tailblock) this.children$.push(this.#tailblock);
    return this.children$;
  }
  /* ~ */

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   let ret = this.#openTk.value !== BaseTok.unknown;
  //   if (!ret) return ret;

  //   ret =
  //     (this.#clozTk
  //       ? this.#clozTk.value !== BaseTok.unknown
  //       : this.#tailblock?.known) ??
  //       (this.cv_a$.length ? sntKnown(this.cv_a$.at(-1)!) : true);
  //   return ret;
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= this.#openTk;
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= this.#clozTk ?? this.#tailblock?.lastToken_1 ??
      (this.cv_a$.length ? sntLastTk(this.cv_a$.at(-1)!) : this.#openTk);
  }

  /**
   * @const @param openTk_x
   * @const @param lastTk_x
   * @const @param cv_a_x
   */
  constructor(openTk_x: CSSTk, lastTk_x?: CSSTk, cv_a_x?: CVSnt[]) {
    super(cv_a_x);
    this.#openTk = openTk_x;
    if (lastTk_x) {
      if (lastTk_x.value === CSSTok.semicolon) {
        this.#clozTk = lastTk_x;
      } else {
        this.#tailblock = lastTk_x.sn_$ as SimpleBlock;
        this.#tailblock.attachTo_$(this);
      }
    } else {
      this.setErr({ msg: ErrMsg.css_atrule_open });
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.#openTk.value === CSSTok.at_keyword);
      if (!this.isErr) {
        assert(
          this.#clozTk?.value === CSSTok.semicolon &&
              this.#tailblock === undefined ||
            this.#clozTk === undefined &&
              this.#tailblock instanceof SimpleBlock &&
              (this.#tailblock.isCurly || this.#tailblock.isErr),
        );
      }
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "#openTk": `${this.#openTk}`,
      "cv_a$": this.cv_a$.map((cv) => _repr_(cv)),
      "#tailblock": this.#tailblock?._repr_(),
      "#clozTk": this.#clozTk?.toString(),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
