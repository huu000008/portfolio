export const FormErrorMessage = ({ error }: { error?: string }) =>
  error ? <p className="error">{error}</p> : null;
