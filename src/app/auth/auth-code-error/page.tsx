
import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#dc2626' }}>Authentication Error</h1>
        <p style={{ marginTop: '16px', color: '#4b5563' }}>There was a problem authenticating your account. Please try again.</p>
        <Link href="/login" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', backgroundColor: '#f97316', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: '500' }}>
          Return to Login
        </Link>
      </div>
    </div>
  );
}
