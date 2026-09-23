/** 80**************************************************************************
 * @module lib/compiling/css/stnode/Qurule
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { ErrMsg, sntFrstTk, sntLastTk } from "../../util.ts";
import type { CVSn, CVSnt } from "../alias.ts";
import { _repr_ } from "../util.ts";
import { CSSSn } from "./CSSSn.ts";
import { CVCtnr } from "./CVCtnr.ts";
import { SimpleBlock } from "./SimpleBlock.ts";
/*80--------------------------------------------------------------------------*/

/**
 * Qualified rule with prelude
 *
 * Notice by [5.4.3. Consume a qualified rule](https://www.w3.org/TR/css-syntax-3/#consume-qualified-rule),
 * a qualified rule may have no prelude.
 *
 * @final
 */
export class Qurule extends CVCtnr {
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
  //   let ret = this.cv_a$.length
  //     ? sntKnown(this.cv_a$[0])
  //     : this.#tailblock!.known;
  //   if (!ret) return ret;

  //   ret = this.#tailblock?.known ?? sntKnown(this.cv_a$.at(-1)!);
  //   return ret;
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= this.cv_a$.length
      ? sntFrstTk(this.cv_a$[0])
      : this.#tailblock!.frstToken_1!;
  }
  override get lastToken_1(): CSSTk {
    return this.lastTk$ ??= this.#tailblock?.lastToken_1 ??
      sntLastTk(this.cv_a$.at(-1)!);
  }

  /**
   * @const @param cv_a_x
   * @const @param lastTk_x
   */
  constructor(cv_a_x: CVSnt[], lastTk_x?: CSSTk) {
    super(cv_a_x);
    /*#static*/ if (INOUT) {
      assert(this.cv_a$.length || lastTk_x);
    }
    if (this.cv_a$.length === 0) {
      this.setErr({ msg: ErrMsg.css_qurule_no_prelude });
    }
    if (lastTk_x) {
      this.#tailblock = lastTk_x.sn_$ as SimpleBlock;
      this.#tailblock.attachTo_$(this);
    } else {
      this.setErr({ msg: ErrMsg.css_qurule_open });
    }

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.cv_a$.length || this.#tailblock);
      if (!this.isErr) {
        assert(
          this.cv_a$.length &&
            this.#tailblock instanceof SimpleBlock && this.#tailblock.isCurly,
        );
      }
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "cv_a$": this.cv_a$.map((cv) => _repr_(cv)),
      "#tailblock": this.#tailblock?._repr_(),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
