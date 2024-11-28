export const OtpMethod = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
};

export type OtpMethod = (typeof OtpMethod)[keyof typeof OtpMethod];
