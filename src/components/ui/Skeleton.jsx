import { motion } from 'framer-motion'
import { useColors } from '../../hooks/useColors'
import clsx from 'clsx'

export default function Skeleton({ className, variant = 'default', ...props }) {
  const colors = useColors()
  
  const baseClasses = "rounded"
  
  const variants = {
    default: clsx(baseClasses, colors.bgSecondary),
    avatar: clsx(baseClasses, colors.bgSecondary),
    text: clsx(baseClasses, "h-4", colors.bgSecondary),
    card: clsx(baseClasses, colors.bgSecondary),
  }
  
  return (
    <motion.div
      className={clsx(variants[variant] || variants.default, className)}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.01, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 0
      }}
      {...props}
    />
  )
}

// Avatar Skeleton - نفس مقاس Avatar الحقيقي (w-8 h-8)
export function AvatarSkeleton({ className }) {
  const colors = useColors()
  return (
    <motion.div
      className={clsx(
        "w-8 h-8 rounded-full border",
        colors.bgSecondary,
        colors.border,
        className
      )}
      animate={{
        opacity: [0.5, 1, 0.5],
        scale: [1, 1.03, 1],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 0
      }}
    />
  )
}

// Button Skeleton - نفس مقاس Button الحقيقي
export function ButtonSkeleton({ className }) {
  const colors = useColors()
  return (
    <motion.div
      className={clsx(
        "h-9 w-24 rounded-lg",
        colors.bgSecondary,
        className
      )}
      animate={{
        opacity: [0.5, 0.9, 0.5],
        scaleX: [1, 1.02, 1],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 0
      }}
    />
  )
}

// Card Skeleton
export function CardSkeleton({ className }) {
  const colors = useColors()
  return (
    <motion.div
      className={clsx(
        "rounded-2xl border p-6",
        colors.bgCard,
        colors.border,
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </motion.div>
  )
}
