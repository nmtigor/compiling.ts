/** 80**************************************************************************
 * @module lib/compiling/plain/PlainLexr
 * @license MIT
 ******************************************************************************/

import { fail } from "../../util.ts";
import { Lexr } from "../Lexr.ts";
import type { Ran } from "../Ran.ts";
import { g_ran_fac } from "../RanFac.ts";
import type { PlainTk } from "../Token.ts";
import { Token } from "../Token.ts";
import { SortedSnt_id } from "../util.ts";
import { PlainTok } from "./PlainTok.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class PlainLexr extends Lexr<PlainTok> {
  readonly unrelTk_ss_$ = new SortedPlainTk_id();
  readonly _reusdTk_ss_ = new SortedPlainTk_id();
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @primaryconst @param oldRan_a_x */
  protected override sufLexmrk$(oldRan_a_x: Ran[]): void {
    this.unrelTk_ss_$.reset_SortedSet();
    this._reusdTk_ss_.reset_SortedSet();

    let i_ = 0;
    const iI_ = oldRan_a_x.length;
    this.batchForw_$(
      (tk) => {
        if (i_ === iI_) {
          if (tk.sntStrtLoc.posGE(oldRan_a_x[i_ - 1].stopLoc)) {
            this.unrelTk_ss_$.add(tk);
          }
          return;
        }

        if (tk.sntStopLoc.posSE(oldRan_a_x[i_].strtLoc)) {
          if (i_ === 0 || tk.sntStrtLoc.posGE(oldRan_a_x[i_ - 1].stopLoc)) {
            this.unrelTk_ss_$.add(tk);
          }
          return;
        }

        for (i_ += 1; i_ < iI_; ++i_) {
          if (tk.sntStopLoc.posSE(oldRan_a_x[i_].strtLoc)) break;
        }
        if (tk.sntStrtLoc.posGE(oldRan_a_x[i_ - 1].stopLoc)) {
          this.unrelTk_ss_$.add(tk);
        }
      },
      this.curLexTk$.nextToken_$,
      this.stopLexTk$,
    );
  }

  //jjjj use `outTk$`
  /** @implement */
  protected scan_impl$(): PlainTk {
    for (const tk of this.unrelTk_ss_$) {
      if (this.curLoc$.posE(tk.sntStrtLoc) && tk.sntStopLoc.atEol) {
        this.unrelTk_ss_$.rmv(tk);
        this._reusdTk_ss_.add(tk);
        this.curLoc$.become_Loc(tk.sntStopLoc);
        tk.setValue(PlainTok.plaintext);
        return tk;
      }
    }

    const retTk = new Token(this, g_ran_fac.byLoc(this.curLoc$));
    const ln_ = this.curLoc$.line_$;
    if (this.curLoc$.reachEol) {
      this.curLoc$.set_Loc(ln_.nextLine!);
    } else {
      if (ln_ === this.stopLexTk$.sntFrstLine) {
        this.curLoc$.become_Loc(this.stopLexTk$.sntStrtLoc);
      } else {
        this.curLoc$.set_Loc(ln_);
      }
    }
    //jjjj TOCLEANUP
    // if (this.overLocLexBdry$() === LocCfd.yes) {
    //   this.curLoc$.become_Loc(this.stopLexTk$.sntStrtLoc);
    // }
    retTk.setStop(this.curLoc$, PlainTok.plaintext);
    return retTk;
  }

  protected override canConcat$(tk_0_x: PlainTk, tk_1_x: PlainTk): boolean {
    return !tk_0_x.empty && tk_1_x.lineN_1 === 1 && !tk_1_x.empty;
  }
}
/*64----------------------------------------------------------*/

export class SortedPlainTk_id extends SortedSnt_id<PlainTk> {
  constructor() {
    super();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  // override add(val_x: PlainTk): uint | -1 {
  //   return super.add(val_x);
  // }

  // override delete(val_x: PlainTk): uint | -1 {
  //   return super.delete(val_x);
  // }
}
/*80--------------------------------------------------------------------------*/
