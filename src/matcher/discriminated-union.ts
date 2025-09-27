import { createMatchPipe } from "../core/match-pipe";
import { evertUnion } from "../core/utils";

export const matchOn = <
  DiscriminatedUnion extends Record<DiscriminatorKey, string | number | symbol>,
  DiscriminatorKey extends keyof DiscriminatedUnion
>(
  discriminatedUnion: DiscriminatedUnion,
  discriminatorKey: DiscriminatorKey
) =>
  createMatchPipe(
    evertUnion(discriminatedUnion, discriminatorKey),
    discriminatedUnion[discriminatorKey]
  );
