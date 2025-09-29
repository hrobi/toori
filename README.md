# Toori

This library aims to give the user extensible exhaustive pattern matching on discriminated unions, http responses, and much more.

## Example #1

```ts
type PayingMethod =
  | { by: "card"; pan: number; cvc: number; name: string; exp: string }
  | { by: "transfer"; accountNumber: string; reference: string }
  | { by: "presence"; location: string };
```

### Without toori

```tsx
paymentMethod.by === "card" ? (
  <BankCardDetails
    pan={paymentMethod.pan}
    cvc={paymentMethod.cvc}
    name={paymentMethod.name}
    exp={paymentMethod.exp}
  />
) : paymentMethod.by === "transfer" ? (
  navigateToTransfer({
    accountNumber: paymentMethod.accountNumber,
    reference: paymentMethod.reference,
  })
) : paymentMethod.by === "presence" ? (
  <NavigatedMap location={paymentMethod.location} />
) : null;
```

### With toori

```tsx
matchOn(paymentMethod,"by")({
  card: ({ pan, cvc, name, exp }) => (
    <BankCardDetails pan={pan} cvc={cvc} name={name} exp={exp} />
  ),
  transfer: ({ accountNumber, reference }) =>
    navigateToTransfer({
      accountNumber,
      reference,
    }),
  presence: ({ location }) => <NavigatedMap location={location} />,
});
```

## Example #2: HTTP Response

```ts
type UpdateUserProfileErrors = {
  /**
   * request body is incorrect
   */
  400: Status400Response;
  /**
   * user must be logged in to modify the profile
   */
  401: unknown;
  /**
   * user is not authorized to modify this profile!
   */
  403: unknown;
};

type UpdateUserProfileResponses = {
  /**
   * profile modified successfully
   */
  204: void;
};

const { error, response, data }: { error: unknown; data: never; response: HttpResponse } =
  await updateUserProfile({
    path: { username: currentUser.username },
    body: rawFormData,
  });
```

### Without toori

```ts
(response.status === 401 || response.status === 403) ? (
    throw unexpectedNoAuthError(response.status);
) : response.status === 400 ? (() => {
    const violations = (error as UpdateUserProfileErrors[400]).violations;
    return {
        state: { status: "requestBodyError", errors: violations },
        data: rawFormData
    };
})() : response.status === 204 ? (() => {
    revalidateTag("getUserProfile");
    return { state: { status: "ok" }, data: rawFormData };
})() : throw new Error("status is checked exhaustively");
```

### With toori

```ts
return matchHttpResponse<UpdateUserProfileErrors & UpdateUserProfileResponses>({
  error,
  data,
  response,
})(
  matcherReturnType<UpdateUserProfileActionState>(),
  cases(401, 403, ({ response: { status } }) => {
    throw unexpectedNoAuthError(status);
  }),
  total({
    400: ({ body: { violations } }) => ({
      state: { status: "requestBodyError", errors: violations },
      data: rawFormData,
    }),
    204: () => {
      revalidateTag("getUserProfile");
      return { state: { status: "ok" }, data: rawFormData };
    },
  })
);
```
