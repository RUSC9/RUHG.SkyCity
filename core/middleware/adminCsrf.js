const crypto = require("node:crypto");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function ensureCsrfToken(req, res, next) {
  if (!req.session) {
    return res.status(500).json({
      message: "Session unavailable."
    });
  }

  if (!req.session.admin) {
    return next();
  }

  if (!req.session.adminCsrfToken) {
    req.session.adminCsrfToken = crypto.randomBytes(32).toString("hex");
  }

  res.locals.adminCsrfToken = req.session.adminCsrfToken;
  next();
}

function requireAdminCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const expected = req.session?.adminCsrfToken;
  const supplied =
    req.get("X-CSRF-Token") ||
    req.body?._csrf;

  if (
    typeof expected !== "string" ||
    typeof supplied !== "string"
  ) {
    return res.status(403).json({
      message: "Invalid or missing CSRF token."
    });
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);

  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return res.status(403).json({
      message: "Invalid or missing CSRF token."
    });
  }

  next();
}

module.exports = {
  ensureCsrfToken,
  requireAdminCsrf
};