import { expect, test } from "bun:test";
import { createHttpServer } from "./app";
import { makeCardsObj } from "./cards/Cards";
import { getMetadataArgsStorage } from "typeorm";

test("database entities declare column types without emitted decorator metadata", () => {
  const columns = getMetadataArgsStorage().columns;
  expect(columns.length).toBeGreaterThan(0);
  for (const column of columns.filter((column) => column.mode === "regular")) {
    expect(column.options.type).toBeDefined();
  }
});

test("Bun serves public HTTP routes without opening a database connection", async () => {
  const { server, io } = createHttpServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Missing test server address");
    }
    const response = await fetch(`http://127.0.0.1:${address.port}/api/styles`);
    expect(response.status).toBe(200);
    const styles = (await response.json()) as Array<{ name: string; aiPreferences: unknown }>;
    expect(styles.find((style) => style.name === "Grappler")?.aiPreferences).toBeDefined();
    expect(Object.keys(await makeCardsObj()).length).toBeGreaterThan(0);
  } finally {
    await new Promise<void>((resolve) => io.close(() => resolve()));
  }
});
