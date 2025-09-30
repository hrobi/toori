export const primitiveArrayIncludes = <V extends number | string | boolean | symbol>(
  primitiveArray: (number | string | boolean | symbol)[],
  value: number | string | boolean | symbol
) => primitiveArray.includes(value);

export const getAnyFromAllegedRecord = (record: unknown, index: number | string) =>
  (record as Record<any, any>)[index];

export const getFromRecord = <V>(record: Record<keyof any, V>, index: number | string) =>
  record[index];

export declare const onlyDeclaredPipe: {
  <A, B>(a: A, ab: (_: A) => B): B;
  <A, B, C>(a: A, ab: (_: A) => B, bc: (_: B) => C): C;
  <A, B, C, D>(a: A, ab: (_: A) => B, bc: (_: B) => C, cd: (_: C) => D): D;
};
