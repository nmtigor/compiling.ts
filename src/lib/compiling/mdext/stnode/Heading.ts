/** 80**************************************************************************
 * @module lib/compiling/mdext/stnode/Heading
 * @license MIT
 ******************************************************************************/

import type { lnum_t, loff_t, uint, uint8 } from "@fe-lib/alias.ts";
import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { Loc } from "../../Loc.ts";
import { MdextTk } from "../../Token.ts";
import type { SortedSnt_id } from "../../util.ts";
import type { MdextLexr } from "../MdextLexr.ts";
import { BlockCont } from "../alias.ts";
import { _toHTML_, gathrUnrelTk_$ } from "../util.ts";
import { Inline } from "./Inline.ts";
import { ILoc, InlineBlock } from "./InlineBlock.ts";
import { Paragraph } from "./Paragraph.ts";
import { ThematicBreak } from "./ThematicBreak.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
class HLoc_ extends ILoc {
  override get host() {
    return this.host$ as Heading;
  }

  //jjjj TOCLEANUP
  // /**
  //  * @headconst @param host_x
  //  */
  // constructor(host_x: Heading) {
  //   /*#static*/ if (INOUT) {
  //     assert(host_x.snt_a_$.at(0) instanceof Token);
  //   }
  //   super(host_x);
  // }
}
/*80--------------------------------------------------------------------------*/

export abstract class Heading extends InlineBlock {
  abstract get level(): uint8;

  #hloc: HLoc_ | undefined;
  /** @implement */
  get iloc(): HLoc_ {
    return this.#hloc ??= new HLoc_(this);
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  //jjjj TOCLEANUP
  // protected override inline_impl$(lexr_x: MdextLexr): void {
  //   if (this.snt_a_$.length) {
  //     const iloc = this.iloc.reset_O(this.snt_a_$[0] as MdextTk);
  //     const VALVE = 1_000;
  //     let valve = VALVE;
  //     while (lexr_x.lexInline_$(iloc) && --valve) {}
  //     assert(valve, `Loop ${VALVE}(±1) times!`);
  //     lexr_x.lexEmphasis_$(iloc);
  //   }
  // }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(lexr_x: MdextLexr): string {
    const level = this.level;
    return `<h${level}>${_toHTML_(lexr_x, this.snt_a_$)}</h${level}>`;
  }
}
/*80--------------------------------------------------------------------------*/

export const enum ATXHeadingSt {
  head = 1,
  chunk,
  tail,
  //jjjj TOCLEANUP
  // text_inline,
}

/** @final */
export class ATXHeading extends Heading {
  override continue(lexr_x: MdextLexr): BlockCont {
    return lexr_x.continueATX_$(this);
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  st;

  /* #headTk */
  readonly #headTk;
  /** @implement */
  get level() {
    return this.#headTk.length_1;
  }
  /* ~ */

  /* snt_a_$ */
  setChunk(_x: (MdextTk | Inline)[]) {
    /*#static*/ if (INOUT) {
      assert(!this.snt_a_$.length);
      assert(this.st === ATXHeadingSt.head);
    }
    this.snt_a_$.push(..._x);
    this.st = ATXHeadingSt.chunk;

    this.invalBdries();
  }
  /* ~ */

  /* #tailTk */
  #tailTk: MdextTk | undefined;
  tailStrt_$: loff_t = 0;
  tailStop_$: loff_t = 0;
  setTail(_x: MdextTk) {
    /*#static*/ if (INOUT) {
      assert(!this.#tailTk && this.st !== ATXHeadingSt.tail);
    }
    this.#tailTk = _x;
    this.st = ATXHeadingSt.tail;

    this.invalBdries();
  }
  /* ~ */

  override get frstToken_1() {
    return this.frstTk$ ??= this.#headTk;
  }
  override get lastToken_1() {
    if (this.lastTk$) return this.lastTk$;

    if (this.#tailTk) return this.lastTk$ = this.#tailTk;
    if (this.snt_a_$.length) {
      const snt = this.snt_a_$.at(-1)!;
      return this.lastTk$ = snt instanceof Inline ? snt.lastToken_1 : snt;
    }
    return this.lastTk$ = this.#headTk;
  }

  constructor(headTk_x: MdextTk) {
    super();
    this.#headTk = headTk_x;
    this.st = ATXHeadingSt.head;
  }

  override reset_Block(): this {
    super.reset_Block();
    this.#tailTk = undefined;
    return this;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  //jjjj TOCLEANUP
  // protected override closeBlock_impl$(): void {
  //   if (this.parent?.inCompiling) {
  //     this.setErr(ErrMsg.mdext_unexp_cloz);
  //     /* then will be re`lex()` */
  //   }
  // }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  override gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedSnt_id,
  ): uint {
    let ret = gathrUnrelTk_$(
      this.#headTk,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
    );

    ret += super.gathrUnrelSnt(drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);

    if (this.#tailTk) {
      ret += gathrUnrelTk_$(
        this.#tailTk,
        drtStrtLoc_x,
        drtStopLoc_x,
        unrelSnt_ss_x,
      );
    }
    return ret;
  }

  override reuseLine(lidx_x: lnum_t, snt_a_x: (MdextTk | Inline)[]) {
    snt_a_x.push(this.#headTk);
    super.reuseLine(lidx_x, snt_a_x);
    if (this.#tailTk) snt_a_x.push(this.#tailTk);
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override _toHTML_(lexr_x: MdextLexr): string {
    const level = this.level;
    return `<h${level}>${_toHTML_(lexr_x, this.snt_a_$)}</h${level}>`;
  }
}
/*80--------------------------------------------------------------------------*/

/** @final */
export class SetextHeading extends Heading {
  override continue(lexr_x: MdextLexr): BlockCont {
    return lexr_x.continueSetext_$(this);
  }

  override appendLine(_x: (MdextTk | Inline)[]): void {
    this.snt_a_$.push(..._x);

    this.invalBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /* #tailTk */
  #tailTk;
  /** @implement */
  get level() {
    return this.#tailTk.sntStrtLoc.ucod === /* "=" */ 0x3D ? 1 : 2;
  }

  setTail(_x: MdextTk) {
    /*#static*/ if (INOUT) {
      assert(this.parent?.inCompiling);
    }
    this.#tailTk = _x;

    this.invalBdries();
  }
  /* ~ */

  override get frstToken_1() {
    if (this.frstTk$) return this.frstTk$;

    /* The only case `!snt` is that `snt_a_$` is a link definitiosn. */
    const snt = this.snt_a_$.at(0);
    return this.frstTk$ = snt
      ? snt instanceof Inline ? snt.frstToken_1 : snt
      : this.#tailTk;
  }
  override get lastToken_1() {
    return this.lastTk$ ??= this.#tailTk;
  }

  constructor(para_x: Paragraph, tailTk_x: MdextTk) {
    super();
    this.snt_a_$.become_Array(para_x.snt_a_$);
    this.#tailTk = tailTk_x;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  //jjjj TOCLEANUP
  // protected override closeBlock_impl$(): void {
  //   if (this.parent?.inCompiling) {
  //     this.setErr(ErrMsg.mdext_unexp_cloz);
  //     /* then will be re`lex()` */
  //   }
  // }

  override reference(lexr_x: MdextLexr): this {
    const iloc = this.iloc;
    iloc.reset_O(this.snt_a_$[0]);

    const VALVE = 10_000;
    let valve = VALVE;
    while (
      lexr_x.lexReference_$(iloc) && iloc.forwNextLine_$() && --valve
    );
    assert(valve, `Loop ${VALVE}(±1) times!`);

    /* if this contains `Linkdef` only */
    if (iloc.reachEoh) {
      const ctnr = this.parent!;
      /* See `CtnrBlock.reference()` before change `ctnr` */
      const para = new Paragraph(this.snt_a_$);
      if (this.level === 1) {
        para.appendLine([this.#tailTk]);

        const next = ctnr.getChildAftr(this);
        ctnr.replaceChild(this, para);
        if (
          next instanceof Paragraph &&
          this.sntLastLine.nextLine === next.sntFrstLine
        ) {
          para.appendLines(next.snt_a_$ as MdextTk[]);
          next.removeSelf();
          /* No need `para.reference()` because non-handled lines are all
          _appended_ so can not be `Linkdef` */
        }
      } else {
        ctnr.replaceChild(this, para);
        ctnr.appendBlock(new ThematicBreak(this.#tailTk), para);
      }
    }
    return this;
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  override gathrUnrelSnt(
    drtStrtLoc_x: Loc,
    drtStopLoc_x: Loc,
    unrelSnt_ss_x: SortedSnt_id,
  ): uint {
    let ret = super.gathrUnrelSnt(drtStrtLoc_x, drtStopLoc_x, unrelSnt_ss_x);

    ret += gathrUnrelTk_$(
      this.#tailTk,
      drtStrtLoc_x,
      drtStopLoc_x,
      unrelSnt_ss_x,
    );
    return ret;
  }

  override lidxOf(loc_x: Loc): lnum_t | -1 {
    if (loc_x.line_$ === this.#tailTk.sntFrstLine) {
      return this.#tailTk.sntFrstLidx_1;
    }

    return super.lidxOf(loc_x);
  }

  override reuseLine(lidx_x: lnum_t, snt_a_x: (MdextTk | Inline)[]) {
    if (this.sntLastLidx_1 === lidx_x) snt_a_x.push(this.#tailTk);
    else super.reuseLine(lidx_x, snt_a_x);
  }
}
/*80--------------------------------------------------------------------------*/
