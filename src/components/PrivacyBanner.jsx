import React from 'react';
import { ShieldCheck, User, Stethoscope, Calendar, Lock, Sparkles, Building2 } from 'lucide-react';

export default function PrivacyBanner({ currentDoc, onDeleteRecord }) {
  if (!currentDoc) return null;

  const initial = currentDoc.patientName ? currentDoc.patientName.charAt(0).toUpperCase() : 'P';

  return (
    <div className="sketch-card patient-banner-card animate-fade-in">
      <div className="washi-tape" style={{ left: '30px', top: '-12px' }} />
      <div className="washi-tape green" style={{ right: '40px', top: '-12px' }} />

      <div className="patient-banner-inner">
        {/* Left Side: Patient Profile & Doctor Info */}
        <div className="patient-profile-section">
          {/* Hand-drawn avatar circle */}
          <div className="patient-avatar-badge">
            <span>{initial}</span>
          </div>

          <div className="patient-info-meta">
            <div className="patient-name-row">
              <span className="hand-note" style={{ fontSize: '1.25rem', marginRight: '6px' }}>Patient:</span>
              <h2 className="patient-name-heading">{currentDoc.patientName}</h2>
              {currentDoc.patientAge && (
                <span className="sketch-badge" style={{ background: 'var(--highlighter-yellow)', fontWeight: 800 }}>
                  {currentDoc.patientAge} years old
                </span>
              )}
              {currentDoc.statusBadge && (
                <span className="sketch-badge offline" style={{ fontSize: '0.72rem' }}>
                  {currentDoc.statusBadge}
                </span>
              )}
            </div>

            {/* Doctor, Clinic & Date Badges */}
            <div className="patient-meta-badges">
              {currentDoc.doctorName && (
                <div className="sketch-meta-chip">
                  <Stethoscope size={14} color="var(--sketch-teal)" />
                  <span><strong>Doctor:</strong> {currentDoc.doctorName}</span>
                </div>
              )}

              {currentDoc.clinicName && (
                <div className="sketch-meta-chip">
                  <Building2 size={14} color="var(--ink-muted)" />
                  <span>{currentDoc.clinicName}</span>
                </div>
              )}

              {currentDoc.date && (
                <div className="sketch-meta-chip">
                  <Calendar size={14} color="var(--sketch-amber)" />
                  <span><strong>Date:</strong> {currentDoc.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: 100% Offline Vault Guarantee */}
        <div className="patient-privacy-badge-box">
          <div className="privacy-badge-header">
            <div className="privacy-shield-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="privacy-badge-title">
                100% Private Offline Vault
              </div>
              <div className="privacy-badge-subtitle">
                Powered by <strong>Gemma 2:2B</strong> (Zero Cloud Transmission)
              </div>
            </div>
          </div>
          <div className="privacy-badge-note">
            <Lock size={12} />
            <span>Health records & prescription schedules never leave this computer.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
