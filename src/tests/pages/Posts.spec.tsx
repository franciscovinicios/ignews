import { render, screen } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'


jest.mock('../../services/prismic')

const posts = [
  { slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '10 de julho' }
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument();
  });




  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'new-post',
            data : {
              title: [
                { type: 'heading', text: 'My new post'}
              ],
              content: [
                {type: 'paragraph', text: 'Post excerpt'}
              ]
            },
            last_publication_date: '07-10-2021'
          }
        ]
      }) 
    } as any)

    const response = await getStaticProps({})

    // espero da resposta 
    expect(response).toEqual(
      //seja igual 
      expect.objectContaining({
        // isso aqui 
        props: {
          posts: [{
            slug: 'new-post',
            title: 'My new post',
            exerpet: 'Post excerpt',
            updatedAt: '10 de julho de 2021'
          }]
        }
      })
    )

  })
})