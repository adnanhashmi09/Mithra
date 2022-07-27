import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [{ shipping_rate: 'shr_1LQEvbSHmNiFKSh3EbFDCRaW' }],
        line_items: req.body.map((item) => {
          console.log('------------------------------------------------------');
          console.log(item);
          const img = item.product.image[0].asset._ref;
          const newImage = img
            .replace(
              'image-',
              'https://cdn.sanity.io/images/50pnuw2c/production/'
            )
            .replace('-webp', '.webp');

          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: item.product.name,
                images: [newImage],
              },
              unit_amount: (item.product.price + item.gas) * 100,
            },
            adjustable_quantity: {
              enabled: false,
            },
            quantity: item.qty,
          };
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
