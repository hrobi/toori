import { TaggedMatcher } from "../TaggedMatcher";
import {
  clientErrorStatuses,
  errorStatuses,
  informationalStatuses,
  ResponseStatus,
  serverErrorStatuses,
  successStatuses,
} from "./StatusMaps";

export type ResolvedResponseMapperFn<MatchableStatus extends ResponseStatus> = <
  Rec extends { status: ResponseStatus },
  Ret,
  Fn extends (
    arg: Extract<Rec, { status: MatchableStatus }>
  ) => [Ret] extends [never] ? unknown : Ret
>(
  produce: Fn
) => (
  previousMatcher: TaggedMatcher<Rec, Ret, "status">
) => TaggedMatcher<
  Exclude<Rec, { status: MatchableStatus }>,
  [Ret] extends [never] ? ReturnType<Fn> : Ret,
  "status"
>;

export const deriveMatchingResolvedResponseByStatuses =
  <Status extends ResponseStatus>(statuses: Status[]): ResolvedResponseMapperFn<Status> =>
  (produce) =>
  (previousMatcher) => {
    if (
      previousMatcher.matchResult.match ||
      !Object.values(statuses).includes(previousMatcher.input["status"] as any)
    ) {
      return previousMatcher as any;
    }

    return {
      input: previousMatcher.input as any,
      tag: "status",
      matchResult: { match: true, output: produce(previousMatcher.input as any) as any },
    };
  };

export const matchingInformationalResponse =
  deriveMatchingResolvedResponseByStatuses(informationalStatuses);

export const matchingOkResponse =
  deriveMatchingResolvedResponseByStatuses(successStatuses);

export const catchClientErrorResponse =
  deriveMatchingResolvedResponseByStatuses(clientErrorStatuses);

export const catchServerErrorResponse =
  deriveMatchingResolvedResponseByStatuses(serverErrorStatuses);

export const catchErrorResponse = deriveMatchingResolvedResponseByStatuses(errorStatuses);
