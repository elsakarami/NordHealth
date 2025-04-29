import { describe, it, expect } from "vitest";
import {
  PasswordValidator,
  validatePassword,
} from "@/composables/usePasswordValidator";

describe("Password Validation", () => {
  it("should validate a strong password", () => {
    const result = validatePassword("Zahra94@Pass");
    expect(result).toEqual({
      minLength: true,
      containsUppercase: true,
      containsLowercase: true,
      containsNumber: true,
      containsSpecialChar: true,
    });
  });

  it("should return all false for empty string", () => {
    const result = validatePassword("");
    expect(Object.values(result).every((val) => val === false)).toBe(true);
  });

  // weak password test
  it("should detect weak password rules", () => {
    const result = validatePassword("123");
    expect(result).toMatchObject({
      minLength: false,
      containsUppercase: false,
      containsLowercase: false,
      containsNumber: true,
      containsSpecialChar: false,
    });
  });

  // missing special character test
  it("should fail when special character is missing", () => {
    expect(validatePassword("Zahra1234").containsSpecialChar).toBe(false);
  });

  it("should detect missing uppercase", () => {
    expect(validatePassword("zahra@123").containsUppercase).toBe(false);
  });

  it("should detect missing lowercase", () => {
    expect(validatePassword("ZAHRA@123").containsLowercase).toBe(false);
  });

  it("should detect missing number", () => {
    expect(validatePassword("Zahra@Pass").containsNumber).toBe(false);
  });
});

describe("PasswordValidator class", () => {
  const getValidator = (pass: string) => new PasswordValidator(pass);

  describe("strength()", () => {
    it("should return 100 for perfect password", () => {
      const validator = getValidator("Strong@123A");
      expect(validator.strength).toBe(100);
    });

    it("should calculate partial score correctly", () => {
      const validator = getValidator("Zahra123");
      expect(validator.strength).toBe(80);
    });

    it("should not exceed 100", () => {
      const validator = getValidator("PerfectPass@123456!!");
      expect(validator.strength).toBeLessThanOrEqual(100);
    });

    it("should return 0 for empty password", () => {
      expect(getValidator("").strength).toBe(0);
    });
  });

  describe("statusColor()", () => {
    it("should return success color for strong password", () => {
      expect(getValidator("Zahra94@Pass").statusColor).toBe(
        "var(--n-color-status-success)"
      );
    });

    it("should return warning color for medium password", () => {
      expect(getValidator("Zahra12").statusColor).toBe(
        "var(--n-color-status-warning)"
      );
    });

    it("should return danger color for weak password", () => {
      expect(getValidator("abc").statusColor).toBe(
        "var(--n-color-status-danger)"
      );
    });
  });
});
