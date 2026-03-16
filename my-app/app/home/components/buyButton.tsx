import Link from "next/link"
export default function BuyButton() {
    return (
        <div>
            <Link href="/user/register" className="text-2xl font-semibold">
                <span className="inline-block bg-purple-600 px-6 py-3 text-white text-lg font-semibold rounded-md hover:bg-purple-700 transition-colors">
                    Buy Pass
                </span>
            </Link>
        </div>
    );
}