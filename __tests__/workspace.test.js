// Workspace tests
const request = require("supertest");
const app = require("../src/app");
const Workspace = require("../src/models/Workspace");
const WorkspaceMember = require("../src/models/WorkspaceMember");
const { createTestUser, createTestWorkspace } = require("./helpers/testHelpers");

// Load test setup
require("./setup");

describe("Workspace API", () => {
  let testUser;
  let userId;

  beforeEach(async () => {
    testUser = await createTestUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });
    userId = testUser._id.toString();
  });

  describe("POST /api/workspaces", () => {
    it("should create a new workspace successfully", async () => {
      const workspaceData = {
        name: "My Workspace",
        description: "Test workspace"
      };

      const response = await request(app)
        .post("/api/workspaces")
        .set("x-user-id", userId)
        .send(workspaceData)
        .expect(201);

      expect(response.body).toHaveProperty("message", "Workspace created successfully");
      expect(response.body.workspace).toHaveProperty("id");
      expect(response.body.workspace).toHaveProperty("name", workspaceData.name);

      // Verify workspace was created in database
      const workspace = await Workspace.findById(response.body.workspace.id);
      expect(workspace).toBeTruthy();
      expect(workspace.name).toBe(workspaceData.name);

      // Verify owner was added as member
      const membership = await WorkspaceMember.findOne({
        workspace: workspace._id,
        user: testUser._id
      });
      expect(membership).toBeTruthy();
      expect(membership.role).toBe("OWNER");
    });

    it("should not create workspace without authentication", async () => {
      const workspaceData = {
        name: "My Workspace",
        description: "Test workspace"
      };

      const response = await request(app)
        .post("/api/workspaces")
        .send(workspaceData)
        .expect(401);

      expect(response.body).toHaveProperty("error", "Authentication required");
    });

    it("should not create workspace with invalid user ID", async () => {
      const workspaceData = {
        name: "My Workspace",
        description: "Test workspace"
      };

      const response = await request(app)
        .post("/api/workspaces")
        .set("x-user-id", "invalid-id")
        .send(workspaceData)
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid user ID format");
    });
  });

  describe("GET /api/workspaces", () => {
    it("should get all workspaces for authenticated user", async () => {
      // Create two workspaces
      await createTestWorkspace(testUser._id, { name: "Workspace 1" });
      await createTestWorkspace(testUser._id, { name: "Workspace 2" });

      const response = await request(app)
        .get("/api/workspaces")
        .set("x-user-id", userId)
        .expect(200);

      expect(response.body).toHaveProperty("count", 2);
      expect(response.body.workspaces).toHaveLength(2);
      expect(response.body.workspaces[0]).toHaveProperty("workspace");
      expect(response.body.workspaces[0]).toHaveProperty("role", "OWNER");
    });

    it("should return empty array if user has no workspaces", async () => {
      const response = await request(app)
        .get("/api/workspaces")
        .set("x-user-id", userId)
        .expect(200);

      expect(response.body).toHaveProperty("count", 0);
      expect(response.body.workspaces).toHaveLength(0);
    });

    it("should not get workspaces without authentication", async () => {
      const response = await request(app)
        .get("/api/workspaces")
        .expect(401);

      expect(response.body).toHaveProperty("error", "Authentication required");
    });
  });
});
