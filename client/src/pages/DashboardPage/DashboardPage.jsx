import React, { useEffect, useMemo, useState } from 'react';
import { LoaderCircle, LogOut, Menu, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import EditorPanel from '@/components/dashboard/EditorPanel';
import { useCmsDashboard } from '@/hooks/useCmsDashboard';
import { clearAuthSession } from '@/lib/auth';
import { axiosClient } from '@/lib/api/axiosClient';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    sections,
    activeSectionId,
    fetchStatus,
    saveStatusById,
    publishStatusById,
    revertStatusById,
    publishAllStatus,
    mediaUploadStatus,
    error,
    lastActionMessage,
    selectSection,
    refreshSections,
    saveDraft,
    publishSection,
    publishAllSections,
    revertSection,
    uploadImage,
    clearMessage,
    resourceEntries,
    partnerEntries,
    resourceFetchStatusByType,
    resourceMutationStatus,
    resourceError,
    fetchEntriesByType,
    createEntry,
    updateEntry,
    deleteEntry,
    reorderEntries,
  } = useCmsDashboard();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    const isActiveValid = sections.some((section) => section.id === activeSectionId);
    if (!isActiveValid) {
      selectSection(sections[0].id);
    }
  }, [sections, activeSectionId, selectSection]);

  const activeSaveStatus = saveStatusById[activeSectionId] || 'idle';
  const activePublishStatus = publishStatusById[activeSectionId] || 'idle';
  const activeRevertStatus = revertStatusById[activeSectionId] || 'idle';
  const isInitialLoading = fetchStatus === 'loading' && sections.length === 0;
  const connectionState =
    fetchStatus === 'succeeded'
      ? 'connected'
      : fetchStatus === 'failed'
        ? 'disconnected'
        : 'connecting';
  const connectionLabel =
    connectionState === 'connected'
      ? 'Connected'
      : connectionState === 'disconnected'
        ? 'Disconnected'
        : 'Connecting...';
  const connectionDotClass =
    connectionState === 'connected'
      ? 'bg-emerald-500'
      : connectionState === 'disconnected'
        ? 'bg-rose-500'
        : 'bg-amber-500 animate-pulse';
  const handleRefresh = () => {
    refreshSections().catch(() => {
      // error state is handled in redux slice
    });
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/api/auth/logout');
    } catch {
      // local session cleanup still runs even if backend logout fails
    } finally {
      clearAuthSession();
      navigate('/login', { replace: true });
    }
  };

  const pageTitle = useMemo(
    () =>
      sections.find((item) => item.id === activeSectionId)?.label ??
      'Dashboard',
    [sections, activeSectionId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar - Full Height */}
      <DashboardSidebar
        sections={sections}
        activeSectionId={activeSectionId}
        onSelectSection={selectSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="z-20 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <div className="lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-sm border border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-75 p-0 border-r-0">
                    <div className="flex h-full flex-col bg-white">
                      <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                          Navigation Menu
                        </p>
                      </div>
                      <div className="flex-1 overflow-y-auto pt-4">
                        <DashboardSidebar
                          sections={sections}
                          activeSectionId={activeSectionId}
                          onSelectSection={(id) => {
                            selectSection(id);
                            setIsMobileMenuOpen(false);
                          }}
                          isCollapsed={false}
                          onToggleCollapse={() => { }}
                          className="flex! w-full! h-full border-r-0! lg:hidden"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Content Management
                </p>
                <h1 className="text-sm font-semibold text-slate-900">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${connectionDotClass}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {connectionLabel}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:bg-slate-50"
                title="Refresh CMS content"
              >
                {fetchStatus === 'loading' ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 rounded-sm border border-slate-200 text-slate-500 hover:bg-slate-50"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <div className="mx-auto max-w-6xl">
            {isInitialLoading ? (
              <div className="flex min-h-[45vh] items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <LoaderCircle className="h-5 w-5 animate-spin text-[#03385e]" />
                  Loading CMS sections...
                </div>
              </div>
            ) : (
              <EditorPanel
                activeSectionId={activeSectionId}
                sections={sections}
                onSelectSection={selectSection}
                onSaveDraft={saveDraft}
                onPublishSection={publishSection}
                onPublishAll={publishAllSections}
                onRevertSection={revertSection}
                onUploadImage={uploadImage}
                saveStatus={activeSaveStatus}
                publishStatus={activePublishStatus}
                revertStatus={activeRevertStatus}
                publishAllStatus={publishAllStatus}
                mediaUploadStatus={mediaUploadStatus}
                error={error}
                lastActionMessage={lastActionMessage}
                onClearMessage={clearMessage}
                resourceEntries={resourceEntries}
                partnerEntries={partnerEntries}
                resourceFetchStatusByType={resourceFetchStatusByType}
                resourceMutationStatus={resourceMutationStatus}
                resourceError={resourceError}
                onFetchEntriesByType={fetchEntriesByType}
                onCreateEntry={createEntry}
                onUpdateEntry={updateEntry}
                onDeleteEntry={deleteEntry}
                onReorderEntries={reorderEntries}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
