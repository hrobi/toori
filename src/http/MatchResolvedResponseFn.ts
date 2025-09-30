import { UnexpectedNonExhaustiveTaggedMatchError } from "../Exception";
import {
  createTaggedMatcherConstrainedFlow,
  TaggedMatcherConstrainedFlow,
} from "../TaggedMatcherConstrainedFlow";
import { UnexpectedHttpStatusError } from "./Exception";
import { responseStatusMap, ResponseStatusMap } from "./StatusMaps";

export const matchResolvedResponse =
  <ResponseMap extends { [key in number]: unknown }>({
    response,
    data,
    error,
  }: {
    response: Response;
    data?: unknown;
    error?: unknown;
  }): TaggedMatcherConstrainedFlow<
    {
      [StatusCode in keyof ResponseMap]: {
        status: [StatusCode] extends [keyof ResponseStatusMap]
          ? ResponseStatusMap[StatusCode]
          : never;
        body: ResponseMap[StatusCode];
        response: Response;
      };
    }[keyof ResponseMap],
    "status"
  > =>
  (...args: any) => {
    try {
      return createTaggedMatcherConstrainedFlow(
        {
          status: responseStatusMap[response.status as keyof ResponseStatusMap],
          body: response.status >= 200 && response.status < 300 ? data : error,
          response,
        } as any,
        "status"
      )(...(args as [any]));
    } catch (ex) {
      if (ex instanceof UnexpectedNonExhaustiveTaggedMatchError) {
        throw new UnexpectedHttpStatusError(response);
      }
      throw ex;
    }
  };
