import { NextMatch } from "./types";

export type CasesFn = <Rec, const Cases extends keyof Rec, Res>(
  ...matcher: [firstCase: Cases, ...cases: Cases[], produce: (arg: Rec[Cases]) => Res]
) => (
  matcher: NextMatch<Rec, Res>
) => NextMatch<{ [RemKey in Exclude<keyof Rec, Cases>]: Rec[RemKey] }, Res>;

// @ts-ignore
export const cases: CasesFn =
  (...args) =>
  // @ts-ignore
  (matcher) => {
    if (matcher.alreadyMatched) {
      return matcher;
    }
    const cases = args.slice(0, -1);
    const produce = args[args.length - 1];
    // @ts-ignore
    if (cases.includes(matcher.whichKey)) {
      // @ts-ignore
      return {
        ...matcher,
        // @ts-ignore
        result: produce(matcher.rec[matcher.whichKey]),
        alreadyMatched: true,
      };
    }
    return matcher;
  };

export type TotalFn = <
  Rec,
  CompleteMatcher extends { [Key in keyof Rec]: (arg: Rec[Key]) => unknown }
>(
  completeMatcher: CompleteMatcher
) => (
  matcher: NextMatch<Rec, ReturnType<CompleteMatcher[keyof Rec]>>
) => NextMatch<{}, ReturnType<CompleteMatcher[keyof Rec]>>;

// @ts-ignore
export const total: TotalFn = (completeMatcher) => (matcher) => {
  if (matcher.alreadyMatched) {
    return matcher;
  }
  // @ts-ignore
  if (Object.keys(completeMatcher).includes(matcher.whichKey)) {
    return {
      ...matcher,
      // @ts-ignore
      result: completeMatcher[matcher.whichKey](matcher.rec[matcher.whichKey]),
      alreadyMatched: true,
    };
  }
  return matcher;
};

export type OtherwiseFn = <Rec, Res>(
  produce: (arg: Rec[keyof Rec]) => Res
) => (matcher: NextMatch<Rec, Res>) => NextMatch<{}, Res>;

// @ts-ignore
export const otherwise: OtherwiseFn = (produce) => (matcher) => {
  if (matcher.alreadyMatched) {
    return matcher;
  }
  return {
    ...matcher,
    alreadyMatched: true,
    result: produce(matcher.rec[matcher.whichKey]),
  };
};
