
const crypto = require("node:crypto");

function ensureBusinessInventoryCsrf(req, res, next) {
  if (!req.session) {
    return res.status(500).json({
      message: "Session unavailable."
    });
  }

  if (
    req.session.role !== "business" ||
    !req.session.userId
  ) {
    return res.status(401).json({
      message: "Business login required."
    });
  }

  if (!req.session.businessInventoryCsrfToken) {
    req.session.businessInventoryCsrfToken =
      crypto.randomBytes(32).toString("hex");
  }

  res.locals.businessInventoryCsrfToken =
    req.session.businessInventoryCsrfToken;

  return next();
}

function requireBusinessInventoryCsrf(req, res, next) {
  const expected = req.session?.businessInventoryCsrfToken;

  // Multipart uploads must send the token in this header.
  const supplied = req.get("X-CSRF-Token");

  if (
    typeof expected !== "string" ||
    typeof supplied !== "string"
  ) {
    return res.status(403).json({
      message: "Invalid or missing inventory CSRF token."
    });
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);

  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return res.status(403).json({
      message: "Invalid or missing inventory CSRF token."
    });
  }

  return next();
}

module.exports = {
  ensureBusinessInventoryCsrf,
  requireBusinessInventoryCsrf
};
