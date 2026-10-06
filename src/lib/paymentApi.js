// =========================================================
// MYNVORA — PAYMENT API (user app)
// Supports subscriptions AND add-ons (stars, boost, hookups).
// =========================================================
import api from './api.js';

/* ── fetch plan catalog ───────────────────────────────── */
export async function fetchPlans() {
  const { data } = await api.get('/payment/plans');
  return data.plans || [];
}

/* ── current subscription ─────────────────────────────── */
export async function fetchSubscription() {
  const { data } = await api.get('/payment/subscription');
  return data.subscription;
}

/* ── payment history ──────────────────────────────────── */
export async function fetchHistory(limit = 20) {
  const { data } = await api.get('/payment/history', { params: { limit } });
  return data.history || [];
}

/* ── create order ─────────────────────────────────────── */
/* payload = { tier: 'gold' }  OR  { addonId: 'stars_14' } */
export async function createOrder(payload) {
  const { data } = await api.post('/payment/create-order', payload);
  return data;
}

/* ── verify payment ───────────────────────────────────── */
export async function verifyPayment(payload) {
  const { data } = await api.post('/payment/verify', payload);
  return data;
}
/* ── HOOKUPS status ───────────────────────────────────── */
export async function fetchHookupStatus() {
  const { data } = await api.get('/payment/hookups/status');
  return data;
}

/* ── HOOKUPS — record one swipe ───────────────────────── */
export async function recordHookupSwipe() {
  const { data } = await api.post('/payment/hookups/swipe');
  return data;
}

/* ═══════════════════════════════════════════════════════
   MAIN CHECKOUT FLOW
   Accepts:
     startCheckout({ tier: 'gold' })
     startCheckout({ addonId: 'stars_14' })
   ═══════════════════════════════════════════════════════ */
export async function startCheckout(payload) {
  if (typeof window === 'undefined' || !window.Razorpay) {
    throw new Error('Razorpay SDK not loaded. Refresh the page.');
  }

  const isSubscription = !!payload?.tier;
  console.log('[checkout] creating order:', payload);

  const order = await createOrder(payload);
  console.log('[checkout] order created:', order.orderId, 'amount:', order.amount);

  return new Promise((resolve, reject) => {
    let settled = false;

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Mynvora',
      description: isSubscription
        ? `${order.itemName} subscription — weekly`
        : order.itemName,
      order_id: order.orderId,
      prefill: {
        email: order.userEmail || undefined,
        name: order.userName || undefined,
      },
      theme: { color: '#ff3b81' },

      handler: async (response) => {
        if (settled) return;
        settled = true;

        console.log('[razorpay] success response:', response);

        try {
          const verifyPayload = {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            ...payload, // includes tier OR addonId
          };
          const result = await verifyPayment(verifyPayload);
          console.log('[razorpay] verify result:', result);

          setTimeout(() => {
            console.log('[checkout] resolving');
            resolve(result);
          }, 400);
        } catch (err) {
          console.error('[razorpay] verify failed:', err);
          reject(err);
        }
      },

      modal: {
        ondismiss: () => {
          if (settled) return;
          settled = true;
          const e = new Error('Payment cancelled');
          e.code = 'USER_CANCELLED';
          reject(e);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response) => {
      if (settled) return;
      settled = true;
      console.error('[razorpay] payment.failed:', response);
      const e = new Error(response.error?.description || 'Payment failed');
      e.code = 'PAYMENT_FAILED';
      e.details = response.error;
      reject(e);
    });

    console.log('[checkout] opening razorpay modal');
    rzp.open();
  });
}

export default {
  fetchPlans,
  fetchSubscription,
  fetchHistory,
  createOrder,
  verifyPayment,
  startCheckout,
  fetchHookupStatus,
  recordHookupSwipe,
};