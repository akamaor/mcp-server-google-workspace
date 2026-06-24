import { GoogleApiService } from '../../services/google-api.service.js';

export interface ListTasksArgs {
  taskListId?: string;
  maxResults?: number;
  showCompleted?: boolean;
  showHidden?: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  due?: string;
  notes?: string;
  completed?: string;
  updated: string;
  taskListId: string;
}

export async function listTasks(
  googleApi: GoogleApiService,
  args: ListTasksArgs
): Promise<Task[]> {
  const tasks = await googleApi.getTasksClient();

  const taskListId = args.taskListId || '@default';

  const response = await tasks.tasks.list({
    tasklist: taskListId,
    maxResults: args.maxResults || 100,
    showCompleted: args.showCompleted ?? true,
    showHidden: args.showHidden ?? false,
  });

  const taskItems = response.data.items || [];

  return taskItems.map((task: any) => ({
    id: task.id || '',
    title: task.title || '',
    status: task.status || 'needsAction',
    due: task.due ?? undefined,
    notes: task.notes ?? undefined,
    completed: task.completed ?? undefined,
    updated: task.updated || '',
    taskListId,
  }));
}
