import * as xss from "xss";

function isValidType(type: string): boolean {
  return ["function", "symbol", "boolean", "undefined"].indexOf(type) !== -1;
}

export const Sanitize = (object: any): any => {
  if (isValidType(typeof object)) return object;

  try {
    Object.keys(object).forEach(function (key) {
      if (object[key] && typeof object[key] === "object") {
        Sanitize(object[key]); // Recursively sanitize objects
      } else if (typeof object[key] === "string") {
        object[key] = xss.filterXSS(object[key]); // Sanitize strings
      }
    });
    return object;
  } catch (error) {
    // If an error occurs, we throw it to be caught by the calling function or middleware
    throw new Error("Invalid input detected");
  }
};
