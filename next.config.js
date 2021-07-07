module.exports = {
	async rewrites() {
		return {
			fallback: [
				// These rewrites are checked after both pages/public files
				// and dynamic routes are checked
				{
					source: '/:path*',
					destination: `https://www.apple.com/:path*`,
				},
			],
		}
	},
}