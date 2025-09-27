import { NextMatch } from "./types";
export declare const just: <A>(value: A) => <Arg>(arg: Arg) => A;
export declare const justThrow: <Err>(error: Err) => <Arg, Res>(arg: Arg) => Res;
export declare const evertUnion: <DiscriminatedUnion extends Record<DiscriminatorKey, number | string | symbol>, DiscriminatorKey extends keyof DiscriminatedUnion>(discriminatedUnion: DiscriminatedUnion, discriminatorKey: DiscriminatorKey) => { [Discriminator in DiscriminatedUnion[DiscriminatorKey]]: Extract<DiscriminatedUnion, Record<DiscriminatorKey, Discriminator>>; };
export declare const matchReturnType: <Res>() => <Rec>(match: NextMatch<Rec, Res>) => NextMatch<Rec, Res>;
