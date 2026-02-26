import React, { useEffect, useMemo, useState } from 'react'
import { LoaderCircle, LogOut, Menu, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import EditorPanel from '@/components/dashboard/EditorPanel'
import { useCmsDashboard } from '@/hooks/useCmsDashboard'
import { clearAuthSession } from '@/lib/auth'
import { axiosClient } from '@/lib/api/axiosClient'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const DashboardPage = () => {
  const navigate = useNavigate()
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
  } = useCmsDashboard()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('dark')
    root.classList.add('light')
  }, [])

  useEffect(() => {
    if (!sections.length) return
    const isActiveValid = sections.some((section) => section.id === activeSectionId)
    if (!isActiveValid) selectSection(sections[0].id)
  }, [sections, activeSectionId, selectSection])

  const activeSaveStatus = saveStatusById[activeSectionId] || 'idle'
  const activePublishStatus = publishStatusById[activeSectionId] || 'idle'
  const activeRevertStatus = revertStatusById[activeSectionId] || 'idle'
  const isInitialLoading = fetchStatus === 'loading' && sections.length === 0

  const pageTitle = useMemo(() => {
    return sections.find((item) => item.id === activeSectionId)?.label || 'Dashboard'
  }, [sections, activeSectionId])

  const handleRefresh = () => {
    refreshSections().catch(() => {})
  }

  const handleLogout = async () => {
    try {
      await axiosClient.post('/api/auth/logout')
    } catch {
      // local session cleanup still runs
    } finally {
      clearAuthSession()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="hidden w-80 shrink-0 lg:block">
        <DashboardSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelectSection={selectSection}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[90vw] max-w-sm p-0">
                    <DashboardSidebar
                      sections={sections}
                      activeSectionId={activeSectionId}
                      onSelectSection={(id) => {
                        selectSection(id)
                        setIsMobileMenuOpen(false)
                      }}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Content Management
                </p>
                <h1 className="text-base font-bold text-slate-900">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleRefresh}>
                {fetchStatus === 'loading' ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button type="button" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl">
            {isInitialLoading ? (
              <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
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
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
