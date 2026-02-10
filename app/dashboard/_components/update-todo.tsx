"use client";
import { createTask, updateTaskStatus } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Task } from "@/lib/generated/prisma/client";
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"


export function UpdateTodoComponent({ data }: { data: Task }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Update Todo</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fill the form to update a Todo</DialogTitle>
                    <DialogDescription>
                        <Updateodo data={data} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export function Updateodo({ data }: { data: Task }) {
    const [formInp, setFormInp] = useState({
        title: "",
        status: "",
    });

    const [loader, setLoader] = useState(false);

    const selectHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormInp({ ...formInp, status: e.target.value });
    };

    const formSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);

        if (!formInp.status) {
            console.error("Status is required");
            setLoader(false);
            return;
        }

        const updatedTask = {
            ...data, // 👈 prop data
            status: formInp.status,
        };



        const createData = await updateTaskStatus(updatedTask as Task);
        console.log(createData)
        if (!createData.success) {
            toast.error(createData.message);
        } else {
            toast.success(createData.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        setLoader(false);

        console.log(updatedTask);

        setLoader(false);
    };

    return (
        <form className="form-class" onSubmit={formSubmitHandle}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>

                    <NativeSelect
                        name="status"
                        value={formInp.status}
                        onChange={selectHandle}
                    >
                        <NativeSelectOption value="">
                            Select status
                        </NativeSelectOption>

                        <NativeSelectOption value="TODO">
                            Todo
                        </NativeSelectOption>

                        <NativeSelectOption value="IN_PROGRESS">
                            In Progress
                        </NativeSelectOption>

                        <NativeSelectOption value="DONE">
                            Done
                        </NativeSelectOption>
                    </NativeSelect>
                </Field>

                <Field>
                    <Button type="submit" disabled={loader}>
                        {loader ? "updating..." : "Update TODO"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}