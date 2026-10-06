// =========================================================
// MYNVORA ADMIN — VERIFICATION QUEUE
// Pending identity verifications. Tap row → VerificationDetail.
// =========================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_VERIFICATIONS } from '../../data/adminMockData.js';
import { useAdminStore } from '../../store/adminStore.js';
import { hasPermission } from '../../utils/permissions.js';

// Helper — how long ago?
function timeAgo(ms) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Human labels for check results
function checkLabel(value) {
  if (value === 'pass') return { label: 'Pass', color: '#35d07f' };
  if (value === 'fail') return { label: 'Fail', color: '#ff4d67' };
  if (value === 'uncertain') return { label: 'Review', color: '#ffb020' };
  return { label: '—', color: '#777789' };
}

export default function VerificationQueue() {
  const navigate = useNavigate();
  const admin = useAdminStore();

  const [filter, setFilter] = useState('all');   // all | pending_review | auto_approved | rejected

  const canApprove = hasPermission(admin, 'verification.approve');

  // ---------- filter queue ----------
  const queue = useMemo(() => {
    if (filter === 'all') return MOCK_VERIFICATIONS;
    return MOCK_VERIFICATIONS.filter((v) => v.status === filter);
  }, [filter]);

  // ---------- filters ----------
  const filterOptions = [
    { id: 'all', label: 'All', count: MOCK_VERIFICATIONS.length },
    {
      id: 'pending_review',
      label: 'Pending review',
      count: MOCK_VERIFICATIONS.filter((v) => v.status === 'pending_review').length
    },
    {
      id: 'auto_approved',
      label: 'Auto-approved',
      count: MOCK_VERIFICATIONS.filter((v) => v.status === 'auto_approved').length
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: MOCK_VERIFICATIONS.filter((v) => v.status === 'rejected').length
    }
  ];

  return (
    <div className="admin-page">
      {/* Alert banner */}
      <div className="admin-banner warn">
        <i className="fa-solid fa-triangle-exclamation" />
        <div>
          <div className="admin-banner-title">
            {MOCK_VERIFICATIONS.length} verifications need human review
          </div>
          <div className="admin-banner-sub">
            AI checks passed but confidence was below auto-approve threshold.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filter-chips">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            className={`admin-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="admin-chip-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Permission hint */}
      {!canApprove && (
        <div className="admin-banner info">
          <i className="fa-solid fa-eye" />
          <div className="admin-banner-sub">
            You have read-only access. Only Verification Admins can approve or
            reject.
          </div>
        </div>
      )}

      {/* Queue list */}
      <div className="admin-table">
        <div className="admin-table-head">
          <div className="admin-tcol-user">Applicant</div>
          <div className="admin-tcol-checks">Auto-checks</div>
          <div className="admin-tcol-doc">Document</div>
          <div className="admin-tcol-time">Submitted</div>
          <div className="admin-tcol-action" />
        </div>

        {queue.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-regular fa-face-smile" />
            <p>No verifications in this filter</p>
          </div>
        ) : (
          queue.map((v) => {
            const ageCheck = checkLabel(v.checks.ageCheck);
            const idAuth = checkLabel(v.checks.idAuthenticity);
            const faceCheck = v.checks.faceMatch.passed
              ? { label: `Match ${Math.round(v.checks.faceMatch.similarity * 100)}%`, color: '#35d07f' }
              : { label: `Weak ${Math.round(v.checks.faceMatch.similarity * 100)}%`, color: '#ffb020' };
            const liveCheck = v.checks.liveness.passed
              ? { label: `Live ${Math.round(v.checks.liveness.confidence * 100)}%`, color: '#35d07f' }
              : { label: 'Failed', color: '#ff4d67' };

            return (
              <div
                className="admin-table-row"
                key={v.id}
                onClick={() => navigate(`/admin/verification/${v.id}`)}
              >
                {/* Applicant */}
                <div className="admin-tcol-user">
                  <img className="admin-user-photo" src={v.userPhoto} alt={v.userName} />
                  <div className="admin-user-info">
                    <div className="admin-user-name">{v.userName}</div>
                    <div className="admin-user-sub">
                      {v.userId} · {v.age} · {v.country}
                    </div>
                  </div>
                </div>

                {/* Auto-checks */}
                <div className="admin-tcol-checks">
                  <div className="admin-check-row">
                    <span className="admin-check-dot" style={{ background: ageCheck.color }} />
                    <span>Age</span>
                    <span className="admin-check-val" style={{ color: ageCheck.color }}>
                      {ageCheck.label}
                    </span>
                  </div>
                  <div className="admin-check-row">
                    <span className="admin-check-dot" style={{ background: idAuth.color }} />
                    <span>ID</span>
                    <span className="admin-check-val" style={{ color: idAuth.color }}>
                      {idAuth.label}
                    </span>
                  </div>
                  <div className="admin-check-row">
                    <span className="admin-check-dot" style={{ background: liveCheck.color }} />
                    <span>Liveness</span>
                    <span className="admin-check-val" style={{ color: liveCheck.color }}>
                      {liveCheck.label}
                    </span>
                  </div>
                  <div className="admin-check-row">
                    <span className="admin-check-dot" style={{ background: faceCheck.color }} />
                    <span>Face</span>
                    <span className="admin-check-val" style={{ color: faceCheck.color }}>
                      {faceCheck.label}
                    </span>
                  </div>
                </div>

                {/* Document */}
                <div className="admin-tcol-doc">
                  <span className="admin-doc-type">{v.documentType}</span>
                  {v.checks.idAuthenticity === 'uncertain' && (
                    <span className="admin-doc-warn">
                      <i className="fa-solid fa-triangle-exclamation" /> Review
                    </span>
                  )}
                </div>

                {/* Submitted */}
                <div className="admin-tcol-time">
                  <span className="admin-muted">{timeAgo(v.submittedAt)}</span>
                </div>

                {/* Action */}
                <div className="admin-tcol-action">
                  <i className="fa-solid fa-chevron-right" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}