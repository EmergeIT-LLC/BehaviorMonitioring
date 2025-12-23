import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputFields from '../../../src/components/Inputfield';

describe('InputFields Component', () => {
  it('renders input with placeholder', () => {
    const handleChange = jest.fn();
    render(
      <InputFields
        name="testInput"
        type="text"
        placeholder="Enter text"
        requiring={false}
        value=""
        onChange={handleChange}
      />
    );
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <InputFields
        name="testInput"
        type="text"
        placeholder="Enter text"
        requiring={false}
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    await user.type(input, 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('has required attribute when requiring is true', () => {
    const handleChange = jest.fn();
    render(
      <InputFields
        name="testInput"
        type="text"
        placeholder="Enter text"
        requiring={true}
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeRequired();
  });

  it('displays the provided value', () => {
    const handleChange = jest.fn();
    render(
      <InputFields
        name="testInput"
        type="text"
        placeholder="Enter text"
        requiring={false}
        value="test value"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('renders email input type correctly', () => {
    const handleChange = jest.fn();
    render(
      <InputFields
        name="email"
        type="email"
        placeholder="Enter email"
        requiring={false}
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
  });
});
