interface SkeletonProps {
	className?: string
}

export function Skeleton({ className = "" }: SkeletonProps): React.ReactElement {
	return (
		<div
			className={`animate-pulse rounded-lg bg-linear-to-r from-glass/30 via-glass/50 to-glass/30 shadow-sm shadow-neutral-800/5 dark:from-glass/5 dark:via-glass/10 dark:to-glass/5 dark:shadow-none ${className}`}
			aria-hidden="true"
		/>
	)
}
