export const just = (value) => (arg) => value;
export const justThrow = (error) => (arg) => {
    throw error;
};
export const evertUnion = (discriminatedUnion, discriminatorKey) => ({ [discriminatedUnion[discriminatorKey]]: discriminatedUnion });
export const matchReturnType = () => (match) => match;
