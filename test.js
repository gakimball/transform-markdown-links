var transform = require('./');
var expect = require('chai').expect;

describe('transform()', function() {
  it('transforms Markdown links', function() {
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

  it('detects empty text links', function() {
    var input = '![](/resources/picture.JPG) Here is a link with no text.'
    var output = transform(input, function(link, text) {
      return 'http://url.to/picture';
    });
    expect(output).to.equal('![](http://url.to/picture) Here is a link with no text.')
  });

  it('matches link aliases', function() {
    var input = '[This link][alias] is an alias.\n\n[alias]: http://example.com';
    var output = transform(input, function(link, text) {
      return 'http://example.org';
    });
    expect(output).to.equal('[This link][alias] is an alias.\n\n[alias]: http://example.org');
  });

  it('matches link aliases with a link enclosed in angle brackets', function() {
    var input = '[This link][alias] is an alias.\n\n[alias]: <http://example.com>';
    var output = transform(input, function(link, text) {
      return 'http://example.org';
    });
    expect(output).to.equal('[This link][alias] is an alias.\n\n[alias]: <http://example.org>');
  });

  it('matches link aliases with a title', function() {
    var input = '[This link][alias] is an alias.\n\n[alias]: http://example.com (title)';
    var output = transform(input, function(link, text) {
      return 'http://example.org';
    });
    expect(output).to.equal('[This link][alias] is an alias.\n\n[alias]: http://example.org (title)');
  });
});
