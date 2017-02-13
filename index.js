var format = require('util').format;

// Thank you: http://stackoverflow.com/a/32382702 (with some modifications)
var linkRegExp = /\[([^\]]+)?\]\(([^\)]+)\)/g

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

  return output;
}
