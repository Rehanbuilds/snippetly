import Image from "next/image"
import Link from "next/link"

interface SnippetlyLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

export function SnippetlyLogo({ size = "md", showText = true, href, className = "" }: SnippetlyLogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-lg",
    lg: "text-2xl",
  }

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/images/snippetly-logo.png"
        alt="Snippetly Logo"
        width={32}
        height={32}
        className={`${sizeClasses[size]} mr-2`}
      />
      {showText && <span className={`${textSizeClasses[size]} font-bold`}>Snippetly</span>}
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
