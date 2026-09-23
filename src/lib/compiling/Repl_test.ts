/** 80**************************************************************************
 * @module lib/compiling/Repl_test
 * @license MIT
 ******************************************************************************/

import { assertEquals } from "@std/assert";
import { afterEach, describe, it } from "@std/testing/bdd";
import { Bufr } from "./Bufr.ts";
import { Repl } from "./Repl.ts";
import type { TestO } from "./_test.ts";
import { ran, rv, test_o } from "./_test.ts";
import { LOG_cssc } from "../alias.ts";
/*80--------------------------------------------------------------------------*/

const bufr = new Bufr();
Object.assign(test_o, { bufr } as Partial<TestO>);

const init_ = (text_x?: string | string[]) => {
  bufr.setLines(text_x);
};

afterEach(() => {
  bufr.reset_Bufr();
});

let repl!: Repl;

describe("Repl._test_()", () => {
  it("Insert, delete, replace on one line", () => {
    init_();

    repl = new Repl(bufr, { rv: rv(0, 0), txt: "d" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    const expect_1 = ["d"];
    assertEquals(bufr.getTextA(), expect_1);
    assertEquals(repl._ranval_rev, ran(0, 0, 0).rv);
    const expect_0 = [""];
    assertEquals(repl._replText_a_, expect_0);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_0);
    assertEquals(repl._ranval_, ran(0, 0).rv);
    assertEquals(repl._text_a_, expect_1);
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), expect_1);

    /*
    d
     */
    repl = new Repl(bufr, { rv: rv(0, 0), txt: "ef" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    const expect_2 = ["efd"];
    assertEquals(bufr.getTextA(), expect_2);

    repl = new Repl(bufr, { rv: rv(0, 1, 0, 2), txt: "_+_" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), ["e_+_d"]);
    assertEquals(repl._ranval_rev, rv(0, 1, 0, 4));
    assertEquals(repl._replText_a_, ["f"]);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_2);
    assertEquals(repl._ranval_, rv(0, 1, 0, 2));
    assertEquals(repl._text_a_, ["_+_"]);
  });

  it("Insert, delete on many lines", () => {
    init_();

    repl = new Repl(bufr, { rv: rv(0, 0), txt: "\n" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    const expect_1 = ["", ""];
    assertEquals(bufr.getTextA(), expect_1);
    assertEquals(repl._ranval_rev, ran(0, undefined, 1).rv);
    const expect_0 = [""];
    assertEquals(repl._replText_a_, expect_0);

    repl = new Repl(bufr, { rv: rv(1, 0), txt: "@" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), ["", "@"]);
    assertEquals(repl._ranval_rev, ran(1, 0, 1).rv);
    assertEquals(repl._replText_a_, expect_0);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_1);
    assertEquals(repl._ranval_, ran(1).rv);
    assertEquals(repl._text_a_, ["@"]);

    repl = new Repl(bufr, { rv: rv(0, 0), txt: "ab\ncd\nef" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    const expect_2 = ["ab", "cd", "ef", ""];
    assertEquals(bufr.getTextA(), expect_2);
    assertEquals(repl._ranval_rev, ran(0, 0, 2).rv);
    assertEquals(repl._replText_a_, expect_0);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_1);
    // console.log(repl._ranval_);
    assertEquals(repl._ranval_, ran(0).rv);
    assertEquals(repl._text_a_, ["ab", "cd", "ef"]);
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), expect_2);

    repl = new Repl(bufr, { rv: rv(1, 1), txt: "1\n2\n3" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    const expect_3 = ["ab", "c1", "2", "3d", "ef", ""];
    assertEquals(bufr.getTextA(), expect_3);
    assertEquals(repl._ranval_rev, rv(1, 1, 3, 1));
    assertEquals(repl._replText_a_, expect_0);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_2);
    assertEquals(repl._ranval_, ran(1, 1).rv);
    assertEquals(repl._text_a_, ["1", "2", "3"]);
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), expect_3);
  });

  it("Replace on many lines", () => {
    /*
    ab
    cd
    ef
     */
    init_("ab\ncd\nef");

    repl = new Repl(bufr, { rv: ran(0, 0, 1).rv, txt: "12\n34" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    const expect_1 = ["12", "34", "ef"];
    assertEquals(bufr.getTextA(), expect_1);
    assertEquals(repl._ranval_rev, ran(0, 0, 1).rv);
    assertEquals(repl._replText_a_, ["ab", "cd"]);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), ["ab", "cd", "ef"]);
    assertEquals(repl._ranval_, ran(0, 0, 1).rv);
    assertEquals(repl._text_a_, ["12", "34"]);
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), expect_1);

    repl = new Repl(bufr, { rv: rv(1, 0, 1, 1), txt: "$\n" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), ["12", "$", "4", "ef"]);
    assertEquals(repl._ranval_rev, rv(1, 0, 2, 0));
    assertEquals(repl._replText_a_, ["3"]);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_1);
    assertEquals(repl._ranval_, rv(1, 0, 1, 1));
    assertEquals(repl._text_a_, ["$", ""]);

    repl = new Repl(bufr, { rv: rv(1, 1, 2, 1), txt: "__" });
    repl._test_(
      repl._ranval_,
      repl._text_a_,
      repl._ranval_rev,
      repl._replText_a_,
    );
    assertEquals(bufr.getTextA(), ["12", "3__f"]);
    assertEquals(repl._ranval_rev, rv(1, 1, 1, 3));
    assertEquals(repl._replText_a_, ["4", "e"]);
    repl._test_(
      repl._ranval_rev,
      repl._replText_a_,
      repl._ranval_,
      repl._text_a_,
    );
    assertEquals(bufr.getTextA(), expect_1);
    assertEquals(repl._ranval_, rv(1, 1, 2, 1));
    assertEquals(repl._text_a_, ["__"]);
  });

  it("Modify with `aoa`", () => {
    const text_a = ["ab", "cd", "ef"];
    init_(text_a);

    repl = new Repl(
      bufr,
      [ // not sorted
        { rv: rv(0, 0, 0, 1), txt: "" },
        { rv: rv(2, 0, 2, 2), txt: "" },
        { rv: rv(0, 1, 1, 2), txt: "" },
      ],
    );
    const ranval_a = [rv(0, 0, 0, 1), rv(0, 1, 1, 2), rv(2, 0, 2, 2)];
    const text_a2 = [[""], [""], [""]];
    repl._test_(
      repl._ranval_a_,
      repl._text_a2_,
      repl._ranval_rev_a_,
      repl._replText_a2_,
    );
    const text_1_a = ["", ""];
    assertEquals(bufr.getTextA(), text_1_a);
    const ranval_rev_a = [rv(0, 0), rv(0, 0), rv(1, 0)];
    assertEquals(repl._ranval_rev_a_, ranval_rev_a);
    const replText_a2 = [["a"], ["b", "cd"], ["ef"]];
    assertEquals(repl._replText_a2_, replText_a2);

    repl._test_(
      repl._ranval_rev_a_,
      repl._replText_a2_,
      repl._ranval_a_,
      repl._text_a2_,
    );
    assertEquals(bufr.getTextA(), text_a);
    assertEquals(repl._ranval_a_, ranval_a);
    assertEquals(repl._text_a2_, text_a2);

    repl._test_(
      repl._ranval_a_,
      repl._text_a2_,
      repl._ranval_rev_a_,
      repl._replText_a2_,
    );
    assertEquals(bufr.getTextA(), text_1_a);
    assertEquals(repl._ranval_rev_a_, ranval_rev_a);
    assertEquals(repl._replText_a2_, replText_a2);
  });

  it("Simulate multiline drag", () => {
    const text_a = ["ab", "cd", "ef"];
    init_(text_a);

    repl = new Repl(
      bufr,
      [ // not sorted
        { rv: rv(1, 1, 2, 1), txt: "" },
        { rv: rv(0, 1), txt: ["d", "e"] },
      ],
    );
    const ranval_a = [rv(0, 1), rv(1, 1, 2, 1)];
    const text_a2 = [["d", "e"], [""]];
    repl._test_(
      repl._ranval_a_,
      repl._text_a2_,
      repl._ranval_rev_a_,
      repl._replText_a2_,
    );
    const text_1_a = ["ad", "eb", "cf"];
    assertEquals(bufr.getTextA(), text_1_a);
    const ranval_rev_a = [rv(0, 1, 1, 1), rv(2, 1)];
    assertEquals(repl._ranval_rev_a_, ranval_rev_a);
    const replText_a2 = [[""], ["d", "e"]];
    assertEquals(repl._replText_a2_, replText_a2);

    repl._test_(
      repl._ranval_rev_a_,
      repl._replText_a2_,
      repl._ranval_a_,
      repl._text_a2_,
    );
    assertEquals(bufr.getTextA(), text_a);
    assertEquals(repl._ranval_a_, ranval_a);
    assertEquals(repl._text_a2_, text_a2);

    repl._test_(
      repl._ranval_a_,
      repl._text_a2_,
      repl._ranval_rev_a_,
      repl._replText_a2_,
    );
    assertEquals(bufr.getTextA(), text_1_a);
    assertEquals(repl._ranval_rev_a_, ranval_rev_a);
    assertEquals(repl._replText_a2_, replText_a2);
  });
});
/*80--------------------------------------------------------------------------*/
