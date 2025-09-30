export class UnexpectedNonExhaustiveTaggedMatchError extends Error {
  constructor(public key: string | number) {
    super(
      `Match was non-exhaustive! Missing case for ${
        typeof key === "number" ? key : `"${key}"`
      }`
    );
  }
}
