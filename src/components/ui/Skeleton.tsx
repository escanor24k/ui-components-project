interface SkeletonProps {
	className?: string
}

export function Skeleton({ className = "" }: SkeletonProps): React.ReactElement {
	return (
		<div
			className={`animate-pulse rounded-lg bg-linear-to-r from-white/30 via-white/50 to-white/30 shadow-sm shadow-slate-800/5 dark:from-white/5 dark:via-white/10 dark:to-white/5 dark:shadow-none ${className}`}
			aria-hidden="true"
		/>
	)
}
