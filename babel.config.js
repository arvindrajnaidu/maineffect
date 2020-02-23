const presets = [
    [
      "@babel/env",
      {
        targets: {
          node: 'current',
        },
      },
    ],
    "@babel/preset-react",
  ];

  const plugins = ["@babel/plugin-transform-spread", "istanbul"]
  
  module.exports = { presets, plugins };
