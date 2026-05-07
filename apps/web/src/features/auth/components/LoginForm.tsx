import Link from 'next/link';
import { useState } from 'react';
import { useHydrationReady } from '../hooks/useHydrationReady';
import { useLoginForm } from '../hooks/useLoginForm';
import PasswordVisibilityToggle from './PasswordVisibilityToggle';
import { useI18n } from '@/i18n/I18nProvider';
import type { TranslationKey } from '@/i18n/translations';

export default function LoginForm() {
  const { register, onFormSubmit, errors, isSubmitting, serverError } = useLoginForm();
  const isHydrationReady = useHydrationReady();
  const isFormDisabled = isSubmitting || !isHydrationReady;
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useI18n();
  const resolveFieldError = (value: unknown) =>
    typeof value === 'string' ? t(value as TranslationKey) : null;

  return (
    <form method='post' onSubmit={onFormSubmit} className='form' noValidate>
      <fieldset className='fieldset' disabled={isFormDisabled}>
        <label className='label' htmlFor='email'>
          {t('auth.forms.common.emailLabel')}
        </label>
        <input
          id='email'
          type='email'
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          placeholder={t('auth.forms.common.emailPlaceholder')}
          disabled={isFormDisabled}
          {...register('email')}
        />
        {errors.email && (
          <div className='text-error text-sm mt-1'>{resolveFieldError(errors.email.message)}</div>
        )}

        <label className='label' htmlFor='password'>
          {t('auth.forms.common.passwordLabel')}
        </label>
        <div className='join w-full'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            className={`input input-bordered join-item w-full ${errors.password ? 'input-error' : ''}`}
            placeholder={t('auth.forms.common.passwordPlaceholder')}
            disabled={isFormDisabled}
            {...register('password')}
          />
          <PasswordVisibilityToggle
            show={showPassword}
            disabled={isFormDisabled}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </div>
        {errors.password && (
          <div className='text-error text-sm mt-1'>{resolveFieldError(errors.password.message)}</div>
        )}

        <label htmlFor='remember' className='label'>
          <input
            id='remember'
            type='checkbox'
            className='checkbox mt-4 mr-1'
            disabled={isFormDisabled}
            {...register('remember')}
          />
          <span className='pt-4'>{t('auth.forms.login.rememberDevice')}</span>
        </label>

        {serverError && (
          <div className='alert alert-error mt-2 text-sm' role='alert'>
            {serverError}
          </div>
        )}

        <button type='submit' className='btn btn-primary mt-4 mb-4' disabled={isFormDisabled}>
          {isSubmitting ? t('auth.forms.login.submitPending') : t('auth.forms.login.submitIdle')}
        </button>

        <p className='text-center'>
          {t('auth.forms.login.noAccount')}{' '}
          <Link href='/auth/register' className='link link-hover'>
            {t('auth.forms.login.createOne')}
          </Link>
        </p>
        <p className='text-center'>
          <span className='opacity-70'>{t('auth.forms.common.passwordResetSoon')}</span>
        </p>
      </fieldset>
    </form>
  );
}
