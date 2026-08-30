"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Plus,
  Pencil,
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";
import YearForm, { type YearFormData } from "@/components/admin/year-form";
import ModuleForm, { type ModuleFormData } from "@/components/admin/module-form";
import ContentItemForm, {
  type ContentItemFormData,
} from "@/components/admin/content-item-form";
import DeleteButton from "@/components/admin/delete-button";
import { deleteYear, deleteModule, deleteContentItem } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export interface AdminContentData {
  years: {
    id: number;
    number: number;
    labelFr: string;
    labelAr: string;
    totalCoefficient: number;
    modules: {
      id: string;
      nameFr: string;
      nameAr: string;
      coefficient: number;
      order: number;
      icon: string;
      contentItems: {
        id: string;
        type: "summary" | "quiz";
        titleFr: string;
        titleAr: string;
        description: string | null;
        fileName: string;
        fileUrl: string | null;
      }[];
    }[];
  }[];
}

export default function ContentManager({ data }: { data: AdminContentData }) {
  const t = useTranslations("admin.content");
  const locale = useLocale();

  const [openYearId, setOpenYearId] = useState<number | null>(
    data.years[0]?.id ?? null
  );
  const [showYearForm, setShowYearForm] = useState(false);
  const [editingYearId, setEditingYearId] = useState<number | null>(null);
  const [addingModuleYearId, setAddingModuleYearId] = useState<number | null>(
    null
  );
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [addingContentModuleId, setAddingContentModuleId] = useState<
    string | null
  >(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  const closeAll = () => {
    setEditingYearId(null);
    setAddingModuleYearId(null);
    setEditingModuleId(null);
    setAddingContentModuleId(null);
    setEditingContentId(null);
  };

  return (
    <div className="space-y-stack-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-manrope)] text-headline-lg text-primary font-bold mb-2">
            {t("title")}
          </h1>
          <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant">
            {t("description")}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-on-primary-fixed-variant shrink-0"
          onClick={() => {
            closeAll();
            setShowYearForm((v) => !v);
          }}
        >
          <Plus className="w-4 h-4" /> {t("addYear")}
        </Button>
      </div>

      {showYearForm && (
        <div className="bg-white rounded-xl shadow-sm border border-surface-container-high p-6">
          <YearForm mode="create" onDone={() => setShowYearForm(false)} />
        </div>
      )}

      {data.years.length === 0 ? (
        <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
          {t("noYears")}
        </p>
      ) : (
        data.years.map((year) => (
          <div
            key={year.id}
            className="bg-white rounded-xl shadow-sm border border-surface-container-high overflow-hidden"
          >
            {/* Year header */}
            <div className="flex items-center justify-between gap-2 px-5 py-4 bg-surface-container-low">
              <button
                type="button"
                className="flex items-center gap-3 text-start flex-1 min-w-0"
                onClick={() =>
                  setOpenYearId((v) => (v === year.id ? null : year.id))
                }
              >
                {openYearId === year.id ? (
                  <ChevronUp className="w-5 h-5 text-on-surface-variant shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-on-surface-variant shrink-0" />
                )}
                <GraduationCap className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold">
                    {year.number} —{" "}
                    {locale === "ar" ? year.labelAr : year.labelFr}
                  </p>
                  <p className="font-[var(--font-inter)] text-body-xs text-on-surface-variant">
                    {t("modulesCount", { count: year.modules.length })} ·{" "}
                    {t("coefficientTotal")}: {year.totalCoefficient}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-on-surface-variant"
                  onClick={() => {
                    closeAll();
                    setEditingYearId(year.id);
                  }}
                >
                  <Pencil className="w-4 h-4" /> {t("edit")}
                </Button>
                <DeleteButton
                  confirmLabel={t("confirmDeleteYear")}
                  onDelete={async () => {
                    const r = await deleteYear(year.id);
                    return r;
                  }}
                />
              </div>
            </div>

            {openYearId === year.id && (
              <div className="p-5 space-y-4">
                {editingYearId === year.id && (
                  <div className="bg-surface-neutral rounded-lg p-5 border border-surface-container">
                    <YearForm
                      mode="edit"
                      year={year as unknown as YearFormData}
                      onDone={() => setEditingYearId(null)}
                    />
                  </div>
                )}

                {year.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="border border-surface-container rounded-lg overflow-hidden"
                  >
                    {editingModuleId === mod.id ? (
                      <div className="p-5 bg-surface-neutral">
                        <ModuleForm
                          mode="edit"
                          module={mod as unknown as ModuleFormData}
                          onDone={() => setEditingModuleId(null)}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-2 px-4 py-3">
                          <div className="min-w-0">
                            <p className="font-[var(--font-inter)] text-body-md text-on-surface font-semibold">
                              {locale === "ar" ? mod.nameAr : mod.nameFr}
                            </p>
                            <p className="font-[var(--font-inter)] text-body-xs text-on-surface-variant">
                              {t("coefficient")}: {mod.coefficient} ·{" "}
                              {t("itemsCount", { count: mod.contentItems.length })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-on-surface-variant"
                              onClick={() => {
                                closeAll();
                                setEditingModuleId(mod.id);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <DeleteButton
                              confirmLabel={t("confirmDeleteModule")}
                              onDelete={async () => {
                                const r = await deleteModule(mod.id);
                                return r;
                              }}
                            />
                          </div>
                        </div>

                        <div className="px-4 pb-4 space-y-2">
                          {mod.contentItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-2 bg-surface-container-low rounded-lg px-3 py-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {item.type === "summary" ? (
                                  <FileText className="w-4 h-4 text-primary shrink-0" />
                                ) : (
                                  <ClipboardCheck className="w-4 h-4 text-teal-success shrink-0" />
                                )}
                                <p className="font-[var(--font-inter)] text-body-sm text-on-surface truncate">
                                  {locale === "ar" ? item.titleAr : item.titleFr}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1.5 h-auto text-on-surface-variant"
                                  onClick={() => {
                                    closeAll();
                                    setEditingContentId(item.id);
                                  }}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <DeleteButton
                                  confirmLabel={t("confirmDeleteItem")}
                                  onDelete={async () => {
                                    const r = await deleteContentItem(item.id);
                                    return r;
                                  }}
                                />
                              </div>
                            </div>
                          ))}

                          {editingContentId &&
                            mod.contentItems.some(
                              (i) => i.id === editingContentId
                            ) && (
                              <div className="bg-white border border-surface-container rounded-lg p-4">
                                <ContentItemForm
                                  mode="edit"
                                  item={
                                    mod.contentItems.find(
                                      (i) => i.id === editingContentId
                                    ) as unknown as ContentItemFormData
                                  }
                                  onDone={() => setEditingContentId(null)}
                                />
                              </div>
                            )}

                          {addingContentModuleId === mod.id ? (
                            <div className="bg-white border border-surface-container rounded-lg p-4">
                              <ContentItemForm
                                mode="create"
                                moduleId={mod.id}
                                onDone={() => setAddingContentModuleId(null)}
                              />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-primary"
                              onClick={() => {
                                closeAll();
                                setAddingContentModuleId(mod.id);
                              }}
                            >
                              <Plus className="w-4 h-4" /> {t("addContent")}
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {addingModuleYearId === year.id ? (
                  <div className="bg-surface-neutral rounded-lg p-5 border border-surface-container">
                    <ModuleForm
                      mode="create"
                      yearId={year.id}
                      onDone={() => setAddingModuleYearId(null)}
                    />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-primary"
                    onClick={() => {
                      closeAll();
                      setAddingModuleYearId(year.id);
                    }}
                  >
                    <Plus className="w-4 h-4" /> {t("addModule")}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
