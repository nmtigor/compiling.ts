/** 80**************************************************************************
 * @module lib/compiling/css/stnode/Declaration
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { CSSTk } from "../../Token.ts";
import { sntLastTk } from "../../util.ts";
import type { CVSnt } from "../alias.ts";
import { CSSTok } from "../CSSTok.ts";
import { _repr_ } from "../util.ts";
import { CVCtnr } from "./CVCtnr.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class Declaration extends CVCtnr {
  readonly #openTk;
  readonly #clozTk: CSSTk | undefined;

  readonly #important;
  get important() {
    return this.#important;
  }

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   let ret = this.#openTk.value !== BaseTok.unknown;
  //   if (!ret) return ret;

  //   /** last Token before "!important" */
  //   let tk_: CSSTk | undefined;
  //   const cv_ = this.cv_a$.at(-1);
  //   if (cv_) {
  //     ret = sntKnown(cv_);
  //     if (!ret) return ret;
  //     tk_ = sntLastTk(cv_);
  //   } else {
  //     const tk_1 = this.#openTk.nextToken_$;
  //     tk_ = tk_1?.value === CSSTok.colon ? tk_1 : tk_1?.nextToken_$;
  //     ret = !!tk_ && tk_.value !== BaseTok.unknown;
  //     if (!ret) return ret;
  //   }

  //   if (this.#important) {
  //     let tk_1 = tk_?.nextToken_$?.nextToken_$;
  //     if (tk_1?.value !== CSSTok.ident) tk_1 = tk_1?.nextToken_$;
  //     /* stricter */
  //     ret = tk_1?.value === CSSTok.ident &&
  //       tk_1.nextToken_$?.value !== BaseTok.unknown;
  //   }
  //   return ret;
  // }

  override get frstToken_1(): CSSTk {
    return this.frstTk$ ??= this.#openTk;
  }
  override get lastToken_1(): CSSTk {
    if (this.lastTk$) return this.lastTk$;

    /** last Token before "!important" */
    let tk_: CSSTk;
    const cv_ = this.cv_a$.at(-1);
    if (cv_) {
      tk_ = sntLastTk(cv_);
    } else {
      const tk_1 = this.#openTk.nextToken_$!;
      tk_ = tk_1.value === CSSTok.colon ? tk_1 : tk_1.nextToken_$!;
    }

    if (this.#important) {
      let tk_1 = tk_.nextToken_$!.nextToken_$!;
      if (tk_1.value !== CSSTok.ident) tk_1 = tk_1.nextToken_$!;
      /*#static*/ if (INOUT) {
        assert(tk_1.value === CSSTok.ident);
      }
      this.lastTk$ = tk_1.nextToken_$!.value === CSSTok.whitespace
        ? tk_1.nextToken_$!
        : tk_1;
    } else {
      this.lastTk$ = tk_;
    }
    return this.lastTk$;
  }

  /**
   * @const @param openTk_x
   * @const @param clozTk_x
   * @const @param cv_a_x
   * @const @param important_x
   */
  constructor(
    openTk_x: CSSTk,
    clozTk_x?: CSSTk,
    cv_a_x?: CVSnt[],
    important_x?: boolean,
  ) {
    super(cv_a_x);
    this.#openTk = openTk_x;
    this.#clozTk = clozTk_x;
    this.#important = !!important_x;

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(
        this.#openTk.value === CSSTok.ident &&
          (!this.#clozTk || this.#clozTk.value === CSSTok.semicolon),
      );
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _repr_() {
    return [this._info_, {
      "#openTk": `${this.#openTk}`,
      "cv_a$": this.cv_a$.map((cv) => _repr_(cv)),
      "important": this.#important,
      "#clozTk": this.#clozTk?.toString(),
    }];
  }
}
/*80--------------------------------------------------------------------------*/
