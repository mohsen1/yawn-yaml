'use strict';

export default class YAWNError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'YAWNError';
  }
}
