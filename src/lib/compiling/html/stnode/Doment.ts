/** 80**************************************************************************
 * @module lib/compiling/html/stnode/Doment
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import { composite } from "@fe-lib/jslang.ts";
import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { Loc } from "../../Loc.ts";
import { Ranval } from "../../Ranval.ts";
import type { SortedSn_id } from "../../util.ts";
import { ErrMsg } from "../../util.ts";
import { Insmod } from "../alias.ts";
import { HTMLTk } from "../HTMLTk.ts";
import type { Doctype_LI, SortedHTMLSnt_id } from "../util.ts";
import { Elment } from "./Elment.ts";
import { HTMLCtnr } from "./HTMLCtnr.ts";
import { HTMLSn } from "./HTMLSn.ts";
import type { Proins } from "./Proins.ts";
import { _toHTML_, gathrUnrelSub } from "./util.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class Doment extends HTMLSn {
  readonly ctnr_$;

  override get children(): (Elment | Proins)[] {
    return this.ctnr_$.children;
  }

  declare protected frstTk$: HTMLTk | undefined;
  override get frstToken_1() {
    return this.frstTk$ ??= this.ctnr_$.frstToken_1;
  }
  declare protected lastTk$: HTMLTk | undefined;
  override get lastToken_1() {
    return this.lastTk$ ??= this.ctnr_$.lastToken_1;
  }

  protected override get canEnsureBdries$(): boolean {
    return !!this.ctnr_$.snt_a.length;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  doctype_$: HTMLTk | undefined;

  /**
   * `in( tk_x.value === HTMLTok.doctype)`
   * @const @param tk_x
   */
  setDoctype(tk_x: HTMLTk): this {
    /*#static*/ if (INOUT) {
      assert(!this.doctype_$);
    }
    this.doctype_$ = tk_x;
    const li_ = tk_x.lexdInfo as Doctype_LI;
    if (
      li_.name_s !== "html" ||
      li_.sys && li_.noqtSys_s !== "about:legacy-compat"
    ) {
      this.setErr({
        msg: ErrMsg.html_unknown_doctype,
        rv: Ranval.fromRan(tk_x.ran_$),
      });
    }
    return this;
  }

  constructor() {
    super(Insmod.initial);
    this.ctnr_$ = new HTMLCtnr(this);
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @implement */
  gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedHTMLSnt_id,
    unrelSn_ss_x: SortedSn_id,
  ): uint {
    return gathrUnrelSub(
      this,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
      unrelSn_ss_x,
    );
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(): string[] {
    return _toHTML_(this);
  }
}

export interface Doment extends HTMLSn, HTMLCtnr {}
composite({
  tgtClass: Doment,
  tgtField: "ctnr_$",
  srcClass: HTMLCtnr,
  ignrdKey: HTMLCtnr.impledMethod_a,
});
/*80--------------------------------------------------------------------------*/
