export const Services = {
  get: (url) => {
    return fetch(url).then((response) => response.json());
  },
};
