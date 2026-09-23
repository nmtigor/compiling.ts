/** 80**************************************************************************
 * @module lib/compiling/css/stnode/CVCtnr
 * @license MIT
 ******************************************************************************/

import type { CVSn, CVSnt } from "../alias.ts";
import { CSSSn } from "./CSSSn.ts";
/*80--------------------------------------------------------------------------*/

/** component value container */
export abstract class CVCtnr extends CSSSn {
  protected readonly cv_a$: CVSnt[];

  /* children$ */
  protected children$: CVSn[] | undefined;
  override get children(): CVSn[] {
    return this.children$ ??= this.cv_a$.filter((cv) => cv instanceof CSSSn);
  }
  /* ~ */

  /** @const @param cv_a_x */
  constructor(cv_a_x?: CVSnt[]) {
    super();
    this.cv_a$ = cv_a_x ?? [];
    for (const cv of this.cv_a$) {
      if (cv instanceof CSSSn) cv.attachTo_$(this);
    }
  }
}
/*80--------------------------------------------------------------------------*/
