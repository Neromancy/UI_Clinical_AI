import React from 'react';
import { Role } from '../../types';
import { Shield, ShieldAlert, UserCheck } from 'lucide-react';

interface RoleGuardProps {
  currentRole: Role;
  allowedRoles: Role[];
  children: React.ReactNode;
  fallbackAction?: () => void;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  currentRole,
  allowedRoles,
  children,
  fallbackAction,
}) => {
  const isAuthorized = allowedRoles.includes(currentRole);

  if (!isAuthorized) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center max-w-lg mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-rose-900 mb-1">
          Access Restricted by Role Governance
        </h3>
        <p className="text-xs text-rose-700 mb-4 leading-relaxed">
          This view requires role: <strong>{allowedRoles.join(' or ')}</strong>. You are currently operating as{' '}
          <strong className="capitalize">{currentRole}</strong>. Mutating actions strictly check{' '}
          <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[11px]">user_subject_roles</code>.
        </p>

        {fallbackAction && (
          <button
            type="button"
            onClick={fallbackAction}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-rose-300 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors"
          >
            Return to Authorized Dashboard
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
