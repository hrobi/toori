import { cases, just, matchOn, otherwise, total } from "../src/index";

type Wheather =
  | { type: "cloudy"; chanceOfRain: number }
  | { type: "overcast"; chanceOfRain: number }
  | { type: "sunny"; extremeHeat: boolean }
  | { type: "stormy"; speedInKilometersPerHour: number }
  | { type: "rainy"; rainLevelInMillimeters: number };

describe("matchOn wheather type", () => {
  const wheatherSituations: Wheather[] = [
    { type: "cloudy", chanceOfRain: 0.7 },
    { type: "overcast", chanceOfRain: 0.4 },
    { type: "sunny", extremeHeat: false },
    { type: "rainy", rainLevelInMillimeters: 20 },
    { type: "stormy", speedInKilometersPerHour: 45 },
    { type: "sunny", extremeHeat: true },
  ];

  const shouldIBike_total = wheatherSituations.map((wheather) =>
    matchOn(
      wheather,
      "type"
    )({
      cloudy: ({ chanceOfRain }) => chanceOfRain < 0.5,
      overcast: ({ chanceOfRain }) => chanceOfRain < 0.5,
      rainy: just(false),
      stormy: just(false),
      sunny: ({ extremeHeat }) => !extremeHeat,
    })
  );

  const shouldIBike_cases = wheatherSituations.map((wheather) =>
    matchOn(wheather, "type")(
      cases("cloudy", "overcast", ({ chanceOfRain }) => chanceOfRain < 0.5),
      cases("sunny", ({ extremeHeat }) => !extremeHeat),
      cases("rainy", "stormy", just(false))
    )
  );

  const shouldIBike_mixed = wheatherSituations.map((wheather) =>
    matchOn(wheather, "type")(
      cases("cloudy", "overcast", ({ chanceOfRain }) => chanceOfRain < 0.5),
      cases("rainy", "stormy", just(false)),
      total({
        sunny: ({ extremeHeat }) => !extremeHeat,
      })
    )
  );

  const shouldIBike_otherwise = wheatherSituations.map((wheather) =>
    matchOn(wheather, "type")(
      cases("cloudy", "overcast", ({ chanceOfRain }) => chanceOfRain < 0.5),
      cases("sunny", ({ extremeHeat }) => !extremeHeat),
      otherwise(() => false)
    )
  );

  describe("Should not bike in cloudy wheather with 70% chance of rain", () => {
    test("total", () => expect(shouldIBike_total[0]).toEqual(false));
    test("cases", () => expect(shouldIBike_cases[0]).toEqual(false));
    test("otherwise", () => expect(shouldIBike_otherwise[0]).toEqual(false));
    test("mixed", () => expect(shouldIBike_mixed[0]).toEqual(false));
  });

  describe("Should bike in overcast wheather with 40% chance of rain", () => {
    test("total", () => expect(shouldIBike_total[1]).toEqual(true));
    test("cases", () => expect(shouldIBike_cases[1]).toEqual(true));
    test("otherwise", () => expect(shouldIBike_otherwise[1]).toEqual(true));
    test("mixed", () => expect(shouldIBike_mixed[1]).toEqual(true));
  });

  describe("Should bike in sunny wheather without extreme heat", () => {
    test("total", () => expect(shouldIBike_total[2]).toEqual(true));
    test("cases", () => expect(shouldIBike_cases[2]).toEqual(true));
    test("otherwise", () => expect(shouldIBike_otherwise[2]).toEqual(true));
    test("mixed", () => expect(shouldIBike_mixed[2]).toEqual(true));
  });

  describe("Should not bike in rainy wheather", () => {
    test("total", () => expect(shouldIBike_total[3]).toEqual(false));
    test("cases", () => expect(shouldIBike_cases[3]).toEqual(false));
    test("otherwise", () => expect(shouldIBike_otherwise[3]).toEqual(false));
    test("mixed", () => expect(shouldIBike_mixed[3]).toEqual(false));
  });

  describe("Should not bike in stormy wheather", () => {
    test("total", () => expect(shouldIBike_total[4]).toEqual(false));
    test("cases", () => expect(shouldIBike_cases[4]).toEqual(false));
    test("otherwise", () => expect(shouldIBike_otherwise[4]).toEqual(false));
    test("mixed", () => expect(shouldIBike_mixed[4]).toEqual(false));
  });

  describe("Should not bike in sunny wheather with extreme heat", () => {
    test("total", () => expect(shouldIBike_total[5]).toEqual(false));
    test("cases", () => expect(shouldIBike_cases[5]).toEqual(false));
    test("otherwise", () => expect(shouldIBike_otherwise[5]).toEqual(false));
    test("mixed", () => expect(shouldIBike_mixed[5]).toEqual(false));
  });
});
