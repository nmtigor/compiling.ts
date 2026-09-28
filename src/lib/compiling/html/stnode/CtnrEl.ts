/** 80**************************************************************************
 * @module lib/compiling/html/stnode/CtnrEl
 * @license MIT
 ******************************************************************************/

import type { Insmod } from "@fe-cpl/html/alias.ts";
import { TagNS } from "@fe-cpl/html/alias.ts";
import type { SortedSn_id } from "@fe-cpl/util.ts";
import { ErrMsg } from "@fe-cpl/util.ts";
import type { uint } from "@fe-lib/alias.ts";
import { merge } from "@fe-lib/jslang.ts";
import { Loc } from "../../Loc.ts";
import { HTMLTk } from "../HTMLTk.ts";
import { HTMLTok } from "../HTMLTok.ts";
import { SortedHTMLSnt_id } from "../util.ts";
import { Elment } from "./Elment.ts";
import { HTMLCtnr } from "./HTMLCtnr.ts";
import type { Proins } from "./Proins.ts";
import { gathrUnrelSub } from "./util.ts";
/*80--------------------------------------------------------------------------*/

/** non-`TextCat.void` Elment */
export abstract class CtnrEl extends Elment {
  readonly ctnr_$;

  override get children(): (Elment | Proins)[] {
    return this.ctnr_$.children;
  }

  /** @implement */
  get frstToken_1() {
    return this.frstTk$ ??= this.ctnr_$.frstToken_1;
  }
  /** @implement */
  get lastToken_1() {
    return this.lastTk$ ??= this.ctnr_$.lastToken_1;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param tk_x `HTMLTok.tag` or `HTMLTok.placeholder`
   */
  constructor(insmod_x: Insmod, tagname_x: string, tk_x: HTMLTk) {
    super(insmod_x, tagname_x, tk_x.value === HTMLTok.tag ? tk_x : undefined);
    this.ctnr_$ = new HTMLCtnr(this, tk_x);
    //jjjj TOCLEANUP
    // tk_x.htmlSn_$ = this;

    if (this.ns === TagNS.HTML && tk_x.selfCloz && !tk_x.isErr) {
      tk_x.setErr({ msg: ErrMsg.html_tag_void_trail_solidus });
    }

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  //jjjj TOCLEANUP
  // override replaceChild(
  //   oldSn_x: Elment | Proins,
  //   newSn_x: Elment | Proins | undefined,
  // ): void {
  //   ///
  // }

  /** @implement */
  gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedHTMLSnt_id,
    unrelSn_ss_x: SortedSn_id,
  ): uint {
    if (unrelSn_ss_x.includes(this)) return 0;

    let ret = this.gathrSelf(drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
    if (ret) return ret;

    ret += gathrUnrelSub(
      this,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
      unrelSn_ss_x,
    );
    return ret;
  }
}

export interface CtnrEl extends Elment, HTMLCtnr {}
merge({
  srcClass: HTMLCtnr,
  tgtClass: CtnrEl,
  tgtField: "ctnr_$",
  ignrdKey: HTMLCtnr.impledMethod_a,
});
/*64----------------------------------------------------------*/

/** @final */
export class Unknown_El extends CtnrEl {
  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, tagname_x: string, opntagTk_x: HTMLTk) {
    super(insmod_x, tagname_x, opntagTk_x);
  }
}
/*80--------------------------------------------------------------------------*/
