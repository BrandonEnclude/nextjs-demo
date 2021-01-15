import React from "react"
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { destroyCookie } from "nookies"
import { withRouter } from 'next/router'
import { useState } from 'react'

const CheckoutForm = ({ paymentIntent, router }) => {
    const [loading, setLoading] = useState(false)
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    try {
        const {
            error,
            paymentIntent: { status }
        } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (error) throw new Error(error.message);

        if (status === "succeeded") {
            destroyCookie(null, 'paymentIntentId')
            alert('Payment made!')
            router.push('/profile/wallet')
        }
    } catch (err) {
        alert(err.message);
    }
};

  return (
    <>
        <h1>Your Wallet</h1>
        <h3>Enter your payment details to add credit</h3>
        <form onSubmit={handleSubmit}>
            <CardElement
            options={{
                hidePostalCode: true,
                style: {
                base: {
                    fontSize: '20px',
                    color: '#424770',
                    '::placeholder': {
                    color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#9e2146',
                },
                },
            }}
            />
            <br />
            <button className={`${loading ? 'button loading' : 'button'}`} type="submit" disabled={!stripe || loading}>{loading ? 'Processing Payment...' : 'Submit'}</button>
        </form>
    </>
  );
}

export default withRouter(CheckoutForm)