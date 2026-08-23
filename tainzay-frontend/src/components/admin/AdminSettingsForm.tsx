'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { adminApi } from '@/lib/api';
import type { AdminSettingsResponse } from '@/types';

interface AdminSettingsFormProps {
  initialData: AdminSettingsResponse;
  error?: string | null;
}

export default function AdminSettingsForm({ initialData, error }: AdminSettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialData.settings);
  const [notifications] = useState(initialData.notifications);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const response = await adminApi.updateSettings(settings);
      setSettings(response.data.settings);
      setSaveSuccess('Settings saved. Checkout and announcement bar will use the new values.');
      router.refresh();
    } catch (submitError: unknown) {
      const message =
        (submitError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save settings.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-settings">
      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          Could not load the latest settings. Showing defaults until the API is reachable.
        </div>
      )}

      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <section className="admin-detail-card">
          <h2 className="admin-detail-card-title">Store contact</h2>
          <div className="admin-settings-grid">
            <label className="admin-order-status-field" htmlFor="settings-email">
              <span className="admin-form-label">Support email</span>
              <input
                id="settings-email"
                type="email"
                className="admin-form-input"
                value={settings.supportEmail}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, supportEmail: event.target.value }))
                }
              />
            </label>

            <label className="admin-order-status-field" htmlFor="settings-phone-display">
              <span className="admin-form-label">Phone display</span>
              <input
                id="settings-phone-display"
                type="text"
                className="admin-form-input"
                value={settings.phoneDisplay}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, phoneDisplay: event.target.value }))
                }
              />
            </label>

            <label className="admin-order-status-field" htmlFor="settings-phone-tel">
              <span className="admin-form-label">Phone tel link</span>
              <input
                id="settings-phone-tel"
                type="text"
                className="admin-form-input"
                value={settings.phoneTel}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, phoneTel: event.target.value }))
                }
              />
            </label>

            <label className="admin-order-status-field" htmlFor="settings-whatsapp">
              <span className="admin-form-label">WhatsApp number</span>
              <input
                id="settings-whatsapp"
                type="text"
                className="admin-form-input"
                value={settings.whatsappPhone}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, whatsappPhone: event.target.value }))
                }
              />
            </label>

            <label className="admin-order-status-field admin-settings-field-full" htmlFor="settings-whatsapp-message">
              <span className="admin-form-label">WhatsApp default message</span>
              <textarea
                id="settings-whatsapp-message"
                className="admin-form-textarea"
                rows={3}
                value={settings.whatsappMessage}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, whatsappMessage: event.target.value }))
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-detail-card">
          <h2 className="admin-detail-card-title">Checkout & delivery</h2>
          <div className="admin-settings-grid">
            <label className="admin-order-status-field" htmlFor="settings-free-delivery">
              <span className="admin-form-label">Free delivery from (PKR)</span>
              <input
                id="settings-free-delivery"
                type="number"
                min="0"
                className="admin-form-input"
                value={settings.freeDeliveryMin}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    freeDeliveryMin: Number(event.target.value),
                  }))
                }
              />
            </label>

            <label className="admin-order-status-field" htmlFor="settings-delivery-fee">
              <span className="admin-form-label">Standard delivery fee (PKR)</span>
              <input
                id="settings-delivery-fee"
                type="number"
                min="0"
                className="admin-form-input"
                value={settings.deliveryFee}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    deliveryFee: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-detail-card">
          <h2 className="admin-detail-card-title">Notifications</h2>

          <div className="admin-settings-status-grid">
            <div className="admin-settings-status-card">
              <p className="admin-settings-status-label">Email provider</p>
              <p className="admin-settings-status-value">{notifications.email.provider}</p>
              <span
                className={`admin-status ${notifications.email.configured ? 'admin-status-responded' : 'admin-status-pending'}`}
              >
                {notifications.email.configured ? 'Configured' : 'Not configured'}
              </span>
            </div>
            <div className="admin-settings-status-card">
              <p className="admin-settings-status-label">WhatsApp provider</p>
              <p className="admin-settings-status-value">{notifications.whatsapp.provider}</p>
              <span
                className={`admin-status ${notifications.whatsapp.configured ? 'admin-status-responded' : 'admin-status-pending'}`}
              >
                {notifications.whatsapp.configured ? 'Configured' : 'Not configured'}
              </span>
            </div>
          </div>

          <div className="admin-settings-toggles">
            <label className="admin-product-checkbox">
              <input
                type="checkbox"
                checked={settings.notifyEmailOnOrder}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    notifyEmailOnOrder: event.target.checked,
                  }))
                }
              />
              <span>Email me when a new order or quote arrives</span>
            </label>

            <label className="admin-product-checkbox">
              <input
                type="checkbox"
                checked={settings.notifyWhatsAppOnOrder}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    notifyWhatsAppOnOrder: event.target.checked,
                  }))
                }
              />
              <span>WhatsApp me when a new order or quote arrives</span>
            </label>

            <label className="admin-product-checkbox">
              <input
                type="checkbox"
                checked={settings.notifyAdminOnReview}
                disabled={isSaving}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    notifyAdminOnReview: event.target.checked,
                  }))
                }
              />
              <span>Email admin when a new review is submitted (coming soon)</span>
            </label>
          </div>
        </section>

        {saveError && (
          <div className="admin-alert admin-alert-error" role="alert">
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="admin-alert admin-alert-success" role="status">
            {saveSuccess}
          </div>
        )}

        <button type="submit" className="admin-action-btn admin-action-btn-approve" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
