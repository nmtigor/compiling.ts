/** 80**************************************************************************
 * @module lib/compiling/uri/stnode/URI
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import type { URITk } from "../../Token.ts";
import { ErrMsg } from "../../util.ts";
import type { Fragment } from "./Fragment.ts";
import { PathKind, type PathPart } from "./PathPart.ts";
import type { Query } from "./Query.ts";
import { URISn } from "./URISn.ts";
/*80--------------------------------------------------------------------------*/

type URICtorP_ = {
  scheme: URITk | undefined;
  pathpart: PathPart | undefined;
  query: Query | undefined;
  fragment: Fragment | undefined;
};

/** @final */
export class URI extends URISn {
  #scheme;
  #pathpart;
  #query;
  #fragment;

  get hasScheme(): boolean {
    return !!this.#scheme;
  }

  get isEmail_1(): boolean {
    return !!this.#pathpart?.isEmail_1 &&
      !this.#scheme && !this.#query && !this.#fragment;
  }

  override get children(): URISn[] {
    const ret: URISn[] = [];
    if (this.#pathpart) ret.push(this.#pathpart);
    if (this.#query) ret.push(this.#query);
    if (this.#fragment) ret.push(this.#fragment);
    return ret;
  }

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   let ret =
  //     (this.#scheme
  //       ? this.#scheme.value !== BaseTok.unknown
  //       : this.#pathpart?.known) ?? this.#query?.known ?? this.#fragment!.known;
  //   if (!ret) return ret;

  //   ret = this.#fragment?.known ?? this.#query?.known ??
  //     this.#pathpart?.known ?? this.#scheme!.value !== BaseTok.unknown;
  //   return ret;
  // }

  override get frstToken_1(): URITk {
    return this.frstTk$ ??= this.#scheme ??
      this.#pathpart?.frstToken_1 ?? this.#query?.frstToken_1 ??
      this.#fragment!.frstToken_1;
  }
  override get lastToken_1(): URITk {
    return this.lastTk$ ??= this.#fragment?.lastToken_1 ??
      this.#query?.lastToken_1 ?? this.#pathpart?.lastToken_1 ?? this.#scheme!;
  }

  constructor({ scheme, pathpart, query, fragment }: URICtorP_) {
    /*#static*/ if (INOUT) {
      assert(scheme || pathpart || query || fragment);
    }
    super();
    this.#scheme = scheme;
    this.#pathpart = pathpart;
    this.#query = query;
    this.#fragment = fragment;

    if (pathpart) pathpart.attachTo_$(this);
    if (query) query.attachTo_$(this);
    if (fragment) fragment.attachTo_$(this);

    if (pathpart) {
      if (pathpart.kind === PathKind.abs && !scheme) {
        this.setErr({ msg: ErrMsg.uri_no_scheme });
      } else if (pathpart.kind === PathKind.rel && scheme) {
        this.setErr({ msg: ErrMsg.uri_unexp_scheme });
      }
    }

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override toString() {
    const snt_a: (URITk | URISn)[] = [];
    if (this.#scheme) snt_a.push(this.#scheme);
    if (this.#pathpart) snt_a.push(this.#pathpart);
    if (this.#query) snt_a.push(this.#query);
    if (this.#fragment) snt_a.push(this.#fragment);
    return `${this._info_} ( ${snt_a.join(" ")})`;
  }
}
/*80--------------------------------------------------------------------------*/
