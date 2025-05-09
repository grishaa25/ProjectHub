import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-12 w-48">
        <span className="text-xl font-bold text-white">ProjectHub</span>
      </div>
    </Link>
  )
}
