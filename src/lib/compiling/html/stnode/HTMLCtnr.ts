/** 80**************************************************************************
 * @module lib/compiling/html/stnode/HTMLCtnr
 * @license MIT
 ******************************************************************************/

import type { int, uint } from "@fe-lib/alias.ts";
import { assert, out } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { Loc } from "../../Loc.ts";
import type { SortedSn_id, SortedTk_id } from "../../util.ts";
import { HTMLTk } from "../HTMLTk.ts";
import { HTMLTok } from "../HTMLTok.ts";
import { CtnrEl } from "./CtnrEl.ts";
import { Doment } from "./Doment.ts";
import { Elment } from "./Elment.ts";
import type { Proins } from "./Proins.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class HTMLCtnrImpl {
  readonly #host;

  private readonly _snt_a: (HTMLTk | Elment | Proins)[] = [];
  get snt_a() {
    return this._snt_a;
  }

  #children: (Elment | Proins)[] | undefined;
  get children(): (Elment | Proins)[] {
    if (this.#children) return this.#children;

    const retA: (Elment | Proins)[] = [];
    for (const snt of this._snt_a) {
      if (!(snt instanceof HTMLTk)) retA.push(snt);
    }
    return this.#children = retA;
  }

  get frstToken_1(): HTMLTk {
    const snt = this._snt_a[0];
    return snt instanceof HTMLTk ? snt : snt.frstToken_1;
  }
  get lastToken_1(): HTMLTk {
    const snt = this._snt_a.at(-1)!;
    return snt instanceof HTMLTk ? snt : snt.lastToken_1;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  /* #iCurChild */
  #iCurChild: -1 | uint = -1;
  get iCurChild() {
    return this.#iCurChild;
  }

  //jjjj TOCLEANUP
  // get curChild(): Elment | Proins | undefined {
  //   return this._snt_a.at(this.#iCurChild);
  // }

  /** @const @param child_x */
  compil(child_x: Elment | Proins | null): void {
    if (child_x) {
      this.#iCurChild = this._snt_a.indexOf(child_x);
    } else {
      this.#iCurChild = -1;
    }
  }

  get inCompiling() {
    return this.#iCurChild >= 0;
  }

  //jjjj TOCLEANUP
  // /** @const @param child_x */
  // isCompiling(child_x: Elment | Proins): boolean {
  //   return this.inCompiling && this.curChild === child_x;
  // }
  /* ~ */

  /**
   * @const @param host_x
   * @const @param tk_x `HTMLTok.tag` or `HTMLTok.placeholder`
   */
  constructor(host_x: CtnrEl | Doment, tk_x?: HTMLTk) {
    this.#host = host_x;
    if (tk_x) {
      this._snt_a.push(tk_x);
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @headconst @param snts_x */
  apdSnt(...snts_x: (HTMLTk | Elment | Proins)[]): void {
    if (snts_x.length === 0) return;
    //jjjj TOCLEANUP
    // correctSnts_(this.snt_a_$);

    for (const snt of snts_x) {
      this._snt_a.push(snt);
      if (snt instanceof HTMLTk) {
        //jjjj TOCLEANUP
        // snt.htmlSn_$ = this;
      } else {
        snt.attachTo_$(this.#host);
        this.#children = undefined;
      }
    }

    this.#host.invalBdries();
  }

  /**
   * @headconst @param snt_x
   * @const @param i_x `[ -_snt_a.length, _snt_a.length )`
   */
  insSnt(snt_x: HTMLTk | Elment | Proins, i_x?: int): void {
    if (i_x === undefined) return this.apdSnt(snt_x);
    //jjjj TOCLEANUP
    // correctSnts_(this._snt_a);

    this._snt_a.splice(i_x, 0, snt_x);
    if (snt_x instanceof HTMLTk) {
      //jjjj TOCLEANUP
      // snt_x.htmlSn_$ = this;
    } else {
      snt_x.attachTo_$(this.#host);
      this.#children = undefined;
    }
    // if (
    //   i_x === this._snt_a.length || i_x === 0 || i_x === -this._snt_a.length
    // ) {
    this.#host.invalBdries();
    // }
  }

  /**
   * @headconst @param snts_x (Part of) `_snt_a` of `this`\
   *    MUST be in the same order as in `_snt_a`
   */
  @out((self: HTMLCtnrImpl, _, args) => {
    assert(
      self._snt_a.length ||
        (args[0] as HTMLTk).value === HTMLTok.placeholder,
    );
  })
  rmvSnt(...snts_x: (HTMLTk | Elment | Proins)[]): void {
    if (snts_x.length === 0) return;

    if (snts_x === this._snt_a) {
      this._snt_a.length = 0;
      for (const snt of snts_x) {
        if (!(snt instanceof HTMLTk)) snt.detach_$();
      }
      this.#children = undefined;
    } else {
      let j_ = this._snt_a.length;
      for (let i = snts_x.length; i--;) {
        const snt_i = snts_x[i];
        for (; j_-- > 0;) {
          if (this._snt_a[j_] === snt_i) {
            this._snt_a.splice(j_, 1);
            if (snt_i instanceof HTMLTk) {
              //jjjj TOCLEANUP
              // snt_i.htmlSn_$ = undefined;
            } else {
              snt_i.detach_$();
              this.#children = undefined;
            }
            break;
          }
        }
      }
    }

    this.#host.invalBdries();
  }

  /**
   * @headconst @param tgtCtnr_x
   * @headconst @param snts_x (Part of) `_snt_a` of `this`\
   *    MUST be in the same order as in `_snt_a`
   */
  tfrSntTo(tgtCtnr_x: HTMLCtnr, ...snts_x: (HTMLTk | Elment)[]): this {
    const snt_a_ = snts_x.length
      ? snts_x
      : this.#host instanceof CtnrEl && this.#host.opntagTk
      ? this._snt_a.slice(1)
      : this._snt_a;
    this.rmvSnt(...snt_a_);
    tgtCtnr_x.apdSnt(...snt_a_);
    return this;
  }

  gathrUnrelSub(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelTk_ss_x: SortedTk_id,
    unrelSn_ss_x: SortedSn_id,
  ): uint {
    let ret = 0;
    for (const snt of this.snt_a) {
      if (snt instanceof HTMLTk) {
        ret += snt.gathrSelf(drtStrtLoc_x, drtStopLoc_x, unrelTk_ss_x);
      } else {
        ret += snt.gathrUnrelSnt(
          drtStrtLoc_x,
          drtStopLoc_x,
          unrelTk_ss_x,
          unrelSn_ss_x,
        );
      }
    }
    return ret;
  }

  /** `in( this.inCompiling)` */
  rmvCur(): void {
    const [rmvd] = this._snt_a.splice(this.#iCurChild, 1);
    /*#static*/ if (INOUT) {
      assert(rmvd && !(rmvd instanceof HTMLTk));
    }
    (rmvd as Elment | Proins).detach_$();

    this.#iCurChild = -1; //!
    this.#children = undefined;
    this.#host.invalBdries();
  }
}

type HTMLCtnrIgnrdKeys = "gathrUnrelSub";
export const HTMLCtnrIgnrdKeys = ["gathrUnrelSub"];

export type HTMLCtnr = Omit<HTMLCtnrImpl, HTMLCtnrIgnrdKeys>;
/*80--------------------------------------------------------------------------*/
