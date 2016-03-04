import { expect } from 'chai';

export function expectError (description, message, type, func) {
  it(description, async () => {
    try {
      await func();
      throw Error(message);
    } catch (error) {
      expect(error.name).to.equal(type);
    }
  });
}

export function expectId (id) {
  return expect(id).to.be.a('string').and.have.length.above(5);
}

export function expectUrl (url) {
  return expect(url).to.be.a('string').and.have.length.above(5);
}
