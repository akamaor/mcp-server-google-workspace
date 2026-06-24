import { GoogleApiService } from '../../services/google-api.service.js';

export interface ListTaskListsArgs {
  maxResults?: number;
}

export interface TaskList {
  id: string;
  title: string;
  updated: string;
}

export async function listTaskLists(
  googleApi: GoogleApiService,
  args: ListTaskListsArgs
): Promise<TaskList[]> {
  const tasks = await googleApi.getTasksClient();

  const response = await tasks.tasklists.list({
    maxResults: args.maxResults || 100,
  });

  const taskLists = response.data.items || [];

  return taskLists.map((list: any) => ({
    id: list.id || '',
    title: list.title || '',
    updated: list.updated || '',
  }));
}
