const product = {
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 200,
      },
    },
    {
      name: "author",
      title: "Author",
      type: "string",
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "category",
      title: "Category",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    },
    {
      name: "publisher",
      title: "Publisher",
      type: "array",
      of: [{ type: "reference", to: { type: "publisher" } }],
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "bestseller",
      title: "Bestseller",
      type: "boolean",
    },
    {
      name: "recent",
      title: "Recently Released",
      type: "boolean",
    },
    {
      name: "format",
      title: "Format",
      type: "string",
    },
    {
      name: "language",
      title: "Language",
      type: "string",
    },
    {
      name: "pages",
      title: "Pages",
      type: "number",
    },
    {
      name: "isbn",
      title: "ISBN",
      type: "number",
    },
  ],
};

export default product;
