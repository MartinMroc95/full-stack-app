export default {
  version: 3,
  routes: [
    {
      src: '/(.*)',
      has: [
        {
          type: 'host',
          value: '.*\\.vercel\\.app', // Added only for preview domains
        },
      ],
      continue: true,
      middlewares: [
        {
          // Middleware for basic auth
          middleware: 'basic-auth',
          config: {
            users: [
              {
                username: process.env.PREVIEW_USERNAME,
                password: process.env.PREVIEW_PASSWORD,
              },
            ],
          },
        },
      ],
    },
  ],
}
