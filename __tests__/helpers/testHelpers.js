// Test helper functions
const User = require("../../src/models/User");
const Workspace = require("../../src/models/Workspace");
const WorkspaceMember = require("../../src/models/WorkspaceMember");
const bcrypt = require("bcryptjs");

// Create a test user
const createTestUser = async (userData = {}) => {
  const defaultData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  };

  const data = { ...defaultData, ...userData };
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword
  });

  return user;
};

// Create a test workspace
const createTestWorkspace = async (ownerId, workspaceData = {}) => {
  const defaultData = {
    name: "Test Workspace",
    description: "Test description"
  };

  const data = { ...defaultData, ...workspaceData };

  const workspace = await Workspace.create({
    name: data.name,
    description: data.description,
    owner: ownerId
  });

  // Add owner as member
  await WorkspaceMember.create({
    user: ownerId,
    workspace: workspace._id,
    role: "OWNER"
  });

  return workspace;
};

// Create workspace member
const createWorkspaceMember = async (workspaceId, userId, role = "MEMBER") => {
  const member = await WorkspaceMember.create({
    workspace: workspaceId,
    user: userId,
    role
  });

  return member;
};

module.exports = {
  createTestUser,
  createTestWorkspace,
  createWorkspaceMember
};
