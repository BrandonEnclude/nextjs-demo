import { getUser } from "../../helpers"
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'

export default function Profile({ user, sf_url, community_site }) {
    const router = useRouter()
    const logout = async () => {
        if (loading) return;
        setLoading(true)
        destroyCookie(null, 'access_token')
        window.location.href = `${sf_url}/${community_site}/secur/logout.jsp`
    }
    const [loading, setLoading] = useState(false)
    return (
        <>
          <div>
            <h1>{`${user.given_name}'s Profile`} </h1>
            <p>Welcome! <Link href="/profile/wallet"><a>Click here to view your wallet</a></Link></p>
            <a onClick={logout} className="button">{loading ? 'One Moment...' : 'Log Out'}</a>
          </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const { access_token } = parseCookies(ctx)
    try {
        return {
            props: { 
                user: await getUser(access_token),
                sf_url: process.env.SF_URL,
                community_site: process.env.COMMUNITY_SITE
            }
        }
    } catch(err) {
        return {
            redirect: {
              destination: '/?auth=false',
              permanent: false,
            },
        }
    }
}