const fs = require('fs');

const data = require('./data.json');

function getAdditionalInfo(term) {
  let dateInfo = ``;
  let noteInfo = term.note ? `, ${term.note}` : '';
  let yearCreated = term.year_created_source
    ? `[${term.year_created}](${term.year_created_source})`
    : term.year_created;

  if (term.year_created && term.year_deprecated) {
    dateInfo = `(${yearCreated} - ${term.year_deprecated}${noteInfo})`;
  } else if (term.year_created) {
    dateInfo = `(${yearCreated}${noteInfo})`;
  }

  return dateInfo;
}

// README.md

let readmeContent = '# Frontend Encyclopedia\n\n';
readmeContent +=
  '[List by categories](categories.md) | [List by chronological order](chronological.md)\n\n';

for (const key in data) {
  readmeContent += `### ${key}\n`;
  const terms = data[key]
    .map((term) => {
      ``;
      const nameWithLink = term.url
        ? `[${term.name}](${term.url})`
        : term.name;

      let dateInfo = getAdditionalInfo(term);
      return `- ${nameWithLink}${
        term.type
          ? dateInfo
            ? ` - ${term.type} ${dateInfo}`
            : ` - ${term.type}`
          : ''
      }`;
    })
    // sort by name case-insensitive
    .sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  readmeContent += terms.join('\n') + '\n\n';
}
readmeContent +=
  '---\n\nPull requests are welcome!\n\nEdit `scripts/data.json` to add new entries.\n\nEnsure that official names are used with correct spelling, capitalization and styling. \n\nThe husky pre-commit hook will automatically update the `README.md` file.';

fs.writeFileSync('README.md', readmeContent);

// categories.md

const categories = {};

for (const key in data) {
  data[key].forEach((term) => {
    let dateInfo = getAdditionalInfo(term);
    if (term.type) {
      if (!categories[term.type])
        categories[term.type] = [];
      let nameWithLink = term.url
        ? `[${term.name}](${term.url})`
        : term.name;

      if (dateInfo) nameWithLink += ` ${dateInfo}`;
      categories[term.type].push(nameWithLink);
    }
  });
}

let categoriesContent =
  '# Frontend Encyclopedia - Categories\n\n';

Object.keys(categories)
  .sort()
  .forEach((category) => {
    categoriesContent += `### ${category}\n`;
    categoriesContent +=
      categories[category]
        .map((item) => `- ${item}`)
        // sort by name case-insensitive
        .sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
        .join('\n') + '\n\n';
  });

fs.writeFileSync('categories.md', categoriesContent);

// chronological.md

const chronological = {};

for (const key in data) {
  data[key].forEach((term) => {
    let dateInfo = getAdditionalInfo(term);
    let yearCreated = term.year_created;
    let category = term.type; // Using 'type' as the category

    if (yearCreated && category) {
      let nameWithLink = term.url
        ? `[${term.name}](${term.url})`
        : term.name;

      let entry = `- ${nameWithLink} - ${category}`; // Including category

      if (dateInfo) entry += ` ${dateInfo}`;

      if (!chronological[yearCreated])
        chronological[yearCreated] = [];

      chronological[yearCreated].push(entry);
    }
  });
}

let chronologicalContent =
  '# Frontend Encyclopedia - Chronological Order\n\n';

Object.keys(chronological)
  .sort((a, b) => a - b)
  .forEach((year) => {
    chronologicalContent += `### ${year}\n`;
    chronologicalContent +=
      chronological[year].join('\n') + '\n\n';
  });

fs.writeFileSync('chronological.md', chronologicalContent);
