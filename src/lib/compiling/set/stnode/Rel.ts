/** 80**************************************************************************
 * @module lib/compiling/set/stnode/Rel
 * @license MIT
 ******************************************************************************/

import type { ERanr } from "@fe-edt/ERan.ts";
import { lnum_t } from "@fe-lib/alias.ts";
import type { Cssc } from "@fe-lib/color/alias.ts";
import { Pale } from "@fe-lib/color/Pale.ts";
import { $CSS } from "@fe-lib/symbols.ts";
import { assert } from "@fe-lib/util.ts";
import { DENO, INOUT } from "@fe-src/preNs.ts";
import { Tdt, Tuof } from "../../alias.ts";
import { Ranval } from "../../Ranval.ts";
import type { SetTk } from "../../Token.ts";
import { Token } from "../../Token.ts";
import { ErrMsg, paleMock, sntFrstTk, sntLastTk } from "../../util.ts";
import type { SetPazr } from "../SetPazr.ts";
import { SetTok } from "../SetTok.ts";
import { Ids } from "./Ids.ts";
import { Key } from "./Key.ts";
import { SetSn } from "./SetSn.ts";
/*80--------------------------------------------------------------------------*/

type RelCtorP_ = {
  pazr: SetPazr;
  src: Key | Ids | SetTk | undefined;
  jnr_1: SetTk;
  rel?: Key | Ids | SetTk | undefined;
  jnr_2?: SetTk | undefined;
  tgt?: Key | Ids | SetTk;
};

/** @final */
export class Rel extends SetSn {
  /* Pale */
  #stxFg_p = /*#static*/ DENO ? paleMock : Pale.get("cpl.set.Rel.stxFg");
  #onStxFgCssc = (_x: Cssc) => {
    /*#static*/ if (!DENO) {
      document.body.style.setProperty(this.#stxFg_pn, _x);
    }
  };

  #tkErrTd_p = /*#static*/ DENO ? paleMock : Pale.get("cpl.set.errTd");
  #onTkErrTdCssc = (_x: Cssc) => {
    /*#static*/ if (!DENO) {
      document.body.style.setProperty(this.#tkErrTd_pn, _x);
    }
  };

  #snErrTd_p = /*#static*/ DENO ? paleMock : Pale.get("cpl.set.errTd");
  #onSnErrTdCssc = (_x: Cssc) => {
    /*#static*/ if (!DENO) {
      document.body.style.setProperty(this.#snErrTd_pn, _x);
    }
  };

  #cplTd_p = /*#static*/ DENO ? paleMock : Pale.get("cpl.set.cplTd");
  #onCplTdCssc = (_x: Cssc) => {
    /*#static*/ if (!DENO) {
      document.body.style.setProperty(this.#cplTd_pn, _x);
    }
  };

  observeTheme() {
    this.#stxFg_p.registCsscHandler(this.#onStxFgCssc);
    this.#tkErrTd_p.registCsscHandler(this.#onTkErrTdCssc);
    this.#snErrTd_p.registCsscHandler(this.#onSnErrTdCssc);
    this.#cplTd_p.registCsscHandler(this.#onCplTdCssc);
  }
  unobserveTheme() {
    this.#stxFg_p.removeCsscHandler(this.#onStxFgCssc);
    this.#tkErrTd_p.removeCsscHandler(this.#onTkErrTdCssc);
    this.#snErrTd_p.removeCsscHandler(this.#onSnErrTdCssc);
    this.#cplTd_p.removeCsscHandler(this.#onCplTdCssc);
  }
  /* ~ */
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** If `undefined`, must `hasErr`. */
  #src;
  get src() {
    return this.#src;
  }

  readonly jnr_1;

  /** If `undefined`, must `hasErr`. */
  #rel;
  get rel() {
    return this.#rel;
  }

  readonly jnr_2: SetTk | undefined;

  /** If `undefined`, must `hasErr`. */
  #tgt;
  get tgt() {
    return this.#tgt;
  }

  #children: (Key | Ids)[] | undefined;
  override get children(): (Key | Ids)[] {
    if (this.#children) return this.#children;

    const ret: (Key | Ids)[] = [];
    if (this.#src instanceof Key || this.#src instanceof Ids) {
      ret.push(this.#src);
    }
    if (this.#rel instanceof Key || this.#rel instanceof Ids) {
      ret.push(this.#rel);
    }
    if (this.#tgt instanceof Key || this.#tgt instanceof Ids) {
      ret.push(this.#tgt);
    }
    return this.#children = ret;
  }

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   let ret = this.#src
  //     ? sntKnown(this.#src)
  //     : this.jnr_1.value !== BaseTok.unknown;
  //   if (!ret) return ret;

  //   ret = this.#tgt
  //     ? sntKnown(this.#tgt)
  //     : this.jnr_2
  //     ? this.jnr_2.value !== BaseTok.unknown
  //     : this.#rel
  //     ? sntKnown(this.#rel)
  //     : this.jnr_1.value !== BaseTok.unknown;
  //   return ret;
  // }

  override get frstToken_1(): SetTk {
    return this.frstTk$ ??= this.#src ? sntFrstTk(this.#src) : this.jnr_1;
  }
  override get lastToken_1(): SetTk {
    return this.lastTk$ ??= this.#tgt
      ? sntLastTk(this.#tgt)
      : this.jnr_2
      ? this.jnr_2
      : this.#rel
      ? sntLastTk(this.#rel)
      : this.jnr_1;
  }

  readonly stx_hln = `${this.class_id}_stx`;
  get #stx_hl(): Highlight {
    this.hl_a$ ??= [];
    return this.hl_a$[0] ??= new Highlight();
  }
  #clr_stx_hl(): void {
    this.hl_a$?.at(0)?.clear();
  }

  readonly tkErr_hln = `${this.class_id}_tkErr`;
  get #tkErr_hl(): Highlight {
    this.hl_a$ ??= [];
    return this.hl_a$[1] ??= new Highlight();
  }
  #clr_tkErr_hl(): void {
    this.hl_a$?.at(1)?.clear();
  }

  readonly snErr_hln = `${this.class_id}_snErr`;
  get #snErr_hl(): Highlight {
    this.hl_a$ ??= [];
    return this.hl_a$[2] ??= new Highlight();
  }
  #clr_snErr_hl(): void {
    this.hl_a$?.at(2)?.clear();
  }

  readonly cpl_hln = `${this.class_id}_cpl`;
  get #cpl_hl(): Highlight {
    this.hl_a$ ??= [];
    return this.hl_a$[3] ??= new Highlight();
  }
  #clr_cpl_hl(): void {
    this.hl_a$?.at(3)?.clear();
  }

  readonly #stxFg_pn = `--${this.class_id}-stxFg`;
  readonly #tkErrTd_pn = `--${this.class_id}-tkErrTd`;
  readonly #snErrTd_pn = `--${this.class_id}-snErrTd`;
  readonly #cplTd_pn = `--${this.class_id}-cplTd`;
  readonly #cplTuo_pn = `--${this.class_id}-cplTuo`;

  private constructor(_x: RelCtorP_) {
    super(_x.pazr);
    const s_ = this.#src = _x.src;
    this.jnr_1 = _x.jnr_1;
    const r_ = this.#rel = _x.rel;
    this.jnr_2 = _x.jnr_2;
    const t_ = this.#tgt = _x.tgt;

    if (s_ instanceof Key || s_ instanceof Ids) {
      s_.attachTo_$(this);
    } else if (
      s_ && s_.value !== SetTok.asterisk && s_.value !== SetTok.question
    ) {
      this.setErr({
        msg: ErrMsg.set_rel_unexp_tk,
        rv: Ranval.fromRan(s_.ran_$),
        txt: s_.name,
      });
    }
    if (r_ instanceof Key || r_ instanceof Ids) {
      r_.attachTo_$(this);
    } else if (
      r_ && r_.value !== SetTok.asterisk && r_.value !== SetTok.question
    ) {
      this.setErr({
        msg: ErrMsg.set_rel_unexp_tk,
        rv: Ranval.fromRan(r_.ran_$),
        txt: r_.name,
      });
    }
    if (!this.jnr_2) this.setErr({ msg: ErrMsg.set_rel_no_2nd });
    if (t_ instanceof Key || t_ instanceof Ids) {
      t_.attachTo_$(this);
    } else if (
      t_ && t_.value !== SetTok.asterisk && t_.value !== SetTok.question
    ) {
      this.setErr({
        msg: ErrMsg.set_rel_unexp_tk,
        rv: Ranval.fromRan(t_.ran_$),
        txt: t_.name,
      });
    }
    if (!s_ || !r_ || !t_) this.setErr({ msg: ErrMsg.set_rel_no_srt });

    /*#static*/ if (!DENO) {
      CSS.highlights.set(this.stx_hln, this.#stx_hl);
      CSS.highlights.set(this.tkErr_hln, this.#tkErr_hl);
      CSS.highlights.set(this.snErr_hln, this.#snErr_hl);
      CSS.highlights.set(this.cpl_hln, this.#cpl_hl);

      document.body.style.setProperty(this.#stxFg_pn, this.#stxFg_p.cssc);
      document.body.style.setProperty(this.#tkErrTd_pn, this.#tkErrTd_p.cssc);
      document.body.style.setProperty(this.#snErrTd_pn, this.#snErrTd_p.cssc);
      document.body.style.setProperty(this.#cplTd_pn, this.#cplTd_p.cssc);

      document[$CSS].insertRule(
        `::highlight(${this.stx_hln}) {
          color: var(${this.#stxFg_pn});
        }`,
      );
      document[$CSS].insertRule(
        `::highlight(${this.tkErr_hln}) {
          text-decoration: var(${this.#tkErrTd_pn}) wavy underline;
          text-underline-offset: .2em;
        }`,
      );
      document[$CSS].insertRule(
        `::highlight(${this.snErr_hln}) {
          text-decoration: var(${this.#snErrTd_pn}) wavy underline;
          text-underline-offset: .2em;
        }`,
      );
      document[$CSS].insertRule(
        `::highlight(${this.cpl_hln}) {
          text-decoration: var(${this.#cplTd_pn}) underline ${Tdt}em;
          text-underline-offset: var(${this.#cplTuo_pn});
        }`,
      );
    }

    this.ensureBdries();
  }
  /** @headconst @param _x */
  static create(_x: RelCtorP_) {
    const ret = new Rel(_x);
    ret.observeTheme();
    return ret;
  }

  override destructor(): void {
    this.unobserveTheme();

    /*#static*/ if (!DENO) {
      const css_ = document[$CSS];
      css_.deleteSelector(`::highlight(${this.stx_hln})`);
      css_.deleteSelector(`::highlight(${this.tkErr_hln})`);
      css_.deleteSelector(`::highlight(${this.snErr_hln})`);
      css_.deleteSelector(`::highlight(${this.cpl_hln})`);

      document.body.style.removeProperty(this.#stxFg_pn);
      document.body.style.removeProperty(this.#tkErrTd_pn);
      document.body.style.removeProperty(this.#snErrTd_pn);
      document.body.style.removeProperty(this.#cplTd_pn);
      document.body.style.removeProperty(this.#cplTuo_pn);

      CSS.highlights.delete(this.stx_hln);
      CSS.highlights.delete(this.tkErr_hln);
      CSS.highlights.delete(this.snErr_hln);
      CSS.highlights.delete(this.cpl_hln);
    }

    super.destructor();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override replaceChild(oldSn_x: Key | Ids, newSn_x: Key | Ids) {
    newSn_x.attachTo_$(this);

    if (this.#src === oldSn_x) {
      this.#src = newSn_x;
    } else if (this.#rel === oldSn_x) {
      this.#rel = newSn_x;
    } else {
      /*#static*/ if (INOUT) {
        assert(this.#tgt === oldSn_x);
      }
      this.#tgt = newSn_x;
    }
    this.#children = undefined;

    this.invalBdries();
  }
  /*49|||||||||||||||||||||||||||||||||||||||||||*/

  protected override clrHighlight_impl$(): false {
    this.jnr_1.revERan();
    this.jnr_2?.revERan();
    if (this.#src instanceof Token) this.#src.revERan();
    if (this.#rel instanceof Token) this.#rel.revERan();
    if (this.#tgt instanceof Token) this.#tgt.revERan();
    this.revERan();

    this.#clr_stx_hl();
    this.#clr_tkErr_hl();
    this.#clr_snErr_hl();
    this.#clr_cpl_hl();
    return false;
  }

  protected override setHighlight_impl$(
    eranr_x: ERanr,
    frstLidx_x: lnum_t,
    lastLidx_x: lnum_t,
  ): boolean {
    if (this.sntLastLidx_1 < frstLidx_x || lastLidx_x < this.sntFrstLidx_1) {
      return this.clrHighlight_impl$();
    }

    this.#clr_stx_hl();
    this.#clr_tkErr_hl();
    this.#clr_snErr_hl();
    this.#clr_cpl_hl();
    let highlighted = false, hld;

    hld = this.jnr_1.setHl_$(this.#stx_hl, eranr_x, frstLidx_x, lastLidx_x);
    highlighted ||= hld;
    hld = this.jnr_2?.setHl_$(this.#stx_hl, eranr_x, frstLidx_x, lastLidx_x);
    highlighted ||= !!hld;

    if (
      this.#src instanceof Token &&
      this.#src.value !== SetTok.asterisk &&
      this.#src.value !== SetTok.question
    ) {
      hld = this.#src.setHl_$(this.#tkErr_hl, eranr_x, frstLidx_x, lastLidx_x);
      highlighted ||= hld;
    }
    if (
      this.#rel instanceof Token &&
      this.#rel.value !== SetTok.asterisk &&
      this.#rel.value !== SetTok.question
    ) {
      hld = this.#rel.setHl_$(this.#tkErr_hl, eranr_x, frstLidx_x, lastLidx_x);
      highlighted ||= hld;
    }
    if (
      this.#tgt instanceof Token &&
      this.#tgt.value !== SetTok.asterisk &&
      this.#tgt.value !== SetTok.question
    ) {
      hld = this.#tgt.setHl_$(this.#tkErr_hl, eranr_x, frstLidx_x, lastLidx_x);
      highlighted ||= hld;
    }

    if (
      this.hasErrMsg(ErrMsg.set_rel_no_srt) ||
      this.hasErrMsg(ErrMsg.set_rel_no_2nd)
    ) {
      hld = this.setHl_$(this.#snErr_hl, eranr_x, frstLidx_x, lastLidx_x);
      highlighted ||= hld;
    }

    hld = this.setHl_$(this.#cpl_hl, eranr_x, frstLidx_x, lastLidx_x);
    if (hld) {
      document.body.style.setProperty(
        this.#cplTuo_pn,
        `-${Math.max(1 + Tuof - this.depth_1 * Tuof, 0)}em`,
      );
    }
    highlighted ||= hld;

    return highlighted;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override toString() {
    return `${this._info_} ( ${this.#src} > ${this.#rel} > ${this.#tgt})`;
  }

  override _repr_(): [string, any] {
    return [this._info_, {
      src: this.#src
        ? this.#src instanceof Token ? this.#src.toString() : this.#src._repr_()
        : this.#src,
      jnr_1: this.jnr_1.toString(),
      rel: this.#rel
        ? this.#rel instanceof Token ? this.#rel.toString() : this.#rel._repr_()
        : this.#rel,
      jnr_2: this.jnr_2 ? this.jnr_2.toString() : this.jnr_2,
      tgt: this.#tgt
        ? this.#tgt instanceof Token ? this.#tgt.toString() : this.#tgt._repr_()
        : this.#tgt,
    }];
  }
}
/*80--------------------------------------------------------------------------*/
