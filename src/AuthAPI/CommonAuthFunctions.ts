export class CommonAuthFucntions {
  static requiredField = (fieldValue: string): boolean => {
    if (!fieldValue) {
      return false;
    }

    return true;
  };

  static stringLengthvalid = (
    fieldValue: string,
    min: number,
    max: number
  ): boolean => {
    if (fieldValue.length >= min && fieldValue.length <= max) {
      return true;
    }
    return false;
  };
}
