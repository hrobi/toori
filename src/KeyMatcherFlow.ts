import type { AnyRecord } from "./internal/Types";
import type { KeyMatcher } from "./KeyMatchers";

export interface KeyMatcherConstrainedFlow<
  Rec extends AnyRecord,
  FirstKeyMatcher extends KeyMatcher<Rec, never>
> {
  <Ret = never>(
    mapKeyMatcher: (_: KeyMatcher<Rec, never>) => KeyMatcher<never, Ret>
  ): Ret;
  <A = never, Ret = never>(
    transformKeyMatcher: (_: FirstKeyMatcher) => A,
    mapToFinalKeyMatcher: (_: A) => KeyMatcher<never, Ret>
  ): Ret;
  <A = never, B = never, Ret = never>(
    transformKeyMatcher: (_: FirstKeyMatcher) => A,
    ab: (_: A) => B,
    mapToFinalKeyMatcher: (_: B) => KeyMatcher<never, Ret>
  ): Ret;
  <A = never, B = never, C = never, Ret = never>(
    transformKeyMatcher: (_: FirstKeyMatcher) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    mapToFinalKeyMatcher: (_: C) => KeyMatcher<never, Ret>
  ): Ret;
  <A = never, B = never, C = never, D = never, Ret = never>(
    transformKeyMatcher: (_: FirstKeyMatcher) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    mapToFinalKeyMatcher: (_: D) => KeyMatcher<never, Ret>
  ): Ret;
  <A = never, B = never, C = never, D = never, E = never, Ret = never>(
    transformKeyMatcher: (_: FirstKeyMatcher) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    mapToFinalKeyMatcher: (_: E) => KeyMatcher<never, Ret>
  ): Ret;
  <A = never, B = never, C = never, D = never, E = never, F = never, Ret = never>(
    transformKeyMatcher: (_: FirstKeyMatcher) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    mapToFinalKeyMatcher: (_: F) => KeyMatcher<never, Ret>
  ): Ret;
}

export const createKeyMatcherConstrainedFlow =
  <Rec extends AnyRecord, Key extends keyof Rec>(
    record: Rec,
    key: Key
  ): KeyMatcherConstrainedFlow<Rec, KeyMatcher<Rec, never>> =>
  (...funcs: ((...args: any) => any)[]) => {
    const match = funcs.reduce((previousResult, currentFn) => currentFn(previousResult), {
      key,
      record,
      match: { status: "keyNotInRecord" },
    } as KeyMatcher<Rec, never>).match;
    switch (match.status) {
      case "keyInRecord":
        return match.product;
      default:
        throw new Error(
          "FATAL: KeyMatchConstrainedFlow is supposed to be exhaustive, yet no match was made previously."
        );
    }
  };
