import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { Input } from '../index';

describe('Input Component', () => {
  test('renders the editor with placeholder text', () => {
    render(<Input placeholder="Type here..." />);

    const editor = screen.getByText('Type here...');
    expect(editor).toBeInTheDocument();
  });

  test('updates content when typing', () => {
    const handleContentChange = vi.fn();
    render(
      <Input handleContentChange={handleContentChange} />
    );

    const editor = screen.getByText('Start typing here...');
    fireEvent.focus(editor);
    fireEvent.input(editor, {
      target: { innerHTML: 'Hello, world!' },
    });

    expect(handleContentChange).toHaveBeenCalledWith(
      'Hello, world!'
    );
  });
});
