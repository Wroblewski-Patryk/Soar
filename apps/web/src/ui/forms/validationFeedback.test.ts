import { describe, expect, it, vi } from 'vitest';

import { focusFirstInvalidField, toValidationSummaryErrors } from './validationFeedback';

describe('validationFeedback', () => {
  it('collects summary errors from populated field map', () => {
    const errors = toValidationSummaryErrors({
      name: 'Name is required',
      exchange: undefined,
      apiKey: 'API key is required',
    });

    expect(errors).toEqual(['Name is required', 'API key is required']);
  });

  it('focuses and scrolls first invalid field in order', () => {
    document.body.innerHTML = `
      <input id="field-name" />
      <input id="field-api-key" />
    `;

    const nameInput = document.getElementById('field-name') as HTMLInputElement;
    const focusSpy = vi.spyOn(nameInput, 'focus');
    const scrollSpy = vi.fn();
    Object.defineProperty(nameInput, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollSpy,
    });

    focusFirstInvalidField(
      {
        name: 'Name is required',
        apiKey: 'API key is required',
      },
      {
        name: 'field-name',
        apiKey: 'field-api-key',
      }
    );

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });
});
