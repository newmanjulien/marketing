// Run from the project root:
//   npm run add:success-room:mutual-success-plan
//
// Requires PUBLIC_CONVEX_URL and SUCCESS_ROOM_SEED_SECRET in the shell or .env.local.
// This reads the sibling mutual-success-plan plan CSV and replaces the
// mutual-success-plan plan content for the hard-coded slug below.

import {
  assertUniqueKey,
  parseSortOrder,
  readCsvRecords,
  requireValue,
} from "../helpers/csv.mjs";
import { enableSuccessRoomSection } from "../helpers/seed-common.mjs";

// Replaces the mutual success plan for an existing room with the CSV content.
// If this slug does not exist, Convex throws and nothing is created.
const slug = "tabitha";

const planCsvFilename = "mutual-success-plan-plan.csv";

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
  "taskSortOrder",
];
const planVariants = new Set(["default", "muted", "highlighted"]);

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
  const records = await readCsvRecords({
    baseDir: import.meta.dirname,
    filename: planCsvFilename,
    expectedHeaders: planHeaders,
  });
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
        `${planCsvFilename} row ${rowNumber} accordionVariant must be one of: ${[...planVariants].join(", ")}.`,
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

const planAccordions = await readPlanAccordions();

await enableSuccessRoomSection({
  slug,
  resourceKey: "mutual-success-plan",
  planAccordions,
});
