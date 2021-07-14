import env from '../.env-cmdrc.js';

const { GOOGLE_ANALYTICS_MEASUREMENT_ID } = env.production;

export const pageView = url => {
  window.gtag('config', GOOGLE_ANALYTICS_MEASUREMENT_ID, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params);
};
