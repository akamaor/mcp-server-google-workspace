import { GoogleApiService } from '../../services/google-api.service.js';

export interface DeleteTaskArgs {
  taskId: string;
  taskListId?: string;
}

export async function deleteTask(
  googleApi: GoogleApiService,
  args: DeleteTaskArgs
): Promise<{ success: boolean; taskId: string }> {
  const tasks = await googleApi.getTasksClient();

  const taskListId = args.taskListId || '@default';

  await tasks.tasks.delete({
    tasklist: taskListId,
    task: args.taskId,
  });

  return {
    success: true,
    taskId: args.taskId,
  };
}
