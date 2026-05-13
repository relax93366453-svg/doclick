import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { id: "demo-workspace" },
    update: {},
    create: {
      id: "demo-workspace",
      name: "Demo 企業",
      plan: "Pro"
    }
  });

  const users = [
    ["Owner", "owner@demo.com", "owner"],
    ["Admin", "admin@demo.com", "admin"],
    ["Manager", "manager@demo.com", "department-manager"],
    ["Staff", "staff@demo.com", "staff"],
    ["Field Staff", "field@demo.com", "field-staff"],
    ["Finance", "finance@demo.com", "finance"],
    ["HR", "hr@demo.com", "hr"]
  ];

  for (const [name, email, roleKey] of users) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        workspaceId: workspace.id,
        name,
        email,
        roleKey,
        passwordHash: await bcrypt.hash("password123", 10)
      }
    });
  }

  await prisma.customer.createMany({
    data: [
      { workspaceId: workspace.id, name: "米朵電商", contact: "陳小姐", phone: "0912-000-001", stage: "報價中" },
      { workspaceId: workspace.id, name: "日日寵物店", contact: "林先生", phone: "0912-000-002", stage: "需求確認" },
      { workspaceId: workspace.id, name: "晨光製造", contact: "王經理", phone: "0912-000-003", stage: "成交" }
    ],
    skipDuplicates: true
  });

  await prisma.product.createMany({
    data: [
      { workspaceId: workspace.id, name: "精華液 A01", sku: "SKU-A01", stock: 128, safeStock: 30, price: 1280, cost: 450 },
      { workspaceId: workspace.id, name: "面膜 B02", sku: "SKU-B02", stock: 18, safeStock: 50, price: 399, cost: 120 },
      { workspaceId: workspace.id, name: "包材 C03", sku: "SKU-C03", stock: 400, safeStock: 100, price: 10, cost: 3 }
    ],
    skipDuplicates: true
  });

  await prisma.form.create({
    data: {
      workspaceId: workspace.id,
      name: "外勤客戶拜訪回報",
      description: "支援 GPS、圖片上傳與手寫簽名",
      category: "外勤服務",
      needApproval: true,
      fields: {
        create: [
          { type: "text", label: "客戶名稱", key: "customerName", required: true, sortOrder: 1 },
          { type: "gps", label: "GPS 定位", key: "gps", required: true, sortOrder: 2 },
          { type: "image", label: "現場照片", key: "photo", required: false, sortOrder: 3 },
          { type: "signature", label: "客戶簽名", key: "signature", required: true, sortOrder: 4 }
        ]
      }
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
