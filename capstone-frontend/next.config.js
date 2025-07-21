/** @type {import('next').NextConfig} */

module.exports = {
    module: {
        rules: [
          // Add a rule to exclude .node files
          {
            test: /\.node$/,
            loader: 'ignore-loader',
          },
        ],
      },
    reactStrictMode: true,
   
}
