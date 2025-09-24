export const generateISBN13 = () => {
  const digits = [];
  for (let i = 0; i < 12; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);

  return digits.join("");
};

export const generateISBN10 = () => {
  const digits = [];
  for (let i = 0; i < 9; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  const checkDigit = sum % 11;
  const checkChar = checkDigit === 10 ? "X" : checkDigit.toString();
  digits.push(checkChar);

  return digits.join("");
};

export const formatISBN = (isbn) => {
  if (isbn.length === 13) {
    return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(
      4,
      7
    )}-${isbn.slice(7, 12)}-${isbn.slice(12)}`;
  } else if (isbn.length === 10) {
    return `${isbn.slice(0, 1)}-${isbn.slice(1, 4)}-${isbn.slice(
      4,
      9
    )}-${isbn.slice(9)}`;
  }
  return isbn;
};

export const generateRandomISBN = () => {
  return generateISBN13();
};
