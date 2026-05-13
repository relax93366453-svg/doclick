import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { module: string } }) {
  return NextResponse.json({
    ok: true,
    module: params.module,
    data: [],
    message: "正式版請依 module 對應 Prisma Model，並檢查 workspaceId 與 RBAC 權限。"
  });
}

export async function POST(request: Request, { params }: { params: { module: string } }) {
  try {
    const body = await request.json();

    return NextResponse.json({
      ok: true,
      module: params.module,
      data: {
        id: crypto.randomUUID(),
        ...body,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "新增資料失敗", error: String(error) }, { status: 500 });
  }
}
