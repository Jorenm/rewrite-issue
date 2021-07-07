import fetchData from 'data/fetchData'

export async function getPageBySlug(slug, preview) {
	let bodyField = 'body'
	let titleField = 'title'

	const response = await fetchData(`
		allPages() {
			${bodyField}
			${titleField}
			slug
			_seoMetaTags {
				attributes
				content
				tag
			}
			id
		}
	`, [
		`filter: {slug: {eq: "${slug.join('/')}"}}`
	], false, preview)

	return response['allPages']
}