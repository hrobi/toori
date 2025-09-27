import { NextMatch } from "./types";

export const just =
  <A>(value: A) =>
  <Arg>(arg: Arg) =>
    value;

export const justThrow =
  <Err>(error: Err) =>
  <Arg, Res>(arg: Arg): Res => {
    throw error;
  };

export const evertUnion = <
  DiscriminatedUnion extends Record<DiscriminatorKey, number | string | symbol>,
  DiscriminatorKey extends keyof DiscriminatedUnion
>(
  discriminatedUnion: DiscriminatedUnion,
  discriminatorKey: DiscriminatorKey
): {
  [Discriminator in DiscriminatedUnion[DiscriminatorKey]]: Extract<
    DiscriminatedUnion,
    Record<DiscriminatorKey, Discriminator>
  >;
  // @ts-ignore
} => ({ [discriminatedUnion[discriminatorKey]]: discriminatedUnion });

export const matchReturnType =
  <Res>() =>
  <Rec>(match: NextMatch<Rec, Res>) =>
    match;
