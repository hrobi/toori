import { createMatchPipe } from "../core/match-pipe";
export const matchHttpResponse = ({ data, error, response, }) => createMatchPipe({
    [response.status]: {
        body: response.status >= 200 && response.status < 300 ? data : error,
        response,
    },
}, response.status);
