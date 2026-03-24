import { prisma } from '../src/lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // Create default admin if not exists
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

  // Seed real site settings
  const defaults = [
    // Social Media
    { key: 'instagram_url',   value: 'https://www.instagram.com/lovers_diet_center/' },
    { key: 'tiktok_url',      value: 'https://www.tiktok.com/@loversdiet' },
    { key: 'youtube_url',     value: 'https://www.youtube.com/channel/UCb0n5fTajQsT8oUC3_2sG6Q' },
    { key: 'snapchat_url',    value: 'https://snapchat.com/t/iNZP0R7H' },
    { key: 'trendyol_url',    value: 'https://www.trendyol.com/ar/sr?mid=1188498' },
    // WhatsApp
    { key: 'whatsapp_number', value: '971529033110' },
    { key: 'whatsapp_msg_ar', value: 'مرحباً، أريد حجز استشارة في لوفر دايت سنتر' },
    { key: 'whatsapp_msg_en', value: "Hello, I'd like to book a consultation at Lover Diet Center" },
    // Clinic Info
    { key: 'clinic_name_ar',  value: 'لوفرز دايت سنتر' },
    { key: 'clinic_name_en',  value: 'Lovers Diet Center' },
    { key: 'clinic_address_ar', value: 'الإمارات العربية المتحدة' },
    { key: 'clinic_phone',    value: '+971529033110' },
    { key: 'clinic_email',    value: '' },
    { key: 'google_maps_url', value: '' },
    // Notification emails
    { key: 'notify_bookings_email', value: '' },
    { key: 'notify_messages_email', value: '' },
    { key: 'whatsapp_alerts', value: 'false' },
  ];

  for (const s of defaults) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Real site settings seeded');
  console.log('🎉 Database seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
