import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "/countries/v5"
    : "https://api.restcountries.com/countries/v5";
const PAGE_SIZE = 100;

const API_KEY = (process.env.REACT_APP_REST_COUNTRIES_API_KEY || "").trim();

if (process.env.NODE_ENV === "development") {
  console.log(
    "REST Countries API key:",
    API_KEY ? "loaded" : "missing — stop and restart npm start after editing .env"
  );
}

const getApiKey = () => API_KEY;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getApiKey()}`,
});

const getPrimaryCapital = (capitals = []) => {
  if (!capitals.length) {
    return "";
  }

  const primary = capitals.find(
    (capital) => capital.attributes?.primary || capital.primary
  );

  return (primary ?? capitals[0]).name ?? "";
};

const mapCountryV5ToLegacy = (country) => {
  const languages = (country.languages || []).reduce((acc, language) => {
    const key = language.bcp47 || language.name;
    acc[key] = language.name;
    return acc;
  }, {});

  const currencies = (country.currencies || []).reduce((acc, currency) => {
    acc[currency.code] = { name: currency.name, symbol: currency.symbol };
    return acc;
  }, {});

  return {
    name: {
      common: country.names?.common ?? "",
      official: country.names?.official ?? "",
    },
    flags: {
      png: country.flag?.url_png ?? "",
    },
    languages,
    currencies,
    population: country.population ?? 0,
    capital: getPrimaryCapital(country.capitals),
    timezones: country.timezones ?? [],
  };
};

const fetchCountriesPage = async ({ offset = 0, q } = {}) => {
  const params = {
    limit: PAGE_SIZE,
    offset,
  };

  if (q?.trim()) {
    params.q = q.trim();
  }

  const headers = getAuthHeaders();

  console.log("REST Countries request:", {
    method: "GET",
    url: API_URL,
    params,
    headers: {
      Authorization: headers.Authorization ? "Bearer [REDACTED]" : "missing",
    },
  });

  const response = await axios.get(API_URL, {
    params,
    headers,
  });

  if (response.data?.errors) {
    console.error("REST Countries API errors:", response.data.errors);
    throw new Error(response.data.errors[0]?.message ?? "REST Countries API error");
  }

  console.log("REST Countries response:", {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
  });

  return response.data.data;
};

const fetchAllPages = async (q) => {
  const countries = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const page = await fetchCountriesPage({ offset, q });
    const objects = page?.objects ?? [];

    countries.push(...objects.map(mapCountryV5ToLegacy));

    hasMore = page?.meta?.more ?? false;
    offset += PAGE_SIZE;
  }

  return countries;
};

const getall = async () => {
  if (!getApiKey()) {
    throw new Error(
      "Missing REACT_APP_REST_COUNTRIES_API_KEY. Add it to .env in the project root, then stop and restart npm start."
    );
  }

  return fetchAllPages();
};

const search = async (query) => {
  if (!getApiKey()) {
    throw new Error(
      "Missing REACT_APP_REST_COUNTRIES_API_KEY. Add it to .env in the project root, then stop and restart npm start."
    );
  }

  if (!query?.trim()) {
    return [];
  }

  return fetchAllPages(query);
};

const countryService = { getall, search };

export default countryService;
