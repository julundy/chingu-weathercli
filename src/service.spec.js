const service = require("./service");
const axios = require("axios");

jest.mock("axios");

it("no passed term returns error", async () => {
  await expect(service.getLocations()).rejects.toEqual({
    error: "no search term parameter",
  });
});

it("will return the error from failed mapbox call", async () => {
  axios.get.mockResolvedValue(new Error("error calling mapbox api"));
  await expect(service.getLocations("test")).rejects.toEqual({
    error: "error calling mapbox api",
  });
});
