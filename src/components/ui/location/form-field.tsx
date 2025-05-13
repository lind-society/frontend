export const FormField = ({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div className="flex items-center">
    <span className="block whitespace-nowrap min-w-60">
      {label} {required && "*"}
    </span>
    {children}
  </div>
);
