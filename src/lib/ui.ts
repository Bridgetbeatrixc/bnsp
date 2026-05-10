// Menggabungkan beberapa class Tailwind tanpa menulis undefined/null.
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Kumpulan utility Tailwind yang dipakai ulang agar JSX tetap mudah dibaca.
export const ui = {
  actions: "mt-4 flex flex-wrap gap-2 max-md:grid max-md:grid-cols-1",
  authPage:
    "flex min-h-screen items-center bg-gradient-to-br from-app-sidebar/95 to-app-primary/90 p-8 max-md:items-stretch max-md:p-4",
  badge: "inline-block rounded-full bg-[#e8eef3] px-2 py-1 text-xs",
  badgeAdmin: "inline-block rounded-full bg-[#e7f5ef] px-2 py-1 text-xs text-[#0f5132]",
  badgeLecturer: "inline-block rounded-full bg-[#fff3df] px-2 py-1 text-xs text-[#7a4a10]",
  badgeStudent: "inline-block rounded-full bg-[#eaf3ff] px-2 py-1 text-xs text-[#174a7c]",
  button:
    "inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-app-primary px-3.5 py-2.5 text-white no-underline hover:bg-app-primaryDark max-md:min-h-11 max-md:w-full",
  card: "rounded-lg border border-app-line bg-app-panel p-[18px] max-md:p-3.5 max-[420px]:rounded-md max-[420px]:p-3",
  dangerButton:
    "inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-app-danger px-3.5 py-2.5 text-white no-underline hover:bg-red-800 max-md:min-h-11 max-md:w-full",
  emptyNote: "m-0 rounded-lg border border-dashed border-app-line bg-slate-50 p-3 text-app-muted",
  errorMessage: "m-0 rounded-lg border border-[#fecdca] bg-[#fee4e2] px-3 py-2.5 text-app-danger",
  equipmentRow: "grid grid-cols-[minmax(220px,1fr)_140px_auto] items-end gap-3 max-md:grid-cols-1 max-md:items-stretch",
  formControls:
    "[&_button]:font-[inherit] [&_input]:w-full [&_input]:min-w-0 [&_input]:rounded-lg [&_input]:border [&_input]:border-app-line [&_input]:p-2.5 [&_input]:font-[inherit] [&_label]:grid [&_label]:gap-1.5 [&_label]:text-[13px] [&_label]:text-app-muted [&_select]:w-full [&_select]:min-w-0 [&_select]:rounded-lg [&_select]:border [&_select]:border-app-line [&_select]:p-2.5 [&_select]:font-[inherit] [&_textarea]:min-h-24 [&_textarea]:w-full [&_textarea]:min-w-0 [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-app-line [&_textarea]:p-2.5 [&_textarea]:font-[inherit]",
  formGrid: "grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5 max-md:grid-cols-1",
  ghostButton:
    "inline-flex cursor-pointer items-center justify-center rounded-lg border-0 bg-[#e8eef3] px-3.5 py-2.5 text-app-text no-underline hover:bg-[#d8e2ea] max-md:min-h-11 max-md:w-full",
  grid: "grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4",
  loginShell: "mx-auto grid w-full max-w-[520px] grid-cols-[minmax(280px,420px)] items-start justify-center gap-[18px] max-md:grid-cols-1",
  metric: "mt-2 text-[34px] font-bold text-app-primary",
  metricSmall: "mt-2 text-2xl font-bold text-app-primary",
  navLink: "rounded-lg border border-transparent px-3 py-2.5 text-[#d9e7f2] no-underline hover:bg-app-sidebarPanel max-md:flex-none max-md:whitespace-nowrap",
  navLinkActive: "border-white/30 bg-app-primary font-bold text-white",
  panel: "rounded-lg border border-app-line bg-app-panel p-[18px] max-md:p-3.5 max-[420px]:rounded-md max-[420px]:p-3",
  stack: "flex flex-col gap-[18px] max-[420px]:gap-3.5",
  subtitle: "mt-1.5 text-app-muted max-md:text-sm max-md:leading-normal",
  successMessage: "m-0 rounded-lg border border-[#b7e2cd] bg-[#e7f5ef] px-3 py-2.5 text-[#0f5132]",
  tableWrap:
    "w-full overflow-x-auto rounded-lg border border-app-line bg-app-panel max-md:-mx-0.5 [&_table]:w-full [&_table]:min-w-[760px] [&_table]:border-collapse [&_table]:bg-app-panel [&_td]:border-b [&_td]:border-app-line [&_td]:p-3 [&_td]:text-left [&_td]:align-top max-md:[&_td]:p-2.5 [&_th]:border-b [&_th]:border-app-line [&_th]:p-3 [&_th]:text-left [&_th]:align-top [&_th]:text-[13px] [&_th]:uppercase [&_th]:text-app-muted max-md:[&_th]:p-2.5",
  textLink: "text-center font-bold text-app-primary no-underline",
  textLinkLight: "text-center font-bold text-white no-underline",
  title: "m-0 text-[26px] font-bold max-md:text-[22px] max-md:leading-tight",
  topbar: "mb-5 flex w-full items-start justify-between gap-4 max-md:flex-col max-md:items-stretch"
};
