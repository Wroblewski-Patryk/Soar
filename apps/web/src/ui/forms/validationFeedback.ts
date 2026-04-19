export type ValidationFieldErrors<TField extends string> = Partial<Record<TField, string | undefined>>;

export const toValidationSummaryErrors = <TField extends string>(fieldErrors: ValidationFieldErrors<TField>) =>
  Object.values(fieldErrors).filter((value): value is string => Boolean(value));

export const focusFirstInvalidField = <TField extends string>(
  fieldErrors: ValidationFieldErrors<TField>,
  fieldIdByKey: Record<TField, string>
) => {
  const firstKey = (Object.keys(fieldErrors) as TField[])[0];
  if (!firstKey) return;
  const targetId = fieldIdByKey[firstKey];
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;

  if (typeof target.focus === 'function') {
    target.focus();
  }
  if (typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
