// src/api/jobs.js
// Fetch publicly published job postings from Google Apps Script.
// No admin token is ever sent from the client.
export async function fetchPublishedJobs() {
  const endpoint = 'https://script.google.com/macros/s/AKfycbxf5sgRpnMaiU8lWPJ_0_n34jaJgc1-pKUnyjf5d7nvAIP5v0hF_ZRss-NJru5zLnux/exec?action=published';
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // The Apps Script may return either an array or an object with a `jobs` field.
    return Array.isArray(data) ? data : data.jobs || [];
  } catch (error) {
    console.error('Failed to fetch published jobs:', error);
    // Return empty array so UI can handle gracefully.
    return [];
  }
}
