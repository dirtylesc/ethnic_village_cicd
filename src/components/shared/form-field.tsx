import { ReactNode } from 'react';
import { cn } from '@/utils/classnames';
import { useTranslations } from 'next-intl';

import { Checkbox } from '@/components/ui/checkbox';

import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { Textarea } from '@/components/ui/textarea';

export type InputType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'datepicker'
  | 'switch'
  | 'radio'
  | 'slider'
  | 'number'
  | 'password'
  | 'email'
  | 'tel'
  | 'url'
  | 'search'
  | 'time'
  | 'color';

export type Option = {
  value: string;
  label: string;
}

export type SharedFormFieldProps = {
  type: InputType;
  name: string;
  label: ReactNode;
  defaultChildren?: ReactNode;
  defaultValue?: any;
  placeholder?: string;
  options?: Option[];
  translationNamespace?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  readOnly?: boolean;
}

export default function SharedFormField({
  type,
  name,
  label,
  defaultChildren,
  defaultValue,
  placeholder,
  options = [],
  translationNamespace,
  className = '',
  disabled = false,
  required = false,
  min,
  max,
  step,
  pattern,
  autoComplete,
  readOnly = false,
}: SharedFormFieldProps) {
  const t = translationNamespace
    ? useTranslations(translationNamespace as Parameters<typeof useTranslations>[0])
    : undefined;

  const getTranslatedText = (key: string) => {
    if (!translationNamespace || !t) return key;
    try {
      return t(key as any);
    } catch {
      return key;
    }
  };

  const renderField = ({ field }: any) => {
    const commonProps = {
      ...field,
      disabled,
      className: cn('w-full', className),
      'aria-required': required,
      'aria-disabled': disabled,
      'aria-readonly': readOnly,
    };

    switch (type) {
      case 'textarea':
        return <Textarea {...commonProps} placeholder={getTranslatedText(placeholder || '')} readOnly={readOnly} />;

      case 'select':
        return (
          <Select {...commonProps} onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={getTranslatedText(placeholder || '')} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {getTranslatedText(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return <Checkbox {...commonProps} checked={field.value} onCheckedChange={field.onChange} />;

      case 'radio':
        return (
          <RadioGroup {...commonProps} onValueChange={field.onChange} defaultValue={field.value}>
            {options.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                <FormLabel htmlFor={`${name}-${option.value}`}>{getTranslatedText(option.label)}</FormLabel>
              </div>
            ))}
          </RadioGroup>
        );

      case 'slider':
        return (
          <Slider
            {...commonProps}
            defaultValue={[field.value]}
            min={min}
            max={max}
            step={step}
            onValueChange={value => field.onChange(value[0])}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            min={min}
            max={max}
            step={step}
            placeholder={getTranslatedText(placeholder || '')}
            readOnly={readOnly}
          />
        );

      case 'password':
      case 'email':
      case 'tel':
      case 'url':
      case 'search':
      case 'time':
      case 'color':
        return (
          <Input
            {...commonProps}
            type={type}
            pattern={pattern}
            autoComplete={autoComplete}
            placeholder={getTranslatedText(placeholder || '')}
            readOnly={readOnly}
          />
        );

      default:
        return (
          <Input {...commonProps} type="text" placeholder={getTranslatedText(placeholder || '')} readOnly={readOnly} />
        );
    }
  };

  return (
    <FormField
      name={name}
      render={props => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="text-lg font-semibold text-gray-500">
            {typeof label === 'string' ? getTranslatedText(label) : label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>
          {defaultChildren || renderField(props)}
        </FormItem>
      )}
    />
  );
}
