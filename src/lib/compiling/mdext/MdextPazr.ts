/** 80**************************************************************************
 * @module lib/compiling/mdext/MdextPazr
 * @license MIT
 ******************************************************************************/

import { assert, fail, out } from "@fe-lib/util.ts";
import { INOUT } from "@fe-src/preNs.ts";
import { Pazr } from "../Pazr.ts";
import type { MdextLexr } from "./MdextLexr.ts";
import type { MdextTok } from "./MdextTok.ts";
import { Block } from "./stnode/Block.ts";
import { Document } from "./stnode/Document.ts";
import { ListItem } from "./stnode/ListItem.ts";
/*80--------------------------------------------------------------------------*/

/** @final */
export class MdextPazr extends Pazr<MdextTok> {
  protected override root$: Document | undefined = undefined;
  get _root_() {
    return this.root$;
  }
  override get root(): Document {
    return this.root$ ??= new Document();
  }

  override get drtSn(): Block {
    this.drtSn_$ ??= this.root;
    return this.drtSn_$ as Block;
  }

  /**
   * Only invoked in `MdextLexr.create()`
   * @package
   */
  constructor(Lexr_x: MdextLexr) {
    super(Lexr_x);
  }

  override reset_Pazr(): this {
    this.reset_Pazr$();
    this.root$ = undefined;
    return this;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  @out((self: MdextPazr) => {
    assert(!self.drtSn_$ || self.drtSn_$ instanceof Block);
  })
  protected override sufPazmrk$(): void {
    if (this.drtSn_$) {
      if (!(this.drtSn_$ instanceof Block)) {
        let sn_ = this.drtSn_$.parent;
        const VALVE = 100;
        let valve = VALVE;
        while (sn_ && --valve) {
          if (sn_ instanceof Block) break;
          sn_ = sn_.parent;
        }
        assert(valve, `Loop ${VALVE}(±1) times!`);
        /*#static*/ if (INOUT) {
          assert(sn_);
        }
        this.enlrgBdriesTo_$(sn_!);
      }
      if (this.drtSn_$.parent instanceof ListItem) {
        this.enlrgBdriesTo_$(this.drtSn_$.parent);
      }
      //jjjj TOCLEANUP
      // } else {
      //   this.#pazr.maximizeBdries_$();

      //jjjj TOCLEANUP
      // /* `unrelSn_ss_$` may have `drtSn_$`: 3304.
      // `drtSn_$` has to be removed from `unrelSn_ss_$` because `drtSn_$` will be
      // `.reset_Block()` in `MdextLexr.preLex$()`. */
      // this.unrelSn_ss_$.rmv(this.drtSn_$);
    }

    //jjjj TOCLEANUP
    // const drtStopLoc = this.tailBdryClrTk_$!.sntStrtLoc;
    const drtStopLoc = this.lexr$.stopLexTk_$.sntStrtLoc;
    for (let i = this.unrelSn_ss_$.length; i--;) {
      if (drtStopLoc.posE(this.unrelSn_ss_$.ary[i].sntStrtLoc)) {
        /* Reusability of Stnode is checked by `sntStrtLoc`. In case of this
        branch, current Stnode can not be reused (see 3144). Deleting it from
        `unrelSn_ss_$` makes its Token be able to be gathered by
        `#gathrUnrelSntIn()`. */
        this.unrelSn_ss_$.splice(i, 1);
      }
    }
  }

  /** @implement */
  protected paz_impl$(): void {
    fail("Disabled");
  }
}
/*80--------------------------------------------------------------------------*/
