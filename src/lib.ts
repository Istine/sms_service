import { CommonAuthFucntions } from "./ValidationAPI/CommonAuthFunctions";
import { FIELDS } from "./types";

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
      fieldValue = !CommonAuthFucntions.stringLengthvalid(value, 6, 16)
        ? `${fieldName} is invalid`
        : fieldValue;
      break;

    case FIELDS.T0:
      fieldValue = !CommonAuthFucntions.stringLengthvalid(value, 6, 16)
        ? `${fieldName} is missing`
        : fieldName;
      break;

    case FIELDS.TEXT:
      fieldValue = !CommonAuthFucntions.stringLengthvalid(value, 6, 120)
        ? `${fieldName} is missing`
        : fieldValue;
      break;

    default:
      fieldValue = fieldValue;
      break;
  }

  return fieldValue;
};
