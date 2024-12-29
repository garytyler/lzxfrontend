import {Link} from '@remix-run/react';
import {forwardRef} from 'react';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: 'primary' | 'secondary' | 'inline';
      width?: 'auto' | 'full';
      [key: string]: any;
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    const variants = {
      primary: `btn btn-primary`,
      secondary: `btn btn-secondary`,
      inline: 'btn btn-link',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    return (
      <Component
        className={className + ' ' + variants[variant] + ' ' + widths[width]}
        {...props}
        ref={ref}
      />
    );
  },
);
