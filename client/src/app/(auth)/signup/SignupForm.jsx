"use client";

import { useState } from "react";
import {
    Card,
    Button,
    Link,
    TextField,
    Label,
    InputGroup,
    Input,
} from "@heroui/react";
import { Description, Radio, RadioGroup } from "@heroui/react";

import {
    Eye,
    EyeSlash,
    Person,
    At,
    ShieldKeyhole,
} from "@gravity-ui/icons";

import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignupForm({ redirectTo = "/" }) {
    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("seeker");

    // UI States
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);

        const plan =
            role === "seeker"
                ? "seeker_free"
                : "recruiter_free";

        try {
            const { error: authError } = await signUp.email({
                email,
                password,
                name,
                role,
                plan,
            });

            if (authError) {
                setError(
                    authError.message ||
                    "Something went wrong during signup."
                );
                return;
            }

            setSuccess("Account created successfully!");

            setName("");
            setEmail("");
            setPassword("");

            router.push(redirectTo);
        } catch (err) {
            console.error(err);
            setError("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <Card className="w-full max-w-md p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                {/* Header */}
                <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Create an account
                    </h1>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Fill in the fields below to get started
                    </p>
                </div>

                <form
                    onSubmit={handleSignup}
                    className="flex flex-col gap-5"
                >
                    {/* Name */}
                    <TextField
                        isRequired
                        name="name"
                        className="flex flex-col gap-1.5"
                    >
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Name
                        </Label>

                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                            <Person
                                className="text-zinc-400 pointer-events-none"
                                size={16}
                            />

                            <Input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Email */}
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        className="flex flex-col gap-1.5"
                    >
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email Address
                        </Label>

                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                            <At
                                className="text-zinc-400 pointer-events-none"
                                size={16}
                            />

                            <Input
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Password */}
                    <TextField
                        isRequired
                        name="password"
                        className="flex flex-col gap-1.5"
                    >
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </Label>

                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-primary transition-colors">
                            <ShieldKeyhole
                                className="text-zinc-400 pointer-events-none"
                                size={16}
                            />

                            <Input
                                type={isVisible ? "text" : "password"}
                                placeholder="Choose a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />

                            <button
                                type="button"
                                onClick={toggleVisibility}
                                className="focus:outline-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                aria-label="toggle password visibility"
                            >
                                {isVisible ? (
                                    <EyeSlash size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </InputGroup>
                    </TextField>

                    {/* Role */}
                    <div className="flex flex-col gap-4">
                        <Label>Subscription plan</Label>

                        <RadioGroup
                            name="role"
                            value={role}
                            onChange={setRole}
                            orientation="horizontal"
                        >
                            <Radio value="seeker">
                                <Radio.Control>
                                    <Radio.Indicator />
                                </Radio.Control>

                                <Radio.Content>
                                    <Label>Job Seeker</Label>
                                </Radio.Content>
                            </Radio>

                            <Radio value="recruiter">
                                <Radio.Control>
                                    <Radio.Indicator />
                                </Radio.Control>

                                <Radio.Content>
                                    <Label>Recruiter</Label>
                                </Radio.Content>
                            </Radio>
                        </RadioGroup>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                            <span className="font-semibold">
                                Error:
                            </span>{" "}
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                            <span className="font-semibold">
                                Success:
                            </span>{" "}
                            {success}
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        color="primary"
                        className="w-full h-12 rounded-xl font-semibold text-sm"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                    >
                        Sign Up
                    </Button>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            href={`/signin?redirect=${encodeURIComponent(
                                redirectTo
                            )}`}
                            className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer"
                        >
                            Sign in instead
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}