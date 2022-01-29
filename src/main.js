// @ts-check

// 프레임워크 없이 간단한 토이프로젝트 웹 서버 만들어보기

/**
 * 블로그 포스팅 서비스
 * - 로컬 파일을 데이터베이스로 활용 (JSON)
 * - 인증 로직은 제외
 * - RESTful API 사용
 */

const http = require('http');

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: 'first_post',
    title: 'First post!',
    content: 'Hi! This is my first post.',
  },
  {
    id: 'second_post',
    title: 'Second post...',
    content: 'Oh yeah!',
  },
];

/**
 * Post
 *
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */

const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9_-]+)$/;
  const postIdRegexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;

  // GET /posts
  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
      totalCount: posts.length,
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; encoding=utf-8');
    res.end(JSON.stringify(result));

    // GET /posts/:id
  } else if (postIdRegexResult && req.method === 'GET') {
    const postId = postIdRegexResult[1];
    const post = posts.find((_post) => _post.id === postId);

    if (post) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; encoding=utf-8');
      res.end(JSON.stringify(post));
    } else {
      res.statusCode = 404;
      res.end('Post not found.');
    }

    // PUT /posts
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8');
    req.on('data', (data) => {
      /**
       * @typedef CreatePostBody
       * @property {string} title
       * @property {string} content
       */

      /** @type {CreatePostBody} */
      const body = JSON.parse(data);
      posts.push({
        id: body.title.toLocaleLowerCase().replace(/\s/g, '_'),
        title: body.title,
        content: body.content,
      });
    });
    res.statusCode = 200;
    res.end('Creating post...');
  } else {
    res.statusCode = 404;
    res.end('Not fount.');
  }
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`);
});
