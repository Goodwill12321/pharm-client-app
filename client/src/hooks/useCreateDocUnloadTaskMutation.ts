import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocUnloadTask, CreateDocUnloadTaskRequest } from '../api/docUnloadTasks';

export function useCreateDocUnloadTaskMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateDocUnloadTaskRequest) => createDocUnloadTask(req),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['docUnloadTaskSummary'] });
      qc.invalidateQueries({ queryKey: ['docUnloadHistory', variables.docUid] });
      qc.invalidateQueries({ queryKey: ['docUnloadTaskGlobalSummary'] });
      qc.invalidateQueries({ queryKey: ['docUnloadTasksView'] });
    },
  });
}
