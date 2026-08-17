// src/api/jobs.js
// Fetch publicly published job postings from Google Apps Script.
// No admin token is ever sent from the client.
export async function fetchPublishedJobs() {
  const endpoint = 'https://script.google.com/macros/s/AKfycbxf5sgRpnMaiU8lWPJ_0_n34jaJgc1-pKUnyjf5d7nvAIP5v0hF_ZRss-NJru5zLnux/exec?action=published';
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const jobsArray = Array.isArray(data) ? data : data.jobs || [];
    // Normalize job objects to UI shape
    return jobsArray.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: `${job.city || ''}${job.district || ''}`,
      rate: job.salaryMin != null && job.salaryMax != null ? `${job.salaryMin}～${job.salaryMax}` : job.rate,
      type: job.type,
      status: job.status,
    }));
  } catch (error) {
    console.error('Failed to fetch published jobs:', error);
    return [];
  }
}
