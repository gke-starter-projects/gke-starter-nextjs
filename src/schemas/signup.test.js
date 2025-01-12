import validationSchema from './signup';

describe('Validation Schema', () => {
  describe('username validation', () => {
    it('should accept valid usernames', async () => {
      const validUsernames = [
        'john123',
        'john-doe',
        'john_doe',
        'user123',
        'test-user_123',
      ];

      validUsernames.forEach(async (username) => {
        await expect(
          validationSchema.validateAt('username', { username }),
        ).resolves.toBe(username);
      });
    });

    it('should reject usernames that are too short', async () => {
      await expect(
        validationSchema.validateAt('username', { username: 'ab' }),
      ).rejects.toThrow('Username must be at least 3 characters');
    });

    it('should reject usernames that are too long', async () => {
      await expect(
        validationSchema.validateAt('username', {
          username: 'thisusernameiswaytoolong123',
        }),
      ).rejects.toThrow('Username must be at most 20 characters');
    });

    it('should reject usernames with special characters', async () => {
      const invalidUsernames = ['user@name', 'user.name', 'user#name', 'user$name'];
      invalidUsernames.forEach(async (username) => {
        await expect(
          validationSchema.validateAt('username', { username }),
        ).rejects.toThrow('Username can only contain letters, numbers, dashes and underscores');
      });
    });

    it('should reject empty username', async () => {
      await expect(
        validationSchema.validateAt('username', { username: '' }),
      ).rejects.toThrow('Username must be at least 3 characters');
    });
  });

  describe('email validation', () => {
    it('should accept valid email addresses', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+test@domain.co.uk',
        'user123@domain.io',
      ];
      validEmails.forEach(async (email) => {
        await expect(
          validationSchema.validateAt('email', { email }),
        ).resolves.toBe(email);
      });
    });

    it('should reject invalid email addresses', async () => {
      const invalidEmails = [
        'notanemail',
        // 'missing@domain',
        '@nodomain.com',
        'spaces in@domain.com',
        'missing.domain@.com',
      ];

      invalidEmails.forEach(async (email) => {
        await expect(
          validationSchema.validateAt('email', { email }),
        ).rejects.toThrow('Invalid email address');
      });
    });

    it('should reject empty email', async () => {
      await expect(
        validationSchema.validateAt('email', { email: '' }),
      ).rejects.toThrow('Email is required');
    });
  });

  describe('password validation', () => {
    it('should accept valid passwords', async () => {
      const validPasswords = [
        'StrongP@ss1',
        'C0mplex!Pass',
        'V3ryStr0ng!Pass',
        'P@ssw0rdSecure',
      ];

      validPasswords.forEach(async (password) => {
        await expect(
          validationSchema.validateAt('password', { password }),
        ).resolves.toBe(password);
      });
    });

    it('should reject passwords that are too short', async () => {
      await expect(
        validationSchema.validateAt('password', { password: 'Short1!' }),
      ).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should reject passwords without numbers', async () => {
      await expect(
        validationSchema.validateAt('password', { password: 'Password!' }),
      ).rejects.toThrow('Password must contain at least one number');
    });

    it('should reject passwords without lowercase letters', async () => {
      await expect(
        validationSchema.validateAt('password', { password: 'PASSWORD1!' }),
      ).rejects.toThrow('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without uppercase letters', async () => {
      await expect(
        validationSchema.validateAt('password', { password: 'password1!' }),
      ).rejects.toThrow('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without symbols', async () => {
      await expect(
        validationSchema.validateAt('password', { password: 'Password123' }),
      ).rejects.toThrow('Password must contain at least one symbol');
    });

    // it('should reject empty password', async () => {
    //   await expect(
    //     validationSchema.validateAt('password', { password: '' }),
    //   ).rejects.toThrow('Password is required');
    // });
  });

  describe('confirmPassword validation', () => {
    it('should accept matching passwords', async () => {
      const testPassword = 'StrongP@ss1';
      await expect(
        validationSchema.validateAt('confirmPassword', {
          password: testPassword,
          confirmPassword: testPassword,
        }),
      ).resolves.toBe(testPassword);
    });

    it('should reject non-matching passwords', async () => {
      await expect(
        validationSchema.validateAt('confirmPassword', {
          password: 'StrongP@ss1',
          confirmPassword: 'DifferentP@ss1',
        }),
      ).rejects.toThrow('Passwords must match');
    });

    // it('should reject empty confirmPassword', async () => {
    //   await expect(
    //     validationSchema.validateAt('confirmPassword', {
    //       password: 'StrongP@ss1',
    //       confirmPassword: '',
    //     }),
    //   ).rejects.toThrow('Please confirm your password');
    // });
  });

  describe('full schema validation', () => {
    it('should validate a completely valid form', async () => {
      const validForm = {
        username: 'john_doe123',
        email: 'john@example.com',
        password: 'StrongP@ss1',
        confirmPassword: 'StrongP@ss1',
      };

      await expect(
        validationSchema.validate(validForm),
      ).resolves.toEqual(validForm);
    });

    it('should collect all validation errors', async () => {
      const invalidForm = {
        username: 'a',
        email: 'notanemail',
        password: 'weak',
        confirmPassword: 'different',
      };

      try {
        await validationSchema.validate(invalidForm, { abortEarly: false });
        fail('Validation should have failed');
      } catch (err) {
        expect(err.errors).toEqual(expect.arrayContaining([
          expect.stringContaining('Username must be at least 3 characters'),
          expect.stringContaining('Invalid email address'),
          expect.stringContaining('Password must be at least 8 characters'),
          expect.stringContaining('Passwords must match'),
        ]));
      }
    });
  });
});
