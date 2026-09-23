/** 80**************************************************************************
 * @module lib/util/SortedSet
 * @license MIT
 ******************************************************************************/

import { INOUT } from "../../preNs.ts";
import type { id_t, uint } from "../alias.ts";
import "../jslang.ts";
import { assert, fail } from "../util.ts";
/*80--------------------------------------------------------------------------*/

export type Cf<T> = (a: T, b: T) => boolean;

//kkkk SortedSet: consider using B-tree, ref. https://youtu.be/K1a2Bk8NrYQ
/**
 * primaryconst: const exclude `#sorted`, `#tmp_a`, element order
 */
export class SortedSet<T> {
  static #ID = 0 as id_t;
  readonly id = ++SortedSet.#ID as id_t;
  /** @final */
  get class_id() {
    return `${this.constructor.name}_${this.id}`;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  #less: Cf<T>;
  setLess(_x: Cf<T>): this {
    if (_x === this.#less) return this;

    this.#less = _x;
    this.#sorted = false;
    return this;
  }

  /* ary */
  readonly ary: T[];

  get length() {
    return this.ary.length;
  }
  /** @const @param _x */
  set length(_x: uint) {
    this.ary.length = _x;
  }

  get empty(): boolean {
    return !this.ary.length;
  }
  /* ~ */

  /** Without `#eq`, equality is `!#less(a,b) && !#less(b,a)` */
  #eq: Cf<T> | undefined;

  #tmp_a: (T | undefined)[] | undefined;
  protected get tmp_a$() {
    this.#tmp_a ??= [];
    return this.#tmp_a;
  }
  get _tmp_a_() {
    return this.#tmp_a;
  }

  /**
   * `[ 0, this.length ]`\
   * Set by `includes()`, `indexOf()`
   */
  #index: uint = 0;
  // get _index_() {
  //   return this.#index;
  // }

  #sorted: boolean;
  get sorted() {
    return this.#sorted;
  }
  messUp(): this {
    this.#sorted = false;
    return this;
  }

  /**
   * @const @param less_x
   * @move @const @param vals_x Not handled yet. May be `resort()`ed later.
   * @const @param eq_x
   */
  constructor(less_x: Cf<T>, vals_x?: T[], eq_x?: Cf<T>) {
    this.#less = less_x;
    this.ary = vals_x ?? [];
    this.#sorted = this.ary.length ? false : true;
    this.#eq = eq_x;
  }

  reset_SortedSet(): this {
    this.ary.length = 0;
    this.#index = 0; //!
    this.#tmp_a = undefined;
    this.#sorted = true;
    return this;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /**
   * If `#sorted`, set `#index`
   * @headconst @param val_x
   */
  includes(val_x: T): boolean {
    return this.#sorted
      ? this.#find_j(val_x, 0, this.ary.length)
      : this.ary.includes(val_x);
  }

  /**
   * If `#sorted`, set `#index`
   * @headconst @param val_x
   */
  indexOf(val_x: T): uint | -1 {
    return this.#sorted
      ? this.includes(val_x) ? this.#index : -1
      : this.ary.indexOf(val_x);
  }

  sort(): T[] {
    fail("Disabled");
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  // more_or_equal_( a, b ) { return this.#less( b, a ); }
  // unequal_( a, b ) { return this.#less( a, b ) || this.#less( b, a ); }
  // equal_( a, b ) { return !this.unequal_( a, b ); }
  // less_or_equal_( a, b ) { return this.#less( a, b ) || this.equal_( a, b ); }
  // more_( a, b ) { return this.less_or_equal_( b, a ); }

  /**
   * Set `#index`
   * @headconst @param val_x
   * @const @param jdx_x
   * @const @param len_x
   */
  #find_j(val_x: T, jdx_x: uint, len_x: uint): boolean {
    let found = false;
    if (len_x === 1) {
      if (this.#less(this.ary[jdx_x], val_x)) {
        this.#index = jdx_x + 1;
      } else if (this.#less(val_x, this.ary[jdx_x])) {
        this.#index = jdx_x;
      } else {
        found = this.#eq?.(val_x, this.ary[jdx_x]) ?? true;
        this.#index = found ? jdx_x : jdx_x + 1;
      }
    } else if (len_x > 1) {
      const m = Math.floor(len_x / 2);
      if (this.#less(val_x, this.ary[jdx_x + m])) {
        found = this.#find_j(val_x, jdx_x, m);
      } else if (this.#less(this.ary[jdx_x + m], val_x)) {
        found = this.#find_j(val_x, jdx_x + m, len_x - m);
      } else {
        found = this.#eq?.(val_x, this.ary[jdx_x + m]) ?? true;
        this.#index = found ? jdx_x + m : jdx_x + m + 1;
      }
    }
    return found;
  }

  /**
   * Return index of smallest one greater equal than `val_x
   * Return `-1` if `empty`, `len` if no such one
   * @headconst @param val_x
   */
  mostGE(val_x: T): uint | -1 {
    /*#static*/ if (INOUT) {
      assert(this.#sorted, "This method is callable only in the sorted state.");
    }
    if (this.empty) return -1;

    let ret = this.indexOf(val_x);
    if (ret < 0) {
      if (this.#index === this.length) {
        ret = this.#index;
      } else if (this.#less(this.ary[this.#index], val_x)) {
        ret = this.#index + 1;
      } else {
        ret = this.#index;
      }
    }
    return ret;
  }
  // /**
  //  * Return index of greatest one smaller equal than `val_x
  //  * Return `-1` if no such one
  //  * @headconst @param val_x
  //  */
  // mostSE( val_x:T ):int
  // {
  //   if( this.empty ) return -1

  //   let ret = this.indexOf( val_x );
  //   if( ret < 0 )
  //   {
  //     if( this.#index === this.length ) ret = this.#index - 1;
  //     else if( this.#less( val_x, this.ary$[this.#index] ) )
  //          ret = this.#index - 1;
  //     else ret = this.#index;
  //   }
  //   return ret;
  // }

  /**
   * Newly add, keeping sorted\
   * `in( this.#sorted)`
   * @headconst @param val_x
   * @return Return the index of the added;
   *    if already exist, return `-1`
   */
  add(val_x: T): uint | -1 {
    const had = this.includes(val_x);
    if (!had) {
      this.ary.splice(this.#index, 0, val_x);
    }
    return had ? -1 : this.#index;
  }
  /** @headborrow @headconst @param vals_x */
  add_O(vals_x?: T[]): this {
    if (vals_x === undefined) return this;

    /*#static*/ if (INOUT) {
      assert(this.#sorted, "This method is callable only in the sorted state.");
    }
    for (const v of vals_x) this.add(v);
    return this;
  }

  /**
   * `in( this.#sorted)`
   * @headconst @param val_x
   * @return Return the index of the removed;
   *    if not exist, return `-1`
   */
  rmv(val_x: T): uint | -1 {
    const has = this.includes(val_x);
    if (has) {
      this.ary.splice(this.#index, 1);
    }
    return has ? this.#index : -1;
  }
  /** @headborrow @headconst @param vals_x */
  rmv_O(vals_x?: T[]): void {
    if (vals_x === undefined) return;

    /*#static*/ if (INOUT) {
      assert(this.#sorted, "This method is callable only in the sorted state.");
    }
    for (const val of vals_x) this.rmv(val);
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  /**
   * [Merge sort](https://youtu.be/frxO8pIyVE0?t=927)\
   * Sort [idx_x, idx_x + len_x) and [idx_x + len_x, idx_x + 2 * len_x) in
   * place\
   * `in( idx_x + len_x < this.length)`
   * @primaryconst
   * @const @param idx_x
   * @const @param len_x 4, 8, ...
   */
  #sortInPlace(idx_x: uint, len_x: uint) {
    const k_0 = idx_x + len_x,
      k_1 = Math.min(idx_x + 2 * len_x, this.length);
    let j_0 = idx_x,
      j_1 = k_0;
    let i_ = idx_x;
    const tmp_a_ = this.tmp_a$;
    while (j_0 < k_0 && j_1 < k_1) {
      if (this.#less(this.ary[j_1], this.ary[j_0])) {
        tmp_a_[i_] = this.ary[j_1++];
      } else {
        tmp_a_[i_] = this.ary[j_0++];
      }
      i_ += 1;
    }
    if (j_0 >= k_0) {
      /*#static*/ if (INOUT) {
        assert(k_1 - i_ === k_1 - j_1);
      }
    } else {
      /*#static*/ if (INOUT) {
        assert(k_1 - i_ === k_0 - j_0);
      }
      for (let iSrc = j_0, iTgt = i_; iSrc < k_0; ++iSrc, ++iTgt) {
        this.ary[iTgt] = this.ary[iSrc];
      }
    }
    for (let iSrc = idx_x; iSrc < i_; ++iSrc) {
      this.ary[iSrc] = tmp_a_[iSrc]!;
      tmp_a_[iSrc] = undefined;
    }
  }
  /**
   * `in( idx_x + 1 < this.length)`
   * @primaryconst
   * @const @param idx_x
   */
  #sortInPlace_1(idx_x: uint) {
    if (this.#less(this.ary[idx_x + 1], this.ary[idx_x])) {
      this.swap(idx_x + 1, idx_x);
    }
  }
  /**
   * `in( idx_x + 2 < this.length)`
   * @primaryconst
   * @const @param idx_x
   */
  #sortInPlace_2(idx_x: uint) {
    if (this.#less(this.ary[idx_x + 2], this.ary[idx_x])) {
      this.swap(idx_x + 2, idx_x + 1).swap(idx_x + 1, idx_x);
      if (idx_x + 3 < this.length) {
        if (this.#less(this.ary[idx_x + 3], this.ary[idx_x + 1])) {
          this.swap(idx_x + 3, idx_x + 2).swap(idx_x + 2, idx_x + 1);
        } else if (this.#less(this.ary[idx_x + 3], this.ary[idx_x + 2])) {
          this.swap(idx_x + 3, idx_x + 2);
        }
      }
    } else {
      if (this.#less(this.ary[idx_x + 2], this.ary[idx_x + 1])) {
        this.swap(idx_x + 2, idx_x + 1);
        if (idx_x + 3 < this.length) {
          if (this.#less(this.ary[idx_x + 3], this.ary[idx_x + 2])) {
            this.swap(idx_x + 3, idx_x + 2);
          }
        }
      }
    }
  }
  /** @primaryconst */
  resort(): this {
    if (this.#sorted) return this;

    const LEN = this.length;
    for (let e = 1; 2 ** (e - 1) <= LEN; ++e) {
      const u_ = 2 ** e; // unit
      const l_ = 2 ** (e - 1); // len_x
      const n_ = Math.floor(LEN / u_);
      const r_ = LEN - u_ * n_; // remainder
      for (let i = 0; i < n_; ++i) {
        if (l_ === 1) this.#sortInPlace_1(u_ * i);
        else if (l_ === 2) this.#sortInPlace_2(u_ * i);
        else this.#sortInPlace(u_ * i, l_);
      }
      if (r_ > l_) {
        if (l_ === 1) this.#sortInPlace_1(u_ * n_);
        else if (l_ === 2) this.#sortInPlace_2(u_ * n_);
        else this.#sortInPlace(u_ * n_, l_);
      }
    }
    this.#sorted = true;
    return this;
  }
  /*64||||||||||||||||||||||||||||||||||||||||||||||||||||||||||*/

  // toString() {
  //   const str_a: string[] = [];
  //   for (const val of this.ary$) {
  //     str_a.push(String(val));
  //   }
  //   return `[ ${str_a.join(", ")} ]`;
  // }

  toJSON(): T[] {
    return this.ary;
  }
}

export interface SortedSet<T> extends Omit<Array<T>, number> {}

const arrayKey_a_: (string | symbol)[] = [
  ...Object.getOwnPropertyNames(Array.prototype),
  ...Object.getOwnPropertySymbols(Array.prototype),
];
const impledMethod_a_: (string | symbol)[] = ["includes", "indexOf"];
for (const key of arrayKey_a_) {
  if (key === "constructor" || impledMethod_a_.includes(key)) continue;

  const arrayMethod = (Array.prototype as any)[key];
  if (typeof arrayMethod !== "function") continue;

  (SortedSet.prototype as any)[key] = function (
    this: SortedSet<unknown>,
    ...args: unknown[]
  ) {
    return arrayMethod.call(this.ary, ...args);
  };
}
/*64----------------------------------------------------------*/

export class SortedIdo<T extends { id: id_t } = { id: id_t }>
  extends SortedSet<T> {
  protected static less_id$: Cf<{ id: id_t }> = (a, b) => a.id < b.id;

  /** @move @const @param vals_x */
  constructor(vals_x?: T[]) {
    super(SortedIdo.less_id$, vals_x);
  }
}
/*80--------------------------------------------------------------------------*/
