import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-PLJ5DK5K50");
};

export const trackPageView = (path: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};