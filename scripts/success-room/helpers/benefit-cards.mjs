import {
  assertUniqueKey,
  parseSortOrder,
  readCsvRecords,
  requireValue,
} from "./csv.mjs";

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
      const key = requireValue(record, "key", filename, rowNumber);

      assertUniqueKey(benefitKeys, key, filename, rowNumber, "benefit key");

      return {
        key,
        title: requireValue(record, "title", filename, rowNumber),
        description: requireValue(record, "description", filename, rowNumber),
        sortOrder: parseSortOrder(record, "sortOrder", filename, rowNumber),
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder);

  if (benefitCards.length === 0) {
    throw new Error(`${filename} must include at least one benefit.`);
  }

  return benefitCards;
};
