// __tests__/app.test.ts

import request from "supertest";
import app from "../src/";
import { PostgresConnection } from "../src/data/PostgresConnection";
import { execSync } from "child_process";

beforeAll(() => {
  // Start Docker Compose services for testing
  execSync("docker-compose up -d", {
    stdio: "inherit",
  });
});

afterAll(() => {
  // Stop and remove Docker Compose services after testing
  execSync("docker-compose  down", {
    stdio: "inherit",
  });
});

describe("GET /", () => {
  it("responds with status 405", async () => {
    const connection = new PostgresConnection();
    const expressApp = await app(connection);
    const response = await request(expressApp).get("/");
    expect(response.status).toBe(405);
  });
});
