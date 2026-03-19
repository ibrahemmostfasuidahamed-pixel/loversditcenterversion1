import { prisma } from '../src/lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // Check if admin already exists
  const existing = await prisma.adminUser.findUnique({ where: { email: 'admin' } });
  if (!existing) {
    const hash = await bcryptjs.hash('admin', 12);
    await prisma.adminUser.create({
      data: { name: 'Admin', email: 'admin', passwordHash: hash, role: 'super_admin', isFirstLogin: true },
    });
    console.log('✅ Default admin created (email: admin, password: admin)');
    console.log('⚠️  PLEASE CHANGE THE PASSWORD ON FIRST LOGIN!');
  } else {
    console.log('Admin user already exists, skipping.');
  }

  // Seed default site settings
  const defaults = [
    { key: 'whatsapp_number', value: '971529033110' },
    { key: 'whatsapp_msg_ar', value: 'مرحباً، أريد الاستفسار عن خدماتكم' },
    { key: 'whatsapp_msg_en', value: "Hello, I'd like to know more about your services" },
    { key: 'clinic_name_ar', value: 'لوفرز دايت سنتر' },
    { key: 'clinic_name_en', value: 'Lovers Diet Center' },
    { key: 'instagram_url', value: 'https://instagram.com/loversdiet' },
  ];

  for (const s of defaults) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Default settings seeded');
  console.log('🎉 Database seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
