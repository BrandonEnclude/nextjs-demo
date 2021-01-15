import { buffer } from "micro";
import { getAdminToken, updateWallet } from "../../helpers"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
});
const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET

export default async function handler(req, res) {

    if (req.method === "POST") {
        const buf = await buffer(req)
        const sig = req.headers["stripe-signature"]
        let event;
        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`)
            return;
        }
        if (event.type === "payment_intent.succeeded") {
            const payment = event.data.object
            const { access_token } = await getAdminToken()
            await updateWallet(access_token, payment.receipt_email, payment.amount_received / 100)
            res.status(200)
            // Handle successful payment
        } else {
            console.warn(`Unhandled event type: ${event.type}`)
        }
        res.json({ received: true })
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed")
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
  }