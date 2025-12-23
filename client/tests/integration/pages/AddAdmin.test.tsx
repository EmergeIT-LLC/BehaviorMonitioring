import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddAdmin from '../../../src/app/Admin/manageAdmins/add/page';
import { api } from '../../../src/lib/Api';

jest.mock('../../../src/lib/Api');
jest.mock('../../../src/function/VerificationCheck', () => ({
  GetLoggedInUserStatus: () => true,
  GetAdminStatus: () => true,
  GetLoggedInUser: () => 'testuser',
}));

const mockApi = api as jest.MockedFunction<typeof api>;
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

describe('AddAdmin Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields before submission', async () => {
    render(<AddAdmin />);
    const user = userEvent.setup();

    const submitButton = screen.getByText('Create Admin');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<AddAdmin />);
    const user = userEvent.setup();

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email Address');

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(usernameInput, 'johndoe');
    await user.type(emailInput, 'invalid-email');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123');

    const submitButton = screen.getByText('Create Admin');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('validates password matching', async () => {
    render(<AddAdmin />);
    const user = userEvent.setup();

    // Fill all required fields except matching passwords
    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Username'), 'johndoe');
    await user.type(screen.getByPlaceholderText('Email Address'), 'john@example.com');
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password456');

    const submitButton = screen.getByText('Create Admin');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('successfully creates admin with valid data', async () => {
    mockApi.mockResolvedValueOnce({
      statusCode: 200,
      adminID: 1,
      serverMessage: 'Admin created successfully',
    } as any);

    render(<AddAdmin />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('First Name'), 'John');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(screen.getByPlaceholderText('Username'), 'johndoe');
    await user.type(screen.getByPlaceholderText('Email Address'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123');

    const submitButton = screen.getByText('Create Admin');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith('post', '/admin/createAdmin', expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
      }));
    });
  });
});
