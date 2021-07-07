module.exports = {
	async rewrites() {
		return {
			// Commented while I try vercel rewrite
			// fallback: [
			// 	{
			// 		source: '/:path*',
			// 		destination: `https://d7.thoughtspot.com/:path*`,
			// 	},
			// ],
		}
	},
}