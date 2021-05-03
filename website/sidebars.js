module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['getting-started', 'basic-comparison'],
    },
    {
      type: 'category',
      label: 'Routing',
      items: ['routes/basics', 'routes/route-matching']
    },
    'validation',
    'pipes',
    'exceptions',
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: [
        'api/decorators'
      ],
    },
  ],
};
