// =========================================================
// MYNVORA — DISCOVERY SETTINGS
// Age range · Distance · Global · Passport Mode
// =========================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore.js';
import Slider from '../../components/Slider.jsx';
import ToggleRow from '../../components/ToggleRow.jsx';
import { DISCOVERY_SETTINGS } from '../../data/profileOptions.js';

// Common cities for passport mode
const CITIES = [
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'Hyderabad, India',
  'Chennai, India',
  'Kolkata, India',
  'Pune, India',
  'Goa, India',
  'Dubai, UAE',
  'London, UK',
  'New York, USA',
  'Los Angeles, USA',
  'Singapore',
  'Tokyo, Japan',
  'Bali, Indonesia'
];

export default function Discovery() {
  const navigate = useNavigate();
  const settings = useSettingsStore();

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
            minValue={settings.ageMin}
            maxValue={settings.ageMax}
            onRangeChange={(min, max) =>
              settings.setAgeRange(min, max)
            }
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
            value={settings.maxDistance}
            onChange={(v) => settings.setDistance(v)}
            min={1}
            max={150}
            step={1}
            unit=" km"
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
              {isPassport
                ? settings.passportCity
                : settings.currentCity}
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
        <div
          className="sheet-scrim"
          onClick={() => setShowCityPicker(false)}
        >
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