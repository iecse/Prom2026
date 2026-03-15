import Link from "next/link";

export default function Register() {
    return (
        <main className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-12">
            <header>
                <h1 className="text-3xl font-semibold">Create an account</h1>
                <p className="text-sm text-gray-600">Enter your details to sign up.</p>
            </header>

            <form className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Full name</span>
                    <input
                        type="text"
                        name="name"
                        required
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                        placeholder="IECSE"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Registration number</span>
                    <input
                        type="text"
                        name="regNo"
                        required
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                        placeholder="230905001"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Email</span>
                    <input
                        type="email"
                        name="email"
                        required
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                        placeholder="you@example.com"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Phone number</span>
                    <input
                        type="tel"
                        name="phone"
                        required
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                        placeholder="9876543210"
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

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Confirm Password</span>
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
                    Submit
                </button>
            </form>

            <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link href="/user/login" className="font-semibold text-green-700 hover:underline">
                    Sign in
                </Link>
            </p>
        </main>
    );
}