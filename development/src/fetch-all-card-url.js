import { Range as createRange } from 'immutable';
import { stringify as queryStringify } from 'querystring';
import { format } from 'util';
import axios from 'axios';
import cheerio from 'cheerio';
import _flattenDeep from 'lodash.flattendeep';

const categories = [1, 2, 3]; // char_type[]
const costs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // cost[]
const max = 5;
const step = 12;
export default function fetchAllCardUrl() {
  return Promise.all(_flattenDeep(categories.map(i => costs.map(j => createRange(0, max).toArray().map(k => {
    const uri = format('https://shadowverse-portal.com/cards?%s', queryStringify({
      'char_type[]': i,
      'cost[]': j,
      card_offset: k * step,
    }));

    return axios(uri)
    .then(({ data }) => cheerio.load(data))
    .then($ => $('#displayVisual>.el-card-visual>a').toArray().map(a => ({
      url: $(a).attr('href'),
      category: i,
      cost: j,
    })));
  })))))
  .then(uris => uris.reduce((left, right) => left.concat(right), []));
}
