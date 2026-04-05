import { FieldErrors } from 'react-hook-form';

type FormErrorsProps = {

  errors: FieldErrors<any>;
}

export function FormErrors({ errors }: FormErrorsProps) {
  const errorMessages = Object.values(errors).filter(error => error?.message);

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4" role="alert">
      <div className="space-y-1">
        {errorMessages.map((error, index) =>
          error?.message ? (
            <p key={index} className="text-sm text-red-600">
              {error.message as string}
            </p>
          ) : null,
        )}
      </div>
    </div>
  );
}
