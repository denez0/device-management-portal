import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSupportRequestSchema,
  zodValidationDetails,
} from "@/lib/validation";

export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createSupportRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(zodValidationDetails(parsed.error), {
        status: 400,
      });
    }

    const { deviceId, requestType, description, status } = parsed.data;

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json(
        { error: `Device with id ${deviceId} not found` },
        { status: 400 }
      );
    }

    const created = await prisma.request.create({
      data: {
        deviceId,
        requestType,
        description,
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
