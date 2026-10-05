import * as React from "react";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useFormState<T extends Record<string, any>>(
  initialState: T
) {
  const [values, setValues] = React.useState<T>(initialState);
  const [errors, setErrors] = React.useState<ValidationErrors<T>>({});
  const [touched, setTouched] = React.useState<Set<keyof T>>(new Set());

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const setTouchedField = (field: keyof T) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setTouched(new Set());
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    setValue,
    setTouchedField,
    setErrors,
    reset,
    isValid,
  };
}
