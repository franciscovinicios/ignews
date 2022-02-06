import Prismic from '@prismicio/client';
export function getPrismicClient( req?: unknown) {
  const prismic = Prismic.client( // 2 parametro
    process.env.PRISMIC_ENDPOINT,
    { 
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      req, 

    }

  )
  return prismic;
}