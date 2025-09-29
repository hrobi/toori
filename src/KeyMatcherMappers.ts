import type { AnyRecord } from "./internal/Types";
import { getAnyFromAllegedRecord, primitiveArrayIncludes } from "./internal/Utils";
import { UnexpectedNonExhaustiveMatchError, type KeyMatcher } from "./KeyMatchers";

/**
 * cases keymatcher mapper
 */

export const cases =
  <
    Rec extends AnyRecord,
    const Cases extends keyof Rec,
    Ret,
    Fn extends (arg: Rec[Cases]) => [Ret] extends [never] ? unknown : Ret
  >(
    ...mapper: [firstCase: Cases, ...restOfCases: Cases[], produce: Fn]
  ) =>
  (
    previousKeyMatcher: KeyMatcher<Rec, Ret>
  ): KeyMatcher<
    [keyof Omit<Rec, Cases>] extends [never] ? never : Omit<Rec, Cases>,
    [Ret] extends [never] ? ReturnType<Fn> : Ret
  > => {
    if (previousKeyMatcher.match.status === "keyInRecord") {
      return previousKeyMatcher as any;
    }

    const cases = mapper.slice(0, -1) as Cases[];
    const produce = mapper[mapper.length - 1] as Fn;

    if (primitiveArrayIncludes(cases, previousKeyMatcher.key)) {
      return {
        record: previousKeyMatcher.record as any,
        key: previousKeyMatcher.key,
        match: {
          status: "keyInRecord",
          product: produce(
            getAnyFromAllegedRecord(
              previousKeyMatcher.record,
              previousKeyMatcher.key
            ) as Rec[Cases]
          ) as [Ret] extends [never] ? ReturnType<Fn> : Ret,
        },
      };
    }

    return previousKeyMatcher as any;
  };

/**
 * total keymatcher mapper
 */

export const total =
  <
    Rec extends AnyRecord,
    Ret,
    MapperRecord extends {
      [Key in keyof Rec]: (arg: Rec[Key]) => [Ret] extends [never] ? unknown : Ret;
    }
  >(
    mapperRecord: MapperRecord
  ) =>
  (
    previousKeyMatcher: KeyMatcher<Rec, Ret>
  ): KeyMatcher<
    never,
    [Ret] extends [never] ? ReturnType<MapperRecord[keyof Rec]> : Ret
  > => {
    if (previousKeyMatcher.match.status === "keyInRecord") {
      return previousKeyMatcher as any;
    }

    if (Object.keys(mapperRecord).includes(`${previousKeyMatcher.key}`)) {
      return {
        key: previousKeyMatcher.key,
        record: previousKeyMatcher.record as never,
        match: {
          status: "keyInRecord",
          product: (
            getAnyFromAllegedRecord(mapperRecord, previousKeyMatcher.key) as unknown as (
              arg: Rec[any]
            ) => [Ret] extends [never] ? ReturnType<MapperRecord[any]> : Ret
          )(getAnyFromAllegedRecord(previousKeyMatcher.record, previousKeyMatcher.key)),
        },
      };
    }

    throw new UnexpectedNonExhaustiveMatchError(previousKeyMatcher.key);
  };

/**
 * otherwise keymatcher mapper
 */

export const otherwise =
  <
    Rec extends AnyRecord,
    Ret,
    Fn extends (arg: Rec[keyof Rec]) => [Ret] extends [never] ? unknown : Ret
  >(
    produce: Fn
  ) =>
  (
    previousKeyMatcher: KeyMatcher<Rec, Ret>
  ): KeyMatcher<never, [Ret] extends [never] ? ReturnType<Fn> : Ret> => {
    if (previousKeyMatcher.match.status === "keyInRecord") {
      return previousKeyMatcher as any;
    }

    return {
      key: previousKeyMatcher.key,
      record: previousKeyMatcher.record as never,
      match: {
        status: "keyInRecord",
        product: produce(
          getAnyFromAllegedRecord(previousKeyMatcher.record, previousKeyMatcher.key)
        ) as any,
      },
    };
  };

/**
 * constrain KeyMatcherConstrainedFlow's return type
 */

export const matcherReturnType =
  <Ret>() =>
  <Rec extends AnyRecord>(
    previousKeyMatcher: KeyMatcher<Rec, never>
  ): KeyMatcher<Rec, Ret> =>
    previousKeyMatcher;
