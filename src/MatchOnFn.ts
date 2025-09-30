import { AnyRecord } from "./internal/Types";
import { createTaggedMatcherConstrainedFlow } from "./TaggedMatcherConstrainedFlow";

export const matchOn = <Rec extends AnyRecord, Tag extends keyof Rec>(
  input: Rec,
  tag: Tag
) => createTaggedMatcherConstrainedFlow<Rec, Tag>(input, tag);
