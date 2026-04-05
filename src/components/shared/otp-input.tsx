'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  className?: string;
}

export function OtpInput({ value, onChange, numInputs = 6, className }: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    if (newValue.length > 1) return;

    const newOtp = value.split('');
    newOtp[index] = newValue;
    const newOtpString = newOtp.join('');

    onChange(newOtpString);

    if (newValue && index < numInputs - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, numInputs);
    onChange(pastedData);

    const nextIndex = Math.min(pastedData.length, numInputs - 1);
    setActiveInput(nextIndex);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-5">
      {Array.from({ length: numInputs }, (_, index) => (
        <input
          key={index}
          ref={el => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          className={cn(
            'h-[60px] w-[60px] rounded-[10px] border text-center text-2xl font-bold',
            {
              'border-primary': value[index] || index === activeInput,
              'border-gray-100': !value[index] && index !== activeInput,
            },
            className,
          )}
        />
      ))}
    </div>
  );
}
