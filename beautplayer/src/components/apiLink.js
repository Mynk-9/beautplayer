const API =
    process.env.NODE_ENV === 'development'
        ? window.location.origin.substring(
              0,
              window.location.origin.lastIndexOf(':')
          ) + ':5000'
        : process.env.REACT_APP_API_PROD;

export default API;
