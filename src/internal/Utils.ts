import type { KeyMatcher } from "../KeyMatchers";
import type { AnyRecord } from "./Types";

export const primitiveArrayIncludes = <V extends number | string | boolean | symbol>(
  primitiveArray: (number | string | boolean | symbol)[],
  value: number | string | boolean | symbol
) => primitiveArray.includes(value);

export const getAnyFromAllegedRecord = (record: unknown, index: number | string) =>
  (record as Record<any, any>)[index];

export const getFromRecord = <V>(record: Record<keyof any, V>, index: number | string) =>
  record[index];

export const initKeyMatcher = <Rec extends AnyRecord, Key extends keyof Rec>(
  record: Rec,
  key: Key
): KeyMatcher<Rec, never> => ({
  key: key as number | string,
  match: { status: "keyNotInRecord" },
  record,
});

export declare const onlyDeclaredPipe: {
  <A, B>(a: A, ab: (_: A) => B): B;
  <A, B, C>(a: A, ab: (_: A) => B, bc: (_: B) => C): C;
  <A, B, C, D>(a: A, ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D): D;
};

export const evertUnion = <
  DiscriminatedUnion extends Record<DiscriminatorKey, string | number>,
  DiscriminatorKey extends keyof DiscriminatedUnion
>(
  discriminatedUnion: DiscriminatedUnion,
  discriminatorKey: DiscriminatorKey
): {
  [Discriminator in DiscriminatedUnion[DiscriminatorKey]]: Extract<
    DiscriminatedUnion,
    Record<DiscriminatorKey, Discriminator>
  >;
} => ({ [discriminatedUnion[discriminatorKey]]: discriminatedUnion } as any);
