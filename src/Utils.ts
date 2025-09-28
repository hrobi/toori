export const just =
  <V>(value: V) =>
  <Arg>(arg: Arg) =>
    value;
