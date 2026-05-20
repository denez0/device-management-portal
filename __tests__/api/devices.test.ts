import { GET, POST } from "@/app/api/devices/route";
import { prisma } from "@/lib/prisma";

const createdDeviceIds: number[] = [];

function createPostRequest(body: unknown): Request {
  return new Request("http://localhost/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(async () => {
  if (createdDeviceIds.length > 0) {
    await prisma.device.deleteMany({
      where: { id: { in: createdDeviceIds } },
    });
    createdDeviceIds.length = 0;
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/devices", () => {
  it("returns 200 and a list of devices (array)", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data: unknown = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe("POST /api/devices", () => {
  it("returns 201 and created device in body for valid data", async () => {
    const response = await POST(
      createPostRequest({ name: "Test", model: "X1", userId: "user-1" })
    );

    expect(response.status).toBe(201);

    const device = (await response.json()) as {
      id: number;
      name: string;
      model: string;
      userId: string;
    };

    expect(device).toMatchObject({
      name: "Test",
      model: "X1",
      userId: "user-1",
    });
    expect(typeof device.id).toBe("number");

    createdDeviceIds.push(device.id);
  });

  it("returns 400 with validation details for invalid data", async () => {
    const response = await POST(
      createPostRequest({ name: "", model: "", userId: "" })
    );

    expect(response.status).toBe(400);

    const body = (await response.json()) as {
      issues: unknown[];
      formErrors: string[];
      fieldErrors: Record<string, string[]>;
    };

    expect(body.issues).toBeDefined();
    expect(Array.isArray(body.issues)).toBe(true);
    expect(body.fieldErrors).toBeDefined();
  });
});
