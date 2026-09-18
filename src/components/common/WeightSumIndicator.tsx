import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface WeightSumIndicatorProps {
  weights: number[];
  targetSum?: number; // default 1.0000
  tolerance?: number; // default 0.0001
  className?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const WeightSumIndicator: React.FC<WeightSumIndicatorProps> = ({
  weights,
  targetSum = 1.0,
  tolerance = 0.0001,
  className = '',
  onValidationChange,
}) => {
  const sum = weights.reduce((acc, val) => acc + (Number(val) || 0), 0);
  const diff = sum - targetSum;
  const isValid = Math.abs(diff) < tolerance;

  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const formattedSum = sum.toFixed(4);
  const formattedDiff = Math.abs(diff).toFixed(4);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
        isValid
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      {isValid ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
      )}
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span>Σ(Weight):</span>
        <span className="font-mono font-bold tracking-tight">{formattedSum}</span>
        <span className="text-xs opacity-75">/ 1.0000</span>
      </div>

      {!isValid && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-normal">
          {diff > 0 ? `-${formattedDiff} excess` : `+${formattedDiff} needed`}
        </span>
      )}
    </div>
  );
};
