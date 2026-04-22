export type FormValidationSummaryProps = {
  title?: string;
  errors: string[];
  className?: string;
};

import { useOptionalI18n } from '@/i18n/useOptionalI18n';

export function FormValidationSummary({
  title,
  errors,
  className,
}: FormValidationSummaryProps) {
  const { t } = useOptionalI18n();
  if (errors.length === 0) return null;
  const resolvedTitle = title ?? t('public.sharedUi.validationSummaryTitle');

  const rootClassName = ['alert alert-error', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} role='alert' data-testid='form-validation-summary'>
      <div className='space-y-1'>
        <p className='font-semibold'>{resolvedTitle}</p>
        <ul className='list-disc pl-5 text-sm'>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
