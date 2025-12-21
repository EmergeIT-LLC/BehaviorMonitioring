import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  it('renders button with placeholder text', () => {
    const handleClick = jest.fn();
    render(
      <Button 
        nameOfClass="testButton" 
        placeholder="Click Me" 
        btnType="button"
        onClick={handleClick}
      />
    );
    
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Button 
        nameOfClass="testButton" 
        placeholder="Click Me" 
        btnType="button"
        onClick={handleClick}
      />
    );
    
    await user.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays Loading... when isLoading is true', () => {
    const handleClick = jest.fn();
    render(
      <Button 
        nameOfClass="testButton" 
        placeholder="Click Me" 
        btnType="button"
        isLoading={true}
        onClick={handleClick}
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not call onClick when isLoading is true', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Button 
        nameOfClass="testButton" 
        placeholder="Click Me" 
        btnType="button"
        isLoading={true}
        onClick={handleClick}
      />
    );
    
    await user.click(screen.getByText('Loading...'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(
      <Button 
        nameOfClass="testButton" 
        placeholder="Click Me" 
        btnType="button"
        disabled={true}
        onClick={handleClick}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
