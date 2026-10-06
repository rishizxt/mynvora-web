// =========================================================
// MYNVORA ADMIN — AGE SAFETY
// 16–17 vs 18+ environments. Cross-age attempts blocked
// and logged. Subscriptions NEVER override this.
// =========================================================

import { useState } from 'react';
import { MOCK_DASHBOARD_STATS } from '../../data/adminMockData.js';

// ---------------------------------------------------------
// Mock cross-age block events (backend enforced in prod)
// ---------------------------------------------------------
const MOCK_BLOCKS = [
  {
    id: 'AGE-1042',
    type: 'discovery',
    fromAge: 17,
    fromGroup: 'teen',
    fromUserId: 'u_teen_12',
    fromUserName: 'Teen user A',
    toAge: 24,
    toGroup: 'adult',
    toUserId: 'u_2211',
    toUserName: 'Rushi Singh',
    reason: 'Attempted to open profile from 18+ Discover',
    detectedAt: Date.now() - 45 * 60 * 1000,
    status: 'blocked'
  },
  {
    id: 'AGE-1041',
    type: 'chat',
    fromAge: 24,
    fromGroup: 'adult',
    fromUserId: 'u_2211',
    fromUserName: 'Rushi Singh',
    toAge: 17,
    toGroup: 'teen',
    toUserId: 'u_teen_12',
    toUserName: 'Teen user A',
    reason: 'Attempted to send chat message across age groups',
    detectedAt: Date.now() - 2 * 60 * 60 * 1000,
    status: 'blocked'
  },
  {
    id: 'AGE-1040',
    type: 'call',
    fromAge: 17,
    fromGroup: 'teen',
    fromUserId: 'u_teen_34',
    fromUserName: 'Teen user B',
    toAge: 28,
    toGroup: 'adult',
    toUserId: 'u_1133',
    toUserName: 'Aisha Khan',
    reason: 'Attempted voice call across age groups',
    detectedAt: Date.now() - 8 * 60 * 60 * 1000,
    status: 'blocked'
  },
  {
    id: 'AGE-1039',
    type: 'match',
    fromAge: 24,
    fromGroup: 'adult',
    fromUserId: 'u_4422',
    fromUserName: 'Sofia Reyes',
    toAge: 16,
    toGroup: 'teen',
    toUserId: 'u_teen_07',
    toUserName: 'Teen user C',
    reason: 'Attempted match across age groups (16)',
    detectedAt: Date.now() - 20 * 60 * 60 * 1000,
    status: 'blocked'
  }
];

const TYPE_META = {
  discovery: { icon: 'fa-compass',         label: 'Discovery' },
  chat:      { icon: 'fa-comment',         label: 'Chat' },
  call:      { icon: 'fa-phone',           label: 'Call' },
  match:     { icon: 'fa-heart',           label: 'Match' },
  voice:     { icon: 'fa-microphone',      label: 'Voice call' },
  video:     { icon: 'fa-video',           label: 'Video call' }
};

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

export default function AgeSafety() {
  const s = MOCK_DASHBOARD_STATS;

  const [tab, setTab] = useState('teen');   // teen | adult | blocks

  const teenStats = [
    { icon: 'fa-users',         color: '#4f8cff', value: s.teenUsers.toLocaleString(),         label: 'Teen users' },
    { icon: 'fa-id-card',       color: '#4f8cff', value: '824',                                 label: 'Verified' },
    { icon: 'fa-flag',          color: '#ffb020', value: '12',                                  label: 'Open reports' },
    { icon: 'fa-heart',         color: '#ff3b81', value: '4,821',                               label: 'Active matches' },
    { icon: 'fa-comment',       color: '#35d07f', value: '18,204',                              label: 'Messages today' },
    { icon: 'fa-shield-halved', color: '#8b5cf6', value: '0',                                   label: 'Cross-age leaks' }
  ];

  const adultStats = [
    { icon: 'fa-users',         color: '#4f8cff', value: s.adultUsers.toLocaleString(),         label: 'Adult users' },
    { icon: 'fa-id-card',       color: '#4f8cff', value: s.verifiedUsers.toLocaleString(),      label: 'Verified' },
    { icon: 'fa-flag',          color: '#ffb020', value: s.openReports,                         label: 'Open reports' },
    { icon: 'fa-heart',         color: '#ff3b81', value: '38,210',                              label: 'Active matches' },
    { icon: 'fa-comment',       color: '#35d07f', value: s.messagesToday.toLocaleString(),      label: 'Messages today' },
    { icon: 'fa-shield-halved', color: '#8b5cf6', value: '0',                                   label: 'Cross-age leaks' }
  ];

  const stats = tab === 'teen' ? teenStats : adultStats;

  return (
    <div className="admin-page">
      {/* Warning banner */}
      <div className="admin-banner danger">
        <i className="fa-solid fa-shield-halved" />
        <div>
          <div className="admin-banner-title">
            Age separation is hard-enforced at the backend
          </div>
          <div className="admin-banner-sub">
            No subscription — including Diamond — ever bypasses age protection.
            Every attempt to cross 16–17 ↔ 18+ boundaries is blocked and logged.
          </div>
        </div>
      </div>

      {/* Tab switch */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'teen' ? 'active' : ''}`}
          onClick={() => setTab('teen')}
        >
          <i className="fa-solid fa-cake-candles" /> 16–17 environment
        </button>
        <button
          className={`admin-tab ${tab === 'adult' ? 'active' : ''}`}
          onClick={() => setTab('adult')}
        >
          <i className="fa-solid fa-user" /> 18+ environment
        </button>
        <button
          className={`admin-tab ${tab === 'blocks' ? 'active' : ''}`}
          onClick={() => setTab('blocks')}
        >
          <i className="fa-solid fa-ban" /> Blocked attempts ({MOCK_BLOCKS.length})
        </button>
      </div>

      {/* Stats — for teen / adult tabs */}
      {(tab === 'teen' || tab === 'adult') && (
        <>
          <div className="admin-stat-grid">
            {stats.map((st, i) => (
              <div className="admin-stat-card static" key={i}>
                <div className="admin-stat-head">
                  <div
                    className="admin-stat-icon"
                    style={{ background: `${st.color}22`, color: st.color }}
                  >
                    <i className={`fa-solid ${st.icon}`} />
                  </div>
                </div>
                <div className="admin-stat-value">{st.value}</div>
                <div className="admin-stat-label">{st.label}</div>
              </div>
            ))}
          </div>

          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">
              {tab === 'teen' ? '16–17 environment' : '18+ environment'} — rules
            </h3>
            <div className="admin-rule-list">
              <div className="admin-rule-row">
                <i className="fa-solid fa-check" style={{ color: '#35d07f' }} />
                <span>Discovery limited to same age group</span>
              </div>
              <div className="admin-rule-row">
                <i className="fa-solid fa-check" style={{ color: '#35d07f' }} />
                <span>Chat/messaging limited to same age group</span>
              </div>
              <div className="admin-rule-row">
                <i className="fa-solid fa-check" style={{ color: '#35d07f' }} />
                <span>Voice &amp; video calls limited to same age group</span>
              </div>
              <div className="admin-rule-row">
                <i className="fa-solid fa-check" style={{ color: '#35d07f' }} />
                <span>Matches never cross 16–17 ↔ 18+ boundary</span>
              </div>
              {tab === 'teen' && (
                <div className="admin-rule-row">
                  <i className="fa-solid fa-check" style={{ color: '#35d07f' }} />
                  <span>Location coarsened to city level only</span>
                </div>
              )}
              {tab === 'teen' && (
                <div className="admin-rule-row danger">
                  <i className="fa-solid fa-xmark" style={{ color: '#ff4d67' }} />
                  <span>Hook-ups / sexual features disabled</span>
                </div>
              )}
              <div className="admin-rule-row danger">
                <i className="fa-solid fa-xmark" style={{ color: '#ff4d67' }} />
                <span>Subscriptions NEVER override age protection</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Blocked attempts tab */}
      {tab === 'blocks' && (
        <>
          <div className="admin-list-count">
            {MOCK_BLOCKS.length} blocked attempt
            {MOCK_BLOCKS.length !== 1 ? 's' : ''}
          </div>

          <div className="admin-age-block-list">
            {MOCK_BLOCKS.map((b) => {
              const meta = TYPE_META[b.type] || TYPE_META.discovery;

              return (
                <div className="admin-age-block-card" key={b.id}>
                  <div className="admin-age-block-bar critical" />

                  <div className="admin-age-block-icon">
                    <i className={`fa-solid ${meta.icon}`} />
                  </div>

                  <div className="admin-age-block-body">
                    <div className="admin-age-block-top">
                      <span className="admin-report-id">{b.id}</span>
                      <span className="admin-flagged-category">
                        {meta.label}
                      </span>
                      <span className="admin-risk critical">
                        <i className="fa-solid fa-ban" /> Blocked
                      </span>
                    </div>

                    {/* From → To */}
                    <div className="admin-age-block-users">
                      <div className="admin-age-block-user">
                        <span className="admin-age-tag teen">
                          {b.fromAge}
                        </span>
                        <div>
                          <div className="admin-flagged-user-name">
                            {b.fromUserName}
                          </div>
                          <div className="admin-flagged-user-sub">
                            {b.fromGroup === 'teen' ? '16–17' : '18+'} ·{' '}
                            {b.fromUserId}
                          </div>
                        </div>
                      </div>

                      <i className="fa-solid fa-arrow-right admin-flagged-arrow" />

                      <div className="admin-age-block-user">
                        <span
                          className={`admin-age-tag ${
                            b.toGroup === 'teen' ? 'teen' : 'adult'
                          }`}
                        >
                          {b.toAge}
                        </span>
                        <div>
                          <div className="admin-flagged-user-name">
                            {b.toUserName}
                          </div>
                          <div className="admin-flagged-user-sub">
                            {b.toGroup === 'teen' ? '16–17' : '18+'} ·{' '}
                            {b.toUserId}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-age-block-reason">
                      <i className="fa-solid fa-circle-info" /> {b.reason}
                    </div>

                    <div className="admin-age-block-meta">
                      <span>
                        <i className="fa-solid fa-clock" />{' '}
                        {timeAgo(b.detectedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}