import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      capital
    }
  }
`;

export const GET_WEATHER = gql`
  query GetWeather {
    weather {
      countryCode
      countryName
      location
      temperatureC
      humidity
      windSpeedKmh
      condition
      observedAt
      source
    }
  }
`;
