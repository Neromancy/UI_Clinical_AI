import React, { useState } from 'react';
import {
  Role,
  Subject,
  QuestionSet,
  Submission,
  AuditLogItem,
  ValidationAction,
  StructuredDiff,
  KnowledgeChunk,
  MisconceptionCatalogItem,
} from './types';
import {
  INITIAL_SUBJECTS,
  INITIAL_TIERS,
  INITIAL_QUESTION_SETS,
  INITIAL_SUBMISSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MISCONCEPTIONS,
} from './data/mockData';

// Common Components
import { SubjectSwitcher } from './components/common/SubjectSwitcher';
import { AuditTrailDrawer } from './components/common/AuditTrailDrawer';

// Spec Viewer
import { SpecViewer } from './components/spec/SpecViewer';

// QA Validation Suite View
import { QAValidationSuiteView } from './components/views/qa/QAValidationSuiteView';

// Student Views
import { StudentDashboardView } from './components/views/student/StudentDashboardView';
import { StudentAnswerView } from './components/views/student/StudentAnswerView';
import { StudentFeedbackView } from './components/views/student/StudentFeedbackView';

// Lecturer Views
import { LecturerValidationQueueView } from './components/views/lecturer/LecturerValidationQueueView';
import { LecturerQuestionEditorView } from './components/views/lecturer/LecturerQuestionEditorView';
import { LecturerMisconceptionsView } from './components/views/lecturer/LecturerMisconceptionsView';
import { LecturerProfilesView } from './components/views/lecturer/LecturerProfilesView';
import { LecturerKnowledgeBaseView } from './components/views/lecturer/LecturerKnowledgeBaseView';
import { LecturerExportView } from './components/views/lecturer/LecturerExportView';
import { LecturerDashboardView } from './components/views/lecturer/LecturerDashboardView';

// Navigation
import {
  SidebarNavigation,
  LecturerNavScreen,
  AdminNavScreen,
  StudentNavScreen,
} from './components/navigation/SidebarNavigation';

// Admin Views
import { AdminSubjectsView } from './components/views/admin/AdminSubjectsView';
import { AdminTiersView } from './components/views/admin/AdminTiersView';
import { AdminAuditView } from './components/views/admin/AdminAuditView';
import { AdminAnomaliesView } from './components/views/admin/AdminAnomaliesView';
import { AdminSystemView } from './components/views/admin/AdminSystemView';

// Researcher Views
import { ResearcherCrossSubjectView } from './components/views/researcher/ResearcherCrossSubjectView';

// Icons
import { Menu } from 'lucide-react';

export default function App() {
  // Global Application Mode: Interactive Prototype vs QA Validation Suite vs Specification Document
  const [appMode, setAppMode] = useState<'specification' | 'prototype' | 'qa_suite'>('prototype');

  // Active Role and Subject Context
  const [currentRole, setCurrentRole] = useState<Role>('lecturer');
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [activeSubject, setActiveSubject] = useState<Subject>(INITIAL_SUBJECTS[0]);

  // Mobile navigation drawer toggle
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  // Sidebar collapsed toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active Screen Routing inside Prototype
  const [activeStudentScreen, setActiveStudentScreen] = useState<StudentNavScreen>('dashboard');
  const [activeLecturerScreen, setActiveLecturerScreen] = useState<LecturerNavScreen>('validation');
  const [activeAdminScreen, setActiveAdminScreen] = useState<AdminNavScreen>('system');

  // Entities State
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(INITIAL_QUESTION_SETS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [misconceptions, setMisconceptions] = useState<MisconceptionCatalogItem[]>(INITIAL_MISCONCEPTIONS);

  // Extract initial knowledge chunks and deduplicate by chunk id
  const knowledgeChunks: KnowledgeChunk[] = Array.from(
    new Map(
      INITIAL_SUBMISSIONS.flatMap((s) => s.analysis?.retrievedChunks || []).map((c) => [c.id, c])
    ).values()
  );

  // Active Selection Context
  const [activeQuestionSetId, setActiveQuestionSetId] = useState<string>(INITIAL_QUESTION_SETS[0].id);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(INITIAL_QUESTION_SETS[0].questions[0].id);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | undefined>(undefined);

  // Drawers
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // Filter question sets and submissions by active subject (Cross-Cutting Rule #2: Subject Isolation)
  const subjectQuestionSets = questionSets.filter((s) => s.subjectId === activeSubject.id);
  const subjectSubmissions = submissions.filter((s) => s.subjectId === activeSubject.id);

  const selectedQuestionSet =
    questionSets.find((s) => s.id === activeQuestionSetId) || subjectQuestionSets[0] || questionSets[0];
  const selectedQuestion =
    selectedQuestionSet.questions.find((q) => q.id === activeQuestionId) || selectedQuestionSet.questions[0];
  const selectedSubmission =
    submissions.find((s) => s.id === activeSubmissionId) || subjectSubmissions[0] || submissions[0];

  // Helper to append audit logs
  const logAuditEvent = (
    action: string,
    entityType: string,
    entityId: string,
    details: string,
    diffSummary?: string
  ) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'student' ? 'Elena Rostova (Student)' : 'Dr. Sarah Lin (Faculty)',
      actorRole: currentRole,
      action,
      entityType,
      entityId,
      subjectId: activeSubject.id,
      details,
      diffSummary,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Student: Submit Conceptual Essay Answer (P3 Flow + Simulated Worker Analysis P4)
  const handleStudentSubmitAnswer = async (answerText: string) => {
    const newSubId = `sub-${Date.now()}`;
    const newAttemptNo =
      submissions.filter(
        (s) => s.studentId === 'stud-101' && s.questionId === selectedQuestion.id
      ).length + 1;

    // 1. Insert SUBMITTED state
    const initialSub: Submission = {
      id: newSubId,
      studentId: 'stud-101',
      studentName: 'Elena Rostova',
      studentEmail: 'elena.rostova@med.uni.edu',
      questionId: selectedQuestion.id,
      questionTitle: selectedQuestion.title,
      questionSetId: selectedQuestionSet.id,
      questionSetName: selectedQuestionSet.title,
      versionId: selectedQuestion.activeVersionId,
      subjectId: activeSubject.id,
      attemptNo: newAttemptNo,
      answer: answerText,
      status: 'ANALYZING',
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [initialSub, ...prev]);
    logAuditEvent(
      'SUBMIT_ESSAY_ANSWER',
      'Submission',
      newSubId,
      `Submitted attempt #${newAttemptNo} for "${selectedQuestion.title}" (${answerText.length} chars)`,
      'Status: SUBMITTED → ANALYZING'
    );

    // 2. Simulate Celery background worker + LLM analysis (1.2s delay)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // LLM analysis outcome
    const analysisPayload = {
      id: `ana-${Date.now()}`,
      submissionId: newSubId,
      percentageScore: 82,
      confidence: 0.91,
      tierId: 'tier-2',
      tierName: 'Tier 2: Minor Concept Gaps',
      explanation:
        'The candidate demonstrates sound clinical reasoning on diastolic stiffness and backward venous congestion. However, their discussion omits the specific steepness of the diastolic pressure-volume curve and its sensitivity to aggressive diuretic reduction.',
      detectedMisconceptions: [
        {
          id: 'misc-auto-01',
          label: 'Conflating Ejection Fraction with Diastolic Reserve',
          isNewCandidate: false,
          evidenceQuote: 'preserves stroke volume through normal systolic contractions',
          clinicalCorrection: 'Clarify that preserved EF does not protect against acute volume shifts.',
        },
      ],
      conceptScores: [
        {
          indicatorId: 'ci-hf-01',
          label: 'Elevated LVEDP & backward pressure transmission',
          score: 0.35,
          weight: 0.35,
          remarks: 'Identified elevated filling pressures effectively.',
        },
        {
          indicatorId: 'ci-hf-02',
          label: 'Altered diastolic compliance mechanics',
          score: 0.28,
          weight: 0.35,
          remarks: 'Good mechanical reasoning.',
        },
        {
          indicatorId: 'ci-hf-03',
          label: 'Preload sensitivity & diuretic hazard',
          score: 0.19,
          weight: 0.3,
          remarks: 'Preload sensitivity was mentioned but lacked hemodynamics depth.',
        },
      ],
      retrievedChunks: knowledgeChunks.slice(0, 2),
      suggestedMaterials: [
        'Braunwald Cardiology Ch. 48: Pathophysiology of Heart Failure with Preserved Ejection Fraction',
        'ACC/AHA Guidelines on Hemodynamic Management of Diastolic Dysfunction',
      ],
      rawJson: '{"score": 82, "tier": "tier-2", "confidence": 0.91}',
      modelUsed: 'gemini-2.5-pro-clinical-rag',
      processingTimeMs: 1250,
      createdAt: new Date().toISOString(),
    };

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === newSubId
          ? {
              ...sub,
              status: 'PENDING_VALIDATION',
              analysis: analysisPayload,
            }
          : sub
      )
    );

    logAuditEvent(
      'RECORD_LLM_ANALYSIS',
      'LLMAnalysis',
      analysisPayload.id,
      `RAG analysis completed: score 82%, Tier 2, confidence 0.91. Transitioned to PENDING_VALIDATION.`,
      'Score: 82 | Tier 2'
    );

    setActiveSubmissionId(newSubId);
  };

  // Lecturer: Validate AI Analysis (P5 Flow)
  const handleLecturerValidate = (
    submissionId: string,
    action: ValidationAction,
    data: {
      score?: number;
      tierId?: string;
      tierName?: string;
      explanation?: string;
      notes?: string;
      diff?: StructuredDiff;
    }
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;

        if (action === 'REJECTED') {
          return {
            ...sub,
            status: 'REJECTED',
            validation: {
              id: `val-${Date.now()}`,
              analysisId: sub.analysis?.id || 'ana-none',
              submissionId,
              lecturerId: 'prof-sarah',
              lecturerName: 'Dr. Sarah Lin',
              status: 'REJECTED',
              validatedAt: new Date().toISOString(),
              notes: data.notes || 'Lecturer rejected diagnostic analysis; re-analysis scheduled.',
            },
          };
        }

        return {
          ...sub,
          status: 'VALIDATED',
          validation: {
            id: `val-${Date.now()}`,
            analysisId: sub.analysis?.id || 'ana-none',
            submissionId,
            lecturerId: 'prof-sarah',
            lecturerName: 'Dr. Sarah Lin',
            status: action,
            finalScore: data.score ?? sub.analysis?.percentageScore,
            finalTierId: data.tierId ?? sub.analysis?.tierId,
            finalTierName: data.tierName ?? sub.analysis?.tierName,
            finalExplanation: data.explanation ?? sub.analysis?.explanation,
            notes: data.notes || 'Faculty validated analysis.',
            structuredDiff: data.diff,
            finalMaterials: sub.analysis?.suggestedMaterials,
            validatedAt: new Date().toISOString(),
          },
        };
      })
    );

    logAuditEvent(
      `VALIDATE_ANALYSIS_${action}`,
      'Submission / Validation',
      submissionId,
      `Faculty validated submission ${submissionId}: action=${action}. Score: ${data.score || 'original'}. Notes: ${data.notes || 'none'}`,
      data.diff ? JSON.stringify(data.diff) : 'Validation without edits'
    );
  };

  // Lecturer: Publish Question Version (Enforcing Σ(weight)=1.0000)
  const handlePublishVersion = (versionId: string) => {
    setQuestionSets((prev) =>
      prev.map((set) => ({
        ...set,
        questions: set.questions.map((q) => ({
          ...q,
          versions: q.versions.map((v) =>
            v.id === versionId ? { ...v, isPublished: true, publishedAt: new Date().toISOString() } : v
          ),
        })),
      }))
    );

    logAuditEvent(
      'PUBLISH_QUESTION_VERSION',
      'QuestionVersion',
      versionId,
      `Published question version ${versionId}. Verified sum(weight) === 1.0000. Version locked.`,
      'Weight validation passed (1.0000)'
    );
  };

  // Lecturer: Create New Version Draft
  const handleCreateNewVersion = (questionId: string) => {
    setQuestionSets((prev) =>
      prev.map((set) => ({
        ...set,
        questions: set.questions.map((q) => {
          if (q.id !== questionId) return q;
          const newVerNum = q.versions.length + 1;
          const newVer = {
            ...q.versions[0],
            id: `qv-${questionId}-v${newVerNum}`,
            versionNumber: newVerNum,
            isPublished: false,
            publishedAt: undefined,
          };
          return {
            ...q,
            versions: [...q.versions, newVer],
            activeVersionId: newVer.id,
          };
        }),
      }))
    );
  };

  // Lecturer: Promote Misconception Candidate (P8 Flow)
  const handlePromoteCandidate = (id: string, label: string, remediationNote: string) => {
    setMisconceptions((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              label,
              remediationNote,
              status: 'PROMOTED',
              promotedBy: 'Dr. Sarah Lin',
              promotedAt: new Date().toISOString(),
            }
          : m
      )
    );

    logAuditEvent(
      'PROMOTE_MISCONCEPTION_CANDIDATE',
      'MisconceptionCatalogItem',
      id,
      `Promoted LLM candidate misconception "${label}" to official catalog. Embedded into vector store.`,
      'Status: LLM_CANDIDATE → PROMOTED'
    );
  };

  // Admin: Add Subject
  const handleAddSubject = (newSubjectData: Partial<Subject>) => {
    const fullSubject: Subject = {
      id: newSubjectData.id || `subj-${Date.now()}`,
      name: newSubjectData.name || 'New Subject',
      code: newSubjectData.code || 'SUBJ101',
      slug: newSubjectData.slug || 'subj101',
      description: newSubjectData.description || '',
      lecturerCount: 2,
      studentCount: 0,
      activeSetsCount: 0,
      accentColor: 'indigo',
      icon: 'BookOpen',
    };
    setSubjects((prev) => [...prev, fullSubject]);
    logAuditEvent(
      'CREATE_SUBJECT',
      'Subject',
      fullSubject.id,
      `Created subject ${fullSubject.name} (${fullSubject.code}) with isolated scope.`,
      'Subject tenant provisioned'
    );
  };

  // Switch role and update view defaults
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    if (role === 'student') setActiveStudentScreen('dashboard');
    if (role === 'lecturer') setActiveLecturerScreen('validation');
    if (role === 'admin') setActiveAdminScreen('system');
    if (role === 'researcher') setActiveLecturerScreen('cross_subject');
  };

  // Breadcrumb title for active screen in prototype mode
  const getScreenTitle = () => {
    if (currentRole === 'lecturer' || currentRole === 'researcher') {
      switch (activeLecturerScreen) {
        case 'dashboard':
          return 'Overview';
        case 'validation':
          return selectedSubmission ? 'Submission Review' : 'Awaiting Review';
        case 'editor':
          return 'Question Sets';
        case 'kb':
          return 'Learning Materials';
        case 'misconceptions':
          return 'Misconceptions';
        case 'profiles':
          return 'Student Progress';
        case 'cross_subject':
          return 'Subject Comparison';
        case 'exports':
          return 'Export Data';
        default:
          return 'Overview';
      }
    }
    if (currentRole === 'student') {
      switch (activeStudentScreen) {
        case 'dashboard':
          return 'Overview';
        case 'answer':
          return 'Case Studies';
        case 'feedback':
          return 'Feedback';
        default:
          return 'Overview';
      }
    }
    if (currentRole === 'admin') {
      switch (activeAdminScreen) {
        case 'system':
          return 'System Overview';
        case 'subjects':
          return 'Subjects & Access';
        case 'tiers':
          return 'Performance Levels';
        case 'audit':
          return 'Activity Log';
        case 'anomalies':
          return 'Flagged Submissions';
        default:
          return 'System Overview';
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 overflow-x-hidden">
      {/* Sidebar Navigation - Persists across all prototype views */}
      {appMode === 'prototype' && (
        <SidebarNavigation
          currentRole={currentRole}
          onSelectRole={handleRoleChange}
          activeSubject={activeSubject}
          pendingValidationCount={
            subjectSubmissions.filter((s) => s.status === 'PENDING_VALIDATION').length
          }
          activeLecturerScreen={activeLecturerScreen}
          onSelectLecturerScreen={(screen) => {
            setActiveLecturerScreen(screen);
            if (screen === 'validation') setActiveSubmissionId(undefined);
          }}
          activeStudentScreen={activeStudentScreen}
          onSelectStudentScreen={setActiveStudentScreen}
          activeAdminScreen={activeAdminScreen}
          onSelectAdminScreen={setActiveAdminScreen}
          onOpenAuditDrawer={() => setIsAuditDrawerOpen(true)}
          onOpenSubjectSettings={() => {
            setCurrentRole('admin');
            setActiveAdminScreen('subjects');
          }}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      )}

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Clean Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
          {/* Left: Mobile Toggle + Subject Context & Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            {appMode === 'prototype' && (
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden shrink-0"
                title="Open Navigation Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {/* Subject Switcher */}
            <SubjectSwitcher
              subjects={subjects}
              activeSubject={activeSubject}
              onSelectSubject={setActiveSubject}
            />

            {/* Breadcrumb Screen Context */}
            {appMode === 'prototype' && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 min-w-0">
                <span>/</span>
                <span className="font-medium text-slate-700 truncate">
                  {getScreenTitle()}
                </span>
              </div>
            )}
          </div>

          {/* Right: Clean Mode Switcher & Compact Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mode Switcher */}
            <nav className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setAppMode('prototype')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  appMode === 'prototype'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                Prototype
              </button>

              <button
                type="button"
                onClick={() => setAppMode('qa_suite')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  appMode === 'qa_suite'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                QA Suite
              </button>

              <button
                type="button"
                onClick={() => setAppMode('specification')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  appMode === 'specification'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                Specification
              </button>
            </nav>

            {/* Compact Role Switcher */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className="py-1 pl-2 pr-6 text-xs font-semibold rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                title="Switch Active Role"
                aria-label="Switch Active Role"
              >
                <option value="lecturer">Lecturer</option>
                <option value="student">Student</option>
                <option value="researcher">Researcher</option>
                <option value="admin">Admin</option>
              </select>

              <div
                className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                title={
                  currentRole === 'student'
                    ? 'Elena Rostova (Student)'
                    : currentRole === 'admin'
                    ? 'SysAdmin Root (Administrator)'
                    : currentRole === 'researcher'
                    ? 'Dr. Marcus Reed (Researcher)'
                    : 'Dr. Evelyn Vance (Lecturer)'
                }
              >
                {currentRole === 'student'
                  ? 'ER'
                  : currentRole === 'admin'
                  ? 'AD'
                  : currentRole === 'researcher'
                  ? 'MR'
                  : 'EV'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-4 sm:p-6 overflow-y-auto">
        {/* MODE C: QA VALIDATION SUITE & TEST ENGINE */}
        {appMode === 'qa_suite' && <QAValidationSuiteView />}

        {/* MODE A: FULL SPECIFICATION DOCUMENT READER */}
        {appMode === 'specification' && (
          <SpecViewer
            onLaunchPrototype={(role) => {
              setCurrentRole(role as Role);
              setAppMode('prototype');
              if (role === 'student') setActiveStudentScreen('answer');
              if (role === 'lecturer') setActiveLecturerScreen('validation');
            }}
          />
        )}

        {/* MODE B: LIVE INTERACTIVE PROTOTYPE */}
        {appMode === 'prototype' && (
          <>
            {/* STUDENT PORTAL */}
            {currentRole === 'student' && (
              <>
                {activeStudentScreen === 'dashboard' && (
                  <StudentDashboardView
                    questionSets={subjectQuestionSets}
                    submissions={subjectSubmissions}
                    onEnterCode={(code) => {
                      const matched = questionSets.find(
                        (s) => s.code.toUpperCase() === code.toUpperCase()
                      );
                      if (matched) {
                        setActiveQuestionSetId(matched.id);
                        setActiveQuestionId(matched.questions[0].id);
                        setActiveStudentScreen('answer');
                      }
                    }}
                    onOpenQuestion={(setId, qId) => {
                      setActiveQuestionSetId(setId);
                      setActiveQuestionId(qId);
                      setActiveStudentScreen('answer');
                    }}
                    onViewFeedback={(subId) => {
                      setActiveSubmissionId(subId);
                      setActiveStudentScreen('feedback');
                    }}
                  />
                )}

                {activeStudentScreen === 'answer' && (
                  <StudentAnswerView
                    questionSet={selectedQuestionSet}
                    question={selectedQuestion}
                    existingSubmission={submissions.find(
                      (s) =>
                        s.studentId === 'stud-101' && s.questionId === selectedQuestion.id
                    )}
                    onSubmitAnswer={handleStudentSubmitAnswer}
                    onBackToDashboard={() => setActiveStudentScreen('dashboard')}
                    onViewFeedback={(subId) => {
                      setActiveSubmissionId(subId);
                      setActiveStudentScreen('feedback');
                    }}
                  />
                )}

                {activeStudentScreen === 'feedback' && (
                  <StudentFeedbackView
                    submission={selectedSubmission}
                    onBack={() => setActiveStudentScreen('dashboard')}
                  />
                )}
              </>
            )}

            {/* LECTURER & RESEARCHER PORTAL */}
            {(currentRole === 'lecturer' || currentRole === 'researcher') && (
              <>
                {activeLecturerScreen === 'dashboard' && (
                  <LecturerDashboardView
                    subject={activeSubject}
                    submissions={subjectSubmissions}
                    tiers={INITIAL_TIERS}
                    onNavigateToQueue={(id) => {
                      setActiveLecturerScreen('validation');
                      setActiveSubmissionId(id);
                    }}
                    onNavigateToMisconceptions={() => setActiveLecturerScreen('misconceptions')}
                    onNavigateToKB={() => setActiveLecturerScreen('kb')}
                  />
                )}

                {activeLecturerScreen === 'validation' && (
                  <LecturerValidationQueueView
                    submissions={subjectSubmissions}
                    tiers={INITIAL_TIERS}
                    activeSubmissionId={activeSubmissionId}
                    onSelectSubmission={setActiveSubmissionId}
                    onValidate={handleLecturerValidate}
                  />
                )}

                {activeLecturerScreen === 'editor' && (
                  <LecturerQuestionEditorView
                    questionSet={selectedQuestionSet}
                    question={selectedQuestion}
                    onBack={() => setActiveLecturerScreen('validation')}
                    onPublishVersion={handlePublishVersion}
                    onCreateNewVersion={handleCreateNewVersion}
                  />
                )}

                {activeLecturerScreen === 'misconceptions' && (
                  <LecturerMisconceptionsView
                    misconceptions={misconceptions}
                    onPromoteCandidate={handlePromoteCandidate}
                  />
                )}

                {activeLecturerScreen === 'kb' && (
                  <LecturerKnowledgeBaseView
                    subject={activeSubject}
                    chunks={knowledgeChunks}
                    onUploadDocument={() => {}}
                  />
                )}

                {activeLecturerScreen === 'profiles' && (
                  <LecturerProfilesView
                    subject={activeSubject}
                    submissions={subjectSubmissions}
                    tiers={INITIAL_TIERS}
                    misconceptions={misconceptions}
                    userRole={currentRole as any}
                  />
                )}

                {activeLecturerScreen === 'cross_subject' && (
                  <ResearcherCrossSubjectView
                    subjects={subjects}
                    allSubmissions={submissions}
                  />
                )}

                {activeLecturerScreen === 'exports' && (
                  <LecturerExportView
                    subject={activeSubject}
                    submissions={subjectSubmissions}
                  />
                )}
              </>
            )}

            {/* ADMIN PORTAL */}
            {currentRole === 'admin' && (
              <>
                {activeAdminScreen === 'system' && (
                  <AdminSystemView />
                )}

                {activeAdminScreen === 'subjects' && (
                  <AdminSubjectsView
                    subjects={subjects}
                    onAddSubject={handleAddSubject}
                  />
                )}

                {activeAdminScreen === 'tiers' && (
                  <AdminTiersView tiers={INITIAL_TIERS} />
                )}

                {activeAdminScreen === 'audit' && (
                  <AdminAuditView logs={auditLogs} />
                )}

                {activeAdminScreen === 'anomalies' && (
                  <AdminAnomaliesView />
                )}
              </>
            )}
          </>
        )}
      </main>
      </div>

      {/* Slide-Over Forensic Audit Trail Drawer */}
      <AuditTrailDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
}
