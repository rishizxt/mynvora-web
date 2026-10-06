// =========================================================
// MYNVORA — EXPLORE
// Category grid with back button + premium card styling.
// =========================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import {
  getVisibleCategories,
  fetchCategoryCounts,
  formatCount
} from '../../data/categories.js';
import { useUserStore } from '../../store/userStore.js';

export default function Explore() {
  const navigate = useNavigate();
    const tier = useUserStore((s) => s.tier);

  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const visibleCategories = getVisibleCategories(tier);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchCategoryCounts();
      setCounts(data);
    } catch {
      setCounts({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

     useEffect(() => {
    load();
    /* eslint-disable-next-line */
  }, []);

  return (
    <div className="explore-screen">
      {/* Top bar with back */}
      <div className="explore-topbar">
        <button
          className="explore-back"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>

        <div className="explore-topbar-title">
          <h1>Explore</h1>
          <p>Find your people</p>
        </div>

        <button
          className={`explore-refresh ${refreshing ? 'spinning' : ''}`}
          onClick={() => load(true)}
          disabled={refreshing}
          aria-label="Refresh"
        >
          <i className="fa-solid fa-rotate" />
        </button>
      </div>

      {/* Grid */}
      <div className="explore-grid">
        {visibleCategories.map((c) => {
          const count = counts?.[c.id];
          const isEmpty = count === 0;
          const countText = count !== undefined ? formatCount(count) : null;
          const isHookups = c.id === 'hookups';

          return (
            <button
              key={c.id}
              className={`explore-card ${
                isEmpty ? 'empty' : ''
              } ${isHookups ? 'hookups' : ''}`}
              onClick={() => navigate(`/explore/${c.id}`)}
            >
              <div className="explore-card-icon">{c.icon}</div>

              <div className="explore-card-body">
                <div className="explore-card-name">{c.name}</div>

                {loading ? (
                  <div className="explore-card-skeleton" />
                ) : isEmpty ? (
                  <div className="explore-card-empty">—</div>
                ) : (
                  <div className="explore-card-count">{countText}</div>
                )}
              </div>

              {isHookups && (
                <div className="explore-card-diamond">
                  <i className="fa-solid fa-gem" /> Diamond
                </div>
              )}
            </button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}