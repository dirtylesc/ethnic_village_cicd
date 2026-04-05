'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/utils/classnames';
import { AlertCircle, Mail, Phone, User, UserCheck, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { validateContactInfo } from '@/libs/schemas/booking.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type { ContactInfo, GuestInfo } from '../booking-wizard-context';
import { BOOKING_STEPS, useBookingWizard } from '../booking-wizard-context';
import { WizardNavigation } from '../wizard-navigation';

export type GuestInfoStepProps = {
  onNext?: () => void;
  onBack?: () => void;
}

type FormFieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
}

function FormField({ id, label, icon, value, onChange, onBlur, error, type = 'text', placeholder, disabled, required = true, helperText }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
      />
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1 text-sm text-red-500" role="alert">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function copyContactToGuest(contactInfo: ContactInfo | null): GuestInfo | null {
  if (!contactInfo) return null;
  return {
    name: contactInfo.name,
    email: contactInfo.email,
    phone: contactInfo.phone,
  };
}

export function validateGuestInfo(data: { name: string; email: string; phone: string }): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  return validateContactInfo(data);
}

export function GuestInfoStep({ onNext, onBack }: GuestInfoStepProps) {
  const t = useTranslations('booking.wizard.guest_info');
  const { state, actions } = useBookingWizard();
  const { bookingData, isLoading } = state;

  const [bookingType, setBookingType] = useState<'self' | 'others'>(bookingData.bookingType || 'self');
  const [formData, setFormData] = useState<GuestInfo>({
    name: bookingData.guestInfo?.name || '',
    email: bookingData.guestInfo?.email || '',
    phone: bookingData.guestInfo?.phone || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (bookingType === 'self' && bookingData.contactInfo) {
      const copiedInfo = copyContactToGuest(bookingData.contactInfo);
      if (copiedInfo) {
        setFormData(copiedInfo);
        setFieldErrors({});
        setTouched({});
      }
    }
  }, [bookingType, bookingData.contactInfo]);

  const validation = useMemo(() => validateGuestInfo(formData), [formData]);

  const handleBookingTypeChange = useCallback(
    (value: 'self' | 'others') => {
      setBookingType(value);
      if (value === 'self' && bookingData.contactInfo) {
        const copiedInfo = copyContactToGuest(bookingData.contactInfo);
        if (copiedInfo) {
          setFormData(copiedInfo);
          setFieldErrors({});
          setTouched({});
        }
      } else if (value === 'others') {
        if (bookingData.guestInfo && bookingData.bookingType === 'others') {
          setFormData(bookingData.guestInfo);
        } else {
          setFormData({ name: '', email: '', phone: '' });
        }
        setFieldErrors({});
        setTouched({});
      }
    },
    [bookingData.contactInfo, bookingData.guestInfo, bookingData.bookingType],
  );

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const { errors } = validateGuestInfo({ ...formData, [field]: value });
      setFieldErrors(prev => ({ ...prev, [field]: errors[field] || '' }));
    } else {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formData, touched]);

  const handleFieldBlur = useCallback(
    (field: string) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const { errors } = validateGuestInfo(formData);
      if (errors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: errors[field] }));
      }
    },
    [formData],
  );

  const handleBack = useCallback(() => {
    actions.updateBookingData({
      bookingType,
      guestInfo: formData.name || formData.email || formData.phone ? formData : null,
    });
    if (onBack) {
      onBack();
    } else {
      actions.prevStep();
    }
  }, [actions, bookingType, formData, onBack]);

  const handleContinue = useCallback(() => {
    const { isValid, errors } = validateGuestInfo(formData);

    if (!isValid) {
      setFieldErrors(errors);
      setTouched({ name: true, email: true, phone: true });
      return;
    }

    actions.updateBookingData({
      bookingType,
      guestInfo: formData,
    });
    actions.markStepCompleted(BOOKING_STEPS.GUEST_INFO);

    if (onNext) {
      onNext();
    } else {
      actions.nextStep();
    }
  }, [formData, bookingType, actions, onNext]);

  const getTranslatedError = (errorKey: string) => {
    return t(
      `errors.${errorKey}` as
        | 'errors.name_required'
        | 'errors.email_required'
        | 'errors.email_invalid'
        | 'errors.phone_required'
        | 'errors.phone_invalid',
    );
  };

  const isFormDisabled = bookingType === 'self' || isLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">{t('booking_type_label')}</Label>
            <RadioGroup
              value={bookingType}
              onValueChange={value => handleBookingTypeChange(value as 'self' | 'others')}
              className="space-y-3"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                <RadioGroupItem value="self" id="booking-type-self" />
                <Label htmlFor="booking-type-self" className="flex cursor-pointer items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('self_option')}</p>
                    <p className="text-sm text-gray-500">{t('self_description')}</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
                <RadioGroupItem value="others" id="booking-type-others" />
                <Label htmlFor="booking-type-others" className="flex cursor-pointer items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('others_option')}</p>
                    <p className="text-sm text-gray-500">{t('others_description')}</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className={cn('space-y-6', bookingType === 'self' && 'opacity-60')}>
            <div className="flex items-center gap-2 border-b pb-2">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium">{t('guest_details_title')}</h3>
              {bookingType === 'self' && <span className="ml-auto text-sm text-gray-500">{t('auto_filled')}</span>}
            </div>

            <FormField
              id="guest-name"
              label={t('name')}
              icon={<User className="h-4 w-4 text-gray-500" />}
              value={formData.name}
              onChange={value => handleFieldChange('name', value)}
              onBlur={() => handleFieldBlur('name')}
              error={touched.name && fieldErrors.name ? getTranslatedError(fieldErrors.name) : undefined}
              placeholder={t('name_placeholder')}
              disabled={isFormDisabled}
              required
            />

            <FormField
              id="guest-email"
              label={t('email')}
              icon={<Mail className="h-4 w-4 text-gray-500" />}
              value={formData.email}
              onChange={value => handleFieldChange('email', value)}
              onBlur={() => handleFieldBlur('email')}
              error={touched.email && fieldErrors.email ? getTranslatedError(fieldErrors.email) : undefined}
              type="email"
              placeholder={t('email_placeholder')}
              disabled={isFormDisabled}
              required
              helperText={t('email_helper') || 'Ví dụ: example@email.com'}
            />

            <FormField
              id="guest-phone"
              label={t('phone')}
              icon={<Phone className="h-4 w-4 text-gray-500" />}
              value={formData.phone}
              onChange={value => handleFieldChange('phone', value)}
              onBlur={() => handleFieldBlur('phone')}
              error={touched.phone && fieldErrors.phone ? getTranslatedError(fieldErrors.phone) : undefined}
              type="tel"
              placeholder={t('phone_placeholder')}
              disabled={isFormDisabled}
              required
              helperText={t('phone_helper') || 'Ví dụ: 0901234567 hoặc +84901234567'}
            />
          </div>
        </CardContent>
      </Card>

      <WizardNavigation
        showBack={true}
        onBack={handleBack}
        onContinue={handleContinue}
        isContinueDisabled={!validation.isValid}
        isLoading={isLoading}
      />
    </div>
  );
}
