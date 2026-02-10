"use client";
import { createTask } from "@/actions/tasks";
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

export function AddTodoComponent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Create todo</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fill the form to create a todo User</DialogTitle>
                    <DialogDescription>
                        <CreateTodo />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export function CreateTodo() {
    const [formInp, setFormInp] = useState({
        title: '',
    });
    const [loader, setLoader] = useState(false);


    const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormInp({ ...formInp, [e.target.name]: e.target.value });
    };

    const formSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);


        const createData = await createTask(formInp);
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
    };

    return (
        <form className="form-class" onSubmit={formSubmitHandle}>

            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="title">title</FieldLabel>
                    <Input
                        onChange={inputHandle}
                        type="text" name="title"
                        placeholder="title"
                        required
                    />
                </Field>
                <Field>
                     <Button type="submit" disabled={loader}>
                {loader ? "Creating..." : "Create TODO"}
            </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}