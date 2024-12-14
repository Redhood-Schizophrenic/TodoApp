export default function StringValidators(value) {
  // Ensure the input is a string
  if (typeof value !== "string") {
    return false;
  }

  if (value === null) {
    return true;
  }

  // List of forbidden characters
  const charList = ['/', '\\', '"', ';', "'", '+', '`', '^'];
  let validationFlag = true;

  // Iterate over each character in the list
  for (let char of charList) {

    // Check if the forbidden character is present in the string
    if (value.includes(char)) {
      validationFlag = false;
      break; // Stop checking further once an invalid character is found
    }
  }

  return validationFlag;
}
