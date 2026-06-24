import { GoogleApiService } from '../../services/google-api.service.js';

export interface CreateTaskArgs {
  title: string;
  notes?: string;
  due?: string; // RFC 3339 timestamp, e.g. "2025-12-31T00:00:00.000Z"
  taskListId?: string;
  parent?: string; // Parent task ID for subtasks
}

export interface Task {
  id: string;
  title: string;
  status: string;
  due?: string;
  notes?: string;
  updated: string;
  taskListId: string;
}

export async function createTask(
  googleApi: GoogleApiService,
  args: CreateTaskArgs
): Promise<Task> {
  const tasks = await googleApi.getTasksClient();

  const taskListId = args.taskListId || '@default';

  const taskBody: any = {
    title: args.title,
    status: 'needsAction',
  };

  if (args.notes) {
    taskBody.notes = args.notes;
  }

  if (args.due) {
    // Google Tasks API requires RFC 3339 format with time component
    const dueDate = new Date(args.due);
    taskBody.due = dueDate.toISOString();
  }

  const insertParams: any = {
    tasklist: taskListId,
    requestBody: taskBody,
  };

  if (args.parent) {
    insertParams.parent = args.parent;
  }

  const response = await tasks.tasks.insert(insertParams);

  const task = response.data;

  return {
    id: task.id || '',
    title: task.title || '',
    status: task.status || 'needsAction',
    due: task.due ?? undefined,
    notes: task.notes ?? undefined,
    updated: task.updated || '',
    taskListId,
  };
}
