// =========================================================
// MYNVORA ADMIN — ANALYTICS
// User · Dating · Safety · Subscription metrics.
// Read-only for Analytics Admin + Super Admin.
// =========================================================

import { useState } from 'react';
import { MOCK_DASHBOARD_STATS } from '../../data/adminMockData.js';

// ---------------------------------------------------------
// Mock metrics
// ---------------------------------------------------------
const SIGNUPS_7D = [
  { day: 'Mon', value: 1024 },
  { day: 'Tue', value: 1189 },
  { day: 'Wed', value: 1080 },
  { day: 'Thu', value: 1247 },
  { day: 'Fri', value: 1420 },
  { day: 'Sat', value: 1610 },
  { day: 'Sun', value: 1382 }
];

const MATCHES_7D = [
  { day: 'Mon', value: 38200 },
  { day: 'Tue', value: 40150 },
  { day: 'Wed', value: 39800 },
  { day: 'Thu', value: 42180 },
  { day: 'Fri', value: 45200 },
  { day: 'Sat', value: 48900 },
  { day: 'Sun', value: 46100 }
];

const REPORTS_7D = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 38 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 38 },
  { day: 'Fri', value: 52 },
  { day: 'Sat', value: 48 },
  { day: 'Sun', value: 35 }
];

const FUNNEL = [
  { step: 'Signed up',           users: 184203, pct: 100 },
  { step: 'Completed profile',   users: 162840, pct: 88  },
  { step: 'Started verification', users: 128420, pct: 70  },
  { step: 'Verified',            users: 42891,  pct: 23  },
  { step: 'Got first match',     users: 34210,  pct: 19  },
  { step: 'Sent message',        users: 28490,  pct: 15  },
  { step: 'Upgraded to paid',    users: 12489,  pct: 7   }
];

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
function BarChart({ data, color = '#4f8cff', format = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="admin-chart">
      {data.map((d) => (
        <div className="admin-chart-col" key={d.day}>
          <div className="admin-chart-value">{format(d.value)}</div>
          <div className="admin-chart-bar-wrap">
            <div
              className="admin-chart-bar"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: color
              }}
            />
          </div>
          <div className="admin-chart-label">{d.day}</div>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const s = MOCK_DASHBOARD_STATS;
  const [tab, setTab] = useState('users');

  return (
    <div className="admin-page">
      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
        >
          <i className="fa-solid fa-users" /> Users
        </button>
        <button
          className={`admin-tab ${tab === 'dating' ? 'active' : ''}`}
          onClick={() => setTab('dating')}
        >
          <i className="fa-solid fa-heart" /> Dating
        </button>
        <button
          className={`admin-tab ${tab === 'safety' ? 'active' : ''}`}
          onClick={() => setTab('safety')}
        >
          <i className="fa-solid fa-shield-halved" /> Safety
        </button>
        <button
          className={`admin-tab ${tab === 'subs' ? 'active' : ''}`}
          onClick={() => setTab('subs')}
        >
          <i className="fa-solid fa-crown" /> Subscriptions
        </button>
        <button
          className={`admin-tab ${tab === 'funnel' ? 'active' : ''}`}
          onClick={() => setTab('funnel')}
        >
          <i className="fa-solid fa-filter" /> Funnel
        </button>
      </div>

      {/* ===================== USERS ===================== */}
      {tab === 'users' && (
        <>
          <div className="admin-stat-grid four">
            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(79,140,255,0.15)', color: '#4f8cff' }}
                >
                  <i className="fa-solid fa-users" />
                </div>
                <span className="admin-stat-trend">+2.4%</span>
              </div>
              <div className="admin-stat-value">
                {s.totalUsers.toLocaleString()}
              </div>
              <div className="admin-stat-label">Total users</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(53,208,127,0.15)', color: '#35d07f' }}
                >
                  <i className="fa-solid fa-user-plus" />
                </div>
              </div>
              <div className="admin-stat-value">
                {s.newToday.toLocaleString()}
              </div>
              <div className="admin-stat-label">New today</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
                >
                  <i className="fa-solid fa-signal" />
                </div>
              </div>
              <div className="admin-stat-value">
                {s.onlineUsers.toLocaleString()}
              </div>
              <div className="admin-stat-label">Online now</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(255,176,32,0.15)', color: '#ffb020' }}
                >
                  <i className="fa-solid fa-arrow-down" />
                </div>
              </div>
              <div className="admin-stat-value">3.8%</div>
              <div className="admin-stat-label">Churn (30d)</div>
            </div>
          </div>

          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">Signups — last 7 days</h3>
            <BarChart
              data={SIGNUPS_7D}
              color="#4f8cff"
              format={(v) => v.toLocaleString()}
            />
          </div>

          <div className="admin-stat-grid four" style={{ marginTop: 24 }}>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">78.4%</div>
              <div className="admin-stat-label">D1 retention</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">52.1%</div>
              <div className="admin-stat-label">D7 retention</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">34.6%</div>
              <div className="admin-stat-label">D30 retention</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">23%</div>
              <div className="admin-stat-label">Verification rate</div>
            </div>
          </div>
        </>
      )}

      {/* ===================== DATING ===================== */}
      {tab === 'dating' && (
        <>
          <div className="admin-stat-grid four">
            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(255,59,129,0.15)', color: '#ff3b81' }}
                >
                  <i className="fa-solid fa-heart" />
                </div>
              </div>
              <div className="admin-stat-value">
                {s.matchesToday.toLocaleString()}
              </div>
              <div className="admin-stat-label">Matches today</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-value">62%</div>
              <div className="admin-stat-label">Match rate</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-value">
                {s.messagesToday.toLocaleString()}
              </div>
              <div className="admin-stat-label">Messages today</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-value">48%</div>
              <div className="admin-stat-label">Conversations started</div>
            </div>
          </div>

          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">Matches — last 7 days</h3>
            <BarChart
              data={MATCHES_7D}
              color="#ff3b81"
              format={(v) => `${(v / 1000).toFixed(1)}k`}
            />
          </div>

          <div className="admin-stat-grid four" style={{ marginTop: 24 }}>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">2,180</div>
              <div className="admin-stat-label">Voice calls today</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">892</div>
              <div className="admin-stat-label">Video calls today</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">5,820</div>
              <div className="admin-stat-label">Unmatches today</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">342</div>
              <div className="admin-stat-label">Boosts today</div>
            </div>
          </div>
        </>
      )}

      {/* ===================== SAFETY ===================== */}
      {tab === 'safety' && (
        <>
          <div className="admin-stat-grid four">
            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(255,59,129,0.15)', color: '#ff3b81' }}
                >
                  <i className="fa-solid fa-flag" />
                </div>
              </div>
              <div className="admin-stat-value">{s.openReports}</div>
              <div className="admin-stat-label">Open reports</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(255,77,103,0.15)', color: '#ff4d67' }}
                >
                  <i className="fa-solid fa-robot" />
                </div>
              </div>
              <div className="admin-stat-value">
                {s.fakeProfileDetections}
              </div>
              <div className="admin-stat-label">Fake profiles</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(255,77,103,0.15)', color: '#ff4d67' }}
                >
                  <i className="fa-solid fa-mask" />
                </div>
              </div>
              <div className="admin-stat-value">
                {s.aiDeepfakeDetections}
              </div>
              <div className="admin-stat-label">AI / deepfake flags</div>
            </div>

            <div className="admin-stat-card static">
              <div className="admin-stat-head">
                <div
                  className="admin-stat-icon"
                  style={{ background: 'rgba(255,77,103,0.15)', color: '#ff4d67' }}
                >
                  <i className="fa-solid fa-ban" />
                </div>
              </div>
              <div className="admin-stat-value">{s.bannedAccounts}</div>
              <div className="admin-stat-label">Banned accounts</div>
            </div>
          </div>

          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">Reports — last 7 days</h3>
            <BarChart data={REPORTS_7D} color="#ff4d67" />
          </div>

          <div className="admin-stat-grid four" style={{ marginTop: 24 }}>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">312</div>
              <div className="admin-stat-label">Total reports (7d)</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">94%</div>
              <div className="admin-stat-label">Resolved &lt; 24h</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">42</div>
              <div className="admin-stat-label">Appeals (7d)</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">18%</div>
              <div className="admin-stat-label">Appeal overturn</div>
            </div>
          </div>
        </>
      )}

      {/* ===================== SUBSCRIPTIONS ===================== */}
      {tab === 'subs' && (
        <>
          <div className="admin-stat-grid four">
            <div className="admin-stat-card static">
              <div className="admin-stat-value">
                {s.activeSubscriptions.toLocaleString()}
              </div>
              <div className="admin-stat-label">Active subs</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">6.8%</div>
              <div className="admin-stat-label">Free → Light</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">22%</div>
              <div className="admin-stat-label">Light → Gold</div>
            </div>
            <div className="admin-stat-card static">
              <div className="admin-stat-value">14%</div>
              <div className="admin-stat-label">Gold → Diamond</div>
            </div>
          </div>

          <div className="admin-info-card" style={{ marginTop: 24 }}>
            <h3 className="admin-card-title">Subscription health</h3>

            <div className="admin-funnel">
              <div className="admin-funnel-row">
                <div className="admin-funnel-label">Renewal rate</div>
                <div className="admin-funnel-bar-wrap">
                  <div className="admin-funnel-bar" style={{ width: '82%', background: '#35d07f' }} />
                </div>
                <div className="admin-funnel-value">82%</div>
              </div>
              <div className="admin-funnel-row">
                <div className="admin-funnel-label">Cancellation rate</div>
                <div className="admin-funnel-bar-wrap">
                  <div className="admin-funnel-bar" style={{ width: '18%', background: '#ff4d67' }} />
                </div>
                <div className="admin-funnel-value">18%</div>
              </div>
              <div className="admin-funnel-row">
                <div className="admin-funnel-label">Trial conversion</div>
                <div className="admin-funnel-bar-wrap">
                  <div className="admin-funnel-bar" style={{ width: '34%', background: '#4f8cff' }} />
                </div>
                <div className="admin-funnel-value">34%</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===================== FUNNEL ===================== */}
      {tab === 'funnel' && (
        <div className="admin-info-card">
          <h3 className="admin-card-title">User lifecycle funnel</h3>

          <div className="admin-funnel">
            {FUNNEL.map((step, i) => (
              <div className="admin-funnel-row" key={step.step}>
                <div className="admin-funnel-label">
                  {i + 1}. {step.step}
                </div>
                <div className="admin-funnel-bar-wrap">
                  <div
                    className="admin-funnel-bar"
                    style={{
                      width: `${step.pct}%`,
                      background: `hsl(${340 - i * 20}, 80%, 60%)`
                    }}
                  />
                </div>
                <div className="admin-funnel-value">
                  {step.users.toLocaleString()}
                  <span className="admin-funnel-pct"> ({step.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}