export const handleError = (e): string => {
  if (typeof e === "string") {
    return e;
  } else if (typeof e === "object") {
    const { message, description } = e;
    if (typeof message === "string") {
      return message;
    } else if (typeof description === "string") {
      // NEOline
      return description;
    } else {
      return "An error occurred, Check console.";
    }
  } else {
    return "An error occurred, Check console.";
  }
};
