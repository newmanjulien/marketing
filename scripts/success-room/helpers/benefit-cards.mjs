import { assertUniqueKey, parseSortOrder, readCsvRecords } from "./csv.mjs";

const filename = "create-benefits.csv";
const expectedHeaders = ["key", "title", "description", "sortOrder"];

export const readBenefitCards = async (baseDir) => {
  const records = await readCsvRecords({
    baseDir,
    filename,
    expectedHeaders,
  });
  const benefitKeys = new Map();
  const benefitCards = records
    .map((record, index) => {
      const rowNumber = index + 2;

      assertUniqueKey(benefitKeys, record.key, filename, rowNumber, "benefit key");

      return {
        key: record.key,
        title: record.title,
        description: record.description,
        sortOrder: parseSortOrder(record.sortOrder, "sortOrder", filename, rowNumber),
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(({ sortOrder: _sortOrder, ...card }) => card);

  if (benefitCards.length === 0) {
    throw new Error(`${filename} must include at least one benefit.`);
  }

  return benefitCards;
};
