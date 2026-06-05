import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { readProfileBasic } from '@/features/profile/services/profileBasicCache';

describe('vitest setup support surface', () => {
  it('loads jest-dom matchers and global support mocks for Web tests', async () => {
    render(<p>Setup support loaded</p>);

    expect(screen.getByText('Setup support loaded')).toBeInTheDocument();
    expect(usePathname()).toBe('/');
    expect(vi.isMockFunction(readProfileBasic)).toBe(true);
    await expect(readProfileBasic()).resolves.toBeNull();
  });
});
