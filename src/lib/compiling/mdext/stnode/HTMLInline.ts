/** 80**************************************************************************
 * @module lib/compiling/mdext/stnode/HTMLInline
 * @license MIT
 ******************************************************************************/

import type { uint } from "@fe-lib/alias.ts";
import { assert, fail } from "@fe-lib/util.ts";
import { DEBUG, INOUT } from "@fe-src/preNs.ts";
import type { Loc } from "../../Loc.ts";
import type { MdextTk } from "../../Token.ts";
import type { SortedSnt_id } from "../../util.ts";
import { gathrUnrelTk_$ } from "../util.ts";
import { Inline } from "./Inline.ts";
/*80--------------------------------------------------------------------------*/

const TAGNAME_ = "[A-Za-z][0-9A-Za-z-]*";
const ATTRIBUTENAME_ = "[A-Za-z_:][\\w:.-]*";
const ATTRIBUTEVALUE_ = `(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*")`;
const ATTRIBUTEVALUESPEC_ = `(?:[ \t\n]*=[ \t\n]*${ATTRIBUTEVALUE_})`;
const ATTRIBUTE_ = `(?:[ \t\n]+${ATTRIBUTENAME_}${ATTRIBUTEVALUESPEC_}?)`;
const OPENTAG_ = `<${TAGNAME_}${ATTRIBUTE_}*[ \t\n]*/?>`;
const CLOZTAG_ = `</${TAGNAME_}[ \t\n]*>`;
const COMMENT_ = "<!-->|<!--->|<!--[\\s\\S]*?-->";
/** Processing Instruction */
const PI_ = "<[?][\\s\\S]*?[?]>";
const DECL_ = `<![A-Za-z]+[^>]*>`;
const CDATA_ = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";

/** @final */
export class HTMLInline extends Inline {
  /** reHtmlTag */
  static readonly HTMLTag_re = new RegExp(
    `^(?:${OPENTAG_}|${CLOZTAG_}|${COMMENT_}|${PI_}|${DECL_}|${CDATA_})`,
  );

  #frstTk;
  #chunkTk_a;
  #lastTk;

  override get frstToken_1() {
    return this.frstTk$ ??= this.#frstTk;
  }
  override get lastToken_1() {
    return this.lastTk$ ??= this.#lastTk;
  }

  /**
   * @headconst @param frstTk_x
   * @headconst @param chunkTk_a_x
   * @headconst @param lastTk_x
   */
  constructor(frstTk_x: MdextTk, chunkTk_a_x: MdextTk[], lastTk_x: MdextTk) {
    super();
    this.#frstTk = frstTk_x;
    this.#chunkTk_a = chunkTk_a_x;
    this.#lastTk = lastTk_x;

    this.ensureBdries();
    /*#static*/ if (INOUT) {
      assert(this.#chunkTk_a.length);
    }
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @implement */
  tokenAt(loc_x: Loc): MdextTk {
    if (this.#lastTk.touch(loc_x)) return this.#lastTk;

    for (let i = this.#chunkTk_a.length; i--;) {
      const tk_ = this.#chunkTk_a[i];
      if (tk_.touch(loc_x)) return tk_;
    }

    if (this.#frstTk.touch(loc_x)) return this.#frstTk;

    return /*#static*/ DEBUG ? fail("Should not run here!") : this.frstToken_1;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  override gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedSnt_id,
  ): uint {
    let ret = super.gathrUnrelSnt(drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
    if (ret) return ret;

    ret += gathrUnrelTk_$(
      this.#frstTk,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
    );

    for (const tk of this.#chunkTk_a) {
      ret += gathrUnrelTk_$(tk, drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);
    }

    ret += gathrUnrelTk_$(
      this.#lastTk,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
    );
    return ret;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(): string {
    const s_a = ["<"];
    let curLn = this.#chunkTk_a[0].sntFrstLine;
    for (const tk of this.#chunkTk_a) {
      const ln_ = tk.sntFrstLine;
      if (ln_ !== curLn) {
        curLn = ln_;
        s_a.push("\n");
      }
      s_a.push(tk.getText());
    }
    s_a.push(">");
    return s_a.join("");
  }
}
/*80--------------------------------------------------------------------------*/
