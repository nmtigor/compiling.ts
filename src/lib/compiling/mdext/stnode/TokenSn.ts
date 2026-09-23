/** 80**************************************************************************
 * @module lib/compiling/mdext/stnode/TokenSn
 * @license MIT
 ******************************************************************************/

import { domParser } from "@fe-lib/util/dom.ts";
import type { MdextTk } from "../../Token.ts";
import { _escapeXml_ } from "../util.ts";
import { Inline } from "./Inline.ts";
/*80--------------------------------------------------------------------------*/

export abstract class TokenSn extends Inline {
  protected tk$;

  override get frstToken_1() {
    return this.frstTk$ ??= this.tk$;
  }
  override get lastToken_1() {
    return this.lastTk$ ??= this.tk$;
  }

  constructor(tk_x: MdextTk) {
    super();
    this.tk$ = tk_x;

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @implement */
  override tokenAt(): MdextTk {
    return this.tk$;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  // override toString(): string {
  //   return this.tk$.getText();
  // }
}
/*80--------------------------------------------------------------------------*/

/** @finale */
export class HardBr extends TokenSn {
  override _toHTML_(): string {
    return "<br />";
  }
}

/** @finale */
export class SoftBr extends TokenSn {
}
/*80--------------------------------------------------------------------------*/

/** @finale */
export class Entity extends TokenSn {
  static readonly Re_lf = /^&#(?:x0*a|0*10);$/i;
  static readonly Re_tab = /^&#(?:x0*9|0*9);$/i;
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(): string {
    let s_ = this.tk$.getText();
    if (Entity.Re_lf.test(s_)) return "\n";
    if (Entity.Re_tab.test(s_)) return "\t";

    s_ = domParser.parseFromString(
      this.tk$.getText(),
      "text/html",
    ).textContent ?? "";
    return _escapeXml_(s_);
  }
}
/*80--------------------------------------------------------------------------*/

/** @finale */
export class Escaped extends TokenSn {
  override _toHTML_(): string {
    return _escapeXml_(this.tk$.getText()[1]);
  }
}
/*80--------------------------------------------------------------------------*/
