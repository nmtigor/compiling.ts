/** 80**************************************************************************
 * @module lib/compiling/css/alias
 * @license MIT
 ******************************************************************************/

import type { CSSTk } from "../Token.ts";
import type { Atrule } from "./stnode/Atrule.ts";
import type { Declaration } from "./stnode/Declaration.ts";
import type { FunctionBlock } from "./stnode/FunctionBlock.ts";
import type { Qurule } from "./stnode/Qurule.ts";
import type { SimpleBlock } from "./stnode/SimpleBlock.ts";
/*80--------------------------------------------------------------------------*/

export enum Prod {
  rule_list,
  stylesheet,
  style_block,
  declaration_list,
}

/** component value */
export type CVSn = SimpleBlock | FunctionBlock;
export type CVSnt = CVSn | CSSTk;

/** rule-list child Stnode */
export type RCSn = Qurule | Atrule;
export type RCSnt = RCSn | CSSTk;

/** declaration-list child Stnode */
export type Dac = Declaration | Atrule | CVSn;
export type Dact = Dac | CSSTk;

/** style-block child Stnode */
export type Daqc = Dac | Qurule;
export type Daqct = Daqc | CSSTk;
/*80--------------------------------------------------------------------------*/
