/**
 * @providesModule generateIconSetFromCss
 */
// const _ = require('lodash');
import _ from 'lodash';

const fs = require('fs');

function extractGlyphMapFromCss(files, selectorPattern) {
  const styleRulePattern = '(\\.[A-Za-z0-9_.:, \\n\\t-]+)\\{[^}]*content: ?["\\\']\\\\([a-fA-F0-9]+)["\\\'][^}]*\\}';
  const allStyleRules = new RegExp(styleRulePattern, 'g');
  const singleStyleRules = new RegExp(styleRulePattern);
  const allSelectors = new RegExp(selectorPattern, 'g');
  const singleSelector = new RegExp(selectorPattern);

  const glyphMap = {};
  if (typeof files === 'string') {
    files = [files];
  }

  files.forEach((fileName) => {
    const contents = fs.readFileSync(fileName, { encoding: 'utf8' });
    const rules = contents.match(allStyleRules);
    if (rules) {
      rules.forEach((rule) => {
        const ruleParts = rule.match(singleStyleRules);
        const charCode = parseInt(ruleParts[2], 16);
        const selectors = ruleParts[1].match(allSelectors);
        if (selectors) {
          selectors.forEach((selector) => {
            const name = selector.match(singleSelector)[1];
            glyphMap[name] = charCode;
          });
        }
      });
    }
  });
  return glyphMap;
}

function escapeRegExp(str) {
  // eslint-disable-next-line
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function generateIconSetFromCss(cssFiles, selectorPrefix, template, data) {
  const glyphMap = extractGlyphMapFromCss(cssFiles, `${escapeRegExp(selectorPrefix)}([A-Za-z0-9_-]+):before`);
  let content = JSON.stringify(glyphMap, null, '  ');
  if (template) {
    const compiled = _.template(template);
    data = data || {};
    data.glyphMap = content;
    content = compiled(data);
  }
  return content;
}

module.exports = generateIconSetFromCss;
