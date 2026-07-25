/**
 * Map a projects.json `tech` string to a small set of icon names.
 * Only icons known to exist in the installed icon sets — build fails loudly
 * on unknown names, so additions get verified by `astro build`.
 */
const MAP: [RegExp, string][] = [
	[/python/i, 'simple-icons:python'],
	[/keras/i, 'simple-icons:keras'],
	[/tensorflow/i, 'simple-icons:tensorflow'],
	[/pandas/i, 'simple-icons:pandas'],
	[/numpy/i, 'simple-icons:numpy'],
	[/tableau/i, 'simple-icons:tableau'],
	[/excel/i, 'simple-icons:microsoftexcel'],
	[/c\+\+/i, 'simple-icons:cplusplus'],
	[/\blua\b/i, 'simple-icons:lua'],
	[/node\.js/i, 'simple-icons:nodedotjs'],
	[/express/i, 'simple-icons:express'],
	[/mongodb|pymongo/i, 'simple-icons:mongodb'],
	[/redis/i, 'simple-icons:redis'],
	[/postgres/i, 'simple-icons:postgresql'],
	[/spark/i, 'simple-icons:apachespark'],
	[/scala/i, 'simple-icons:scala'],
	[/hdfs/i, 'simple-icons:apachehadoop'],
	[/docker/i, 'simple-icons:docker'],
	[/kubernetes/i, 'simple-icons:kubernetes'],
	[/cmake/i, 'simple-icons:cmake'],
	[/latex/i, 'simple-icons:latex'],
	[/figma/i, 'simple-icons:figma'],
	[/astro/i, 'simple-icons:astro'],
	[/javascript/i, 'simple-icons:javascript'],
	[/sdl/i, 'lucide:gamepad-2'],
	[/milkytracker/i, 'lucide:music'],
	[/davinci|after effects/i, 'lucide:clapperboard'],
	[/markdown/i, 'simple-icons:markdown'],
	[/html/i, 'simple-icons:html5'],
	[/cloudflare/i, 'simple-icons:cloudflare'],
	[/scraping|selenium/i, 'simple-icons:selenium'],
	[/sklearn|scikit/i, 'simple-icons:scikitlearn'],
	[/nlp/i, 'lucide:message-square-text'],
];

export function techIcons(tech: string, max = 5): string[] {
	const out: string[] = [];
	for (const [re, icon] of MAP) {
		if (re.test(tech) && !out.includes(icon)) out.push(icon);
	}
	return out.slice(0, max);
}
