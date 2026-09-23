/** 80**************************************************************************
 * @module lib/compiling/css/CSSLexr
 * @license MIT
 ******************************************************************************/

import { DEBUG, INOUT } from "@fe-src/preNs.ts";
import type { UInt16 } from "../../alias_v.ts";
import { assert, fail, out } from "../../util.ts";
import {
  isASCIIAlpha,
  isASCIINonprint,
  isASCIIWs,
  isDecimalDigit,
  isHexDigit,
} from "../../util/string.ts";
import { Lexr } from "../Lexr.ts";
import { LocCfd } from "../Loc.ts";
import type { CSSTk } from "../Token.ts";
import { ErrMsg, frstNon } from "../util.ts";
import { CSSTok } from "./CSSTok.ts";
/*80--------------------------------------------------------------------------*/

/** Ref. [ident-start code point](https://www.w3.org/TR/css-syntax-3/#ident-start-code-point) */
const isIdentStrt = (_x: UInt16): boolean =>
  isASCIIAlpha(_x) || _x >= 0x80 || _x === /* "_" */ 0x5F;
/** Ref. [ident code point](https://www.w3.org/TR/css-syntax-3/#ident-code-point) */
const isIdent = (_x: UInt16): boolean =>
  isIdentStrt(_x) || isDecimalDigit(_x) || _x === /* "-" */ 0x2D;

/** @final */
export class CSSLexr extends Lexr<CSSTok> {
  protected override preLex$(): void {
    switch (this.curLexTk$.value) {
      case CSSTok.delim: {
        switch (this.curLexTk$.sntStrtLoc.ucod) {
          case /* "#" */ 0x23: {
            this.stiflStopLexTk$();
            {
              const loc = this.curLexTk$.sntStopLoc;
              if (isIdent(loc.ucod) || this.#strtEscape(loc)) {
                this.enlrgStrtTk_1$();
              }
            }
            this.restoStopLexTk$();
            break;
          }
          case /* "+" */ 0x2B: {
            this.stiflStopLexTk$();
            {
              if (this.#strtNumber(this.curLexTk$.sntStopLoc)) {
                this.enlrgStrtTk_1$();
              }
            }
            this.restoStopLexTk$();

            const tk_ = this.curLexTk$;
            if (tk_.value === CSSTok.dimension) {
              const ucod = tk_.sntStopLoc.peek_ucod(-1);
              if (ucod === /* "E" */ 0x45 || ucod === /* "e" */ 0x65) {
                this.enlrgStrtTk$();
              }
            }
            break;
          }
          case /* "-" */ 0x2D: {
            this.stiflStopLexTk$();
            {
              if (this.#strtNumber(this.curLexTk$.sntStopLoc)) {
                this.enlrgStrtTk_1$();
              }
            }
            this.restoStopLexTk$();

            const tk_ = this.curLexTk$;
            if (tk_.value === CSSTok.dimension) {
              const ucod = tk_.sntStopLoc.peek_ucod(-1);
              if (ucod === /* "E" */ 0x45 || ucod === /* "e" */ 0x65) {
                this.enlrgStrtTk$();
              }
            }
            break;
          }
          case /* "." */ 0x2E: {
            if (isDecimalDigit(this.curLexTk$.sntStopLoc.ucod)) {
              this.enlrgStrtTk_2$();
            }

            const tk_ = this.curLexTk$;
            if (
              tk_.value === CSSTok.number ||
              tk_.value === CSSTok.delim &&
                (tk_.sntStrtLoc.ucod === /* "+" */ 0x2B ||
                  tk_.sntStrtLoc.ucod === /* "-" */ 0x2D)
            ) {
              this.enlrgStrtTk$();
            }
            break;
          }
          case /* "@" */ 0x40: {
            this.stiflStopLexTk$();
            {
              if (this.#strtIdent(this.curLexTk$.sntStopLoc)) {
                this.enlrgStrtTk_1$();
              }
            }
            this.restoStopLexTk$();
            break;
          }
        }
        break;
      }
      case CSSTok.hash: {
        this.stiflStopLexTk$();
        {
          const loc = this.curLexTk$.sntStopLoc;
          if (isIdent(loc.ucod) || this.#strtEscape(loc)) {
            this.enlrgStrtTk_1$();
          }
        }
        this.restoStopLexTk$();
        break;
      }
      case CSSTok.number: {
        this.stiflStopLexTk$();
        {
          const loc = this.curLexTk$.sntStopLoc;
          if (
            this.#strtNum(loc) ||
            loc.ucod === /* "E" */ 0x45 || loc.ucod === /* "e" */ 0x65 ||
            loc.ucod === /* "%" */ 0x25
          ) {
            this.enlrgStrtTk_1$();
          }
        }
        this.restoStopLexTk$();
        break;
      }
      case CSSTok.dimension: {
        const loc = this.curLexTk$.sntStopLoc;
        const ucod = loc.peek_ucod(-1);
        if (
          (ucod === /* "E" */ 0x45 || ucod === /* "e" */ 0x65) &&
          (loc.ucod === /* "+" */ 0x2B || loc.ucod === /* "-" */ 0x2D ||
            isDecimalDigit(loc.ucod))
        ) {
          this.enlrgStrtTk_2$();
        }
        break;
      }
      case CSSTok.at_keyword: {
        this.stiflStopLexTk$();
        {
          const loc = this.curLexTk$.sntStopLoc;
          if (isIdent(loc.ucod) || this.#strtEscape(loc)) {
            this.enlrgStrtTk_1$();
          }
        }
        this.restoStopLexTk$();
        break;
      }
      case CSSTok.ident: {
        if (this.curLexTk$.sntStopLoc.ucod === /* "-" */ 0x2D) {
          this.enlrgStrtTk_2$();
        }
        break;
      }
    }
    switch (this.stopLexTk$.value) {
      case CSSTok.ident: {
        if (!this.curLexTk$.sntStopLoc.posE(this.stopLexTk$.sntStrtLoc)) {
          const ucod = this.stopLexTk$.sntStrtLoc.peek_ucod(-1);
          if (
            ucod === /* "#" */ 0x23 || ucod === /* "-" */ 0x2D ||
            ucod === /* "@" */ 0x40
          ) {
            this.enlrgStopTk$();
          }
        }
        break;
      }
    }
    super.preLex$();
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  @out((self: CSSLexr) => {
    assert(self.outTk$?.value === CSSTok.comment);
  })
  #scanComment(): void {
    /*#static*/ if (INOUT) {
      assert(
        this.outTk$?.sntStrtLoc.posE(this.curLoc$, -2) &&
          this.curLoc$.peek_ucod(-2) === /* "/" */ 0x2F &&
          this.curLoc$.peek_ucod(-1) === /* "*" */ 0x2A,
      );
    }
    let reachBdry: boolean;
    const VALVE = 10_000;
    let valve = VALVE;
    L_0: do {
      switch (this.atLocLexBdry$()) {
        case LocCfd.yes:
          this.outTk$!.setErr({ msg: ErrMsg.block_comment_open })
            .setStop(this.curLoc$, CSSTok.comment);
          break L_0;
        case LocCfd.no_sameline:
          reachBdry = this.frstNonToBdry$((_y) => _y !== /* "*" */ 0x2A);
          if (!reachBdry && this.curLoc$.ucod === /* "*" */ 0x2A) {
            reachBdry = this.frstNonToBdry$(/* "*" */ 0x2A as UInt16);
            if (!reachBdry && this.curLoc$.ucod === /* "/" */ 0x2F) {
              this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.comment);
              break L_0;
            }
          }
          break;
        case LocCfd.no_othrline:
          this.curLoc$.loff_$ = frstNon(
            (_y) => _y !== /* "*" */ 0x2A,
            this.curLoc$.line_$,
            this.curLoc$.loff_$,
          );
          this.curLoc$.loff_$ = frstNon(
            /* "*" */ 0x2A as UInt16,
            this.curLoc$.line_$,
            this.curLoc$.loff_$,
          );
          if (this.curLoc$.ucod === /* "/" */ 0x2F) {
            this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.comment);
            break L_0;
          }
          this.curLoc$.forw();
          break;
        case LocCfd.no_othrBufr:
          /*#static*/ DEBUG ? fail("Should not run here!") : {};
      }
    } while (--valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);
  }

  /**
   * Ref. [4.3.8. Check if two code points are a valid escape](https://www.w3.org/TR/css-syntax-3/#check-if-two-code-points-are-a-valid-escape)
   * @const
   * @headborrow @const @param loc_x
   */
  #strtEscape(loc_x = this.curLoc$): boolean {
    if (loc_x.ucod !== /* "\\" */ 0x5C) return false;

    using loc_u = loc_x.usingDup().forw();
    return !this.reachLexBdry$(loc_u) && !loc_u.reachEol;
  }
  /**
   * Ref. [4.3.7. Consume an escaped code point](https://www.w3.org/TR/css-syntax-3/#consume-escaped-code-point)
   */
  #skipEscape(): void {
    /*#static*/ if (INOUT) {
      assert(this.curLoc$.peek_ucod(-1) === /* "\\" */ 0x5C);
    }
    if (this.curLoc$.reachEol || !isHexDigit(this.curLoc$.ucod)) {
      this.curLoc$.forw();
      return;
    }

    const reachBdry = this.frstNonToBdry$(isHexDigit, 0, 6);
    if (!reachBdry) {
      if (isASCIIWs(this.curLoc$.ucod)) this.curLoc$.forw();
    }
  }

  /**
   * Ref. [4.3.5. Consume a string token](https://www.w3.org/TR/css-syntax-3/#consume-a-string-token)
   */
  @out((self: CSSLexr) => {
    assert(self.outTk$?.value === CSSTok.string);
  })
  #scanString(): void {
    const frstUCod = this.curLoc$.ucod;
    /*#static*/ if (INOUT) {
      assert(
        this.outTk$?.sntStrtLoc.posE(this.curLoc$) &&
          (frstUCod === /* '"' */ 0x22 || frstUCod === /* "'" */ 0x27),
      );
    }
    this.curLoc$.forw();
    const VALVE = 100_000;
    let valve = VALVE;
    do {
      const reachBdry = this.reachLexBdry$();
      if (reachBdry || this.curLoc$.reachEol) {
        this.outTk$!.setErr({ msg: ErrMsg.quoted_string_open });
        if (!reachBdry) this.curLoc$.forw();
        this.outTk$!.setStop(this.curLoc$, CSSTok.string);
        break;
      }
      const ucod = this.curLoc$.ucod;
      if (ucod === frstUCod) {
        this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.string);
        break;
      }

      if (ucod === /* "\\" */ 0x5C) {
        this.curLoc$.forw();
        if (this.reachLexBdry$()) {
          this.outTk$!.setErr({ msg: ErrMsg.quoted_string_open })
            .setStop(this.curLoc$, CSSTok.string);
          break;
        }
        this.#skipEscape();
      } else {
        this.curLoc$.forw();
      }
    } while (--valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);
  }

  /**
   * Ref. [4.3.9. Check if three code points would start an ident sequence](https://www.w3.org/TR/css-syntax-3/#would-start-an-identifier)
   * @const
   * @headborrow @const @param loc_x
   */
  #strtIdent(loc_x = this.curLoc$): boolean {
    if (loc_x.ucod === /* "-" */ 0x2D) {
      using loc_u = loc_x.usingDup().forw();
      return !this.reachLexBdry$(loc_u) &&
        (isIdentStrt(loc_u.ucod) || loc_u.ucod === /* "-" */ 0x2D ||
          this.#strtEscape(loc_u));
    }

    return isIdentStrt(loc_x.ucod) || this.#strtEscape();
  }
  /**
   * Ref. [4.3.11. Consume an ident sequence](https://www.w3.org/TR/css-syntax-3/#consume-an-ident-sequence)
   */
  #skipIdent(): void {
    const VALVE = 10_000;
    let valve = VALVE;
    while (!this.reachLexBdry$() && --valve) {
      if (isIdent(this.curLoc$.ucod)) {
        this.curLoc$.forw();
        continue;
      }
      if (this.#strtEscape()) {
        this.curLoc$.forw();
        this.#skipEscape();
        continue;
      }
      break;
    }
    assert(valve, `Loop ${VALVE}(±1) times!`);
  }

  /**
   * Ref. [4.3.14. Consume the remnants of a bad url](https://www.w3.org/TR/css-syntax-3/#consume-remnants-of-bad-url)\
   * Keep in current Line
   */
  @out((self: CSSLexr) => {
    assert(self.outTk$?.value === CSSTok.url);
  })
  #scanBadUrl(): void {
    this.outTk$!.setErr({ msg: ErrMsg.css_bad_url });

    const VALVE = 10_000;
    let valve = VALVE;
    do {
      const reachBdry = this.frstNonToBdry$(
        (_y) => _y !== /* ")" */ 0x29 && _y !== /* "\\" */ 0x5C,
      );
      if (reachBdry || this.curLoc$.reachEol) {
        if (!reachBdry) this.curLoc$.forw();
        this.outTk$!.setStop(this.curLoc$, CSSTok.url);
        break;
      }

      const ucod = this.curLoc$.ucod;
      if (ucod === /* ")" */ 0x29) {
        this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.url);
        break;
      }
      if (ucod === /* "\\" */ 0x5C) {
        if (this.#strtEscape()) {
          this.#skipEscape();
        } else {
          this.curLoc$.forw();
        }
      }
    } while (--valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);
  }
  /**
   * Ref. [4.3.4. Consume an ident-like token](https://www.w3.org/TR/css-syntax-3/#consume-ident-like-token)\
   * `in( this.#strtIdent())`
   */
  @out((self: CSSLexr) => {
    const tkVal = self.outTk$?.value;
    assert(
      tkVal === CSSTok.ident || tkVal === CSSTok.function ||
        tkVal === CSSTok.url,
    );
  })
  #scanIdenLike(): void {
    this.#skipIdent();
    if (this.reachLexBdry$() || this.curLoc$.ucod !== /* "(" */ 0x28) {
      this.outTk$!.setStop(this.curLoc$, CSSTok.ident);
      return;
    }

    const ident_s = this.outTk$!.setStop(this.curLoc$).getText();
    if (ident_s !== "url") {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.function);
      return;
    }

    /** peek Loc */
    using poc_u = this.curLoc$.forw().usingDup();
    if (isASCIIWs(this.curLoc$.ucod)) this.skipASCIIWs$();
    if (
      this.reachLexBdry$() ||
      this.curLoc$.ucod === /* '"' */ 0x22 ||
      this.curLoc$.ucod === /* "'" */ 0x27
    ) {
      this.curLoc$.become_Loc(poc_u);
      this.outTk$!.setStop(this.curLoc$, CSSTok.function);
      return;
    }

    const VALVE = 10_000;
    let valve = VALVE;
    do {
      const reachBdry = this.frstNonToBdry$(
        (_y) =>
          _y !== /* '"' */ 0x22 && _y !== /* "'" */ 0x27 &&
          _y !== /* "(" */ 0x28 && _y !== /* ")" */ 0x29 &&
          _y !== /* "\\" */ 0x5C && !isASCIIWs(_y) && !isASCIINonprint(_y),
      );
      if (reachBdry || this.curLoc$.reachEol) {
        this.outTk$!.setErr({ msg: ErrMsg.css_bad_url });
        if (!reachBdry) this.curLoc$.forw();
        this.outTk$!.setStop(this.curLoc$, CSSTok.url);
        break;
      }

      const ucod = this.curLoc$.ucod;
      if (isASCIIWs(ucod)) {
        this.skipASCIIWs$();
        if (!this.reachLexBdry$() && this.curLoc$.ucod === /* ")" */ 0x29) {
          this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.url);
        } else {
          this.#scanBadUrl();
        }
        break;
      }
      if (
        ucod === /* '"' */ 0x22 || ucod === /* "'" */ 0x27 ||
        ucod === /* "(" */ 0x28 || isASCIINonprint(ucod)
      ) {
        this.curLoc$.forw();
        this.#scanBadUrl();
        break;
      }
      if (ucod === /* "\\" */ 0x5C) {
        if (this.#strtEscape()) {
          this.#skipEscape();
        } else {
          this.curLoc$.forw();
          this.#scanBadUrl();
          break;
        }
      }
    } while (--valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);
  }

  /**
   * "1" or ".1"\
   * `in( !this.reachLexBdry$(loc_x))`
   * @const
   * @headborrow @const @param loc_x
   */
  #strtNum(loc_x = this.curLoc$): boolean {
    if (isDecimalDigit(loc_x.ucod)) return true;

    if (loc_x.ucod === /* "." */ 0x2E) {
      using loc_u = loc_x.usingDup().forw();
      return !this.reachLexBdry$(loc_u) && isDecimalDigit(loc_u.ucod);
    }

    return false;
  }
  /**
   * Ref. [4.3.10. Check if three code points would start a number](https://www.w3.org/TR/css-syntax-3/#starts-with-a-number)
   * @const
   * @headborrow @const @param loc_x
   */
  #strtNumber(loc_x = this.curLoc$): boolean {
    if (loc_x.ucod === /* "+" */ 0x2B || loc_x.ucod === /* "-" */ 0x2D) {
      using loc_u = loc_x.usingDup().forw();
      return !this.reachLexBdry$(loc_u) && this.#strtNum(loc_u);
    }

    return this.#strtNum(loc_x);
  }
  /**
   * Ref. [4.3.12. Consume a number](https://www.w3.org/TR/css-syntax-3/#consume-number)\
   * `in( this.#strtNumber())`
   */
  #skipNumber(): void {
    if (
      this.curLoc$.ucod === /* "+" */ 0x2B ||
      this.curLoc$.ucod === /* "-" */ 0x2D
    ) {
      this.curLoc$.forw();
    }
    let reachBdry: boolean;
    if (isDecimalDigit(this.curLoc$.ucod)) {
      reachBdry = this.frstNonToBdry$(isDecimalDigit, 1);
      if (!reachBdry && this.#strtNum()) {
        reachBdry = this.frstNonToBdry$(isDecimalDigit, 2);
      }
    } else {
      /* MUST be ".1", because `#strtNumber()` */
      reachBdry = this.frstNonToBdry$(isDecimalDigit, 2);
    }
    if (
      !reachBdry &&
      (this.curLoc$.ucod === /* "E" */ 0x45 ||
        this.curLoc$.ucod === /* "e" */ 0x65)
    ) {
      using loc_u = this.curLoc$.usingDup().forw();
      if (loc_u.ucod === /* "+" */ 0x2B || loc_u.ucod === /* "-" */ 0x2D) {
        loc_u.forw();
      }
      if (!this.reachLexBdry$(loc_u) && isDecimalDigit(loc_u.ucod)) {
        this.curLoc$.become_Loc(loc_u);
        reachBdry = this.frstNonToBdry$(isDecimalDigit, 1);
      }
    }
  }
  /**
   * Ref. [4.3.3. Consume a numeric token](https://www.w3.org/TR/css-syntax-3/#consume-numeric-token)\
   * `in( this.#strtNumber())`
   */
  @out((self: CSSLexr) => {
    const tkVal = self.outTk$?.value;
    assert(
      tkVal === CSSTok.number || tkVal === CSSTok.percentage ||
        tkVal === CSSTok.dimension,
    );
  })
  #scanNumeric(): void {
    /*#static*/ if (INOUT) {
      assert(this.outTk$?.sntStrtLoc.posE(this.curLoc$));
    }
    this.#skipNumber();
    if (this.#strtIdent()) {
      this.#skipIdent();
      this.outTk$!.setStop(this.curLoc$, CSSTok.dimension);
    } else if (this.curLoc$.ucod === /* "%" */ 0x25) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.percentage);
    } else {
      this.outTk$!.setStop(this.curLoc$, CSSTok.number);
    }
  }

  /**
   * Ref. [Consume a token](https://www.w3.org/TR/css-syntax-3/#consume-token)\
   * `CSSTk`s are concatenated from one end to the other, i.e., no gaps.
   * @implement
   */
  protected scan_impl$(): CSSTk | undefined {
    this.outTk_1$;
    const ucod = this.curLoc$.ucod;
    // if (isSurLead(ucod) || isSurTral(ucod) || ucod === 0) {
    //   ucod = 0xFFFD as UInt16;
    // }
    if (
      ucod === /* "/" */ 0x2F && this.curLoc$.peek_ucod(1) === /* "*" */ 0x2A
    ) {
      this.curLoc$.forw();
      if (this.reachLexBdry$()) {
        this.outTk$!.setStop(this.curLoc$, CSSTok.delim);
      } else {
        this.curLoc$.forw();
        this.#scanComment();
      }
    } else if (isASCIIWs(ucod)) {
      this.skipASCIIWs$();
      this.outTk$!.setStop(this.curLoc$, CSSTok.whitespace);
    } else if (ucod === /* '"' */ 0x22) {
      this.#scanString();
    } else if (ucod === /* "#" */ 0x23) {
      this.curLoc$.forw();
      if (
        !this.reachLexBdry$() &&
        (isIdent(this.curLoc$.ucod) || this.#strtEscape())
      ) {
        this.#skipIdent();
        this.outTk$!.setStop(this.curLoc$, CSSTok.hash);
      } else {
        this.outTk$!.setStop(this.curLoc$, CSSTok.delim);
      }
    } else if (ucod === /* "'" */ 0x27) {
      this.#scanString();
    } else if (ucod === /* "(" */ 0x28) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.paren_open);
    } else if (ucod === /* ")" */ 0x29) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.paren_cloz);
    } else if (ucod === /* "+" */ 0x2B) {
      if (this.#strtNumber()) {
        this.#scanNumeric();
      } else {
        this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.delim);
      }
    } else if (ucod === /* "," */ 0x2C) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.comma);
    } else if (ucod === /* "-" */ 0x2D) {
      if (this.#strtNumber()) {
        this.#scanNumeric();
      } else if (
        !this.reachLexBdry$(undefined, 2) &&
        this.curLoc$.peek_ucod(1) === /* "-" */ 0x2D &&
        this.curLoc$.peek_ucod(2) === /* ">" */ 0x3E
      ) {
        this.outTk$!.setStop(this.curLoc$.forwn(3), CSSTok.CDC);
      } else if (this.#strtIdent()) {
        this.#scanIdenLike();
      } else {
        this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.delim);
      }
    } else if (ucod === /* "." */ 0x2E) {
      if (this.#strtNumber()) {
        this.#scanNumeric();
      } else {
        this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.delim);
      }
    } else if (ucod === /* ":" */ 0x3A) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.colon);
    } else if (ucod === /* ";" */ 0x3B) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.semicolon);
    } else if (ucod === /* "<" */ 0x3C) {
      if (
        !this.reachLexBdry$(undefined, 3) &&
        this.curLoc$.peek_ucod(1) === /* "!" */ 0x21 &&
        this.curLoc$.peek_ucod(2) === /* "-" */ 0x2D &&
        this.curLoc$.peek_ucod(3) === /* "-" */ 0x2D
      ) {
        this.outTk$!.setStop(this.curLoc$.forwn(4), CSSTok.CDO);
      } else {
        this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.delim);
      }
    } else if (ucod === /* "@" */ 0x40) {
      this.curLoc$.forw();
      if (!this.reachLexBdry$() && this.#strtIdent()) {
        this.#skipIdent();
        this.outTk$!.setStop(this.curLoc$, CSSTok.at_keyword);
      } else {
        this.outTk$!.setStop(this.curLoc$, CSSTok.delim);
      }
    } else if (ucod === /* "[" */ 0x5B) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.squar_open);
    } else if (ucod === /* "\\" */ 0x5C) {
      if (this.#strtEscape()) {
        this.#scanIdenLike();
      } else {
        this.outTk$!.setErr({ msg: ErrMsg.css_inval_esc })
          .setStop(this.curLoc$.forw(), CSSTok.delim);
      }
    } else if (ucod === /* "]" */ 0x5D) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.squar_cloz);
    } else if (ucod === /* "{" */ 0x7B) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.curly_open);
    } else if (ucod === /* "}" */ 0x7D) {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.curly_cloz);
    } else if (isDecimalDigit(ucod)) {
      this.#scanNumeric();
    } else if (isIdentStrt(ucod)) {
      this.#scanIdenLike();
    } else {
      this.outTk$!.setStop(this.curLoc$.forw(), CSSTok.delim);
    }
    return this.outTk$;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  protected override canConcat$(tk_0_x: CSSTk, tk_1_x: CSSTk) {
    return (
      tk_0_x.value === CSSTok.whitespace &&
        tk_1_x.value === CSSTok.whitespace ||
      tk_0_x.value === CSSTok.ident && tk_1_x.value === CSSTok.ident
    );
  }
}
/*80--------------------------------------------------------------------------*/
