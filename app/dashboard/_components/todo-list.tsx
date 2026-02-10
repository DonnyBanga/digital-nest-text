import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Task } from "@/lib/generated/prisma/client"
import { UpdateTodoComponent } from "./update-todo"


export default function TodoList({data}: {data: Task[]}) {
    return (
        <div className="flex w-full max-w-md flex-col gap-6">
            {data.map((item) => (
                <ItemDemo key={item.id} data={item} />
            ))}
        </div>
    )
}


export function ItemDemo({data}: {data: Task}) {
    return (    

        <Item variant="outline">
            <ItemContent>
                <ItemTitle>{data.title}</ItemTitle>
                <ItemDescription>
                    Status: {data.status}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <UpdateTodoComponent data={data} />
            </ItemActions>
        </Item>

    )
}
