export type MatchResult<Output> = { match: true; output: Output } | { match: false };

export interface TaggedMatcher<Input, Output, Tag> {
  input: Input;
  matchResult: MatchResult<Output>;
  tag: Tag;
}

export const taggedMatcher = <Input, Tag extends keyof Input>(
  input: Input,
  tag: Tag
): TaggedMatcher<Input, never, Tag> => ({ input, tag, matchResult: { match: false } });
