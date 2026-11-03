import { t } from './i18n';
import { esc } from './panel';
import { seriesId, seriesUrl, isDerived, type ManifestEntry } from './manifest';
import type { Lang } from './routes';

/** Sources & licences table: one row per live series, straight from the manifest. */
export function sourcesTable(entries: ManifestEntry[], lang: Lang): string {
  const own = ` / ${t(lang, 'source.own')}`;
  const rows = entries.map((m) => `<tr><td>${esc(m.title[lang])}</td><td>${esc(m.publisher)}</td>`
    + `<td><a href="${esc(seriesUrl(m))}">${esc(seriesId(m))}</a></td>`
    + `<td><a href="${esc(m.licence.url)}">${esc(m.licence.name)}</a></td>`
    + `<td>${esc(m.attribution[lang])}${isDerived(m) ? own : ''}</td></tr>`).join('');
  const th = ['series', 'publisher', 'id', 'licence', 'attribution'].map((c) => `<th>${t(lang, 'sources.col.' + c)}</th>`).join('');
  return `<table class="sources"><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`;
}
