import {
  assertUniqueKey,
  parseSortOrder,
  readCsvRecords,
  requireValue,
} from "./csv.mjs";

const filename = "mutual-success-plan.csv";

// One row per task. Accordion fields repeat across rows with the same
// accordionKey and are grouped into accordion objects before seeding.
const expectedHeaders = [
  "accordionKey",
  "accordionTitle",
  "accordionDescription",
  "accordionVariant",
  "accordionSortOrder",
  "taskKey",
  "taskTitle",
  "taskSortOrder",
];
const variants = new Set(["default", "muted", "highlighted"]);

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
      `${filename} row ${rowNumber} conflicts with earlier metadata for accordion "${nextAccordion.key}": ${mismatchedFields.join(", ")}.`,
    );
  }
};

export const readPlanAccordions = async (baseDir) => {
  const records = await readCsvRecords({
    baseDir,
    filename,
    expectedHeaders,
  });
  const accordionsByKey = new Map();
  const taskKeys = new Map();

  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2;
    const accordionVariant = requireValue(
      record,
      "accordionVariant",
      filename,
      rowNumber,
    );

    if (!variants.has(accordionVariant)) {
      throw new Error(
        `${filename} row ${rowNumber} accordionVariant must be one of: ${[...variants].join(", ")}.`,
      );
    }

    const accordion = {
      key: requireValue(record, "accordionKey", filename, rowNumber),
      title: requireValue(record, "accordionTitle", filename, rowNumber),
      description: requireValue(
        record,
        "accordionDescription",
        filename,
        rowNumber,
      ),
      variant: accordionVariant,
      sortOrder: parseSortOrder(
        record,
        "accordionSortOrder",
        filename,
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

    const taskKey = requireValue(record, "taskKey", filename, rowNumber);
    assertUniqueKey(taskKeys, taskKey, filename, rowNumber, "task key");

    const target = existingAccordion ?? accordion;
    target.tasks.push({
      key: taskKey,
      title: requireValue(record, "taskTitle", filename, rowNumber),
      sortOrder: parseSortOrder(record, "taskSortOrder", filename, rowNumber),
    });
  }

  return [...accordionsByKey.values()]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(({ sortOrder: _sortOrder, ...accordion }) => ({
      ...accordion,
      tasks: accordion.tasks
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map(({ sortOrder: _taskSortOrder, ...task }) => task),
    }));
};
