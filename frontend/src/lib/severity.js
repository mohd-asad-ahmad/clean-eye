export const SEVERITY_LABEL = { 1: 'Minor', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Critical' };
export const severityLevel = (s) => (s >= 4 ? 'high' : s === 3 ? 'mid' : 'low');
export const formatDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
