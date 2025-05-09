import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoginSchema, type LoginSchemaType } from '@/features/auth/schemas/login-schema'
import { Input } from '@/components/ui/input'

import { Loader2 } from 'lucide-react'
import { useLogin } from '@/features/auth/hook/useLogin'



export const Route = createFileRoute('/(public)/_public/login')({
  component: LoginPage,
})

function LoginPage() {
  
  const {mutate: login, isPending} = useLogin();
  
    const form = useForm<LoginSchemaType>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        username: "",
        email:"",
        password:"",
      },
    });
    function onSubmit(values: LoginSchemaType) {
      login(values,);
      
    }
  
  
    return (
      <>
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="fixed inset-0 z-0 bg-cover bg-center opacity-100" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}>
        </div>
        
        <Card className="w-full max-w-md z-10 bg-gray-900 shadow-xl border-0 opacity-90" >
          <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <svg className="h-20 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2C16 4.5 20 4.5 22 6C20 8 16 8 12 5.5C8 8 4 8 2 6C4 4.5 8 4.5 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C16 19.5 20 19.5 22 18C20 16 16 16 12 18.5C8 16 4 16 2 18C4 19.5 8 19.5 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12C19.5 16 19.5 20 18 22C16 20 16 16 18.5 12C16 8 16 4 18 2C19.5 4 19.5 8 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12C4.5 8 4.5 4 6 2C8 4 8 8 5.5 12C8 16 8 20 6 22C4.5 20 4.5 16 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V18.5M12 5.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M22 12H18.5M5.5 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
            <h1 className="text-3xl text-white font-bold text-center mb-6">Fantasy NFL</h1>
            <h1 className="text-2xl text-white font-bold text-center mb-6">Login</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2  text-white">
                      <FormLabel className="text-xl">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                          className="bg-card border border-gray-700 bg-black focus:ring-primary text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2 text-white">
                      <FormLabel className="text-xl">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email address" 
                          {...field} 
                          className="bg-card border bg-black text-white border-gray-700 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2 text-white">
                      <FormLabel className="text-xl">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                          className="bg-card border bg-black text-white border-gray-700 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br/>
                <Button 
                  type="submit" 
                  className="w-full bg-primary bg-green-400 hover:bg-primary/10 text-black  text-base"
                  disabled={isPending}
                >
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Login...</>
                  ) : "Login"}
                </Button>
              </form>
            </Form>
            
            <p className="text-center mt-6 text-sm text-gray-100">
              Don't have an account Create here{' '}
              <Link to="/register" className="text-blue-400 hover:underline">
                Register Here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  
    )
}


