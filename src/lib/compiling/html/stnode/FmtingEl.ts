/** 80**************************************************************************
 * @module lib/compiling/html/stnode/FmtingEl
 * @license MIT
 ******************************************************************************/

import { assert, fail, warn } from "@fe-lib/util.ts";
import { DEBUG, INOUT } from "@fe-src/preNs.ts";
import type { Insmod } from "../alias.ts";
import { ContCat, NestCat } from "../alias.ts";
import type { HTMLTk } from "../HTMLTk.ts";
import type { Tag_LI } from "../util.ts";
import { CtnrEl } from "./CtnrEl.ts";
/*80--------------------------------------------------------------------------*/

export class FmtingEl extends CtnrEl {
  //jjjj TOCLEANUP
  // proto?: FmtingEl | undefined;
  clone?: FmtingEl | undefined;

  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param tk_x
   */
  protected constructor(insmod_x: Insmod, tagname_x: string, tk_x: HTMLTk) {
    super(insmod_x, tagname_x, tk_x);
    this.nestCat$ = NestCat.formatting;
  }
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  static mock(insmod_x: Insmod, tk_x: HTMLTk) {
    warn("Should not run here!");
    return new FmtingEl(insmod_x, "", tk_x);
  }
  /**
   * @const @param insmod_x
   * @const @param _x
   * @const @param phTk_x
   */
  static create(
    insmod_x: Insmod,
    _x: HTMLTk | FmtingEl,
    phTk_x?: HTMLTk,
  ): FmtingEl {
    let tk_ = _x instanceof FmtingEl ? undefined : _x;
    /*#static*/ if (INOUT) {
      assert(!tk_ || tk_.isOpntag);
    }
    let tn_: string;
    if (tk_) {
      tn_ = (tk_.lexdInfo as Tag_LI).tagname_s;
    } else {
      tn_ = (_x as FmtingEl).tagname;
      tk_ = phTk_x!;
    }

    let ret: FmtingEl | undefined;
    /* deno-fmt-ignore */ switch (tn_) {
      case "a": ret = new A_El(insmod_x,tk_); break;
      case "b": ret = new B_El(insmod_x,tk_); break;
      case "code": ret = new Code_El(insmod_x,tk_); break;
      case "em": ret = new Em_El(insmod_x,tk_); break;
      case "i": ret = new I_El(insmod_x,tk_); break;
      case "s": ret = new S_El(insmod_x,tk_); break;
      case "small": ret = new Small_El(insmod_x,tk_); break;
      case "strong": ret = new Strong_El(insmod_x,tk_); break;
      case "u": ret = new U_El(insmod_x,tk_); break;
    }
    if (ret) {
      if (_x instanceof FmtingEl) {
        ret.attrs_$ = _x.attrs_$; //!
        //jjjj TOCLEANUP
        // ret.proto = _x;
        _x.clone = ret;
      }
      return ret;
    }
    return /*#static*/ DEBUG
      ? fail("Should not run here!")
      : FmtingEl.mock(insmod_x, tk_);
  }
}
/*64----------------------------------------------------------*/

/** @final */
export class A_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "a", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.interactive | ContCat.palpable;
  }
}

/** @final */
export class B_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "b", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class Code_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "code", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class I_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "i", tk_x);
    this.contCat$ = ContCat.phrasing;
  }
}

/** @final */
export class Em_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "em", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class S_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "s", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class Small_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "small", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class Strong_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "strong", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class U_El extends FmtingEl {
  /**
   * @const @param insmod_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tk_x: HTMLTk) {
    super(insmod_x, "u", tk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}
/*80--------------------------------------------------------------------------*/
