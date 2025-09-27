export declare const matchHttpResponse: <ResponseByStatusMap extends {
    [statusCode: number]: unknown;
}>({ data, error, response, }: {
    data: unknown;
    error: unknown;
    response: Response;
}) => import("../core/match-pipe").MatchPipeFn<{ [Status in keyof ResponseByStatusMap]: {
    body: ResponseByStatusMap[Status];
    response: Response;
}; }>;
