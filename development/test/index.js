// dependencies
import assert from 'assert';

// target
import shadowversejson from '../src';

// specs
describe('shadowversejson', () => {
  it('spec1', async () => {
    const cards = await shadowversejson();
    console.log(cards)
  });
});
