const { MetaTagList } = require("..");

const assert = require('assert');

describe('MetaTagList', function () {
  it("serializes tags to string", () => {
    const tags = new MetaTagList([
      {tag: "title", children: "Foobar"},
      {tag: "link", rel: "canonical", href: "http://foo.bar"},
      {name: "something", value: "somevalue"}
    ])
    assert.equal(tags.toString(), '<title>Foobar</title><link rel="canonical" href="http://foo.bar"/><meta name="something" value="somevalue"/>');
  })

  context("overriding tags", () => {
    const commonTags = [
      { tag: "title", children: "Foobar" },
      { tag: "link", rel: "canonical", href: "http://foo.bar" },
      { name: "something", value: "somevalue" }
    ];

    it("can override the title tag", () => {
      const tags = new MetaTagList([...commonTags, {tag: "title", children: "New Title"}]);
      assert.equal(tags.toString(), '<link rel="canonical" href="http://foo.bar"/><meta name="something" value="somevalue"/><title>New Title</title>');
    });

    it("can override a link tag", () => {
      const tags = new MetaTagList([...commonTags, { tag: "link", rel: 'canonical', href: "http://foo.baz" }]);
      assert.equal(tags.toString(), '<title>Foobar</title><meta name="something" value="somevalue"/><link rel="canonical" href="http://foo.baz"/>');
    });

    it("can override a meta tag", () => {
      const tags = new MetaTagList([...commonTags, { name: "something", value: "somevalue2" }]);
      assert.equal(tags.toString(), '<title>Foobar</title><link rel="canonical" href="http://foo.bar"/><meta name="something" value="somevalue2"/>');
    })
  })
});
