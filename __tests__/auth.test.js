// Auth tests
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const { createTestUser } = require("./helpers/testHelpers");

// Load test setup
require("./setup");

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message", "User registered successfully");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email", userData.email);
      expect(response.body.user).toHaveProperty("name", userData.name);
      expect(response.body.user).not.toHaveProperty("password");

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it("should not register user with existing email", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };

      // Create user first
      await createTestUser(userData);

      // Try to register again with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "User already exists");
    });

    it("should not register user without required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "John Doe"
          // missing email and password
        })
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login user with correct credentials", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };

      // Create user first
      await createTestUser(userData);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email", userData.email);
    });

    it("should not login with incorrect password", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };

      await createTestUser(userData);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "wrongpassword"
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123"
        })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
