/** 80**************************************************************************
 * @module lib/compiling/css/CSSPazr
 * @license MIT
 ******************************************************************************/

import { assert, out } from "@fe-lib/util.ts";
import { trace, traceOut } from "@fe-lib/util/trace.ts";
import { _TRACE, INOUT } from "@fe-src/preNs.ts";
import { Pazr } from "../Pazr.ts";
import type { CSSTk } from "../Token.ts";
import type { CVSnt, Dact, Daqct, RCSnt } from "./alias.ts";
import { Prod } from "./alias.ts";
import { CSSLexr } from "./CSSLexr.ts";
import { CSSTok } from "./CSSTok.ts";
import { Atrule } from "./stnode/Atrule.ts";
import { Declaration } from "./stnode/Declaration.ts";
import { DeclarationList } from "./stnode/DeclarationList.ts";
import { FunctionBlock } from "./stnode/FunctionBlock.ts";
import { Qurule } from "./stnode/Qurule.ts";
import { RuleList } from "./stnode/RuleList.ts";
import { SimpleBlock } from "./stnode/SimpleBlock.ts";
import { StyleBlock } from "./stnode/StyleBlock.ts";
import { StyleSheet } from "./stnode/StyleSheet.ts";
import { clozTokOf } from "./util.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class CSSPazr extends Pazr<CSSTok> {
  #prod;

  /**
   * @headconst @param lexr_x
   * @const @param prod_x
   */
  constructor(lexr_x: CSSLexr, prod_x = Prod.rule_list) {
    super(lexr_x);
    this.#prod = prod_x;
  }

  /** @const @param prod_x */
  reset_CSSPazr(prod_x: Prod): this {
    this.reset_Pazr$();
    this.#prod = prod_x;
    return this;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /**
   * [5.4.2. Consume an at-rule](https://www.w3.org/TR/css-syntax-3/#consume-at-rule)\
   * `in( this.curPazTk$.value === CSSTok.at_keyword)`
   */
  #pazAtrule_impl(): Atrule {
    const frstTk = this.curPazTk$;
    this.forceForw$();
    let lastTk: CSSTk | undefined;
    if (this.reachPazBdry$()) {
      if (this.curPazTk$.value === CSSTok.semicolon) {
        lastTk = this.curPazTk$;
        this.forceForw$();
      } else if (this.curPazTk$.value === CSSTok.curly_open) {
        lastTk = this.#pazSimpleBlock().lastToken_1;
      }
      return new Atrule(frstTk, lastTk);
    }

    const cv_a: CVSnt[] = [];
    const VALVE = 100;
    let valve = VALVE;
    do {
      cv_a.push(this.#pazCV());
    } while (
      !this.reachPazBdry$() &&
      this.curPazTk$.value !== CSSTok.semicolon &&
      this.curPazTk$.value !== CSSTok.curly_open &&
      --valve
    );
    assert(valve, `Loop ${VALVE}(±1) times!`);
    if (!this.reachPazBdry$()) {
      if (this.curPazTk$.value === CSSTok.semicolon) {
        lastTk = this.curPazTk$;
        this.forceForw$();
      } else if (this.curPazTk$.value === CSSTok.curly_open) {
        lastTk = this.#pazSimpleBlock().lastToken_1;
      }
    }
    return new Atrule(frstTk, lastTk, cv_a);
  }
  @traceOut(_TRACE)
  #pazAtrule(): Atrule {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazAtrule() >>>>>>>`,
      );
    }
    const retSn = this.#pazAtrule_impl();
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  #pazSimpleBlock_impl(): SimpleBlock {
    const frstTk = this.curPazTk$;
    /*#static*/ if (INOUT) {
      assert(
        frstTk.value === CSSTok.curly_open ||
          frstTk.value === CSSTok.paren_open ||
          frstTk.value === CSSTok.squar_open,
      );
    }
    this.forceForw$();
    if (this.reachPazBdry$()) {
      return new SimpleBlock(frstTk);
    }

    const clozTok = clozTokOf(frstTk);
    let lastTk: CSSTk | undefined;
    if (!this.reachPazBdry$() && this.curPazTk$.value === clozTok) {
      lastTk = this.curPazTk$;
      this.forceForw$();
      return new SimpleBlock(frstTk, lastTk);
    }

    const cv_a: CVSnt[] = [];
    const VALVE = 10_000;
    let valve = VALVE;
    do {
      cv_a.push(this.#pazCV());
    } while (
      !this.reachPazBdry$() && this.curPazTk$.value !== clozTok && --valve
    );
    assert(valve, `Loop ${VALVE}(±1) times!`);
    if (!this.reachPazBdry$() && this.curPazTk$.value === clozTok) {
      lastTk = this.curPazTk$;
      this.forceForw$();
    }
    return new SimpleBlock(frstTk, lastTk, cv_a);
  }
  @traceOut(_TRACE)
  #pazSimpleBlock(): SimpleBlock {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazSimpleBlock() >>>>>>>`,
      );
    }
    for (const sn of this.unrelSn_ss_$) {
      if (sn instanceof SimpleBlock && sn.frstToken_1 === this.curPazTk$) {
        this.curPazTk$ = sn.lastToken_1.nextToken_$!;
        this.unrelSn_ss_$.rmv(sn);
        this.reusdSn_ss_$.add(sn);
        return sn.detach_$().ensureAllBdries();
      }
    }

    const retSn = this.#pazSimpleBlock_impl();
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /** `in( this.curPazTk$.value === CSSTok.function)` */
  #pazFunctionBlock_impl(): FunctionBlock {
    const frstTk = this.curPazTk$;
    this.forceForw$();
    let lastTk: CSSTk | undefined;
    if (!this.reachPazBdry$() && this.curPazTk$.value === CSSTok.paren_cloz) {
      lastTk = this.curPazTk$;
      this.forceForw$();
      return new FunctionBlock(frstTk, lastTk);
    }

    const cv_a: CVSnt[] = [];
    const VALVE = 100;
    let valve = VALVE;
    do {
      cv_a.push(this.#pazCV());
    } while (
      !this.reachPazBdry$() &&
      this.curPazTk$.value !== CSSTok.paren_cloz &&
      --valve
    );
    assert(valve, `Loop ${VALVE}(±1) times!`);
    if (!this.reachPazBdry$()) {
      lastTk = this.curPazTk$;
      this.forceForw$();
    }
    return new FunctionBlock(frstTk, lastTk, cv_a);
  }
  @traceOut(_TRACE)
  #pazFunctionBlock(): FunctionBlock {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazFunctionBlock() >>>>>>>`,
      );
    }
    const retSn = this.#pazFunctionBlock_impl();
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /** @const */
  #strtDeclaration(): boolean {
    if (this.curPazTk$.value !== CSSTok.ident) return false;

    const tk_1 = this.curPazTk$.nextToken_$!;
    if (!this.reachPazBdry$(tk_1) && tk_1.value === CSSTok.colon) return true;
    if (tk_1.value !== CSSTok.whitespace) return false;

    const tk_2 = tk_1.nextToken_$;
    return !!tk_2 && !this.reachPazBdry$(tk_2) && tk_2.value === CSSTok.colon;
  }
  /** @const */
  #strtImportant(): boolean {
    if (
      this.curPazTk$.value !== CSSTok.delim ||
      this.curPazTk$.sntStrtLoc.ucod !== /* "!" */ 0x21
    ) return false;

    const tk_1 = this.curPazTk$.nextToken_$!;
    if (
      !this.reachPazBdry$(tk_1) &&
      tk_1.value === CSSTok.ident &&
      tk_1.getText().toLowerCase() === "important"
    ) return true;

    if (tk_1.value !== CSSTok.whitespace) return false;

    const tk_2 = tk_1.nextToken_$;
    return !!tk_2 && !this.reachPazBdry$(tk_2) &&
      tk_2.value === CSSTok.ident &&
      tk_2.getText().toLowerCase() === "important";
  }
  /** `in( this.#strtImportant())` */
  #skipImportant(): void {
    this.forceForw$();
    if (this.curPazTk$.value === CSSTok.whitespace) this.forceForw$();
    if (this.curPazTk$.value === CSSTok.ident) this.forceForw$();
    if (!this.reachPazBdry$() && this.curPazTk$.value === CSSTok.whitespace) {
      this.forceForw$();
    }
  }
  /** `in( this.#strtDeclaration())` */
  #pazDeclaration_impl(): Declaration {
    const frstTk = this.curPazTk$;
    this.forceForw$();
    if (this.curPazTk$.value === CSSTok.whitespace) this.forceForw$();
    this.forceForw$();
    if (this.reachPazBdry$() || this.curPazTk$.value === CSSTok.curly_cloz) {
      return new Declaration(frstTk);
    }

    let lastTk: CSSTk | undefined;
    if (!this.reachPazBdry$() && this.curPazTk$.value === CSSTok.semicolon) {
      lastTk = this.curPazTk$;
      this.forceForw$();
      return new Declaration(frstTk, lastTk);
    }

    let important = this.#strtImportant();
    if (important) {
      this.#skipImportant();
      if (!this.reachPazBdry$() && this.curPazTk$.value === CSSTok.semicolon) {
        lastTk = this.curPazTk$;
        this.forceForw$();
        return new Declaration(frstTk, lastTk, undefined, important);
      } else {
        return new Declaration(frstTk, undefined, undefined, important);
      }
    }

    const cv_a: CVSnt[] = [];
    let tkVal: CSSTok;
    const VALVE = 100;
    let valve = VALVE;
    do {
      cv_a.push(this.#pazCV());
      important = this.#strtImportant();
      tkVal = (this.curPazTk$ as CSSTk).value;
    } while (
      !this.reachPazBdry$() && !important &&
      tkVal !== CSSTok.semicolon &&
      tkVal !== CSSTok.curly_cloz &&
      --valve
    );
    assert(valve, `Loop ${VALVE}(±1) times!`);
    if (important) {
      this.#skipImportant();
      tkVal = this.curPazTk$.value;
    }
    if (!this.reachPazBdry$() && tkVal === CSSTok.semicolon) {
      lastTk = this.curPazTk$;
      this.forceForw$();
    }
    return new Declaration(frstTk, lastTk, cv_a, important);
  }
  @traceOut(_TRACE)
  #pazDeclaration(): Declaration {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazDeclaration() >>>>>>>`,
      );
    }
    const retSn = this.#pazDeclaration_impl();
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /**
   * [5.4.3. Consume a qualified rule](https://www.w3.org/TR/css-syntax-3/#consume-qualified-rule)
   */
  @traceOut(_TRACE)
  #pazQurule(): Qurule {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazQurule() >>>>>>>`,
      );
    }
    let lastTk: CSSTk | undefined;
    const cv_a: CVSnt[] = [];
    const VALVE = 100;
    let valve = VALVE;
    while (
      !this.reachPazBdry$() &&
      this.curPazTk$.value !== CSSTok.curly_open &&
      --valve
    ) {
      cv_a.push(this.#pazCV());
    }
    assert(valve, `Loop ${VALVE}(±1) times!`);
    if (!this.reachPazBdry$() && this.curPazTk$.value === CSSTok.curly_open) {
      lastTk = this.#pazSimpleBlock().lastToken_1;
    }

    const retSn = new Qurule(cv_a, lastTk);
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /**
   * [5.3.4. Parse a list of rules](https://www.w3.org/TR/css-syntax-3/#parse-list-of-rules)
   */
  @traceOut(_TRACE)
  #pazRuleList(): RuleList {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazRuleList() >>>>>>>`,
      );
    }
    const rc_a: RCSnt[] = [];
    let rc_: RCSnt;
    const VALVE = 10_000;
    let valve = VALVE;
    do {
      switch (this.curPazTk$.value) {
        case CSSTok.whitespace:
          rc_ = this.curPazTk$;
          this.forceForw$();
          break;
        case CSSTok.CDO:
        case CSSTok.CDC:
          rc_ = this.#pazQurule();
          break;
        case CSSTok.at_keyword:
          rc_ = this.#pazAtrule();
          break;
        default:
          rc_ = this.#pazQurule();
          break;
      }
      rc_a.push(rc_);
    } while (!this.reachPazBdry$ && --valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);

    const retSn = new RuleList(rc_a);
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /**
   * [5.3.3. Parse a stylesheet](https://www.w3.org/TR/css-syntax-3/#parse-stylesheet)
   */
  @traceOut(_TRACE)
  #pazStyleSheet(): StyleSheet {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazStyleSheet() >>>>>>>`,
      );
    }
    const rc_a: RCSnt[] = [];
    let rc_: RCSnt;
    const VALVE = 100_000;
    let valve = VALVE;
    do {
      switch (this.curPazTk$.value) {
        case CSSTok.whitespace:
        case CSSTok.CDO:
        case CSSTok.CDC:
          rc_ = this.curPazTk$;
          this.forceForw$();
          break;
        case CSSTok.at_keyword:
          rc_ = this.#pazAtrule();
          break;
        default:
          rc_ = this.#pazQurule();
          break;
      }
      rc_a.push(rc_);
    } while (!this.reachPazBdry$ && --valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);

    const retSn = new StyleSheet(rc_a);
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /**
   * [5.3.7. Parse a style block’s contents](https://www.w3.org/TR/css-syntax-3/#parse-style-blocks-contents)
   */
  @traceOut(_TRACE)
  #pazStyleBlock(): StyleBlock {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazStyleBlock() >>>>>>>`,
      );
    }
    const daqct_a: Daqct[] = [];
    let daqct: Daqct;
    const VALVE = 10_000;
    let valve = VALVE;
    do {
      switch (this.curPazTk$.value) {
        case CSSTok.whitespace:
        case CSSTok.semicolon:
          daqct = this.curPazTk$;
          this.forceForw$();
          break;
        case CSSTok.at_keyword:
          daqct = this.#pazAtrule();
          break;
        case CSSTok.ident:
          if (this.#strtDeclaration()) {
            daqct = this.#pazDeclaration();
            break;
          }
        /* falls through */
        case CSSTok.delim:
          if (this.curPazTk$.sntStrtLoc.ucod === /* "&" */ 0x26) {
            daqct = this.#pazQurule();
            break;
          }
        /* falls through */
        default:
          daqct = this.#pazCV();
          break;
      }
      daqct_a.push(daqct);
    } while (!this.reachPazBdry$ && --valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);

    const retSn = new StyleBlock(daqct_a);
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /**
   * [5.3.8. Parse a list of declarations](https://www.w3.org/TR/css-syntax-3/#parse-list-of-declarations)
   */
  @traceOut(_TRACE)
  #pazDeclarationList(): DeclarationList {
    /*#static*/ if (_TRACE) {
      console.log(
        `${trace.indent}>>>>>>> ${this.class_id}.#pazDeclarationList() >>>>>>>`,
      );
    }
    const dact_a: Dact[] = [];
    let dact: Dact;
    const VALVE = 10_000;
    let valve = VALVE;
    do {
      switch (this.curPazTk$.value) {
        case CSSTok.whitespace:
        case CSSTok.semicolon:
          dact = this.curPazTk$;
          this.forceForw$();
          break;
        case CSSTok.at_keyword:
          dact = this.#pazAtrule();
          break;
        case CSSTok.ident:
          if (this.#strtDeclaration()) {
            dact = this.#pazDeclaration();
            break;
          }
        /* falls through */
        default:
          dact = this.#pazCV();
          break;
      }
      dact_a.push(dact);
    } while (!this.reachPazBdry$ && --valve);
    assert(valve, `Loop ${VALVE}(±1) times!`);

    const retSn = new DeclarationList(dact_a);
    if (retSn.isErr) this.errSn_ss$.add(retSn);
    return retSn;
  }

  /**
   * Unlike `SetSn`, concrete subclasses of `CSSSn` can be determined by the
   * first one or two `CSSTk`. (cf. `SetPazr.#visitDrtSn()`)
   *
   * Set `newSn_$`
   */
  @out((self: CSSPazr) => {
    assert(self.newSn_$);
  })
  #visitDrtSn(): void {
    /*#static*/ if (INOUT) {
      assert(this.drtSn_$);
    }
    switch (this.curPazTk$.value) {
      case CSSTok.at_keyword:
        this.newSn_$ = this.#pazAtrule();
        break;
      case CSSTok.curly_open:
      case CSSTok.paren_open:
      case CSSTok.squar_open:
        this.newSn_$ = this.#pazSimpleBlock();
        break;
      case CSSTok.function:
        this.newSn_$ = this.#pazFunctionBlock();
        break;
      case CSSTok.ident:
        if (this.#strtDeclaration()) {
          this.newSn_$ = this.#pazDeclaration();
          break;
        }
      /* falls through */
      default:
        this.newSn_$ = this.#pazQurule();
        break;
    }

    /*#static*/ if (INOUT) {
      assert(this.drtSn_$ !== this.newSn_$);
    }
    this.errSn_ss$.rmv(this.drtSn_$!);
  }

  /** @implement */
  protected paz_impl$(): void {
    if (this.drtSn_$) {
      this.#visitDrtSn();
      if (!this.newSn_$!.isErr && !this.reachPazBdry$()) {
        this.unrelSn_ss_$.add(this.newSn_$!);
        this.newSn_$ = this.#pazQurule();
      }
      if (this.newSn_$!.isErr || !this.reachPazBdry$()) {
        this.enlrgBdriesTo_$(this.drtSn_$.parent!);
        this.forceForw$(); //!
        if (this.drtSn_$) {
          this.#visitDrtSn();
        } else {
          this.newSn_$ = this.#pazRuleList();
        }
      }
    } else {
      this.newSn_$ = /* final switch */ ({
        [Prod.rule_list]: () => this.#pazRuleList(),
        [Prod.stylesheet]: () => this.#pazStyleSheet(),
        [Prod.style_block]: () => this.#pazStyleBlock(),
        [Prod.declaration_list]: () => this.#pazDeclarationList(),
      }[this.#prod])();
    }
    /*#static*/ if (INOUT) {
      assert(!this.drtSn_$ || !this.drtSn_$.isRoot);
      assert(this.newSn_$);
    }
    if (this.drtSn_$) {
      this.drtSn_$.parent!.replaceChild(this.drtSn_$, this.newSn_$!);
    } else {
      this.root$ = this.newSn_$!;
    }
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  /**
   * [5.4.7. Consume a component value](https://www.w3.org/TR/css-syntax-3/#consume-component-value)
   */
  #pazCV(): CVSnt {
    let retSnt: CVSnt;
    switch (this.curPazTk$.value) {
      case CSSTok.curly_open:
      case CSSTok.paren_open:
      case CSSTok.squar_open:
        retSnt = this.#pazSimpleBlock();
        break;
      case CSSTok.function:
        retSnt = this.#pazFunctionBlock();
        break;
      //jjjj TOCLEANUP
      // case CSSTok.ident:
      //   if (this.#strtDeclaration()) {
      //     retSnt = this.#pazDeclaration();
      //     break;
      //   }
      // /* falls through */
      default:
        retSnt = this.curPazTk$;
        this.forceForw$();
        break;
    }
    return retSnt;
  }
}
/*80--------------------------------------------------------------------------*/
