// @ts-ignore
export const cases = (...args) => 
// @ts-ignore
(matcher) => {
    if (matcher.alreadyMatched) {
        return matcher;
    }
    const cases = args.slice(0, -1);
    const produce = args[args.length - 1];
    // @ts-ignore
    if (cases.includes(matcher.whichKey)) {
        // @ts-ignore
        return {
            ...matcher,
            // @ts-ignore
            result: produce(matcher.rec[matcher.whichKey]),
            alreadyMatched: true,
        };
    }
    return matcher;
};
// @ts-ignore
export const total = (completeMatcher) => (matcher) => {
    if (matcher.alreadyMatched) {
        return matcher;
    }
    // @ts-ignore
    if (Object.keys(completeMatcher).includes(matcher.whichKey)) {
        return {
            ...matcher,
            // @ts-ignore
            result: completeMatcher[matcher.whichKey](matcher.rec[matcher.whichKey]),
            alreadyMatched: true,
        };
    }
    return matcher;
};
// @ts-ignore
export const otherwise = (produce) => (matcher) => {
    if (matcher.alreadyMatched) {
        return matcher;
    }
    return {
        ...matcher,
        alreadyMatched: true,
        result: produce(matcher.rec[matcher.whichKey]),
    };
};
