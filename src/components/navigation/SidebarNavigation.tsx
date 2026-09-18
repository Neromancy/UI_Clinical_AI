import React, { useState } from 'react';
import { Role, Subject } from '../../types';
import {
  LayoutDashboard,
  FileCheck2,
  BookOpen,
  Library,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  Sliders,
  ShieldCheck,
  Activity,
  Layers,
  FileText,
  Server,
  BarChart3,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Settings,
} from 'lucide-react';

export type LecturerNavScreen =
  | 'dashboard'
  | 'validation'
  | 'editor'
  | 'kb'
  | 'misconceptions'
  | 'profiles'
  | 'cross_subject'
  | 'exports';

export type AdminNavScreen =
  | 'system'
  | 'subjects'
  | 'tiers'
  | 'audit'
  | 'anomalies';

export type StudentNavScreen = 'dashboard' | 'answer' | 'feedback';

interface SidebarNavigationProps {
  currentRole: Role;
  onSelectRole?: (role: Role) => void;
  activeSubject: Subject;
  pendingValidationCount: number;
  // Lecturer screen
  activeLecturerScreen: LecturerNavScreen;
  onSelectLecturerScreen: (screen: LecturerNavScreen) => void;
  // Student screen
  activeStudentScreen: StudentNavScreen;
  onSelectStudentScreen: (screen: StudentNavScreen) => void;
  // Admin screen
  activeAdminScreen: AdminNavScreen;
  onSelectAdminScreen: (screen: AdminNavScreen) => void;
  // System actions
  onOpenAuditDrawer: () => void;
  onOpenSubjectSettings?: () => void;
  // Mobile drawer control
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  // Collapsible control
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
  badge?: string | number;
  badgeVariant?: 'danger' | 'info' | 'neutral';
}

interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentRole,
  activeSubject,
  pendingValidationCount,
  activeLecturerScreen,
  onSelectLecturerScreen,
  activeStudentScreen,
  onSelectStudentScreen,
  activeAdminScreen,
  onSelectAdminScreen,
  onOpenAuditDrawer,
  onOpenSubjectSettings,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
}) => {
  // Local collapse state if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed =
    controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  // Build role-specific navigation sections dynamically
  const getNavSections = (): NavSectionConfig[] => {
    if (currentRole === 'lecturer') {
      return [
        {
          title: 'Teaching & Review',
          items: [
            {
              id: 'dashboard',
              label: 'Overview',
              icon: LayoutDashboard,
              isActive: activeLecturerScreen === 'dashboard',
              onClick: () => {
                onSelectLecturerScreen('dashboard');
                onCloseMobile?.();
              },
            },
            {
              id: 'validation',
              label: 'Awaiting Review',
              icon: FileCheck2,
              isActive: activeLecturerScreen === 'validation',
              badge: pendingValidationCount > 0 ? pendingValidationCount : undefined,
              badgeVariant: 'danger',
              onClick: () => {
                onSelectLecturerScreen('validation');
                onCloseMobile?.();
              },
            },
            {
              id: 'editor',
              label: 'Question Sets',
              icon: BookOpen,
              isActive: activeLecturerScreen === 'editor',
              onClick: () => {
                onSelectLecturerScreen('editor');
                onCloseMobile?.();
              },
            },
            {
              id: 'kb',
              label: 'Learning Materials',
              icon: Library,
              isActive: activeLecturerScreen === 'kb',
              onClick: () => {
                onSelectLecturerScreen('kb');
                onCloseMobile?.();
              },
            },
            {
              id: 'misconceptions',
              label: 'Misconceptions',
              icon: AlertTriangle,
              isActive: activeLecturerScreen === 'misconceptions',
              badge: '3 new',
              badgeVariant: 'info',
              onClick: () => {
                onSelectLecturerScreen('misconceptions');
                onCloseMobile?.();
              },
            },
            {
              id: 'profiles',
              label: 'Student Progress',
              icon: Users,
              isActive: activeLecturerScreen === 'profiles',
              onClick: () => {
                onSelectLecturerScreen('profiles');
                onCloseMobile?.();
              },
            },
            {
              id: 'cross_subject',
              label: 'Subject Comparison',
              icon: BarChart3,
              isActive: activeLecturerScreen === 'cross_subject',
              onClick: () => {
                onSelectLecturerScreen('cross_subject');
                onCloseMobile?.();
              },
            },
            {
              id: 'exports',
              label: 'Export Data',
              icon: FileSpreadsheet,
              isActive: activeLecturerScreen === 'exports',
              onClick: () => {
                onSelectLecturerScreen('exports');
                onCloseMobile?.();
              },
            },
          ],
        },
        {
          title: 'Management',
          items: [
            {
              id: 'subject_settings',
              label: 'Subject Settings',
              icon: Sliders,
              isActive: false,
              onClick: () => {
                if (onOpenSubjectSettings) {
                  onOpenSubjectSettings();
                } else {
                  onSelectAdminScreen('subjects');
                }
                onCloseMobile?.();
              },
            },
            {
              id: 'audit_log',
              label: 'Activity Log',
              icon: ShieldCheck,
              isActive: false,
              onClick: () => {
                onOpenAuditDrawer();
                onCloseMobile?.();
              },
            },
          ],
        },
      ];
    }

    if (currentRole === 'student') {
      return [
        {
          title: 'Learning',
          items: [
            {
              id: 'dashboard',
              label: 'Overview',
              icon: LayoutDashboard,
              isActive: activeStudentScreen === 'dashboard',
              onClick: () => {
                onSelectStudentScreen('dashboard');
                onCloseMobile?.();
              },
            },
            {
              id: 'answer',
              label: 'Case Studies',
              icon: FileText,
              isActive: activeStudentScreen === 'answer',
              onClick: () => {
                onSelectStudentScreen('answer');
                onCloseMobile?.();
              },
            },
            {
              id: 'feedback',
              label: 'Feedback',
              icon: CheckCircle2,
              isActive: activeStudentScreen === 'feedback',
              onClick: () => {
                onSelectStudentScreen('feedback');
                onCloseMobile?.();
              },
            },
          ],
        },
      ];
    }

    if (currentRole === 'admin') {
      return [
        {
          title: 'Administration',
          items: [
            {
              id: 'system',
              label: 'System Overview',
              icon: Server,
              isActive: activeAdminScreen === 'system',
              onClick: () => {
                onSelectAdminScreen('system');
                onCloseMobile?.();
              },
            },
            {
              id: 'subjects',
              label: 'Subjects & Access',
              icon: Sliders,
              isActive: activeAdminScreen === 'subjects',
              onClick: () => {
                onSelectAdminScreen('subjects');
                onCloseMobile?.();
              },
            },
            {
              id: 'tiers',
              label: 'Performance Levels',
              icon: Layers,
              isActive: activeAdminScreen === 'tiers',
              onClick: () => {
                onSelectAdminScreen('tiers');
                onCloseMobile?.();
              },
            },
            {
              id: 'audit',
              label: 'Activity Log',
              icon: ShieldCheck,
              isActive: activeAdminScreen === 'audit',
              onClick: () => {
                onSelectAdminScreen('audit');
                onCloseMobile?.();
              },
            },
            {
              id: 'anomalies',
              label: 'Flagged Submissions',
              icon: AlertTriangle,
              isActive: activeAdminScreen === 'anomalies',
              onClick: () => {
                onSelectAdminScreen('anomalies');
                onCloseMobile?.();
              },
            },
          ],
        },
      ];
    }

    // Researcher Role
    return [
      {
        title: 'Research & Analysis',
        items: [
          {
            id: 'profiles',
            label: 'Student Progress',
            icon: Users,
            isActive: activeLecturerScreen === 'profiles',
            onClick: () => {
              onSelectLecturerScreen('profiles');
              onCloseMobile?.();
            },
          },
          {
            id: 'cross_subject',
            label: 'Subject Comparison',
            icon: BarChart3,
            isActive: activeLecturerScreen === 'cross_subject',
            onClick: () => {
              onSelectLecturerScreen('cross_subject');
              onCloseMobile?.();
            },
          },
          {
            id: 'exports',
            label: 'Export Data',
            icon: FileSpreadsheet,
            isActive: activeLecturerScreen === 'exports',
            onClick: () => {
              onSelectLecturerScreen('exports');
              onCloseMobile?.();
            },
          },
          {
            id: 'audit_log',
            label: 'Activity Log',
            icon: ShieldCheck,
            isActive: false,
            onClick: () => {
              onOpenAuditDrawer();
              onCloseMobile?.();
            },
          },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 ease-in-out shrink-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0 !w-64' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header & Brand */}
        <div className="flex flex-col flex-1 min-h-0">
          <div
            className={`h-16 border-b border-slate-200 px-3 flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            {/* Logo & App Title */}
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="w-9 h-9 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center shrink-0 shadow-xs"
                title="Clinical Learning Engine"
              >
                <Activity className="w-5 h-5 text-teal-400" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                    Clinical Review
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 truncate">
                    Faculty Assessment
                  </span>
                </div>
              )}
            </div>

            {/* Collapse/Expand Toggle (Desktop) */}
            <div className="hidden lg:flex items-center">
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Close Button (Mobile only) */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 py-3 px-2 space-y-5 overflow-y-auto">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {/* Section Title (only if expanded) */}
                {!isCollapsed && (
                  <div className="px-2.5 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </div>
                )}

                {/* Section Items */}
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onClick}
                        title={item.label}
                        className={`w-full flex items-center rounded-lg text-xs font-medium transition-colors relative group ${
                          isCollapsed
                            ? 'h-10 justify-center px-0'
                            : 'h-9 px-2.5 justify-between'
                        } ${
                          item.isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2.5 min-w-0 ${
                            isCollapsed ? 'justify-center' : ''
                          }`}
                        >
                          <div className="relative shrink-0">
                            <IconComponent
                              className={`w-4 h-4 ${
                                item.isActive
                                  ? 'text-white'
                                  : 'text-slate-500 group-hover:text-slate-700'
                              }`}
                            />
                            {/* Dot badge when collapsed */}
                            {isCollapsed && item.badge && (
                              <span
                                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                                  item.badgeVariant === 'danger'
                                    ? 'bg-rose-500 ring-2 ring-white'
                                    : 'bg-indigo-500 ring-2 ring-white'
                                }`}
                              />
                            )}
                          </div>

                          {!isCollapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>

                        {/* Full badge when expanded */}
                        {!isCollapsed && item.badge && (
                          <span
                            className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                              item.badgeVariant === 'danger'
                                ? item.isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                : item.badgeVariant === 'info'
                                ? item.isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status Box */}
        <div className="p-2 border-t border-slate-200 bg-slate-50/50 shrink-0">
          {isCollapsed ? (
            <div
              className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-default"
              title="System Status: Operational"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-medium text-slate-700 truncate">
                  System Operational
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                Online
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
