import Head from 'next/head';

const IndexPage = () => {
  return (
    <div>
      <Head>
        <title>next-api-decorators-example</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <a href="/api/postman" download>
        <button>Download Postman collection</button>
      </a>
    </div>
  );
};

export default IndexPage;
