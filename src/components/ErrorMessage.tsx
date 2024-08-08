import { ReactNode } from 'react';

type ErrorMessageProps = {
  children: ReactNode,
}

export default function ErrorMessage({children}: ErrorMessageProps) {
  return (
    <div className="text-red-500">{children}</div>
  )
}
