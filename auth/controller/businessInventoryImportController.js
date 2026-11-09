
const ExcelJS = require("exceljs");
const { parse } = require("csv-parse/sync");

const MAX_ROWS = 500;

const REQUIRED_COLUMNS = ["name", "itemType"];
const SUPPORTED_COLUMNS = [
  "name",
  "itemType",
  "category",
  "description",
  "price",
  "imageUrl"
];

function validateInventoryHeaders(headers) {
  const normalizedHeaders = headers.map(header =>
    String(header ?? "").replace(/^\uFEFF/, "").trim()
  );

  const duplicates = normalizedHeaders.filter(
    (header, index) => normalizedHeaders.indexOf(header) !== index
  );

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate spreadsheet columns: ${[...new Set(duplicates)].join(", ")}`
    );
  }

  const missing = REQUIRED_COLUMNS.filter(
    column => !normalizedHeaders.includes(column)
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required spreadsheet columns: ${missing.join(", ")}`
    );
  }

  const unsupported = normalizedHeaders.filter(
    column => !SUPPORTED_COLUMNS.includes(column)
  );

  if (unsupported.length > 0) {
    throw new Error(
      `Unsupported spreadsheet columns: ${unsupported.join(", ")}`
    );
  }

  return normalizedHeaders;
}

async function parseInventoryFile(file) {
  if (!file?.buffer) {
    throw new Error("Please select a CSV or XLSX file.");
  }

  const extension = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  let rows;

  if (extension === "csv") {
    const content = file.buffer.toString("utf8");

    rows = parse(content, {
      columns: headers => validateInventoryHeaders(headers),
      bom: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: false,
      to: MAX_ROWS + 2
    });
  } else if (extension === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error("The Excel workbook has no worksheets.");
    }

   const headers = validateInventoryHeaders(
  worksheet.getRow(1).values.slice(1)
);

    rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      if (rows.length >= MAX_ROWS + 1) return;


const values = row.values.slice(1);
const item = {};


for (const value of values) {
  if (
    value !== null &&
    typeof value === "object" &&
    (
      Object.prototype.hasOwnProperty.call(value, "formula") ||
      Object.prototype.hasOwnProperty.call(value, "sharedFormula")
    )
  ) {
    throw new Error(
      `Excel formulas are not allowed in inventory uploads (row ${rowNumber}).`
    );
  }

  if (value !== null && typeof value === "object") {
    throw new Error(
      `Unsupported Excel cell value in row ${rowNumber}.`
    );
  }
}



      headers.forEach((header, index) => {
        item[header] = values[index] ?? "";
      });

      rows.push(item);
    });
  } else {
    throw new Error("Unsupported inventory file format.");
  }

  if (!rows.length) {
    throw new Error("The inventory file contains no items.");
  }

  if (rows.length > MAX_ROWS) {
    throw new Error(`Inventory uploads are limited to ${MAX_ROWS} rows.`);
  }

  return rows;
}

function validateInventoryRows(rows, existingItems = []) {
  const errors = [];
  const validItems = [];
  const seen = new Set();

  const makeKey = (name, itemType) =>
    `${itemType.trim().toLowerCase()}:${name.trim().toLowerCase()}`;

  const existingKeys = new Set(
    existingItems.map(item =>
      makeKey(String(item.name || ""), String(item.itemType || ""))
    )
  );

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const name = String(row.name ?? "").trim();
    const itemType = String(row.itemType ?? "").trim().toLowerCase();
    const category = String(row.category ?? "").trim();
    const description = String(row.description ?? "").trim();
    const imageUrl = String(row.imageUrl ?? "").trim();
    const priceText = String(row.price ?? "").trim();

    const rowErrors = [];

    if (!name || name.length > 150) {
      rowErrors.push("Name must contain 1–150 characters.");
    }

    if (!["product", "service"].includes(itemType)) {
      rowErrors.push("Item type must be product or service.");
    }

    const price = priceText === "" ? undefined : Number(priceText);

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      rowErrors.push("Price must be a valid nonnegative number.");
    }

    if (name && ["product", "service"].includes(itemType)) {
      const key = makeKey(name, itemType);

      if (seen.has(key)) {
        rowErrors.push("Duplicate item within the uploaded file.");
      } else if (existingKeys.has(key)) {
        rowErrors.push("Item already exists in this business inventory.");
      }

      seen.add(key);
    }

    if (rowErrors.length) {
      errors.push({
        row: rowNumber,
        messages: rowErrors
      });
      return;
    }

    validItems.push({
      name,
      itemType,
      category,
      description,
      price,
      imageUrl,
      isAvailable: true,
      moderationStatus: "pending"
    });
  });

  return {
    validItems,
    errors,
    isValid: errors.length === 0
  };
}

function validateInventoryRows(rows, existingItems = []) {
  const errors = [];
  const validItems = [];
  const seen = new Set();

  const makeKey = (name, itemType) =>
    `${itemType.trim().toLowerCase()}:${name.trim().toLowerCase()}`;

  const existingKeys = new Set(
    existingItems.map(item =>
      makeKey(String(item.name || ""), String(item.itemType || ""))
    )
  );

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const name = String(row.name ?? "").trim();
    const itemType = String(row.itemType ?? "").trim().toLowerCase();
    const category = String(row.category ?? "").trim();
    const description = String(row.description ?? "").trim();
    const imageUrl = String(row.imageUrl ?? "").trim();
    const priceText = String(row.price ?? "").trim();

    const rowErrors = [];

    if (!name || name.length > 150) {
      rowErrors.push("Name must contain 1–150 characters.");
    }

    if (!["product", "service"].includes(itemType)) {
      rowErrors.push("Item type must be product or service.");
    }

    const price = priceText === "" ? undefined : Number(priceText);

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      rowErrors.push("Price must be a valid nonnegative number.");
    }

    if (name && ["product", "service"].includes(itemType)) {
      const key = makeKey(name, itemType);

      if (seen.has(key)) {
        rowErrors.push("Duplicate item within the uploaded file.");
      } else if (existingKeys.has(key)) {
        rowErrors.push("Item already exists in this business inventory.");
      }

      seen.add(key);
    }

    if (rowErrors.length) {
      errors.push({
        row: rowNumber,
        messages: rowErrors
      });
      return;
    }

    validItems.push({
      name,
      itemType,
      category,
      description,
      price,
      imageUrl,
      isAvailable: true,
      moderationStatus: "pending"
    });
  });

  return {
    validItems,
    errors,
    isValid: errors.length === 0
  };
}

function validateInventoryRows(rows, existingItems = []) {
  const errors = [];
  const validItems = [];
  const seen = new Set();

  const makeKey = (name, itemType) =>
    `${itemType.trim().toLowerCase()}:${name.trim().toLowerCase()}`;

  const existingKeys = new Set(
    existingItems.map(item =>
      makeKey(String(item.name || ""), String(item.itemType || ""))
    )
  );

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const name = String(row.name ?? "").trim();
    const itemType = String(row.itemType ?? "").trim().toLowerCase();
    const category = String(row.category ?? "").trim();
    const description = String(row.description ?? "").trim();
    const imageUrl = String(row.imageUrl ?? "").trim();
    const priceText = String(row.price ?? "").trim();

    const rowErrors = [];

    if (!name || name.length > 150) {
      rowErrors.push("Name must contain 1–150 characters.");
    }

    if (!["product", "service"].includes(itemType)) {
      rowErrors.push("Item type must be product or service.");
    }

    const price = priceText === "" ? undefined : Number(priceText);

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      rowErrors.push("Price must be a valid nonnegative number.");
    }

    if (name && ["product", "service"].includes(itemType)) {
      const key = makeKey(name, itemType);

      if (seen.has(key)) {
        rowErrors.push("Duplicate item within the uploaded file.");
      } else if (existingKeys.has(key)) {
        rowErrors.push("Item already exists in this business inventory.");
      }

      seen.add(key);
    }

    if (rowErrors.length) {
      errors.push({
        row: rowNumber,
        messages: rowErrors
      });
      return;
    }

    validItems.push({
      name,
      itemType,
      category,
      description,
      price,
      imageUrl,
      isAvailable: true,
      moderationStatus: "pending"
    });
  });

  return {
    validItems,
    errors,
    isValid: errors.length === 0
  };
}

function validateInventoryRows(rows, existingItems = []) {
  const errors = [];
  const validItems = [];
  const seen = new Set();

  const makeKey = (name, itemType) =>
    `${itemType.trim().toLowerCase()}:${name.trim().toLowerCase()}`;

  const existingKeys = new Set(
    existingItems.map(item =>
      makeKey(String(item.name || ""), String(item.itemType || ""))
    )
  );

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const name = String(row.name ?? "").trim();
    const itemType = String(row.itemType ?? "").trim().toLowerCase();
    const category = String(row.category ?? "").trim();
    const description = String(row.description ?? "").trim();
    const imageUrl = String(row.imageUrl ?? "").trim();
    const priceText = String(row.price ?? "").trim();

    const rowErrors = [];

    if (!name || name.length > 150) {
      rowErrors.push("Name must contain 1–150 characters.");
    }

    if (!["product", "service"].includes(itemType)) {
      rowErrors.push("Item type must be product or service.");
    }

    const price = priceText === "" ? undefined : Number(priceText);

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      rowErrors.push("Price must be a valid nonnegative number.");
    }

    if (name && ["product", "service"].includes(itemType)) {
      const key = makeKey(name, itemType);

      if (seen.has(key)) {
        rowErrors.push("Duplicate item within the uploaded file.");
      } else if (existingKeys.has(key)) {
        rowErrors.push("Item already exists in this business inventory.");
      }

      seen.add(key);
    }

    if (rowErrors.length) {
      errors.push({
        row: rowNumber,
        messages: rowErrors
      });
      return;
    }

    validItems.push({
      name,
      itemType,
      category,
      description,
      price,
      imageUrl,
      isAvailable: true,
      moderationStatus: "pending"
    });
  });

  return {
    validItems,
    errors,
    isValid: errors.length === 0
  };
}

function validateInventoryRows(rows, existingItems = []) {
  const errors = [];
  const validItems = [];
  const seen = new Set();

  const makeKey = (name, itemType) =>
    `${itemType.trim().toLowerCase()}:${name.trim().toLowerCase()}`;

  const existingKeys = new Set(
    existingItems.map(item =>
      makeKey(String(item.name || ""), String(item.itemType || ""))
    )
  );

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const name = String(row.name ?? "").trim();
    const itemType = String(row.itemType ?? "").trim().toLowerCase();
    const category = String(row.category ?? "").trim();
    const description = String(row.description ?? "").trim();
    const imageUrl = String(row.imageUrl ?? "").trim();
    const priceText = String(row.price ?? "").trim();

    const rowErrors = [];

    if (!name || name.length > 150) {
      rowErrors.push("Name must contain 1–150 characters.");
    }

    if (!["product", "service"].includes(itemType)) {
      rowErrors.push("Item type must be product or service.");
    }

    const price = priceText === "" ? undefined : Number(priceText);

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      rowErrors.push("Price must be a valid nonnegative number.");
    }

    if (name && ["product", "service"].includes(itemType)) {
      const key = makeKey(name, itemType);

      if (seen.has(key)) {
        rowErrors.push("Duplicate item within the uploaded file.");
      } else if (existingKeys.has(key)) {
        rowErrors.push("Item already exists in this business inventory.");
      }

      seen.add(key);
    }

    if (rowErrors.length) {
      errors.push({
        row: rowNumber,
        messages: rowErrors
      });
      return;
    }

    validItems.push({
      name,
      itemType,
      category,
      description,
      price,
      imageUrl,
      isAvailable: true,
      moderationStatus: "pending"
    });
  });

  return {
    validItems,
    errors,
    isValid: errors.length === 0
  };
}

function validateInventoryRows(rows, existingItems = []) {
  const errors = [];
  const validItems = [];
  const seen = new Set();

  const makeKey = (name, itemType) =>
    `${itemType.trim().toLowerCase()}:${name.trim().toLowerCase()}`;

  const existingKeys = new Set(
    existingItems.map(item =>
      makeKey(String(item.name || ""), String(item.itemType || ""))
    )
  );

  rows.forEach((row, index) => {
    const rowNumber = index + 2;

    const name = String(row.name ?? "").trim();
    const itemType = String(row.itemType ?? "").trim().toLowerCase();
    const category = String(row.category ?? "").trim();
    const description = String(row.description ?? "").trim();
    const imageUrl = String(row.imageUrl ?? "").trim();
    const priceText = String(row.price ?? "").trim();

    const rowErrors = [];

    if (!name || name.length > 150) {
      rowErrors.push("Name must contain 1–150 characters.");
    }

    if (!["product", "service"].includes(itemType)) {
      rowErrors.push("Item type must be product or service.");
    }

    const price = priceText === "" ? undefined : Number(priceText);

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      rowErrors.push("Price must be a valid nonnegative number.");
    }

    if (name && ["product", "service"].includes(itemType)) {
      const key = makeKey(name, itemType);

      if (seen.has(key)) {
        rowErrors.push("Duplicate item within the uploaded file.");
      } else if (existingKeys.has(key)) {
        rowErrors.push("Item already exists in this business inventory.");
      }

      seen.add(key);
    }

    if (rowErrors.length) {
      errors.push({
        row: rowNumber,
        messages: rowErrors
      });
      return;
    }

    validItems.push({
      name,
      itemType,
      category,
      description,
      price,
      imageUrl,
      isAvailable: true,
      moderationStatus: "pending"
    });
  });

  return {
    validItems,
    errors,
    isValid: errors.length === 0
  };
}

module.exports = {
  parseInventoryFile,
  validateInventoryRows,
  REQUIRED_COLUMNS,
  SUPPORTED_COLUMNS,
  MAX_ROWS
};

