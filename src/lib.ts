import { FIELDS } from "./types";

export const RATE_LIMIT = 50;
export const RATE_LIMIT_WINDOW_MS = 8.64e7;
export const STOP_TEXT_EXP = 60 * 60 * 4;

export const CommonAuthFucntions = {
  requiredField(fieldValue: string | undefined): boolean {
    if (!fieldValue) {
      return false;
    }

    return true;
  },

  stringLengthvalid(fieldValue: string, min: number, max: number): boolean {
    if (fieldValue.length >= min && fieldValue.length <= max) {
      return true;
    }
    return false;
  },
};

export const errorResponse = (errorMessage: string) => ({
  message: "",
  error: errorMessage,
});

export const successResponse = (message: string) => ({ message, error: "" });

export const validateField = (value: string, fieldName: string): string => {
  let fieldValue = "";
  switch (fieldName) {
    case FIELDS.FROM:
      fieldValue = !CommonAuthFucntions.requiredField(value)
        ? `${fieldName} is missing`
        : fieldValue;
      fieldValue =
        fieldValue === "" &&
        !CommonAuthFucntions.stringLengthvalid(value, 6, 16)
          ? `${fieldName} is invalid`
          : fieldValue;
      break;

    case FIELDS.T0:
      fieldValue = !CommonAuthFucntions.requiredField(value)
        ? `${fieldName} is missing`
        : fieldValue;
      fieldValue =
        fieldValue === "" &&
        !CommonAuthFucntions.stringLengthvalid(value, 6, 16)
          ? `${fieldName} is invalid`
          : fieldValue;
      break;

    case FIELDS.TEXT:
      fieldValue = !CommonAuthFucntions.requiredField(value)
        ? `${fieldName} is missing`
        : fieldValue;
      fieldValue =
        fieldValue === "" &&
        !CommonAuthFucntions.stringLengthvalid(value, 1, 120)
          ? `${fieldName} is invalid`
          : fieldValue;
      break;

    default:
      fieldValue = fieldValue;
      break;
  }

  return fieldValue;
};
