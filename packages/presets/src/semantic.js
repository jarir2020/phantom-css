export const semanticElementMappings = {
  html: { role: 'document', theme: 'neutral', className: 'pc-doc-root' },
  body: { role: 'page', theme: 'light', className: 'pc-page' },
  header: { role: 'banner', theme: 'brand', className: 'pc-banner' },
  nav: { role: 'navigation', theme: 'slate', className: 'pc-nav' },
  main: { role: 'main', theme: 'light', className: 'pc-main' },
  footer: { role: 'contentinfo', theme: 'graphite', className: 'pc-footer' },
  section: { role: 'region', theme: 'neutral', className: 'pc-section' },
  article: { role: 'article', theme: 'pearl', className: 'pc-article' },
  aside: { role: 'complementary', theme: 'glass', className: 'pc-aside' },
  button: { role: 'button', theme: 'brand', className: 'ui-button' },
  a: { role: 'link', theme: 'ocean', className: 'ui-link' },
  input: { role: 'form-control', theme: 'light', className: 'ui-input' },
  select: { role: 'form-control', theme: 'light', className: 'ui-select' },
  textarea: { role: 'form-control', theme: 'light', className: 'ui-textarea' },
  label: { role: 'form-label', theme: 'neutral', className: 'ui-label' },
  table: { role: 'data-table', theme: 'slate', className: 'ui-table' },
  thead: { role: 'table-header', theme: 'slate', className: 'ui-table-head' },
  tbody: { role: 'table-body', theme: 'slate', className: 'ui-table-body' },
  tr: { role: 'table-row', theme: 'neutral', className: 'ui-table-row' },
  th: { role: 'table-header-cell', theme: 'neutral', className: 'ui-table-head-cell' },
  td: { role: 'table-cell', theme: 'neutral', className: 'ui-table-cell' },
  h1: { role: 'heading', theme: 'aurora', className: 'ui-h1' },
  h2: { role: 'heading', theme: 'aurora', className: 'ui-h2' },
  h3: { role: 'heading', theme: 'aurora', className: 'ui-h3' },
  h4: { role: 'heading', theme: 'aurora', className: 'ui-h4' },
  h5: { role: 'heading', theme: 'aurora', className: 'ui-h5' },
  h6: { role: 'heading', theme: 'aurora', className: 'ui-h6' },
  p: { role: 'paragraph', theme: 'neutral', className: 'ui-paragraph' },
  code: { role: 'code', theme: 'mono', className: 'ui-code' },
  pre: { role: 'code-block', theme: 'mono', className: 'ui-pre' },
  blockquote: { role: 'quote', theme: 'pearl', className: 'ui-quote' },
  form: { role: 'form', theme: 'brand', className: 'ui-form' }
};

export function listSemanticElements() {
  return Object.keys(semanticElementMappings);
}

export function getSemanticElementMapping(tagName = 'div') {
  return semanticElementMappings[String(tagName).toLowerCase()] || {
    role: 'generic',
    theme: 'neutral',
    className: `ui-${String(tagName).toLowerCase()}`
  };
}

export function createSemanticMap(tags = listSemanticElements()) {
  return tags.reduce((map, tag) => {
    map[tag] = getSemanticElementMapping(tag);
    return map;
  }, {});
}

export default semanticElementMappings;
