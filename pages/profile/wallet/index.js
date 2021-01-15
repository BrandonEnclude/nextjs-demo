import { getUser, getSObject } from "../../../helpers"
import { parseCookies } from "nookies";
import Link from 'next/link'

export default function Wallet({ userDetails }) {

    return (
        <>
          <h1>Your Wallet</h1>
          <h3>Amount: €{`${userDetails.Wallet_Amount__c}`}</h3>
          <Link href="/profile/wallet/checkout"><a className="button">Add €10 Credit</a></Link>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const { access_token } = parseCookies(ctx)
    try {
        const user = await getUser(access_token)
        const userDetails = await getSObject(access_token, 'User', user.user_id)
        return {
            props: { 
                userDetails: userDetails
            }
        }
    } catch(err) {
        console.log(err)
        return {
            redirect: {
              destination: '/?auth=false',
              permanent: false,
            },
        }
    }
}