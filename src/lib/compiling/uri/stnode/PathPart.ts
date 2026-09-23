/** 80**************************************************************************
 * @module lib/compiling/uri/stnode/PathPart
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { URITk } from "../../Token.ts";
import { ErrMsg } from "../../util.ts";
import type { Authority } from "./Authority.ts";
import { URISn } from "./URISn.ts";
/*80--------------------------------------------------------------------------*/

export enum PathKind {
  err = 1,
  abs,
  rel,
  any,
}

type PathPartCtorP_ = {
  authority: Authority | undefined;
  pathAbempty: URITk | undefined;
  pathAbsolute: URITk | undefined;
  pathNoscheme: URITk | undefined;
  pathRootless: URITk | undefined;
};

/** @final */
export class PathPart extends URISn {
  #authority;
  #pathAbempty;
  #pathAbsolute;
  #pathNoscheme;
  #pathRootless;

  get isEmail_1(): boolean {
    if (
      !(!!this.#pathNoscheme &&
        !this.#authority && !this.#pathAbempty &&
        !this.#pathAbsolute && !this.#pathRootless)
    ) return false;

    const s_a = this.#pathNoscheme.getText().split("@");
    return s_a.length === 2 && !!s_a[0] && !!s_a[1];
  }

  get kind(): PathKind {
    return this.isErr
      ? PathKind.err
      : this.#pathRootless
      ? PathKind.abs
      : this.#pathNoscheme
      ? PathKind.rel
      : PathKind.any;
  }

  override get children(): [Authority] | undefined {
    return this.#authority ? [this.#authority] : undefined;
  }

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   let ret = this.#authority?.known ??
  //     (this.#pathAbsolute
  //       ? this.#pathAbsolute.value !== BaseTok.unknown
  //       : this.#pathNoscheme
  //       ? this.#pathNoscheme.value !== BaseTok.unknown
  //       : this.#pathRootless
  //       ? this.#pathRootless.value !== BaseTok.unknown
  //       : this.#pathAbempty!.value !== BaseTok.unknown);
  //   if (!ret) return ret;

  //   ret = this.#pathAbempty
  //     ? this.#pathAbempty!.value !== BaseTok.unknown
  //     : this.#pathAbsolute
  //     ? this.#pathAbsolute.value !== BaseTok.unknown
  //     : this.#pathNoscheme
  //     ? this.#pathNoscheme.value !== BaseTok.unknown
  //     : this.#pathRootless
  //     ? this.#pathRootless.value !== BaseTok.unknown
  //     : this.#authority!.known;
  //   return ret;
  // }

  override get frstToken_1(): URITk {
    return this.frstTk$ ??= this.#authority?.frstToken_1 ??
      this.#pathAbsolute ?? this.#pathNoscheme ??
      this.#pathRootless ?? this.#pathAbempty!;
  }
  override get lastToken_1(): URITk {
    return this.lastTk$ ??= this.#pathAbempty ??
      this.#pathAbsolute ?? this.#pathNoscheme ??
      this.#pathRootless ?? this.#authority!.lastToken_1;
  }

  constructor(
    { authority, pathAbempty, pathAbsolute, pathNoscheme, pathRootless }:
      PathPartCtorP_,
  ) {
    /*#static*/ if (INOUT) {
      assert(
        authority ||
          pathAbempty || pathAbsolute || pathNoscheme || pathRootless,
      );
    }
    super();
    this.#authority = authority;
    this.#pathAbempty = pathAbempty;
    this.#pathAbsolute = pathAbsolute;
    this.#pathNoscheme = pathNoscheme;
    this.#pathRootless = pathRootless;

    if (authority) authority.attachTo_$(this);

    let n_ = 0;
    if (authority) n_ += 1;
    if (pathAbsolute) n_ += 1;
    if (pathNoscheme) n_ += 1;
    if (pathRootless) n_ += 1;
    if (n_ > 1) this.setErr({ msg: ErrMsg.uri_pathpart_conflict });
    else if (n_ < 1) this.setErr({ msg: ErrMsg.uri_no_authority });

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override get _info_(): string {
    return `${super._info_},${PathKind[this.kind]}`;
  }

  override toString() {
    const snt_a: (URITk | URISn)[] = [];
    if (this.#authority) {
      snt_a.push(this.#authority);
      if (this.#pathAbempty) snt_a.push(this.#pathAbempty);
    } else if (this.#pathAbsolute) snt_a.push(this.#pathAbsolute);
    else if (this.#pathNoscheme) snt_a.push(this.#pathNoscheme);
    else if (this.#pathRootless) snt_a.push(this.#pathRootless);
    return `${this._info_} ( ${snt_a.join(" ")})`;
  }
}
/*80--------------------------------------------------------------------------*/
