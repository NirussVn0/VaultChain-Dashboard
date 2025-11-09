/**
 * A single password requirement definition.
 */
export interface PasswordRequirement {
  id: string;
  label: string;
  test(value: string): boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 12 characters",
    test: (value) => value.length >= 12,
  },
  {
    id: "upper",
    label: "Contains an uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lower",
    label: "Contains a lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "digit",
    label: "Contains a number",
    test: (value) => /\d/.test(value),
  },
  {
    id: "symbol",
    label: "Contains a symbol",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

/**
 * Computes a normalized score between 0 and 1 for UI feedback components.
 */
export function getPasswordScore(value: string): number {
  if (!value) {
    return 0;
  }

  const satisfied = PASSWORD_REQUIREMENTS.filter((rule) => rule.test(value)).length;
  return satisfied / PASSWORD_REQUIREMENTS.length;
}
