import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

vi.mock('@/features/profile/services/profileBasicCache', () => ({
  readProfileBasic: vi.fn(async () => null),
  updateProfileBasic: vi.fn(async () => null),
  readTableColumnVisibilityPreference: vi.fn(async () => null),
  saveTableColumnVisibilityPreference: vi.fn(async () => undefined),
}));
