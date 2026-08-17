// src/helpers/applicantProfile.js
// Helper functions for storing, retrieving, and clearing applicant profile data in localStorage.
// Uses a versioned key to allow future migrations.

const STORAGE_KEY = 'doclick_applicant_profile_v1';

/**
 * Save the applicant profile object to localStorage.
 * @param {Object} profile - The profile data to store.
 */
export function saveApplicantProfile(profile) {
  if (!profile) return;
  try {
    const payload = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (e) {
    console.error('Failed to save applicant profile:', e);
  }
}

/**
 * Load the applicant profile from localStorage.
 * @returns {Object|null} The parsed profile object or null if not present / parsing fails.
 */
export function loadApplicantProfile() {
  try {
    const payload = localStorage.getItem(STORAGE_KEY);
    if (!payload) return null;
    return JSON.parse(payload);
  } catch (e) {
    console.error('Failed to load applicant profile:', e);
    return null;
  }
}

/**
 * Remove the stored applicant profile from localStorage.
 */
export function clearApplicantProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear applicant profile:', e);
  }
}
