/** 80**************************************************************************
 * @module lib/compiling/css/util
 * @license MIT
 ******************************************************************************/

import type { CSSTk } from "../Token.ts";
import { CSSTok } from "./CSSTok.ts";
import { CSSSn } from "./stnode/CSSSn.ts";
/*80--------------------------------------------------------------------------*/

//jjjj TOCLEANUP
// /** @const @param tk_x */
// export const bdryOfCurly = (tk_x: CSSTk): boolean => {
//   const sn_ = tk_x.sn_$;
//   return sn_ instanceof SimpleBlock && sn_.isCurly;
// };

/** @const @param tk_x */
export const clozTokOf = (tk_x: CSSTk): CSSTok | undefined => {
  switch (tk_x.value) {
    case CSSTok.paren_open:
      return CSSTok.paren_cloz;
    case CSSTok.squar_open:
      return CSSTok.squar_cloz;
    case CSSTok.curly_open:
      return CSSTok.curly_cloz;
    default:
      return undefined;
  }
};

export const _repr_ = (snt_x: CSSSn | CSSTk) =>
  snt_x instanceof CSSSn ? snt_x._repr_() : `${snt_x}`;
/*80--------------------------------------------------------------------------*/
