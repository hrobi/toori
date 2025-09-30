import { UnexpectedNonExhaustiveTaggedMatchError } from "./Exception";
import { AnyRecord } from "./internal/Types";
import { TaggedMatcher } from "./TaggedMatcher";

export interface TaggedMatcherConstrainedFlow<
  Input extends AnyRecord,
  Tag extends keyof Input
> {
  <Ret = never>(
    mapMatcher: (_: TaggedMatcher<Input, never, Tag>) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
  <A = never, Ret = never>(
    transformMatcher: (_: TaggedMatcher<Input, never, Tag>) => A,
    mapToFinalMatcher: (_: A) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
  <A = never, B = never, Ret = never>(
    transformMatcher: (_: TaggedMatcher<Input, never, Tag>) => A,
    ab: (_: A) => B,
    mapToFinalMatcher: (_: B) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
  <A = never, B = never, C = never, Ret = never>(
    transformMatcher: (_: TaggedMatcher<Input, never, Tag>) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    mapToFinalMatcher: (_: C) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
  <A = never, B = never, C = never, D = never, Ret = never>(
    transformMatcher: (_: TaggedMatcher<Input, never, Tag>) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    mapToFinalMatcher: (_: D) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
  <A = never, B = never, C = never, D = never, E = never, Ret = never>(
    transformMatcher: (_: TaggedMatcher<Input, never, Tag>) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    mapToFinalMatcher: (_: E) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
  <A = never, B = never, C = never, D = never, E = never, F = never, Ret = never>(
    transformMatcher: (_: TaggedMatcher<Input, never, Tag>) => A,
    ab: (_: A) => B,
    bc: (_: B) => C,
    cd: (_: C) => D,
    de: (_: D) => E,
    ef: (_: E) => F,
    mapToFinalMatcher: (_: F) => TaggedMatcher<never, Ret, Tag>
  ): Ret;
}

export const createTaggedMatcherConstrainedFlow =
  <Rec extends AnyRecord, Tag extends keyof Rec>(
    input: Rec,
    tag: Tag
  ): TaggedMatcherConstrainedFlow<Rec, Tag> =>
  (...funcs: ((...args: any) => any)[]) => {
    const { matchResult, input: endInput } = funcs.reduce(
      (previousResult, currentFn) => currentFn(previousResult),
      {
        tag,
        input,
        matchResult: { match: false },
      } as TaggedMatcher<Rec, any, Tag>
    );
    if (matchResult.match) {
      return matchResult.output;
    }
    throw new UnexpectedNonExhaustiveTaggedMatchError(endInput[tag]);
  };
