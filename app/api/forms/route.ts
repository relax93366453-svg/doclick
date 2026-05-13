import { NextResponse } from "next/server";

const demoForms = [
  {
    id: "field-report",
    name: "外勤客戶拜訪回報",
    description: "GPS、照片與簽名",
    fields: [
      { id: "1", type: "text", label: "客戶名稱", key: "customerName", required: true },
      { id: "2", type: "gps", label: "GPS 定位", key: "gps", required: true },
      { id: "3", type: "signature", label: "客戶簽名", key: "signature", required: true }
    ]
  }
];

export async function GET() {
  return NextResponse.json({ ok: true, data: demoForms });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      ok: true,
      message: "表單已建立。正式版請接 Prisma Form / FormField。",
      data: { id: crypto.randomUUID(), ...body }
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "建立表單失敗", error: String(error) }, { status: 500 });
  }
}
