export interface ClameH {
  uid: string;
  uidUs?: string;
  uidDocOsn?: string;
  code?: string;
  docNum?: string;
  docDate?: string;
  clientUid?: string;
  comment?: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
  isDel?: boolean;
}

export interface ClameT {
  uidLine: string;
  uid?: string; // uid of clame_h
  uidLineDocOsn?: string;
  goodUid?: string;
  seriesUid?: string;
  qnt?: number;
  typeClame?: string;
  comment?: string;
  result?: string;
  createTime?: string;
  updateTime?: string;
}

export interface ClameType {
  uid: string;
  name: string;
}
