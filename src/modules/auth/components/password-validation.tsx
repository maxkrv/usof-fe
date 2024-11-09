import { Text } from '@mantine/core';
import { FC } from 'react';

const requirements = {
  minLength: {
    validation: (value: string) => value.length >= 6,
    message: 'Password must be at least 6 characters long'
  },
  lowercaseLetter: {
    validation: (value: string) => /[a-z]/.test(value),
    message: 'Password must contain at least one lowercase letter'
  },
  uppercaseLetter: {
    validation: (value: string) => /[A-Z]/.test(value),
    message: 'Password must contain at least one uppercase letter'
  },
  oneNumber: {
    validation: (value: string) => /[0-9]/.test(value),
    message: 'Password must contain at least one number'
  },
  specialCharacter: {
    validation: (value: string) => /[!@#$%^&*()]/.test(value),
    message: 'Password must contain at least one special character'
  }
};

interface PasswordRequirementsProps {
  password: string;
  enableCheck: boolean;
}

export const PasswordRequirements: FC<PasswordRequirementsProps> = ({ password, enableCheck }) => {
  return (
    <div>
      {Object.values(requirements).map((requirement, index) => (
        <Text
          {...(password?.length && { color: requirement.validation(password) && enableCheck ? 'green' : 'red' })}
          key={index}>
          {requirement.message}
        </Text>
      ))}
    </div>
  );
};
