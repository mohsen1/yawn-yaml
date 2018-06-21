export default class YAWNError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'YAWNError';
  }
}
