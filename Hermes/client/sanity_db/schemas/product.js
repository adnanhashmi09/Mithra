export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }],
      options: {
        hotspot: true,
      },
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 90,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'details',
      title: 'Details',
      type: 'string',
    },
    {
      name: 'sold',
      title: 'Sold',
      type: 'boolean',
    },
    {
      name: 'owner',
      title: 'Owner',
      type: 'string',
    },
    {
      name: 'warrantyPeriod',
      title: 'Warranty Period',
      type: 'number',
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
    },
    {
      name: 'contractAddress',
      title: 'Contract Address',
      type: 'string',
    },
    {
      name: 'brandAddress',
      title: 'Brand Address',
      type: 'string',
    },
  ],
};
