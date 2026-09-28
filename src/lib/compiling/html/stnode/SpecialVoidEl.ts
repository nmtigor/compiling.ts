/** 80**************************************************************************
 * @module lib/compiling/html/stnode/SpecialVoidEl
 * @license MIT
 ******************************************************************************/

import type { Insmod } from "../alias.ts";
import { ContCat, NestCat } from "../alias.ts";
import type { HTMLTk } from "../HTMLTk.ts";
import { avIsBodyok } from "../util.ts";
import { VoidEl } from "./VoidEl.ts";
/*80--------------------------------------------------------------------------*/

export abstract class SpecialVoidEl extends VoidEl {
  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, tagname_x: string, opntagTk_x: HTMLTk) {
    super(insmod_x, tagname_x, opntagTk_x);
    this.nestCat$ = NestCat.special;
  }
}
/*64----------------------------------------------------------*/

/** @final */
export class Area_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "area", opntagTk_x);
    this.contCat$ = ContCat.phrasing;
  }
}

/** @final */
export class Base_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "base", opntagTk_x);
    this.contCat$ = ContCat.metadata;
  }
}

/** @final */
export class Br_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "br", opntagTk_x);
    this.contCat$ = ContCat.phrasing;
  }
}

/** @final */
export class Col_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "col", opntagTk_x);
  }
}

/** @final */
export class Embed_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "embed", opntagTk_x);
    this.contCat$ = ContCat.embedded | ContCat.interactive | ContCat.palpable;
  }
}

/** @final */
export class Hr_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "hr", opntagTk_x);
    this.contCat$ = ContCat.flow;
  }
}

/** @final */
export class Img_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "img", opntagTk_x);
    this.contCat$ = ContCat.embedded | ContCat.palpable |
      ContCat.form_associated;
    if (this.attrs_$.hasAn("usemap") || this.attrs_$.hasAn("controls")) {
      this.contCat$ |= ContCat.interactive;
    }
  }
}

/** @final */
export class Input_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "input", opntagTk_x);
    this.contCat$ = ContCat.phrasing | ContCat.form_associated;
    if (this.attrs_$.getAv("type") !== "hidden") {
      this.contCat$ |= ContCat.interactive | ContCat.palpable |
        ContCat.labelable;
    }
  }
}

/** @final */
export class Link_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "link", opntagTk_x);
    this.contCat$ = ContCat.metadata;
    if (
      this.attrs_$.hasAn("itemprop") || avIsBodyok(this.attrs_$.getAv("rel"))
    ) {
      this.contCat$ |= ContCat.phrasing;
    }
  }
}

/** @final */
export class Meta_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "meta", opntagTk_x);
    this.contCat$ = ContCat.metadata;
    if (this.attrs_$.hasAn("itemprop")) {
      this.contCat$ |= ContCat.phrasing;
    }
  }
}

/** @final */
export class Source_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "source", opntagTk_x);
  }
}

/** @final */
export class Track_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "track", opntagTk_x);
  }
}

/** @final */
export class Wbr_El extends SpecialVoidEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "wbr", opntagTk_x);
    this.contCat$ = ContCat.phrasing;
  }
}
/*80--------------------------------------------------------------------------*/
