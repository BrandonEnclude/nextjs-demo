import Stripe from "stripe"
import { getUser } from "../../../helpers"
import { parseCookies } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../components/CheckoutForm";
import { useRouter } from 'next/router'

export default function Checkout({paymentIntent, stripe_publishable_key}) {
    const stripePromise = loadStripe(stripe_publishable_key);
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm paymentIntent={paymentIntent}/>
        </Elements>
    )
}

export async function getServerSideProps(ctx) {
    const { access_token } = parseCookies(ctx)
    let user
    try {
        user = await getUser(access_token)
    } catch(err) {
        return {
            redirect: {
              destination: '/?auth=false',
              permanent: false,
            },
        }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // No existing payment intent; create intent and set cookie
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: "eur",
        receipt_email: user.email
    });
    return {
        props: {
          paymentIntent: paymentIntent,
          stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY
        }
    };
}