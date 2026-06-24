import { GoogleApiService } from '../../services/google-api.service.js';

export interface UpdateTaskArgs {
  taskId: string;
  taskListId?: string;
  title?: string;
  notes?: string;
  due?: string;
  status?: 'needsAction' | 'completed';
}

export interface Task {
  id: string;
  title: string;
  status: string;
  due?: string;
  notes?: string;
  updated: string;
}

export async function updateTask(
  googleApi: GoogleApiService,
  args: UpdateTaskArgs
): Promise<Task> {
  const tasks = await googleApi.getTasksClient();

  const taskListId = args.taskListId || '@default';

  const taskBody: any = {};

  if (args.title !== undefined) taskBody.title = args.title;
  if (args.notes !== undefined) taskBody.notes = args.notes;
  if (args.status !== undefined) taskBody.status = args.status;
  if (args.due !== undefined) {
    taskBody.due = new Date(args.due).toISOString();
  }

  const response = await tasks.tasks.patch({
    tasklist: taskListId,
    task: args.taskId,
    requestBody: taskBody,
  });

  const task = response.data;

  return {
    id: task.id || '',
    title: task.title || '',
    status: task.status || 'needsAction',
    due: task.due ?? undefined,
    notes: task.notes ?? undefined,
    updated: task.updated || '',
  };
}
