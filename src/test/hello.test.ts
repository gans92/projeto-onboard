import axios from 'axios';
import { expect } from 'chai';
import { BASE_URL } from './constants';


describe('Hello Query', () => {
  it('should return hello message', async () => {
    const result = await axios.post(`${BASE_URL}`, {
      query: `
        query Hello {
          hello
        }
      `,
    });
    expect(result.data.data.hello).to.be.eq('Hello world!');
  });

});