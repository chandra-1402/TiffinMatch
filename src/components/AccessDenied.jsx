import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  ChefHat, 
  UserCheck
} from 'lucide-react';

export default function AccessDenied({ 
  portalName, 
  user, 
  onOpenLogin, 
  onReturnToDashboard 
}) {
  return (
    <div className="container" style={{ padding: '64px 20px', maxWidth: '640px', textAlign: 'center' }}>
      <div 
        style={{ 
          background: '#ffffff', 
          borderRadius: 'var(--radius-lg)', 
          padding: '48px 36px', 
          border: '1.5px solid #FECACA',
          boxShadow: '0 16px 36px rgba(239, 68, 68, 0.08)' 
        }}
      >
        <div 
          style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            background: '#FEF2F2', 
            color: '#DC2626', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px',
            border: '2px solid #FCA5A5'
          }}
        >
          <Lock size={36} />
        </div>

        <div className="badge-tag" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', marginBottom: '12px' }}>
          <ShieldAlert size={14} />
          SECURITY BOUNDARY ENFORCED
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: '10px' }}>
          Access Denied: Restricted Portal
        </h2>

        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
          You are currently signed in with Customer ID: <strong style={{ color: '#0F172A' }}>{user.uniqueId}</strong>.
          Customers are strictly prohibited from viewing or modifying {portalName}.
        </p>

        <div 
          style={{ 
            background: '#F8FAFC', 
            border: '1px solid #E2E8F0', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px 20px', 
            marginBottom: '28px',
            textAlign: 'left',
            fontSize: '0.86rem',
            color: '#475569'
          }}
        >
          <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            Portal Security Policy:
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.5 }}>
            <li>Kitchen capacity management is exclusively reserved for verified partner home cooks.</li>
            <li>Hygiene audits and platform compliance require authorized officer credentials.</li>
            <li>Each partner account is uniquely fingerprinted by their government and FSSAI ID.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-secondary"
            onClick={onReturnToDashboard}
          >
            <ArrowLeft size={16} />
            Return to Customer Dashboard
          </button>

          <button 
            className="btn-primary"
            style={{ background: '#0F172A' }}
            onClick={onOpenLogin}
          >
            <KeyRound size={16} />
            Authenticate with Partner ID
          </button>
        </div>
      </div>
    </div>
  );
}
