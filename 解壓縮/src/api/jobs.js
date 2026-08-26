// src/api/jobs.js
// Fetch publicly published job postings from Google Apps Script.
// No admin token is ever sent from the client.
//
// IMPORTANT:
// Keep the FULL JobPosts object.  The previous version normalized the object
// down to only id/title/company/location/rate/type/status, which accidentally
// removed shift/headcount/description and made JobDetailModal unable to show
// the data entered in the internal admin system.

const JOBS_API_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxf5sgRpnMaiU8lWPJ_0_n34jaJgc1-pKUnyjf5d7nvAIP5v0hF_ZRss-NJru5zLnux/exec?action=published';

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

const normalizeJob = (job = {}) => {
  const city = job.city || '';
  const district = job.district || '';

  const location =
    job.location ||
    [city, district].filter(Boolean).join('');

  const salaryMin =
    hasValue(job.salaryMin)
      ? Number(job.salaryMin)
      : null;

  const salaryMax =
    hasValue(job.salaryMax)
      ? Number(job.salaryMax)
      : null;

  const rate =
    hasValue(job.rate)
      ? job.rate
      : salaryMin !== null && salaryMax !== null
        ? `${salaryMin}～${salaryMax}`
        : salaryMin !== null
          ? `${salaryMin}`
          : '';

  return {
    // Preserve every field returned by JobPosts API.
    ...job,

    // Stable fields used by the current UI.
    id: job.id,
    title: job.title || '',
    company: job.company || '',
    city,
    district,
    location,
    salaryType: job.salaryType || '',
    salaryMin,
    salaryMax,
    rate,
    type: job.type || '',
    shift: job.shift || job.schedule || '',
    headcount: job.headcount ?? '',
    description: job.description || job.content || '',
    requirements:
      job.requirements ||
      job.requirement ||
      job.qualifications ||
      '',
    benefits:
      job.benefits ||
      job.welfare ||
      '',
    tags: job.tags || [],
    status: job.status || '',
    startDate:
      job.startDate ||
      job.workStartDate ||
      job.date ||
      '',
  };
};

export async function fetchPublishedJobs() {
  try {
    const response = await fetch(JOBS_API_ENDPOINT);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const jobsArray = Array.isArray(data)
      ? data
      : Array.isArray(data?.jobs)
        ? data.jobs
        : [];

    return jobsArray.map(normalizeJob);
  } catch (error) {
    console.error('Failed to fetch published jobs:', error);
    throw error;
  }
}
