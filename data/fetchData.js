async function recursivelyFetchData(query, skip, fetchAll, preview) {
	const pageLength = 5

	if (skip) {
		// If we're on a page past the first, update the skip value.
		query = query.replace(/skip: "\d+"/, `skip: "${skip}"`)
	} else {
		// If we're on page 0, add the skip value
		query = query.replace('first:', `skip: "${skip}", first:`)
	}

	const res = await fetch(
		'https://graphql.datocms.com/' + (preview ? 'preview' : ''), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer e6019568380a7f986adc32c5032e56`,
			},
			body: JSON.stringify({
				query: query
			})
		}
	)

	const json = await res.json()

	if (json.errors) {
		console.log('fetchDataQueryError', json.errors, query)
		return []
	}

	try {
		const responseKeys = Object.keys(json.data)
		const filteredResponseKeys = responseKeys.filter((key) => {
			return key.match(/_all\w+Meta/)
		})
		const meta = json.data[filteredResponseKeys[0]]

		if (fetchAll && meta && meta.count > skip + pageLength) {
			const contentTypeSlug = filteredResponseKeys[0].match(/_(all\w+)Meta/)[1]
			const newData = await recursivelyFetchData(query, skip + pageLength, fetchAll, preview)
			if (newData && newData[contentTypeSlug].length) {
				json.data[contentTypeSlug] = json.data[contentTypeSlug].concat(newData[contentTypeSlug])
			}
		}
	} catch (e) {
		console.log('Recursion Fail', e)
		return json.data
	}

	return json.data
}

async function fetchData(query, filters, fetchAll, preview) {
	const pageLength = 5

	query = `query MyQuery {
		${query}
	}`

	// Remove empty filter values
	if (filters)
		filters = filters.filter(Boolean)

	if (fetchAll && filters) {
		filters.push(`first: "${pageLength}"`)
	}

	if (filters && filters.length) {
		query = query.replace('()', `(${filters.join(',')})`)
	} else {
		query = query.replace('()', '')
	}

	let fetchedData = await recursivelyFetchData(query, 0, fetchAll, preview)

	return fetchedData
}

export default fetchData