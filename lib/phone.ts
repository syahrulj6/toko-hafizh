export function normalizeIndonesianPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '+62';
  }

  if (digits.startsWith('62')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `+62${digits.slice(1)}`;
  }

  return `+62${digits}`;
}

export function normalizeIndonesianPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('62')) {
    return digits;
  }

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }

  return `62${digits}`;
}
