import Link from "next/link"
export default function LoginButton() {
    return (
        <div>
            <Link href="/auth/register" className="text-2xl font-semibold">
                <span className="inline-block bg-green-600 px-6 py-3 text-white text-lg font-semibold rounded-md hover:bg-green-700 transition-colors">
                    Login
                </span>
            </Link>
        </div>
    );
}