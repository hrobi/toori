import type { AnyRecord } from "./internal/Types";

export interface KeyMatcher<Rec extends AnyRecord, Prod> {
  record: Rec;
  key: number | string;
  match: { status: "keyInRecord"; product: Prod } | { status: "keyNotInRecord" };
}
