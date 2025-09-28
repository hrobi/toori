import { evertUnion } from "./internal/Utils";
import { createKeyMatcherConstrainedFlow } from "./KeyMatcherFlow";

/**
 * Discriminated union matchers
 */

export const matchOn = <
  DiscriminatedUnion extends Record<DiscriminatorKey, string | number>,
  DiscriminatorKey extends keyof DiscriminatedUnion
>(
  discriminatedUnion: DiscriminatedUnion,
  discriminatorKey: DiscriminatorKey
) =>
  createKeyMatcherConstrainedFlow(
    evertUnion(discriminatedUnion, discriminatorKey),
    discriminatedUnion[discriminatorKey]
  );

/**
 * HTTP response matchers
 */

export const matchHttpResponse = <
  ResponseByStatusMap extends { [statusCode: number]: unknown }
>({
  data,
  error,
  response,
}: {
  data: unknown;
  error: unknown;
  response: Response;
}) =>
  createKeyMatcherConstrainedFlow(
    {
      [response.status]: {
        body: response.status >= 200 && response.status < 300 ? data : error,
        response,
      },
    } as {
      [Status in keyof ResponseByStatusMap]: {
        body: ResponseByStatusMap[Status];
        response: Response;
      };
    },
    response.status
  );
