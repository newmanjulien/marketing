// Run from the project root:
//   npm run add:success-room:mutual-success-plan
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This reads both sibling mutual-success-plan CSV files and replaces the full
// mutual-success-plan section for the hard-coded slug below.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { enableSuccessRoomSection } from "../helpers/seed-common.mjs";

// Replaces the mutual success plan for an existing room with the CSV content.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "overbase";

const benefitsCsvFilename = "mutual-success-plan-benefits.csv";
const planCsvFilename = "mutual-success-plan-plan.csv";

// One row per benefit card.
const benefitHeaders = ["key", "title", "description", "sortOrder"];

// One row per task. Accordion fields repeat across rows with the same
// accordionKey and are grouped into accordion objects before seeding.
const planHeaders = [
  "accordionKey",
  "accordionTitle",
  "accordionDescription",
  "accordionVariant",
  "accordionSortOrder",
  "taskKey",
  "taskTitle",
  "taskDateLabel",
  "taskSortOrder",
];
const planVariants = new Set(["default", "muted"]);

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

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((candidate) =>
    candidate.some((value) => value.trim() !== ""),
  );
};

const assertExpectedHeaders = (actualHeaders, expectedHeaders, filename) => {
  const normalizedActualHeaders = actualHeaders.map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "").trim() : header.trim(),
  );
  const actualHeaderSet = new Set(normalizedActualHeaders);
  const expectedHeaderSet = new Set(expectedHeaders);
  const missingHeaders = expectedHeaders.filter(
    (header) => !actualHeaderSet.has(header),
  );
  const extraHeaders = normalizedActualHeaders.filter(
    (header) => !expectedHeaderSet.has(header),
  );

  if (missingHeaders.length > 0 || extraHeaders.length > 0) {
    throw new Error(
      `${filename} must use these headers: ${expectedHeaders.join(", ")}.${
        missingHeaders.length > 0
          ? ` Missing: ${missingHeaders.join(", ")}.`
          : ""
      }${extraHeaders.length > 0 ? ` Unexpected: ${extraHeaders.join(", ")}.` : ""}`,
    );
  }

  return normalizedActualHeaders;
};

const readCsvRecords = async (filename, expectedHeaders) => {
  const text = await readFile(resolve(import.meta.dirname, filename), "utf8");
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
      headers.map((header, index) => [header, row[index].trim()]),
    );
  });
};

const requireValue = (record, field, filename, rowNumber) => {
  const value = record[field];

  if (!value) {
    throw new Error(`${filename} row ${rowNumber} is missing ${field}.`);
  }

  return value;
};

const parseSortOrder = (record, field, filename, rowNumber) => {
  const value = requireValue(record, field, filename, rowNumber);
  const sortOrder = Number(value);

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error(
      `${filename} row ${rowNumber} ${field} must be a non-negative integer.`,
    );
  }

  return sortOrder;
};

const assertUniqueKey = (seenKeys, key, filename, rowNumber, label) => {
  const firstRowNumber = seenKeys.get(key);

  if (firstRowNumber) {
    throw new Error(
      `${filename} row ${rowNumber} duplicates ${label} "${key}" from row ${firstRowNumber}.`,
    );
  }

  seenKeys.set(key, rowNumber);
};

const readBenefitCards = async () => {
  const records = await readCsvRecords(benefitsCsvFilename, benefitHeaders);
  const benefitKeys = new Map();

  return records
    .map((record, index) => {
      const rowNumber = index + 2;
      const key = requireValue(record, "key", benefitsCsvFilename, rowNumber);

      assertUniqueKey(
        benefitKeys,
        key,
        benefitsCsvFilename,
        rowNumber,
        "benefit key",
      );

      return {
        key,
        title: requireValue(record, "title", benefitsCsvFilename, rowNumber),
        description: requireValue(
          record,
          "description",
          benefitsCsvFilename,
          rowNumber,
        ),
        sortOrder: parseSortOrder(
          record,
          "sortOrder",
          benefitsCsvFilename,
          rowNumber,
        ),
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

const assertMatchingAccordionMetadata = (
  existingAccordion,
  nextAccordion,
  rowNumber,
) => {
  const mismatchedFields = [
    "title",
    "description",
    "variant",
    "sortOrder",
  ].filter((field) => existingAccordion[field] !== nextAccordion[field]);

  if (mismatchedFields.length > 0) {
    throw new Error(
      `${planCsvFilename} row ${rowNumber} conflicts with earlier metadata for accordion "${nextAccordion.key}": ${mismatchedFields.join(", ")}.`,
    );
  }
};

const readPlanAccordions = async () => {
  const records = await readCsvRecords(planCsvFilename, planHeaders);
  const accordionsByKey = new Map();
  const taskKeys = new Map();

  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2;
    const accordionVariant = requireValue(
      record,
      "accordionVariant",
      planCsvFilename,
      rowNumber,
    );

    if (!planVariants.has(accordionVariant)) {
      throw new Error(
        `${planCsvFilename} row ${rowNumber} accordionVariant must be default or muted.`,
      );
    }

    const accordion = {
      key: requireValue(record, "accordionKey", planCsvFilename, rowNumber),
      title: requireValue(record, "accordionTitle", planCsvFilename, rowNumber),
      description: requireValue(
        record,
        "accordionDescription",
        planCsvFilename,
        rowNumber,
      ),
      variant: accordionVariant,
      sortOrder: parseSortOrder(
        record,
        "accordionSortOrder",
        planCsvFilename,
        rowNumber,
      ),
      tasks: [],
    };
    const existingAccordion = accordionsByKey.get(accordion.key);

    // Repeated accordion metadata must stay identical so a task row cannot
    // silently change the parent accordion title, description, variant, or order.
    if (existingAccordion) {
      assertMatchingAccordionMetadata(existingAccordion, accordion, rowNumber);
    } else {
      accordionsByKey.set(accordion.key, accordion);
    }

    const taskKey = requireValue(record, "taskKey", planCsvFilename, rowNumber);
    assertUniqueKey(taskKeys, taskKey, planCsvFilename, rowNumber, "task key");

    accordionsByKey.get(accordion.key).tasks.push({
      key: taskKey,
      title: requireValue(record, "taskTitle", planCsvFilename, rowNumber),
      dateLabel: requireValue(
        record,
        "taskDateLabel",
        planCsvFilename,
        rowNumber,
      ),
      sortOrder: parseSortOrder(
        record,
        "taskSortOrder",
        planCsvFilename,
        rowNumber,
      ),
    });
  }

  return [...accordionsByKey.values()]
    .map((accordion) => ({
      ...accordion,
      tasks: accordion.tasks
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map(({ sortOrder: _sortOrder, ...task }) => task),
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
};

const [benefitCards, planAccordions] = await Promise.all([
  readBenefitCards(),
  readPlanAccordions(),
]);

await enableSuccessRoomSection({
  slug,
  resourceKey: "mutual-success-plan",
  benefitCards,
  planAccordions,
});
