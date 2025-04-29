import type { PasswordErr } from '@/types/index'

export class PasswordValidator {
  private readonly password: string

  constructor(password: string) {
    this.password = password
  }

  get strength(): number {
    return Math.min(
      this.rules.reduce((score, rule) => score + (rule.passed ? rule.score : 0), 0),
      100
    )
  }

  get statusColor(): string {
    const s = this.strength
    if (s >= 80) return 'var(--n-color-status-success)'
    if (s >= 50) return 'var(--n-color-status-warning)'
    return 'var(--n-color-status-danger)'
  }

  private get rules(): { passed: boolean; score: number }[] {
    return [
      { passed: this.hasMinLength, score: 25 },
      { passed: this.hasUppercase, score: 20 },
      { passed: this.hasLowercase, score: 15 },
      { passed: this.hasNumber, score: 20 },
      { passed: this.hasSpecialChar, score: 20 },
    ]
  }

  get hasMinLength(): boolean {
    return this.password.length >= 8
  }
  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password)
  }
  get hasLowercase(): boolean {
    return /[a-z]/.test(this.password)
  }
  get hasNumber(): boolean {
    return /\d/.test(this.password)
  }
  get hasSpecialChar(): boolean {
    return /[^A-Za-z0-9]/.test(this.password)
  }
}

export function validatePassword(password: string): PasswordErr {
  const validator = new PasswordValidator(password)

  return {
    minLength: validator.hasMinLength,
    containsUppercase: validator.hasUppercase,
    containsLowercase: validator.hasLowercase,
    containsNumber: validator.hasNumber,
    containsSpecialChar: validator.hasSpecialChar,
  }
}
