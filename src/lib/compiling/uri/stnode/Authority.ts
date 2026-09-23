/** 80**************************************************************************
 * @module lib/compiling/uri/stnode/Authority
 * @license MIT
 ******************************************************************************/

import type { URITk } from "../../Token.ts";
import { URISn } from "./URISn.ts";
/*80--------------------------------------------------------------------------*/

type AuthorityCtorP_ = {
  twoslash: URITk;
  userinfo: URITk | undefined;
  host: URITk | undefined;
  port: URITk | undefined;
};

/** @final */
export class Authority extends URISn {
  #twoslash;
  #userinfo;
  #host;
  #port;

  //jjjj TOCLEANUP
  // override get known(): boolean {
  //   return this.#twoslash.value !== BaseTok.unknown &&
  //     (this.#port
  //       ? this.#port.value !== BaseTok.unknown
  //       : this.#host
  //       ? this.#host.value !== BaseTok.unknown
  //       : this.#userinfo
  //       ? this.#userinfo.value !== BaseTok.unknown
  //       : true);
  // }

  override get frstToken_1(): URITk {
    return this.frstTk$ ??= this.#twoslash;
  }
  override get lastToken_1(): URITk {
    return this.lastTk$ ??= this.#port ??
      this.#host ?? this.#userinfo ?? this.#twoslash;
  }

  constructor({ twoslash, userinfo, host, port }: AuthorityCtorP_) {
    super();
    this.#twoslash = twoslash;
    this.#userinfo = userinfo;
    this.#host = host;
    this.#port = port;

    this.ensureBdries();
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  override toString() {
    const tk_a: URITk[] = [];
    if (this.#userinfo) tk_a.push(this.#userinfo);
    if (this.#host) tk_a.push(this.#host);
    if (this.#port) tk_a.push(this.#port);
    return `${this._info_} ( //${tk_a.join(" ")})`;
  }
}
/*80--------------------------------------------------------------------------*/
