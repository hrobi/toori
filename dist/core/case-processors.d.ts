import { NextMatch } from "./types";
export type CasesFn = <Rec, const Cases extends keyof Rec, Res>(...matcher: [firstCase: Cases, ...cases: Cases[], produce: (arg: Rec[Cases]) => Res]) => (matcher: NextMatch<Rec, Res>) => NextMatch<{
    [RemKey in Exclude<keyof Rec, Cases>]: Rec[RemKey];
}, Res>;
export declare const cases: CasesFn;
export type TotalFn = <Rec, CompleteMatcher extends {
    [Key in keyof Rec]: (arg: Rec[Key]) => unknown;
}>(completeMatcher: CompleteMatcher) => (matcher: NextMatch<Rec, ReturnType<CompleteMatcher[keyof Rec]>>) => NextMatch<{}, ReturnType<CompleteMatcher[keyof Rec]>>;
export declare const total: TotalFn;
export type OtherwiseFn = <Rec, Res>(produce: (arg: Rec[keyof Rec]) => Res) => (matcher: NextMatch<Rec, Res>) => NextMatch<{}, Res>;
export declare const otherwise: OtherwiseFn;
