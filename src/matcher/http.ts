import { createMatchPipe } from "../core/match-pipe";

export const matchHttpResponse = <ResponseByStatusMap extends { [statusCode: number]: unknown }>({
  data,
  error,
  response,
}: {
  data: unknown;
  error: unknown;
  response: Response;
}) =>
  createMatchPipe(
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
