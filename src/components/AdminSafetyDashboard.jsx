import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  TrendingUp, 
  Users, 
  Activity,
  Check,
  X
} from 'lucide-react';
import { ADMIN_AUDITS, PLATFORM_STATS } from '../data/mockData';

export default function AdminSafetyDashboard() {
  const [audits, setAudits] = useState(ADMIN_AUDITS);

  const handleApprove = (auditId) => {
    setAudits(prev => prev.map(a => 
      a.id === auditId 
        ? { ...a, status: 'Verified & Approved (Score: 97%)', notes: 'Approved after live video verification and RO certificate inspection.' } 
        : a
    ));
  };

  return (
    <div className="container admin-container">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="badge-tag badge-emerald" style={{ marginBottom: '8px' }}>
          <ShieldCheck size={14} />
          TRUST, HYGIENE & CAPACITY MONITORING
        </div>
        <h1 style={{ fontSize: '2.2rem', color: '#0F172A', marginBottom: '6px' }}>
          Platform Safety & Verification Hub
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Supervising food safety hygiene protocols, kitchen verifications, and city-wide capacity utilization.
        </p>
      </div>

      {/* Admin Top KPI Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ACTIVE VERIFIED COOKS</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
            {PLATFORM_STATS.activeCooks}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> 100% video KYC verified
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>CITY CAPACITY UTILIZATION</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FF5520', margin: '4px 0' }}>
            {PLATFORM_STATS.capacityUtilized}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            Optimal demand balance
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>HYGIENE COMPLIANCE</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            99.2%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#059669' }}>
            Zero food quality complaints
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>TOTAL MEALS DISPATCHED</div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#4F46E5', margin: '4px 0' }}>
            {PLATFORM_STATS.mealsDelivered.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
            Across 14 Bangalore clusters
          </div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>
              Home Kitchen Hygiene Audit Queue
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Mandatory verification before any home cook is surfaced on the customer discovery engine.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Home Cook / Kitchen</th>
                <th>Verification Type</th>
                <th>Auditor</th>
                <th>Status & Score</th>
                <th>Notes / Findings</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(audit => (
                <tr key={audit.id}>
                  <td><strong>{audit.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{audit.cookName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{audit.date}</div>
                  </td>
                  <td>{audit.verificationType}</td>
                  <td>{audit.auditor}</td>
                  <td>
                    <span 
                      className="badge-tag"
                      style={{ 
                        background: audit.status.includes('Approved') || audit.status.includes('Passed') ? '#ECFDF5' : '#FFFBEB',
                        color: audit.status.includes('Approved') || audit.status.includes('Passed') ? '#047857' : '#B45309',
                        fontWeight: 700
                      }}
                    >
                      {audit.status}
                    </span>
                  </td>
                  <td style={{ maxWidth: '280px', fontSize: '0.82rem', color: '#475569' }}>
                    {audit.notes}
                  </td>
                  <td>
                    {audit.status.includes('Pending') ? (
                      <button 
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#059669' }}
                        onClick={() => handleApprove(audit.id)}
                      >
                        <Check size={14} /> Approve
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                        ✓ Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hyperlocal Capacity Heatmap Grid */}
      <div>
        <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>
          Neighborhood Capacity vs. Demand Heat Map
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
          Real-time sensor on local student & office clusters to prevent supply shortages.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Koramangala 4th & 5th Block</strong>
              <span className="badge-tag badge-capacity">High Demand</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
              Student Hostels + Tech Incubators
            </div>
            <div className="capacity-meter-bar" style={{ height: '8px', margin: 0 }}>
              <div className="capacity-meter-fill" style={{ width: '94%', background: '#EF4444' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
              <span>94% Stove Capacity Booked</span>
              <span>18 Active Kitchens</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>HSR Layout Sector 1 & 2</strong>
              <span className="badge-tag badge-emerald">Balanced</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
              PG Hubs & Startup Apartments
            </div>
            <div className="capacity-meter-bar" style={{ height: '8px', margin: 0 }}>
              <div className="capacity-meter-fill" style={{ width: '82%', background: '#10B981' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
              <span>82% Stove Capacity Booked</span>
              <span>24 Active Kitchens</span>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Tavarekere / SG Palya</strong>
              <span className="badge-tag" style={{ background: '#FEE2E2', color: '#991B1B' }}>Capacity Near Max</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>
              College Density (Christ Univ)
            </div>
            <div className="capacity-meter-bar" style={{ height: '8px', margin: 0 }}>
              <div className="capacity-meter-fill" style={{ width: '97%', background: '#DC2626' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
              <span>97% Stove Capacity Booked</span>
              <span>12 Active Kitchens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
