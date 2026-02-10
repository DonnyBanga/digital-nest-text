import { getTasks } from "@/actions/tasks";
import { AddTodoComponent } from "./_components/add-todo";
import TodoList from "./_components/todo-list";
import { Task } from "@/lib/generated/prisma/client";



export default async function DashboardPage() {

  const dataTodo: Task[] = await getTasks()
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            This is the dashboard page. You can add your content here.
          </p>
        </div>

        <AddTodoComponent />
      </div>


      <div className="todo-list">
        <h2 className="text-xl font-semibold">Todo List</h2>
        {dataTodo.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <TodoList data={dataTodo} />
        )}
      </div>
    </div>
  )
}
