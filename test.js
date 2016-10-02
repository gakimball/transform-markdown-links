var transform = require('./');
var expect = require('chai').expect;

describe('transform()', function() {
  it('transforms Markdown links', () => {
    var input = 'There\'s a [link](page.md) or [two](page2.md) in this sentence.';
    var output = transform(input, function(link, text) {
      return link.replace('md', 'html');
    });
    expect(output).to.equal('There\'s a [link](page.html) or [two](page2.html) in this sentence.');
  });

  it('calls the transform function with the URL and text of the link', function() {
    transform('[text](url)', function(link, text) {
      expect(link).to.equal('url');
      expect(text).to.equal('text');
    });
  });
});
