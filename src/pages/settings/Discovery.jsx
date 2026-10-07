// =========================================================
// MYNVORA — DISCOVERY SETTINGS
// Age range · Distance · Gender · Verified · Global · Passport
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore.js';
import { useFiltersStore } from '../../store/filtersStore.js';
import Slider from '../../components/Slider.jsx';
import ToggleRow from '../../components/ToggleRow.jsx';

const CITIES = [
  'Mumbai, India','Delhi, India','Bangalore, India','Hyderabad, India',
  'Chennai, India','Kolkata, India','Pune, India','Goa, India',
  'Dubai, UAE','London, UK','New York, USA','Los Angeles, USA',
  'Singapore','Tokyo, Japan','Bali, Indonesia',
];

const GENDERS = [
  { id: 'all',       label: 'Everyone' },
  { id: 'male',      label: 'Men' },
  { id: 'female',    label: 'Women' },
  { id: 'nonbinary', label: 'Non-binary' },
];

export default function Discovery() {
  const navigate = useNavigate();
  const settings = useSettingsStore();
  const filters = useFiltersStore();

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPassport = settings.locationMode === 'passport';

  return (
    <div className="settings-screen">
      {/* Header */}
      <div className="settings-page-head">
        <button className="back-btn-inline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Discovery</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Age range */}
      <div className="settings-section">
        <div className="settings-section-title">Age range</div>
        <p className="settings-section-desc">
          Show me people between these ages.
        </p>
        <div className="discovery-slider-card">
          <Slider
            minValue={filters.ageMin}
            maxValue={filters.ageMax}
            onRangeChange={(min, max) => filters.setAgeRange(min, max)}
            min={18}
            max={90}
            step={1}
            unit=""
          />
        </div>
      </div>

      {/* Max distance */}
      <div className="settings-section">
        <div className="settings-section-title">Maximum distance</div>
        <p className="settings-section-desc">
          Only show me people within this distance.
        </p>
        <div className="discovery-slider-card">
          <Slider
            value={filters.maxDistance}
            onChange={(v) => filters.setDistance(v)}
            min={1}
            max={150}
            step={1}
            unit=" km"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="settings-section">
        <div className="settings-section-title">Show me</div>
        <div className="settings-card" style={{ padding: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GENDERS.map((g) => {
              const active = filters.gender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => filters.setGender(g.id)}
                  style={{
                    flex: '1 1 auto',
                    minWidth: 90,
                    padding: '10px 14px',
                    borderRadius: 999,
                    border: active
                      ? '1.5px solid #4f8cff'
                      : '1.5px solid rgba(255,255,255,0.12)',
                    background: active
                      ? 'rgba(79,140,255,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    color: active ? '#4f8cff' : '#cfcfe0',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verified only */}
      <div className="settings-section">
        <div className="settings-section-title">Trust</div>
        <div className="settings-card">
          <ToggleRow
            icon="fa-circle-check"
            iconColor="#22c55e"
            label="Verified profiles only"
            description="Only show people who passed selfie verification"
            value={filters.verifiedOnly}
            onChange={() => filters.toggleVerifiedOnly()}
          />
        </div>
      </div>

      {/* Advanced */}
      <div className="settings-section">
        <div className="settings-section-title">Advanced</div>
        <div className="settings-card">
          <ToggleRow
            icon="fa-arrow-up-right-dots"
            iconColor="#4f8cff"
            label="Show further away if out of profiles"
            description="Expand the range automatically when you run out"
            value={settings.showFurtherIfOut}
            onChange={() => settings.toggle('showFurtherIfOut')}
          />
          <ToggleRow
            icon="fa-earth-americas"
            iconColor="#8b5cf6"
            label="Global mode"
            description="Match with people all over the world"
            value={settings.globalMode}
            onChange={() => settings.toggle('globalMode')}
          />
        </div>
      </div>

      {/* Reset */}
      <div className="settings-section">
        <button
          type="button"
          onClick={() => filters.reset()}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: '1px solid rgba(255,80,80,0.25)',
            background: 'rgba(255,80,80,0.08)',
            color: '#ff7a7a',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Reset filters
        </button>
      </div>

      {/* Location */}
      <div className="settings-section">
        <div className="settings-section-title">Location</div>
        <p className="settings-section-desc">
          Where should we look for your matches?
        </p>

        <div className="location-current">
          <div className="location-current-icon">
            <i className="fa-solid fa-location-dot" />
          </div>
          <div className="location-current-info">
            <div className="location-current-label">
              {isPassport ? 'Passport Mode' : 'Current location'}
            </div>
            <div className="location-current-value">
              {isPassport ? settings.passportCity : settings.currentCity}
            </div>
          </div>
          {isPassport && (
            <button
              className="location-clear"
              onClick={() => settings.clearPassport()}
            >
              Clear
            </button>
          )}
        </div>

        <button
          className="passport-btn"
          onClick={() => setShowCityPicker(true)}
        >
          <i className="fa-solid fa-plane" />
          <div>
            <div className="passport-btn-title">
              {isPassport ? 'Change city' : 'Try Passport Mode'}
            </div>
            <div className="passport-btn-sub">
              💎 Diamond feature · Match in another city
            </div>
          </div>
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>

      {/* City picker sheet */}
      {showCityPicker && (
        <div className="sheet-scrim" onClick={() => setShowCityPicker(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-subhead">
              <button
                className="sheet-back"
                onClick={() => setShowCityPicker(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
              <h2>Choose a city</h2>
            </div>

            <div className="search-wrap" style={{ margin: '0 16px 16px' }}>
              <i className="fa-solid fa-magnifying-glass search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="city-list">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  className="city-item"
                  onClick={() => {
                    settings.setPassportCity(city);
                    setShowCityPicker(false);
                    setSearchQuery('');
                  }}
                >
                  <i className="fa-solid fa-location-dot" />
                  <span>{city}</span>
                  {settings.passportCity === city && (
                    <i className="fa-solid fa-check city-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}