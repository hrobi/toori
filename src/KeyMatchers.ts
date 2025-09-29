import type { AnyRecord } from "./internal/Types";

export interface KeyMatcher<Rec extends AnyRecord, Prod> {
  record: Rec;
  key: number | string;
  match: { status: "keyInRecord"; product: Prod } | { status: "keyNotInRecord" };
}

export class UnexpectedNonExhaustiveMatchError extends Error {
  constructor(public key: string | number) {
    super(
      `Match was non-exhaustive! Missing case for ${
        typeof key === "number" ? key : `"${key}"`
      }`
    );
  }
}
