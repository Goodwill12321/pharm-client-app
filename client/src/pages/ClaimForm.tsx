import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate, useParams } from 'react-router-dom';
import { useClaimQuery } from '../hooks/useClaimQuery';
import { useClaimLinesQuery } from '../hooks/useClaimLinesQuery';
import { useClaimTypesQuery } from '../hooks/useClaimTypesQuery';
import { useInvoiceLinesQuery } from '../hooks/useInvoiceLinesQuery';
import type { InvoiceLine } from '../types/invoice';
import type { ClameT } from '../types/clame';
import { createClaimLine, deleteClaimLine, updateClaim, updateClaimLine } from '../api/claims';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useMessagesQuery } from '../hooks/useMessagesQuery';
import { createMessage, updateMessage } from '../api/messages';
import { useFilesClameQuery } from '../hooks/useFilesClameQuery';
import { useFilesQuery } from '../hooks/useFilesQuery';
import { createFile } from '../api/files';
import { createFilesClame } from '../api/filesClame';

const OBJECT_TYPE = 'CLAME';

const ClaimForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUserName } = useAuth();

  const { data: claim, isLoading: claimLoading, isError: claimIsError } = useClaimQuery(id);
  const { data: allLines = [] } = useClaimLinesQuery();
  const { data: types = [] } = useClaimTypesQuery();
  const { data: invoiceLines = [] } = useInvoiceLinesQuery(claim?.uidDocOsn);
  const { data: allMessages = [] } = useMessagesQuery();
  const { data: filesClame = [] } = useFilesClameQuery();
  const { data: allFiles = [] } = useFilesQuery();

  const claimLines = useMemo(() => {
    if (!claim?.uid) return [];
    return allLines.filter((l) => l.uid === claim.uid);
  }, [allLines, claim?.uid]);

  const messages = useMemo(() => {
    if (!claim?.uid) return [];
    return allMessages
      .filter((m) => m.objectUid === claim.uid && (m.objectType ?? OBJECT_TYPE) === OBJECT_TYPE)
      .sort((a, b) => {
        const at = a.createTime ? new Date(a.createTime).getTime() : 0;
        const bt = b.createTime ? new Date(b.createTime).getTime() : 0;
        return at - bt;
      });
  }, [allMessages, claim?.uid]);

  const linkedFileIds = useMemo(() => {
    if (!claim?.uid) return [];
    return filesClame.filter((fc) => fc.uidClame === claim.uid).map((fc) => fc.uidFile).filter(Boolean) as string[];
  }, [filesClame, claim?.uid]);

  const linkedFiles = useMemo(() => {
    if (linkedFileIds.length === 0) return [];
    const set = new Set(linkedFileIds);
    return allFiles.filter((f) => set.has(f.uid));
  }, [allFiles, linkedFileIds]);

  const [isEditingClaimText, setIsEditingClaimText] = useState(false);
  const [claimTextDraft, setClaimTextDraft] = useState('');
  const [claimTextError, setClaimTextError] = useState<string | null>(null);

  const updateClaimMutation = useMutation({
    mutationFn: (patch: { uid: string; comment?: string }) => updateClaim(patch.uid, { comment: patch.comment }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['claim', id] });
      await queryClient.invalidateQueries({ queryKey: ['claims'] });
      setIsEditingClaimText(false);
      setClaimTextError(null);
    },
    onError: (e: any) => setClaimTextError(e?.message || 'Не удалось сохранить текст претензии'),
  });

  const [newLineInvoiceUidLine, setNewLineInvoiceUidLine] = useState<string>('');
  const [newLineQnt, setNewLineQnt] = useState<string>('');
  const [newLineType, setNewLineType] = useState<string>('');
  const [newLineComment, setNewLineComment] = useState<string>('');
  const [lineError, setLineError] = useState<string | null>(null);

  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editingLineQnt, setEditingLineQnt] = useState<string>('');
  const [editingLineComment, setEditingLineComment] = useState<string>('');
  const [editingLineType, setEditingLineType] = useState<string>('');
  const [editingLineError, setEditingLineError] = useState<string | null>(null);

  const selectedInvoiceLine = useMemo<InvoiceLine | undefined>(() => {
    return invoiceLines.find((l) => l.uidLine === newLineInvoiceUidLine);
  }, [invoiceLines, newLineInvoiceUidLine]);

  const createLineMutation = useMutation({
    mutationFn: (payload: Partial<ClameT>) => createClaimLine(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['claimLines'] });
      setNewLineInvoiceUidLine('');
      setNewLineQnt('');
      setNewLineType('');
      setNewLineComment('');
      setLineError(null);
    },
    onError: (e: any) => setLineError(e?.message || 'Не удалось добавить строку'),
  });

  const updateLineMutation = useMutation({
    mutationFn: (payload: { uidLine: string; patch: Partial<ClameT> }) => updateClaimLine(payload.uidLine, payload.patch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['claimLines'] });
      setEditingLineId(null);
      setEditingLineError(null);
    },
    onError: (e: any) => setEditingLineError(e?.message || 'Не удалось сохранить строку'),
  });

  const deleteLineMutation = useMutation({
    mutationFn: (uidLine: string) => deleteClaimLine(uidLine),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['claimLines'] });
    },
    onError: (e: any) => setEditingLineError(e?.message || 'Не удалось удалить строку'),
  });

  const [newMessage, setNewMessage] = useState('');
  const [msgError, setMsgError] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>('');
  const sendMessageMutation = useMutation({
    mutationFn: () => {
      if (!claim?.uid) return Promise.reject(new Error('Claim uid is required'));
      return createMessage({
        objectUid: claim.uid,
        objectType: OBJECT_TYPE,
        message: newMessage,
        sender: currentUserName ?? undefined,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      setNewMessage('');
      setMsgError(null);
    },
    onError: (e: any) => setMsgError(e?.message || 'Не удалось отправить сообщение'),
  });

  const updateMessageMutation = useMutation({
    mutationFn: (payload: { uid: string; message: string }) => updateMessage(payload.uid, { message: payload.message, sender: currentUserName ?? undefined }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
      setEditingMessageId(null);
      setEditingMessageText('');
      setMsgError(null);
    },
    onError: (e: any) => setMsgError(e?.message || 'Не удалось сохранить сообщение'),
  });

  const [fileMeta, setFileMeta] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const linkFileMutation = useMutation({
    mutationFn: async () => {
      if (!claim?.uid) throw new Error('Claim uid is required');
      const created = await createFile({ files: fileMeta });
      await createFilesClame({ uidClame: claim.uid, uidFile: created.uid });
      return created;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['files'] }),
        queryClient.invalidateQueries({ queryKey: ['filesClame'] }),
      ]);
      setFileMeta('');
      setFileError(null);
    },
    onError: (e: any) => setFileError(e?.message || 'Не удалось привязать файл'),
  });

  const handleAddLine = () => {
    if (!claim?.uid) {
      setLineError('Претензия не загружена');
      return;
    }
    if (!selectedInvoiceLine) {
      setLineError('Выберите товар/серию из накладной');
      return;
    }
    const qnt = newLineQnt.trim() === '' ? undefined : Number(newLineQnt);
    if (newLineQnt.trim() !== '' && (!Number.isFinite(qnt) || (qnt ?? 0) <= 0)) {
      setLineError('Некорректное количество');
      return;
    }
    setLineError(null);
    createLineMutation.mutate({
      uid: claim.uid,
      uidLineDocOsn: selectedInvoiceLine.uidLine,
      goodUid: selectedInvoiceLine.goodUid,
      seriesUid: selectedInvoiceLine.seriesUid,
      qnt,
      typeClame: newLineType || undefined,
      comment: newLineComment || undefined,
    });
  };

  const handleLinkFile = () => {
    if (fileMeta.trim() === '') {
      setFileError('Введите описание/имя файла (метаданные)');
      return;
    }
    setFileError(null);
    linkFileMutation.mutate();
  };

  const [localImages, setLocalImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const [localImageError, setLocalImageError] = useState<string | null>(null);

  const addLocalFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: { id: string; name: string; url: string }[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(f);
      next.push({ id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, name: f.name, url });
    }
    if (next.length === 0) {
      setLocalImageError('Выберите изображения');
      return;
    }
    setLocalImageError(null);
    setLocalImages((prev) => [...next, ...prev]);
  };

   if (!id) {
     return (
       <Box>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
           <IconButton size="small" onClick={() => navigate('/claims')} aria-label="Назад">
             <ArrowBackIcon fontSize="small" />
           </IconButton>
           <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
             Новая претензия
           </Typography>
         </Box>
         <Alert severity="info">
           Создание претензии выполняется на странице списка претензий (выберите накладную и нажмите «Создать»).
         </Alert>
       </Box>
     );
   }

  if (claimIsError) {
    return (
      <Alert severity="error">Ошибка загрузки претензии</Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <IconButton size="small" onClick={() => navigate('/claims')} aria-label="Назад">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
          Претензия {claim?.code || (claim?.uid ? claim.uid.slice(0, 8) : '')}
        </Typography>
      </Box>

      {claimLoading || !claim ? (
        <Typography sx={{ color: 'text.secondary', fontSize: '13px' }}>Загрузка...</Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '13px' }}>
                <b>Статус:</b> {claim.status ?? ''}
              </Typography>
              <Typography sx={{ fontSize: '13px' }}>
                <b>Накладная:</b>{' '}
                {claim.uidDocOsn ? (
                  <Link
                    component="button"
                    underline="hover"
                    onClick={() => navigate(`/invoices/${claim.uidDocOsn}`)}
                    sx={{ fontSize: '13px' }}
                  >
                    {claim.docNum ?? claim.uidDocOsn}
                    <LaunchIcon sx={{ ml: 0.5, fontSize: '16px', verticalAlign: 'text-bottom' }} />
                  </Link>
                ) : (
                  <>{claim.docNum ?? ''}</>
                )}
              </Typography>
              <Typography sx={{ fontSize: '13px' }}>
                <b>Дата:</b> {claim.docDate ? new Date(claim.docDate).toLocaleDateString('ru-RU') : ''}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 0.5 }}>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Текст претензии</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  setClaimTextDraft(claim.comment ?? '');
                  setIsEditingClaimText((v) => !v);
                  setClaimTextError(null);
                }}
                aria-label="Редактировать"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
            {isEditingClaimText ? (
              <>
                <TextField
                  size="small"
                  value={claimTextDraft}
                  onChange={(e) => setClaimTextDraft(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                  sx={{ fontSize: '13px' }}
                  InputLabelProps={{ sx: { fontSize: '13px' } }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      if (!claim.uid) return;
                      updateClaimMutation.mutate({ uid: claim.uid, comment: claimTextDraft });
                    }}
                    disabled={updateClaimMutation.isPending}
                    sx={{ fontSize: '13px' }}
                  >
                    Сохранить
                  </Button>
                </Box>
                {claimTextError && <Alert severity="error" sx={{ mt: 1 }}>{claimTextError}</Alert>}
              </>
            ) : (
              <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{claim.comment ?? ''}</Typography>
            )}
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>Товары в претензии</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Товар/серия (из накладной)"
                size="small"
                select
                value={newLineInvoiceUidLine}
                onChange={(e) => setNewLineInvoiceUidLine(e.target.value)}
                sx={{ minWidth: 360, flexGrow: 1, fontSize: '13px' }}
                InputLabelProps={{ sx: { fontSize: '13px' } }}
                SelectProps={{
                  sx: { fontSize: '13px' },
                  MenuProps: {
                    PaperProps: {
                      sx: { fontSize: '13px' }
                    }
                  }
                }}
              >
                <MenuItem value="">Выберите позицию</MenuItem>
                {invoiceLines.map((l) => (
                  <MenuItem key={l.uidLine} value={l.uidLine} sx={{ fontSize: '13px' }}>
                    {l.goodName} / {l.seriesName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Кол-во"
                size="small"
                value={newLineQnt}
                onChange={(e) => setNewLineQnt(e.target.value)}
                sx={{ width: 120, fontSize: '13px' }}
                InputLabelProps={{ sx: { fontSize: '13px' } }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 160 }}>
                <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>
                  Кол-во в накладной
                </Typography>
                <Typography
                  component="div"
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.5,
                    fontSize: '15px',
                    color: 'text.secondary',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.default',
                  }}
                >
                  {selectedInvoiceLine ? String(selectedInvoiceLine.qnt ?? '') : ''}
                </Typography>
              </Box>
              <TextField
                label="Тип"
                size="small"
                select
                value={newLineType}
                onChange={(e) => setNewLineType(e.target.value)}
                sx={{ minWidth: 240, fontSize: '13px' }}
                InputLabelProps={{ sx: { fontSize: '13px' } }}
                SelectProps={{
                  sx: { fontSize: '13px' },
                  MenuProps: {
                    PaperProps: {
                      sx: { fontSize: '13px' }
                    }
                  }
                }}
              >
                <MenuItem value="">(не выбран)</MenuItem>
                {types.map((t) => (
                  <MenuItem key={t.uid} value={t.uid} sx={{ fontSize: '13px' }}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Комментарий к строке"
                size="small"
                value={newLineComment}
                onChange={(e) => setNewLineComment(e.target.value)}
                sx={{ minWidth: 260, flexGrow: 1, fontSize: '13px' }}
                InputLabelProps={{ sx: { fontSize: '13px' } }}
              />
              <Button variant="contained" onClick={handleAddLine} disabled={createLineMutation.isPending} sx={{ fontSize: '13px' }}>
                Добавить
              </Button>
            </Box>

            {(lineError || selectedInvoiceLine?.goodName) && (
              <Box sx={{ mb: 1 }}>
                {lineError && <Alert severity="error">{lineError}</Alert>}
              </Box>
            )}

            <TableContainer component={Paper} variant="outlined">
              <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '35%' }}>Товар</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '15%' }}>Серия</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '12%' }}>Кол-во в накладной</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '8%' }}>Кол-во</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '15%' }}>Тип</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '10%' }}>Комментарий</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: '5%' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claimLines.map((l) => {
                    const inv = invoiceLines.find((x) => x.goodUid === l.goodUid && x.seriesUid === l.seriesUid);
                    const typeName = types.find((t) => t.uid === l.typeClame)?.name || '';
                    const isEditing = editingLineId === l.uidLine;
                    return (
                      <TableRow key={l.uidLine} hover>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{inv?.goodName ?? l.goodUid ?? ''}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{inv?.seriesName ?? l.seriesUid ?? ''}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{inv?.qnt ?? ''}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              value={editingLineQnt}
                              onChange={(e) => setEditingLineQnt(e.target.value)}
                              sx={{ width: 110 }}
                            />
                          ) : (
                            <>{l.qnt ?? ''}</>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              select
                              value={editingLineType}
                              onChange={(e) => setEditingLineType(e.target.value)}
                              sx={{ minWidth: 200 }}
                            >
                              <MenuItem value="">(не выбран)</MenuItem>
                              {types.map((t) => (
                                <MenuItem key={t.uid} value={t.uid}>
                                  {t.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            <>{typeName}</>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              value={editingLineComment}
                              onChange={(e) => setEditingLineComment(e.target.value)}
                              sx={{ minWidth: 220 }}
                            />
                          ) : (
                            <>{l.comment ?? ''}</>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem' }}>
                          {isEditing ? (
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const q = editingLineQnt.trim() === '' ? undefined : Number(editingLineQnt);
                                  if (editingLineQnt.trim() !== '' && (!Number.isFinite(q) || (q ?? 0) <= 0)) {
                                    setEditingLineError('Некорректное количество');
                                    return;
                                  }
                                  setEditingLineError(null);
                                  updateLineMutation.mutate({
                                    uidLine: l.uidLine,
                                    patch: {
                                      qnt: q,
                                      comment: editingLineComment || undefined,
                                      typeClame: editingLineType || undefined,
                                    },
                                  });
                                }}
                                aria-label="Сохранить"
                              >
                                <SaveOutlinedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingLineId(null);
                                  setEditingLineError(null);
                                }}
                                aria-label="Отмена"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingLineId(l.uidLine);
                                  setEditingLineQnt(l.qnt != null ? String(l.qnt) : '');
                                  setEditingLineComment(l.comment ?? '');
                                  setEditingLineType(l.typeClame ?? '');
                                  setEditingLineError(null);
                                }}
                                aria-label="Редактировать"
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => deleteLineMutation.mutate(l.uidLine)}
                                aria-label="Удалить"
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {editingLineError && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Alert severity="error">{editingLineError}</Alert>
                      </TableCell>
                    </TableRow>
                  )}
                  {claimLines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        Пока нет строк
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>Файлы</Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'background.default',
                borderStyle: 'dashed',
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                addLocalFiles(e.dataTransfer.files);
              }}
            >
              <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 1 }}>
                Перетащи изображения сюда или выбери файлы (заглушка, пока не сохраняем)
              </Typography>
              <Button variant="outlined" component="label" size="small">
                Выбрать изображения
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => addLocalFiles(e.target.files)}
                />
              </Button>
              {localImageError && <Alert severity="error" sx={{ mt: 1 }}>{localImageError}</Alert>}
              {localImages.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {localImages.map((img) => (
                    <Paper key={img.id} variant="outlined" sx={{ p: 1, width: 120 }}>
                      <Box
                        component="img"
                        src={img.url}
                        alt={img.name}
                        sx={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 1, mb: 0.5 }}
                      />
                      <Typography sx={{ fontSize: '11px' }} noWrap title={img.name}>
                        {img.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setLocalImages((prev) => prev.filter((x) => x.id !== img.id));
                          URL.revokeObjectURL(img.url);
                        }}
                        aria-label="Удалить"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>

            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 1 }}>
              Привязанные метаданные (в БД)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Имя/ссылка/описание файла"
                size="small"
                value={fileMeta}
                onChange={(e) => setFileMeta(e.target.value)}
                sx={{ minWidth: 320, flexGrow: 1, fontSize: '13px' }}
                InputLabelProps={{ sx: { fontSize: '13px' } }}
                InputProps={{
                  endAdornment: fileMeta ? (
                    <IconButton size="small" onClick={() => setFileMeta('')} aria-label="Очистить">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : undefined,
                }}
              />
              <Button variant="contained" onClick={handleLinkFile} disabled={linkFileMutation.isPending} sx={{ fontSize: '13px' }}>
                Добавить
              </Button>
            </Box>
            {fileError && <Alert severity="error" sx={{ mb: 1 }}>{fileError}</Alert>}
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Файл</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>UID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {linkedFiles.map((f) => (
                    <TableRow key={f.uid} hover>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{f.files ?? ''}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{f.uid}</TableCell>
                    </TableRow>
                  ))}
                  {linkedFiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        Пока нет файлов
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1 }}>Переписка</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
              {messages.map((m) => (
                <Paper key={m.uid} variant="outlined" sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {m.sender ? `От: ${m.sender}` : 'Автор: —'}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {m.createTime ? new Date(m.createTime).toLocaleString('ru-RU') : ''}
                    </Typography>
                  </Box>
                  {editingMessageId === m.uid ? (
                    <>
                      <TextField
                        size="small"
                        value={editingMessageText}
                        onChange={(e) => setEditingMessageText(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                        sx={{ mt: 1, fontSize: '13px' }}
                        InputLabelProps={{ sx: { fontSize: '13px' } }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            if (editingMessageText.trim() === '') {
                              setMsgError('Введите текст сообщения');
                              return;
                            }
                            updateMessageMutation.mutate({ uid: m.uid, message: editingMessageText });
                          }}
                          disabled={updateMessageMutation.isPending}
                          sx={{ fontSize: '13px' }}
                        >
                          Сохранить
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditingMessageText('');
                          }}
                          sx={{ fontSize: '13px' }}
                        >
                          Отмена
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                      <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap', flexGrow: 1 }}>{m.message ?? ''}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingMessageId(m.uid);
                          setEditingMessageText(m.message ?? '');
                          setMsgError(null);
                        }}
                        aria-label="Редактировать"
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              ))}
              {messages.length === 0 && (
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Пока нет сообщений</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <TextField
                label="Новое сообщение"
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                multiline
                minRows={2}
                sx={{ minWidth: 320, flexGrow: 1, fontSize: '13px' }}
                InputLabelProps={{ sx: { fontSize: '13px' } }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (newMessage.trim() === '') {
                    setMsgError('Введите сообщение');
                    return;
                  }
                  setMsgError(null);
                  sendMessageMutation.mutate();
                }}
                disabled={sendMessageMutation.isPending}
                sx={{ minWidth: 160, fontSize: '13px' }}
              >
                Отправить
              </Button>
            </Box>
            {msgError && <Alert severity="error" sx={{ mt: 1 }}>{msgError}</Alert>}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ClaimForm;
