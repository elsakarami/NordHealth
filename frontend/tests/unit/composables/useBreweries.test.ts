/**
 * Unit tests for the `BreweryService` composable.
 *
 * This suite tests:
 * - Fetching breweries with authentication.
 * - Filtering and resetting brewery data.
 * - Fetching grouped brewery data.
 * - Error handling during fetch operations.
 *
 * Mocks:
 * - `AxiosService` is mocked to simulate API calls.
 * - `fetch` is replaced with `fetchMock` for controlled responses.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BreweryService } from "@/composables/useBreweries";
import type { Brewery } from "@/types/index";

const fetchMock = vi.fn();

vi.mock("@/composables/useAxios", () => ({
  AxiosService: vi.fn().mockImplementation(() => ({
    data: { value: null },
    error: { value: null },
    loading: { value: false },
    fetch: fetchMock,
  })),
}));

describe("BreweryService", () => {
  let breweryService: BreweryService;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    breweryService = new BreweryService();
  });

  it("should throw error if no auth token in fetchBreweries", async () => {
    await expect(breweryService.fetchBreweries()).rejects.toThrow(
      "No authentication token found"
    );
  });

  it("should fetch breweries and populate data and filteredData", async () => {
    localStorage.setItem("auth_token", "mock-token");

    const mockBreweries: Brewery[] = [
      {
        id: "1",
        name: "Brewery A",
        brewery_type: "micro",
        address_1: "123 Main St",
        address_2: null,
        address_3: null,
        city: "CityA",
        state_province: "California",
        postal_code: "90001",
        country: "USA",
        longitude: null,
        latitude: null,
        phone: "123-456-7890",
        website_url: "http://brewerya.com",
        state: "CA",
        street: "Main St",
      },
      {
        id: "2",
        name: "Brewery B",
        brewery_type: "nano",
        address_1: "456 Oak St",
        address_2: null,
        address_3: null,
        city: "CityB",
        state_province: "Bavaria",
        postal_code: "80331",
        country: "Germany",
        longitude: null,
        latitude: null,
        phone: "987-654-3210",
        website_url: null,
        state: "BY",
        street: "Oak St",
      },
    ];

    fetchMock.mockResolvedValueOnce({ data: mockBreweries });

    await breweryService.fetchBreweries();

    expect(fetchMock).toHaveBeenCalledWith("/api/breweries/list/", "GET", {
      axiosConfig: {
        headers: { Authorization: "mock-token" },
      },
    });

    expect(breweryService.data.value).toEqual(mockBreweries);
    expect(breweryService.filteredData.value).toEqual(mockBreweries);
    expect(breweryService.loading.value).toBe(false);
  });

  it("should filter breweries based on a field", async () => {
    breweryService.data.value = [
      {
        id: "1",
        name: "Brewery A",
        brewery_type: "micro",
        address_1: "123 Main St",
        address_2: null,
        address_3: null,
        city: "CityA",
        state_province: "California",
        postal_code: "90001",
        country: "USA",
        longitude: null,
        latitude: null,
        phone: "123-456-7890",
        website_url: "http://brewerya.com",
        state: "CA",
        street: "Main St",
      },
      {
        id: "2",
        name: "Brewery B",
        brewery_type: "nano",
        address_1: "456 Oak St",
        address_2: null,
        address_3: null,
        city: "CityB",
        state_province: "Bavaria",
        postal_code: "80331",
        country: "Germany",
        longitude: null,
        latitude: null,
        phone: "987-654-3210",
        website_url: null,
        state: "BY",
        street: "Oak St",
      },
    ];

    breweryService.filterDataByField("country", "usa");

    expect(breweryService.filteredData.value).toEqual([
      {
        id: "1",
        name: "Brewery A",
        brewery_type: "micro",
        address_1: "123 Main St",
        address_2: null,
        address_3: null,
        city: "CityA",
        state_province: "California",
        postal_code: "90001",
        country: "USA",
        longitude: null,
        latitude: null,
        phone: "123-456-7890",
        website_url: "http://brewerya.com",
        state: "CA",
        street: "Main St",
      },
    ]);
  });

  it("should reset filter", () => {
    breweryService.data.value = [
      {
        id: "1",
        name: "Brewery A",
        brewery_type: "micro",
        address_1: "123 Main St",
        address_2: null,
        address_3: null,
        city: "CityA",
        state_province: "California",
        postal_code: "90001",
        country: "USA",
        longitude: null,
        latitude: null,
        phone: "123-456-7890",
        website_url: "http://brewerya.com",
        state: "CA",
        street: "Main St",
      },
    ];
    breweryService.filteredData.value = [];

    breweryService.resetFilter();

    expect(breweryService.filteredData.value).toEqual(
      breweryService.data.value
    );
  });

  it("should fetch grouped breweries", async () => {
    localStorage.setItem("auth_token", "mock-token");

    const mockGroupedData = { USA: 10, Germany: 5 };

    fetchMock.mockResolvedValueOnce({ data: mockGroupedData });

    const result = await breweryService.fetchGroupedBreweries("country");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/breweries/grouped/?group_by=country",
      "GET",
      {
        axiosConfig: {
          headers: { Authorization: "mock-token" },
        },
      }
    );
    expect(result).toEqual(mockGroupedData);
    expect(breweryService.loading.value).toBe(false);
  });

  it("should handle error if grouped fetch fails", async () => {
    localStorage.setItem("auth_token", "mock-token");

    fetchMock.mockRejectedValueOnce(new Error("Network error"));

    const result = await breweryService.fetchGroupedBreweries("country");

    expect(result).toBeUndefined();
    expect(breweryService.error.value).toBe("Network error");
    expect(breweryService.loading.value).toBe(false);
  });
});
