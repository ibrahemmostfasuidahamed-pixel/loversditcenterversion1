import type { Metadata } from 'next';
import SessionWrapper from '@/components/admin/SessionWrapper';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Admin — Lovers Diet Center',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: '#050507', cursor: 'auto' }}>
        <SessionWrapper>
          <div className="admin-root admin-layout">
            {/* Sidebar spans full height (rows 1-2) */}
            <AdminSidebar />
            {/* Topbar: row 1, col 2 */}
            <AdminTopBar />
            {/* Content: row 2, col 2 */}
            <main style={{
              gridRow: 2, gridColumn: 2,
              overflowY: 'auto',
              padding: '24px',
              background: 'var(--bg-base)',
            }}>
              {children}
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
