import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      message
      email
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtp($email: String!, $code: String!) {
    verifyOtp(email: $email, code: $code) {
      token
      user {
        id
        email
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
        isVerified
        createdAt
      }
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOtp($email: String!, $type: OtpType) {
    resendOtp(email: $email, type: $type) {
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      email
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $code: String!, $password: String!) {
    resetPassword(email: $email, code: $code, password: $password) {
      message
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      isVerified
      createdAt
    }
  }
`;
