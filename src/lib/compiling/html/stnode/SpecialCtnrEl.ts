/** 80**************************************************************************
 * @module lib/compiling/html/stnode/SpecialCtnrEl
 * @license MIT
 ******************************************************************************/

import type { Insmod } from "../alias.ts";
import { ContCat, NestCat, TextCat } from "../alias.ts";
import type { HTMLTk } from "../HTMLTk.ts";
import { CtnrEl } from "./CtnrEl.ts";
/*80--------------------------------------------------------------------------*/

export abstract class SpecialCtnrEl extends CtnrEl {
  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param tk_x
   */
  constructor(insmod_x: Insmod, tagname_x: string, tk_x: HTMLTk) {
    super(insmod_x, tagname_x, tk_x);
    this.nestCat$ = NestCat.special;
  }
}

abstract class SpecialForeignEl extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param tagname_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, tagname_x: string, opntagTk_x: HTMLTk) {
    super(insmod_x, tagname_x, opntagTk_x);
    this.textCat$ = TextCat.foreign;
  }
}
/*64----------------------------------------------------------*/

/** @final */
export class Address_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "address", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Article_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "article", opntagTk_x);
    this.contCat$ = ContCat.sectioning | ContCat.palpable;
  }
}

/** @final */
export class Aside_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "aside", opntagTk_x);
    this.contCat$ = ContCat.sectioning | ContCat.palpable;
  }
}

/** @final */
export class Blockquote_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "blockquote", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Button_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "button", opntagTk_x);
    this.contCat$ = ContCat.phrasing | ContCat.interactive | ContCat.palpable |
      ContCat.form_associated | ContCat.labelable;
  }
}

/** @final */
export class Caption_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "caption", opntagTk_x);
  }
}

/** @final */
export class Code_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "code", opntagTk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class Dd_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "dd", opntagTk_x);
  }
}

/** @final */
export class Del_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "del", opntagTk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class Details_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "details", opntagTk_x);
    this.contCat$ = ContCat.interactive | ContCat.palpable;
  }
}

/** @final */
export class Div_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "div", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Dl_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "dl", opntagTk_x);
    this.contCat$ = ContCat.flow;
    /*llll `| ContCat.palpable` when adding child
    see [4.4.9 The dl element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element)
     */
  }
}

/** @final */
export class Dt_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "dt", opntagTk_x);
  }
}

/** @final */
export class Fieldset_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "fieldset", opntagTk_x);
    this.contCat$ = ContCat.form_associated | ContCat.palpable;
  }
}

/** @final */
export class Figcaption_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "figcaption", opntagTk_x);
  }
}

/** @final */
export class Figure_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "figure", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Footer_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "footer", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Form_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "form", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class H1_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "h1", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class H2_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "h2", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class H3_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "h3", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class H4_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "h4", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class H5_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "h5", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class H6_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "h6", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class Header_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "header", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Hgroup_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "hgroup", opntagTk_x);
    this.contCat$ = ContCat.heading | ContCat.palpable;
  }
}

/** @final */
export class Iframe_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "iframe", opntagTk_x);
    this.contCat$ = ContCat.embedded | ContCat.interactive | ContCat.palpable;
  }
}

/** @final */
export class Ins_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "ins", opntagTk_x);
    this.contCat$ = ContCat.phrasing | ContCat.palpable;
  }
}

/** @final */
export class Li_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "li", opntagTk_x);
  }
}

/** @final */
export class Main_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "main", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Menu_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "menu", opntagTk_x);
    this.contCat$ = ContCat.flow;
    /*llll `| ContCat.palpable` when adding child
    see [4.4.7 The menu element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element)
     */
  }
}

/** @final */
export class Nav_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "nav", opntagTk_x);
    this.contCat$ = ContCat.sectioning | ContCat.palpable;
  }
}

/** @final */
export class Noscript_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "noscript", opntagTk_x);
    this.contCat$ = ContCat.metadata | ContCat.phrasing;
  }
}

/** @final */
export class Object_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "object", opntagTk_x);
    this.contCat$ = ContCat.embedded | ContCat.phrasing |
      ContCat.form_associated;
  }
}

/** @final */
export class Ol_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "ol", opntagTk_x);
    this.contCat$ = ContCat.flow;
    /*llll `| ContCat.palpable` when adding child
    see [4.4.5 The ol element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element)
     */
  }
}

/** @final */
export class Pre_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "pre", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Script_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "script", opntagTk_x);
    this.textCat$ = TextCat.raw_text;
    this.contCat$ = ContCat.metadata | ContCat.phrasing |
      ContCat.script_supporing;
  }
}

/** @final */
export class Search_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "search", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Section_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "section", opntagTk_x);
    this.contCat$ = ContCat.sectioning | ContCat.palpable;
  }
}

/** @final */
export class Select_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "select", opntagTk_x);
    this.contCat$ = ContCat.phrasing | ContCat.interactive | ContCat.palpable |
      ContCat.form_associated | ContCat.labelable;
  }
}

/** @final */
export class Style_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "style", opntagTk_x);
    this.textCat$ = TextCat.raw_text;
    this.contCat$ = ContCat.metadata;
  }
}

/** @final */
export class Summary_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "summary", opntagTk_x);
  }
}

/** @final */
export class Table_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "table", opntagTk_x);
    this.contCat$ = ContCat.flow | ContCat.palpable;
  }
}

/** @final */
export class Td_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "td", opntagTk_x);
  }
}

/** @final */
export class Template_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "template", opntagTk_x);
    this.textCat$ = TextCat.template;
    this.contCat$ = ContCat.metadata | ContCat.phrasing |
      ContCat.script_supporing;
  }
}

/** @final */
export class Textarea_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "textarea", opntagTk_x);
    this.textCat$ = TextCat.escapable_raw_text;
    this.contCat$ = ContCat.phrasing | ContCat.interactive | ContCat.palpable |
      ContCat.form_associated | ContCat.labelable;
  }
}

/** @final */
export class Tfoot_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "tfoot", opntagTk_x);
  }
}

/** @final */
export class Th_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "th", opntagTk_x);
  }
}

/** @final */
export class Thead_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "thead", opntagTk_x);
  }
}

/** @final */
export class Title_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "title", opntagTk_x);
    this.textCat$ = TextCat.escapable_raw_text;
    this.contCat$ = ContCat.metadata;
  }
}

/** @final */
export class Ul_El extends SpecialCtnrEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "ul", opntagTk_x);
    this.contCat$ = ContCat.flow;
    /*llll `| ContCat.palpable` when adding child
    see [4.4.6 The ul element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element)
     */
  }
}
/*64----------------------------------------------------------*/

/** @final */
export class ForeignObject_SVG extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "svg foreignObject", opntagTk_x);
  }
}

/** @final */
export class Desc_SVG extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "svg desc", opntagTk_x);
  }
}

/** @final */
export class Title_SVG extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "svg title", opntagTk_x);
  }
}
/*64----------------------------------------------------------*/

/** @final */
export class I_MathML extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "math mi", opntagTk_x);
  }
}

/** @final */
export class O_MathML extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "math mo", opntagTk_x);
  }
}

/** @final */
export class N_MathML extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "math mn", opntagTk_x);
  }
}

/** @final */
export class S_MathML extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "math ms", opntagTk_x);
  }
}

/** @final */
export class Text_MathML extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "math mtext", opntagTk_x);
  }
}

/** @final */
export class AnnotationXml_MathML extends SpecialForeignEl {
  /**
   * @const @param insmod_x
   * @const @param opntagTk_x
   */
  constructor(insmod_x: Insmod, opntagTk_x: HTMLTk) {
    super(insmod_x, "math annotation-xml", opntagTk_x);
  }
}
/*80--------------------------------------------------------------------------*/
