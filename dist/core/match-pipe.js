export const createMatchPipe = (record, key) => 
// @ts-ignore
(...matchers) => {
    if (matchers.length == 1 && typeof matchers[0] === "object") {
        return matchers[0][key](record[key]);
    }
    return matchers.reduce((previousMatch, currentMatcher) => currentMatcher(previousMatch), {
        rec: record,
        alreadyMatched: false,
        whichKey: key,
    }).result;
};
