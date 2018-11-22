"use strict";

module.exports = function(api) {
  const env = api.env();
  let plugins = [];

  // let envOptions = {modules: false};
  // if (env === 'esmodules') {
  //   envOptions = {"targets": {"esmodules": true}};
  // }
  
  // if (env === 'test') {
  //   envOptions = {"targets": {"node": true}};
  // }

  let config = {
    presets: [
      "@babel/preset-react",
      // [
      //   "@babel/preset-env", 
      //   envOptions
      // ],
    ],
    plugins: plugins
  };
  
  return config;
}