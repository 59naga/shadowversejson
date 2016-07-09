import Promise from 'bluebird';
import axios from 'axios';
import fetchAllCardUrl from './fetch-all-card-url';
import scrapeCardData from './scrape-card-data';

const rarities = {
  ブロンズレア: 'bronze',
  シルバーレア: 'silver',
  ゴールドレア: 'gold',
  レジェンド: 'legendary',
};
const classes = {
  ニュートラル: 'neutral',
  エルフ: 'forestcraft',
  ロイヤル: 'swordcraft',
  ウィッチ: 'runecraft',
  ドラゴン: 'dragoncraft',
  ネクロマンサー: 'shadowcraft',
  ヴァンパイア: 'bloodcraft',
  ビショップ: 'havencraft',
};
const categories = [undefined, 'follower', 'spell', 'amulet'];
const types = {
  '-': undefined,
  兵士: 'officer',
  指揮官: 'commander',
  土の印: 'earth_sigil',
};
function normalize(languages, id, cost, category) {
  const names = {};
  Object.keys(languages).forEach(lang => {
    names[lang] = languages[lang].name;
  });

  return {
    id,
    name: names,
    cost: id === '101334020' ? 18 : cost,
    card: languages.ja.card.map((data, i) => {
      Object.keys(data).forEach(key => {
        if (['skill', 'description'].indexOf(key) > -1) {
          const value = data[key];
          const langs = {};
          if (value.length) {
            Object.keys(languages).forEach(lang => {
              langs[lang] = languages[lang].card[i][key];
            });
          }
          data[key] = langs;
        }
      });
      return data;
    }),
    meta: {
      rarity: rarities[languages.ja.rarity],
      class: classes[languages.ja.class],
      category: categories[category],
      type: types[languages.ja.type],
    },
  };
}

const base = 'https://shadowverse-portal.com';
export default () =>
  fetchAllCardUrl()
  .then(items => Promise.all(
    items.map(item => {
      const uri = base + item.url;
      const id = item.url.split('/').slice(-1)[0];
      return Promise.props({
        ja: axios(uri, { headers: { 'Accept-Language': 'ja' } })
        .then(({ data }) => scrapeCardData(data)),

        en: axios(uri, { headers: { 'Accept-Language': 'en' } })
        .then(({ data }) => scrapeCardData(data, false)),
      })
      .then(languages => normalize(languages, id, item.cost, item.category));
    })
  )
);
