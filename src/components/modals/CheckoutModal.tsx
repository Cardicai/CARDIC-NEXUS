'use client';

import PaymentSheet, { type PaymentPlan } from '@/components/PaymentSheet';

type CheckoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PaymentPlan | null;
};

export default function CheckoutModal({
  open,
  onOpenChange,
  plan,
}: CheckoutModalProps) {
  const isReady = open && Boolean(plan);

  return (
    <PaymentSheet
      open={isReady}
      onClose={() => {
        onOpenChange(false);
      }}
      plan={plan}
    />
  );
}
