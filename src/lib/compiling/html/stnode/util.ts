/** 80**************************************************************************
 * @module lib/compiling/html/stnode/util
 * @license MIT
 ******************************************************************************/

import { fail, space } from "@fe-lib/util.ts";
import { DEBUG } from "@fe-src/preNs.ts";
import { HTMLTk } from "../HTMLTk.ts";
import { HTMLTok } from "../HTMLTok.ts";
import type { Chr_LI, Comment_LI, Doctype_LI } from "../util.ts";
import { CtnrEl } from "./CtnrEl.ts";
import { Doment } from "./Doment.ts";
import { Elment } from "./Elment.ts";
import type { HTMLSn } from "./HTMLSn.ts";
/*80--------------------------------------------------------------------------*/

/**
 * @headconst @param self_x
 * @const @param indent_x
 */
export const _toHTML_ = (self_x: HTMLSn, indent_x = -2): string[] => {
  const ret: string[] = [];

  let dentIn = 2;
  if (self_x instanceof Elment) {
    ret.push(`| ${space(indent_x)}<${self_x.tagname}>`);

    const attr_a: string[] = [];
    const attrs = self_x.attrs_$;
    for (let i = 0, iI = attrs.an_a.length; i < iI; i++) {
      const an_i = attrs.an_a[i];
      const fan_i = attrs.foreignAn_a?.at(i);
      attr_a.push([
        fan_i ? `${fan_i.prefix} ${fan_i.localName}` : an_i,
        `"${attrs.getAv(an_i)}"`,
      ].join("="));
    }
    for (const attr of attr_a.sort()) {
      ret.push(`| ${space(indent_x + dentIn)}${attr}`);
    }

    if (self_x.tagname === "template") {
      ret.push(`| ${space(indent_x + dentIn)}content`);
      dentIn += 2;
    }
  }

  if (self_x instanceof CtnrEl || self_x instanceof Doment) {
    const texts: string[] = [];
    const flushTexts_ = () => {
      if (texts.length) {
        ret.push(`| ${space(indent_x + dentIn)}"${texts.join("")}"`);
        texts.length = 0;
      }
    };

    for (const snt of self_x.snt_a) {
      if (!(snt instanceof HTMLTk)) {
        flushTexts_();

        ret.push(...snt._toHTML_(indent_x + dentIn));
        continue;
      }

      if (snt.value === HTMLTok.tag || snt.value === HTMLTok.placeholder) {
        flushTexts_();
        continue;
      }

      switch (snt.value) {
        case HTMLTok.doctype: {
          flushTexts_();

          //jjjj TOCLEANUP
          // const r_ = snt._repr_;
          // ret.push(`| <!${r_[0]} ${r_[1] ?? ""}${r_[3] ? ` ${r_[3]}` : ""}>`);
          const li_ = snt.lexdInfo as Doctype_LI;
          const nm_ = li_.name_s?.replaceAll("\u0000", "\uFFFD") ?? "";
          const sys = li_.quotSys_s?.replaceAll("\u0000", "\uFFFD") ?? "";
          ret.push(`| <!DOCTYPE ${nm_}${sys ? ` ${sys}` : ""}>`);
          break;
        }
        case HTMLTok.comment: {
          flushTexts_();

          const textA = (snt.lexdInfo as Comment_LI).data.getTextA();
          if (textA.length === 1) {
            ret.push(`| ${space(indent_x + dentIn)}<!-- ${textA[0]} -->`);
          } else {
            ret.push(
              `| ${space(indent_x + dentIn)}<!-- ${textA.at(0)}`,
              ...textA.slice(1, -1),
              `${textA.at(-1)} -->`,
            );
          }
          break;
        }
        case HTMLTok.character: {
          const t_ = (snt.lexdInfo as Chr_LI).getText();
          if (t_) texts.push(t_);
          break;
        }
        case HTMLTok.chrref: {
          texts.push(snt.refchr!);
          break;
        }
        default:
          /*#static*/ DEBUG ? fail("Should not run here!") : {};
      }
    }
    flushTexts_();
  }

  return ret;
};
/*80--------------------------------------------------------------------------*/
