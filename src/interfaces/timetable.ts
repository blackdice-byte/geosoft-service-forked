export interface AITimetableConfig {
  apiKey: string;
  database: ITimetableDatabase;
  columnCount: number;
  columnDurations: { [key: number]: number };
  defaultSlotDuration: number;
  existingCellContents: Map<string, ICellContent>;
  hiddenCells: Set<string>;
  selectedClassId?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ALIGNMENT {
  LEFT = "LEFT",
  CENTER = "CENTER",
  RIGHT = "RIGHT",
}

export enum PRIORITY {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum STATUS {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}


export interface ITutor {
  id: string;
  name: string;
  email?: string;
  subjects: string[];
  maxPeriodsPerDay?: number;
  unavailableSlots?: string[]; // cellKeys like "1-3" (row-col)
}

export interface ICourse {
  id: string;
  name: string;
  teacherId: string;
  periodsPerWeek: number;
  priority: PRIORITY;
  duration?: number; // in minutes, if different from default
  preferredSlots?: string[]; // preferred time slots
  avoidConsecutive?: boolean; // avoid back-to-back periods
}

export interface ISession {
  id: string;
  name: string; // e.g., "Class 1A", "Grade 10B"
  subjects: string[]; // IDs of subjects assigned to this class
}

export interface ITimetableEntry {
  row: number;
  col: number;
  day: string;
  cellKey: string;
  teacher?: ITutor;
  subject?: ICourse;
  timeSlot: string;
  session?: ISession;
  customText?: string;
  isVertical?: boolean;
  alignment?: "left" | "center" | "right";
}

export interface ITimetableTemplate {
  id: string;
  name: string;
  createdAt?: string;
  columnCount: number;
  description?: string;
  entries: ITimetableEntry[];
  defaultSlotDuration: number;
  hiddenCellsArray?: string[];
  mergedCellsData?: { [key: string]: any };
  columnDurations: { [key: number]: number };
}

export interface ITimetableDatabase {
  tutors: ITutor[];
  courses: ICourse[];
  sessions: ISession[];
  blockedSlots: string[]; // for breaks, devotion, etc.
  blockedTexts: string[]; // texts to avoid when auto-generating
  templates?: ITimetableTemplate[]; // saved timetable templates
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMergeInfo {
  rowSpan: number;
  colSpan: number;
}

export interface IColumnTimes {
  start: number;
  end: number;
  duration: number;
}

export interface ICellContent {
  text: string;
  isVertical: boolean;
  alignment: "left" | "center" | "right";
  className?: string; // ID of the class this cell belongs to
  backgroundColor?: string; // Background color for the cell
}

export interface ICellPosition {
  row: number;
  col: number;
}

export interface IGridState {
  selectedCells: Set<string>;
  mergedCells: Map<string, IMergeInfo>;
  hiddenCells: Set<string>;
  columnCount: number;
  hoveredColumn: number | null;
  openPopover: number | null;
  editingDuration: number | null;
  tempDuration: string;
  defaultSlotDuration: number;
  editingDefaultDuration: boolean;
  tempDefaultDuration: string;
  columnDurations: { [key: number]: number };
  cellContents: Map<string, ICellContent>;
  editingCell: string | null;
  tempCellText: string;
}

export interface IGridActions {
  handleCellClick: (row: number, col: number) => void;
  handleCellDoubleClick: (row: number, col: number) => void;
  mergeCells: () => void;
  addColumnAfter: (column: number) => void;
  deleteColumn: (column: number) => void;
  startEditingDuration: (column: number) => void;
  saveDurationEdit: () => void;
  cancelDurationEdit: () => void;
  saveDefaultDurationEdit: () => void;
  cancelDefaultDurationEdit: () => void;
  resetGrid: () => void;
  setHoveredColumn: (column: number | null) => void;
  setOpenPopover: (popover: number | null) => void;
  setTempDuration: (duration: string) => void;
  setTempDefaultDuration: (duration: string) => void;
  setEditingDefaultDuration: (editing: boolean) => void;
  startEditingCell: (cellKey: string) => void;
  saveCellEdit: () => void;
  cancelCellEdit: () => void;
  setTempCellText: (text: string) => void;
  toggleCellVertical: (cellKey: string) => void;
  setCellAlignment: (
    cellKey: string,
    alignment: "left" | "center" | "right",
  ) => void;
  setCellBackgroundColor: (cellKey: string, color: string) => void;
  setSelectedCellsBackgroundColor: (color: string) => void;
  // updateCellContents: (contents: Map<string, ICellContent>) => void;
  setAllCellContents: (contents: Map<string, ICellContent>) => void;
  setAllMergedCells: (mergedCells: Map<string, any>) => void;
  setAllHiddenCells: (hiddenCells: Set<string>) => void;
}
