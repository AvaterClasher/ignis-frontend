'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function SignUpPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                      Welcome! Please fill in the details to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <div className="grid grid-cols-2 gap-x-4">
                      <Clerk.Connection asChild name="github">
                        <Button
                          disabled={isGlobalLoading}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Clerk.Loading scope="provider:github">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.gitHub className="mr-2 size-4" />
                                  GitHub
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                      <Clerk.Connection asChild name="google">
                        <Button
                          disabled={isGlobalLoading}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Clerk.Loading scope="provider:google">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.google className="mr-2 size-4" />
                                  Google
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className="flex items-center gap-x-3 text-muted-foreground text-sm before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      or
                    </p>
                    <Clerk.Field className="space-y-2" name="emailAddress">
                      <Clerk.Label asChild>
                        <Label>Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input asChild required type="email">
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-destructive text-sm" />
                    </Clerk.Field>
                    <Clerk.Field className="space-y-2" name="password">
                      <Clerk.Label asChild>
                        <Label>Password</Label>
                      </Clerk.Label>
                      <Clerk.Input asChild required type="password">
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-destructive text-sm" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Captcha className="empty:hidden" />
                      <SignUp.Action asChild submit>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                'Continue'
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                      <Button asChild size="sm" variant="link">
                        <Clerk.Link navigate="sign-in">
                          Already have an account? Sign in
                        </Clerk.Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name="continue">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Continue registration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Clerk.Field className="space-y-2" name="username">
                      <Clerk.Label>
                        <Label>Username</Label>
                      </Clerk.Label>
                      <Clerk.Input asChild required type="text">
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-destructive text-sm" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Action asChild submit>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                'Continue'
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Verify your email</CardTitle>
                      <CardDescription>
                        Use the verification link sent to your email address
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <div className="grid items-center justify-center gap-y-2">
                        <Clerk.Field className="space-y-2" name="code">
                          <Clerk.Label className="sr-only">
                            Email address
                          </Clerk.Label>
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              autoSubmit
                              className="flex justify-center has-[:disabled]:opacity-50"
                              render={({ value, status }) => {
                                return (
                                  <div
                                    className={cn(
                                      'relative flex size-10 items-center justify-center border-input border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
                                      {
                                        'z-10 ring-2 ring-ring ring-offset-background':
                                          status === 'cursor' ||
                                          status === 'selected',
                                      }
                                    )}
                                    data-status={status}
                                  >
                                    {value}
                                    {status === 'cursor' && (
                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                        <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                                      </div>
                                    )}
                                  </div>
                                );
                              }}
                              type="otp"
                            />
                          </div>
                          <Clerk.FieldError className="block text-center text-destructive text-sm" />
                        </Clerk.Field>
                        <SignUp.Action
                          asChild
                          className="text-muted-foreground"
                          fallback={({ resendableAfter }) => (
                            <Button disabled size="sm" variant="link">
                              Didn&apos;t receive a code? Resend (
                              <span className="tabular-nums">
                                {resendableAfter}
                              </span>
                              )
                            </Button>
                          )}
                          resend
                        >
                          <Button size="sm" type="button" variant="link">
                            Didn&apos;t receive a code? Resend
                          </Button>
                        </SignUp.Action>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action asChild submit>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  'Continue'
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignUp.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Strategy>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  );
}
