import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $countryCode: String!) {
    signup(email: $email, password: $password, countryCode: $countryCode) {
      token
      user {
        id
        email
        countryCode
        countryName
        isVerified
        createdAt
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        countryCode
        countryName
        isVerified
        createdAt
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      countryCode
      countryName
      isVerified
      createdAt
    }
  }
`;
