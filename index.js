var format = require('util').format;

// Thank you: http://stackoverflow.com/a/32382702 (with some modifications)
var linkRegExp = /\[([^\]]+)?\]\(([^\)]+)\)/g;
var aliasLinkRegExp = /^\[(.*)\]:\s+(.*?)\s*(".*"|'.*'|\(.*\))?$/gm;

/**
 * Transform the links in a Markdown string using a transform function.
 * @param {String} input - Markdown input.
 * @param {TransformCallback} transform - Callback to transform each link.
 * @returns {String} Markdown with transformed links.
 *
 * @example
 * const input = 'This [link](page.md) will be transformed.';
 *
 * transformLinks(input, (link, text) => link + '?hooray');
 * // => 'This [link](page.md?hooray) will be transformed.'
 */
module.exports = function transformMarkdownLinks(input, transform) {
  var output = input;
  var match;

  // match[0] is the entire link
  // match[1] is the text, without the brackets
  // match[2] is the URL, without the parentheses
  while ((match = linkRegExp.exec(input)) !== null) {
    if (match[1] === undefined) {
      match[1] = "";
    }

    /**
     * Callback to transform a link within a Markdown string.
     * @callback TransformCallback
     * @param {String} link - URL of the link.
     * @param {String} text - Text of the link.
     * @returns {?String} Modified URL.
     */
    var replacement = transform(match[2], match[1]);

    if (replacement) {
      output = output.replace(match[0], format('[%s](%s)', match[1], replacement));
    }
  }

  // match[0] is the entire link
  // match[1] is the alias name
  // match[2] is the URL
  // match[3] is the title
  while ((match = aliasLinkRegExp.exec(input)) !== null) {
    var string = match[0];
    var alias = match[1];
    var url = match[2];
    var title = match[3];
    var urlBrackets = /^<.*>$/.test(url);
    var innerUrl = urlBrackets
      ? url.replace(/^</, '').replace(/>$/, '')
      : url;

    var replacement = transform(innerUrl, alias);
    if (urlBrackets) {
      replacement = '<' + replacement + '>';
    }

    if (replacement) {
      var titleText = title ? ' ' + title : '';
      output = output.replace(string, format('[%s]: %s', alias, replacement + titleText));
    }
  }

  return output;
}
