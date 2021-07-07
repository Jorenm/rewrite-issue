import Head from 'next/head'
import ErrorPage from 'next/error'

import {getPageBySlug} from 'data/cms'
import _ from 'lodash'

export default function BasicPage({page}) {
	console.log(page)

	if (!page?.slug) {
		return <ErrorPage statusCode={404} />
	}

	return <div>
		<Head></Head>
		<h1>{page.title}</h1>
		<div className="content">{page.body}</div>
	</div>

}

export async function getStaticProps({params, preview = false}) {
	// if preview is passed in as true it's from the next.js cookie and the whole page is dynamic.
	let dynamicPreview = preview
	
	if (!process.env.production)
		preview = true
	
	let page = await getPageBySlug(params.slug, preview)

	try {
		if (!page || !page.length)
			return {notFound: true}

		return {
			props: {
				page: page[0]
			}
		}
	} catch (e) {
		console.log('getStaticProps Exception', e)
	}
}

export async function getStaticPaths({preview = false}) {
	
	if (!process.env.production)
		preview = true
	
	let allPaths = []

	return {paths: allPaths, fallback: 'blocking'}		
}