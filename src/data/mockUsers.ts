import { UserAccount } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-001',
    name: 'Aulia Ramadhani',
    email: 'aulia@mercury.id',
    password: 'password123',
    city: 'Jakarta',
    initials: 'AR',
    memberId: 'MRC-USR-2026-882',
    joinDate: '15 Agustus 2026',
    testsCount: 4,
    bio: 'Pencinta skincare dan pemerhati keamanan kosmetik.'
  },
  {
    id: 'usr-002',
    name: 'Zazkia Laili',
    email: 'zazkia@mercury.id',
    password: 'password123',
    city: 'Yogyakarta',
    initials: 'ZL',
    memberId: 'MRC-USR-2026-001',
    joinDate: '1 Juli 2026',
    testsCount: 12,
    bio: 'Penggagas inisiatif MERCURY skrining merkuri cepat berbasis kolorimetri.'
  },
  {
    id: 'usr-003',
    name: 'Rian Pratama',
    email: 'rian@mercury.id',
    password: 'password123',
    city: 'Bandung',
    initials: 'RP',
    memberId: 'MRC-USR-2026-512',
    joinDate: '10 September 2026',
    testsCount: 1,
    bio: 'Suka cek dulu komposisi produk sebelum checkout di e-commerce.'
  }
];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'MC';
}

export function generateMemberId(): string {
  const num = Math.floor(100 + Math.random() * 900);
  return `MRC-USR-2026-${num}`;
}
