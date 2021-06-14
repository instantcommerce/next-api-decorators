module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['getting-started', 'basics'],
    },
    'route-matching',
    'validation',
    'pipes',
    'middlewares',
    'exceptions',
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: [
        'api/decorators',
        'api/create-param-decorator'
      ],
    },
  ],
};
