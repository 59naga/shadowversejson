import cheerio from 'cheerio';

export default function scrapeCardData(html, includeMeta = true) {
  const $ = cheerio.load(html);
  const name = $('h1').text().trim();

  const items = $('.card-main-list > li').toArray();
  const card = items.map(li => {
    const $li = $(li);
    const atk = $li.find('.is-atk').text().trim();
    const life = $li.find('.is-life').text().trim();
    return {
      atk: atk ? Number(atk) : undefined,
      life: life ? Number(life) : undefined,
      skill: $li.find('.card-content-skill').text().trim(),
      description: $li.find('.card-content-description').text().trim(),
    };
  });
  if (includeMeta === false) {
    return {
      name,
      card,
    };
  }

  const $information = $('.card-info-content');
  const type = $information.find('span:contains(タイプ)').next().text().trim();
  const klass = $information.find('span:contains(クラス)').next().text().trim();
  const rarity = $information.find('span:contains(レアリティ)').next().text().trim();
  return {
    name,
    card,
    type,
    class: klass,
    rarity,
  };
}
