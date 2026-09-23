/** 80**************************************************************************
 * @module lib/compiling/uri/URIPazr
 * @license MIT
 ******************************************************************************/

import { assert } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import { Factory } from "../../util/Factory.ts";
import { Pazr } from "../Pazr.ts";
import { URITk } from "../Token.ts";
import type { URILexr } from "./URILexr.ts";
import { URITok } from "./URITok.ts";
import { Authority } from "./stnode/Authority.ts";
import { Fragment } from "./stnode/Fragment.ts";
import { PathPart } from "./stnode/PathPart.ts";
import { Query } from "./stnode/Query.ts";
import { URI } from "./stnode/URI.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class URIPazr extends Pazr<URITok> {
  /** @implement */
  protected paz_impl$(): void {
    this.newSn_$ = this.#pazURI();
    if (this.newSn_$?.isErr) this.errSn_ss$.add(this.newSn_$);
    this.root$ = this.newSn_$;
  }

  #pazURI(): URI | undefined {
    let scheme: URITk | undefined,
      pathpart: PathPart | undefined,
      query: Query | undefined,
      fragment: Fragment | undefined;
    if (this.curPazTk$.value === URITok.scheme) {
      scheme = this.curPazTk$;
      this.forceForw$();
    }
    switch (this.curPazTk$.value) {
      case URITok.twoslash:
      case URITok.path_abempty:
      case URITok.path_absolute:
      case URITok.path_noscheme:
      case URITok.path_rootless:
        pathpart = this.#pazPathPart();
        if (pathpart.isErr) this.errSn_ss$.add(pathpart);
        break;
    }
    if (this.curPazTk$.value === URITok.query) {
      query = this.#pazQuery();
      if (query.isErr) this.errSn_ss$.add(query);
    }
    if (this.curPazTk$.value === URITok.fragment) {
      fragment = this.#pazFragment();
      if (fragment.isErr) this.errSn_ss$.add(fragment);
    }
    return scheme || pathpart || query || fragment
      ? new URI({ scheme, pathpart, query, fragment })
      : undefined;
  }

  #pazPathPart(): PathPart {
    const frstTk = this.curPazTk$;
    /*#static*/ if (INOUT) {
      assert(
        frstTk.value === URITok.twoslash ||
          frstTk.value === URITok.path_abempty ||
          frstTk.value === URITok.path_absolute ||
          frstTk.value === URITok.path_noscheme ||
          frstTk.value === URITok.path_rootless,
      );
    }
    let authority: Authority | undefined,
      pathAbempty: URITk | undefined,
      pathAbsolute: URITk | undefined,
      pathNoscheme: URITk | undefined,
      pathRootless: URITk | undefined;
    switch (this.curPazTk$.value) {
      case URITok.twoslash:
        authority = this.#pazAuthority();
        if (authority.isErr) this.errSn_ss$.add(authority);
        if (this.curPazTk$.value === URITok.path_abempty as any) {
          pathAbempty = this.curPazTk$;
          this.forceForw$();
        }
        break;
      case URITok.path_abempty:
        pathAbempty = this.curPazTk$;
        this.forceForw$();
        break;
      case URITok.path_absolute:
        pathAbsolute = this.curPazTk$;
        this.forceForw$();
        break;
      case URITok.path_noscheme:
        pathNoscheme = this.curPazTk$;
        this.forceForw$();
        break;
      case URITok.path_rootless:
        pathRootless = this.curPazTk$;
        this.forceForw$();
        break;
    }
    return new PathPart({
      authority,
      pathAbempty,
      pathAbsolute,
      pathNoscheme,
      pathRootless,
    });
  }

  #pazAuthority(): Authority {
    const twoslash = this.curPazTk$;
    /*#static*/ if (INOUT) {
      assert(twoslash.value === URITok.twoslash);
    }
    this.forceForw$();

    let userinfo: URITk | undefined,
      host: URITk | undefined,
      port: URITk | undefined;
    if (this.curPazTk$.value === URITok.userinfo) {
      userinfo = this.curPazTk$;
      this.forceForw$();
    }
    switch (this.curPazTk$.value) {
      case URITok.regname:
      case URITok.IPv4:
      case URITok.IPv6:
      case URITok.IPv7:
        host = this.curPazTk$;
        this.forceForw$();
        break;
    }
    if (this.curPazTk$.value === URITok.port) {
      port = this.curPazTk$;
      this.forceForw$();
    }
    return new Authority({ twoslash, userinfo, host, port });
  }

  #pazQuery(): Query {
    const tk_ = this.curPazTk$;
    /*#static*/ if (INOUT) {
      assert(tk_.value === URITok.query);
    }
    this.forceForw$();
    return new Query(tk_);
  }

  #pazFragment(): Fragment {
    const tk_ = this.curPazTk$;
    /*#static*/ if (INOUT) {
      assert(tk_.value === URITok.fragment);
    }
    this.forceForw$();
    return new Fragment(tk_);
  }
}
/*64----------------------------------------------------------*/

class URIPazrFac_ extends Factory<URIPazr> {
  #lexr!: URILexr;
  setLexr(_x: URILexr): this {
    this.#lexr = _x;
    return this;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /** @implement */
  override createVal$(): URIPazr {
    // /*#static*/ if (PRF) {
    //   console.log(
    //     `%c# of cached URIPazr instances: ${this.val_a$.length + 1}`,
    //     `color:${LOG_cssc.performance}`,
    //   );
    // }
    return new URIPazr(this.#lexr);
  }

  // protected override resetVal$(i_x: uint) {
  //   const ret = this.get(i_x);
  //   ret.destructor();
  //   return ret;
  // }
  protected override reuseVal$(v_x: URIPazr): void {
    v_x.reset_Pazr(this.#lexr);
  }
}
export const g_uripazr_fac = new URIPazrFac_();
/*80--------------------------------------------------------------------------*/
