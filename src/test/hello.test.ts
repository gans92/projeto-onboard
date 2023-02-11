import axios from 'axios';
import { expect } from 'chai';

describe('Hello Query', () => {
  it('should return hello message', async () => {
    const result = await axios.post('http://localhost:4000/', {
      query: `
        query Hello {
          hello
        }
      `,
    });
    expect(result.data.data.hello).to.be.eq('Hello world!');
  });

});