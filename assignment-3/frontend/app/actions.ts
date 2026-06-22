export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${process.env.FASTAPI_URL}/todos`, {
    next: { tags: ["todos-list"] },
  });

  if (!res.ok) {
    throw new Error("할 일 목록을 불러오는 데 실패했습니다");
  }

  return res.json();
}

export async function getTodoById(id: string): Promise<Todo | null> {
  const res = await fetch(`${process.env.FASTAPI_URL}/todos/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("할 일을 불러오는 데 실패했습니다");
  return res.json();
}
