export class UnexpectedHttpStatusError extends Error {
  constructor(public response: Response) {
    super(
      `${response.url} responsed with status ${response.status} ${response.statusText}, and this status response wasn't handled`
    );
  }
}
