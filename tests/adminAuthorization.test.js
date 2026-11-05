const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  requireDepartment
} = require("../core/middleware/adminAuthorization");

function checkAccess(admin, department) {
  return new Promise((resolve, reject) => {
    const req = { currentAdmin: admin };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        resolve({
          status: this.statusCode,
          body
        });
        return this;
      }
    };

    requireDepartment(department)(
      req,
      res,
      (error) => {
        if (error) return reject(error);
        resolve({ status: 200 });
      }
    );
  });
}

test("CEO can access any department", async () => {
  const result = await checkAccess(
    { role: "ceo" },
    "cybersecurity"
  );

  assert.equal(result.status, 200);
});

test("Executive manager can access assigned department", async () => {
  const result = await checkAccess(
    {
      role: "executive_manager",
      division: "executive",
      managedDepartments: ["technology"]
    },
    "technology"
  );

  assert.equal(result.status, 200);
});

test("Executive manager cannot access unassigned department", async () => {
  const result = await checkAccess(
    {
      role: "executive_manager",
      division: "executive",
      managedDepartments: ["technology"]
    },
    "payroll"
  );

  assert.equal(result.status, 403);
});

test("Other administrator roles cannot manage departments", async () => {
  const result = await checkAccess(
    {
      role: "business_gm",
      division: "business",
      managedDepartments: ["technology"]
    },
    "technology"
  );

  assert.equal(result.status, 403);
});

test("Unauthenticated requests are rejected", async () => {
  const result = await checkAccess(
    null,
    "technology"
  );

  assert.equal(result.status, 401);
});

test("Executive manager must belong to executive division", async () => {
  const result = await checkAccess(
    {
      role: "executive_manager",
      division: "business",
      managedDepartments: ["technology"]
    },
    "technology"
  );

  assert.equal(result.status, 403);
});
