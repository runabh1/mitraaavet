import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11.64 3.42a2.53 2.53 0 0 0-3.28 0c-1.8 1.8-1.8 4.72 0 6.52l3.28 3.28 3.28-3.28c1.8-1.8 1.8-4.72 0-6.52a2.53 2.53 0 0 0-3.28 0Z" />
      <path d="M10.82 12.18c-2.07-.3-4.47.11-6.22 1.86-1.93 1.94-1.93 5.08 0 7.02 1.95 1.95 5.08 1.95 7.03 0" />
      <path d="m13.18 12.18c2.07-.3 4.47.11 6.22 1.86 1.93 1.94 1.93 5.08 0 7.02-1.95 1.95-5.08 1.95-7.03 0" />
      <path d="M15.54 9.9l3.28-3.28a2.53 2.53 0 0 0 0-3.54c-1.8-1.8-4.72-1.8-6.52 0" />
      <path d="m8.46 9.9-3.28-3.28a2.53 2.53 0 0 1 0-3.54c1.8-1.8 4.72-1.8 6.52 0" />
    </svg>
  );
}
