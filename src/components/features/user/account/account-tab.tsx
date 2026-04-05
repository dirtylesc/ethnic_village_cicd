'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslations } from 'next-intl';

import { useUpdatePassword, useUpdatePersonalInfo } from '@/hooks/api/useUser';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccountTabContent() {
  const t = useTranslations('personal.account');
  const { user } = useAuthStore();
  const updatePersonalMutation = useUpdatePersonalInfo();
  const updatePasswordMutation = useUpdatePassword();
  const { toast } = useToast();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    firstName: user?.personal?.firstName || '',
    lastName: user?.personal?.lastName || '',
    phoneNumber: user?.personal?.phoneNumber || '',
    dateOfBirth: user?.personal?.dateOfBirth || '',
    address: user?.personal?.address || '',
    avatar: user?.personal?.avatar || '',
  });

  useEffect(() => {
    if (user?.personal) {
      setPersonalForm({
        firstName: user.personal.firstName || '',
        lastName: user.personal.lastName || '',
        phoneNumber: user.personal.phoneNumber || '',
        dateOfBirth: user.personal.dateOfBirth || '',
        address: user.personal.address || '',
        avatar: user.personal.avatar || '',
      });
    }
  }, [user?.personal]);

  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditPersonal = () => {
    setIsEditingPersonal(true);
    setPersonalErrors({});
  };

  const handleCancelPersonal = () => {
    setPersonalForm({
      firstName: user?.personal?.firstName || '',
      lastName: user?.personal?.lastName || '',
      phoneNumber: user?.personal?.phoneNumber || '',
      dateOfBirth: user?.personal?.dateOfBirth || '',
      address: user?.personal?.address || '',
      avatar: user?.personal?.avatar || '',
    });
    setIsEditingPersonal(false);
    setPersonalErrors({});
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalErrors({});

    try {
      await updatePersonalMutation.mutateAsync(personalForm);
      toast({
        title: t('personal_info.success'),
      });
      setIsEditingPersonal(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || t('personal_info.error');
      toast({
        title: t('personal_info.error'),
        description: errorMessage,
        variant: 'destructive',
      });

      if (error?.response?.data?.errors) {
        setPersonalErrors(error.response.data.errors);
      }
    }
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
    setPasswordErrors({});
  };

  const handleCancelPassword = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsEditingPassword(false);
    setPasswordErrors({});
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      const error = t('password.mismatch');
      setPasswordErrors({ confirmPassword: error });
      toast({
        title: error,
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      const error = t('password.requirements');
      setPasswordErrors({ newPassword: error });
      toast({
        title: error,
        variant: 'destructive',
      });
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync(passwordForm);
      toast({
        title: t('password.success'),
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsEditingPassword(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || t('password.error');
      toast({
        title: t('password.error'),
        description: errorMessage,
        variant: 'destructive',
      });

      if (error?.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
      } else if (errorMessage.includes('incorrect') || errorMessage.includes('không đúng')) {
        setPasswordErrors({ currentPassword: errorMessage });
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-dark-90">{t('title')}</h1>

      <Card className="w-full border-gray-20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-dark-90">{t('personal_info.title')}</CardTitle>
              <CardDescription className="text-dark-60">{t('personal_info.description')}</CardDescription>
            </div>
            {!isEditingPersonal && (
              <Button
                type="button"
                variant="outline"
                onClick={handleEditPersonal}
                className="hover:bg-primary-50 border-primary-500 text-primary-500"
              >
                {t('personal_info.edit')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-sm font-medium text-dark-80">
                {t('personal_info.avatar')}
              </Label>
              {!isEditingPersonal && personalForm.avatar ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-20">
                    <Image
                      src={personalForm.avatar}
                      alt="User avatar"
                      fill
                      className="object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default-avatar.png';
                      }}
                    />
                  </div>
                  <span className="text-sm text-dark-60">{personalForm.avatar}</span>
                </div>
              ) : isEditingPersonal ? (
                <div className="space-y-2">
                  <Input
                    id="avatar"
                    type="url"
                    value={personalForm.avatar}
                    onChange={e => setPersonalForm({ ...personalForm, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                    disabled={!isEditingPersonal}
                  />
                  {personalErrors.avatar && <p className="text-xs text-destructive">{personalErrors.avatar}</p>}
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-20 bg-gray-10">
                  <span className="text-2xl text-dark-40">👤</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-dark-80">
                  {t('personal_info.first_name')}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={personalForm.firstName}
                  onChange={e => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                  className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                  disabled={!isEditingPersonal}
                />
                {personalErrors.firstName && <p className="text-xs text-destructive">{personalErrors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-dark-80">
                  {t('personal_info.last_name')}
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={personalForm.lastName}
                  onChange={e => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                  className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                  disabled={!isEditingPersonal}
                />
                {personalErrors.lastName && <p className="text-xs text-destructive">{personalErrors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-dark-80">
                {t('personal_info.phone_number')}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={personalForm.phoneNumber}
                onChange={e => setPersonalForm({ ...personalForm, phoneNumber: e.target.value })}
                className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                disabled={!isEditingPersonal}
              />
              {personalErrors.phoneNumber && <p className="text-xs text-destructive">{personalErrors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-dark-80">
                {t('personal_info.date_of_birth')}
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={personalForm.dateOfBirth}
                onChange={e => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })}
                className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                disabled={!isEditingPersonal}
              />
              {personalErrors.dateOfBirth && <p className="text-xs text-destructive">{personalErrors.dateOfBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-dark-80">
                {t('personal_info.address')}
              </Label>
              <Input
                id="address"
                type="text"
                value={personalForm.address}
                onChange={e => setPersonalForm({ ...personalForm, address: e.target.value })}
                className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                disabled={!isEditingPersonal}
              />
              {personalErrors.address && <p className="text-xs text-destructive">{personalErrors.address}</p>}
            </div>

            {isEditingPersonal && (
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPersonal}
                  disabled={updatePersonalMutation.isPending}
                  className="border-gray-30 text-dark-80 hover:bg-gray-10"
                >
                  {t('personal_info.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={updatePersonalMutation.isPending}
                  className="bg-primary-500 text-white hover:bg-primary-600"
                >
                  {updatePersonalMutation.isPending ? t('personal_info.updating') : t('personal_info.save_changes')}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="w-full border-gray-20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-dark-90">{t('password.title')}</CardTitle>
              <CardDescription className="text-dark-60">{t('password.description')}</CardDescription>
            </div>
            {!isEditingPassword && (
              <Button
                type="button"
                variant="outline"
                onClick={handleEditPassword}
                className="hover:bg-primary-50 border-primary-500 text-primary-500"
              >
                {t('password.edit')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-dark-80">
                  {t('password.current_password')}
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-destructive">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-dark-80">
                  {t('password.new_password')}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={8}
                  className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                />
                <p className="text-xs text-dark-50">{t('password.requirements')}</p>
                {passwordErrors.newPassword && <p className="text-xs text-destructive">{passwordErrors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-dark-80">
                  {t('password.confirm_password')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={8}
                  className="border-gray-30 focus:border-primary-500 focus:ring-primary-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-destructive">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={updatePasswordMutation.isPending}
                  className="border-gray-30 text-dark-80 hover:bg-gray-10"
                >
                  {t('password.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="bg-primary-500 text-white hover:bg-primary-600"
                >
                  {updatePasswordMutation.isPending ? t('password.changing') : t('password.change_password')}
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-4">
              <p className="text-sm text-dark-60">{t('password.no_edit_message')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
