import Link from "next/link";

export default function Login() {
    return (
        <main className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-12">
            <header>
                <h1 className="text-3xl font-semibold">Sign in</h1>
                <p className="text-sm text-gray-600">Use your email or phone number and password.</p>
            </header>

            <form className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Email or phone</span>
                    <input
                        type="text"
                        name="identifier"
                        required
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                        placeholder="you@example.com or 9876543210"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Password</span>
                    <input
                        type="password"
                        name="password"
                        required
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                        placeholder="••••••••"
                    />
                </label>

                <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                    Sign in
                </button>
            </form>

            <p className="text-sm text-gray-700">
                New here?{" "}
                <Link href="/auth/register" className="font-semibold text-green-700 hover:underline">
                    Create an account
                </Link>
            </p>
        </main>
    );
}