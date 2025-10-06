export const REFERRAL_MODAL_EVENT = 'cardic:open-referral-modal' as const;

export function dispatchReferralModalOpen() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(REFERRAL_MODAL_EVENT));
}
