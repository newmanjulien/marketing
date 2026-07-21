import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const parseCsvRows = (text, filename) => {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (insideQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        cell += character;
      }

      continue;
    }

    if (character === '"') {
      insideQuotes = true;
      continue;
    }

    if (character === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }

      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += character;
  }

  if (insideQuotes) {
    throw new Error(`${filename} has an unterminated quoted field.`);
  }

  row.push(cell);
  rows.push(row);

  return rows.filter((candidate) =>
    candidate.some((value) => value.trim() !== ""),
  );
};

const assertExpectedHeaders = (actualHeaders, expectedHeaders, filename) => {
  // trim() also strips a leading BOM (U+FEFF is ECMAScript whitespace).
  const normalizedActualHeaders = actualHeaders.map((header) => header.trim());
  const missingHeaders = expectedHeaders.filter(
    (header) => !normalizedActualHeaders.includes(header),
  );
  const extraHeaders = [...new Set(normalizedActualHeaders)].filter(
    (header) => !expectedHeaders.includes(header),
  );
  const duplicateHeaders = [
    ...new Set(
      normalizedActualHeaders.filter(
        (header, index) => normalizedActualHeaders.indexOf(header) !== index,
      ),
    ),
  ];

  const problems = [
    missingHeaders.length > 0 && `Missing: ${missingHeaders.join(", ")}.`,
    extraHeaders.length > 0 && `Unexpected: ${extraHeaders.join(", ")}.`,
    duplicateHeaders.length > 0 && `Duplicated: ${duplicateHeaders.join(", ")}.`,
  ].filter(Boolean);

  if (problems.length > 0) {
    throw new Error(
      `${filename} must use these headers: ${expectedHeaders.join(", ")}. ${problems.join(" ")}`,
    );
  }

  return normalizedActualHeaders;
};

export const readCsvRecords = async ({ baseDir, filename, expectedHeaders }) => {
  const text = await readFile(resolve(baseDir, filename), "utf8");
  const [rawHeaders, ...rawRows] = parseCsvRows(text, filename);

  if (!rawHeaders) {
    throw new Error(`${filename} is empty.`);
  }

  const headers = assertExpectedHeaders(rawHeaders, expectedHeaders, filename);

  return rawRows.map((row, rowIndex) => {
    if (row.length !== headers.length) {
      throw new Error(
        `${filename} row ${rowIndex + 2} has ${row.length} columns; expected ${headers.length}.`,
      );
    }

    return Object.fromEntries(
      headers.map((header, index) => {
        const value = row[index].trim();

        if (value === "") {
          throw new Error(`${filename} row ${rowIndex + 2} is missing ${header}.`);
        }

        return [header, value];
      }),
    );
  });
};

export const parseSortOrder = (value, label, filename, rowNumber) => {
  const sortOrder = Number(value);

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error(
      `${filename} row ${rowNumber} ${label} must be a non-negative integer.`,
    );
  }

  return sortOrder;
};

export const assertUniqueKey = (seenKeys, key, filename, rowNumber, label) => {
  const firstRowNumber = seenKeys.get(key);

  if (firstRowNumber) {
    throw new Error(
      `${filename} row ${rowNumber} duplicates ${label} "${key}" from row ${firstRowNumber}.`,
    );
  }

  seenKeys.set(key, rowNumber);
};
