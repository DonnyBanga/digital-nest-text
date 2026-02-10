"use client";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { toast } from "sonner";


export function LoginForm() {

  const [formInp, setFormInp] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInp({ ...formInp, [e.target.name]: e.target.value });
  };

  const formSubmitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const signupData = await login(formInp)



      if (!signupData.success) {
        toast.error(signupData.message)
      } else {
        toast.success(signupData.message)
        window.location.href = '/dashboard' 
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className={"flex flex-col gap-6"} >
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formSubmitHandle}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email" onChange={inputHandle}
                  type="email" name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" required onChange={inputHandle} />
              </Field>
              <Field>
                <Button type="submit">{isLoading ? "logging in..." : "Login"}</Button>
                <FieldDescription className="text-center">
                 dont have an account? <a href="/signin">signin</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
