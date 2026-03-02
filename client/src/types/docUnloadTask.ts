export interface DocUnloadTask {
  uid: string;
  requestTime: string;
  contactUid: string;
  contactName?: string;
  docType: string;
  docUid: string;
  docNum: string;
  docDate: string;
  isUnloaded: boolean;
  unloadTime?: string;
  statusUpdateTime?: string;
  unloadComment?: string;
  isDel: boolean;
}

export interface DocUnloadTaskViewDto {
  uid: string;
  requestTime: string;
  contactUid: string;
  contactName?: string;
  docType: string;
  docUid: string;
  docNum: string;
  docDate: string;
  isUnloaded: boolean;
  unloadTime?: string;
  statusUpdateTime?: string;
  unloadComment?: string;
  isDel: boolean;
}

export interface DocUnloadTaskSummary {
  docUid: string;
  total: number;
  done: number;
  pending: number;
}
