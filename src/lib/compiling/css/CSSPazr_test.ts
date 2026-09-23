/** 80**************************************************************************
 * @module lib/compiling/css/CSSPazr_test
 * @license MIT
 ******************************************************************************/

import { assertEquals, assertStrictEquals } from "@std/assert";
import { after, afterEach, describe, it } from "@std/testing/bdd";
import { g_count } from "../../util/performance.ts";
import type { TestO } from "../_test.ts";
import { ran, repl, rv, test_o } from "../_test.ts";
import { Bufr } from "../Bufr.ts";
import { g_ran_fac } from "../RanFac.ts";
import { ErrMsg } from "../util.ts";
import { Prod } from "./alias.ts";
import { CSSLexr } from "./CSSLexr.ts";
import { CSSPazr } from "./CSSPazr.ts";
import type { CVCtnr } from "./stnode/CVCtnr.ts";
import type { Qurule } from "./stnode/Qurule.ts";
import type { RuleList } from "./stnode/RuleList.ts";
import type { SimpleBlock } from "./stnode/SimpleBlock.ts";
/*80--------------------------------------------------------------------------*/

const bufr = new Bufr();
const lexr = new CSSLexr(bufr);
const pazr = new CSSPazr(lexr);
Object.assign(test_o, { bufr, lexr, pazr } as Partial<TestO>);

const init_ = (prod: Prod, text_x?: string | string[]) => {
  lexr.reset_Lexr();
  pazr.reset_CSSPazr(prod);
  bufr.repl_actr.init(lexr, pazr);

  if (text_x) repl(rv(0, 0), text_x);
};

const fina_ = () => {
  bufr.reset_Bufr();
  lexr.destructor();
};

afterEach(() => {
  fina_();
  assertEquals(g_count.newToken, g_count.oldToken);
});

after(() => {
  console.log(`g_count.newLoc: ${g_count.newLoc}`);
  console.log(`g_count.newRan: ${g_count.newRan}`);
  console.log(`g_count.newToken: ${g_count.newToken}`);
  console.log(`g_count.oldToken: ${g_count.oldToken}`);
  console.log(`g_ran_fac: ${g_ran_fac}`);
});

describe("CSSPazr.paz_impl$() in Prod.rule_list", () => {
  it("#pazQurule()", () => {
    init_(Prod.rule_list);
    let cc_: CVCtnr;

    repl(rv(0, 0), "{");
    assertEquals(pazr._err_, [
      ["SimpleBlock,2", [{ msg: ErrMsg.css_simple_block_open }]],
      ["Qurule,1", [{ msg: ErrMsg.css_qurule_no_prelude }]],
    ]);
    assertEquals(pazr.root?._newInfo_, "RuleList,0 [ curly_open[0-0,0-1) ]");
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [
        ["Qurule,1", {
          "cv_a$": [],
          "#tailblock": ["SimpleBlock,2", {
            "#openTk": "curly_open[0-0,0-1)",
            "cv_a$": [],
            "#clozTk": undefined,
          }],
        }],
      ],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), []);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(ran(0).rv, "}");
    /*
    {}
    */
    assertEquals(pazr._err_, [
      ["Qurule,1", [{ msg: ErrMsg.css_qurule_no_prelude }]],
    ]);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ curly_open[0-0,0-1), curly_cloz[0-1,0-2) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [
        ["Qurule,1", {
          "cv_a$": [],
          "#tailblock": ["SimpleBlock,2", {
            "#openTk": "curly_open[0-0,0-1)",
            "cv_a$": [],
            "#clozTk": "curly_cloz[0-1,0-2)",
          }],
        }],
      ],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), []);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(rv(0, 0), ".x");
    /*
    .x{}
    */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ delim[0-0,0-1), curly_cloz[0-3,0-4) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [
        ["Qurule,1", {
          "cv_a$": ["delim[0-0,0-1)", "ident[0-1,0-2)"],
          "#tailblock": ["SimpleBlock,2", {
            "#openTk": "curly_open[0-2,0-3)",
            "cv_a$": [],
            "#clozTk": "curly_cloz[0-3,0-4)",
          }],
        }],
      ],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), [
      "SimpleBlock,2 [ curly_open[0-0,0-1), curly_cloz[0-1,0-2) ]",
    ]);
    cc_ = (pazr.root as RuleList)._c_(0) as CVCtnr;
    assertStrictEquals(pazr.reusdSn_ss_$.at(0), (cc_ as Qurule)._tailblock_);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(rv(0, 0, 0, 1), "[");
    /*
    [x{}
    */
    assertEquals(pazr._err_, [
      ["SimpleBlock,2", [{ msg: ErrMsg.css_simple_block_open }]],
      ["Qurule,1", [{ msg: ErrMsg.css_qurule_open }]],
    ]);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ squar_open[0-0,0-1), curly_cloz[0-3,0-4) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [
        ["Qurule,1", {
          "cv_a$": [
            ["SimpleBlock,2", {
              "#openTk": "squar_open[0-0,0-1)",
              "cv_a$": [
                "ident[0-1,0-2)",
                ["SimpleBlock,3", {
                  "#openTk": "curly_open[0-2,0-3)",
                  "cv_a$": [],
                  "#clozTk": "curly_cloz[0-3,0-4)",
                }],
              ],
              "#clozTk": undefined,
            }],
          ],
          "#tailblock": undefined,
        }],
      ],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), [
      "SimpleBlock,3 [ curly_open[0-2,0-3), curly_cloz[0-3,0-4) ]",
    ]);
    cc_ = (pazr.root as RuleList)._c_(0) as CVCtnr;
    assertStrictEquals(
      pazr.reusdSn_ss_$.at(0),
      (cc_._c_(0) as SimpleBlock)._c_(0),
    );
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(rv(0, 2), "]");
    /*
    [p]{}
    */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ squar_open[0-0,0-1), curly_cloz[0-4,0-5) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [
        ["Qurule,1", {
          "cv_a$": [
            ["SimpleBlock,2", {
              "#openTk": "squar_open[0-0,0-1)",
              "cv_a$": ["ident[0-1,0-2)"],
              "#clozTk": "squar_cloz[0-2,0-3)",
            }],
          ],
          "#tailblock": ["SimpleBlock,2", {
            "#openTk": "curly_open[0-3,0-4)",
            "cv_a$": [],
            "#clozTk": "curly_cloz[0-4,0-5)",
          }],
        }],
      ],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), [
      "SimpleBlock,2 [ curly_open[0-2,0-3), curly_cloz[0-3,0-4) ]",
    ]);
    cc_ = (pazr.root as RuleList)._c_(0) as CVCtnr;
    assertStrictEquals(pazr.reusdSn_ss_$.at(0), (cc_ as Qurule)._tailblock_);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);
  });

  it("#pazAtrule()", () => {
    init_(Prod.rule_list);
    let cc_: CVCtnr;

    repl(rv(0, 0), "@");
    assertEquals(pazr._err_, [["Qurule,1", [{ msg: ErrMsg.css_qurule_open }]]]);
    assertEquals(pazr.root?._newInfo_, "RuleList,0 [ delim[0-0,0-1) ]");
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [
        ["Qurule,1", { "cv_a$": ["delim[0-0,0-1)"], "#tailblock": undefined }],
      ],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), []);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(ran(0).rv, "media");
    /*
    @media
    */
    assertEquals(pazr._err_, [["Atrule,1", [{ msg: ErrMsg.css_atrule_open }]]]);
    assertEquals(pazr.root?._newInfo_, "RuleList,0 [ at_keyword[0-0,0-6) ]");
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [["Atrule,1", {
        "#openTk": "at_keyword[0-0,0-6)",
        "cv_a$": [],
        "#tailblock": undefined,
        "#clozTk": undefined,
      }]],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), []);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(ran(0).rv, " (");
    /*
    @media (
    */
    assertEquals(pazr._err_, [
      ["SimpleBlock,2", [{ msg: ErrMsg.css_simple_block_open }]],
      ["Atrule,1", [{ msg: ErrMsg.css_atrule_open }]],
    ]);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ at_keyword[0-0,0-6), paren_open[0-7,0-8) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [["Atrule,1", {
        "#openTk": "at_keyword[0-0,0-6)",
        "cv_a$": [
          "whitespace[0-6,0-7)",
          ["SimpleBlock,2", {
            "#openTk": "paren_open[0-7,0-8)",
            "cv_a$": [],
            "#clozTk": undefined,
          }],
        ],
        "#tailblock": undefined,
        "#clozTk": undefined,
      }]],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), []);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(ran(0).rv, "width > 50rem)");
    /*
    @media (width > 50rem)
    */
    assertEquals(pazr._err_, [["Atrule,1", [{ msg: ErrMsg.css_atrule_open }]]]);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ at_keyword[0-0,0-6), paren_cloz[0-21,0-22) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [["Atrule,1", {
        "#openTk": "at_keyword[0-0,0-6)",
        "cv_a$": [
          "whitespace[0-6,0-7)",
          ["SimpleBlock,2", {
            "#openTk": "paren_open[0-7,0-8)",
            "cv_a$": [
              "ident[0-8,0-13)",
              "whitespace[0-13,0-14)",
              "delim[0-14,0-15)",
              "whitespace[0-15,0-16)",
              "dimension[0-16,0-21)",
            ],
            "#clozTk": "paren_cloz[0-21,0-22)",
          }],
        ],
        "#tailblock": undefined,
        "#clozTk": undefined,
      }]],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), []);
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(ran(0).rv, " {");
    /*
    @media (width > 50rem) {
    */
    assertEquals(pazr._err_, [
      ["SimpleBlock,2", [{ msg: ErrMsg.css_simple_block_open }]],
    ]);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ at_keyword[0-0,0-6), curly_open[0-23,0-24) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [["Atrule,1", {
        "#openTk": "at_keyword[0-0,0-6)",
        "cv_a$": [
          "whitespace[0-6,0-7)",
          ["SimpleBlock,2", {
            "#openTk": "paren_open[0-7,0-8)",
            "cv_a$": [
              "ident[0-8,0-13)",
              "whitespace[0-13,0-14)",
              "delim[0-14,0-15)",
              "whitespace[0-15,0-16)",
              "dimension[0-16,0-21)",
            ],
            "#clozTk": "paren_cloz[0-21,0-22)",
          }],
          "whitespace[0-22,0-23)",
        ],
        "#tailblock": ["SimpleBlock,2", {
          "#openTk": "curly_open[0-23,0-24)",
          "cv_a$": [],
          "#clozTk": undefined,
        }],
        "#clozTk": undefined,
      }]],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), [
      "SimpleBlock,2 [ paren_open[0-7,0-8), paren_cloz[0-21,0-22) ]",
    ]);
    cc_ = (pazr.root as RuleList)._c_(0) as CVCtnr;
    assertStrictEquals(pazr.reusdSn_ss_$.at(0), cc_._c_(0));
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);

    repl(ran(0).rv, "\n  flex-direction: row;\n}");
    /*
    @media (width > 50rem) {
      flex-direction: row;
    }
    */
    assertEquals(pazr.root?.hasErr_1, false);
    assertEquals(
      pazr.root?._newInfo_,
      "RuleList,0 [ at_keyword[0-0,0-6), curly_cloz[2-0,2-1) ]",
    );
    assertEquals(pazr.root?._repr_(), ["RuleList,0", {
      "#rc_a": [["Atrule,1", {
        "#openTk": "at_keyword[0-0,0-6)",
        "cv_a$": [
          "whitespace[0-6,0-7)",
          ["SimpleBlock,2", {
            "#openTk": "paren_open[0-7,0-8)",
            "cv_a$": [
              "ident[0-8,0-13)",
              "whitespace[0-13,0-14)",
              "delim[0-14,0-15)",
              "whitespace[0-15,0-16)",
              "dimension[0-16,0-21)",
            ],
            "#clozTk": "paren_cloz[0-21,0-22)",
          }],
          "whitespace[0-22,0-23)",
        ],
        "#tailblock": ["SimpleBlock,2", {
          "#openTk": "curly_open[0-23,0-24)",
          "cv_a$": [
            "whitespace[0-24,1-2)",
            "ident[1-2,1-16)",
            "colon[1-16,1-17)",
            "whitespace[1-17,1-18)",
            "ident[1-18,1-21)",
            "semicolon[1-21,1-22)",
            "whitespace[1-22,2-0)",
          ],
          "#clozTk": "curly_cloz[2-0,2-1)",
        }],
        "#clozTk": undefined,
      }]],
    }]);
    assertEquals(pazr.reusdSn_ss_$._repr_(), [
      "SimpleBlock,2 [ paren_open[0-7,0-8), paren_cloz[0-21,0-22) ]",
    ]);
    cc_ = (pazr.root as RuleList)._c_(0) as CVCtnr;
    assertStrictEquals(pazr.reusdSn_ss_$.at(0), cc_._c_(0));
    assertEquals(pazr.unrelSn_ss_$._reprSorted_(), []);
  });

  it("kkkk CDO, CDC", () => {
    ///
  });
});

describe("CSSSn.replaceChild()", () => {
});
/*80--------------------------------------------------------------------------*/
