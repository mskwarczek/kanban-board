export const createId = (type: string) => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36);
  return `${type}--${dateString}${randomness}`;
}
