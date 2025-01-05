export function generateVerificationCode(): string {
  const alphanumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const codeLength = 8;

  const randomCode = Array.from(
    { length: codeLength },
    () => alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
  ).join('');

  // Insert a hyphen in the middle
  const hyphenIndex = Math.floor(codeLength / 2);
  const formattedCode = `${randomCode.slice(0, hyphenIndex)}-${randomCode.slice(hyphenIndex)}`;

  return formattedCode;
}
