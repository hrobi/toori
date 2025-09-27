import { NextMatch } from "./types";

export interface MatchPipeFn<Rec> {
  <Res>(
    _:
      | ((matcher: NextMatch<Rec, Res>) => NextMatch<{}, Res>)
      | { [Key in keyof Rec]: (arg: Rec[Key]) => Res }
  ): Res;
  <A, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    a_: (a: A) => NextMatch<{}, Res>
  ): Res;
  <A, B, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    b_: (b: B) => NextMatch<{}, Res>
  ): Res;
  <A, B, C, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    c_: (c: C) => NextMatch<{}, Res>
  ): Res;
  <A, B, C, D, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    d_: (d: D) => NextMatch<{}, Res>
  ): Res;
  <A, B, C, D, E, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    e_: (c: E) => NextMatch<{}, Res>
  ): Res;
  <A, B, C, D, E, F, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    f_: (c: F) => NextMatch<{}, Res>
  ): Res;
  <A, B, C, D, E, F, G, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    g_: (g: G) => NextMatch<{}, Res>
  ): Res;
  <A, B, C, D, E, F, G, H, Res>(
    _a: (matcher: NextMatch<Rec, Res>) => A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    h_: (h: H) => NextMatch<{}, Res>
  ): Res;
}

export const createMatchPipe: <Rec>(record: Rec, key: keyof Rec) => MatchPipeFn<Rec> =
  (record, key) =>
  // @ts-ignore
  (...matchers) => {
    if (matchers.length == 1 && typeof matchers[0] === "object") {
      return matchers[0][key](record[key]);
    }
    return matchers.reduce(
      (previousMatch, currentMatcher) => currentMatcher(previousMatch),
      {
        rec: record,
        alreadyMatched: false,
        whichKey: key,
      }
    ).result;
  };
