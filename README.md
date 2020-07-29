# quintype-node-seo
SEO modules for the malibu app

The documentation can be found here: [https://developers.quintype.com/quintype-node-seo](https://developers.quintype.com/quintype-node-seo).

Some advanced topics which are not covered in the documentation are below

### Entity Tags

If story has any entity associated in the story-attributes, StructuredDataTags will be generated for those entities. Right now we are doing it only for movie.
To generate the Entity Tags, while executing getMetaTags on the SEO instance, the data argument should look like:
```
  data : {
    story:<storyObject>,
    linkedEntities: [
      <EntityObjects for all the associated entities>
    ]
  }
```
data Object should have a key called "linkedEntities" and the value should be an array of all Entities.
Please also refer to the test case "Structured DataTags for Entity" in structured_data_tags_test

### Note

If the ```URL``` is undefined, please bump up the node version > 8.
