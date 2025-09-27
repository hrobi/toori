export interface NextMatch<Rec, Res> {
  rec: Rec;
  whichKey: keyof Rec;
  alreadyMatched: boolean;
  result: Res;
}
