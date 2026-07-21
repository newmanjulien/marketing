import { assertUniqueKey, parseSortOrder, readCsvRecords } from "./csv.mjs";

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
const variants = ["default", "muted", "highlighted"];

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

    if (!variants.includes(record.accordionVariant)) {
      throw new Error(
        `${filename} row ${rowNumber} accordionVariant must be one of: ${variants.join(", ")}.`,
      );
    }

    const parsed = {
      key: record.accordionKey,
      title: record.accordionTitle,
      description: record.accordionDescription,
      variant: record.accordionVariant,
      sortOrder: parseSortOrder(
        record.accordionSortOrder,
        "accordionSortOrder",
        filename,
        rowNumber,
      ),
      tasks: [],
    };

    // Repeated accordion metadata must stay identical so a task row cannot
    // silently change the parent accordion title, description, variant, or order.
    let accordion = accordionsByKey.get(parsed.key);
    if (accordion) {
      assertMatchingAccordionMetadata(accordion, parsed, rowNumber);
    } else {
      accordion = parsed;
      accordionsByKey.set(accordion.key, accordion);
    }

    assertUniqueKey(taskKeys, record.taskKey, filename, rowNumber, "task key");

    accordion.tasks.push({
      key: record.taskKey,
      title: record.taskTitle,
      sortOrder: parseSortOrder(record.taskSortOrder, "taskSortOrder", filename, rowNumber),
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
