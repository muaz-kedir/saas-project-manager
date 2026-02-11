// Workspace invite tests
const request = require("supertest");
const app = require("../src/app");
const WorkspaceMember = require("../src/models/WorkspaceMember");
const { 
  createTestUser, 
  createTestWorkspace,
  createWorkspaceMember 
} = require("./helpers/testHelpers");

// Load test setup
require("./setup");

describe("Workspace Invite API", () => {
  let owner;
  let workspace;
  let userToInvite;

  beforeEach(async () => {
    // Create workspace owner
    owner = await createTestUser({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123"
    });

    // Create workspace
    workspace = await createTestWorkspace(owner._id, {
      name: "Test Workspace"
    });

    // Create user to invite
    userToInvite = await createTestUser({
      name: "Invited User",
      email: "invited@example.com",
      password: "password123"
    });
  });

  describe("POST /api/workspaces/:workspaceId/invite", () => {
    it("should invite user to workspace successfully", async () => {
      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .set("x-user-id", owner._id.toString())
        .send({
          email: userToInvite.email,
          role: "ADMIN"
        })
        .expect(201);

      expect(response.body).toHaveProperty("message", "User invited successfully");
      expect(response.body.member).toHaveProperty("email", userToInvite.email);
      expect(response.body.member).toHaveProperty("role", "ADMIN");

      // Verify membership was created
      const membership = await WorkspaceMember.findOne({
        workspace: workspace._id,
        user: userToInvite._id
      });
      expect(membership).toBeTruthy();
      expect(membership.role).toBe("ADMIN");
    });

    it("should default to MEMBER role if not specified", async () => {
      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .set("x-user-id", owner._id.toString())
        .send({
          email: userToInvite.email
        })
        .expect(201);

      expect(response.body.member).toHaveProperty("role", "MEMBER");
    });

    it("should not invite user if not workspace owner", async () => {
      // Create another user who is a member but not owner
      const member = await createTestUser({
        name: "Member User",
        email: "member@example.com",
        password: "password123"
      });

      await createWorkspaceMember(workspace._id, member._id, "MEMBER");

      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .set("x-user-id", member._id.toString())
        .send({
          email: userToInvite.email,
          role: "ADMIN"
        })
        .expect(403);

      expect(response.body).toHaveProperty("error", "Permission denied");
      expect(response.body).toHaveProperty("message", "Only workspace owners can invite users");
    });

    it("should not invite user who is already a member", async () => {
      // Add user as member first
      await createWorkspaceMember(workspace._id, userToInvite._id, "MEMBER");

      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .set("x-user-id", owner._id.toString())
        .send({
          email: userToInvite.email,
          role: "ADMIN"
        })
        .expect(400);

      expect(response.body).toHaveProperty("error", "User already a member");
    });

    it("should not invite non-existent user", async () => {
      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .set("x-user-id", owner._id.toString())
        .send({
          email: "nonexistent@example.com",
          role: "ADMIN"
        })
        .expect(404);

      expect(response.body).toHaveProperty("error", "User not found");
    });

    it("should not invite without authentication", async () => {
      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .send({
          email: userToInvite.email,
          role: "ADMIN"
        })
        .expect(401);

      expect(response.body).toHaveProperty("error", "Authentication required");
    });

    it("should not invite with invalid workspace ID", async () => {
      const response = await request(app)
        .post("/api/workspaces/invalid-id/invite")
        .set("x-user-id", owner._id.toString())
        .send({
          email: userToInvite.email,
          role: "ADMIN"
        })
        .expect(400);

      expect(response.body).toHaveProperty("error", "Invalid workspace ID");
    });

    it("should not invite with invalid role", async () => {
      const response = await request(app)
        .post(`/api/workspaces/${workspace._id}/invite`)
        .set("x-user-id", owner._id.toString())
        .send({
          email: userToInvite.email,
          role: "INVALID_ROLE"
        })
        .expect(400);

      expect(response.body).toHaveProperty("error", "Invalid role");
    });
  });
});
