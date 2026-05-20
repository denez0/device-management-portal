import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDeviceSchema, zodValidationDetails } from "@/lib/validation";

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(devices, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createDeviceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(zodValidationDetails(parsed.error), {
        status: 400,
      });
    }

    const { name, model, userId, status } = parsed.data;

    const device = await prisma.device.create({
      data: {
        name,
        model,
        userId,
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(device, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create device" },
      { status: 500 }
    );
  }
}
