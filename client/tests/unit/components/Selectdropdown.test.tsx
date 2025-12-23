import React from 'react';
import { render, screen } from '@testing-library/react';
import Selectdropdown from '../../../src/components/Selectdropdown';
import userEvent from '@testing-library/user-event';

describe('Selectdropdown Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders all options', () => {
    const handleChange = jest.fn();
    render(
      <Selectdropdown
        name="testSelect"
        requiring={false}
        value=""
        options={mockOptions}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Selectdropdown
        name="testSelect"
        requiring={false}
        value="option1"
        options={mockOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option2');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays selected value correctly', () => {
    const handleChange = jest.fn();
    render(
      <Selectdropdown
        name="testSelect"
        requiring={false}
        value="option2"
        options={mockOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('has required attribute when requiring is true', () => {
    const handleChange = jest.fn();
    render(
      <Selectdropdown
        name="testSelect"
        requiring={true}
        value=""
        options={mockOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
  });
});
