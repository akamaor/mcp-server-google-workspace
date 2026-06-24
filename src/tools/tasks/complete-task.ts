import { GoogleApiService } from '../../services/google-api.service.js';

export interface CompleteTaskArgs {
  taskId: string;
  taskListId?: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  completed?: string;
  updated: string;
}

export async function completeTask(
  googleApi: GoogleApiService,
  args: CompleteTaskArgs
): Promise<Task> {
  const tasks = await googleApi.getTasksClient();

  const taskListId = args.taskListId || '@default';

  const response = await tasks.tasks.patch({
    tasklist: taskListId,
    task: args.taskId,
    requestBody: {
      status: 'completed',
      completed: new Date().toISOString(),
    },
  });

  const task = response.data;

  return {
  id: task.id || '',
  title: task.title || '',
  status: task.status || 'completed',
  completed: task.completed ?? undefined,
  updated: task.updated || '',
  };
}
