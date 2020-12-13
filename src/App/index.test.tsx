import React from 'react';
import { render } from '@testing-library/react';
import App from '.';
import { GLOBAL_CONFIG } from '../common/config';

test('renders learn react link', () => {
  const { getByText } = render(<App globalConfig={GLOBAL_CONFIG} />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
