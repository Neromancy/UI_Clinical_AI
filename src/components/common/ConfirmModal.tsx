import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  requiresInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (val: string) => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'primary',
  requiresInput = false,
  inputLabel,
  inputPlaceholder,
  inputValue = '',
  onInputChange,
}) => {
  if (!isOpen) return null;

  const colorConfig = {
    danger: {
      btn: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: AlertCircle,
      iconColor: 'text-rose-600 bg-rose-50',
    },
    warning: {
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
      icon: AlertCircle,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    primary: {
      btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      icon: HelpCircle,
      iconColor: 'text-indigo-600 bg-indigo-50',
    },
    success: {
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
  }[variant];

  const Icon = colorConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${colorConfig.iconColor} shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{message}</p>

              {requiresInput && (
                <div className="mt-3">
                  {inputLabel && (
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {inputLabel}
                    </label>
                  )}
                  <textarea
                    rows={3}
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => onInputChange && onInputChange(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${colorConfig.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
