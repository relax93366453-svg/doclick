import React from 'react';

const JobDetailModal = ({ job, onClose, onApply }) => {
  if (!job) return null;

  const hasValue = (value) =>
    value !== undefined &&
    value !== null &&
    String(value).trim() !== '';

  const location =
    [job.city, job.district].filter(hasValue).join('') ||
    job.location ||
    '';

  const salary =
    job.salary ||
    (
      hasValue(job.salaryMin) || hasValue(job.salaryMax)
        ? `$${job.salaryMin ?? ''}${hasValue(job.salaryMax) ? `～${job.salaryMax}` : ''}${job.salaryType === '時薪' ? '/hr' : ''}`
        : ''
    );

  const employmentType =
    job.type || job.jobType || '';

  const shift =
    job.shift || job.schedule || '';

  const headcount =
    hasValue(job.headcount)
      ? `${job.headcount} 人`
      : '';

  const startDate =
    job.startDate || job.workStartDate || '';

  const requirements =
    job.requirements ||
    job.requirement ||
    job.qualifications ||
    '';

  const benefits =
    job.benefits ||
    job.welfare ||
    '';

  const description =
    job.description || job.content || '';

  const renderTextBlock = (text) => {
    if (!hasValue(text)) return null;

    const lines = String(text)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      return (
        <p className="text-gray-700 leading-7 whitespace-pre-wrap">
          {text}
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="text-gray-700 leading-7"
          >
            {line}
          </p>
        ))}
      </div>
    );
  };

  const InfoCard = ({ label, value, accent = false }) => {
    if (!hasValue(value)) return null;

    return (
      <div className="rounded-lg bg-gray-50 px-4 py-3">
        <div className="mb-1 text-sm text-gray-500">
          {label}
        </div>
        <div
          className={
            accent
              ? 'font-bold text-orange-600'
              : 'font-semibold text-gray-800'
          }
        >
          {value}
        </div>
      </div>
    );
  };

  const Section = ({ title, children }) => {
    if (!children) return null;

    return (
      <section className="mt-6">
        <h3 className="mb-3 border-l-4 border-orange-500 pl-2 text-lg font-bold text-gray-900">
          {title}
        </h3>
        {children}
      </section>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 text-2xl text-gray-400 transition hover:text-gray-700"
            aria-label="關閉"
          >
            ✕
          </button>

          <div className="pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {job.title || '職缺資訊'}
              </h2>

              {hasValue(employmentType) && (
                <span className="rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-600">
                  {employmentType}
                </span>
              )}
            </div>

            {hasValue(job.company) && (
              <p className="mt-1 text-gray-500">
                {job.company}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoCard
              label="薪資待遇"
              value={salary}
              accent
            />
            <InfoCard
              label="工作地點"
              value={location}
            />
            <InfoCard
              label="工作時間"
              value={shift}
            />
            <InfoCard
              label="需求人數"
              value={headcount}
            />
            <InfoCard
              label="上工日期"
              value={startDate}
            />
          </div>

          {hasValue(description) && (
            <Section title="工作內容">
              {renderTextBlock(description)}
            </Section>
          )}

          {hasValue(requirements) && (
            <Section title="需求條件">
              {renderTextBlock(requirements)}
            </Section>
          )}

          {hasValue(benefits) && (
            <Section title="福利制度">
              {renderTextBlock(benefits)}
            </Section>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-50"
          >
            取消
          </button>

          {typeof onApply === 'function' && (
            <button
              type="button"
              className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600"
              onClick={() => onApply(job)}
            >
              立即應徵
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
