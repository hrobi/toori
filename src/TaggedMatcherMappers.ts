import { AnyRecord } from "./internal/Types";
import { primitiveArrayIncludes } from "./internal/Utils";
import { TaggedMatcher } from "./TaggedMatcher";

const deriveCases = <
  Rec extends AnyRecord,
  Tag extends keyof Rec,
  const Cases extends Rec[Tag],
  Ret,
  Fn extends (
    arg: Extract<Rec, Record<Tag, Cases>>
  ) => [Ret] extends [never] ? unknown : Ret
>(
  previousMatcher: TaggedMatcher<Rec, Ret, Tag>,
  cases: Cases[],
  produce: Fn
): TaggedMatcher<
  Exclude<Rec, Record<Tag, Cases>>,
  [Ret] extends [never] ? ReturnType<Fn> : Ret,
  Tag
> => {
  if (
    previousMatcher.matchResult.match ||
    !primitiveArrayIncludes(cases, previousMatcher.input[previousMatcher.tag])
  ) {
    return previousMatcher as any;
  }

  return {
    input: previousMatcher.input as any,
    tag: previousMatcher.tag,
    matchResult: {
      match: true,
      output: produce(previousMatcher.input as any) as any,
    },
  };
};

export const cases =
  <
    Rec extends AnyRecord,
    Tag extends keyof Rec,
    const Cases extends Rec[Tag],
    Ret,
    Fn extends (
      arg: Extract<Rec, Record<Tag, Cases>>
    ) => [Ret] extends [never] ? unknown : Ret
  >(
    ...mapper: [
      firstCase: Cases & (string | number),
      ...restOfCases: Array<Cases & (string | number)>,
      produce: Fn
    ]
  ) =>
  (
    previousMatcher: TaggedMatcher<Rec, Ret, Tag>
  ): TaggedMatcher<
    Exclude<Rec, Record<Tag, Cases>>,
    [Ret] extends [never] ? ReturnType<Fn> : Ret,
    Tag
  > => {
    const cases = mapper.slice(0, -1) as Cases[];
    const produce = mapper[mapper.length - 1] as Fn;
    return deriveCases(previousMatcher, cases, produce);
  };

export const deriveTotal = <
  Rec extends AnyRecord,
  Tag extends keyof Rec,
  Ret,
  MatcherRecord extends {
    [Case in Rec[Tag]]: (
      arg: Extract<Rec, Record<Tag, Case>>
    ) => [Ret] extends [never] ? unknown : Ret;
  }
>(
  previousMatcher: TaggedMatcher<Rec, Ret, Tag>,
  matcherRecord: MatcherRecord
): TaggedMatcher<
  never,
  [Ret] extends [never] ? ReturnType<MatcherRecord[keyof MatcherRecord]> : Ret,
  Tag
> => {
  if (
    previousMatcher.matchResult.match ||
    !Object.keys(matcherRecord).includes(previousMatcher.input[previousMatcher.tag])
  ) {
    return previousMatcher as any;
  }

  return {
    input: previousMatcher.input as never,
    tag: previousMatcher.tag,
    matchResult: {
      match: true,
      output: matcherRecord[previousMatcher.input[previousMatcher.tag]](
        previousMatcher.input as any
      ) as any,
    },
  };
};

export const total =
  <
    Rec extends AnyRecord,
    Tag extends keyof Rec,
    Ret,
    MatcherRecord extends {
      [Case in Rec[Tag]]: (
        arg: Extract<Rec, Record<Tag, Case>>
      ) => [Ret] extends [never] ? unknown : Ret;
    }
  >(
    matcherRecord: MatcherRecord
  ) =>
  (previousMatcher: TaggedMatcher<Rec, Ret, Tag>) =>
    deriveTotal(previousMatcher, matcherRecord);

export const deriveOtherwise = <
  Input,
  Tag extends keyof Input,
  Ret,
  Fn extends (arg: Input) => [Ret] extends [never] ? unknown : Ret
>(
  previousMatcher: TaggedMatcher<Input, Ret, Tag>,
  produce: Fn
): TaggedMatcher<never, [Ret] extends [never] ? ReturnType<Fn> : Ret, Tag> => {
  if (previousMatcher.matchResult.match) {
    return previousMatcher as any;
  }
  return {
    input: previousMatcher.input as never,
    tag: previousMatcher.tag,
    matchResult: { match: true, output: produce(previousMatcher.input) as any },
  };
};

export const otherwise =
  <
    Rec extends AnyRecord,
    Tag extends keyof Rec,
    Ret,
    Fn extends (arg: Rec) => [Ret] extends [never] ? unknown : Ret
  >(
    produce: Fn
  ) =>
  (previousMatcher: TaggedMatcher<Rec, Ret, Tag>) =>
    deriveOtherwise(previousMatcher, produce);

export const matcherReturnType =
  <Ret>() =>
  <Input, Tag>(
    previousMatcher: TaggedMatcher<Input, never, Tag>
  ): TaggedMatcher<Input, Ret, Tag> =>
    previousMatcher;

export const catchOtherwise =
  <Ret>(produce: (arg: unknown) => Ret) =>
  <Tag>(
    previousMatcher: TaggedMatcher<never, Ret, Tag>
  ): TaggedMatcher<never, Ret, Tag> => {
    if (previousMatcher.matchResult.match) {
      return previousMatcher;
    }
    return {
      input: previousMatcher.input,
      tag: previousMatcher.tag,
      matchResult: { match: true, output: produce(previousMatcher.input) },
    };
  };
