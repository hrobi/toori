import { createMatchPipe } from "../core/match-pipe";
import { evertUnion } from "../core/utils";
export const matchOn = (discriminatedUnion, discriminatorKey) => createMatchPipe(evertUnion(discriminatedUnion, discriminatorKey), discriminatedUnion[discriminatorKey]);
