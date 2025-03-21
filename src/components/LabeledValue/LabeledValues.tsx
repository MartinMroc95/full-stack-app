interface LabeledValueProps {
  label: string
  value: string | number
}

export const LabeledValue: React.FC<LabeledValueProps> = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <p className="font-bold text-sm">{label}</p>
    <p className="text-sm">{value}</p>
  </div>
)
