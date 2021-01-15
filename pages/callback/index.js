import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { setCookie } from "nookies";
import { getAuth } from "../../helpers"

export default function Callback({ access_token }) {
  const router = useRouter()
  useEffect(() => {
    router.push('/profile')
  })
  return (
    <div className="container">

      <h2>Logging you in</h2>
      <h5>This should just take a second...</h5>
      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const auth = await getAuth(ctx.query.code)
  if (!auth) {
    return {
      redirect: {
        destination: '/?auth=false',
        permanent: false,
      },
    }
  }
  setCookie(ctx, 'access_token', auth.access_token, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })
  return { props: { access_token: auth.access_token }}
}
